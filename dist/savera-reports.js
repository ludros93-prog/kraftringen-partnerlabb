(() => {
  'use strict';
  const P = window.Portal;
  if (!P) return;
  const e = P.e;
  const D = () => P.saveraData;
  const storageKey = P.demoMode ? 'partnerlabb.demo.saveraReports.v1' : 'partnerlabb.saveraReports.v1';
  const defaultFilters = () => ({mode: 'year', value: '2026', product: 'all', seller: 'all', region: 'all', query: '', status: 'all'});
  let current = defaultFilters(), list = 'period', page = 1;
  const pageSize = 20;
  const number = (value, digits = 0) => new Intl.NumberFormat('sv-SE', {maximumFractionDigits: digits, minimumFractionDigits: digits}).format(Number(value) || 0);
  const date = value => value ? new Date(`${String(value).slice(0, 10)}T12:00:00Z`).toLocaleDateString('sv-SE', {day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC'}) : '—';
  const options = mode => D()?.periods(mode) || [];
  function validFilters(input) {
    const result = {...defaultFilters()};
    if (input && ['year', 'month', 'week'].includes(input.mode)) result.mode = input.mode;
    const periods = options(result.mode);
    result.value = periods.some(item => item.value === input?.value) ? input.value : (periods[periods.length - 1]?.value || '2026');
    for (const key of ['product', 'seller', 'region']) {
      const allowed = D()?.[`${key}s`] || [];
      result[key] = input?.[key] === 'all' || allowed.includes(input?.[key]) ? input[key] : 'all';
    }
    result.query = typeof input?.query === 'string' ? input.query.slice(0, 120) : '';
    result.status = ['all', 'active', 'pending', 'ended', 'cancelled'].includes(input?.status) ? input.status : 'all';
    return result;
  }
  function restore() {
    try {
      const saved = JSON.parse(sessionStorage.getItem(storageKey));
      current = validFilters(saved?.filters || saved);
      list = saved?.list === 'active' ? 'active' : 'period';
    } catch { current = defaultFilters(); }
  }
  function save() {
    try { sessionStorage.setItem(storageKey, JSON.stringify({filters: current, list})); } catch {}
  }
  function metricsFilters() { return {...current, query: '', status: 'all'}; }
  function repaint(focusId) {
    if (!['savera', 'insikter'].includes(P.page) || P.role !== 'internal') return;
    P.render();
    if (focusId) document.getElementById(focusId)?.focus();
  }
  function setFilters(patch, render = true) {
    current = validFilters({...current, ...patch}); page = 1; save();
    if (render) repaint();
    return {...current};
  }
  function setListMode(value, render = true) {
    list = value === 'active' ? 'active' : 'period'; page = 1; save();
    if (render) repaint();
    return list;
  }
  function select(key, label, choices, value) {
    return `<label class="sr-filter" for="sr-${key}"><span>${e(label)}</span><select id="sr-${key}" data-sr-filter="${key}">${choices.map(item => `<option value="${e(item.value)}"${item.value === value ? ' selected' : ''}>${e(item.label)}</option>`).join('')}</select></label>`;
  }
  function filterBar() {
    const selected = ['product', 'seller', 'region'].some(key => current[key] !== 'all');
    const secondary = ['seller', 'region'].filter(key => current[key] !== 'all').length;
    const catalogue = key => [{value: 'all', label: key === 'product' ? 'Alla elavtal' : key === 'seller' ? 'Alla säljare' : 'Alla områden'}, ...(D()?.[`${key}s`] || []).map(value => ({value, label: value}))];
    return `<section class="sr-filter-bar" aria-label="Gemensamma rapportfilter"><div class="sr-primary-filters"><fieldset class="sr-period-mode"><legend>Visa period</legend><div class="sr-segmented">${[['year', 'År'], ['month', 'Månad'], ['week', 'Vecka']].map(([mode, label]) => `<button type="button" data-sr-mode="${mode}" aria-pressed="${current.mode === mode}"${current.mode === mode ? ' class="selected"' : ''}>${label}</button>`).join('')}</div></fieldset>${select('period', current.mode === 'year' ? 'År' : current.mode === 'month' ? 'Månad' : 'Vecka', options(current.mode), current.value)}${select('product', 'Elavtal', catalogue('product'), current.product)}<button type="button" class="sr-reset" id="sr-reset"${selected || current.query || current.status !== 'all' ? '' : ' disabled'}>${P.icon('settings')} Rensa filter</button></div><details class="sr-more-filters"${secondary ? ' open' : ''}><summary>${P.icon('layers')} Fler filter${secondary ? `<span>${secondary}</span>` : ''}</summary><div class="sr-secondary-filters">${select('seller', 'Säljare · exempel', catalogue('seller'), current.seller)}${select('region', 'Geografiskt område', catalogue('region'), current.region)}<p>Elavtal, säljare och område gäller båda rapportsidorna.</p></div></details></section>`;
  }
  function selectionNote(period) {
    const labels = [current.product, current.seller, current.region].filter(value => value !== 'all');
    const partial = period.observedStart > period.start ? ` · observerat ${date(period.observedStart)}–${date(period.observedEnd)}` : period.observedEnd && period.observedEnd < period.end ? ` · utfall till ${date(period.observedEnd)}` : '';
    return `<div class="sr-selection"><span>${P.icon('calendar')} <strong>${e(period.label)}</strong>${e(partial)}</span><span>${labels.length ? e(labels.join(' · ')) : 'Alla elavtal, säljare och områden'}</span></div>`;
  }
  function heading(insights = false) {
    return `<header class="sr-heading"><div><span class="sr-eyebrow">KRAFTRINGEN / SAVERA</span><h1>${insights ? 'Insikter' : 'Savera'}</h1><p>${insights ? 'Förstå kunderna, avtalen och vart försäljningen är på väg.' : 'Avtalen de ger oss. Kunderna som stannar.'}</p></div><div class="sr-page-links"><button type="button" class="btn btn-secondary" data-go="${insights ? 'savera' : 'insikter'}">${P.icon(insights ? 'users' : 'chart')} ${insights ? 'Kunder & avtal' : 'Se insikter'}</button><span class="sr-demo-label">Fiktiva exempel · till 7 okt 2026</span></div></header>`;
  }
  function metric(key, label, value, note, icon, active = false) {
    const tag = active ? 'button' : 'div';
    return `<${tag}${active ? ' type="button" data-sr-list="active"' : ''} class="sr-metric${active ? ' sr-metric-action' : ''}" data-sr-metric="${key}"><div class="sr-metric-label"><span>${e(label)}</span>${P.icon(icon)}</div><strong>${e(value)}</strong><p>${e(note)}</p>${active ? `<span class="sr-metric-link">Visa aktiva kunder ${P.icon('arrow')}</span>` : ''}</${tag}>`;
  }
  function rowMarkup(row) {
    return `<tr data-sr-record="${e(row.id)}"><td data-label="Kund" class="sr-customer-cell"><strong>${e(row.customer || row.name)}</strong><span>${e(row.region)} · ${e(row.customerId)}</span></td><td data-label="Elavtal"><span class="sr-product-name">${e(row.product)}</span></td><td data-label="Säljare">${e(row.seller)}</td><td data-label="Tecknat">${e(date(row.soldDate))}</td><td data-label="Avtalsstart">${e(date(row.startDate))}</td><td data-label="Status"><span class="sr-status sr-status-${e(row.status)}">${e(row.statusLabel)}</span>${row.observedEndDate ? `<small class="sr-end-date">Slut ${e(date(row.observedEndDate))}</small>` : ''}</td><td data-label="Årsvolym" class="sr-number">${e(number(row.annualMWh, 1))}<small>MWh/år</small></td></tr>`;
  }
  function tableMarkup() {
    const rows = D().query({...current, status: list === 'active' ? 'all' : current.status}, {stock: list === 'active'});
    const pages = Math.max(1, Math.ceil(rows.length / pageSize));
    page = Math.max(1, Math.min(page, pages));
    const start = (page - 1) * pageSize;
    const period = D().period(current);
    return `<div class="sr-table-summary"><span id="sr-table-count" role="status" tabindex="-1">${e(number(rows.length))} ${list === 'active' ? 'aktiva kunder' : 'avtal'}${current.query || (list !== 'active' && current.status !== 'all') ? ' matchar listfiltret' : ''}</span><span>${list === 'active' ? `Aktiva ${e(date(period.observedEnd))}, oavsett när avtalet tecknades` : `Tecknade under ${e(period.label.toLocaleLowerCase('sv-SE'))}`}</span></div>${rows.length ? `<table id="sr-customers" class="sr-customer-table"><caption class="sr-only">${list === 'active' ? 'Aktiva kunder vid vald periods observationsdatum' : 'Nya avtal tecknade under vald period'}. Alla kunder är fiktiva. Avtal, säljare och årsvolym per kund.</caption><thead><tr>${['Kund', 'Elavtal', 'Säljare', 'Tecknat', 'Avtalsstart', 'Status', 'Årsvolym'].map(text => `<th scope="col">${text}</th>`).join('')}</tr></thead><tbody>${rows.slice(start, start + pageSize).map(rowMarkup).join('')}</tbody></table><div class="sr-pagination"><span>${e(number(start + 1))}–${e(number(Math.min(start + pageSize, rows.length)))} av ${e(number(rows.length))}</span><div><button type="button" class="sr-pagination-button" data-sr-page="${page - 1}"${page === 1 ? ' disabled' : ''} aria-label="Föregående sida">${P.icon('arrow')}</button><span>Sida ${page} av ${pages}</span><button type="button" class="sr-pagination-button" data-sr-page="${page + 1}"${page === pages ? ' disabled' : ''} aria-label="Nästa sida">${P.icon('arrow')}</button></div></div>` : `<div class="sr-empty">${P.icon('search')}<h3>Inga ${list === 'active' ? 'aktiva kunder' : 'avtal'} matchar</h3><p>Välj en annan period eller justera filtren.</p><button type="button" class="text-button" data-sr-clear-table>Rensa listfilter</button></div>`}`;
  }
  function customerTable() {
    return `<section class="sr-panel sr-customers-panel" aria-labelledby="sr-customers-title"><div class="sr-panel-head"><div><h2 id="sr-customers-title">Kunder & avtal</h2><p>Se kundens elavtal och vem som har sålt det.</p></div><div class="sr-list-tabs" role="group" aria-label="Välj kundlista">${[['period', 'Periodens avtal'], ['active', 'Aktiva kunder']].map(([key, label]) => `<button type="button" data-sr-list="${key}" aria-pressed="${list === key}" class="${list === key ? 'selected' : ''}">${label}</button>`).join('')}</div></div><div class="sr-list-controls"><label class="sr-search" for="sr-search">${P.icon('search')}<span class="sr-only">Sök i kundlistan</span><input id="sr-search" type="search" value="${e(current.query)}" placeholder="Sök kund, avtal eller säljare" maxlength="120" autocomplete="off"></label><label class="sr-list-status" for="sr-status"><span>Status i listan</span><select id="sr-status"${list === 'active' ? ' disabled' : ''}>${[['all', 'Alla statusar'], ['active', 'Aktiv'], ['pending', 'Väntar på start'], ['ended', 'Avslutad'], ['cancelled', 'Bortfall före start']].map(([key, text]) => `<option value="${key}"${(list === 'active' ? 'active' : current.status) === key ? ' selected' : ''}>${text}</option>`).join('')}</select></label></div><p class="sr-list-note">Sökning och status filtrerar kundlistan. Nyckeltalen ovan följer rapportfiltren.</p><div id="sr-table-content">${tableMarkup()}</div></section>`;
  }
  function report() {
    if (P.role !== 'internal') return guard();
    if (!D()) return '<div class="empty">Rapportunderlaget förbereds.</div>';
    const result = D().summary(metricsFilters());
    return `<div class="savera-reports">${heading()}${filterBar()}${selectionNote(result.period)}<section class="sr-metrics" aria-label="Saveras nyckeltal">${metric('agreements', 'Nya avtal', number(result.agreements), 'Tecknade under vald period', 'file')}${metric('annualMWh', 'Avtalad årsvolym', `${number(result.annualMWh, 0)} MWh`, 'Årsvolym för periodens nya avtal', 'bolt')}${metric('activeCount', 'Aktiva kunder', number(result.activeCount), `Hos oss ${date(result.period.observedEnd)}`, 'users', true)}</section>${customerTable()}<div class="sr-footer-links"><span>${P.icon('money')} Kickback följs i ett separat underlag.</span><button type="button" class="text-button" data-sr-kickback>Öppna Saveras kickback ${P.icon('arrow')}</button></div>${definitions(false)}</div>`;
  }
  function productChart(result) {
    const rows = result.products.slice().sort((a, b) => b.agreements - a.agreements || a.product.localeCompare(b.product, 'sv-SE'));
    const max = Math.max(1, ...rows.map(item => item.agreements));
    return `<section class="sr-panel sr-popularity" aria-labelledby="sr-popularity-title"><div class="sr-panel-head"><div><h2 id="sr-popularity-title">Mest valda elavtal</h2><p>Antal nya avtal i vald period.</p></div><span class="sr-panel-tag">${number(rows.reduce((total, row) => total + row.agreements, 0))} avtal</span></div>${rows.some(row => row.agreements) ? `<div class="sr-product-chart">${rows.map(row => `<div class="sr-product-row" data-sr-product="${e(row.product)}"><div><strong>${e(row.product)}</strong><span>${number(row.agreements)} avtal <small>· ${number(row.share * (row.share <= 1 ? 100 : 1), 1)} %</small></span></div><div class="sr-product-track" aria-hidden="true"><span style="width:${row.agreements / max * 100}%"></span></div><small>${number(row.annualMWh, 0)} MWh avtalad årsvolym</small></div>`).join('')}</div>` : '<div class="sr-empty sr-empty-compact"><p>Inga nya avtal i det valda urvalet.</p></div>'}</section>`;
  }
  function trendChart(result) {
    let rows = result.trend;
    const lastObserved = result.period.observedEnd;
    const observedMonth = lastObserved?.slice(0, 7);
    const observedDay = lastObserved ? Number(lastObserved.slice(8)) : 0;
    const completeMonthDays = lastObserved ? new Date(Date.UTC(Number(lastObserved.slice(0, 4)), Number(lastObserved.slice(5, 7)), 0)).getUTCDate() : 0;
    const partialMonth = current.mode === 'year' && observedDay < completeMonthDays;
    if (partialMonth) rows = rows.map(row => row.date.startsWith(observedMonth) ? {...row, label: `${row.label} 1–${observedDay}`} : row);
    if (current.mode === 'month' && rows.length > 14) {
      const grouped = [];
      for (let start = 0; start < rows.length; start += 7) {
        const group = rows.slice(start, start + 7);
        grouped.push({date: group[0].date, label: `${group[0].label}–${group[group.length - 1].label}`, agreements: group.reduce((sum, row) => sum + row.agreements, 0), annualMWh: group.reduce((sum, row) => sum + row.annualMWh, 0)});
      }
      rows = grouped;
    }
    const max = Math.max(1, ...rows.map(row => row.agreements));
    const valueRows = rows.map(row => `<tr><th scope="row">${e(row.label)}</th><td>${number(row.agreements)}</td><td>${number(row.annualMWh, 0)}</td></tr>`).join('');
    return `<section class="sr-panel sr-trend" aria-labelledby="sr-trend-title"><div class="sr-panel-head"><div><h2 id="sr-trend-title">Försäljning över tid</h2><p>Nya avtal under ${e(result.period.label.toLocaleLowerCase('sv-SE'))}.</p></div><span class="sr-panel-tag">Avtal</span></div><div class="sr-trend-chart" aria-label="Antal nya avtal över tid">${rows.map(row => `<div class="sr-trend-bar" title="${e(row.label)}: ${number(row.agreements)} avtal, ${number(row.annualMWh)} MWh årsvolym"><strong>${number(row.agreements)}</strong><div class="sr-trend-track"><span style="height:${row.agreements ? Math.max(3, row.agreements / max * 100) : 0}%"></span></div><span>${e(row.label)}</span></div>`).join('') || '<p class="sr-no-data">Inget observerat utfall i perioden.</p>'}</div>${partialMonth ? `<p class="sr-trend-note">Sista månaden visar endast 1–${observedDay} ${e(new Date(`${lastObserved}T12:00:00Z`).toLocaleDateString('sv-SE', {month: 'long', timeZone: 'UTC'}))}.</p>` : ''}<details class="sr-chart-data"><summary>Visa diagrammets siffror</summary><table><caption class="sr-only">Diagramvärden för periodens försäljning</caption><thead><tr><th scope="col">Period</th><th scope="col">Nya avtal</th><th scope="col">Årsvolym MWh</th></tr></thead><tbody>${valueRows}</tbody></table></details></section>`;
  }
  function tenureCard(group, active, period) {
    return `<div class="sr-tenure-${active ? 'active' : 'completed'}"><span>${P.icon(active ? 'users' : 'clock')} ${active ? 'Kunder aktiva vid periodslut' : 'Kunder som lämnade under perioden'}</span><strong>${group.count ? `${number(group.averageMonths, 1)} <small>mån</small>` : '—'}</strong><h3>${active ? 'Genomsnittlig tid hittills' : 'Genomsnittlig avslutad kundtid'}</h3><p>${active ? `Från avtalsstart till ${e(date(period.observedEnd))}. Kunderna är fortfarande aktiva.` : 'Från avtalsstart till avslut, för kunder som lämnade under vald period.'}</p><small>${number(group.count)} ${active ? 'aktiva kunder i urvalet' : 'avslutade kunder i urvalet'}${!group.count ? ' · inget genomsnitt att visa' : ''}</small></div>`;
  }
  function projectionCard(result) {
    if (!result.valid) return `<section class="sr-projection sr-projection-empty" aria-labelledby="sr-projection-title"><span class="sr-eyebrow">PROGNOS / SAVERA</span><h2 id="sr-projection-title">Om takten håller i sig</h2><p>Välj en period med observerade avtal för att se en prognos.</p><small>Prognosen räknas från fiktivt utfall, aldrig från registrerade kunddialoger.</small></section>`;
    return `<section class="sr-projection" aria-labelledby="sr-projection-title"><div class="sr-projection-heading"><span class="sr-eyebrow">PROGNOS / ${e(date(result.horizon))}</span><span class="sr-projection-tag">Vid samma försäljningstakt</span></div><h2 id="sr-projection-title">Om takten håller i sig</h2><div class="sr-projection-values"><div><strong>≈ ${number(result.forecastAgreements, 0)}</strong><span>nya avtal under helåret 2026</span></div><div><strong>≈ ${number(result.forecastAnnualMWh, 0)}</strong><span>MWh avtalad årsvolym</span></div></div><div class="sr-projection-baseline"><span><strong>${number(result.yearToDateAgreements)}</strong> avtal hittills i år</span>${P.icon('arrow')}<span><strong>≈ ${number(result.forecastAdditionalAgreements, 0)}</strong> till under årets återstående ${number(result.remainingDays)} dagar</span></div><p class="sr-projection-note">Takten bygger på ${number(result.basisAgreements)} avtal under ${number(result.basisDays)} observerade dagar (${e(date(result.basisStart))}–${e(date(result.basisEnd))}). Årsutfall till ${e(date(result.asOf))} plus samma dagstakt till årets slut.</p><small>En enkel prognos vid oförändrad takt. Säsong, kommande kampanjer och kundbortfall är inte inräknade.</small></section>`;
  }
  function insights() {
    if (P.role !== 'internal') return guard();
    if (!D()) return '<div class="empty">Rapportunderlaget förbereds.</div>';
    const filters = metricsFilters(), result = D().insights(filters), forecast = D().projection(filters);
    return `<div class="savera-reports savera-insights">${heading(true)}${filterBar()}${selectionNote(result.period)}<section class="sr-panel sr-tenure" aria-labelledby="sr-tenure-title"><div class="sr-panel-head"><div><h2 id="sr-tenure-title">Hur länge stannar kunderna?</h2><p>Avslutad kundtid och tid hittills följs var för sig.</p></div></div><div class="sr-tenure-grid">${tenureCard(result.completed, false, result.period)}${tenureCard(result.active, true, result.period)}</div></section><div class="sr-insights-grid">${productChart(result)}${trendChart(result)}</div>${projectionCard(forecast)}${definitions(true)}</div>`;
  }
  function definitions(insights) {
    return `<details class="sr-definitions"><summary>${P.icon('help')} Så räknar vi</summary><div><p><strong>Nya avtal:</strong> tecknade under den valda försäljningsperioden. Ett senare bortfall ändrar kundens status men gör inte teckningshändelsen osynlig. <strong>Årsvolym:</strong> avtalad årlig volym för dessa avtal, inte levererad el under perioden.</p><p><strong>Aktiva kunder:</strong> kunder med ett påbörjat avtal som ännu inte avslutats vid periodens observationsdatum. De kan ha kommit via Savera före vald period. Avtal som väntar på start eller faller bort före start räknas inte som aktiva.</p>${insights ? '<p><strong>Kundtid:</strong> avslutad kundtid beräknas från avtalsstart till avslut för kunder som lämnade under vald period, inklusive kunder från tidigare år. Aktiva kunders ålder räknas separat till periodens observationsdatum. Den visar hur länge de hittills stannat, inte deras slutliga livslängd.</p><p><strong>Prognos:</strong> valt urvals nya avtal och årsvolym per observerad kalenderdag, extrapolerat från 7 oktober till 31 december 2026 och adderat till samma urvals årsutfall hittills. Välj en tidigare månad för att jämföra en annan försäljningstakt. Detta är ett villkorat räkneexempel, inte en garanti eller en prognos för antalet aktiva kunder.</p>' : ''}<p><strong>Exempeldata:</strong> ett separat, fiktivt avtalsregister till 7 oktober 2026 med en äldre ingående kundbas. Det ändrar inga kunddialoger, inflyttningsärenden, ekonomiska exempel eller kickback. Kickbackposter har egen underlagsperiod och påverkas inte av rapportens produkt- eller säljarfilter.</p></div></details>`;
  }
  function guard() { return '<div class="empty"><h2>Välj Kraftringens vy</h2><p>Den här uppföljningen finns i den interna demovyn.</p><button type="button" class="btn btn-secondary" data-go="overview">Till din översikt</button></div>'; }
  function bindTable() {
    document.querySelectorAll('[data-sr-page]').forEach(button => button.addEventListener('click', () => {
      const desired = Number(button.dataset.srPage); if (!Number.isInteger(desired) || desired < 1) return;
      const direction = desired > page ? 1 : -1;
      page = desired; updateTable(); document.getElementById('sr-table-count')?.scrollIntoView({block: 'nearest'});
      const sameDirection = document.querySelector(`[data-sr-page="${page + direction}"]`);
      const oppositeDirection = document.querySelector(`[data-sr-page="${page - direction}"]`);
      if (sameDirection && !sameDirection.disabled) sameDirection.focus();
      else if (oppositeDirection && !oppositeDirection.disabled) oppositeDirection.focus();
      else document.getElementById('sr-table-count')?.focus();
    }));
    document.querySelector('[data-sr-clear-table]')?.addEventListener('click', () => {
      current.query = ''; current.status = 'all'; page = 1; save(); repaint('sr-search');
    });
  }
  function updateTable() {
    const content = document.getElementById('sr-table-content');
    if (!content || P.page !== 'savera' || P.role !== 'internal') return;
    content.innerHTML = tableMarkup(); bindTable();
    const reset = document.getElementById('sr-reset');
    if (reset) reset.disabled = !(['product', 'seller', 'region'].some(key => current[key] !== 'all') || current.query || current.status !== 'all');
  }
  function bind() {
    if (P.role !== 'internal' || !D()) return;
    document.querySelectorAll('[data-sr-mode]').forEach(button => button.addEventListener('click', () => {
      const mode = button.dataset.srMode;
      if (!['year', 'month', 'week'].includes(mode)) return;
      const selectedDate = D().period(current).observedEnd || D().cutoff || '2026-10-07';
      const match = options(mode).find(option => {
        const period = D().period({...current, mode, value: option.value});
        return period.start <= selectedDate && period.end >= selectedDate;
      });
      setFilters({mode, value: match?.value || options(mode).slice(-1)[0]?.value}, false);
      repaint(); document.querySelector(`[data-sr-mode="${mode}"]`)?.focus();
    }));
    document.querySelectorAll('[data-sr-filter]').forEach(select => select.addEventListener('change', () => {
      const key = select.dataset.srFilter === 'period' ? 'value' : select.dataset.srFilter;
      setFilters({[key]: select.value}, false); repaint(select.id);
    }));
    document.getElementById('sr-reset')?.addEventListener('click', () => {
      setFilters({product: 'all', seller: 'all', region: 'all', query: '', status: 'all'}, false); repaint('sr-product');
    });
    document.querySelectorAll('[data-sr-list]').forEach(button => button.addEventListener('click', () => {
      setListMode(button.dataset.srList, false); repaint();
      document.querySelector(`.sr-list-tabs [data-sr-list="${list}"]`)?.focus();
    }));
    document.getElementById('sr-search')?.addEventListener('input', event => {
      current.query = event.target.value.slice(0, 120); page = 1; save(); updateTable();
    });
    document.getElementById('sr-status')?.addEventListener('change', event => {
      current.status = event.target.value; page = 1; save(); updateTable();
    });
    document.querySelector('[data-sr-kickback]')?.addEventListener('click', () => {
      if (typeof P.kickback?.selectPartner === 'function') P.kickback.selectPartner('syd');
      else if (typeof P.partnerKickback?.selectPartner === 'function') P.partnerKickback.selectPartner('syd');
      else P.go('kickback');
    });
    bindTable();
  }
  restore();
  P.saveraReports = {filters: () => ({...current}), setFilters, reset: () => {current = defaultFilters(); list = 'period'; page = 1; save(); repaint();}, listMode: () => list, setListMode, storageKey};
  P.register('savera', {render: report, bind});
  P.register('insikter', {render: insights, bind});
})();
