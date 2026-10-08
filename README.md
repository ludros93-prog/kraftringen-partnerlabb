# Kraftringen Partnerportal – frontendprototyp

En klickbar partnerportal med **Kraftringens interna resultatöversikt som huvudvy** och separata arbetsytor för aktiva säljpartners och fastighetsbolag. Designen följer referensbildernas marinblå och petrolfärgade uttryck.

Savera säljer Kraftringens elhandelsavtal till företagskunder och Face2face till konsumenter, enligt användarens bekräftelse. Arbetsytorna är nu anpassade till dessa två segment. Fastighetspartners erbjuder frivillig inflyttningsservice vid hyresavtal och förmedlar hyresgästens underlag till Kraftringen. Kraftringen hanterar elhandel, nödvändig elnätshantering och återkoppling. Partnerns egen elförbrukning är en separat affär. Fiber och andra produktområden ingår inte.

Denna etapp omfattar frontend med exempeldata. Flöden, pipelinesteg, fyra demoutbildningar och partnerresan är förslag att testa. Elakademin är en färdig innehållskurs, tillagd i båda säljpartnernas arbetsytor på användarens uppdrag. Backend och integrationer ingår inte nu; ingen byggplattform är vald.

## Starta

Kör från projektroten:

```sh
python -m http.server 8000 --directory dist
```

Öppna <http://localhost:8000>. Appen består av vanlig HTML, CSS och JavaScript i `dist/`; inga paket eller byggsteg krävs.

## Lärdomar från partnerplattformar

[BENCHMARK.md](BENCHMARK.md) jämför officiellt dokumenterade arbetssätt hos Salesforce, Impartner, ZINFI, PartnerStack och impact.com, kontrollerade 7 oktober 2026. Det är inspirationsunderlag, ingen världsrankning eller vald plattform.

Arbetsvyerna får en kort lista med nästa handling, vem som behöver agera och direktlänk till befintligt ärende. Listan härleds från aktuell lokal data; den skapar eller sparar inga separata uppgifter. Turordningen och handlingarna är testförslag utifrån status och sparat nästa steg, inte fastställda befogenheter eller tidslöften. Internt ligger kommersiella fakta och måttdefinitioner först. Fastighetsspåret låter partnern rätta underlaget vid komplettering och hyresgästen avstå redan i första steget.

## Arbetsplatsens vyer

