(() => {
  'use strict';
  const P = window.Portal;
  if (!P) return;
  const e = P.e;
  const icon = P.icon;
  const demos = {
    estate1: { welcome: 'Välkommen till ditt nya hem.', intro: 'Flyttar du in hos Exempelfastigheter AB? Här kan du enkelt lämna ditt intresse för elhandel inför inflyttningen.', address: 'Exempelgatan 4', postcode: '222 22', city: 'Lund', properties: ['Exempelgatan 4 · Lund', 'Demovägen 12 · Malmö'] },
    estate2: { welcome: 'En enklare start i ditt nya hem.', intro: 'Flyttar du in hos Exempelbo Förvaltning? Samla dina uppgifter och lämna ditt intresse för elhandel här.', address: 'Testallén 8', postcode: '252 22', city: 'Helsingborg', properties: ['Testallén 8 · Helsingborg', 'Exempeltorget 2 · Landskrona'] }
  };
  let draft = null;
  let moveinStep = 1;
  let receipt = null;
  let query = '';
  const uid = () => 'inflytt-' + crypto.randomUUID().slice(0, 8);
  const partner = () => P.getPartner?.(P.partner) || { id: P.partner, name: P.partners[P.partner] || 'Exempelfastigheter AB', type: 'property' };
  const date = value => value && !Number.isNaN(new Date(value + (value.length === 10 ? 'T12:00:00' : '')).getTime()) ? new Intl.DateTimeFormat('sv-SE', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value + (value.length === 10 ? 'T12:00:00' : ''))) : 'Ej angivet';
  const note = text => `<p class="property-note">${icon('shield')}<span>${e(text)}</span></p>`;
  function init() {
    if (!P.state.propertySettings || typeof P.state.propertySettings !== 'object') P.state.propertySettings = {};
    Object.entries(demos).forEach(([id, data]) => {
      if (!P.state.propertySettings[id]) P.state.propertySettings[id] = { ...data };
    });
    if (!Array.isArray(P.state.moveins)) P.state.moveins = [];
    if (!P.state.propertyDemoSeeded) {
      const samples = [
        ['estate1', 'Lo Exempel', 'lo@hyresgast.example', 'Exempelgatan 4', '1202', 'Lund', '222 22', '2026-11-01', '2026-10-06T10:00:00Z'],
        ['estate1', 'Alex Demo', 'alex@hyresgast.example', 'Demovägen 12', '1101', 'Malmö', '211 22', '2026-11-15', '2026-10-04T13:30:00Z'],
        ['estate1', 'Kim Exempel', 'kim@hyresgast.example', 'Exempelgatan 4', '1003', 'Lund', '222 22', '2026-10-20', '2026-10-02T09:00:00Z'],
        ['estate2', 'Robin Demo', 'robin@boende.example', 'Testallén 8', '1302', 'Helsingborg', '252 22', '2026-11-01', '2026-10-05T14:00:00Z']
      ];
      if (!P.state.moveins.length) P.state.moveins = samples.map((s, index) => ({ id: 'inflytt-demo-' + index, partner: s[0], name: s[1], email: s[2], address: s[3], apartment: s[4], city: s[5], postcode: s[6], moveDate: s[7], createdAt: s[8], phone: '', status: 'Registrerad i test' }));
      P.state.propertyDemoSeeded = true;
    }
  }
  P.initPropertyDemo = init;
  init();
  function settings() { init(); return P.state.propertySettings[P.partner] || demos.estate1; }
  const registrations = () => { init(); return P.state.moveins.filter(row => row.partner === P.partner).sort((a, b) => b.createdAt.localeCompare(a.createdAt)); };
  function previewLink() {
    const url = new URL(location.href);
    url.search = '';
    url.searchParams.set('movein', P.partner);
    url.hash = 'movein';
    return url.toString();
  }
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(previewLink());
      P.toast('Förhandsvisningslänken är kopierad. Testmiljöns åtkomst gäller även här.');
    } catch {
      P.openDialog('Kopiera förhandsvisningslänken', `<p class="muted">Markera länken och kopiera. Testmiljöns åtkomst gäller även för hyresgästvyn.</p><label class="field">Förhandsvisningslänk<input id="property-copy-link" readonly value="${e(previewLink())}"></label>`, () => { const input = document.querySelector('#property-copy-link'); input.focus(); input.select(); });
    }
  }
  function editPage() {
    const data = settings();
    P.openDialog('Anpassa inflyttningssidan', `<form id="property-settings-form"><p class="muted">Partnerns namn och kontaktväg syns för den som flyttar in. Anpassa presentationen med exempeltext.</p><div class="field"><label for="property-page-heading">Välkomstrubrik</label><input id="property-page-heading" name="welcome" required maxlength="100" value="${e(data.welcome)}"></div><div class="field"><label for="property-page-intro">Introduktion</label><textarea id="property-page-intro" name="intro" required maxlength="440" rows="4">${e(data.intro)}</textarea></div><div class="modal-actions"><button class="btn btn-secondary" type="button" id="property-settings-cancel">Avbryt</button><button class="btn btn-primary" type="submit">Spara presentation</button></div></form>`, () => {
      const form = document.querySelector('#property-settings-form');
      document.querySelector('#property-settings-cancel').onclick = P.closeDialog;
      form.onsubmit = event => {
        event.preventDefault();
        if (!P.validText(form.elements.welcome) || !P.validText(form.elements.intro)) return;
        data.welcome = form.elements.welcome.value.trim(); data.intro = form.elements.intro.value.trim();
        const saved = P.save(); P.closeDialog(); P.render();
        P.toast(saved ? 'Inflyttningssidans presentation är sparad i denna webbläsare.' : 'Presentation ändrad i denna flik; webbläsaren kunde inte spara.');
      };
    });
  }
  function registrationTable(rows, compact = false) {
    return rows.length ? `<div class="table-wrap property-table-wrap"><table class="property-table"><thead><tr><th>Inflyttare · exempel</th><th>Bostad</th><th>Inflyttning</th><th>Status</th>${compact ? '' : '<th></th>'}</tr></thead><tbody>${rows.map(row => `<tr><td><button class="text-button" data-movein-detail="${e(row.id)}">${e(row.name)}</button><span class="property-table-sub">${e(row.email)}</span></td><td>${e(row.address)}${row.apartment ? `<span class="property-table-sub">Lägenhet ${e(row.apartment)}</span>` : ''}</td><td>${e(date(row.moveDate))}</td><td><span class="pill">Registrerad i test</span></td>${compact ? '' : `<td><button class="btn btn-secondary btn-small" data-movein-detail="${e(row.id)}" aria-label="Visa registrering för ${e(row.name)}">Visa ${icon('arrow')}</button></td>`}</tr>`).join('')}</tbody></table></div>` : '<div class="empty">Inga registreringar hittades. Prova inflyttningssidan med exempeluppgifter.</div>';
  }
  function bindDetails() {
    document.querySelectorAll('[data-movein-detail]').forEach(button => button.onclick = () => {
      const row = registrations().find(item => item.id === button.dataset.moveinDetail);
      if (!row) return;
      P.openDialog('Inflyttningsintresse · exempel', `<div class="property-registration-detail"><span class="pill">Registrerad i test</span><h3>${e(row.name)}</h3><dl><div><dt>Bostad</dt><dd>${e(row.address)}${row.apartment ? ', lgh ' + e(row.apartment) : ''}<br>${e(row.postcode)} ${e(row.city)}</dd></div><div><dt>Inflyttning</dt><dd>${e(date(row.moveDate))}</dd></div><div><dt>Kontakt</dt><dd>${e(row.email)}${row.phone ? '<br>' + e(row.phone) : ''}</dd></div><div><dt>Registrerat</dt><dd>${e(date(row.createdAt))}</dd></div><div><dt>Partner</dt><dd>${e(partner().name)}</dd></div></dl>${note('Detta är ett lokalt testintresse. Det innebär inget tecknat elavtal eller kommersiellt utfall.')}</div>`);
    });
  }
  function renderOverview() {
    const data = settings(); const rows = registrations();
    return `<div class="page-head"><div><span class="eyebrow">FASTIGHETSPARTNER / ${e(partner().name)}</span><h1>En bra start för era inflyttare.</h1><p>Ge hyresgästen en enkel väg till sin dialog om elhandel.</p></div><button class="btn btn-primary" id="property-open-movein">Visa inflyttningssidan ${icon('arrow')}</button></div>
      <section class="property-hero"><div class="property-hero-copy"><span class="property-eyebrow">ER EGEN INFLYTTNINGSSIDA</span><h2>${e(data.welcome)}</h2><p>${e(data.intro)}</p><div class="property-hero-actions"><button class="btn btn-primary" id="property-preview">Förhandsgranska ${icon('arrow')}</button><button class="btn property-hero-edit" id="property-edit">${icon('edit')} Anpassa budskap</button></div><span class="property-hero-label">${icon('link')} ${e(partner().name)} i samarbete med Kraftringen · demo</span></div><div class="property-hero-photo"><img src="assets/office.jpg" alt="Illustrationsbild av en fastighet"><div class="property-photo-note">Från ny adress till tydligt nästa steg.</div></div></section>
      <div class="property-kpis"><article class="card"><span class="property-kpi-icon">${icon('user')}</span><div><span>Registrerade testintressen</span><strong>${rows.length}</strong><small>Visar intresse, inte avtal</small></div></article><article class="card"><span class="property-kpi-icon">${icon('home')}</span><div><span>Fastigheter i exemplet</span><strong>${data.properties?.length || 2}</strong><small>Fiktiva adresser</small></div></article><article class="card"><span class="property-kpi-icon">${icon('link')}</span><div><span>Egen inflyttningssida</span><strong>1</strong><small>Förhandsvisning att testa</small></div></article></div>
      <div class="property-workspace-grid"><section class="card"><div class="section-title"><h2>Senaste registreringar</h2><button class="text-button" data-go="property-registrations">Visa alla ${icon('arrow')}</button></div>${registrationTable(rows.slice(0, 3), true)}${note('Registreringarna sparas lokalt i denna webbläsare. De räknas inte som affärsresultat.')}</section><section class="card property-share-card"><span class="property-kpi-icon">${icon('link')}</span><h2>En väg in för hyresgästen</h2><p>Öppna sidan som den inflyttande ser och testa hela registreringen.</p><label class="field" for="property-test-link">Förhandsvisningslänk<input id="property-test-link" value="${e(previewLink())}" readonly></label><button class="btn btn-secondary" id="property-copy">${icon('copy')} Kopiera testlänk</button><small>Testlänken följer portalens åtkomst. Publik kundåtkomst är ett senare steg.</small></section></div>
      <section class="property-how"><div>${icon('home')}<h3>1. Öppna er sida</h3><p>Partnerns namn och välkomsttext möter hyresgästen.</p></div><div>${icon('edit')}<h3>2. Ange inflyttningen</h3><p>Adress, datum och kontaktuppgifter samlas på ett ställe.</p></div><div>${icon('check')}<h3>3. Granska och registrera</h3><p>Hyresgästen ser sitt underlag och får ett testkvitto.</p></div></section>`;
  }
  P.register('property-overview', { render: renderOverview, bind: () => {
    document.querySelector('#property-open-movein').onclick = () => P.openMovein();
    document.querySelector('#property-preview').onclick = () => P.openMovein();
    document.querySelector('#property-edit').onclick = editPage;
    document.querySelector('#property-copy').onclick = copyLink;
    bindDetails();
  } });
  function renderRegistrations() {
    const rows = registrations().filter(row => `${row.name} ${row.address} ${row.city} ${row.email}`.toLocaleLowerCase('sv').includes(query.toLocaleLowerCase('sv')));
    return `<div class="page-head"><div><span class="eyebrow">${e(partner().name)}</span><h1>Inflyttningsintressen</h1><p>Följ vilka hyresgäster som har provat registreringen.</p></div><button class="btn btn-primary" id="property-registrations-preview">Testa inflyttningssidan ${icon('arrow')}</button></div><section class="card"><div class="property-list-toolbar"><div class="field"><label for="property-query">Sök inflyttare eller adress</label><input id="property-query" type="search" placeholder="Namn, adress eller ort" value="${e(query)}"></div><span class="pill">${rows.length} testintressen</span></div>${registrationTable(rows)}${note('Ett registrerat intresse är inte ett tecknat avtal. Faktisk uppföljning och informationsdelning behöver bestämmas.')}</section>`;
  }
  P.register('property-registrations', { render: renderRegistrations, bind: () => {
    const search = document.querySelector('#property-query');
    search.oninput = () => { const caret = search.selectionStart; query = search.value; P.render(); const next = document.querySelector('#property-query'); next.focus(); try { next.setSelectionRange(caret, caret); } catch { /* Selection APIs may be unavailable in some browsers. */ } };
    document.querySelector('#property-registrations-preview').onclick = () => P.openMovein();
    bindDetails();
  } });
  function ensureDraft() {
    if (!draft || draft.partner !== P.partner) { draft = { partner: P.partner, address: '', apartment: '', postcode: '', city: '', moveDate: '', name: '', email: '', phone: '' }; moveinStep = 1; receipt = null; }
    return draft;
  }
  P.openMovein = (id = P.partner) => {
    if ((P.getPartner?.(id)?.type || (demos[id] ? 'property' : '')) !== 'property') return;
    P.partner = id; P.role = 'partner'; draft = null; receipt = null; moveinStep = 1; P.go('movein');
  };
  const summary = data => `<dl class="property-review-list"><div><dt>Din bostad</dt><dd>${e(data.address)}${data.apartment ? ', lgh ' + e(data.apartment) : ''}<br>${e(data.postcode)} ${e(data.city)}</dd></div><div><dt>Inflyttningsdatum</dt><dd>${e(date(data.moveDate))}</dd></div><div><dt>Namn</dt><dd>${e(data.name)}</dd></div><div><dt>E-post</dt><dd>${e(data.email)}</dd></div>${data.phone ? `<div><dt>Telefon</dt><dd>${e(data.phone)}</dd></div>` : ''}</dl>`;
  function renderMovein() {
    const data = settings(); const values = ensureDraft();
    const steps = ['Inflyttning', 'Kontakt', 'Granska'];
    let body;
    if (receipt) body = `<section class="card property-receipt"><span class="property-receipt-check">${icon('check')}</span><span class="property-eyebrow">TESTREGISTRERING KLAR</span><h2>Tack, ${e(receipt.name.split(' ')[0])}!</h2><p>Ditt intresse för elhandel finns nu i denna ${receipt.saved ? 'webbläsare' : 'flik'}. Du kan se ditt underlag nedan.</p><div class="property-receipt-number">${e(receipt.id.toUpperCase())}<span>Registrerad i test</span></div>${summary(receipt)}<div class="property-receipt-callout"><strong>Vad händer sedan?</strong><p>I en färdig tjänst kan detta följas av kontakt och avtalsval. Den processen behöver ni bestämma. I testet skickas inget och inget elavtal tecknas.</p></div>${!receipt.saved ? '<p class="property-warning">Webbläsaren kunde inte spara. Registreringen finns bara i den här fliken just nu.</p>' : ''}<div class="property-form-actions"><button class="btn btn-secondary" id="property-receipt-download">${icon('download')} Hämta testkvitto</button><button class="btn btn-primary" id="property-receipt-new">Prova igen ${icon('arrow')}</button></div></section>`;
    else body = `<section class="card property-movein-form"><div class="property-form-heading"><span class="property-eyebrow">STEG ${moveinStep} AV 3</span><h2>${['Var flyttar du in?', 'Hur når vi dig?', 'Stämmer dina uppgifter?'][moveinStep - 1]}</h2><p>${['Samla adress och inflyttningsdatum inför din dialog om elhandel.', 'Ange en fiktiv kontaktperson för att prova registreringen.', 'Granska underlaget innan du registrerar ditt testintresse.'][moveinStep - 1]}</p></div><form id="property-movein-form">${moveinStep === 1 ? `<div class="field"><label for="movein-address">Bostadsadress</label><input id="movein-address" name="address" autocomplete="off" required maxlength="120" value="${e(values.address)}" placeholder="Exempelgatan 4"></div><div class="form-grid"><div class="field"><label for="movein-postcode">Postnummer</label><input id="movein-postcode" name="postcode" inputmode="numeric" autocomplete="off" required pattern="[0-9]{3} ?[0-9]{2}" maxlength="6" value="${e(values.postcode)}" placeholder="222 22"></div><div class="field"><label for="movein-city">Ort</label><input id="movein-city" name="city" required maxlength="80" autocomplete="off" value="${e(values.city)}" placeholder="Lund"></div><div class="field"><label for="movein-apartment">Lägenhetsnummer · valfritt</label><input id="movein-apartment" name="apartment" maxlength="25" autocomplete="off" value="${e(values.apartment)}" placeholder="1202"></div><div class="field"><label for="movein-date">Inflyttningsdatum</label><input id="movein-date" name="moveDate" type="date" required value="${e(values.moveDate)}"></div></div><button type="button" class="text-button" id="property-fill-example">${icon('edit')} Fyll med exempeluppgifter</button>` : moveinStep === 2 ? `<div class="field"><label for="movein-name">Namn · exempel</label><input id="movein-name" name="name" required maxlength="100" autocomplete="off" value="${e(values.name)}" placeholder="Lo Exempel"></div><div class="field"><label for="movein-email">E-post · exempel</label><input id="movein-email" name="email" type="email" required maxlength="140" autocomplete="off" value="${e(values.email)}" placeholder="lo@hyresgast.example"><span class="form-hint">Använd en adress som slutar med .example i testet.</span></div><div class="field"><label for="movein-phone">Telefon · valfritt testvärde</label><input id="movein-phone" name="phone" type="tel" maxlength="30" autocomplete="off" value="${e(values.phone)}" placeholder="Lämna tomt i testet"></div>` : `${summary(values)}<label class="checkbox-label property-test-check"><input type="checkbox" name="demo" required><span>Jag använder påhittade uppgifter och vill registrera ett testintresse för elhandel.</span></label>`}<div class="property-form-actions">${moveinStep > 1 ? '<button class="btn btn-secondary" type="button" id="property-movein-back">Tillbaka</button>' : '<span class="property-form-small">Enbart exempeluppgifter</span>'}<button class="btn btn-primary" type="submit">${moveinStep === 3 ? 'Registrera testintresse' : 'Fortsätt'} ${icon(moveinStep === 3 ? 'check' : 'arrow')}</button></div></form></section>`;
    return `<div class="property-resident-shell"><div class="property-resident-preview-bar"><span>${icon('user')} Hyresgästvy · test</span><div><button class="text-button" id="property-return-partner">Till partnerarbetsytan</button><button class="text-button" id="property-return-internal">Till Kraftringen</button></div></div><header class="property-resident-header"><a href="#overview" id="property-resident-brand">${icon('home')}<strong>${e(partner().name)}</strong></a><span>I samarbete med <strong>Kraftringen</strong> · demo</span></header><div class="property-resident-layout"><section class="property-resident-intro"><span class="property-eyebrow">ELHANDEL INFÖR INFLYTTNINGEN</span><h1>${e(data.welcome)}</h1><p>${e(data.intro)}</p><div class="property-resident-image"><img src="assets/office.jpg" alt="Illustrationsbild av en fastighet"><span>Din nya adress. En enkel början.</span></div><div class="property-resident-benefits"><div>${icon('home')}<span><strong>På er fastighetsägares sida</strong>En tydlig startpunkt inför inflyttningen.</span></div><div>${icon('edit')}<span><strong>Samla dina uppgifter</strong>Adress, datum och kontakt på ett ställe.</span></div><div>${icon('shield')}<span><strong>Du granskar före registrering</strong>Intresseanmälan i test, inget elavtal.</span></div></div></section><div class="property-resident-form-column">${!receipt ? `<ol class="property-steps">${steps.map((step, index) => `<li class="${moveinStep === index + 1 ? 'active' : moveinStep > index + 1 ? 'done' : ''}"${moveinStep === index + 1 ? ' aria-current="step"' : ''}><span>${moveinStep > index + 1 ? icon('check') : index + 1}</span>${step}</li>`).join('')}</ol>` : ''}${body}<p class="property-resident-note">${icon('shield')} ${receipt ? 'Inget mejl skickas och ingen elleverans beställs från prototypen.' : 'Prototyp med exempeldata. Ingen identifiering eller avtalsteckning ingår.'}</p></div></div><div class="property-resident-footer"><span>${e(partner().name)} × Kraftringen</span><span>Lokal förhandsvisning · Den delade testmiljöns åtkomst gäller</span></div></div>`;
  }
  function capture(form) {
    for (const key of ['address','postcode','city','apartment','moveDate','name','email','phone']) if (form.elements.namedItem(key)) draft[key] = form.elements.namedItem(key).value.trim();
  }
  function focusForm() { document.querySelector('.property-movein-form, .property-receipt')?.scrollIntoView({ behavior: 'instant', block: 'start' }); document.querySelector('#property-movein-form input, #property-receipt-download')?.focus({ preventScroll: true }); }
  P.register('movein', { render: renderMovein, bind: () => {
    document.querySelector('#property-return-partner').onclick = () => P.go('overview');
    document.querySelector('#property-resident-brand').onclick = event => { event.preventDefault(); P.go('overview'); };
    document.querySelector('#property-return-internal').onclick = () => P.returnInternal ? P.returnInternal() : (P.role = 'internal', P.go('overview'));
    if (receipt) {
      document.querySelector('#property-receipt-new').onclick = () => { draft = null; receipt = null; moveinStep = 1; P.render(); focusForm(); };
      document.querySelector('#property-receipt-download').onclick = () => P.download('inflyttningsintresse-test.txt', `TESTKVITTO – INGET ELAVTAL\n\nPartner: ${partner().name}\nTestreferens: ${receipt.id}\nStatus: Registrerad i test\n\nNamn: ${receipt.name}\nE-post: ${receipt.email}\nBostadsadress: ${receipt.address}\nLägenhet: ${receipt.apartment || 'Ej angivet'}\nPostnummer och ort: ${receipt.postcode} ${receipt.city}\nInflyttning: ${receipt.moveDate}\n\nFiktivt lokalt testunderlag. Inget har skickats, ingen elleverans har beställts och inget avtal har tecknats.\n`);
      return;
    }
    const form = document.querySelector('#property-movein-form');
    document.querySelector('#property-movein-back')?.addEventListener('click', () => { capture(form); moveinStep--; P.render(); focusForm(); });
    document.querySelector('#property-fill-example')?.addEventListener('click', () => { const data = settings(); Object.assign(draft, { address: data.address, postcode: data.postcode, city: data.city, apartment: '1202', moveDate: '2026-11-01', name: 'Lo Exempel', email: 'lo@hyresgast.example', phone: '' }); P.render(); });
    const email = form.elements.namedItem('email');
    if (email) email.oninput = () => email.setCustomValidity('');
    form.onsubmit = event => {
      event.preventDefault();
      for (const key of moveinStep === 1 ? ['address','city'] : moveinStep === 2 ? ['name'] : []) if (!P.validText(form.elements.namedItem(key))) return;
      if (email && !/^[^\s@]+@[^\s@]+\.example$/i.test(email.value.trim())) { email.setCustomValidity('Använd en påhittad e-postadress som slutar med .example.'); email.reportValidity(); return; }
      if (!form.reportValidity()) return;
      capture(form);
      if (moveinStep < 3) { moveinStep++; P.render(); focusForm(); return; }
      const row = { ...draft, id: uid(), createdAt: new Date().toISOString(), status: 'Registrerad i test' };
      init(); P.state.moveins.unshift(row); const saved = P.save(); receipt = { ...row, saved }; P.render(); focusForm();
    };
  } });
})();
