(() => {
  'use strict';
  const P = window.Portal;
  if (!P) return;
  const { e, icon } = P;
  const qs = selector => document.querySelector(selector);
  const handoverLabels = { draft: 'Hos partnern', submitted: 'Förmedlat till Kraftringen', handling: 'Kraftringen handlägger', needs_info: 'Komplettering behövs', confirmed: 'Återkoppling klar · demo' };
  const processingLabels = { pending: 'Återstår', handling: 'Pågår · demo', confirmed: 'Handläggning klar · demo' };
  const offerLabels = { undecided: 'Inte valt i testet', chosen: 'Erbjudandet valt · demo', declined: 'Erbjudandet avböjt · demo' };
  let search = '', partnerFilter = 'all', statusFilter = 'all';
  const propertyPartners = () => P.partnerRegistry.filter(partner => partner.type === 'property');
  const now = () => new Date().toISOString();
  const event = (text, visibility = 'shared', actor = P.role === 'internal' ? 'Kraftringen · intern demo' : (P.partners[P.partner] || 'Fastighetspartner') + ' · demo') => ({ at: now(), actor, text, visibility });
  const text = value => typeof value === 'string' ? value.trim() : '';
  const date = value => P.date(value);

  function normalize(row) {
    if (!row || typeof row !== 'object') return;
    if (typeof row.serviceRequested !== 'boolean') row.serviceRequested = false;
    if (typeof row.authorityDemo !== 'boolean') row.authorityDemo = false;
    if (!Object.hasOwn(handoverLabels, row.handoverStatus)) row.handoverStatus = 'draft';
    if (!row.processing || typeof row.processing !== 'object' || Array.isArray(row.processing)) row.processing = {};
    for (const field of ['trade', 'network']) if (!Object.hasOwn(processingLabels, row.processing[field])) row.processing[field] = 'pending';
    if (!Object.hasOwn(offerLabels, row.processing.offerChoice)) row.processing.offerChoice = 'undecided';
    if (!Array.isArray(row.events)) row.events = [];
  }
  function init() {
    if (!Array.isArray(P.state.moveins)) P.state.moveins = [];
    P.state.moveins.forEach(normalize);
    if (!P.state.moveinServiceSeeded) {
      const examples = [
        { id: 'service-demo-001', partner: 'estate1', name: 'Ari Exempel', email: 'ari@inflyttare.example', address: 'Exempelgatan 4', apartment: '1402', postcode: '222 22', city: 'Lund', moveDate: '2026-11-01', handoverStatus: 'submitted', processing: { trade: 'pending', network: 'pending', offerChoice: 'undecided' }, next: 'Ta emot underlaget och stäm av hyresgästens behov', createdAt: '2026-10-07T08:40:00Z', events: [{ at: '2026-10-07T08:40:00Z', actor: 'Exempelfastigheter AB · demo', text: 'Fiktivt serviceunderlag förmedlat till Kraftringen. Tjänsteval och fullmaktssteg är endast testmarkeringar.', visibility: 'shared' }] },
        { id: 'service-demo-002', partner: 'estate1', name: 'Noor Demo', email: 'noor@inflyttare.example', address: 'Demovägen 12', apartment: '1201', postcode: '211 22', city: 'Malmö', moveDate: '2026-11-15', handoverStatus: 'handling', processing: { trade: 'handling', network: 'pending', offerChoice: 'chosen' }, next: 'Följ upp elnätsdelen och återkoppla om nästa steg', createdAt: '2026-10-06T10:00:00Z', events: [{ at: '2026-10-07T09:00:00Z', actor: 'Kraftringen · intern demo', text: 'Exempel på återkoppling: elhandelsdelen handläggs, elnätsdelen återstår. Erbjudandevalet är fiktivt; inget avtal är tecknat.', visibility: 'shared' }, { at: '2026-10-06T10:00:00Z', actor: 'Exempelfastigheter AB · demo', text: 'Fiktivt serviceunderlag förmedlat i test.', visibility: 'shared' }] },
        { id: 'service-demo-003', partner: 'estate2', name: 'Mika Exempel', email: 'mika@inflyttare.example', address: 'Testallén 8', apartment: '1301', postcode: '252 22', city: 'Helsingborg', moveDate: '2026-11-01', handoverStatus: 'needs_info', processing: { trade: 'pending', network: 'pending', offerChoice: 'undecided' }, next: 'Stäm av lägenhetsuppgiften med hyresgästen', createdAt: '2026-10-05T14:00:00Z', events: [{ at: '2026-10-07T07:50:00Z', actor: 'Kraftringen · intern demo', text: 'Exempel på komplettering: kontrollera lägenhetsuppgiften med hyresgästen. Ingen kontakt har tagits i verkligheten.', visibility: 'shared' }] }
      ];
      for (const row of examples) if (!P.state.moveins.some(existing => existing.id === row.id)) P.state.moveins.push({ ...row, phone: '', serviceRequested: true, authorityDemo: true, updatedAt: row.createdAt, owner: 'Demoansvarig A', nextDate: '', demoServiceCase: true });
      P.state.moveinServiceSeeded = true;
    }
  }
  function rows(partnerId) {
    init();
    return P.state.moveins.filter(row => row && P.getPartner(row.partner)?.type === 'property' && (!partnerId || row.partner === partnerId) && (P.role === 'internal' || row.partner === P.partner)).slice().sort((a, b) => String(b.updatedAt || b.createdAt || '').localeCompare(String(a.updatedAt || a.createdAt || '')));
  }
  function statusLabel(row) { return handoverLabels[row?.handoverStatus] || handoverLabels.draft; }
  function canForward(row) {
    return !!row && row.serviceRequested === true && row.authorityDemo === true && ['draft', 'needs_info'].includes(row.handoverStatus || 'draft') && ['name', 'email', 'address', 'moveDate'].every(field => text(row[field])) && /^[^\s@]+@[^\s@]+\.example$/i.test(text(row.email)) && !Number.isNaN(new Date(row.moveDate + 'T12:00:00').getTime());
  }
  function findVisible(id) { return rows().find(row => row.id === id); }
  function forward(id) {
    const row = findVisible(id);
    if (!canForward(row)) { P.toast('Underlaget behöver ett tjänsteval, testmarkering för fullmaktssteget och kompletta exempeluppgifter.'); return false; }
    const supplement = row.handoverStatus === 'needs_info';
    row.handoverStatus = 'submitted'; row.updatedAt = now(); row.submittedAt = row.updatedAt;
    row.events.unshift(event(supplement ? 'Kompletterat serviceunderlag förmedlat på nytt i test. Inget skickas till Kraftringen eller elnätsbolag.' : 'Serviceunderlag förmedlat till Kraftringens demovy. Inget skickas till Kraftringen eller elnätsbolag.'));
    P.save();
    return true;
  }
  function activityFor(partnerId) {
    return rows(partnerId).flatMap(row => row.events.filter(item => item && (P.role === 'internal' || item.visibility === 'shared')).map(item => ({ ...item, id: row.id, name: row.name, company: row.name, partner: row.partner, kind: 'movein' }))).sort((a, b) => String(b.at).localeCompare(String(a.at)));
  }
  const badge = row => `<span class="movein-service-status movein-service-status-${e(row.handoverStatus || 'draft')}">${e(statusLabel(row))}</span>`;
  const note = value => `<p class="movein-service-note">${icon('shield')}<span>${e(value)}</span></p>`;
  function timeline(row) {
    const visible = row.events.filter(item => item && (P.role === 'internal' || item.visibility === 'shared'));
    return visible.length ? `<div class="movein-service-timeline">${visible.map(item => `<article class="${item.visibility === 'internal' ? 'movein-service-private' : ''}"><span>${icon(item.visibility === 'internal' ? 'shield' : 'mail')}</span><div><small>${e(date(item.at))} · ${e(item.actor)}${item.visibility === 'internal' ? ' · Intern anteckning' : ' · Delad återkoppling'}</small><p>${e(item.text)}</p></div></article>`).join('')}</div>` : '<p class="muted">Ingen återkoppling ännu.</p>';
  }
  function detail(row) {
    const internal = P.role === 'internal';
    const controls = internal ? internalForm(row) : partnerForm(row);
    return `<div class="movein-service-detail"><div class="movein-service-detail-head"><div><span class="eyebrow">INFLYTTNINGSSERVICE · EXEMPEL</span><h2>${e(row.name)}</h2><p>${e(P.partners[row.partner])}</p></div>${badge(row)}</div><dl class="movein-service-meta"><div><dt>Bostad</dt><dd>${e(row.address)}${row.apartment ? ', lgh ' + e(row.apartment) : ''}<br>${e(row.postcode)} ${e(row.city)}</dd></div><div><dt>Inflyttning</dt><dd>${e(date(row.moveDate))}</dd></div><div><dt>Kontakt · exempel</dt><dd>${e(row.email)}${row.phone ? '<br>' + e(row.phone) : ''}</dd></div><div><dt>Registrerat</dt><dd>${e(date(row.createdAt))}</dd></div></dl><div class="movein-service-prerequisites"><span>${icon(row.serviceRequested ? 'check' : 'clock')}<strong>Tjänsten</strong>${row.serviceRequested ? 'Vald i test' : 'Inget tjänsteval registrerat'}</span><span>${icon(row.authorityDemo ? 'check' : 'file')}<strong>Fullmaktssteget</strong>${row.authorityDemo ? 'Testmarkerat · ingen giltig fullmakt' : 'Testmarkering saknas'}</span></div>${!row.serviceRequested ? note('Äldre intresseregistrering. Ett tjänsteval eller en fullmakt har inte lagts till i efterhand.') : ''}<section class="movein-service-processing"><h3>Kraftringens handläggning</h3><div class="movein-service-process-grid"><article>${icon('bolt')}<strong>Elhandel</strong><span>${e(processingLabels[row.processing.trade])}</span></article><article>${icon('home')}<strong>Elnät</strong><span>${e(processingLabels[row.processing.network])}</span></article><article>${icon('user')}<strong>Hyresgästens erbjudandeval</strong><span>${e(offerLabels[row.processing.offerChoice])}</span></article></div><p class="movein-service-small">Elhandel och nödvändig elnätshantering följs separat. Handläggning klar betyder ett slutfört teststeg, inget tecknat avtal. Hyresgästens erbjudandeval är separat; ett färdighanterat serviceärende är inte automatiskt en elhandelskund.</p></section>${row.next ? `<div class="movein-service-next"><small>NÄSTA STEG${row.nextDate ? ' · ' + e(date(row.nextDate)) : ''}</small><strong>${e(row.next)}</strong></div>` : ''}${controls}<section class="movein-service-feedback"><h3>Återkoppling & aktivitet</h3>${timeline(row)}</section>${note('Alla ändringar sparas lokalt. Testmarkeringar ger ingen giltig fullmakt, inget avtal och inget kommersiellt utfall.')}</div>`;
  }
  function internalForm(row) {
    if (row.handoverStatus === 'draft') return `<div class="movein-service-awaiting"><strong>Underlaget ligger hos partnern</strong><p>Partnern förmedlar ärendet när hyresgästens tjänsteval och testmarkering för fullmaktssteget finns. Handläggningen börjar efter överlämningen.</p></div>`;
    const options = (labels, selected) => Object.entries(labels).map(([value, label]) => `<option value="${value}" ${selected === value ? 'selected' : ''}>${e(label)}</option>`).join('');
    return `<form id="movein-service-internal-form"><h3 class="movein-service-form-head">Handlägg & återkoppla</h3><div class="form-grid"><label class="field">Ärendestatus · testförslag<select name="handoverStatus">${options(handoverLabels, row.handoverStatus).replace('<option value="draft"', '<option disabled value="draft"')}</select></label><label class="field">Intern ansvarig · exempel<select name="owner">${['Ej tilldelad', 'Demoansvarig A', 'Demoansvarig B'].map(value => `<option ${row.owner === value ? 'selected' : ''}>${e(value)}</option>`).join('')}</select></label><label class="field">Elhandel · demostatus<select name="trade">${options(processingLabels, row.processing.trade)}</select></label><label class="field">Elnät · demostatus<select name="network">${options(processingLabels, row.processing.network)}</select></label><label class="field">Hyresgästens erbjudandeval · demo<select name="offerChoice">${options(offerLabels, row.processing.offerChoice)}</select><span class="form-hint">Fiktiv markering. Ett verkligt erbjudandeval behöver avtal och villkor.</span></label><label class="field">Datum för nästa steg<input name="nextDate" type="date" value="${e(row.nextDate)}"></label></div><label class="field">Nästa steg<input name="next" maxlength="200" value="${e(row.next)}" placeholder="Stäm av underlaget och återkoppla"></label><label class="field">Återkoppling som partnern får se<textarea name="feedback" rows="3" maxlength="800" placeholder="Beskriv vad som är omhändertaget eller vad som behöver kompletteras."></textarea></label><label class="field">Intern anteckning<textarea name="privateNote" rows="2" maxlength="800" placeholder="Visas bara i den interna demovyn."></textarea></label><div class="modal-actions"><button class="btn btn-secondary" type="button" id="movein-service-download">${icon('download')} Testsammanfattning</button><button class="btn btn-primary" type="submit">Spara handläggning</button></div></form>`;
  }
  function partnerForm(row) {
    if (!['draft', 'needs_info'].includes(row.handoverStatus)) return `<div class="movein-service-awaiting"><strong>Kraftringen tar över ärendet</strong><p>Följ återkopplingen här. Elhandel, elnätskontakter och bekräftelser hanteras av Kraftringen.</p></div>`;
    if (!canForward(row)) return `<div class="movein-service-awaiting"><strong>Underlaget kan inte förmedlas ännu</strong><p>Hyresgästens tjänsteval, testmarkering för fullmaktssteget och kompletta exempeluppgifter behöver finnas. Äldre intressen räknas inte som ett nytt val av tjänsten.</p></div>`;
    return `<form id="movein-service-forward-form"><h3 class="movein-service-form-head">${row.handoverStatus === 'needs_info' ? 'Komplettera & förmedla igen' : 'Förmedla till Kraftringen'}</h3><label class="field">${row.handoverStatus === 'needs_info' ? 'Vad har kompletterats? *' : 'Meddelande till Kraftringen · valfritt'}<textarea name="partnerReply" rows="3" maxlength="800" ${row.handoverStatus === 'needs_info' ? 'required' : ''} placeholder="Ange en fiktiv komplettering eller fråga."></textarea></label><p class="movein-service-small">Du förmedlar serviceunderlaget. Kraftringen tar sedan över elfrågorna. Fullmaktsmarkeringen gäller bara testet.</p><div class="modal-actions"><button class="btn btn-primary" type="submit">${icon('arrow')} Förmedla testunderlag</button></div></form>`;
  }
  function download(row) {
    const sharedEvents = row.events.filter(item => item?.visibility === 'shared');
    const content = ['TESTSAMMANFATTNING – INGEN BEKRÄFTELSE ELLER GILTIGT AVTAL', '', 'Inflyttningsservice · fiktiva exempeluppgifter', 'Partner: ' + (P.partners[row.partner] || row.partner), 'Inflyttare: ' + row.name, 'Bostad: ' + row.address + (row.apartment ? ', lgh ' + row.apartment : ''), 'Inflyttning: ' + row.moveDate, '', 'Ärendestatus: ' + statusLabel(row), 'Elhandel: ' + processingLabels[row.processing.trade], 'Elnät: ' + processingLabels[row.processing.network], 'Erbjudandeval: ' + offerLabels[row.processing.offerChoice], '', 'Delad återkoppling:', ...sharedEvents.map(item => item.at + ' · ' + item.actor + '\n' + item.text), '', 'Enbart lokal demo. Inget har skickats, tecknats eller ordnats hos Kraftringen eller ett elnätsbolag. Testmarkeringen är ingen fullmakt. Detta dokument har ingen juridisk verkan.'].join('\n');
    P.download('inflyttningsservice-testsammanfattning.txt', content);
  }
  function open(id) {
    const row = findVisible(id);
    if (!row) return;
    P.openDialog('Inflyttningsservice · ' + row.name, detail(row), () => {
      qs('#movein-service-download')?.addEventListener('click', () => download(row));
      const internalFormElement = qs('#movein-service-internal-form');
      if (internalFormElement) internalFormElement.onsubmit = submitEvent => {
        submitEvent.preventDefault();
        if (P.role !== 'internal') return;
        const form = submitEvent.currentTarget;
        const data = new FormData(form);
        const status = data.get('handoverStatus'), trade = data.get('trade'), network = data.get('network'), offerChoice = data.get('offerChoice');
        if (!Object.hasOwn(handoverLabels, status) || status === 'draft' || !Object.hasOwn(processingLabels, trade) || !Object.hasOwn(processingLabels, network) || !Object.hasOwn(offerLabels, offerChoice)) return;
        if (status === 'confirmed' && (trade !== 'confirmed' || network !== 'confirmed')) { P.toast('För att avsluta återkopplingen i testet behöver både elhandel och elnätsdelen ha klar handläggning i demot.'); return; }
        const changed = row.handoverStatus !== status || row.processing.trade !== trade || row.processing.network !== network || row.processing.offerChoice !== offerChoice;
        const feedback = text(data.get('feedback')), privateNote = text(data.get('privateNote'));
        if (status === 'needs_info' && row.handoverStatus !== 'needs_info' && !feedback) { form.elements.feedback.setCustomValidity('Beskriv vilken komplettering partnern behöver göra.'); form.elements.feedback.oninput = () => form.elements.feedback.setCustomValidity(''); form.elements.feedback.reportValidity(); return; }
        row.handoverStatus = status; row.processing = { ...row.processing, trade, network, offerChoice }; row.owner = data.get('owner'); row.next = text(data.get('next')); row.nextDate = data.get('nextDate'); row.updatedAt = now();
        if (changed) row.events.unshift(event('Testhandläggning: ' + statusLabel(row) + '. Elhandel: ' + processingLabels[trade] + '. Elnät: ' + processingLabels[network] + '. Erbjudande: ' + offerLabels[offerChoice] + '. Inget verkligt avtal eller utskick.'));
        if (feedback) row.events.unshift(event(feedback));
        if (privateNote) row.events.unshift(event(privateNote, 'internal'));
        const saved = P.save(); P.closeDialog(); P.render(); P.toast(saved ? 'Handläggning och återkoppling är sparade i denna webbläsare.' : 'Ändringen finns i denna flik; webbläsaren kunde inte spara.');
      };
      const forwardForm = qs('#movein-service-forward-form');
      if (forwardForm) forwardForm.onsubmit = submitEvent => {
        submitEvent.preventDefault();
        if (P.role === 'internal') return;
        const input = submitEvent.currentTarget.elements.partnerReply;
        if (row.handoverStatus === 'needs_info' && !P.validText(input)) return;
        const reply = input.value.trim();
        if (forward(row.id)) {
          if (reply) { row.events.unshift(event('Partnerns komplettering/meddelande: ' + reply)); P.save(); }
          P.closeDialog(); P.render(); P.toast('Testunderlaget är förmedlat till Kraftringens demovy. Inget skickas externt.');
        }
      };
    });
  }
  function filteredRows() { return rows(partnerFilter === 'all' ? undefined : partnerFilter).filter(row => (statusFilter === 'all' || row.handoverStatus === statusFilter) && `${row.name} ${row.email} ${row.address} ${row.city} ${P.partners[row.partner]}`.toLocaleLowerCase('sv-SE').includes(search.toLocaleLowerCase('sv-SE'))); }
  function tableBody() {
    return filteredRows().map(row => `<tr><td><button class="movein-service-person" data-service-case="${e(row.id)}">${icon('user')}<span><strong>${e(row.name)}</strong><small>${e(row.address)}${row.apartment ? ', lgh ' + e(row.apartment) : ''}</small></span></button></td><td><span class="movein-service-cell">${e(P.partners[row.partner])}</span><small>${e(row.city)}</small></td><td>${e(date(row.moveDate))}</td><td>${badge(row)}</td><td><span class="movein-service-cell">Elhandel: ${e(processingLabels[row.processing.trade])}</span><small>Elnät: ${e(processingLabels[row.processing.network])}</small></td><td><button class="btn btn-secondary btn-small" data-service-case="${e(row.id)}">Visa ${icon('arrow')}</button></td></tr>`).join('') || '<tr><td colspan="6"><div class="empty">Inga serviceärenden matchar sökningen.</div></td></tr>';
  }
  function render() {
    if (P.role !== 'internal') return '<div class="empty">Byt till Kraftringens demovy för den interna handläggningen.</div>';
    const all = rows();
    const metrics = [['Nya att ta emot', all.filter(row => row.handoverStatus === 'submitted').length, 'Förmedlade serviceunderlag', 'file'], ['Kraftringen handlägger', all.filter(row => row.handoverStatus === 'handling').length, 'Elhandel och elnät följs separat', 'bolt'], ['Komplettering behövs', all.filter(row => row.handoverStatus === 'needs_info').length, 'Återkoppling till fastighetspartnern', 'mail'], ['Återkoppling klar', all.filter(row => row.handoverStatus === 'confirmed').length, 'Färdigt serviceärende i test', 'check']];
    return `<div class="movein-service-workspace"><div class="page-head"><div><span class="eyebrow">KRAFTRINGEN / INFLYTTNINGSSERVICE</span><h1>Ta hand om inflyttarnas el.</h1><p>Fastighetspartnern förmedlar underlaget. Kraftringen tar över elhandeln, nödvändig elnätshantering och återkoppling.</p></div><span class="pill">Lokala testärenden</span></div><section class="movein-service-hero"><span>${icon('home')}</span><div><h2>Ett tydligt ansvar efter överlämningen.</h2><p>Följ varje hyresgästs serviceärende och håll partnern uppdaterad. Fastighetsbolagets egen elförbrukning är en separat företagsaffär.</p></div></section><div class="movein-service-metrics">${metrics.map(([label, value, sub, name]) => `<article class="card"><span>${icon(name)}</span><div><small>${e(label)}</small><strong>${value}</strong><p>${e(sub)}</p></div></article>`).join('')}</div><section class="card"><div class="section-title"><h2>Serviceärenden</h2><span class="pill" id="movein-service-count">${filteredRows().length} exempel</span></div><div class="movein-service-toolbar"><label class="movein-service-search">${icon('search')}<input id="movein-service-search" type="search" value="${e(search)}" placeholder="Sök inflyttare, adress eller partner" aria-label="Sök serviceärenden"></label><select id="movein-service-partner" aria-label="Filtrera fastighetspartner"><option value="all">Alla fastighetspartners</option>${propertyPartners().map(partner => `<option value="${e(partner.id)}" ${partnerFilter === partner.id ? 'selected' : ''}>${e(partner.name)}</option>`).join('')}</select><select id="movein-service-status" aria-label="Filtrera serviceärendestatus"><option value="all">Alla ärendestatusar</option>${Object.entries(handoverLabels).map(([value, label]) => `<option value="${value}" ${statusFilter === value ? 'selected' : ''}>${e(label)}</option>`).join('')}</select></div><div class="table-wrap"><table class="movein-service-table"><thead><tr><th>Inflyttare · exempel</th><th>Partner</th><th>Inflyttning</th><th>Ärendestatus</th><th>Handläggning</th><th><span class="sr-only">Visa ärende</span></th></tr></thead><tbody id="movein-service-table-body">${tableBody()}</tbody></table></div>${note('Statusar och kompletteringssteg är testförslag. Tjänsteval och fullmaktsmarkering är fiktiva; ingen faktisk fullmakt eller kundsignering hanteras.')}</section><div class="movein-service-bottom"><section class="card"><h2>Service och affärsresultat följs separat</h2><p>Hyresgästen blir elhandelskund när hen väljer Kraftringens erbjudande enligt det verkliga upplägget. Teststatusarna här skapar inga kunder, avtal eller intäkter i resultatöversikten.</p><button class="text-button" data-go="overview">Till kommersiellt resultat ${icon('arrow')}</button></section><section class="card"><h2>Återkoppling åt båda håll</h2><p>Partnern ser delad återkoppling och kan förmedla kompletteringar. Interna anteckningar hålls åtskilda i demovyn; det är ett visningsval, inget åtkomstskydd.</p></section></div></div>`;
  }
  function bindRows() { document.querySelectorAll('[data-service-case]').forEach(button => button.onclick = () => open(button.dataset.serviceCase)); }
  function refreshTable() { qs('#movein-service-table-body').innerHTML = tableBody(); qs('#movein-service-count').textContent = filteredRows().length + ' exempel'; bindRows(); }
  function bind() {
    if (P.role !== 'internal') return;
    qs('#movein-service-search').oninput = inputEvent => { search = inputEvent.target.value; refreshTable(); };
    qs('#movein-service-partner').onchange = changeEvent => { partnerFilter = changeEvent.target.value; refreshTable(); };
    qs('#movein-service-status').onchange = changeEvent => { statusFilter = changeEvent.target.value; refreshTable(); };
    bindRows();
  }
  P.moveinService = { init, rows, statusLabel, canForward, forward, open, activityFor, handoverLabels, processingLabels, offerLabels };
  P.register('movein-cases', { render, bind });
  init();
})();
