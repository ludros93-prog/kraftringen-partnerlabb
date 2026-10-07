# Kraftringen Partnerportal – frontendprototyp

En klickbar partnerportal med **Kraftringens interna resultatöversikt som huvudvy** och separata arbetsytor för aktiva säljpartners och fastighetsbolag. Designen följer referensbildernas marinblå och petrolfärgade uttryck.

Aktiva säljpartners arbetar vidare med företags- och BRF-affärer inom elhandel. Fastighetsbolag får ett inflyttningsflöde där nya bostadshyresgäster kan lämna testintresse i elhandel. Fiber och andra produktområden ingår inte.

Denna etapp omfattar frontend med exempeldata. Flöden, pipelinesteg, utbildningar och partnerresan är förslag att testa. Backend och integrationer ingår inte nu; ingen byggplattform är vald.

## Starta

Kör från projektroten:

```sh
python -m http.server 8000 --directory dist
```

Öppna <http://localhost:8000>. Appen består av vanlig HTML, CSS och JavaScript i `dist/`; inga paket eller byggsteg krävs.

## Arbetsplatsens vyer

| Vy | Det går att testa |
| --- | --- |
| Kraftringens resultatöversikt | Resultatbidrag före partnerkostnad, partnerkostnad, nettobidrag, nya avtal och avtalad årsvolym i MWh. Välj månad eller kvartal, filtrera partnertyp, jämför utfall och exportera ekonomiska exempel som CSV. Framtida potential visas separat. |
| Partners & partnerprofil | Sök och sortera partners efter exempelutfall. Granska en partner, redigera intern ansvarig, nästa steg, uppföljningsdatum och intern anteckning samt öppna partnerns arbetsyta. |
| Säljpartnerns översikt & pipeline | Nyckeltal från kundernas exempeldata, nästa steg, aktivitetshistorik och affärer per föreslaget steg. |
| Kunder | Registrera företag eller BRF, söka och filtrera, dokumentera kontakt och nästa steg. Internt team tilldelar demoansvarig, ändrar status eller pipelinesteg och delar återkoppling. |
| Offerter & avtal | Offertstudion har fyra steg: **Välj område → Beskriv behov → Välj kund → Granska & spara**. Sparade behovsunderlag kan öppnas igen, hämtas som TXT och markeras som skickade i en simulering. |
| Avtal & dokument | Prova lokala demosteg för fullmakt, avtal och signering samt öppna dokumentbiblioteket. |
| Kundsidor | Skapa och redigera kundsidans rubrik, introduktion, bild och kontaktknapp. Förhandsgranska och prova kontaktformuläret. |
| Partner Academy | Fyra demokurser med tre textmoment vardera, kategorifilter, bokmärken, klarmarkering och lokala framsteg per exempelpartner. En anmälan till en exempelgenomgång kan markeras i demo. |
| Material & kampanjer | Filtrera, förhandsvisa och hämta fyra TXT-mallar samt läsa en exempelbrief för kampanjplanering. |
| Provision | Visar öppna beslut och saknat underlag. **Ingen ersättning beräknas.** |
| Resultatrapport, internt | Ekonomiska nyckeltal och tabell för vald period och partnerurval samt CSV-export av exempelutfall. |
| Rapporter, säljpartner | Antal kunder och affärer per steg, aktivitetslogg och JSON-export av kunddata, offertutkast och kundsidor för vald demovy. |
| Partnerresan, endast internt | Följ varje partner separat genom åtta föreslagna steg: Rekrytera, Onboarda, Certifiera, Aktivera, Sälja, Leverera, Utveckla och Behålla. Två interna testaktiviteter per steg och exempelplacering kan sparas lokalt. |
| Fastighetsbolagets arbetsyta | Anpassa inflyttningssidans välkomstrubrik och introduktion, kopiera förhandsvisningslänk och sök eller öppna lokala testregistreringar. |
| Hyresgästens inflyttningssida | Tre steg: **Inflyttning → Kontakt → Granska**. Ange fiktiv adress, inflyttningsdatum, namn och e-post med `.example`; lägenhetsnummer och telefon är valfria. Registrera testintresse och hämta TXT-kvitto. |
| Hjälp & support / Test & beslut | FAQ, lokala testförfrågningar, öppna beslut, dataexport och återställning av exempeldata. |

Vid vanlig öppning visas den interna Kraftringen-vyn först. En inflyttningslänk öppnar i stället hyresgästförhandsvisningen. Partnerns meny anpassas efter partnertyp. Interna testanteckningar döljs i partnervyerna. Varningen för identiska kundnamn är en testhjälp; regler för dubbla registreringar är inte beslutade.

| Partner i registret | Hur namnet används |
| --- | --- |
| Savera (`syd`) | Aktiv säljpartners arbetsyta. Namnet har nämnts av användaren; status, resultat och övriga uppgifter är exempel. |
| Face-to-face · exempelupplägg (`vast`) | Exempel på säljupplägg, inte ett bekräftat partnerbolag. |
| Exempelfastigheter AB (`estate1`) | Fiktivt fastighetsbolag med inflyttningsflöde. |
| Exempelbo Förvaltning (`estate2`) | Fiktivt fastighetsbolag med separat inflyttningsflöde. |

## Testa ett sammanhängande flöde