| Vy | Det går att testa |
| --- | --- |
| Kraftringens resultatöversikt | Resultatbidrag före partnerkostnad, partnerkostnad, nettobidrag, nya avtal och avtalad årsvolym i MWh. Välj månad eller kvartal, filtrera partnertyp, jämför utfall och exportera ekonomiska exempel som CSV. Framtida potential visas separat. |
| Partners & partnerprofil | Sök och sortera partners efter exempelutfall. Granska en partner, redigera intern ansvarig, nästa steg, uppföljningsdatum och intern anteckning samt öppna partnerns arbetsyta. |
| Saveras översikt & pipeline | Nyckeltal från kundernas exempeldata, nästa steg, aktivitetshistorik och affärer per föreslaget steg. |
| Företagskunder | Registrera företag eller BRF, söka och filtrera, dokumentera kontakt och nästa steg. Internt team tilldelar demoansvarig, ändrar status eller pipelinesteg och delar återkoppling. |
| Offerter & avtal | Offertstudion har fyra steg: **Välj område → Beskriv behov → Välj kund → Granska & spara**. Sparade behovsunderlag kan öppnas igen, hämtas som TXT och markeras som skickade i en simulering. |
| Avtal & dokument | Prova lokala demosteg för fullmakt, avtal och signering samt öppna dokumentbiblioteket. |
| Kundsidor | Skapa och redigera kundsidans rubrik, introduktion, bild och kontaktknapp. Förhandsgranska och prova kontaktformuläret. |
| Partner Academy | Elakademin med sex textade kapitelfilmer, kapiteltext, filmmanus, tolv självtestfrågor med facit och PDF-kundguide. Därutöver fyra bevarade demokurser med tre textmoment vardera. Kategorifilter, bokmärken, klarmarkering och testsvar sparas lokalt per partner. En anmälan till en exempelgenomgång kan markeras i demo. |
| Material & kampanjer | Filtrera, förhandsvisa och hämta fyra TXT-mallar samt läsa en exempelbrief för kampanjplanering. |
| Provision | Visar öppna beslut och saknat underlag. **Ingen ersättning beräknas.** |
| Resultatrapport, internt | Ekonomiska nyckeltal och tabell för vald period och partnerurval samt CSV-export av exempelutfall. |
| Rapporter, säljpartner | Antal kunder och affärer per steg, aktivitetslogg och JSON-export av kunddata, offertutkast och kundsidor för vald demovy. |
| Partnerresan, endast internt | Följ varje partner separat genom åtta föreslagna steg: Rekrytera, Onboarda, Certifiera, Aktivera, Sälja, Leverera, Utveckla och Behålla. Två interna testaktiviteter per steg och exempelplacering kan sparas lokalt. |
| Fastighetsbolagets arbetsyta | Anpassa inflyttningssidans välkomstrubrik och introduktion, kopiera förhandsvisningslänk och sök eller öppna lokala serviceärenden. Förmedla underlag, lämna komplettering och följ Kraftringens delade återkoppling. |
| Inflyttningsärenden, internt | Filtrera på partner och ärendestatus. Följ elhandel, elnät och erbjudandeval separat, tilldela ansvarig, begär komplettering och skriv delad återkoppling eller intern anteckning. |
| Hyresgästens inflyttningssida | Fyra steg: **Inflyttning → Kontakt → Tjänst & fullmakt → Granska**. Ange fiktiv adress, inflyttningsdatum, namn och e-post med `.example`; lägenhetsnummer och telefon är valfria. Registrera ett fiktivt serviceunderlag med uttryckligt tjänsteval och demomarkering för fullmakt. Hämta TXT-testkvitto; partnern förmedlar underlaget i ett separat demosteg. |
| Hjälp & support / Test & beslut | FAQ, lokala testförfrågningar, öppna beslut, dataexport och återställning av exempeldata. |

Vid vanlig öppning visas den interna Kraftringen-vyn först. En inflyttningslänk öppnar i stället hyresgästförhandsvisningen. Partnerns meny anpassas efter partnertyp. Interna testanteckningar döljs i partnervyerna. Varningen för identiska kundnamn är en testhjälp; regler för dubbla registreringar är inte beslutade.

| Partner i registret | Hur namnet används |
| --- | --- |
| Savera (`syd`) | Bekräftad partner för företagsförsäljning. Företagsaffärer och offertunderlag; alla statusar och resultat är exempel. |
| Face2face (`vast`) | Bekräftad partner för konsumentförsäljning. Separata konsumentunderlag med återkoppling; alla statusar, kanaler och resultat är exempel. |
| Exempelfastigheter AB (`estate1`) | Fiktivt fastighetsbolag med inflyttningsflöde. |
| Exempelbo Förvaltning (`estate2`) | Fiktivt fastighetsbolag med separat inflyttningsflöde. |

## Testa ett sammanhängande flöde

1. Börja i Kraftringens resultatöversikt och jämför alla partners med en vald partner. Anteckna exempelvärdena för avtal och nettobidrag samt period och urval.
2. Öppna Savera i partneröversikten och gå till säljpartnerns arbetsyta. Registrera en fiktiv företags- eller BRF-dialog, dokumentera kontakt och förbered ett offertutkast genom studions fyra steg.
3. Återgå till Kraftringen för intern ansvarstilldelning och återkoppling. Kontrollera att partnerresan finns internt och att markeringar följer vald partner.
4. Öppna ett av fastighetsbolagen och dess inflyttningssida. Prova att avstå i första steget och kontrollera att inget ärende skapas. Börja sedan om, använd **Fyll med exempeluppgifter** och gå igenom Inflyttning, Kontakt, Tjänst & fullmakt och Granska. Välj frivilligt tjänsten och fullmaktsdemot innan det fiktiva underlaget registreras.
5. Återgå till fastighetsbolagets **Inflyttningsärenden** och förmedla det nya underlaget till Kraftringen. Öppna Kraftringens interna **Inflyttningsärenden**, prova separat handläggning för elhandel och elnät samt dokumentera erbjudandeval och återkoppling. Kontrollera återkopplingen från partnersidan och ladda om för att kontrollera lokal lagring.
6. Kontrollera att avtal och nettobidrag är oförändrade för samma period och urval. Serviceanmälan, förmedling och slutförd demohandläggning skapar inga verkliga kunder, avtal eller intäkter.

