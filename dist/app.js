(() => {
  'use strict';
  const STORAGE_KEY = 'partnerlabb.active.v1';
  const partners = { syd: 'Exempelpartner Syd', vast: 'Exempelpartner Väst' };
  const statuses = { ny: 'Ny', pagar: 'Pågår', vantar: 'Väntar', avslutad: 'Avslutad' };
  const owners = ['Ej tilldelad', 'Demoansvarig A', 'Demoansvarig B'];
  const $ = (selector) => document.querySelector(selector);
  const escape = (value) => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const dateLabel = (value) => value && !Number.isNaN(new Date(value).getTime()) ? new Intl.DateTimeFormat('sv-SE', { day: 'numeric', month: 'short' }).format(new Date(value)) : 'Ej planerat';
  const seedData = () => [
    { id: 'demo-001', company: 'Exempelbrf Solgläntan', kind: 'BRF', city: 'Lund', partner: 'syd', contact: 'Kim Exempel', email: 'kim@solglantan.example', need: 'Vill diskutera sitt elavtal och vilket underlag som behövs inför en fortsatt dialog.', next: 'Föreslå ett gemensamt första möte', date: '2026-10-12', status: 'pagar', owner: 'Demoansvarig A', events: [
      { at: '2026-10-06T13:30:00Z', actor: 'Internt team', text: 'Vi kan delta i ett första möte. Återkom gärna med förslag på tid.', visibility: 'shared' },
      { at: '2026-10-06T09:00:00Z', actor: 'Internt team', text: 'Exempel på intern anteckning: stäm av vem som deltar från teamet.', visibility: 'internal' },
      { at: '2026-10-05T10:00:00Z', actor: 'Exempelpartner Syd', text: 'Första kontakt dokumenterad. Kunden vill fortsätta dialogen.', visibility: 'shared' }
    ] },
    { id: 'demo-002', company: 'Exempelbolaget Verkstad AB', kind: 'Företag', city: 'Malmö', partner: 'syd', contact: 'Alex Exempel', email: 'alex@verkstad.example', need: 'Vill diskutera elhandel för sin verksamhet. Inga produktval eller priser är överenskomna.', next: 'Stäm av vilka frågor kunden vill ta upp', date: '2026-10-14', status: 'ny', owner: 'Ej tilldelad', events: [
      { at: '2026-10-07T08:00:00Z', actor: 'Exempelpartner Syd', text: 'Affären registrerad med exempeluppgifter.', visibility: 'shared' }
    ] },
    { id: 'demo-003', company: 'Exempelbrf Boklunden', kind: 'BRF', city: 'Helsingborg', partner: 'syd', contact: 'Sam Exempel', email: 'sam@boklunden.example', need: 'Styrelsen vill diskutera sin kommande avtalsperiod. Underlag behöver klargöras i dialogen.', next: 'Följa upp förslag på mötestid', date: '', status: 'vantar', owner: 'Demoansvarig B', events: [
      { at: '2026-10-06T15:00:00Z', actor: 'Exempelpartner Syd', text: 'Väntar på besked om vilken mötestid som passar styrelsen.', visibility: 'shared' }
    ] },
    { id: 'demo-004', company: 'Exempelbolaget Hamnkontor AB', kind: 'Företag', city: 'Göteborg', partner: 'vast', contact: 'Robin Exempel', email: 'robin@hamnkontor.example', need: 'En fiktiv affär för att testa en annan partners vy och geografisk räckvidd.', next: 'Boka ett inledande samtal', date: '2026-10-15', status: 'ny', owner: 'Ej tilldelad', events: [
      { at: '2026-10-07T07:30:00Z', actor: 'Exempelpartner Väst', text: 'Exempel på affär från en annan partner.', visibility: 'shared' }
    ] }
  ];
  let storageFailed = false;
  function readData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return seedData();
      const records = JSON.parse(saved);
      if (!Array.isArray(records) || records.some(record => !record || typeof record.id !== 'string' || typeof record.company !== 'string' || !partners[record.partner] || !statuses[record.status] || !Array.isArray(record.events))) throw new Error('Invalid local demo data');
      return records;
    } catch { return seedData(); }
  }
  let data = readData();
  let role = 'partner';
  let partner = 'syd';
  let selectedId = data.find(record => record.partner === partner)?.id;
  let toastTimer;
  function toast(message) {
    $('#toast').textContent = message;
    $('#toast').hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { $('#toast').hidden = true; }, 5500);
  }
  function persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); storageFailed = false; }
    catch { storageFailed = true; }
  }
  function saved(message) { persist(); render(); toast(storageFailed ? 'Ändringen finns i denna flik, men webbläsaren kunde inte spara den. Exportera testdata innan du stänger.' : message); }
  function availableRecords() { return role === 'internal' ? data : data.filter(record => record.partner === partner); }
  function badge(status) { return `<span class="pill ${escape(status)}">${escape(statuses[status])}</span>`; }
  function event(record, actor, text, visibility = 'shared') { record.events.unshift({ at: new Date().toISOString(), actor, text, visibility }); }
  function renderStats(records) {
    const stats = [
      ['Öppna affärer', records.filter(record => record.status !== 'avslutad').length, 'Alla statusar utom Avslutad', '↗'],
      ['Nya affärer', records.filter(record => record.status === 'ny').length, 'Att ta en första titt på', '＋'],
      [role === 'internal' ? 'Utan intern ansvarig' : 'Väntande affärer', records.filter(record => role === 'internal' ? record.owner === 'Ej tilldelad' : record.status === 'vantar').length, role === 'internal' ? 'Ansvar att fördela i testet' : 'Nästa steg att stämma av', '◷']
    ];
    $('#stats').innerHTML = stats.map(([label, count, hint, icon]) => `<div class="stat"><div><div class="stat-label">${label}</div><div class="stat-number">${count}</div><div class="stat-hint">${hint}</div></div><span class="stat-icon" aria-hidden="true">${icon === '↗' ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 19 19 5M5 5h14v14"/></svg>' : icon}</span></div>`).join('');
  }
  function renderList(records) {
    const query = $('#search').value.trim().toLocaleLowerCase('sv-SE');
    const filter = $('#status-filter').value;
    const visible = records.filter(record => `${record.company} ${record.city} ${record.kind}`.toLocaleLowerCase('sv-SE').includes(query) && (filter === 'all' || record.status === filter));
    $('#list-count').textContent = `${visible.length} av ${records.length} affärer`;
    $('#nav-count').textContent = records.length;
    $('#affair-list').innerHTML = visible.length ? visible.map(record => `<button class="affair-row ${record.id === selectedId ? 'selected' : ''}" data-affair="${escape(record.id)}" aria-pressed="${record.id === selectedId}"><span class="company-avatar" aria-hidden="true">${record.kind === 'BRF' ? 'BRF' : 'AB'}</span><span class="affair-info"><span class="affair-name" style="display:block">${escape(record.company)}</span><span class="affair-meta">${escape(record.kind)} · ${escape(record.city || 'Ort ej angiven')}${role === 'internal' ? `<br>${escape(partners[record.partner])}` : ''}</span><span class="affair-next" style="display:block">${escape(record.next || 'Nästa steg saknas')}</span></span><span class="row-side">${badge(record.status)}<span class="row-arrow" aria-hidden="true">→</span></span></button>`).join('') : '<div class="empty"><strong>Inga affärer i denna lista</strong>Justera sökningen eller registrera en ny exempelaffär.</div>';
  }
  function renderDetail(records) {
    const record = records.find(item => item.id === selectedId);
    if (!record) { $('#detail').innerHTML = '<div class="empty"><strong>Välj en affär</strong>Här ser du nästa steg och återkoppling.</div>'; return; }
    const visibleEvents = record.events.filter(item => role === 'internal' || item.visibility === 'shared');
    $('#detail').innerHTML = `
      <div class="detail-header"><div class="detail-overline"><span class="eyebrow">AFFÄR · ${escape(record.id)}</span>${badge(record.status)}</div><h2>${escape(record.company)}</h2><p>${escape(record.kind)} · ${escape(record.city || 'Ort ej angiven')} · ${escape(partners[record.partner])}</p></div>
      <div class="detail-body"><div class="summary-grid"><div><span class="field-label">Kontakt · exempel</span><span class="field-value">${escape(record.contact || 'Ej angiven')}<br>${escape(record.email)}</span></div><div><span class="field-label">Intern ansvarig</span><span class="field-value">${escape(record.owner)}</span></div><div><span class="field-label">Partnerns nästa steg</span><span class="field-value">${escape(record.next)}</span></div><div><span class="field-label">Planerat datum</span><span class="field-value">${dateLabel(record.date)}</span></div></div>
      <div class="need"><span class="field-label">Kundens frågeställning</span><p>${escape(record.need)}</p></div>
      ${role === 'internal' ? `<form id="assign-form" class="detail-form"><h3>Ansvar & status i testflödet</h3><div class="form-row"><div><label for="owner">Intern ansvarig</label><select id="owner" name="owner">${owners.map(owner => `<option${record.owner === owner ? ' selected' : ''}>${escape(owner)}</option>`).join('')}</select></div><div><label for="status">Status · förslag</label><select id="status" name="status">${Object.entries(statuses).map(([key,label]) => `<option value="${key}"${record.status === key ? ' selected' : ''}>${label}</option>`).join('')}</select></div></div><button class="button secondary" type="submit">Spara ansvar & status</button></form>
      <hr class="section-divider"><form id="feedback-form" class="detail-form"><h3>Återkoppla till partnern</h3><label for="feedback">Meddelande som partnern får se</label><textarea id="feedback" name="feedback" rows="2" maxlength="800" required placeholder="Exempel: föreslå en tid för ett gemensamt möte."></textarea><button class="button primary" type="submit">Dela återkoppling</button></form>
      <hr class="section-divider"><form id="internal-note-form" class="detail-form"><h3>Intern anteckning · demovy</h3><label for="internal-note">Visas endast i den interna demovyn</label><textarea id="internal-note" name="note" rows="2" maxlength="800" required placeholder="Använd enbart fiktivt testinnehåll."></textarea><p class="form-hint">Alla uppgifter finns lokalt i webbläsaren. Detta är inget behörighetsskydd.</p><button class="button secondary" type="submit">Spara intern testanteckning</button></form>` : `<form id="partner-update-form" class="detail-form"><h3>Fortsätt kunddialogen</h3><label for="contact-update">Senaste kontakt eller aktivitet</label><textarea id="contact-update" name="activity" rows="2" maxlength="800" required placeholder="Exempel: kontaktat styrelsen och föreslagit en mötestid."></textarea><label for="update-next">Nästa steg</label><input id="update-next" name="next" maxlength="180" required value="${escape(record.next)}"><label for="update-date">Planerat datum · valfritt</label><input id="update-date" name="date" type="date" value="${escape(record.date)}"><p class="form-hint">Aktiviteten delas med det interna teamet.</p><button class="button primary" type="submit">Spara aktivitet & nästa steg</button></form>`}
      <hr class="section-divider"><h3>${role === 'internal' ? 'Aktivitet & anteckningar' : 'Aktivitet & återkoppling'}</h3><div class="timeline">${visibleEvents.map(item => `<div class="timeline-item"><div class="timeline-time">${dateLabel(item.at)}${item.visibility === 'internal' ? ' · Endast intern demovy' : ''}</div><div class="timeline-author">${escape(item.actor)}</div><p>${escape(item.text)}</p></div>`).join('') || '<p class="form-hint">Ingen aktivitet ännu.</p>'}</div></div>`;
    $('#assign-form')?.addEventListener('submit', e => {
      e.preventDefault();
      const form = new FormData(e.currentTarget);
      const newOwner = form.get('owner'), newStatus = form.get('status');
      if (newOwner === record.owner && newStatus === record.status) { toast('Ingen ändring av ansvar eller status.'); return; }
      record.owner = newOwner; record.status = newStatus;
      event(record, 'Internt team', `Intern ansvarig: ${newOwner}. Status i testflödet: ${statuses[newStatus]}.`);
      saved('Ansvar och status sparade i denna webbläsare.');
    });
    $('#feedback-form')?.addEventListener('submit', e => {
      e.preventDefault();
      const message = $('#feedback').value.trim();
      if (!validNonEmpty($('#feedback'), message)) return;
      event(record, 'Internt team', message);
      saved('Återkopplingen visas nu i partnerns demovy.');
    });
    $('#internal-note-form')?.addEventListener('submit', e => {
      e.preventDefault();
      const message = $('#internal-note').value.trim();
      if (!validNonEmpty($('#internal-note'), message)) return;
      event(record, 'Internt team', message, 'internal');
      saved('Testanteckningen sparad i den interna demovyn.');
    });
    $('#partner-update-form')?.addEventListener('submit', e => {
      e.preventDefault();
      const message = $('#contact-update').value.trim();
      const next = $('#update-next').value.trim();
      if (!validNonEmpty($('#contact-update'), message) || !validNonEmpty($('#update-next'), next)) return;
      record.next = next; record.date = $('#update-date').value;
      event(record, partners[record.partner], `${message}\nNästa steg: ${next}${record.date ? ` (${dateLabel(record.date)})` : ''}.`);
      saved('Aktivitet och nästa steg sparade i denna webbläsare.');
    });
  }
  function validNonEmpty(input, value) {
    input.setCustomValidity(value ? '' : 'Fyll i text, inte enbart blanksteg.');
    input.addEventListener('input', () => input.setCustomValidity(''), { once: true });
    return input.reportValidity();
  }
  function render() {
    const records = availableRecords();
    if (!records.some(record => record.id === selectedId)) selectedId = records[0]?.id;
    $('#partner').hidden = role === 'internal';
    $('#page-title').textContent = role === 'internal' ? 'Teamets partneraffärer' : 'Mina affärer';
    $('#page-description').textContent = role === 'internal' ? 'Fördela ansvar och återkoppla till era aktiva säljpartners.' : 'Håll kontakten, följ affären och planera nästa steg.';
    renderStats(records); renderList(records); renderDetail(records);
  }
  function showPage(page) {
    if (!['affarer', 'material', 'test'].includes(page)) page = 'affarer';
    ['affarer', 'material', 'test'].forEach(name => { $(`#page-${name}`).hidden = name !== page; });
    document.querySelectorAll('nav [data-page]').forEach(button => { button.classList.toggle('active', button.dataset.page === page); button.setAttribute('aria-current', button.dataset.page === page ? 'page' : 'false'); });
    if (location.hash !== `#${page}`) history.replaceState(null, '', `#${page}`);
  }
  $('#role').addEventListener('change', e => { role = e.target.value; render(); });
  $('#partner').addEventListener('change', e => { partner = e.target.value; render(); });
  $('#search').addEventListener('input', () => renderList(availableRecords()));
  $('#status-filter').addEventListener('change', () => renderList(availableRecords()));
  $('#affair-list').addEventListener('click', e => {
    const button = e.target.closest('[data-affair]');
    if (!button) return;
    selectedId = button.dataset.affair; render();
    if (window.innerWidth < 960) $('#detail').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  document.querySelectorAll('[data-page]').forEach(button => button.addEventListener('click', () => showPage(button.dataset.page)));
  window.addEventListener('hashchange', () => showPage(location.hash.slice(1)));
  $('#new-opportunity').addEventListener('click', () => {
    $('#create-form').reset();
    $('#create-form').querySelectorAll('input,textarea').forEach(input => input.setCustomValidity(''));
    $('#create-partner').value = partner;
    $('#create-partner-wrap').hidden = role !== 'internal';
    $('#duplicate-warning').hidden = true;
    $('#create-dialog').showModal();
  });
  ['close-dialog', 'cancel-dialog'].forEach(id => $(`#${id}`).addEventListener('click', () => $('#create-dialog').close()));
  $('#company').addEventListener('input', () => {
    const name = $('#company').value.trim().toLocaleLowerCase('sv-SE');
    $('#duplicate-warning').hidden = !name || !availableRecords().some(record => record.company.toLocaleLowerCase('sv-SE') === name);
  });
  $('#create-form').addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    for (const name of ['company', 'need', 'next']) if (!validNonEmpty(e.currentTarget.elements.namedItem(name), String(form.get(name)).trim())) return;
    const recordPartner = role === 'internal' ? form.get('partner') : partner;
    const record = { id: `test-${crypto.randomUUID().slice(0,8)}`, company: String(form.get('company')).trim(), kind: form.get('kind'), city: String(form.get('city')).trim(), contact: String(form.get('contact')).trim(), email: String(form.get('email')).trim(), need: String(form.get('need')).trim(), next: String(form.get('next')).trim(), date: form.get('date'), partner: recordPartner, status: 'ny', owner: 'Ej tilldelad', events: [] };
    event(record, role === 'internal' ? 'Internt team' : partners[recordPartner], 'Affären registrerad med exempeluppgifter.');
    data.unshift(record); selectedId = record.id;
    $('#search').value = ''; $('#status-filter').value = 'all';
    $('#create-dialog').close();
    saved('Exempelaffären registrerad. Byt demovy för att testa återkopplingen.');
  });
  $('#reset-demo').addEventListener('click', () => {
    if (!window.confirm('Återställa till de fyra ursprungliga exempelaffärerna? Lokala teständringar tas bort.')) return;
    data = seedData(); selectedId = undefined; $('#search').value = ''; $('#status-filter').value = 'all'; saved('Exempeldata återställda.');
  });
  function download(name, content, type) {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const link = document.createElement('a'); link.href = url; link.download = name; document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  $('#export-demo').addEventListener('click', () => {
    const records = availableRecords().map(record => ({ ...record, events: record.events.filter(item => role === 'internal' || item.visibility === 'shared') }));
    download('partnerlabb-exempeldata.json', JSON.stringify({ prototype: true, view: role, note: 'Enbart lokal testdata. Export är inte synkronisering.', records }, null, 2), 'application/json');
    toast('Testdata exporterade för den valda demovyn.');
  });
  $('#download-checklist').addEventListener('click', () => download('partnerlabb-exempelunderlag.txt', 'PARTNERLABB – EXEMPELUNDERLAG\nDiskussionsförslag, inte beslutade krav eller produktvillkor.\n\n1. Vilket företag eller vilken BRF gäller dialogen? Använd ett fiktivt namn i testet.\n2. Vad vill kunden diskutera?\n3. Vilken kontakt eller aktivitet har partnern genomfört?\n4. Vad är nästa steg och vem behöver delta?\n\nPartnerns uppdrag, offertbefogenhet, informationshantering och eventuell ersättning behöver beslutas separat.\n', 'text/plain;charset=utf-8'));
  showPage(location.hash.slice(1)); render();
})();
