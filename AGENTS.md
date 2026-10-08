# Instruktioner för arbete i Kraftringen Partnerportal

## Förankrade fakta och öppna beslut

- Ludwig Rosenberg är teamchef för B2B-sälj på Kraftringen Kundcenter sedan juni 2026. Håkan Rusk är hans chef; någon ytterligare titel för Håkan är inte angiven.
- Användaren har valt aktiv säljpartner som arbetar vidare med affären och hela partnerarbetsplatsens frontend utifrån referensbildernas marinblå och petrolfärgade design. Backend ingår inte i denna etapp.
- Den interna Kraftringen-vyn är nu huvudvy och ska fokusera på kommersiellt resultat för alla partners eller vald partner. Partnerresan är endast intern och följs separat per partner.
- Användaren har bekräftat att Savera säljer Kraftringens elhandelsavtal till företagskunder och Face2face till konsumenter. Face2face använder Beest enligt användarens bekräftelse den 8 oktober 2026; den interna resultatuppföljningen ska prioriteras. Bevara befintlig konsumentdemo men beskriv den inte som ersättning för Beest. Savera kan eventuellt använda partnerportalen senare; användningen är inte beslutad. Savera behåller företag/BRF-underlag; Face2face har konsumentunderlag. Fastighetspartner erbjuder nu inflyttningsservice vid hyresavtal. Hyresgästen väljer tjänsten och lämnar underlag/fullmakt; partnern förmedlar; Kraftringen hanterar elhandel, behövlig elnätshantering och bekräftelser. Partnerns egen elförbrukning är en separat affär. Fastighetsbolag har en separat arbetsyta med inflyttningssida där nya bostadshyresgäster kan lämna fiktiva serviceunderlag. Detta bostadsspår är godkänt; fiber och andra produktområden är fortsatt utanför scope.
- Partnerregistret använder `syd` = Savera (namnet är verkligt nämnt, alla resultat och statusar är exempel), `vast` = Face2face (bekräftad partner för konsumentförsäljning, alla resultat/statusar/kanaler är exempel), `estate1` = Exempelfastigheter AB och `estate2` = Exempelbo Förvaltning.
- Arbetsflöden, pipelinesteg, partnerresans åtta steg, utbildningsinnehåll, befogenheter, informationsdelning och plattformsval är förslag eller öppna beslut.
- B2B Veckokollen är ett tidigare separat verktyg. Integration med det eller Dynamics är inte beslutad.
- Skilj i gränssnitt och dokumentation mellan användarens beslut, våra förslag och sådant som behöver verifieras. Hitta inte på kommersiella regler eller Kraftringens interna processer.

## Data och funktioner

- Skriv gränssnitt, exempeltexter och användardokumentation på svenska.
- Använd fiktiva kunder, hyresgäster och kontaktpersoner samt exempeladresser med `.example`. Lägg inte in riktiga kunduppgifter. Savera är ett namn som användaren lämnat, inte underlag för verkliga resultat, partnerstatus eller villkor.
- Kommersiella data är manuella exempelutfall för resultatbidrag före partnerkostnad, kostnad, avtal och MWh. Demots nettobidrag är angivet bidrag minus angiven partnerkostnad. MWh är avtalad årsvolym för periodens nya exempelavtal, inte periodens levererade el. Framtida potential är separat och ingår inte i utfallet. Beskriv inget av detta som verifierad ekonomi eller en ersättningsmodell. Registrering av kunddialog eller inflyttningsintresse får aldrig skapa ett avtal eller ekonomiskt utfall.
- Bevara det sammanhängande flödet kunder → offertstudio med fyra steg → simulerad fullmakt, avtal och signering. Offertutkast är behovsunderlag; TXT-nedladdningar är demotexter, inga juridiska dokument eller bindande offerter.
- Inför inte backend, riktiga integrationer, priser, produktvillkor, provisionsberäkning, leadägande, exklusivitet eller offertbefogenhet utan nytt underlag och instruktion från användaren. Provisionsvyn visar saknat regelunderlag tills regler faktiskt lämnas. Den interna kickbackvyn får visa fristående, manuella exempelposter och statusuppföljning, men ingen intjänad ersättning får räknas fram från avtal eller serviceärenden.
- Academys fyra introduktionskurser innehåller demotextmoment, bokmärken och lokal klarmarkering. Elakademin har separat befintligt utbildningsmaterial, filmer och lokala självtest. Beskriv inget av detta som personverifierad certifiering eller central resultatrapportering. Material, kampanjbrief och partnerresan är fortsatt testförslag tills underlag har lämnats.
- Kundsidor och inflyttningssidor är lokala redigerbara förhandsvisningar. Hyresgästvyn ligger bakom den privata testlänken och är ingen publik sida i drift. Supportfrågor, utskick, anmälningar, dokumentsteg och kontaktformulär ska inte göra verkliga externa åtgärder.
- Visa partnerresan endast för den interna Kraftringen-vyn och spara två checklistaktiviteter per steg samt exempelplacering per partner i `commercial.management`. Äldre `state.journey` bevaras men dess gamla partnervy visas inte. Aktiva säljpartners och fastighetsbolag ska ha menyer anpassade till sina arbetsuppgifter.
- Bevara korta, tydliga demomärkningar. Samla utförligare begränsningar i Test & beslut och dokumentationen, så att produktflödena främst hjälper användaren genom sin uppgift.
- Demovyer och dolda interna anteckningar styr visningen; de är inget åtkomstskydd. All data är lokal och delas inte mellan datorer. Beskriv inte JSON-export som synkronisering eller som säkerhetskopia av alla moduler.
- Håkans två e-postidentiteter får extern visningsåtkomst på den privata Sites-testlänken. Detta innebär inte redigeringsåtkomst till byggprojektet. Blanda inte ihop Sites-delning med appens demovyväljare eller med säkerhetsgränser i appen.

