# Prioriterad utvecklingskö

Källor: användarens aktiverade masterprompt, aktuell kod och isolerade
reproduktioner 8 oktober 2026. Detta är ingen undersökning av verkligt
användarbeteende. Bekräftade affärsfakta finns i AGENTS.md.

## Aktiv pilotkö – 10 oktober 2026

PILOT-MISSION.md styr prioriteringen. Uppgifter nedan använder fiktiva data
inom nuvarande frontendmandat. Högst två färdiga pilotförslag väntar på
granskning; kontrollera öppna PR:er innan ny leverans.
Nyare styrning: kom så långt som möjligt utan faktisk kund. Färdigställ
självständigt oberoende demo-, frontend- och testarbete. Saknad pilotkund
blockerar verkliga användarutfall, inte en fungerande fiktiv kunddemo.

| Prioritet / ID | Nästa leverans | Status och godkänt när |
| --- | --- | --- |
| Publicerad / DEMO-01 | Fem guidade moment: partner → hyresgäst → förmedling → Kraftringen → återkoppling. | Implementerad, browserverifierad och publicerad i version 12 via PR #4; kvittens i WORKLOG. Navigationshopp skapar inga tjänsteval eller ärendehändelser. Bygg inte en ny kopia. |
| Publicerad / DEMO-02 | Visuellt sammanhållen kunddemo. | Version 12: gemensam Inter-typografi, tydliga knappar, bostadsillustration och responsiva ärendekort. Mobil/desktop och relevanta tangentbordsflöden kontrollerade. Designval är inte uppmätt verklig användarnytta. |
| Publicerad / INFLYTT-03 | Kvittoåterupptagning från befintligt [PR #1](https://github.com/ludros93-prog/kraftringen-partnerlabb/pull/1). | PR #1 ingår i PR #4 och är merged. Samma post återfinns med aktuell status utan dubblett. Publicerad i version 12; skapa ingen ny kvittokopia. |
| Genomförd / PILOT-01 | Fiktiv generalrepetition. | 75 befintliga flödeskontroller, utkastregression och 34 nya demokontroller passerar. Omladdning/omstart bevarar ordinarie labbdata och ekonomi. Version 12 publicerad. Ny verifiering behövs när ändringar eller nya fynd motiverar den. |
| 5 / DEMO-03 | Behåll guidens markering för steg 5 efter omladdning. | Slutgranskningen reproducerade att rätt partnerunderlag visas men guiden markerar steg 3. Endast orientering påverkas. Bevara aktuellt perspektiv utan att skapa ärendehändelser eller ändra vanliga data; kontrollera omladdning och omstart. |
| 5 / PILOT-03 | Åtgärda återstående reproducerad friktion i inflyttning eller handläggning. | Konkret före/efter, relevant kontroll, bevarad data och tydlig användarnytta. Samordna med öppna PR:er. |
| 6 / PILOT-00 | Håll fakta, beslut och källor uppdaterade. | Första inventering finns. Nästa ändring kräver nytt belägg; D-01–D-04 är inte besvarade och behöver inte stoppa oberoende demoarbete. |
| 7 / PILOT-02 | Förbered minsta fiktiva ärende-/importmall och definiera mätetalens källor. | Service, avtal, årsvolym och kickback har skilda händelser och källreferenser. Inga nya verkliga satser eller automatiska beräkningar. |
| Senare / PILOT-04 | Gemensam ärendelagring och verklig behörighet i godkänd miljö. | Genomförande väntar på D-02/D-03 och separat mandat. Agenten får förbereda alternativ och verifieringsplan inom nuvarande uppdrag. |
| Senare / DATA-01 | Verkligt kommersiellt utfall och kickback per kanal. | Genomförande väntar på D-04 och data-/integrationsmandat. Saknat underlag är inte nollutfall. |

Generell Academy-/CPQ-/säljapputbyggnad och leverantörsresearch utan konkret
pilotbehov prioriteras efter denna kö. Nedan bevaras tidigare belägg och
leveranshistorik.

## INFLYTT-01 — Återuppta hyresgästens pågående underlag

- Status: klar och publicerad i version 10; kvittens finns i WORKLOG.md.
- Belägg: efter ifylld bostad/kontakt och stegbyte försvinner utkastet vid
  omladdning. `P.openMovein()` rensar också vid återöppning. Modulvariabler i
  property.js var enda plats för utkast och steg.
- Nytta: hyresgästen kan fortsätta sitt exempelunderlag efter avbrott.
- Avgränsning: sessionStorage per fastighetspartner/flik, befintliga fält/steg,
  tydlig sparstatus och Börja om. Inga nya affärsobjekt före slutregistrering.
- Godkänt när: omladdning/återöppning behåller pågående underlag; partnerbyte
  isolerar utkast; avstående/nystart/återställning rensar; lagringsfel beskrivs
  korrekt; befintlig frivillighet och fristående ekonomi bevaras.
- Verifiering: riktad webbläsarregression för sessionsutkast samt 71 befintliga
  inflyttningskontroller, inklusive förmedling/handläggning, migreringar,
  affärsdata och 1440/390/320 px. Ett fördröjt change-event från ett ersatt
  formulär binds nu till rätt partnerutkast.

## INFLYTT-02 — Rätt nästa insats efter kompletterad överlämning

- Status: klar och publicerad i version 11; kvittens finns i WORKLOG.md.
- Belägg: en needs_info-rad med "Stäm av lägenhetsuppgiften med hyresgästen"
  förmedlas på nytt. Arbetslistan byter ansvar till Kraftringen men behåller
  partnerns tidigare next/nextDate. Verifierat genom modul-API:er i isolerad VM.
- Källor: movein-service.js forward() och workspace.js taskForMovein().
- Nytta: mottagande team får en handling som passar aktuell överlämning.
- Avgränsning: skilj föregående kompletteringsplan från mottagning efter
  överlämning. Bevara historik och uttrycklig plan som teamet anger senare.
- Godkänt när: efter förmedling visas en mottagningsinsats hos Kraftringen;
  tidigare plan/datum tillskrivs inte automatiskt teamet; explicita senare
  uppdateringar behålls; service och ekonomi är fortsatt separata.
- Lösning: ny förmedling av en komplettering märks som `supplement`, den tidigare
  partnerplanen avslutas i aktivitetshistoriken och aktivt nästa steg/datum
  rensas. Arbetslistan visar därefter Kraftringens mottagningsinsats. En senare
  uttrycklig intern plan har fortsatt företräde.
- Verifiering: `qa/movein-next-action.mjs`, JavaScript-syntax, Python-AST för den
  utökade webbläsarregressionen och diffkontroll. Browser-QA återstår när Sites-
  miljön erbjuder den föreskrivna browserkontrollen.

## INFLYTT-03 — Hitta redan registrerat testkvitto efter omladdning

- Status: klar och publicerad i version 12. [PR #1](https://github.com/ludros93-prog/kraftringen-partnerlabb/pull/1), HEAD `feff078d6eb797ce0226071b855227d443a29f00`, införlivades genom PR #4 och GitHub bekräftade merged den 10 oktober 2026 kl. 19:05 UTC.
- Belägg: receipt ligger modullokalt; serviceposten sparas redan i moveins.
- Möjlig nytta: hitta befintligt underlag utan att registrera samma sak igen.
- Avgränsning: återanvänd faktiskt sparad post och dess aktuella status.
  Skapa inte automatisk dubblett, kund, avtal eller hypotetisk bekräftelse.
- Verifiering i förslaget: `qa/movein-receipt.mjs`, befintlig nästa-insatsregression,
  syntax-/AST- och diffkontroller. Browser-QA slutfördes den 10 oktober 2026
  i kunddemoleveransen; återanvänd implementationen.
- Lösning: första steget visar den senaste lokalt registrerade posten för vald
  fastighetspartner, med referens och aktuell ärendestatus. Användaren kan öppna
  samma post och hämta ett uppdaterat testkvitto. Seedade exempel, äldre
  intressen och andra partners poster erbjuds inte som återställbara kvitton.
- Verifiering: beroendefria `qa/movein-receipt.mjs`, befintliga
  `qa/movein-next-action.mjs`, JavaScript-syntax, Python-AST för den utökade
  webbläsarregressionen och diffkontroll passerar. Browser-QA slutfördes
  den 10 oktober 2026 med 75 servicekontroller, utkastregression och 34
  demokontroller i den portabla förhandsvisningen.

## RESEARCH-01 — Identifiera Saleshub och tillämpa en relevant princip

- Status: saknar säker produktidentifiering.
- Belägg: användaren har angett Saleshub; det är inte verifierat att det är
  HubSpot Sales Hub. Lime och Salesforce kan granskas oberoende via officiella
  källor. BENCHMARK.md har tidigare dokumenterad inspiration från andra system.
- Godkänt när: produkten/källan är verifierad och en relevant, tydligt
  avgränsad princip är dokumenterad eller omsatt i en belagd förbättring.

## DATA-01 — Verkligt utfall, kickback och integrationer

- Status: väntar på verksamhetsunderlag; blockerar inte oberoende frontendarbete.
- Saknas: faktiska datakällor, ersättningsvillkor, avtals-/prisunderlag,
  integrationsmandat och bekräftat erbjudande för inflyttningskanalen.
- Ingen beräkning eller verklig anslutning får uppfinnas. Rapportexemplen,
  årsvolymdefinitionen och separata churnmått ska förbli spårbara.
