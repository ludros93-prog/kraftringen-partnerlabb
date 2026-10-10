(() => {
  'use strict';
  const snapshots = new WeakMap();
  const allowedAudiences = ['business', 'consumer'];
  const labels = { business: 'Företag (B2B)', consumer: 'Konsument (B2C)', both: 'Företag & konsument' };
  const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
  const cleanName = value => typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
  const nameKey = value => cleanName(value).normalize('NFKC').toLocaleLowerCase('sv-SE');
  const cleanAudiences = value => Array.isArray(value) ? allowedAudiences.filter(item => value.includes(item)) : [];
  const isSales = partner => partner && ['sales', 'field'].includes(partner.type);
  const audienceChoice = audiences => audiences.length === 2 ? 'both' : audiences[0] || 'business';
  const choiceAudiences = choice => choice === 'both' ? [...allowedAudiences] : allowedAudiences.includes(choice) ? [choice] : [];

  function originalPartners(registry) {
    if (!snapshots.has(registry)) snapshots.set(registry, registry.map(partner => ({ ...partner, salesAudiences: isSales(partner) ? cleanAudiences(partner.salesAudiences?.length ? partner.salesAudiences : [partner.audience]) : [] })));
    return snapshots.get(registry);
  }

  function normalizeProfiles(raw, registry) {
    const profiles = {};
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return profiles;
    const originals = originalPartners(registry);
    const base = new Map(originals.map(partner => [partner.id, partner]));
    for (const [id, value] of Object.entries(raw)) {
      if (!/^[a-z][a-z0-9_-]{1,80}$/.test(id) || ['constructor', 'prototype', '__proto__'].includes(id)) continue;
      if (!value || typeof value !== 'object' || Array.isArray(value)) continue;
      const existing = base.get(id);
      if (existing && !isSales(existing)) continue;
      const name = cleanName(value.name);
      const salesAudiences = cleanAudiences(value.salesAudiences);
      const type = existing?.type || value.type;
      if (!name || name.length > 90 || !salesAudiences.length || !['sales', 'field'].includes(type)) continue;
      profiles[id] = { id, name, type, salesAudiences };
    }
    // Resolve names from the complete saved set. Object insertion order must not
    // decide whether a renamed original partner frees its former name.
    let changed;
    do {
      changed = false;
      const names = new Map();
      const effective = originals.map(partner => ({ id: partner.id, name: profiles[partner.id]?.name || partner.name }));
      effective.push(...Object.values(profiles).filter(profile => !base.has(profile.id)));
      for (const partner of effective) {
        const key = nameKey(partner.name);
        if (!names.has(key)) names.set(key, []);
        names.get(key).push(partner.id);
      }
      for (const ids of names.values()) {
        if (ids.length < 2) continue;
        for (const id of ids) {
          if (own(profiles, id)) { delete profiles[id]; changed = true; }
        }
      }
    } while (changed);
    return profiles;
  }

  function configuredPartner(base, profile) {
    const salesAudiences = profile ? [...profile.salesAudiences] : [...(base.salesAudiences || [])];
    if (!isSales(profile || base)) return { ...base };
    const audience = salesAudiences.length === 2 ? 'mixed' : salesAudiences[0];
    const typeLabel = audience === 'mixed' ? 'Företags- & konsumentförsäljning' : audience === 'consumer' ? 'Konsumentförsäljning' : 'Företagsförsäljning';
    const segmentText = audience === 'mixed' ? 'företagskunder och konsumenter' : audience === 'consumer' ? 'konsumenter' : 'företagskunder';
    return {
      ...base,
      ...(profile || {}),
      audience,
      salesAudiences,
      typeLabel,
      description: profile ? `Säljpartner för elhandelsavtal till ${segmentText}.${base.id === 'vast' ? ' Face2face arbetar i Beest; portalen följer resultaten internt.' : ''}` : base.description,
      ...(profile && !base.name ? { description: `Säljpartner för elhandelsavtal till ${segmentText}. Försäljningsunderlag saknas.` } : {})
    };
  }

  function apply(registry, partners, rawProfiles) {
    const originals = originalPartners(registry);
    const profiles = normalizeProfiles(rawProfiles, registry);
    const next = originals.map(partner => configuredPartner(partner, profiles[partner.id]));
    for (const [id, profile] of Object.entries(profiles)) {
      if (!originals.some(partner => partner.id === id)) next.push(configuredPartner({ id, type: profile.type }, profile));
    }
    registry.splice(0, registry.length, ...next);
    for (const id of Object.keys(partners)) delete partners[id];
    for (const partner of next) partners[partner.id] = partner.name;
    return profiles;
  }

  function hydrate(rawProfiles, registry, partners) {
    return apply(registry, partners, rawProfiles);
  }

  function init(P) {
    if (P.partnerSetup) return P.partnerSetup;
    const e = P.escape || P.e;
    const getPartner = id => P.getPartner(id);
    const sync = () => typeof P.syncPartnerRegistry === 'function' ? P.syncPartnerRegistry() : apply(P.partnerRegistry, P.partners, P.state.partnerProfiles);

    function validateProfile(payload, id) {
      if (P.role !== 'internal') return { ok: false, error: 'Partnerinställningar ändras i Kraftringens interna vy.' };
      const existing = id ? getPartner(id) : null;
      if (id && !isSales(existing)) return { ok: false, error: 'Öppna en säljpartner för att ändra kundsegment.' };
      const name = cleanName(payload?.name);
      if (!name || name.length > 90) return { ok: false, field: 'name', error: 'Ange ett partnernamn med högst 90 tecken.' };
      if (P.partnerRegistry.some(partner => partner.id !== id && nameKey(partner.name) === nameKey(name))) return { ok: false, field: 'name', error: 'Det finns redan en partner med det namnet.' };
      const salesAudiences = cleanAudiences(payload?.salesAudiences);
      if (!salesAudiences.length) return { ok: false, field: 'salesAudience', error: 'Välj vilka kunder partnern säljer till.' };
      return { ok: true, profile: { name, type: existing?.type || 'sales', salesAudiences } };
    }

    function saveProfile(payload, id) {
      const result = validateProfile(payload, id);
      if (!result.ok) return result;
      const profileId = id || `partner-${crypto.randomUUID()}`;
      const previous = P.state.partnerProfiles;
      const hadProfiles = own(P.state, 'partnerProfiles');
      P.state.partnerProfiles = { ...(previous || {}), [profileId]: { id: profileId, ...result.profile } };
      let saved = false;
      try { saved = P.save() === true; } catch { saved = false; }
      if (!saved) {
        if (hadProfiles) P.state.partnerProfiles = previous;
        else delete P.state.partnerProfiles;
        return { ok: false, error: 'Partnern kunde inte sparas. Dina tidigare uppgifter har behållits. Försök igen.' };
      }
      sync();
      return { ok: true, id: profileId, created: !id };
    }

    function open(id) {
      if (P.role !== 'internal') return;
      const existing = id ? getPartner(id) : null;
      if (id && !isSales(existing)) return;
      const selected = audienceChoice(cleanAudiences(existing?.salesAudiences?.length ? existing.salesAudiences : [existing?.audience]));
      P.openDialog(existing ? 'Partnerinställningar' : 'Ny säljpartner', `
        <form id="partner-setup-form" class="partner-setup-form">
          <p class="partner-setup-intro">${existing ? 'Välj vilka kunder partnern säljer till.' : 'Lägg till en partner och välj vilka kunder den säljer till.'}</p>
          <label class="field" for="partner-setup-name">Partnernamn <span aria-hidden="true">*</span>
            <input id="partner-setup-name" name="name" required maxlength="90" autocomplete="organization" value="${e(existing?.name || '')}" placeholder="Exempelpartner AB">
          </label>
          <fieldset class="partner-setup-segments">
            <legend>Kundsegment</legend>
            ${[
              ['business', 'Företag (B2B)', 'Företagsavtal och portföljprodukter.', 'briefcase'],
              ['consumer', 'Konsument (B2C)', 'Fastpris, Vintersäkrat, Opti, Kvartspris och Rörligt pris.', 'user'],
              ['both', 'Båda', 'Samma partner kan sälja till både företag och konsumenter.', 'users']
            ].map(([value, title, text, icon]) => `<label class="partner-setup-choice"><input type="radio" name="salesAudience" value="${value}" ${selected === value ? 'checked' : ''} required><span class="partner-setup-choice-icon">${P.icon(icon)}</span><span><strong>${title}</strong><small>${text}</small></span><span class="partner-setup-choice-check" aria-hidden="true">${P.icon('check')}</span></label>`).join('')}
          </fieldset>
          <p class="partner-setup-note">${existing ? 'Sparade kunduppgifter och avtal behålls. Kundsegmentet styr vilka avtalsalternativ som kan väljas.' : 'Uppföljning och Insikter samlas under partnern. Försäljningsresultat visas när det finns underlag.'}</p>
          <p class="partner-setup-error" id="partner-setup-error" role="alert" hidden></p>
          <div class="modal-actions"><button class="btn btn-secondary" id="partner-setup-cancel" type="button">Avbryt</button><button class="btn btn-primary" type="submit">${existing ? 'Spara inställningar' : 'Skapa partner'} ${P.icon('arrow')}</button></div>
          <p class="partner-setup-local">Sparas i denna webbläsare · testmiljö</p>
        </form>`, () => {
        const form = document.querySelector('#partner-setup-form');
        const nameInput = form.elements.namedItem('name');
        const error = document.querySelector('#partner-setup-error');
        nameInput.focus();
        document.querySelector('#partner-setup-cancel').onclick = P.closeDialog;
        form.addEventListener('input', () => { nameInput.setCustomValidity(''); error.hidden = true; });
        form.addEventListener('submit', event => {
          event.preventDefault();
          if (!form.reportValidity()) return;
          const choice = new FormData(form).get('salesAudience');
          const result = saveProfile({ name: nameInput.value, salesAudiences: choiceAudiences(choice) }, id);
          if (!result.ok) {
            error.textContent = result.error;
            error.hidden = false;
            if (result.field === 'name') { nameInput.setCustomValidity(result.error); nameInput.reportValidity(); nameInput.focus(); }
            return;
          }
          P.selectedPartnerId = result.id;
          P.closeDialog();
          P.go('partner-sales');
          P.toast(result.created ? 'Partnern är skapad. Lägg till försäljningsunderlag när det finns.' : 'Partnerinställningarna är sparade.');
        });
      });
    }

    P.partnerSetup = { open, saveProfile, validateProfile, canEdit: id => isSales(getPartner(id)), audienceLabel: audiences => labels[audienceChoice(cleanAudiences(audiences))] };
    return P.partnerSetup;
  }

  window.PartnerSetupRegistry = { hydrate, apply, normalizeProfiles, init };
})();
