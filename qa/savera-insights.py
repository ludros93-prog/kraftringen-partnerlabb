"""Browser QA for the Savera ledger, insights and property-partner outcomes.

Independent date/stock/volume expectations are calculated from the fictitious
customer ledger, rather than repeating the implementation's report functions.
The suite uses existing Chromium and a coordinator-owned static preview.
"""
import argparse
import asyncio
import datetime as dt
import json
import math
import os
import pathlib
import shutil
import tempfile
from playwright.async_api import async_playwright


BASE = os.environ.get('PARTNERLABB_QA_URL', 'http://127.0.0.1:8000/').rstrip('/') + '/'
OUT = pathlib.Path(os.environ.get('PARTNERLABB_QA_SHOTS', tempfile.mkdtemp(prefix='partnerlabb-insights-qa-')))
MONTH_COUNTS = [17, 18, 19, 20, 22, 24, 24, 26, 31, 6]
MONTH_MWH = [620, 670, 725, 780, 860, 930, 970, 1050, 1320, 250]
MONTH_ACTIVE = [148, 163, 178, 195, 214, 233, 254, 276, 301, 305]
CUTOFF = dt.date(2026, 10, 7)
PRODUCTS = ['Rörligt pris', 'Kvartspris', 'Poolportfölj Trygg', 'Poolportfölj Offensiv', 'Individuell portfölj', 'Kraftringen Stabil']


class Suite:
    def __init__(self, browser):
        self.browser = browser
        self.context = None
        self.page = None
        self.checks = []
        self.errors = []

    def good(self, label, value):
        if not value:
            raise AssertionError(label)
        self.checks.append(label)
        print('PASS ' + label, flush=True)

    async def fresh(self, suffix=''):
        if self.context:
            await self.context.close()
        self.context = await self.browser.new_context(viewport={'width': 1440, 'height': 1000}, locale='sv-SE', accept_downloads=True)
        self.page = await self.context.new_page()
        self.page.on('pageerror', lambda error: self.errors.append(str(error)))
        self.page.set_default_timeout(10000)
        await self.page.goto(BASE + suffix, wait_until='networkidle')
        await self.page.wait_for_function('window.Portal && Portal.saveraData && Portal.saveraReports && Portal.propertyResults')

    async def route(self, name):
        await self.page.evaluate('(name)=>Portal.go(name)', name)

    async def internal(self, name='savera'):
        await self.page.evaluate('Portal.returnInternal()')
        await self.route(name)

    async def partner(self, partner, name='overview'):
        await self.page.evaluate('(id)=>Portal.previewPartner(id)', partner)
        await self.route(name)

    async def nooverflow(self, label):
        widths = await self.page.evaluate('({scroll:document.documentElement.scrollWidth,width:document.documentElement.clientWidth})')
        self.good(label, widths['scroll'] <= widths['width'] + 1)

    async def shot(self, name):
        await self.page.screenshot(path=str(OUT / name), full_page=True)

    async def finance(self):
        return await self.page.evaluate('({outcome:Object.fromEntries(Portal.commercial.partnerIds.map(id=>[id,Portal.commercial.valuesFor(id)])),kickback:JSON.stringify(Portal.partnerKickback.ledger)})')


def date(value):
    return dt.date.fromisoformat(value)


def num_text(value):
    return ''.join(char for char in value if char.isdigit() or char in ',.-').replace(',', '.')


def expect_close(actual, expected, tolerance=0.000001):
    return actual is not None and abs(actual - expected) <= tolerance


def status_at(row, as_of):
    if row['soldDate'] > as_of:
        return None
    if row['cancelledDate'] and row['cancelledDate'] <= as_of:
        return 'cancelled'
    if not row['startDate'] or row['startDate'] > as_of:
        return 'pending'
    if row['endDate'] and row['endDate'] <= as_of:
        return 'ended'
    return 'active'


def selection(ledger, start='2026-01-01', end='2026-10-07', product=None, seller=None, region=None, active=False):
    rows = [row for row in ledger if (not product or row['product'] == product)
            and (not seller or row['seller'] == seller)
            and (not region or row['region'] == region)]
    if active:
        return [row for row in rows if status_at(row, end) == 'active']
    return [row for row in rows if start <= row['soldDate'] <= end]