## Teknik och verifiering

- Bevara prototypens statiska portabilitet: körbara filer ligger i `dist/` och ska kunna serveras utan paketinstallation eller byggsteg.
- `app.js` tillhandahåller `window.Portal`, partnerregistret och navigationen. `studio.js`, `academy.js`, `partner.js`, `commercial.js`, `property.js`, `movein-service.js`, `business.js` och `consumer.js` registrerar sina vyer mot samma objekt. Behåll en gemensam lokal datamodell.
- Bevara kunddata och migreringen från `partnerlabb.active.v1` till `partnerlabb.portal.v2`. Giltig v2-data har företräde. Återställning ska fortsatt vara ett tydligt användarval.
- Nya dataområden `commercial.management`, `moveins` och `propertySettings` ska behålla befintliga kunddata och annan v2-data. De fasta ekonomiska exemplen i `commercial.js` ska hållas åtskilda från hyresgästers intresseregistreringar.
- Inflyttningsflödet har fyra steg: Inflyttning, Kontakt, Tjänst & fullmakt och Granska. Fullmakt är en demomarkering utan rättsverkan; godkänd fullmaktsmall saknas. Registreringen skapar ett underlag som partnern kan förmedla i test, inte ett elavtal. Skapa en separat `moveins`-post och ett TXT-testkvitto; skapa inte kundrecord, offert, avtal eller ekonomiskt utfall från formuläret.
- Bevara responsiv layout, tangentbordsanvändning, formuläretiketter och tydliga sparmeddelanden.
- Dokumentera bildkällor i ASSETS.md. Anta inte att externa illustrationer eller referensbilder är godkända varumärkestillgångar från Kraftringen.
- Efter funktionella ändringar, kontrollera berörda användarflöden. Den nya huvudkedjan är intern resultatöversikt → vald partner → aktiv säljpartners arbetsyta → fastighetsbolag → hyresgästförhandsvisning → testregistrering → intern uppföljning utan ny verklig intäkt eller nytt avtal. Kontrollera också att partnerresan endast finns internt och är separat per partner.
- Bevara kundregistrering och återkoppling, offertstudions fyra steg, dokumentdemosteg, kundsideförhandsvisning och Academy för aktiva säljpartners. Kontrollera relevant lagring efter omladdning och perspektivbyten mellan partnertyper. Breda kontroller behövs när gemensam navigation eller data ändras.
- Uppdatera README när verkliga funktioner eller begränsningar ändras. Dokumentationsändringar behöver inte egna tester.
- Lova inte samtidig kodredigering eller parallellt AI-arbete utan aktuellt officiellt underlag för vald miljö. Skilj på att bygga samma projekt och att använda den publicerade portalen tillsammans.

## Bekräftad segmentering och nya dataområden

- Savera (`syd`) har `business-overview` och `business-brief`; affärsunderlag i `businessDetails` är kopplat till befintliga företagsrecord. Sparat nästa steg/datum följer kunddialogen.
- Face2face (`vast`) har `consumer-overview`, `consumer-sales`, `consumer-followup`, `consumer-material` och `consumer-reports`. Fiktiva privatpersoner ligger i separat `consumerSales`. Konsumentregistrering skapar underlag, aldrig verkliga avtal eller finansiellt utfall.
- Gamla `vast`-record med företag/BRF bevaras i lokal data men visas inte i de nya företags- eller konsumentflödena. Nya konsumentexempel ska inte konverteras från dessa företag.
- Partnerinterna kostnader/nettobidrag visas i Kraftringens vy, inte i partnerarbetsytorna. Statusdefinitioner, handläggningssteg, kanaler och utbildningsinnehåll är testförslag tills verkligt underlag lämnats.
- Direktlänkar `?workspace=syd#overview` och `?workspace=vast#overview` öppnar respektive demovy; det är visningsval, inget åtkomstskydd.