Säljpartnerns befintliga offertstudio, dokumentdemosteg, kundsidor, Academy och materialbibliotek kan fortfarande testas från arbetsytan.

## Lokal data och demosteg

Använd enbart påhittade kund- och hyresgästuppgifter. Sparad testdata ligger i `localStorage` för aktuell webbplats och webbläsare under `partnerlabb.portal.v2`. `commercial.management` sparar intern partneruppföljning och partnerresans markeringar, `moveins` sparar serviceunderlag och äldre intresseanmälningar och `propertySettings` sparar fastighetsbolagets presentation. Dessa kompletterar tidigare kunddata. Gamla `journey`-markeringar bevaras i datan men visas inte i den nya interna partnerresan.

Om giltig v2-data saknas läses tidigare kunddata från `partnerlabb.active.v1` på samma webbplats; kunder utan pipelinesteg får **Kunddialog**. Den gamla v1-posten raderas inte. Återställning tar bort lokala teständringar och laddar portalens exempeldata igen.

Två datorer delar inte data och öppna flikar synkas inte automatiskt. JSON-exporten är ett granskningsunderlag, ingen synkronisering eller fullständig säkerhetskopia av alla moduler.

Ekonomiskt utfall ligger som manuella exempelvärden i `commercial.js`, separat från kunddialoger och `moveins`. I demot är **nettobidrag = resultatbidrag före partnerkostnad − partnerkostnad**. MWh avser avtalad årsvolym för periodens nya exempelavtal, inte levererad el under perioden. Månad och kvartal har angivna jämförelseperioder; oktober och Q4 visar endast 1–7 oktober.

Framtida potential är en separat manuell ögonblicksbild och räknas inte in i utfallet. Inga belopp beräknas från elpris, avtalsvillkor, provisionsregler eller registreringar. **Intresseanmälan är varken avtal eller intäkt.** Ekonomiska definitioner och ersättningsregler behöver separat underlag.

Utskick, signering, kundsidepublicering, mötesbokning och supportkontakt är simuleringar. TXT-filer är demounderlag, inga kommersiella offerter, juridiska fullmakter eller avtal. Academy ger ingen verifierad partnercertifiering. Pris, aktuella produktvillkor, partnerns mandat och eventuell ersättning behöver stämmas av för den faktiska affären.

## Elakademin i säljpartnernas arbetsytor

**Elakademin – Förstå din elaffär** finns som en femte kurs under Utbildning för Savera (`syd`) och Face2face (`vast`). Kursen använder de sex slutliga kapitelfilmerna från den färdiga Elakademin, sammanlagt **11:29**, med svenskt tal och inbränd svensk text. Varje kapitel har full lästext, filmmanus, sammanfattning och två självtestfrågor med facit och förklaring. Inget nytt videomaterial har producerats för integrationen.

Kursen behandlar företagselhandel. Savera kan använda den som stöd inför företagsdialogen. För Face2face är den märkt som fördjupning: Lundverk AB är ett fiktivt företag och portföljuppläggen gäller företagskunder. Materialet beskriver inte Face2faces konsumentvillkor eller aktuella konsumenterbjudanden.

Bokmärken och kapitelmarkeringar använder befintliga `training[partner].bookmarks` respektive `training[partner].completed.elakademin`. Självtestens senaste val och kontrollstatus sparas separat i `training[partner].selfTests.elakademin[questionId]` som `{ selectedIndex, checked }`. Äldre kursframsteg och övrig portaldata behålls. Självtest ger återkoppling men klarmarkerar inte kapitel. Manuell klarmarkering verifierar inte filmvisning, ett godkänt slutprov eller partnercertifiering; ingen identitetskontroll eller delad rapportering tillkommer.