async def report(test, filters, kind='summary'):
    return await test.page.evaluate('({filters,kind})=>Portal.saveraData[kind](filters)', {'filters': filters, 'kind': kind})


async def data_checks(test):
    await test.fresh()
    page = test.page
    snapshot = await page.evaluate('({ledger:Portal.saveraData.ledger,products:Portal.saveraData.products,cutoff:Portal.saveraData.cutoff,cells:Portal.partnerResultsData.rows({partnerIds:["syd"]})})')
    ledger = snapshot['ledger']
    test.good('kundunderlaget består av 341 unika fiktiva kunder med sex beslutade avtalstyper', len(ledger) == 341 and len({row['customerId'] for row in ledger}) == 341 and snapshot['products'] == PRODUCTS and all(row['fictional'] and row['email'].endswith('.example') for row in ledger))
    new = selection(ledger)
    test.good('årets 207 nya avtal och 8 175 MWh kan räknas från enskilda kundrader', len(new) == 207 and sum(row['annualMWh'] for row in new) == 8175 and snapshot['cutoff'] == CUTOFF.isoformat())
    current = await report(test, {'mode': 'year', 'value': '2026'})
    test.good('årsvyn skiljer 207 nya avtal från 305 aktiva kunder inklusive ingående stock', current['agreements'] == 207 and current['annualMWh'] == 8175 and current['activeCount'] == 305 and len(selection(ledger, active=True)) == 305)
    test.good('aktiva kunder har inträffad avtalsstart och inget inträffat avslut eller bortfall', all(status_at(row, CUTOFF.isoformat()) == 'active' for row in current['activeRows']))

    for index in range(10):
        month = f'2026-{index + 1:02d}'
        start = date(month + '-01')
        next_month = dt.date(2026 + (index == 11), (index + 1) % 12 + 1, 1)
        end = min(CUTOFF, next_month - dt.timedelta(days=1)).isoformat()
        raw = selection(ledger, start.isoformat(), end)
        result = await report(test, {'mode': 'month', 'value': month})
        test.good(f'{month}: antal och årsvolym stämmer med kundrader och tidigare månadsunderlag', len(raw) == MONTH_COUNTS[index] and sum(row['annualMWh'] for row in raw) == MONTH_MWH[index] and result['agreements'] == MONTH_COUNTS[index] and result['annualMWh'] == MONTH_MWH[index])
        test.good(f'{month}: aktiv kundstock räknas vid periodslut över alla startkohorter', result['activeCount'] == MONTH_ACTIVE[index] and len(selection(ledger, end=end, active=True)) == MONTH_ACTIVE[index])

    for product in PRODUCTS:
        raw = selection(ledger, product=product)
        result = await report(test, {'mode': 'year', 'value': '2026', 'product': product})
        original = [row for row in snapshot['cells'] if row['product'] == product]
        test.good(f'avtalsfilter {product} ger samma kunder, antal, MWh och stock', result['agreements'] == len(raw) == sum(row['agreements'] for row in original) and result['annualMWh'] == sum(row['annualMWh'] for row in raw) == sum(row['annualMWh'] for row in original) and result['activeCount'] == len(selection(ledger, product=product, active=True)))

    dimensions = await page.evaluate('({sellers:Portal.saveraData.sellers,regions:Portal.saveraData.regions})')
    seller, region = dimensions['sellers'][0], dimensions['regions'][0]
    filtered = await report(test, {'mode': 'year', 'value': '2026', 'product': PRODUCTS[0], 'seller': seller, 'region': region})
    raw = selection(ledger, product=PRODUCTS[0], seller=seller, region=region)
    test.good('kombinerat avtal-, säljar- och geografifilter använder samma kundpopulation', filtered['agreements'] == len(raw) and filtered['annualMWh'] == sum(row['annualMWh'] for row in raw) and {row['id'] for row in filtered['rows']} == {row['id'] for row in raw})

    weeks = await page.evaluate('Portal.saveraData.periods("week")')
    summed = {'agreements': 0, 'annualMWh': 0}
    all_week_ids = []
    for week in weeks:
        iso_year, iso_week = (int(part) for part in week['value'].replace('-W', '-').split('-'))
        start = dt.date.fromisocalendar(iso_year, iso_week, 1)
        end = min(CUTOFF, start + dt.timedelta(days=6))
        observed_start = max(dt.date(2026, 1, 1), start)
        raw = selection(ledger, observed_start.isoformat(), end.isoformat())
        result = await report(test, {'mode': 'week', 'value': week['value']})
        assert result['agreements'] == len(raw) and result['annualMWh'] == sum(row['annualMWh'] for row in raw), week['value']
        assert result['period']['start'] == start.isoformat() and result['period']['daysObserved'] == (end - observed_start).days + 1, week['value']
        summed['agreements'] += result['agreements']
        summed['annualMWh'] += result['annualMWh']
        all_week_ids.extend(row['id'] for row in result['rows'])
    test.good('alla 41 måndagsveckor avgränsar årets kundrader utan luckor eller dubbelräkning', len(weeks) == 41 and summed == {'agreements': 207, 'annualMWh': 8175} and len(all_week_ids) == len(set(all_week_ids)) == 207)
    first = await report(test, {'mode': 'week', 'value': '2026-W01'})
    last = await report(test, {'mode': 'week', 'value': '2026-W41'})
    test.good('årsgränsens första vecka har fyra observerade dagar och sista veckan tre', first['period']['observedStart'] == '2026-01-01' and first['period']['daysObserved'] == 4 and last['period']['start'] == '2026-10-05' and last['period']['observedEnd'] == '2026-10-07' and last['period']['daysObserved'] == 3)

    insights = await report(test, {'mode': 'year', 'value': '2026'}, 'insights')
    ended = [row for row in ledger if row['endDate'] and '2026-01-01' <= row['endDate'] <= CUTOFF.isoformat()]
    active = selection(ledger, active=True)
    ended_days = sum((date(row['endDate']) - date(row['startDate'])).days for row in ended) / len(ended)
    active_days = sum((CUTOFF - date(row['startDate'])).days for row in active) / len(active)
    test.good('avslutad kundtid använder bara de 15 som lämnat, även äldre kohorter', insights['completed']['count'] == len(ended) == 15 and expect_close(insights['completed']['averageDays'], ended_days))
    test.good('aktiv kundtid är censurerad observerad tid för 305 kvarvarande kunder', insights['active']['count'] == 305 and expect_close(insights['active']['averageDays'], active_days) and 'inte när' in insights['retentionNote'])
    test.good('produktpopularitet och trend summerar exakt valda avtal och MWh', sum(item['agreements'] for item in insights['products']) == 207 and sum(item['annualMWh'] for item in insights['products']) == 8175 and expect_close(sum(item['share'] for item in insights['products']), 1) and [row['agreements'] for row in insights['trend']] == MONTH_COUNTS)
    october = await report(test, {'mode': 'month', 'value': '2026-10'}, 'insights')
    test.good('period utan avslutade kunder visar saknad kundtidsbas, inte noll livslängd', october['completed']['count'] == 0 and october['completed']['averageDays'] is None and october['completed']['averageMonths'] is None)
    for filters in [{'mode': 'year', 'value': '2026'}, {'mode': 'month', 'value': '2026-10'}, {'mode': 'week', 'value': '2026-W41'}, {'mode': 'month', 'value': '2026-09', 'product': PRODUCTS[0], 'seller': seller}]:
        basis = await report(test, filters)
        forecast = await report(test, filters, 'projection')
        ytd = await report(test, {**filters, 'mode': 'year', 'value': '2026'})
        expected_agreements = math.floor(ytd['agreements'] + basis['agreements'] / basis['period']['daysObserved'] * 85 + 0.5)
        expected_mwh = math.floor(ytd['annualMWh'] + basis['annualMWh'] / basis['period']['daysObserved'] * 85 + 0.5)
        test.good(f"prognos {filters['value']} använder samma urval, observerade dagar och 85 återstående dagar", forecast['valid'] and forecast['asOf'] == '2026-10-07' and forecast['horizon'] == '2026-12-31' and forecast['basisDays'] == basis['period']['daysObserved'] and forecast['remainingDays'] == 85 and forecast['forecastAgreements'] == expected_agreements and forecast['forecastAnnualMWh'] == expected_mwh)
    for filters in [{'mode': 'month', 'value': '2026-11'}, {'mode': 'week', 'value': '2026-W54'}, {'mode': 'year', 'value': '2026', 'query': 'INGEN-KUND-MATCHAR'}, {'mode': 'year', 'value': '2026', 'status': 'ended'}]:
        forecast = await report(test, filters, 'projection')
        test.good(f"prognos skapar inget påhittat tempo utan giltig bas: {filters}", not forecast['valid'] and forecast['forecastAgreements'] is None and forecast['forecastAnnualMWh'] is None and bool(forecast['reason']))


