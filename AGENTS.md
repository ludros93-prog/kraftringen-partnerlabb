# Instruktioner för arbete i Kraftringen Partnerportal

## Förankrade fakta och öppna beslut

- Ludwig Rosenberg är teamchef för B2B-sälj på Kraftringen Kundcenter sedan juni 2026. Håkan Rusk är hans chef; någon ytterligare titel för Håkan är inte angiven.
- Användaren har valt aktiv säljpartner som arbetar vidare med affären och hela partnerarbetsplatsens frontend utifrån referensbildernas marinblå och petrolfärgade design. Backend ingår inte i denna etapp.
- Den interna Kraftringen-vyn är nu huvudvy och ska fokusera på kommersiellt resultat för alla partners eller vald partner. Partnerresan är endast intern och följs separat per partner.
- Aktiva säljpartners behåller arbetsytan för företag och BRF inom elhandel. Fastighetsbolag har en separat arbetsyta med inflyttningssida där nya bostadshyresgäster kan registrera testintresse i elhandel. Detta bostadsspår är godkänt; fiber och andra produktområden är fortsatt utanför scope.
- Partnerregistret använder `syd` = Savera (namnet är verkligt nämnt, alla resultat och statusar är exempel), `vast` = Face-to-face · exempelupplägg (inte ett bekräftat partnerbolag), `estate1` = Exempelfastigheter AB och `estate2` = Exempelbo Förvaltning.
- Arbetsflöden, pipelinesteg, partnerresans åtta steg, utbildningsinnehåll, befogenheter, informationsdelning och plattformsval är förslag eller öppna beslut.
- B2B Veckokollen är ett tidigare separat verktyg. Integration med det eller Dynamics är inte beslutad.
- Skilj i gränssnitt och dokumentation mellan användarens beslut, våra förslag och sådant som behöver verifieras. Hitta inte på kommersiella regler eller Kraftringens interna processer.

## Data och funktioner

- Skriv gränssnitt, exempeltexter och användardokumentation på svenska.
- Använd fiktiva kunder, hyresgäster och kontaktpersoner samt exempeladresser med `.example`. Lägg inte in riktiga kunduppgifter. Savera är ett namn som användaren lämnat, inte underlag för verkliga resultat, partnerstatus eller villkor.
- Kommersiella data är manuella exempelutfall för resultatbidrag före partnerkostnad, kostnad, avtal och MWh. Demots nettobidrag är angivet bidrag minus angiven partnerkostnad. MWh är avtalad årsvolym för periodens nya exempelavtal, inte periodens levererade el. Framtida potential är separat och ingår inte i utfallet. Beskriv inget av detta som verifierad ekonomi eller en ersättningsmodell. Registrering av kunddialog eller inflyttningsintresse får aldrig skapa ett avtal eller ekonomiskt utfall.
- Bevara det sammanhängande flödet kunder → offertstudio med fyra steg → simulerad fullmakt, avtal och signering. Offertutkast är behovsunderlag; TXT-nedladdningar är demotexter, inga juridiska dokument eller bindande offerter.
- Inför inte backend, riktiga integrationer, priser, produktvillkor, provisionsberäkning, leadägande, exklusivitet eller offertbefogenhet utan nytt underlag och instruktion från användaren. Provisionsvyn visar saknat underlag tills regler faktiskt lämnas.
- Academy innehåller textmoment, bokmärken och lokal klarmarkering. Beskriv det inte som verklig certifiering eller verifierade kunskapstest. Material, kampanjbrief och partnerresan är testförslag tills godkänt underlag har lämnats.
- Kundsidor och inflyttningssidor är lokala redigerbara förhandsvisningar. Hyresgästvyn ligger bakom den privata testlänken och är ingen publik sida i drift. Supportfrågor, utskick, anmälningar, dokumentsteg och kontaktformulär ska inte göra verkliga externa åtgärder.
- Visa partnerresan endast för den interna Kraftringen-vyn och spara två checklistaktiviteter per steg samt exempelplacering per partner i `commercial.management`. Äldre `state.journey` bevaras men dess gamla partnervy visas inte. Aktiva säljpartners och fastighetsbolag ska ha menyer anpassade till sina arbetsuppgifter.
- Bevara korta, tydliga demomärkningar. Samla utförligare begränsningar i Test & beslut och dokumentationen, så att produktflödena främst hjälper användaren genom sin uppgift.
- Demovyer och dolda interna anteckningar styr visningen; de är inget åtkomstskydd. All data är lokal och delas inte mellan datorer. Beskriv inte JSON-export som synkronisering eller som säkerhetskopia av alla moduler.
- Håkans två e-postidentiteter får extern visningsåtkomst på den privata Sites-testlänken. Detta innebär inte redigeringsåtkomst till byggprojektet. Blanda inte ihop Sites-delning med appens demovyväljare eller med säkerhetsgränser i appen.

## Teknik och verifiering

- Bevara prototypens statiska portabilitet: körbara filer ligger i `dist/` och ska kunna serveras utan paketinstallation eller byggsteg.
- `app.js` tillhandahåller `window.Portal`, partnerregistret och navigationen. `studio.js`, `academy.js`, `partner.js`, `commercial.js` och `property.js` registrerar sina vyer mot samma objekt. Behåll en gemensam lokal datamodell.
- Bevara kunddata och migreringen från `partnerlabb.active.v1` till `partnerlabb.portal.v2`. Giltig v2-data har företräde. Återställning ska fortsatt vara ett tydligt användarval.
- Nya dataområden `commercial.management`, `moveins` och `propertySettings` ska behålla befintliga kunddata och annan v2-data. De fasta ekonomiska exemplen i `commercial.js` ska hållas åtskilda från hyresgästers intresseregistreringar.
- Inflyttningsflödet har tre steg: Inflyttning, Kontakt och Granska. Bekräftelse gäller fiktivt testintresse, inget elavtal. Skapa en separat `moveins`-post och ett TXT-testkvitto; skapa inte kundrecord, offert, avtal eller ekonomiskt utfall från formuläret.
- Bevara responsiv layout, tangentbordsanvändning, formuläretiketter och tydliga sparmeddelanden.
- Dokumentera bildkällor i ASSETS.md. Anta inte att externa illustrationer eller referensbilder är godkända varumärkestillgångar från Kraftringen.
- Efter funktionella ändringar, kontrollera berörda användarflöden. Den nya huvudkedjan är intern resultatöversikt → vald partner → aktiv säljpartners arbetsyta → fastighetsbolag → hyresgästförhandsvisning → testregistrering → intern uppföljning utan ny verklig intäkt eller nytt avtal. Kontrollera också att partnerresan endast finns internt och är separat per partner.
- Bevara kundregistrering och återkoppling, offertstudions fyra steg, dokumentdemosteg, kundsideförhandsvisning och Academy för aktiva säljpartners. Kontrollera relevant lagring efter omladdning och perspektivbyten mellan partnertyper. Breda kontroller behövs när gemensam navigation eller data ändras.
- Uppdatera README när verkliga funktioner eller begränsningar ändras. Dokumentationsändringar behöver inte egna tester.
- Lova inte samtidig kodredigering eller parallellt AI-arbete utan aktuellt officiellt underlag för vald miljö. Skilj på att bygga samma projekt och att använda den publicerade portalen tillsammans.