## Inflyttningsservice – senaste affärsmodell

- Fastighetsbolag, BRF:er och förvaltare är partners och väg till hyresgästen vid hyresavtal/inflyttning. Kraftringen står för elkompetens och avtalshantering.
- Tjänsten är frivillig. Hyresgästen blir elhandelskund när hen väljer erbjudandet; användning av service eller registrering är inte automatiskt avtal, kund eller kommersiellt resultat.
- `movein-service.js` tillhandahåller ärende-API och intern `movein-cases`. `moveins` kompletteras med serviceRequested, authorityDemo, handoverStatus, processing och events. Gamla intressen behålls och får inte tillskrivas samtycke, fullmakt eller överlämning.
- Överlämning och statusar är lokala testförslag. Elhandel, elnät och hyresgästens erbjudandeval följs separat. Inga riktiga elnätsbolag kontaktas; bekräftelser och fullmaktsteg är simuleringar.
- Inflyttningsärenden ingår inte i företagspartnernas eller Face2faces kunddata. Finansiella fixtures är fortsatt fristående, även vid bekräftat demoärende.
- Egen elförbrukning hos partnern behandlas som en separat B2B-affär och skapas inte från hyresgästärendet.
- Regelbakgrunden används inte som ett produktlöfte. Eventuella laguppgifter ska ha officiell källa och ikraftträdandedatum; undvik att beskriva framtida regler som redan gällande.

## Arbetslistor och internationella förebilder

- `workspace.js` härleder nästa handling från befintliga kunddialoger, konsumentunderlag, inflyttningsärenden och intern partneruppföljning. Uppgifter är inga nya persistenta affärsobjekt. Filter är endast visningsval.
- Visa vem som har nästa insats och en direkt väg till befintligt underlag. Turordning och sortering är testförslag, inte beslutade SLA:er eller ansvarsvillkor. Använd endast redan angivna datum; inflyttningsdatum är inte en utlovad svarstid.
- Behåll kommersiellt resultat först internt. Ekonomiska signaler ska förklaras med period och mått, utan automatiska hälsopoäng eller slutsatser om partnerkvalitet.
- Fastighetspartner får korrigera bostadsunderlag vid komplettering men kan inte ändra hyresgästens tjänsteval eller fullmaktsmarkering. Tidigt avstående från hyresgästflödet skapar inget ärende.
- Benchmarkunderlaget i BENCHMARK.md skiljer dokumenterade leverantörsfunktioner från vår anpassning. Påstå inte att någon leverantör är objektivt bäst i världen eller att prototypen har deras backendförmågor.

## Elakademin – tillagd utbildning

- Den 8 oktober 2026 bad användaren att den redan färdiga Elakademin läggs in som utbildning för både Savera och Face2face. Återanvänd kursen Förstå din elaffär på https://kraftringen-elakademin.rosen123.chatgpt.site/ och dess slutliga filmer. De fyra tidigare demokurserna och deras framsteg ska bevaras.
- Kursens offentliga sakuppgifter kontrollerades den 7 oktober 2026. Räkneexemplen är förenklade antaganden, inga produktvillkor eller erbjudanden. Nytt material ska inte fylla i saknade konsumentvillkor eller kundspecifika villkor.
- Face2face arbetar med konsumenter. Elmarknadsgrunderna är relevant baskunskap; företagsfallen och portföljprodukterna ska märkas som B2B-fördjupning och får inte presenteras som konsumentprodukter.
- Klarmarkering och självtest lagras lokalt och separat per exempelpartner i portalens befintliga modell. Ingen backend, identitetskontroll eller synkronisering med den fristående Elakademin ingår. Länken dit erbjuder dess räkneverktyg, slutprov och lokala utbildningsintyg; intyget är ingen partnercertifiering.
- Befintlig Sites-åtkomst ska bevaras. Att lägga in en kurs eller byta demovy ger ingen ny användare åtkomst till den privata testportalen.

## Kanalutfall och kickback – förtydligat 8 oktober 2026

