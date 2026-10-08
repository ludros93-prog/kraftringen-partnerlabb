import asyncio,json,pathlib,traceback,os,shutil,tempfile
from playwright.async_api import async_playwright
OUT=pathlib.Path(tempfile.mkdtemp(prefix='partnerlabb-movein-qa-'))
BASE=os.environ.get('PARTNERLABB_QA_URL','http://127.0.0.1:8000/').rstrip('/')+'/'
async def main():
 async with async_playwright() as pw:
  browser=await pw.chromium.launch(executable_path=shutil.which('chromium') or shutil.which('chromium-browser'),headless=True,args=['--no-sandbox'])
  context=await browser.new_context(viewport={'width':1440,'height':1000},accept_downloads=True)
  page=await context.new_page();errors=[];page.on('pageerror',lambda err:errors.append(str(err)))
  checks=[]
  def good(label,condition=True):
   if not condition:raise AssertionError(label)
   checks.append(label);print('PASS '+label,flush=True)
  async def view(partner=None,route='overview'):
   if partner:
    await page.evaluate('(id)=>Portal.previewPartner(id)',partner)
   else:await page.evaluate('Portal.returnInternal()')
   await page.evaluate('(route)=>Portal.go(route)',route)
  async def state():return await page.evaluate('JSON.parse(JSON.stringify(Portal.state))')
  async def finances():return await page.evaluate('Object.fromEntries(Portal.commercial.partnerIds.map(id=>[id,Portal.commercial.valuesFor(id)]))')
  async def row(rid):return await page.evaluate('(id)=>Portal.state.moveins.find(row=>row.id===id)',rid)
  async def shot(name):
   await page.screenshot(path=str(OUT/name),full_page=True)
  async def nooverflow(label):
   result=await page.evaluate('({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth})')
   good('responsive '+label,result['scroll']<=result['client']+1)
  await page.goto(BASE,wait_until='networkidle')
  good('app loaded',await page.locator('h1').count()==1)
  initial=await state();basefin=await finances();counts={key:len(initial[key]) for key in ['records','offers','consumerSales']}
  good('3 explicit demo service fixtures',len(initial['moveins'])==3)
  await view('estate1');good('property has no internal route in navigation',await page.locator('#nav [data-go="movein-cases"]').count()==0)
  good('partner list isolation',set(await page.evaluate('Portal.moveinService.rows().map(row=>row.partner)'))=={'estate1'})
  await page.locator('#property-open-movein').click();await page.locator('#property-fill-example').click();await page.locator('#property-movein-form button[type=submit]').click()
  await page.locator('#movein-email').fill('bad@gmail.com');await page.locator('#property-movein-form button[type=submit]').click()
  good('real-domain email rejected',await page.locator('#movein-email').count()==1 and len((await state())['moveins'])==3)
  await page.locator('#movein-email').fill('qa@hyresgast.example');await page.locator('#movein-name').fill('QA Hyresgäst');await page.locator('#property-movein-form button[type=submit]').click()
  good('no preselected service or authority',not await page.locator('#movein-service').is_checked() and not await page.locator('#movein-authority').is_checked())
  await page.locator('#property-movein-form button[type=submit]').click();good('choice required',await page.locator('#movein-service').count()==1)
  await page.locator('#property-decline-service').click();good('decline creates no case',len((await state())['moveins'])==3)
  good('decline acknowledged','Inget ärende har registrerats' in await page.locator('#view').inner_text())
  await page.locator('#property-receipt-new').click();await page.locator('#property-fill-example').click();await page.locator('#property-movein-form button[type=submit]').click()
  await page.locator('#movein-name').fill('QA Hyresgäst');await page.locator('#movein-email').fill('qa@hyresgast.example');await page.locator('#property-movein-form button[type=submit]').click()
  await page.locator('#movein-service').check();await page.locator('#movein-authority').check();await page.locator('#property-movein-form button[type=submit]').click()
  good('review before creating',len((await state())['moveins'])==3 and 'Demomarkering · utan rättsverkan' in await page.locator('#view').inner_text())
  await page.locator('[name=demo]').check();await page.locator('#property-movein-form button[type=submit]').click()
  created=(await state())['moveins'][0];rid=created['id'];good('draft created not forwarded',created['handoverStatus']=='draft' and created['processing']=={'trade':'pending','network':'pending','offerChoice':'undecided'})
  current=await state();good('no customers offers consumers from movein',all(len(current[key])==counts[key] for key in counts));good('economy unchanged after registration',await finances()==basefin)
  async with page.expect_download() as event:await page.locator('#property-receipt-download').click()
  dl=await event.value;await dl.save_as(str(OUT/'movein-test-receipt.txt'));receipt=pathlib.Path(OUT/'movein-test-receipt.txt').read_text();good('receipt marked non-contract','INGET ELAVTAL' in receipt and 'utan rättsverkan' in receipt)
  await page.locator('#property-return-partner').click();await page.locator('#nav [data-go="property-registrations"]').click();await page.locator(f'[data-movein-detail="{rid}"]').first.click()
  good('partner explicit handover offered',await page.locator('#movein-service-forward-form').count()==1)
  await page.locator('#movein-service-forward-form textarea').fill('QA partnerns meddelande');await page.locator('#movein-service-forward-form button[type=submit]').click();good('handover explicit submitted',(await row(rid))['handoverStatus']=='submitted')
  await page.reload(wait_until='networkidle');good('handover survives reload',(await row(rid))['handoverStatus']=='submitted')
  await view(None,'movein-cases');await page.locator(f'[data-service-case="{rid}"]').first.click();good('independent trade network offer controls',await page.locator('[name=trade]').count()==1 and await page.locator('[name=network]').count()==1 and await page.locator('[name=offerChoice]').count()==1)
  await page.locator('[name=handoverStatus]').select_option('needs_info');await page.locator('[name=trade]').select_option('handling');await page.locator('[name=next]').fill('QA stäm av lägenhetsuppgiften');await page.locator('[name=nextDate]').fill('2026-10-10');await page.locator('[name=feedback]').fill('QA återkoppling synlig för partner');await page.locator('[name=privateNote]').fill('QA HEMLIG INTERN ANTECKNING');await page.locator('#movein-service-internal-form button[type=submit]').click();good('internal needs info saved',(await row(rid))['handoverStatus']=='needs_info')
  await view('estate1','property-registrations');await page.locator(f'[data-movein-detail="{rid}"]').first.click();body=await page.locator('#dialog-body').inner_text();good('partner gets feedback', 'QA återkoppling synlig för partner' in body);good('internal note hidden','QA HEMLIG INTERN ANTECKNING' not in body);good('partner no processing editor',await page.locator('#movein-service-internal-form').count()==0)
  await page.locator('[name=partnerReply]').fill('QA komplettering från partner');await page.locator('#movein-service-forward-form button[type=submit]').click();supplemented=await row(rid);good('supplement can be handed over again',supplemented['handoverStatus']=='submitted');good('old partner plan not assigned to Kraftringen',supplemented['next']=='' and supplemented['nextDate']=='' and supplemented['submissionType']=='supplement');good('old supplement plan retained in history',any('Tidigare kompletteringsplan avslutad' in event['text'] for event in supplemented['events']))
  await view(None,'movein-cases');await page.locator(f'[data-service-case="{rid}"]').first.click();good('internal note retained','QA HEMLIG INTERN ANTECKNING' in await page.locator('#dialog-body').inner_text())
  await page.locator('[name=handoverStatus]').select_option('confirmed');await page.locator('#movein-service-internal-form button[type=submit]').click();good('completion requires trade and network',(await row(rid))['handoverStatus']=='submitted')
  await page.locator('[name=trade]').select_option('confirmed');await page.locator('[name=network]').select_option('confirmed');await page.locator('[name=offerChoice]').select_option('declined');await page.locator('[name=feedback]').fill('QA återkoppling klar utan elhandelsavtal');await page.locator('#movein-service-internal-form button[type=submit]').click();case=await row(rid);good('service completion independent from offer acceptance',case['handoverStatus']=='confirmed' and case['processing']['offerChoice']=='declined')
  await page.locator(f'[data-service-case="{rid}"]').first.click()
  async with page.expect_download() as event:await page.locator('#movein-service-download').click()
  dl=await event.value;await dl.save_as(str(OUT/'movein-test-summary.txt'));summary=pathlib.Path(OUT/'movein-test-summary.txt').read_text();good('summary marked demo excludes private note','INGEN BEKRÄFTELSE ELLER GILTIGT AVTAL' in summary and 'QA HEMLIG INTERN ANTECKNING' not in summary)
  await page.locator('#close-dialog').click();await page.reload(wait_until='networkidle');good('case updates survive reload',(await row(rid))['handoverStatus']=='confirmed');good('economy unchanged through completion',await finances()==basefin)
  current=await state();good('no auto records during processing',all(len(current[key])==counts[key] for key in counts))
  await view('estate2','property-registrations');good('estate2 does not display estate1 tenant','QA Hyresgäst' not in await page.locator('#view').inner_text())
  await page.evaluate('Portal.go("movein-cases")');good('internal route redirects partner',await page.evaluate('Portal.page')=='overview')
  # responsive pages, modal and tenant all four steps
  for width in [1440,390,320]:
   await page.set_viewport_size({'width':width,'height':900});await view('estate1');await nooverflow(f'estate overview {width}');await shot(f'movein-service-overview-{width}.png')
   await page.evaluate('Portal.go("property-registrations")');await nooverflow(f'partner list {width}');await page.locator(f'[data-movein-detail="{rid}"]').first.click();await nooverflow(f'partner modal {width}');await shot(f'movein-service-partner-modal-{width}.png');await page.locator('#close-dialog').click()
   await view(None,'movein-cases');await nooverflow(f'internal list {width}');await shot(f'movein-service-internal-{width}.png');await page.locator(f'[data-service-case="{rid}"]').first.click();await nooverflow(f'internal modal {width}');await shot(f'movein-service-internal-modal-{width}.png');await page.locator('#close-dialog').click()
   await page.evaluate('Portal.commercial.selectPartner("estate1")');await nooverflow(f'internal partner profile {width}');await shot(f'movein-service-internal-profile-{width}.png')
   await view('estate1');await page.locator('#property-open-movein').click();await page.locator('#property-draft-start-again').click();await nooverflow(f'tenant step1 {width}');await shot(f'movein-service-tenant-{width}.png');await page.locator('#property-fill-example').click();await page.locator('#property-movein-form button[type=submit]').click();await nooverflow(f'tenant step2 {width}');await page.locator('#property-movein-form button[type=submit]').click();await nooverflow(f'tenant step3 {width}');await page.locator('#movein-service').check();await page.locator('#movein-authority').check();await page.locator('#property-movein-form button[type=submit]').click();await nooverflow(f'tenant review {width}')
  await page.set_viewport_size({'width':1440,'height':1000})
  # regression business studio transitions
  await view('syd','business-brief');good('Savera brief intact',await page.locator('#business-brief-form').count()==1);await page.locator('[data-business-offer]').first.click();good('Savera studio intact',await page.locator('.studio-step').count()==4)
  # regression Face2face consumer form
  await view('vast','consumer-sales');await page.locator('[data-consumer-new]').first.click();await page.locator('#consumer-fill-example').click();await page.locator('#consumer-record-form [name=demo]').check();await page.locator('#consumer-record-form button[type=submit]').click();good('Face2face consumer registration intact',len((await state())['consumerSales'])==counts['consumerSales']+1);good('economy unchanged by regression registration',await finances()==basefin)
  # legacy migration deliberate state markers
  legacy=await state();legacy['moveins']=[{'id':'legacy-movein-qa','partner':'estate1','name':'Äldre QA intresse','email':'legacy@hyresgast.example','address':'Legacygatan 2','postcode':'222 22','city':'Lund','moveDate':'2026-11-01','createdAt':'2026-09-01T10:00:00Z','status':'Intresse registrerat','legacyField':'KEEP'}];legacy.pop('moveinServiceSeeded',None);legacy['propertySettings']['estate1']['welcome']='QA BEVARAD RUBRIK';legacy['propertySettings']['estate1']['intro']='QA BEVARAD INTRO';legacy['training']['qa-sentinel']={'done':True,'marker':'KEEP'};legacy['businessDetails']['qa-sentinel']={'marker':'KEEP'};legacy['commercial']['management']['estate1']['notes']='QA BEVARAD INTERN';legacy['consumerSales'][0]['qaMarker']='KEEP';await page.evaluate('(s)=>localStorage.setItem("partnerlabb.portal.v2",JSON.stringify(s))',legacy);await page.goto(BASE,wait_until='networkidle');migrated=await state();old=next(x for x in migrated['moveins'] if x['id']=='legacy-movein-qa');good('legacy movein kept without fabricated choices',old['legacyField']=='KEEP' and not old['serviceRequested'] and not old['authorityDemo'] and old['handoverStatus']=='draft' and old['processing']['offerChoice']=='undecided');good('other legacy state intact',migrated['propertySettings']['estate1']['welcome']=='QA BEVARAD RUBRIK' and migrated['propertySettings']['estate1']['intro']=='QA BEVARAD INTRO' and migrated['training']['qa-sentinel']['marker']=='KEEP' and migrated['businessDetails']['qa-sentinel']['marker']=='KEEP' and migrated['commercial']['management']['estate1']['notes']=='QA BEVARAD INTERN' and migrated['consumerSales'][0]['qaMarker']=='KEEP')
  await view('estate1','property-registrations');await page.locator('[data-movein-detail="legacy-movein-qa"]').first.click();good('legacy cannot forward',await page.locator('#movein-service-forward-form').count()==0 and 'Äldre intresseregistrering' in await page.locator('#dialog-body').inner_text());await page.locator('#close-dialog').click();await view(None,'settings');page.once('dialog',lambda dialog:dialog.accept());await page.locator('#reset-demo').click();reset=await state();good('reset reinitializes all modules',len(reset['moveins'])==3 and len(reset['consumerSales'])==6 and reset['propertySettings']['estate1']['welcome']!='QA BEVARAD RUBRIK' and 'qa-sentinel' not in reset['training']);good('reset no JS errors',not errors)
  report={'checks':checks,'errors':errors,'finances':basefin};(OUT/'movein-service-qa-result.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print(json.dumps({'passed':len(checks),'errors':errors},ensure_ascii=False),flush=True)
  await browser.close()
asyncio.run(main())
