"""Browser integration: guided demo, voluntary service and isolated restart."""
import asyncio, json, os, pathlib
from playwright.async_api import async_playwright

BASE = os.environ.get('PARTNERLABB_QA_URL', 'http://127.0.0.1:8000/').rstrip('/') + '/'
OUT = pathlib.Path(os.environ.get('PARTNERLABB_QA_SHOTS', '/workspace/scratch/customer-demo-shots'))

async def main():
    OUT.mkdir(parents=True, exist_ok=True)
    checks = []
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])
        page = await browser.new_page(viewport={'width': 1440, 'height': 1000}, locale='sv-SE')
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        def good(label, value=True):
            assert value, label
            checks.append(label)
            print('PASS ' + label, flush=True)
        async def state():
            return await page.evaluate('JSON.parse(JSON.stringify(Portal.state))')
        async def finance():
            return await page.evaluate('Object.fromEntries(Portal.commercial.partnerIds.map(id=>[id,Portal.commercial.valuesFor(id)]))')
        async def step(number):
            await page.locator(f'#demo-guide .demo-guide-step[data-demo-step="{number}"]').click()
        async def nooverflow(label):
            result = await page.evaluate('({width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth})')
            good(label, result['scroll'] <= result['width'] + 1)

        await page.goto(BASE, wait_until='networkidle')
        await page.evaluate("Portal.state.records[0].company='Bevarat normalt testunderlag';Portal.save();sessionStorage.setItem('partnerlabb.moveinDraft.v1.estate1','bevara normalt utkast')")
        normal = await page.evaluate("localStorage.getItem('partnerlabb.portal.v2')")
        await page.locator('.demo-launch-link').click()
        await page.wait_for_function('Portal.demoMode && Portal.page==="demo"')
        good('separat demoyta laddad', (await state())['records'][0]['company'] != 'Bevarat normalt testunderlag')
        initial = await state()
        finances = await finance()
        await page.screenshot(path=str(OUT / 'demo-start-desktop.png'), full_page=True)
        await page.locator('[data-demo-step="1"]').first.click()
        for number in range(2, 6):
            await step(number)
        good('perspektivval skapar inga nya ärenden eller affärer', await state() == initial)

        await step(2)
        await page.set_viewport_size({'width': 390, 'height': 844})
        box = await page.locator('#movein-address').bounding_box()
        good('första bostadsfältet syns tidigt i mobildemot', box is not None and box['y'] <= 750)
        await page.set_viewport_size({'width': 1440, 'height': 1000})
        await page.locator('#property-fill-example').click()
        await page.locator('#property-movein-form button[type=submit]').click()
        await page.locator('#property-movein-form button[type=submit]').click()
        good('frivilliga val ej förvalda', not await page.locator('#movein-service').is_checked() and not await page.locator('#movein-authority').is_checked())
        await page.locator('#movein-service').check()
        await page.locator('#movein-authority').check()
        await page.locator('#property-movein-form button[type=submit]').click()
        await page.locator('[name=demo]').check()
        await page.locator('#property-movein-form button[type=submit]').click()
        after = await state()
        added = [row for row in after['moveins'] if row['id'] not in {row['id'] for row in initial['moveins']}]
        good('registrering skapar ett serviceärende', len(added) == 1)
        registered_id = added[0]['id']
        good('registrering påverkar inte avtal eller ekonomiska exempel', await finance() == finances and len(after['records']) == len(initial['records']))
        await page.reload(wait_until='networkidle')
        good('demoregistrering består efter omladdning', registered_id in {row['id'] for row in (await state())['moveins']})
        await step(3)
        good('guiden erbjuder faktiskt registrerat underlag', await page.locator(f'[data-demo-open-case="{registered_id}"]').count() == 1)
        await page.locator(f'[data-demo-open-case="{registered_id}"]').click()
        good('underlaget öppnas i befintlig ärendedialog', await page.locator('#portal-dialog').evaluate('(element)=>element.open'))
        await page.locator('#close-dialog').click()

        for width in [1440, 390, 320]:
            await page.set_viewport_size({'width': width, 'height': 1000 if width == 1440 else 844})
            for number in [1, 2, 3, 4, 5]:
                await step(number)
                await nooverflow(f'demoperspektiv {number} vid {width}px')
                if width in [1440, 390] and number in [1, 2, 4]:
                    await page.screenshot(path=str(OUT / f'demo-step-{number}-{width}.png'), full_page=True)
            await page.evaluate("Portal.role='internal';Portal.go('demo')")
            await nooverflow(f'demostart vid {width}px')
            if width == 390:
                await page.screenshot(path=str(OUT / 'demo-start-mobile.png'), full_page=True)
            await page.locator('[data-demo-step="1"]').first.click()

        await page.evaluate('Portal.demoGuide.openStep(2)')
        await page.locator('#property-receipt-new').click() if await page.locator('#property-receipt-new').count() else None
        await page.locator('#movein-address').fill('Separat demoutkast')
        await page.locator('#movein-address').blur()
        good('demoutkast har egen lagring', await page.evaluate("sessionStorage.getItem('partnerlabb.demo.moveinDraft.v1.estate1')!==null"))
        page.once('dialog', lambda dialog: dialog.dismiss())
        await page.locator('[data-demo-reset]').click()
        good('avbruten omstart bevarar demoregistrering', registered_id in {row['id'] for row in (await state())['moveins']})
        page.once('dialog', lambda dialog: dialog.accept())
        await page.locator('[data-demo-reset]').click()
        good('omstart rensar endast kunddemots nya ärenden', registered_id not in {row['id'] for row in (await state())['moveins']})
        good('omstart rensar demoutkast', await page.evaluate("sessionStorage.getItem('partnerlabb.demo.moveinDraft.v1.estate1')===null"))
        good('normaldata och normala utkast bevaras', await page.evaluate("localStorage.getItem('partnerlabb.portal.v2')") == normal and await page.evaluate("sessionStorage.getItem('partnerlabb.moveinDraft.v1.estate1')") == 'bevara normalt utkast')
        await page.set_viewport_size({'width': 1440, 'height': 1000})
        await page.goto(BASE, wait_until='networkidle')
        good('vanlig portal återfinner sparade normala testdata', (await state())['records'][0]['company'] == 'Bevarat normalt testunderlag')
        good('inga JavaScript-fel', not errors)
        await page.screenshot(path=str(OUT / 'internal-polished-desktop.png'), full_page=True)
        await browser.close()
    print(json.dumps({'checks': len(checks), 'screenshots': str(OUT)}, ensure_ascii=False))

asyncio.run(main())