- Följ Saveras nya avtal, avtalad årsvolym i MWh, säljare och avtalstyp per månad och år. För Face2face följs avtal, avtalstyp och geografi samt churn efter start och bortfall före start som separata mått. Beest är deras nuvarande säljverktyg; prototypen har ingen koppling dit.
- Nyttigheten är elhandel. Användaren har förtydligat partnernas elavtal: Face2face har Opti och kvartspris. Savera har rörligt pris, kvartspris, Poolportfölj Trygg, Poolportfölj Offensiv, individuell portfölj och Kraftringen Stabil. Använd separata produktkataloger för partnerna och deras union i rapporten för alla partners. Fastighetspartners tidigare produktfördelning är fortsatt obekräftad exempeldata. Deras förekomst i aggregat är fiktiv; skriv inga pris-, behörighets- eller produktvillkor från detta.
- `partner-results-data.js` har fasta manuella aggregat. Avtal och MWh ska summera till samma periodutfall som `commercial.js`. Produkt-, säljar- och regionfilter ändrar endast visningen. Helårsvyn för 2026 visar 1 januari–7 oktober och saknar jämförbar föregående årsbas.
- Fastighetspartners serviceanmälningar och hjälpta nyinflyttare följs separat från nya elhandelsavtal. Ett hjälpt serviceärende behöver inte ha lett till vårt avtal. Serviceaggregat har ingen avtalstyp; produktfilter avser endast avtalsutfallet.
- Churnförslaget använder kunder aktiva vid periodstart som nämnare och samma kohorts avgångar som täljare. Summera inte månaders öppningskohorter för års- eller kvartalsmått. Bortfall före start följer periodens sålda avtal och avbrott observerade till datadatum; färska perioder är inte färdigutfall. Måttdefinitionerna är testförslag.
- Användaren har bekräftat att kickback ska följas för samtliga partnerkanaler. `partner-kickback.js` visar manuella exempelposter, avstämning och betalningsbelopp, med föreslagna statusnamn. Postperiodens betalningar är inte ett kassaflöde per betalningsmånad. Kickback och kommersiell partnerkostnad är skilda exempelunderlag utan automatisk avstämning. Faktiska ersättningsvillkor, integrationer och datakällor kräver separat underlag.

## Aktiverad masteragent – 8 oktober 2026

- Användaren har aktiverat masterprompten som löpande bygguppdrag. Läs MISSION.md, RUNBOOK.md, BACKLOG.md och WORKLOG.md vid varje pass. Utför och testa förbättringar självständigt inom befintlig frontendprototyp och lämna dem som pull requests utan rutinmässig ny godkännandefråga. Ludwig/Codex samordnar integration och publicering. Saknade affärsregler parkeras medan oberoende arbete fortsätter.
- Arbetsminnet är i aktuell GitHub-källa. Deploymentarkivet har inte dessa rotfiler; hämta aktuell GitHub-main och läs instruktionerna där. Följ aktuell källa, instruktioner, parallellt arbete och exakt publiceringsproveniens.
- Återkommande pass ska utveckla produkten, inte bara bevaka. Bevara användarnas data, statisk portabilitet, korrekt partnerutbud, separat service/avtal/ekonomi och befintlig Sites-åtkomst.
- Ingen körning ändrar sitt eget eller andras schema, prompt eller aktivering. Schemalagda timpass innebär inte bevis för oavbruten exekvering eller garanterad körningsåterstart. Rapportera faktisk körning/publicering och konkret hinder.

## Gemensam GitHub-utveckling

- Användaren har uttryckligen valt det publika repot https://github.com/ludros93-prog/kraftringen-partnerlabb för gemensam utveckling med ChatGPT/Codex och Claude Code. Källkod och bevarad Git-historik har laddats upp och verifierats. GitHub-kontot `daniel-smail` är bekräftat för Daniel; hans verifierade åtkomst är publik läsning, utan bekräftad skrivbehörighet. Den befintliga Sites-testportalens privata åtkomst är separat och ska bevaras.
- GitHub är huvudkälla för kod och arbetsminne. Sites är publiceringsmål, och RUNBOOK-SITES.md dokumenterar endast den äldre rutinen. GITHUB-STATUS.md redovisar faktisk aktiveringsstatus, källrevisioner och behörigheter. Ändra inte scheman eller åtkomst på eget initiativ.
- Läs AGENTS.md, MISSION.md, RUNBOOK.md, COLLABORATION.md, BACKLOG.md och WORKLOG.md samt öppna PR:er från aktuell GitHub-källa vid varje pass. Den befintliga timuppgiftens sparade uppdrag använder samma GitHub-källa och arbetsgren plus PR; skapa ingen dubbel timagent.
- Utför och testa förbättringar självständigt inom prototypen på en separat `codex/`, `claude/` eller `agent/`-gren och lämna färdiga ändringar som en pull request till `main`. Detta gäller även masteragentens timpass. Gör ingen direkt push till `main` eller Sites från ett utvecklingspass. Ludwig/Codex samordnar integration och publicering från verifierad GitHub-main till samma Sites-projekt enligt RUNBOOK.
- Bevara Git-historik och använd inte force-push till gemensam huvudkälla eller Sites. Rapportera kandidat, öppnad PR, integrerad ändring och lyckad publicering som olika resultat. Automatisk GitHub–Sites-synk, CI-resultat och centralt delad testdata ska bara beskrivas som införda när de har implementerats och verifierats.