async def property_checks(test):
    await test.fresh()
    page = test.page
    await test.partner('estate1', 'property-results')
    test.good('fastighetspartner har en egen tydlig sida för kunder och kickback', await page.locator('h1').inner_text() == 'Kunder & kickback' and await page.locator('#nav [data-go="property-results"]').count() == 1)
    customer_count = int(num_text(await page.locator('[data-property-result="customers"]').inner_text()))
    settled = float(num_text(await page.locator('[data-property-result="settled"]').inner_text()))
    paid = float(num_text(await page.locator('[data-property-result="paid"]').inner_text()))
    remaining = float(num_text(await page.locator('[data-property-result="remaining"]').inner_text()))
    review = float(num_text(await page.locator('[data-property-result="review"]').inner_text()))
    test.good('fastighetspartnerns år visar 136 nya exempelavtal och fristående manuellt kickbackunderlag', customer_count == 136 and settled == 32800 and paid == 29200 and remaining == 3600 and review == 1200)
    test.good('inflyttningshjälp och registreringar presenteras separat från nya kunder', await page.locator('[data-property-result="helped"]').inner_text() == '200' and '250 serviceanmälningar' in await page.locator('.property-results-service').inner_text())
    ledger = await page.evaluate('Portal.partnerKickback.ledger.filter(row=>row.partner==="estate1")')
    actual_settled = sum(row['amount'] for row in ledger if row['status'] != 'review')
    actual_paid = sum(row['paid'] for row in ledger)
    test.good('kickbackkort stämmer med registrerade poster utan provisionsformel', settled == actual_settled and paid == actual_paid and remaining == actual_settled - actual_paid and review == sum(row['amount'] for row in ledger if row['status'] == 'review'))
    await page.locator('[data-property-results-mode="month"]').click()
    await page.locator('#property-results-month').select_option('2026-09')
    test.good('månadsfilter visar rätt nya kunder, hjälp och avstämning', await page.locator('[data-property-result="customers"]').inner_text() == '24' and await page.locator('[data-property-result="helped"]').inner_text() == '36' and num_text(await page.locator('[data-property-result="settled"]').inner_text()) == '6100' and num_text(await page.locator('[data-property-result="paid"]').inner_text()) == '2500')
    same = await page.evaluate('Portal.propertyResults.outcomeFor("estate1",["2026-09"])')
    test.good('partner och Kraftringen använder samma månadsavtal och manuella kickbackposter', same['result']['agreements'] == 24 and same['kickback']['settled'] == 6100 and same['kickback']['paid'] == 2500)
    baseline = await test.finance()
    before = await page.evaluate('({records:Portal.state.records.length,offers:Portal.state.offers.length,moveins:Portal.state.moveins.length,ledger:JSON.stringify(Portal.saveraData.ledger),outcome:Portal.propertyResults.outcomeFor("estate1",["2026-09"])})')
    created = await page.evaluate('''()=>Portal.moveinService.createPartnerRecords([{partner:'estate1',name:'QA Ny Inflyttare',email:'ny@hyresgast.example',address:'Testgränd 9',postcode:'222 22',city:'Lund',moveDate:'2026-11-02'}],{source:'manual'})''')
    await test.route('property-results')
    after = await page.evaluate('({records:Portal.state.records.length,offers:Portal.state.offers.length,moveins:Portal.state.moveins.length,ledger:JSON.stringify(Portal.saveraData.ledger),outcome:Portal.propertyResults.outcomeFor("estate1",["2026-09"])})')
    test.good('manuellt serviceunderlag skapar ett ärende men varken kund, avtal eller kickback', created['saved'] and len(created['created']) == 1 and after['moveins'] == before['moveins'] + 1 and after['records'] == before['records'] and after['offers'] == before['offers'] and after['ledger'] == before['ledger'] and after['outcome'] == before['outcome'] and await test.finance() == baseline)
    await test.partner('estate2', 'property-results')
    test.good('perspektivbyte visar bara andra fastighetspartnerns 57 exempelavtal', await page.locator('[data-property-result="customers"]').inner_text() == '57' and 'Exempelbo Förvaltning' in await page.locator('.property-results-page').inner_text() and 'Exempelfastigheter AB' not in await page.locator('.property-results-page').inner_text())
    await page.locator('[data-property-results-mode="month"]').click()
    await page.locator('#property-results-month').select_option('2026-10')
    test.good('saknat oktoberunderlag ger streck och saknat-status, aldrig nollkickback', all([await page.locator(f'[data-property-result="{key}"]').inner_text() == '—' for key in ['settled', 'paid', 'remaining', 'review']]) and 'Underlag saknas' in await page.locator('.property-results-status').inner_text() and await page.locator('[data-property-result="customers"]').inner_text() == '2' and await page.locator('[data-property-result="helped"]').inner_text() == '4')
    await test.partner('syd', 'property-results')
    test.good('Savera får ingen fastighetspartners resultatvy via direktnavigation', await page.evaluate('Portal.page') == 'overview' and await page.locator('.property-results-page').count() == 0)
    await test.partner('vast', 'property-results')
    test.good('Face2face får ingen fastighetspartners resultatvy via direktnavigation', await page.evaluate('Portal.page') == 'overview' and await page.locator('.property-results-page').count() == 0)
    await test.partner('estate1', 'savera')
    test.good('partner kan inte öppna den interna Savera- eller insiktsvyn', await page.evaluate('Portal.page') == 'overview' and await page.locator('#nav [data-go="savera"],#nav [data-go="insikter"]').count() == 0)
    await test.route('insikter')
    test.good('direkt insiktsnavigation respekterar internt perspektiv', await page.evaluate('Portal.page') == 'overview')
    await test.partner('estate1')
    await page.evaluate('Portal.returnInternal();Portal.selectedPartnerId="estate2";Portal.go("property-results")')
    test.good('intern vald fastighetspartner går före den senast förhandsvisade partnern', await page.evaluate('Portal.page') == 'property-results' and await page.locator('[data-property-result="customers"]').inner_text() == '2' and 'Exempelbo Förvaltning' in await page.locator('.property-results-page').inner_text())
    await test.partner('estate1')
    await test.route('property-results')
    for width in [1440, 390, 320]:
        await page.set_viewport_size({'width': width, 'height': 1000 if width == 1440 else 844})
        await test.nooverflow(f'fastighetsuppföljning saknar sidöverflöde vid {width}px')
        await test.shot(f'property-results-{width}.png')
    await test.route('overview')
    test.good('fastighetsöversikten behåller två arbetsvägar utan aktiv hyresgäst', await page.locator('[data-property-intake="manual"]').count() == 1 and await page.locator('[data-property-intake="import"]').count() == 1 and await page.locator('#property-movein-form,#movein-service,#movein-authority').count() == 0)


