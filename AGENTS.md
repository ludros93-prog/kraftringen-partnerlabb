# Instruktioner för arbete i Kraftringen Partnerportal

## Förankrade fakta och öppna beslut

- Ludwig Rosenberg är teamchef för B2B-sälj på Kraftringen Kundcenter sedan juni 2026. Håkan Rusk är hans chef; någon ytterligare titel för Håkan är inte angiven.
- Användaren har valt aktiv säljpartner som arbetar vidare med affären och vill nu bygga hela partnerarbetsplatsens frontend utifrån referensbildernas marinblå och petrolfärgade design. Backend ingår inte i denna etapp.
- Företag och BRF inom elhandel är fokus. Privatkunder, fiber och ytterligare produktområden i referensbilderna innebär inte en beslutad utökning av scope.
- Arbetsflöden, pipelinesteg, partnerresans åtta steg, utbildningsinnehåll, befogenheter, informationsdelning och plattformsval är förslag eller öppna beslut.
- B2B Veckokollen är ett tidigare separat verktyg. Integration med det eller Dynamics är inte beslutad.
- Skilj i gränssnitt och dokumentation mellan användarens beslut, våra förslag och sådant som behöver verifieras. Hitta inte på kommersiella regler eller Kraftringens interna processer.

## Data och funktioner

- Skriv gränssnitt, exempeltexter och användardokumentation på svenska.
- Använd endast fiktiva organisationer och personer samt exempeladresser med `.example`. Lägg inte in riktiga kunduppgifter.
- Bevara det sammanhängande flödet kunder → offertstudio med fyra steg → simulerad fullmakt, avtal och signering. Offertutkast är behovsunderlag; TXT-nedladdningar är demotexter, inga juridiska dokument eller bindande offerter.
- Inför inte backend, riktiga integrationer, priser, produktvillkor, provisionsberäkning, leadägande, exklusivitet eller offertbefogenhet utan nytt underlag och instruktion från användaren. Provisionsvyn visar saknat underlag tills regler faktiskt lämnas.
- Academy innehåller textmoment, bokmärken och lokal klarmarkering. Beskriv det inte som verklig certifiering eller verifierade kunskapstest. Material, kampanjbrief och partnerresan är testförslag tills godkänt underlag har lämnats.
- Kundsidor är lokala redigerbara förhandsvisningar. Supportfrågor, utskick, anmälningar, dokumentsteg och kontaktformulär ska inte göra verkliga externa åtgärder.
- Bevara korta, tydliga demomärkningar. Samla utförligare begränsningar i Test & beslut och dokumentationen, så att produktflödena främst hjälper användaren genom sin uppgift.
- Demovyer och dolda interna anteckningar styr visningen; de är inget åtkomstskydd. All data är lokal och delas inte mellan datorer. Beskriv inte JSON-export som synkronisering eller som säkerhetskopia av alla moduler.

## Teknik och verifiering

- Bevara prototypens statiska portabilitet: körbara filer ligger i `dist/` och ska kunna serveras utan paketinstallation eller byggsteg.
- `app.js` tillhandahåller `window.Portal` och navigationen. `studio.js`, `academy.js` och `partner.js` registrerar sina vyer mot samma objekt. Behåll en gemensam lokal datamodell.
- Bevara kunddata och migreringen från `partnerlabb.active.v1` till `partnerlabb.portal.v2`. Giltig v2-data har företräde. Återställning ska fortsatt vara ett tydligt användarval.
- Bevara responsiv layout, tangentbordsanvändning, formuläretiketter och tydliga sparmeddelanden.
- Dokumentera bildkällor i ASSETS.md. Anta inte att externa illustrationer eller referensbilder är godkända varumärkestillgångar från Kraftringen.
- Efter funktionella ändringar, kontrollera berörda användarflöden: kundregistrering och återkoppling, offertstudions fyra steg, dokumentdemosteg, kundsideförhandsvisning, Academy och partnerresan. Kontrollera relevanta sparade ändringar efter omladdning och den andra exempelpartnerns vy. Breda kontroller behövs när gemensam navigation eller data ändras.
- Uppdatera README när verkliga funktioner eller begränsningar ändras. Dokumentationsändringar behöver inte egna tester.
- Lova inte samtidig kodredigering eller parallellt AI-arbete utan aktuellt officiellt underlag för vald miljö. Skilj på att bygga samma projekt och att använda den publicerade portalen tillsammans.
