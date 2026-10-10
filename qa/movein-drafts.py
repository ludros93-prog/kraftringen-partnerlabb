from playwright.sync_api import sync_playwright
import json, os, pathlib, shutil, tempfile

BASE = os.environ.get('PARTNERLABB_QA_URL', 'http://127.0.0.1:8000/').rstrip('/') + '/'
OUT = pathlib.Path(tempfile.mkdtemp(prefix='partnerlabb-draft-qa-'))
KEY = 'partnerlabb.moveinDraft.v1.'

def step(page):
    return page.locator('.property-form-heading .property-eyebrow').inner_text().split(' · ', 1)[0]

def next_step(page):
    page.locator('#property-movein-form button[type=submit]').click()

def snapshot(page):
    return page.evaluate('''() => ({records: Portal.state.records.length, offers: Portal.state.offers.length, moveins: Portal.state.moveins.length, financial: JSON.stringify(Portal.commercial.partnerIds.map(id => ({partner: id, current: Portal.commercial.valuesFor(id), previous: Portal.commercial.valuesFor(id, true)})))})''')

def start(page, partner='estate1'):
    page.goto(BASE + '?movein=' + partner + '#movein')

def reach_choices(page):
    page.locator('#property-fill-example').click(); next_step(page); next_step(page)
    assert step(page) == 'STEG 3 AV 4'

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=shutil.which('chromium') or shutil.which('chromium-browser'), args=['--no-sandbox'])
    context = browser.new_context(viewport={'width': 1440, 'height': 1000})
    page = context.new_page()
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    start(page)
    initial = snapshot(page)
    page.locator('#movein-address').fill('Testgatan 17')
    assert 'Utkast sparat i den här fliken' in page.locator('#property-draft-status').inner_text()
    page.reload()
    assert page.locator('#movein-address').input_value() == 'Testgatan 17'
    assert snapshot(page) == initial

    page.locator('#property-fill-example').click(); next_step(page)
    page.locator('#movein-name').fill('Utkast Exempel')
    page.reload()
    assert step(page) == 'STEG 2 AV 4'
    assert page.locator('#movein-name').input_value() == 'Utkast Exempel'
    page.locator('#property-return-partner').click()
    page.evaluate("Portal.openMovein('estate1')")
    assert step(page) == 'STEG 2 AV 4'
    assert page.locator('#movein-name').input_value() == 'Utkast Exempel'

    page.evaluate("Portal.openMovein('estate2')")
    assert step(page) == 'STEG 1 AV 4'
    assert page.locator('#movein-address').input_value() == ''
    page.locator('#movein-address').fill('Andra testgatan 8')
    page.evaluate("window.oldMoveinAddress = document.querySelector('#movein-address')")
    page.evaluate("Portal.openMovein('estate1')")
    page.evaluate("window.oldMoveinAddress.dispatchEvent(new Event('change', { bubbles: true }))")
    assert page.locator('#movein-name').input_value() == 'Utkast Exempel'
    assert page.evaluate("JSON.parse(sessionStorage.getItem('partnerlabb.moveinDraft.v1.estate1')).fields.address") == 'Exempelgatan 4'
    page.evaluate("Portal.openMovein('estate2')")
    page.reload()
    assert page.locator('#movein-address').input_value() == 'Andra testgatan 8'
    page.locator('#property-decline-service').click()
    assert page.locator('.property-receipt h2').inner_text() == 'Ditt val är gjort.'
    assert page.evaluate(f"sessionStorage.getItem('{KEY}estate2')") is None
    assert snapshot(page) == initial
    page.reload()
    assert page.locator('#movein-address').input_value() == ''

    page.evaluate("Portal.openMovein('estate1')")
    next_step(page)
    page.locator('#movein-service').check(); page.locator('#movein-authority').check()
    page.reload()
    assert step(page) == 'STEG 3 AV 4'
    assert page.locator('#movein-service').is_checked() and page.locator('#movein-authority').is_checked()
    page.locator('#property-draft-start-again').click()
    assert page.locator('#movein-address').input_value() == ''
    assert page.evaluate(f"sessionStorage.getItem('{KEY}estate1')") is None
    page.reload()
    reach_choices(page)
    assert not page.locator('#movein-service').is_checked()
    assert not page.locator('#movein-authority').is_checked()
    page.locator('#movein-service').check(); page.locator('#movein-authority').check(); next_step(page)
    page.reload()
    assert step(page) == 'STEG 4 AV 4'
    assert not page.locator('input[name=demo]').is_checked()
    before_register = snapshot(page)
    page.locator('input[name=demo]').check(); next_step(page)
    assert page.locator('.property-receipt h2').inner_text() == 'Tack, Lo!'
    assert page.evaluate(f"sessionStorage.getItem('{KEY}estate1')") is None
    after_register = snapshot(page)
    assert after_register['moveins'] == before_register['moveins'] + 1
    assert all(after_register[key] == before_register[key] for key in ['records', 'offers', 'financial'])
    page.reload()
    assert step(page) == 'STEG 1 AV 4'
    assert page.locator('#movein-address').input_value() == ''

    reach_choices(page)
    page.locator('#movein-service').check(); page.locator('#movein-authority').check(); next_step(page)
    persisted_before = snapshot(page)
    page.evaluate('Portal.save = () => false')
    page.locator('input[name=demo]').check(); next_step(page)
    assert 'Utkastet är kvar i den här fliken' in page.locator('.property-warning').inner_text()
    assert page.evaluate(f"sessionStorage.getItem('{KEY}estate1')") is not None
    page.reload()
    assert step(page) == 'STEG 4 AV 4'
    assert snapshot(page) == persisted_before
    assert not page.locator('input[name=demo]').is_checked()

    assert page.evaluate('Portal.propertyDrafts.clearAll()') is True
    page.reload()
    assert step(page) == 'STEG 1 AV 4'
    assert page.locator('#movein-address').input_value() == ''
    assert page.evaluate(f"sessionStorage.getItem('{KEY}estate2')") is None

    for malformed in ['{bad json', json.dumps({'version': 1, 'partner': 'estate2', 'step': 99, 'fields': {}}), json.dumps({'version': 1, 'partner': 'estate1', 'step': 2, 'fields': {'name': 4}})]:
        page.evaluate('(value) => sessionStorage.setItem("' + KEY + 'estate1", value)', malformed)
        page.reload()
        assert step(page) == 'STEG 1 AV 4'
        assert page.locator('#movein-address').input_value() == ''
        assert page.evaluate(f"sessionStorage.getItem('{KEY}estate1')") is None

    page.locator('#movein-address').fill('Schema test 1')
    page.evaluate('''() => { const key = 'partnerlabb.moveinDraft.v1.estate1'; const saved = JSON.parse(sessionStorage.getItem(key)); saved.fields.owner = 'Injected'; saved.fields.id = 'Injected'; sessionStorage.setItem(key, JSON.stringify(saved)); }''')
    page.reload()
    stored = page.evaluate(f"JSON.parse(sessionStorage.getItem('{KEY}estate1')).fields")
    assert 'owner' not in stored and 'id' not in stored
    assert page.locator('#movein-address').input_value() == 'Schema test 1'
    page.evaluate('Portal.propertyDrafts.clearAll()'); page.reload()
    page.evaluate('''() => Object.defineProperty(window, 'sessionStorage', { value: { getItem() { throw Error('Blocked'); }, setItem() { throw Error('Blocked'); }, removeItem() { throw Error('Blocked'); } }, configurable: true })''')
    page.locator('#movein-address').fill('Tillfälligt test 5')
    assert 'kan inte sparas' in page.locator('#property-draft-status').inner_text()
    assert 'Utkast sparat' not in page.locator('#property-draft-status').inner_text()
    page.locator('#property-fill-example').click(); next_step(page)
    page.locator('#movein-name').fill('Osparat Exempel')
    page.locator('#property-return-partner').click(); page.evaluate("Portal.openMovein('estate1')")
    assert step(page) == 'STEG 2 AV 4'
    assert page.locator('#movein-name').input_value() == 'Osparat Exempel'
    assert page.evaluate('Portal.propertyDrafts.clearAll()') is False
    page.reload()
    for width in [320, 390]:
        page.set_viewport_size({'width': width, 'height': 844})
        page.locator('#movein-address').fill('Tangentbordstest 3')
        page.locator('#property-draft-start-again').focus(); page.keyboard.press('Enter')
        assert page.locator('#movein-address').input_value() == ''
        assert page.locator('#movein-address').evaluate('(el) => el === document.activeElement')
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
        page.locator('#movein-address').fill('Mobilt utkast 4')
        assert page.locator('#property-draft-start-again').is_visible()
        page.screenshot(path=str(OUT / f'movein-draft-{width}.png'), full_page=True)

    # Exercise the user's global reset, rather than only calling the module API.
    page.evaluate('''() => { const original = JSON.parse(sessionStorage.getItem('partnerlabb.moveinDraft.v1.estate1')); original.partner = 'estate2'; sessionStorage.setItem('partnerlabb.moveinDraft.v1.estate2', JSON.stringify(original)); Portal.returnInternal(); Portal.go('settings'); }''')
    page.on('dialog', lambda dialog: dialog.accept())
    page.locator('#reset-demo').click()
    assert page.evaluate(f"sessionStorage.getItem('{KEY}estate1')") is None
    assert page.evaluate(f"sessionStorage.getItem('{KEY}estate2')") is None
    assert 'Portalens exempeldata återställda' in page.locator('#toast').inner_text()
    page.evaluate("Portal.openMovein('estate1')")
    assert page.locator('#movein-address').input_value() == ''
    page.locator('#movein-address').fill('Rensningsfel test 9')
    page.evaluate('''() => { const storage = window.sessionStorage; Object.defineProperty(window, 'sessionStorage', { configurable: true, value: { getItem: storage.getItem.bind(storage), setItem: storage.setItem.bind(storage), removeItem() { throw Error('Blocked removal'); } } }); Portal.returnInternal(); Portal.go('settings'); }''')
    page.locator('#reset-demo').click()
    assert 'kunde inte rensa alla inflyttningsutkast' in page.locator('#toast').inner_text()
    assert page.evaluate(f"sessionStorage.getItem('{KEY}estate1')") is not None
    page.evaluate("Portal.openMovein('estate1')")
    assert page.locator('#movein-address').input_value() == ''

    blocked = browser.new_context()
    blocked.add_init_script("Object.defineProperty(window, 'sessionStorage', { value: { getItem(){throw Error('Blocked')}, setItem(){throw Error('Blocked')}, removeItem(){throw Error('Blocked')} } })")
    blocked_page = blocked.new_page()
    blocked_page.on('pageerror', lambda error: errors.append(str(error)))
    start(blocked_page)
    assert 'kan inte sparas' in blocked_page.locator('#property-draft-status').inner_text()
    reach_choices(blocked_page)
    blocked_page.locator('#movein-service').check(); blocked_page.locator('#movein-authority').check(); next_step(blocked_page)
    blocked_page.evaluate('Portal.save = () => false')
    blocked_page.locator('input[name=demo]').check(); next_step(blocked_page)
    assert 'registreringen eller utkastet' in blocked_page.locator('.property-warning').inner_text()
    assert not errors, errors
    print('PASS: partial-input reload, step reload/reentry, partner isolation including delayed change, consent restore, decline/reset, safe registration and unchanged commercial values, failed registration, malformed/whitelisted schema, storage-disabled fallback, UI reset success/removal failure, keyboard restart/focus, 320/390px without overflow, no browser errors.')
    browser.close()