Kursen länkar till [hela Elakademin](https://kraftringen-elakademin.rosen123.chatgpt.site/) för räkneverktyg, slutprov och utbildningsintyg. Den utbildningens lokala framsteg sparas separat på dess egen webbplats och synkas inte med partnerportalen. Den 12-sidiga kundguiden ligger lokalt under `dist/assets/elakademin-kundguide.pdf`. Publika kundkällor och länkar till aktuella produktvillkor finns i kursdialogen.

Testa: Savera → Utbildning → Elakademin → se en kapitelfilm → kontrollera ett felaktigt och ett korrekt svar → klarmarkera ett kapitel → ladda om. Byt sedan till Face2face och kontrollera segmentmärkningen och separata framsteg. De fyra tidigare demokurserna, bokmärkena, kundunderlagen och ekonomiska exemplen ska finnas kvar.

Demovyerna styr visningen utan inloggning eller åtkomstskydd; även interna anteckningar finns i webbläsaren. Inga riktiga kunduppgifter eller anslutningar till Dynamics, Oneflow eller B2B Veckokollen används.

## Den privata testlänken

Den privata Sites-testlänken delas med Håkans två e-postidentiteter som externa besökare (**viewers**). Det ger visningsåtkomst, inte rätt att redigera byggprojektet. Sites-delningen och appens demovyer är olika saker; demovyerna skapar inga säkerhetsgränser i appen.

Hyresgästflödet är en förhandsvisning bakom samma privata testlänk. Det är ingen publik inflyttningssida i drift.

## Filer

- `dist/app.js`: gemensam navigation, lokal data, kunder, pipeline, översikt och rapporter.
- `dist/studio.js`: offertstudio och simulerade dokumentsteg.
- `dist/academy.js`: Elakademin, bevarade demokurser och lokala utbildningsframsteg/självtest.
- `dist/elakademin-data.js`: sex slutliga kapitelfilmer, kapiteltexter, filmmanus, tolv originalfrågor och publika kundkällor.
- `dist/partner.js`: säljpartnerns kundsidor, material och support.
- `dist/commercial.js`: intern resultatöversikt och partneruppföljning med ekonomisk exempeldata.
- `dist/property.js`: fastighetsbolagens arbetsyta och hyresgästens frivilliga serviceanmälan.
- `dist/movein-service.js`: gemensam ärendedata, förmedling, kompletteringar och Kraftringens interna handläggningsvy.
- `dist/business.js`: Saveras översikt och affärsunderlag för företagskunder.
- `dist/consumer.js`: Face2faces konsumentaffärer, återkoppling, säljstöd och försäljningsrapport.
- [ASSETS.md](ASSETS.md): bildkällor. Bilderna är illustrationer, inte antagna godkända Kraftringen-bilder.

## Förslag för att bygga tillsammans

Förslag: **ett gemensamt Replit Core-projekt**, varsin inloggning, redigeringsåtkomst och Teams för samtalet. Börja med en AI-ändring åt gången. Core dokumenterar en aktiv bakgrundsuppgift per projekt; Pro upp till tio parallella Agent-uppgifter. Samma filer kan ändå ge konflikter. Konton och abonnemang har inte testats här.

Lovable dokumenterar separata utkast som accepteras ett i taget. ChatGPT Sites dokumenterar redigeringsbehörighet inom samma workspace; samtidig AI-redigering är inte verifierad. Senare kan GitHub och Codex med separata grenar eller worktrees användas. Att dela den färdiga portalen är ett annat samarbete än att redigera byggprojektet.

Officiella källor kontrollerade 7 oktober 2026:

- [Replit: Invite teammates](https://docs.replit.com/build/invite-teammates)
- [Lovable: Collaboration](https://docs.lovable.dev/features/collaboration) och [Drafts](https://docs.lovable.dev/features/drafts)
- [ChatGPT Sites: Creating and using Sites](https://help.openai.com/en/articles/20001339-creating-and-using-chatgpt-sites)
- [Codex: Git worktrees](https://learn.chatgpt.com/docs/environments/git-worktrees) och [Cloud](https://learn.chatgpt.com/docs/cloud)

## Anpassade partnersidor

- **Savera:** översikt för företagsförsäljning, kunder/pipeline, offertstudio och nytt affärsunderlag med årsvolym, antal anläggningar, avtalsdatum, önskad start, underlagsfrågor och nästa steg. Underlaget sparas i `businessDetails` per kund. Det är inte en prisberäkning.
- **Face2face:** separat översikt för konsumentförsäljning, registrering och uppföljning av fiktiva konsumentunderlag, kompletteringsärenden, säljstöd och rapport över exempelantal. `consumerSales` hålls åtskilt från företagsrecord. Kraftringens interna vy kan användas för att simulera återkoppling.
- **Kraftringen:** ekonomiskt utfall först på respektive partnerprofil, därefter segmentanpassad operativ översikt. Intern partnerresa är fortsatt separat. Alla finansiella fixtures är oförändrade och påverkas inte av nya underlag.
- Academy anpassas till vald partners kundsegment och behåller lokala utbildningsframsteg.

Direktlänkar till arbetsytorna: `?workspace=syd#overview`, `?workspace=vast#overview` och `?workspace=estate1#overview`. Dessa väljer demovy och bevarar perspektivet efter omladdning. De ger inga nya behörigheter.

Befintlig v2-data behålls. Äldre Face2face-exempel med företag/BRF finns kvar i lagringen men visas inte som konsumenter och ingår inte i de nya företagsvyerna. Registrering av konsumentunderlag innebär varken ett ingånget avtal eller finansiellt utfall. Statuser, kanaler, underlagschecklistor och återkopplingsprocess är testförslag, inte fastställda affärsregler.

Testa: Savera → Affärsunderlag → spara nästa steg → kontrollera samma kunddialog. Face2face → registrera konsumentunderlag → Kraftringen/Konsumentaffärer → simulera återkoppling → Face2face/Återkoppling. Ladda om för att kontrollera lokal lagring och säkerställ att ekonomiskt utfall för samma period är oförändrat.

## Inflyttningsservice

Den bekräftade affärsmodellen är att fastighetsbolag, BRF:er och förvaltare erbjuder service vid hyresavtal/inflyttning. Hyresgästen väljer tjänsten, lämnar uppgifter och behövlig fullmakt. Partnern förmedlar underlaget. Kraftringen står för elkompetensen, hanterar elhandelsavtal och nödvändig hantering gentemot elnätsbolaget samt återkopplar med bekräftelser. Hyresgästens val av elhandelserbjudande är separat från själva serviceanmälan. Partnerns egen elförbrukning är en separat B2B-affär.

Frontendflödet går att testa som: hyresgästunderlag → partnerns förmedling → Kraftringens Inflyttningsärenden → handläggning/komplettering → återkoppling. Elhandel, elnät och erbjudandeval har separata demostatusar. Fullmaktsmarkeringen är en UI-simulering utan rättsverkan; godkänd fullmaktsmall, omfattning, identifiering och signeringsprocess återstår att lämna underlag för. Inga verkliga avtal eller externa utskick görs.

`dist/movein-service.js` är gemensam ärendedata och intern handläggningsvy. Den kompletterar `moveins` med `serviceRequested`, `authorityDemo`, `handoverStatus`, `processing` och `events`. Tidigare intresseanmälningar behålls men får inte automatiskt samtycke, fullmakt eller förmedlingsstatus. Nya fiktiva serviceexempel är uttryckligt markerade.

Kommersiellt resultat visas fortfarande först på den interna partnerprofilen. Ärendeantal, underlag, kompletteringar och demobekräftelser är operativ uppföljning för alla datum. Ekonomiska fixtures för vald period är fristående och ändras inte när ett serviceärende registreras, förmedlas eller bekräftas.

Regelbakgrunden är verifierad i Ei:s nyhet 25 juni 2026: automatisk anvisning av elhandelsavtal avskaffas **1 juli 2027**. Det är en beslutad framtida ändring, inte en redan gällande förändring vid prototypens datum. Uppgiften används inte som produktlöfte. Källa: https://ei.se/om-oss/nyheter/2026/2026-06-25-tva-nya-lagar-ersatter-ellagen