1. Börja i Kraftringens resultatöversikt och jämför alla partners med en vald partner. Anteckna exempelvärdena för avtal och nettobidrag samt period och urval.
2. Öppna Savera i partneröversikten och gå till säljpartnerns arbetsyta. Registrera en fiktiv företags- eller BRF-dialog, dokumentera kontakt och förbered ett offertutkast genom studions fyra steg.
3. Återgå till Kraftringen för intern ansvarstilldelning och återkoppling. Kontrollera att partnerresan finns internt och att markeringar följer vald partner.
4. Öppna ett av fastighetsbolagen och dess inflyttningssida. Använd **Fyll med exempeluppgifter**, gå igenom Inflyttning, Kontakt och Granska, bekräfta fiktiva uppgifter och registrera testintresse.
5. Återgå till fastighetsbolagets **Registreringar** och Kraftringens partnerprofil. Kontrollera att testintresset finns sparat och syns som aktivitet, medan avtal och nettobidrag är oförändrade för samma period och urval. Registreringen har inte skapat någon verklig intäkt eller något avtal. Ladda om för att kontrollera lokal lagring.

Säljpartnerns befintliga offertstudio, dokumentdemosteg, kundsidor, Academy och materialbibliotek kan fortfarande testas från arbetsytan.

## Lokal data och demosteg

Använd enbart påhittade kund- och hyresgästuppgifter. Sparad testdata ligger i `localStorage` för aktuell webbplats och webbläsare under `partnerlabb.portal.v2`. `commercial.management` sparar intern partneruppföljning och partnerresans markeringar, `moveins` sparar intresseregistreringar och `propertySettings` sparar fastighetsbolagets presentation. Dessa kompletterar tidigare kunddata. Gamla `journey`-markeringar bevaras i datan men visas inte i den nya interna partnerresan.

Om giltig v2-data saknas läses tidigare kunddata från `partnerlabb.active.v1` på samma webbplats; kunder utan pipelinesteg får **Kunddialog**. Den gamla v1-posten raderas inte. Återställning tar bort lokala teständringar och laddar portalens exempeldata igen.

Två datorer delar inte data och öppna flikar synkas inte automatiskt. JSON-exporten är ett granskningsunderlag, ingen synkronisering eller fullständig säkerhetskopia av alla moduler.

Ekonomiskt utfall ligger som manuella exempelvärden i `commercial.js`, separat från kunddialoger och `moveins`. I demot är **nettobidrag = resultatbidrag före partnerkostnad − partnerkostnad**. MWh avser avtalad årsvolym för periodens nya exempelavtal, inte levererad el under perioden. Månad och kvartal har angivna jämförelseperioder; oktober och Q4 visar endast 1–7 oktober.

Framtida potential är en separat manuell ögonblicksbild och räknas inte in i utfallet. Inga belopp beräknas från elpris, avtalsvillkor, provisionsregler eller registreringar. **Intresseanmälan är varken avtal eller intäkt.** Ekonomiska definitioner och ersättningsregler behöver separat underlag.

Utskick, signering, kundsidepublicering, mötesbokning och supportkontakt är simuleringar. TXT-filer är demounderlag, inga kommersiella offerter, juridiska fullmakter eller avtal. Academy ger inga verkliga certifikat. Pris, produktvillkor, partnerns mandat och eventuell ersättning kräver underlag från Ludwig och Håkan.

Demovyerna styr visningen utan inloggning eller åtkomstskydd; även interna anteckningar finns i webbläsaren. Inga riktiga kunduppgifter eller anslutningar till Dynamics, Oneflow eller B2B Veckokollen används.

## Den privata testlänken

Den privata Sites-testlänken delas med Håkans två e-postidentiteter som externa besökare (**viewers**). Det ger visningsåtkomst, inte rätt att redigera byggprojektet. Sites-delningen och appens demovyer är olika saker; demovyerna skapar inga säkerhetsgränser i appen.

Hyresgästflödet är en förhandsvisning bakom samma privata testlänk. Det är ingen publik inflyttningssida i drift.

## Filer

- `dist/app.js`: gemensam navigation, lokal data, kunder, pipeline, översikt och rapporter.
- `dist/studio.js`: offertstudio och simulerade dokumentsteg.
- `dist/academy.js`: demokurser och utbildningsframsteg.
- `dist/partner.js`: säljpartnerns kundsidor, material och support.
- `dist/commercial.js`: intern resultatöversikt och partneruppföljning med ekonomisk exempeldata.
- `dist/property.js`: fastighetsbolagens arbetsyta och hyresgästers testintresse.
- [ASSETS.md](ASSETS.md): bildkällor. Bilderna är illustrationer, inte antagna godkända Kraftringen-bilder.

## Förslag för att bygga tillsammans

Förslag: **ett gemensamt Replit Core-projekt**, varsin inloggning, redigeringsåtkomst och Teams för samtalet. Börja med en AI-ändring åt gången. Core dokumenterar en aktiv bakgrundsuppgift per projekt; Pro upp till tio parallella Agent-uppgifter. Samma filer kan ändå ge konflikter. Konton och abonnemang har inte testats här.

Lovable dokumenterar separata utkast som accepteras ett i taget. ChatGPT Sites dokumenterar redigeringsbehörighet inom samma workspace; samtidig AI-redigering är inte verifierad. Senare kan GitHub och Codex med separata grenar eller worktrees användas. Att dela den färdiga portalen är ett annat samarbete än att redigera byggprojektet.

Officiella källor kontrollerade 7 oktober 2026:

- [Replit: Invite teammates](https://docs.replit.com/build/invite-teammates)
- [Lovable: Collaboration](https://docs.lovable.dev/features/collaboration) och [Drafts](https://docs.lovable.dev/features/drafts)
- [ChatGPT Sites: Creating and using Sites](https://help.openai.com/en/articles/20001339-creating-and-using-chatgpt-sites)
- [Codex: Git worktrees](https://learn.chatgpt.com/docs/environments/git-worktrees) och [Cloud](https://learn.chatgpt.com/docs/cloud)
