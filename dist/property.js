(() => {
  'use strict';
  const P = window.Portal;
  if (!P) return;
  const e = P.e, icon = P.icon;
  const demos = {
    estate1: { welcome: 'Välkommen till ditt nya hem.', intro: 'Flyttar du in hos Exempelfastigheter AB? Välj vår inflyttningsservice så hjälper Kraftringen dig med elhandel och den hantering som behövs gentemot elnätsbolaget.', address: 'Exempelgatan 4', postcode: '222 22', city: 'Lund', properties: ['Exempelgatan 4 · Lund', 'Demovägen 12 · Malmö'] },
    estate2: { welcome: 'En enklare start i ditt nya hem.', intro: 'Flyttar du in hos Exempelbo Förvaltning? Välj vår inflyttningsservice och lämna ditt underlag här. Kraftringen hjälper dig vidare med elen inför inflyttningen.', address: 'Testallén 8', postcode: '252 22', city: 'Helsingborg', properties: ['Testallén 8 · Helsingborg', 'Exempeltorget 2 · Landskrona'] }
  };
  const oldIntro = {
    estate1: 'Flyttar du in hos Exempelfastigheter AB? Här kan du enkelt lämna ditt intresse för elhandel inför inflyttningen.',
    estate2: 'Flyttar du in hos Exempelbo Förvaltning? Samla dina uppgifter och lämna ditt intresse för elhandel här.'
  };
  let draft = null, moveinStep = 1, receipt = null, declined = false, query = '', filter = 'all', draftStorageStatus = 'idle';
  const draftPrefix = P.demoMode ? 'partnerlabb.demo.moveinDraft.v1.' : 'partnerlabb.moveinDraft.v1.';
  const draftTextFields = { address: 120, apartment: 25, postcode: 6, city: 80, moveDate: 10, name: 100, email: 140, phone: 30 };
  const draftChoiceFields = ['serviceRequested', 'authorityDemo'];
  const ignoredDrafts = new Set();
  const isProperty = id => (P.getPartner?.(id)?.type || (demos[id] ? 'property' : '')) === 'property';
  const freshDraft = id => ({ partner: id, ...Object.fromEntries(Object.keys(draftTextFields).map(key => [key, ''])), serviceRequested: false, authorityDemo: false });
  const validMoveDate = value => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
  function safeDraftStep(values, requested) {
    if (requested > 1 && (!values.address.trim() || !/^[0-9]{3} ?[0-9]{2}$/.test(values.postcode) || !values.city.trim() || !validMoveDate(values.moveDate))) return 1;
    if (requested > 2 && (!values.name.trim() || !/^[^\s@]+@[^\s@]+\.example$/i.test(values.email.trim()))) return 2;
    if (requested > 3 && (!values.serviceRequested || !values.authorityDemo)) return 3;
    return requested;
  }
  function readDraft(id) {
    if (!isProperty(id) || ignoredDrafts.has(id)) return null;
    try {
      const raw = sessionStorage.getItem(draftPrefix + id);
      if (!raw) return null;
      const saved = JSON.parse(raw);
      if (!saved || saved.version !== 1 || saved.partner !== id || !Number.isInteger(saved.step) || saved.step < 1 || saved.step > 4 || !saved.fields || typeof saved.fields !== 'object' || Array.isArray(saved.fields)) throw new Error('Invalid draft');
      const values = freshDraft(id);
      for (const [key, max] of Object.entries(draftTextFields)) {
        if (typeof saved.fields[key] !== 'string' || saved.fields[key].length > max) throw new Error('Invalid draft field');
        values[key] = saved.fields[key];
      }
      for (const key of draftChoiceFields) {
        if (typeof saved.fields[key] !== 'boolean') throw new Error('Invalid draft choice');
        values[key] = saved.fields[key];
      }
      if (values.moveDate && !validMoveDate(values.moveDate)) throw new Error('Invalid draft date');
      return { values, step: safeDraftStep(values, saved.step) };
    } catch {
      // An invalid or inaccessible draft must never become a registered record.
      try { sessionStorage.removeItem(draftPrefix + id); } catch { draftStorageStatus = 'unavailable'; }
      return null;
    }
  }
  function saveDraft() {
    if (!draft || !isProperty(draft.partner) || receipt || declined) return false;
    const fields = {};
    for (const key of Object.keys(draftTextFields)) fields[key] = draft[key];
    for (const key of draftChoiceFields) fields[key] = draft[key] === true;
    try {
      sessionStorage.setItem(draftPrefix + draft.partner, JSON.stringify({ version: 1, partner: draft.partner, step: moveinStep, fields }));
      ignoredDrafts.delete(draft.partner);
      draftStorageStatus = 'saved';
      return true;
    } catch { draftStorageStatus = 'unavailable'; return false; }
  }
  function clearDraft(id) {
    ignoredDrafts.add(id);
    try { sessionStorage.removeItem(draftPrefix + id); draftStorageStatus = 'idle'; return true; }
    catch { draftStorageStatus = 'clear-failed'; return false; }
  }
  function draftStatusText() {
    if (draftStorageStatus === 'saved') return 'Utkast sparat i den här fliken. Det är inte registrerat.';
    if (draftStorageStatus === 'unavailable') return 'Utkastet kan inte sparas i den här fliken. Behåll sidan öppen för att fortsätta.';
    if (draftStorageStatus === 'clear-failed') return 'Webbläsaren kunde inte rensa det sparade utkastet. Dina nya uppgifter finns bara medan sidan är öppen tills de kan sparas.';
    return 'Ditt utkast är inte registrerat.';
  }
  function updateDraftStatus() {
    const node = document.querySelector('#property-draft-status');
    if (node) { const text = draftStatusText(); if (node.textContent !== text) node.textContent = text; node.classList.toggle('property-draft-warning', ['unavailable', 'clear-failed'].includes(draftStorageStatus)); }
  }
  P.propertyDrafts = { clearAll: () => {
    let cleared = true;
    const ids = new Set([...Object.keys(demos), ...(P.partnerRegistry || []).filter(item => item.type === 'property').map(item => item.id)]);
    for (const id of ids) if (!clearDraft(id)) cleared = false;
    draft = null; receipt = null; declined = false; moveinStep = 1;
    return cleared;
  } };
  const uid = () => 'inflytt-' + crypto.randomUUID().slice(0, 8);
  const partner = () => P.getPartner?.(P.partner) || { id: P.partner, name: P.partners[P.partner] || 'Exempelfastigheter AB', type: 'property' };
  const date = value => value && !Number.isNaN(new Date(value + (value.length === 10 ? 'T12:00:00' : '')).getTime()) ? new Intl.DateTimeFormat('sv-SE', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value + (value.length === 10 ? 'T12:00:00' : ''))) : 'Ej angivet';
  const note = text => `<p class="property-note">${icon('shield')}<span>${e(text)}</span></p>`;
  function init() {
    if (!P.state.propertySettings || typeof P.state.propertySettings !== 'object') P.state.propertySettings = {};
    Object.entries(demos).forEach(([id, data]) => {
      if (!P.state.propertySettings[id]) P.state.propertySettings[id] = { ...data };
      else if (P.state.propertySettings[id].intro === oldIntro[id]) P.state.propertySettings[id].intro = data.intro;
    });
    if (!Array.isArray(P.state.moveins)) P.state.moveins = [];
    P.state.propertyDemoSeeded = true;
  }
  P.initPropertyDemo = init;
  init();
  function settings() { init(); return P.state.propertySettings[P.partner] || demos.estate1; }
  const registrations = (partnerId = P.partner) => P.moveinService?.rows(partnerId) || P.state.moveins.filter(row => row.partner === partnerId).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  const status = row => P.moveinService?.statusLabel(row) || (row.serviceRequested && row.authorityDemo ? 'Väntar på förmedling' : 'Underlag saknas');
  const recoverableRegistration = (partnerId = P.partner) => registrations(partnerId).filter(row => row && row.partner === partnerId && !row.demoServiceCase && row.serviceRequested === true && row.authorityDemo === true && row.id && row.createdAt).slice().sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))[0] || null;
  const ready = row => row.handoverStatus === 'draft' && !!P.moveinService?.canForward(row);
  const stats = rows => ({ ready: rows.filter(ready).length, underway: rows.filter(row => ['submitted', 'handling'].includes(row.handoverStatus)).length, needs: rows.filter(row => row.handoverStatus === 'needs_info').length, done: rows.filter(row => row.handoverStatus === 'confirmed').length });
  function previewLink() {
    const url = new URL(location.href); url.search = ''; if (P.demoMode) url.searchParams.set('demo', 'inflyttning'); url.searchParams.set('movein', P.partner); url.hash = 'movein'; return url.toString();
  }
  async function copyLink() {
    try { await navigator.clipboard.writeText(previewLink()); P.toast('Testlänken är kopierad. Testmiljöns åtkomst gäller även här.'); }
    catch { P.openDialog('Kopiera testlänken', `<p class="muted">Markera länken och kopiera. Testmiljöns åtkomst gäller även för hyresgästvyn.</p><label class="field">Testlänk<input id="property-copy-link" readonly value="${e(previewLink())}"></label>`, () => { const input = document.querySelector('#property-copy-link'); input.focus(); input.select(); }); }
  }
  function editPage() {
    const data = settings();
    P.openDialog('Anpassa inflyttningssidan', `<form id="property-settings-form"><p class="muted">Er presentation möter hyresgästen när ni erbjuder inflyttningsservicen. Kraftringen står för elkompetensen och avtalshanteringen.</p><div class="field"><label for="property-page-heading">Välkomstrubrik</label><input id="property-page-heading" name="welcome" required maxlength="100" value="${e(data.welcome)}"></div><div class="field"><label for="property-page-intro">Introduktion</label><textarea id="property-page-intro" name="intro" required maxlength="440" rows="4">${e(data.intro)}</textarea></div><div class="modal-actions"><button class="btn btn-secondary" type="button" id="property-settings-cancel">Avbryt</button><button class="btn btn-primary" type="submit">Spara presentation</button></div></form>`, () => {
      const form = document.querySelector('#property-settings-form'); document.querySelector('#property-settings-cancel').onclick = P.closeDialog;
      form.onsubmit = event => { event.preventDefault(); if (!P.validText(form.elements.welcome) || !P.validText(form.elements.intro)) return; data.welcome = form.elements.welcome.value.trim(); data.intro = form.elements.intro.value.trim(); const saved = P.save(); P.closeDialog(); P.render(); P.toast(saved ? 'Inflyttningssidans presentation är sparad i denna webbläsare.' : 'Presentation ändrad i denna flik; webbläsaren kunde inte spara.'); };
    });
  }
  function registrationTable(rows, compact = false) {
    return rows.length ? `<div class="table-wrap property-table-wrap"><table class="property-table"><thead><tr><th>Hyresgäst · exempel</th><th>Bostad</th><th>Inflyttning</th><th>Ärende</th>${compact ? '' : '<th></th>'}</tr></thead><tbody>${rows.map(row => `<tr><td><button class="text-button" data-movein-detail="${e(row.id)}">${e(row.name)}</button><span class="property-table-sub">${e(row.email)}</span></td><td>${e(row.address)}${row.apartment ? `<span class="property-table-sub">Lägenhet ${e(row.apartment)}</span>` : ''}</td><td>${e(date(row.moveDate))}</td><td><span class="pill property-status-${e(row.handoverStatus || 'draft')}">${e(status(row))}</span>${!row.serviceRequested || !row.authorityDemo ? '<span class="property-table-sub">Tjänsteval / fullmaktssteg saknas</span>' : ''}</td>${compact ? '' : `<td><button class="btn btn-secondary btn-small" data-movein-detail="${e(row.id)}" aria-label="Öppna ärendet för ${e(row.name)}">${ready(row) ? 'Förmedla' : 'Öppna'} ${icon('arrow')}</button></td>`}</tr>`).join('')}</tbody></table></div>` : '<div class="empty">Inga inflyttningsärenden hittades. Prova hyresgästens inflyttningssida med exempeluppgifter.</div>';
  }
  function bindDetails() {
    document.querySelectorAll('[data-movein-detail]').forEach(button => button.onclick = () => P.moveinService?.open(button.dataset.moveinDetail));
    document.querySelectorAll('[data-property-filter]').forEach(button => button.onclick = () => { filter = button.dataset.propertyFilter; P.go('property-registrations'); });
  }
  const flow = () => `<section class="property-how property-service-flow"><div>${icon('home')}<h3>Ni erbjuder vid hyresavtalet</h3><p>Fastighetsbolaget har kontakten och erbjuder en enklare väg till elen.</p></div><div>${icon('user')}<h3>Hyresgästen väljer hjälp</h3><p>Hyresgästen väljer tjänsten och lämnar uppgifter och fullmakt.</p></div><div>${icon('arrow')}<h3>Ni förmedlar underlaget</h3><p>Skicka ärendet vidare och följ Kraftringens återkoppling.</p></div><div>${icon('bolt')}<h3>Kraftringen tar över</h3><p>Elhandel, nödvändig elnätshantering och bekräftelser hanteras av Kraftringen.</p></div></section>`;
  const homeArt = () => `<div class="property-home-art" aria-hidden="true"><span class="property-home-halo"></span><div class="property-home-building"><div class="property-home-roof"></div><div class="property-home-windows"><i></i><i></i><i></i><i></i><i></i><i></i></div><span class="property-home-door"></span></div><span class="property-home-spark property-home-spark-one">${icon('bolt')}</span><span class="property-home-spark property-home-spark-two">${icon('home')}</span><div class="property-home-card"><span>${icon('bolt')}</span><div><strong>Elen i ditt nya hem</strong><small>En enklare väg med Kraftringen</small></div>${icon('check')}</div><div class="property-home-caption">Ni erbjuder servicen. Vi hjälper till med elen.</div></div>`;
  function renderOverview() {
    const data = settings(), rows = registrations(), counts = stats(rows);
    return `<div class="property-dashboard"><div class="page-head"><div><span class="eyebrow">FASTIGHETSPARTNER / ${e(partner().name)}</span><h1>Inflyttningsservice</h1><p>En enklare inflyttning för er och era hyresgäster.</p></div><button class="btn btn-primary" id="property-open-movein">Visa hyresgästens sida ${icon('arrow')}</button></div>
      <section class="property-hero property-hero-compact"><div class="property-hero-copy"><span class="property-eyebrow">ER INFLYTTNINGSSIDA</span><h2>${e(data.welcome)}</h2><p>${e(data.intro)}</p><div class="property-hero-actions"><button class="btn btn-primary" id="property-preview">Prova inflyttningen ${icon('arrow')}</button><button class="btn property-hero-edit" id="property-edit">${icon('edit')} Anpassa er sida</button></div><div class="property-hero-label">${icon('shield')} Frivillig service. Kraftringen står för elkompetensen.</div></div>${homeArt()}</section>
      <div class="property-kpis property-service-kpis"><article class="card"><span class="property-kpi-icon">${icon('file')}</span><div><span>Klara att förmedla</span><strong>${counts.ready}</strong><small><button class="text-button" data-property-filter="ready">Öppna underlag ${icon('arrow')}</button></small></div></article><article class="card"><span class="property-kpi-icon">${icon('bolt')}</span><div><span>Hos Kraftringen</span><strong>${counts.underway}</strong><small><button class="text-button" data-property-filter="underway">Följ ärenden ${icon('arrow')}</button></small></div></article><article class="card"><span class="property-kpi-icon">${icon('edit')}</span><div><span>Behöver kompletteras</span><strong>${counts.needs}</strong><small><button class="text-button" data-property-filter="needs_info">Se återkoppling ${icon('arrow')}</button></small></div></article><article class="card"><span class="property-kpi-icon">${icon('check')}</span><div><span>Återkoppling klar · demo</span><strong>${counts.done}</strong><small><button class="text-button" data-property-filter="confirmed">Visa återkoppling ${icon('arrow')}</button></small></div></article></div>
      <div class="property-next-step">${P.workbench?.render({limit:3, title:'Det här behöver er uppmärksamhet'}) || ''}</div>
      <div class="property-workspace-grid"><section class="card property-queue-card"><div class="section-title"><div><span class="property-eyebrow">ÖVERLÄMNING & ÅTERKOPPLING</span><h2>Era inflyttningsärenden</h2></div><button class="text-button" data-go="property-registrations">Visa alla ${icon('arrow')}</button></div>${registrationTable(rows.slice(0, 4), true)}${note(`${rows.length} ärenden i testet. Serviceärenden och elavtal följs separat.`)}</section><section class="card property-share-card"><span class="property-kpi-icon">${icon('link')}</span><h2>Erbjud servicen vid hyresavtalet</h2><p>En egen sida där hyresgästen själv väljer hjälp med elen.</p><label class="field" for="property-test-link">Hyresgästens testlänk<input id="property-test-link" value="${e(previewLink())}" readonly></label><button class="btn btn-secondary" id="property-copy">${icon('copy')} Kopiera testlänk</button><small>Testlänken följer portalens åtkomst. Använd bara exempeluppgifter.</small></section></div>
      <details class="property-service-explainer"><summary>Så fungerar samarbetet <span>Från hyresavtal till återkoppling</span></summary>${flow()}<div class="property-business-separation">${icon('home')}<p><strong>Hyresgästens el är en egen kundaffär.</strong> Fastighetsbolagets egen elförbrukning hanteras separat från inflyttningsservicen.</p></div></details></div>`;
  }
  P.register('property-overview', { render: renderOverview, bind: () => { document.querySelector('#property-open-movein').onclick = () => P.openMovein(); document.querySelector('#property-preview').onclick = () => P.openMovein(); document.querySelector('#property-edit').onclick = editPage; document.querySelector('#property-copy').onclick = copyLink; bindDetails(); } });
  const filterOptions = [['all','Alla ärenden'],['ready','Klara att förmedla'],['underway','Hos Kraftringen'],['needs_info','Behöver kompletteras'],['confirmed','Återkoppling klar · demo'],['incomplete','Tjänsteval / fullmaktssteg saknas']];
  const matchesFilter = row => filter === 'all' || filter === 'ready' && ready(row) || filter === 'underway' && ['submitted','handling'].includes(row.handoverStatus) || filter === 'incomplete' && (!row.serviceRequested || !row.authorityDemo) || row.handoverStatus === filter;
  function renderRegistrations() {
    const rows = registrations().filter(row => matchesFilter(row) && `${row.name} ${row.address} ${row.city} ${row.email}`.toLocaleLowerCase('sv').includes(query.toLocaleLowerCase('sv')));
    const events = P.moveinService?.activityFor(P.partner).slice(0, 5) || [];
    return `<div class="page-head"><div><span class="eyebrow">${e(partner().name)}</span><h1>Inflyttningsärenden</h1><p>Förmedla underlag och följ Kraftringens hantering och bekräftelser.</p></div><button class="btn btn-primary" id="property-registrations-preview">Visa hyresgästens sida ${icon('arrow')}</button></div><section class="card"><div class="property-list-toolbar"><div class="field"><label for="property-query">Sök hyresgäst eller adress</label><input id="property-query" type="search" placeholder="Namn, adress eller ort" value="${e(query)}"></div><div class="field"><label for="property-filter">Visa ärenden</label><select id="property-filter">${filterOptions.map(([value,label]) => `<option value="${value}"${filter === value ? ' selected' : ''}>${label}</option>`).join('')}</select></div><span class="pill">${rows.length} ärenden</span></div>${registrationTable(rows)}${note('Fullmaktssteget är en demomarkering utan rättsverkan. Förmedlingen sker i testet och skickar inget externt.')}</section>${events.length ? `<section class="card property-shared-activity"><div class="section-title"><h2>Senaste återkoppling och händelser</h2></div><div class="activity-list">${events.map(event => `<div class="activity-row"><span class="activity-icon">${icon('file')}</span><span><small>${e(date(event.at))} · ${e(event.name)}</small><strong>${e(event.text)}</strong></span></div>`).join('')}</div></section>` : ''}`;
  }
  P.register('property-registrations', { render: renderRegistrations, bind: () => {
    const search = document.querySelector('#property-query'); search.oninput = () => { const caret = search.selectionStart; query = search.value; P.render(); const next = document.querySelector('#property-query'); next.focus(); try { next.setSelectionRange(caret, caret); } catch {} };
    document.querySelector('#property-filter').onchange = event => { filter = event.target.value; P.render(); document.querySelector('#property-filter').focus(); };
    document.querySelector('#property-registrations-preview').onclick = () => P.openMovein(); bindDetails();
  } });
  function ensureDraft() {
    if (!draft || draft.partner !== P.partner) {
      draftStorageStatus = 'idle';
      const saved = readDraft(P.partner);
      draft = saved?.values || freshDraft(P.partner); moveinStep = saved?.step || 1; receipt = null; declined = false;
      if (saved) saveDraft();
    }
    return draft;
  }
  function recoverReceipt(id) {
    ensureDraft();
    const row = registrations().find(item => item?.id === id && !item.demoServiceCase && item.serviceRequested === true && item.authorityDemo === true);
    if (!row) return false;
    receipt = { ...row, saved: true, recovered: true }; declined = false; moveinStep = 1;
    P.render(); focusForm();
    return true;
  }
  P.propertyReceipts = { latest: recoverableRegistration, recover: recoverReceipt };
  P.openMovein = (id = P.partner) => {
    if (!isProperty(id)) return;
    if (receipt || declined) { draft = null; receipt = null; declined = false; }
    P.partner = id; P.role = 'partner'; ensureDraft(); P.go('movein');
  };
  const summary = data => `<dl class="property-review-list"><div><dt>Din bostad</dt><dd>${e(data.address)}${data.apartment ? ', lgh ' + e(data.apartment) : ''}<br>${e(data.postcode)} ${e(data.city)}</dd></div><div><dt>Inflyttningsdatum</dt><dd>${e(date(data.moveDate))}</dd></div><div><dt>Namn</dt><dd>${e(data.name)}</dd></div><div><dt>E-post</dt><dd>${e(data.email)}</dd></div>${data.phone ? `<div><dt>Telefon</dt><dd>${e(data.phone)}</dd></div>` : ''}${data.serviceRequested ? '<div><dt>Ditt val</dt><dd>Inflyttningsservice med Kraftringen</dd></div>' : ''}${data.authorityDemo ? '<div><dt>Fullmaktssteg</dt><dd>Demomarkering · utan rättsverkan</dd></div>' : ''}</dl>`;
  const receiptNext = row => row.handoverStatus === 'needs_info' ? 'Fastighetsvärden behöver komplettera testunderlaget och förmedla det på nytt. Tjänstevalet och fullmaktsmarkeringen ändras inte automatiskt.' : ['submitted', 'handling'].includes(row.handoverStatus) ? 'Underlaget är förmedlat till Kraftringens testvy. Elhandel, elnät och hyresgästens erbjudandeval följs separat.' : row.handoverStatus === 'confirmed' ? 'Återkopplingen är markerad som klar i testet. Ett slutfört serviceärende är inte automatiskt ett elhandelsavtal.' : 'Fastighetsvärden förmedlar ärendet. Kraftringen tar över och återkopplar vid behov av komplettering.';
  const receiptDownload = row => `TESTKVITTO – UNDERLAG, INGET ELAVTAL\n\nPartner: ${partner().name}\nTestreferens: ${row.id}\nStatus: ${status(row)}\n\nNamn: ${row.name}\nE-post: ${row.email}\nBostadsadress: ${row.address}\nLägenhet: ${row.apartment || 'Ej angivet'}\nPostnummer och ort: ${row.postcode} ${row.city}\nInflyttning: ${row.moveDate}\nTjänsteval: Inflyttningsservice\nFullmaktssteg: Demomarkering utan rättsverkan\n\nLokalt testunderlag med fiktiva uppgifter. Ingen extern handling, elleverans eller avtalsteckning har gjorts.\n`;
  function formFields(values) {
    if (moveinStep === 1) return `<div class="field"><label for="movein-address">Bostadsadress</label><input id="movein-address" name="address" autocomplete="off" required maxlength="120" value="${e(values.address)}" placeholder="Exempelgatan 4"></div><div class="form-grid"><div class="field"><label for="movein-postcode">Postnummer</label><input id="movein-postcode" name="postcode" inputmode="numeric" autocomplete="off" required pattern="[0-9]{3} ?[0-9]{2}" maxlength="6" value="${e(values.postcode)}" placeholder="222 22"></div><div class="field"><label for="movein-city">Ort</label><input id="movein-city" name="city" required maxlength="80" autocomplete="off" value="${e(values.city)}" placeholder="Lund"></div><div class="field"><label for="movein-apartment">Lägenhetsnummer · valfritt</label><input id="movein-apartment" name="apartment" maxlength="25" autocomplete="off" value="${e(values.apartment)}" placeholder="1202"></div><div class="field"><label for="movein-date">Inflyttningsdatum</label><input id="movein-date" name="moveDate" type="date" required value="${e(values.moveDate)}"></div></div><button type="button" class="text-button" id="property-fill-example">${icon('edit')} Fyll med exempeluppgifter</button>`;
    if (moveinStep === 2) return `<div class="field"><label for="movein-name">Ditt namn</label><input id="movein-name" name="name" required maxlength="100" autocomplete="off" value="${e(values.name)}" placeholder="Lo Exempel"></div><div class="field"><label for="movein-email">E-post för återkoppling</label><input id="movein-email" name="email" type="email" required maxlength="140" autocomplete="off" value="${e(values.email)}" placeholder="lo@hyresgast.example"><span class="form-hint">Använd en adress som slutar med .example i testet.</span></div><div class="field"><label for="movein-phone">Telefon · valfritt</label><input id="movein-phone" name="phone" type="tel" maxlength="30" autocomplete="off" value="${e(values.phone)}" placeholder="Lämna tomt i testet"></div>`;
    if (moveinStep === 3) return `<div class="property-service-choice"><strong>Hjälp med elen inför inflyttningen</strong><p>Din fastighetsvärd förmedlar underlaget. Kraftringen tar sedan över ärendet, hjälper dig med elhandelsavtal och nödvändig hantering gentemot elnätsbolaget och återkopplar med bekräftelser.</p><label class="checkbox-label property-test-check" for="movein-service"><input id="movein-service" type="checkbox" name="serviceRequested" required${values.serviceRequested ? ' checked' : ''}><span>Jag vill använda inflyttningsservicen med Kraftringen.</span></label><p class="form-hint">Tjänsten är frivillig. Ett elhandelsavtal förutsätter att du väljer Kraftringens erbjudande.</p></div><div class="property-authority-choice"><strong>Fullmaktssteget</strong><p>I den färdiga tjänsten lämnas den fullmakt som behövs för ärendet. Här provar du steget med en demomarkering.</p><label class="checkbox-label property-test-check" for="movein-authority"><input id="movein-authority" type="checkbox" name="authorityDemo" required${values.authorityDemo ? ' checked' : ''}><span>Jag markerar fullmaktssteget i demo · utan rättsverkan.</span></label></div><button class="text-button property-decline" type="button" id="property-decline-service">Jag vill ordna elen själv – avstå från tjänsten</button>`;
    return `${summary(values)}<div class="property-receipt-callout"><strong>Underlaget går till din fastighetsvärd</strong><p>Fastighetsvärden förmedlar det vidare till Kraftringen. Registreringen tecknar inget elavtal.</p></div><label class="checkbox-label property-test-check property-review-check"><input type="checkbox" name="demo" required><span>Jag har granskat uppgifterna och använder endast påhittade exempeluppgifter.</span></label>`;
  }
  function renderMovein() {
    const data = settings(), values = ensureDraft(), steps = ['Bostad', 'Kontakt', 'Ditt val', 'Granska'];
    const savedReceipt = !receipt && !declined && moveinStep === 1 ? recoverableRegistration() : null;
    const recovery = savedReceipt ? `<aside class="property-receipt-restore"><div><span class="property-eyebrow">SPARAT I DEN HÄR WEBBLÄSAREN</span><strong>${e(savedReceipt.name)} · ${e(savedReceipt.address)}</strong><small>${e(savedReceipt.id.toUpperCase())} · ${e(status(savedReceipt))}</small></div><button class="btn btn-secondary btn-small" type="button" id="property-receipt-recover" data-receipt-id="${e(savedReceipt.id)}">Visa testunderlag</button></aside>` : '';
    let body;
    if (declined) body = `<section class="card property-receipt"><span class="property-receipt-check">${icon('home')}</span><span class="property-eyebrow">DU ORDNAR ELEN SJÄLV</span><h2>Ditt val är gjort.</h2><p>Du har avstått från inflyttningsservicen. Inget ärende har registrerats eller förmedlats.</p><div class="property-form-actions"><button class="btn btn-secondary" id="property-decline-return">Till partnerarbetsytan</button><button class="btn btn-primary" id="property-receipt-new">Prova tjänsten igen ${icon('arrow')}</button></div></section>`;
    else if (receipt) body = `<section class="card property-receipt"><span class="property-receipt-check">${icon('check')}</span><span class="property-eyebrow">${receipt.recovered ? 'TIDIGARE TESTUNDERLAG' : 'TESTUNDERLAG REGISTRERAT'}</span><h2>${receipt.recovered ? 'Testunderlaget är hittat.' : 'Tack, ' + e(receipt.name.split(' ')[0]) + '!'}</h2><p>${receipt.recovered ? 'Underlaget har hämtats från lokalt sparade testärenden i den här webbläsaren.' : 'Ditt underlag finns nu hos ' + e(partner().name) + ' i testet.'}</p><div class="property-receipt-number">${e(receipt.id.toUpperCase())}<span>${e(status(receipt))}</span></div>${summary(receipt)}<div class="property-receipt-callout"><strong>Aktuellt nästa steg i testet</strong><p>${e(receiptNext(receipt))}</p></div>${!receipt.saved ? `<p class="property-warning">${receipt.draftRetained ? 'Webbläsaren kunde inte spara registreringen. Utkastet är kvar i den här fliken och kan återupptas efter omladdning.' : 'Webbläsaren kunde inte spara registreringen eller utkastet. Underlaget finns bara medan sidan är öppen. Hämta testkvittot innan du lämnar sidan.'}</p>` : receipt.draftCleanupFailed ? '<p class="property-warning">Registreringen är sparad, men webbläsaren kunde inte rensa utkastet. Registrera inte samma underlag igen efter omladdning.</p>' : ''}<div class="property-form-actions"><button class="btn btn-secondary" id="property-receipt-download">${icon('download')} Hämta testkvitto</button><button class="btn btn-primary" id="property-receipt-new">Registrera ett annat testunderlag ${icon('arrow')}</button></div></section>`;
    else body = `<section class="card property-movein-form"><div class="property-form-heading"><span class="property-eyebrow">STEG ${moveinStep} AV 4 · ${steps[moveinStep - 1].toUpperCase()}</span><h2>${['Var flyttar du in?', 'Hur når vi dig?', 'Vill du ha hjälp med elen?', 'Stämmer ditt underlag?'][moveinStep - 1]}</h2><p>${['Ange din nya adress och inflyttningsdatum.', 'Så att vi kan återkoppla om ditt inflyttningsärende. Använd exempeluppgifter i demot.', 'Du väljer om du vill ha hjälp. Här provar du även fullmaktssteget.', 'Granska ditt val och dina uppgifter före registrering.'][moveinStep - 1]}</p></div>${recovery}<form id="property-movein-form">${moveinStep === 1 ? '<div class="property-voluntary-intro"><p>Frivillig service. Inget elavtal tecknas här.</p><button class="text-button property-decline" type="button" id="property-decline-service">Avstå och ordna elen själv</button></div>' : ''}${formFields(values)}<div class="property-form-actions">${moveinStep > 1 ? '<button class="btn btn-secondary" type="button" id="property-movein-back">Tillbaka</button>' : '<span class="property-form-small">Enbart exempeluppgifter</span>'}<button class="btn btn-primary" type="submit">${moveinStep === 4 ? 'Registrera underlag' : 'Fortsätt'} ${icon(moveinStep === 4 ? 'check' : 'arrow')}</button></div></form><div class="property-draft-bar"><p id="property-draft-status" role="status" aria-live="polite"${['unavailable', 'clear-failed'].includes(draftStorageStatus) ? ' class="property-draft-warning"' : ''}>${e(draftStatusText())}</p><button class="text-button" type="button" id="property-draft-start-again">Börja om</button></div></section>`;
    return `<div class="property-resident-shell"><div class="property-resident-preview-bar"><span>${icon('user')} Hyresgästvy · test</span><div><button class="text-button" id="property-return-partner">Till partnerarbetsytan</button><button class="text-button" id="property-return-internal">Till Kraftringen</button></div></div><header class="property-resident-header"><a href="#overview" id="property-resident-brand">${icon('home')}<strong>${e(partner().name)}</strong></a><span>I samarbete med <strong>Kraftringen</strong></span></header><div class="property-resident-layout"><section class="property-resident-intro"><span class="property-resident-tag">${icon('bolt')} Hjälp med elen i ditt nya hem</span><h1>${e(data.welcome)}</h1><p class="property-resident-full-intro">${e(data.intro)}</p><details class="property-resident-mobile-info"><summary>Så hjälper Kraftringen till</summary><p>${e(data.intro)}</p></details>${homeArt()}<div class="property-resident-benefits"><div>${icon('home')}<span><strong>Din fastighetsvärd erbjuder servicen</strong>Du väljer om du vill använda den.</span></div><div>${icon('edit')}<span><strong>Du lämnar underlag och fullmakt</strong>Fastighetsvärden förmedlar ärendet vidare.</span></div><div>${icon('bolt')}<span><strong>Kraftringen hjälper dig vidare</strong>Elkompetens, avtalshantering och bekräftelser.</span></div></div></section><div class="property-resident-form-column">${!receipt && !declined ? `<ol class="property-steps">${steps.map((step, index) => `<li class="${moveinStep === index + 1 ? 'active' : moveinStep > index + 1 ? 'done' : ''}"${moveinStep === index + 1 ? ' aria-current="step"' : ''}><span>${moveinStep > index + 1 ? icon('check') : index + 1}</span>${step}</li>`).join('')}</ol>` : ''}${body}<p class="property-resident-note">${icon('shield')} Test med exempeldata. Ingen verklig fullmakt, elleverans eller avtalsteckning.</p></div></div><div class="property-resident-footer"><span>${e(partner().name)} × Kraftringen</span><span>Lokal förhandsvisning · Den delade testmiljöns åtkomst gäller</span></div></div>`;
  }
  function capture(form, trim = true) {
    for (const key of Object.keys(draftTextFields)) if (form.elements.namedItem(key)) { const value = form.elements.namedItem(key).value; draft[key] = trim ? value.trim() : value; }
    for (const key of ['serviceRequested','authorityDemo']) if (form.elements.namedItem(key)) draft[key] = form.elements.namedItem(key).checked;
  }
  function focusForm() { document.querySelector('.property-movein-form, .property-receipt')?.scrollIntoView({ behavior: 'instant', block: 'start' }); document.querySelector('#property-movein-form input, #property-receipt-download, #property-receipt-new')?.focus({ preventScroll: true }); }
  function startAgain() { clearDraft(P.partner); draft = freshDraft(P.partner); receipt = null; declined = false; moveinStep = 1; P.render(); focusForm(); }
  P.register('movein', { render: renderMovein, bind: () => {
    document.querySelector('#property-return-partner').onclick = () => P.go('overview');
    document.querySelector('#property-resident-brand').onclick = event => { event.preventDefault(); P.go('overview'); };
    document.querySelector('#property-return-internal').onclick = () => P.returnInternal ? P.returnInternal() : (P.role = 'internal', P.go('overview'));
    if (receipt || declined) {
      document.querySelector('#property-receipt-new').onclick = startAgain;
      document.querySelector('#property-decline-return')?.addEventListener('click', () => P.go('overview'));
      document.querySelector('#property-receipt-download')?.addEventListener('click', () => P.download('inflyttningsservice-testkvitto.txt', receiptDownload(receipt)));
      return;
    }
    document.querySelector('#property-receipt-recover')?.addEventListener('click', event => recoverReceipt(event.currentTarget.dataset.receiptId));
    const form = document.querySelector('#property-movein-form');
    const formDraft = draft;
    // A delayed blur/change from a replaced form must not write into another partner's draft.
    const autosave = () => { if (draft !== formDraft || P.partner !== formDraft.partner || receipt || declined) return; capture(form, false); saveDraft(); updateDraftStatus(); };
    form.addEventListener('input', autosave); form.addEventListener('change', autosave);
    document.querySelector('#property-draft-start-again').onclick = startAgain;
    document.querySelector('#property-movein-back')?.addEventListener('click', () => { capture(form); moveinStep--; saveDraft(); P.render(); focusForm(); });
    document.querySelector('#property-fill-example')?.addEventListener('click', () => { const data = settings(); Object.assign(draft, { address: data.address, postcode: data.postcode, city: data.city, apartment: '1202', moveDate: '2026-11-01', name: 'Lo Exempel', email: 'lo@hyresgast.example', phone: '' }); saveDraft(); P.render(); });
    document.querySelector('#property-decline-service')?.addEventListener('click', () => { const cleared = clearDraft(P.partner); declined = true; draft = freshDraft(P.partner); P.render(); focusForm(); if (!cleared) P.toast('Ditt val är gjort, men webbläsaren kunde inte rensa utkastet i fliken.'); });
    const email = form.elements.namedItem('email'); if (email) email.oninput = () => email.setCustomValidity('');
    form.onsubmit = event => {
      event.preventDefault();
      for (const key of moveinStep === 1 ? ['address','city'] : moveinStep === 2 ? ['name'] : []) if (!P.validText(form.elements.namedItem(key))) return;
      if (email && !/^[^\s@]+@[^\s@]+\.example$/i.test(email.value.trim())) { email.setCustomValidity('Använd en påhittad e-postadress som slutar med .example.'); email.reportValidity(); return; }
      if (!form.reportValidity()) return;
      capture(form);
      if (moveinStep < 4) { moveinStep++; saveDraft(); P.render(); focusForm(); return; }
      if (!draft.serviceRequested || !draft.authorityDemo) { moveinStep = 3; saveDraft(); P.render(); focusForm(); return; }
      const at = new Date().toISOString();
      const row = { ...draft, id: uid(), createdAt: at, status: 'Underlag registrerat i test', serviceRequested: true, authorityDemo: true, handoverStatus: 'draft', processing: { trade: 'pending', network: 'pending', offerChoice: 'undecided' }, events: [{ at, actor: 'Hyresgäst · demo', text: 'Hyresgästens testunderlag registrerat. Väntar på partnerns förmedling.', visibility: 'shared' }] };
      init(); P.state.moveins.unshift(row); const saved = P.save();
      const draftRetained = saved ? false : saveDraft();
      const draftCleanupFailed = saved ? !clearDraft(P.partner) : false;
      receipt = { ...row, saved, draftRetained, draftCleanupFailed }; P.render(); focusForm();
    };
  } });
})();