async def metric_values(page):
    return {key: float(num_text(await page.locator(f'[data-sr-metric="{key}"] strong').inner_text())) for key in ['agreements', 'annualMWh', 'activeCount']}


async def table_ids(page):
    return await page.locator('tr[data-sr-record]').evaluate_all('(rows)=>rows.map(row=>row.dataset.srRecord)')


async def ui_checks(test):
    await test.fresh()
    page = test.page
    await test.internal()
    await page.evaluate('Portal.saveraReports.reset()')
    ledger = await page.evaluate('Portal.saveraData.ledger')
    test.good('intern navigation visar tydliga Savera- och Insikter-sidor', await page.locator('#nav [data-go="savera"]').count() == 1 and await page.locator('#nav [data-go="insikter"]').count() == 1 and await page.locator('h1').inner_text() == 'Savera')
    test.good('Savera öppnas med år, 207 avtal, 8 175 MWh och 305 aktiva kunder', await page.locator('[data-sr-mode="year"]').get_attribute('aria-pressed') == 'true' and await metric_values(page) == {'agreements': 207, 'annualMWh': 8175, 'activeCount': 305} and await page.locator('#sr-table-count').inner_text() == '207 avtal')
    page_ids = []
    while True:
        page_ids.extend(await table_ids(page))
        next_button = page.get_by_role('button', name='Nästa sida', exact=True)
        if await next_button.is_disabled():
            break
        await next_button.click()
    expected = selection(ledger)
    test.good('paginering ger alla 207 kunders enskilda avtal utan dubblering eller tappade rader', len(page_ids) == len(set(page_ids)) == 207 and set(page_ids) == {row['id'] for row in expected})
    test.good('sista pagineringssidan behåller fokus på föregående när nästa blir inaktiv', await page.get_by_role('button', name='Nästa sida', exact=True).is_disabled() and await page.evaluate('document.activeElement.getAttribute("aria-label")') == 'Föregående sida')
    await page.get_by_role('button', name='Föregående sida', exact=True).click()
    test.good('bakåt i kundlistan behåller fokus på föregående utan att flytta till nästa', len(await table_ids(page)) == 20 and await page.evaluate('document.activeElement.getAttribute("aria-label")') == 'Föregående sida')
    while not await page.get_by_role('button', name='Föregående sida', exact=True).is_disabled():
        await page.get_by_role('button', name='Föregående sida', exact=True).click()
    test.good('första pagineringssidan erbjuder nästa när föregående blir inaktiv', await page.get_by_role('button', name='Föregående sida', exact=True).is_disabled() and await page.evaluate('document.activeElement.getAttribute("aria-label")') == 'Nästa sida')
    await page.locator('#sr-product').select_option(PRODUCTS[0])
    product_expected = selection(ledger, product=PRODUCTS[0])
    stock_expected = selection(ledger, product=PRODUCTS[0], active=True)
    test.good('elavtalsfiltret uppdaterar nyckeltal, aktiva kunder och samma kundrader', await metric_values(page) == {'agreements': len(product_expected), 'annualMWh': sum(row['annualMWh'] for row in product_expected), 'activeCount': len(stock_expected)} and set(await table_ids(page)).issubset({row['id'] for row in product_expected}) and len(await table_ids(page)) == min(20, len(product_expected)))
    test.good('avtalsfilter behåller tangentbordsfokus efter omrendering', await page.evaluate('document.activeElement.id') == 'sr-product')
    await page.locator('.sr-more-filters summary').click()
    seller = product_expected[0]['seller']
    region = product_expected[0]['region']
    await page.locator('#sr-seller').select_option(seller)
    await page.locator('#sr-region').select_option(region)
    combined = selection(ledger, product=PRODUCTS[0], seller=seller, region=region)
    test.good('extra säljar- och geografifilter fungerar tillsammans med elavtal', (await metric_values(page))['agreements'] == len(combined) and set(await table_ids(page)) == {row['id'] for row in combined})
    saved = await page.evaluate('Portal.saveraReports.filters()')
    await page.locator('[data-go="insikter"]').first.click()
    insights = await report(test, saved, 'insights')
    test.good('Insikter tar med samma rapportfilter från Savera', await page.locator('h1').inner_text() == 'Insikter' and await page.locator('#sr-product').input_value() == saved['product'] and await page.locator('#sr-seller').input_value() == saved['seller'] and await page.locator('#sr-region').input_value() == saved['region'])
    popular = await page.locator('.sr-product-row').inner_text()
    test.good('produktdiagrammet följer samma kombinerade kundurval', PRODUCTS[0] in popular and f"{len(combined)} avtal" in popular and await page.locator('.sr-product-row').count() == 1)
    completed_display = await page.locator('.sr-tenure-completed strong').inner_text()
    active_display = await page.locator('.sr-tenure-active strong').inner_text()
    expected_completed = insights['completed']['averageMonths']
    expected_active = insights['active']['averageMonths']
    test.good('kundtid visas separat för avslutade och ännu aktiva kunder', (completed_display == '—' if expected_completed is None else abs(float(num_text(completed_display)) - expected_completed) <= .051) and (active_display == '—' if expected_active is None else abs(float(num_text(active_display)) - expected_active) <= .051))
    await page.reload(wait_until='networkidle')
    test.good('rapportfilter och aktuell sida består efter omladdning', await page.evaluate('Portal.page') == 'insikter' and await page.evaluate('Portal.saveraReports.filters()') == saved)
    await page.locator('#sr-reset').click()
    await page.locator('[data-sr-mode="month"]').click()
    await page.locator('#sr-period').select_option('2026-10')
    test.good('oktober visar inget påhittat genomsnitt för kunder som ännu inte lämnat', await page.locator('.sr-tenure-completed strong').inner_text() == '—' and '0 avslutade kunder' in await page.locator('.sr-tenure-completed').inner_text())
    projection = await page.locator('.sr-projection').inner_text()
    test.good('oktoberprognosen visar cirka 280 avtal med 6 avtal på 7 observerade dagar', '280' in projection and '6 avtal under 7 observerade dagar' in projection and '85 dagar' in projection and 'Säsong' in projection)
    await page.locator('[data-sr-mode="week"]').click()
    test.good('veckoval behåller observationsdatum och väljer aktuell måndagsvecka 41', await page.locator('#sr-period').input_value() == '2026-W41' and '3 avtal under 3 observerade dagar' in await page.locator('.sr-projection').inner_text() and await page.locator('.sr-trend-bar').count() == 3)
    await page.locator('[data-sr-mode="year"]').focus()
    await page.keyboard.press('Enter')
    test.good('periodbyte fungerar med tangentbord och behåller korrekt tryckt-status', await page.locator('#sr-period').input_value() == '2026' and await page.locator('[data-sr-mode="year"]').get_attribute('aria-pressed') == 'true')
    october_label = page.locator('.sr-trend-bar').last.locator(':scope > span')
    test.good('årsdiagrammets sista stapel märks synligt som oktober 1–7, inte hel månad', await october_label.is_visible() and '1–7' in await october_label.inner_text() and '1–7 oktober' in await page.locator('.sr-trend-note').inner_text())
    await page.locator('[data-go="savera"]').first.click()
    await page.locator('.sr-list-tabs [data-sr-list="active"]').click()
    ids = await table_ids(page)
    test.good('aktivkundlistan visar stock från tidigare år, inte bara årets nya avtal', await page.locator('#sr-table-count').inner_text() == '305 aktiva kunder' and await page.locator('#sr-status').is_disabled() and all(status_at(next(row for row in ledger if row['id'] == rid), '2026-10-07') == 'active' for rid in ids))
    await page.locator('.sr-list-tabs [data-sr-list="period"]').click()
    baseline_metrics = await metric_values(page)
    target = selection(ledger)[0]
    await page.locator('#sr-search').fill(target['id'])
    test.good('kundsökning hittar ett specifikt avtal utan att ändra huvudnyckeltalen', await table_ids(page) == [target['id']] and await metric_values(page) == baseline_metrics and await page.evaluate('document.activeElement.id') == 'sr-search')
    await page.locator('#sr-search').fill('INGEN-KUND-MATCHAR')
    test.good('sökning utan träff visar tydligt tomläge och bibehållna nyckeltal', await page.locator('.sr-empty h3').inner_text() == 'Inga avtal matchar' and await page.locator('#sr-table-count').inner_text() == '0 avtal matchar listfiltret' and await metric_values(page) == baseline_metrics)
    await page.locator('[data-sr-clear-table]').click()
    await page.locator('#sr-status').select_option('cancelled')
    cancelled = [row for row in selection(ledger) if status_at(row, '2026-10-07') == 'cancelled']
    test.good('bortfall före start kan filtreras som sex egna avtal, utan att tappa teckningshändelser', set(await table_ids(page)) == {row['id'] for row in cancelled} and len(cancelled) == 6 and await metric_values(page) == baseline_metrics)
    await page.locator('#sr-status').select_option('all')
    await page.locator('[data-sr-mode="month"]').click()
    await page.locator('#sr-period').select_option('2026-01')
    january_ids = await table_ids(page)
    january = [row for row in ledger if row['id'] in january_ids]
    not_observed = next(row for row in january if row['endDate'] and row['endDate'] > '2026-01-31')
    row_text = await page.locator(f'tr[data-sr-record="{not_observed["id"]}"]').inner_text()
    test.good('historisk period visar aktiv status utan att läcka ett senare faktiskt kundavslut', 'Aktiv kund' in row_text and 'Slut ' not in row_text)
    await page.locator('[data-sr-mode="year"]').click()
    await page.locator('#sr-product').select_option(PRODUCTS[3])
    normal = await page.evaluate('Portal.saveraReports.filters()')
    await page.goto(BASE + '?demo=inflyttning&workspace=estate1', wait_until='networkidle')
    await test.internal()
    test.good('kunddemons rapportfilter är isolerade från vanliga labbet', await page.evaluate('Portal.saveraReports.filters()') != normal and await page.locator('#sr-product').input_value() == 'all')
    await page.locator('#sr-product').select_option(PRODUCTS[1])
    await page.goto(BASE + '#savera', wait_until='networkidle')
    test.good('vanliga labbets filter återkommer efter arbete i kunddemot', await page.evaluate('Portal.saveraReports.filters()') == normal and await page.locator('#sr-product').input_value() == PRODUCTS[3])
    await page.evaluate('Portal.saveraReports.reset()')
    for name in ['savera', 'insikter']:
        await test.route(name)
        for width in [1440, 390, 320]:
            await page.set_viewport_size({'width': width, 'height': 1000 if width == 1440 else 844})
            await test.nooverflow(f'{name} saknar sidöverflöde vid {width}px')
            if width != 1440:
                sizes = await page.locator('.savera-reports input,.savera-reports select').evaluate_all('(nodes)=>nodes.map(node=>parseFloat(getComputedStyle(node).fontSize))')
                test.good(f'{name} har minst 16px formulärtext på mobil vid {width}px', bool(sizes) and min(sizes) >= 16)
                meaningful = '.sr-projection-note,.sr-projection>small' if name == 'insikter' else '.sr-metric>p,.sr-list-note'
                notes = await page.locator(meaningful).evaluate_all('(nodes)=>nodes.map(node=>parseFloat(getComputedStyle(node).fontSize))')
                test.good(f'{name} har läsbar viktig mått- och prognosförklaring vid {width}px', bool(notes) and min(notes) >= 12)
            await test.shot(f'{name}-{width}.png')
    test.good('samtliga rapportfilter har explicit tillgängligt namn', await page.locator('label[for="sr-period"],label[for="sr-product"],label[for="sr-seller"],label[for="sr-region"]').count() == 4)


async def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--suite', choices=['all', 'data', 'ui', 'property'], default='all')
    args = parser.parse_args()
    chromium = shutil.which('chromium') or shutil.which('chromium-browser')
    if not chromium:
        raise RuntimeError('Existing Chromium is required; this suite does not install a browser.')
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(executable_path=chromium, headless=True, args=['--no-sandbox'])
        test = Suite(browser)
        try:
            if args.suite in ['all', 'data']:
                await data_checks(test)
            if args.suite in ['all', 'ui']:
                await ui_checks(test)
            if args.suite in ['all', 'property']:
                await property_checks(test)
            test.good('inga JavaScript-fel i berörda vyer och flöden', not test.errors)
            print(json.dumps({'checks': len(test.checks), 'screenshots': str(OUT), 'javascript_errors': test.errors}, ensure_ascii=False), flush=True)
        finally:
            if test.context:
                await test.context.close()
            await browser.close()


if __name__ == '__main__':
    asyncio.run(main())
