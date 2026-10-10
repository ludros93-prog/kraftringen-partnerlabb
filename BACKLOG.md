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
Senaste arbetssätt ersätter den aktiva hyresgästdemon: fastighetsbolaget
registrerar via Excel eller manuellt och bifogar befintliga fullmakter.
Hyresgästen har inga aktiva portalsteg. Verifiera aktuell kandidat; tidigare
version 12-resultat räknas inte som test av de nya vägarna.

| Prioritet / ID | Nästa leverans | Status och godkänt när |
| --- | --- | --- |
| Publicerad / INFLYTT-04 | Partnerns manuella registrering och Excel-import med fullmaktsbilagor. | Båda ingångarna är implementerade med fält/radfel, dubblettkontroll, uttrycklig registrering, rätt bilagekoppling och fullmakt-saknas-status. 109 browserkontroller passerar. Ingen aktiv hyresgästvy och ingen automatisk fullmakt/ekonomi. Publicerad i version 13 via PR #6; kvittens i WORKLOG. |
| Genomförd / PILOT-01 | Ny fiktiv generalrepetition för båda registreringsvägarna. | 61 service-, 13 utkast-, 30 demo- och 5 integritetskontroller passerar: faktisk .xlsx-fil, dokument, lagringsfel, omladdning, avbrott, återställning, äldre data, mobil/tangentbord och oförändrad ekonomi. Tidigare 75/34 kontroller av version 12 är historiska belägg. |
| Publicerad / DEMO-01 | Anpassa guidningen till fastighetsbolag → underlag/fullmakter → förmedling → Kraftringen → återkoppling. | Alla aktiva portalsteg görs av fastighetsbolaget eller Kraftringen. Guiden registrerar eller förmedlar inte automatiskt; aktuell markering består efter omladdning. Befintlig isolerad demoyta återanvänds; publicerad i version 13. |
| Bevara / DEMO-02 | Visuellt sammanhållen kunddemo. | Version 12 gav gemensam Inter-typografi, tydliga knappar, bostadsillustration och responsiva ärendekort. Bevara kvaliteten i nya Excel-/manuella vyer och verifiera igen där ändringar sker. Designval är inte uppmätt verklig användarnytta. |
| Bevara / INFLYTT-03 | Kvittoåterupptagning från merged [PR #1](https://github.com/ludros93-prog/kraftringen-partnerlabb/pull/1). | PR #1 ingår i PR #4 och version 12. Återanvänd samma post/referens med aktuell status i partnerflödet; uppdatera testförväntningar när vyn ersätts. |
| Publicerad / DEMO-03 | Behåll guidens aktuella moment efter omladdning. | URL-markören skiljer registrering/förmedling från återkoppling. Steg 3 och 5 håller rätt markering efter omladdning utan automatiska ärendehändelser; omstart rensar markören. Publicerad i version 13. |
| 5 / PILOT-03 | Åtgärda återstående reproducerad friktion i inflyttning eller handläggning. | Konkret före/efter, relevant kontroll, bevarad data och tydlig användarnytta. Samordna med öppna PR:er. |
| Kandidat / PILOT-03A | Låt en korrigerad Excel-rad passera efter en tidigare felaktig rad med samma ärendeidentitet. | Endast validerade rader reserverar identiteten i filgranskningen. Regression finns i `qa/property-intake.py` och `qa/property-intake-dedup.mjs`; kandidat väntar i egen PR. |
| 6 / PILOT-00 | Håll fakta, beslut och källor uppdaterade. | Första inventering finns. Nästa ändring kräver nytt belägg; D-01–D-04 är inte besvarade och behöver inte stoppa oberoende demoarbete. |
| 7 / PILOT-02 | Förbered minsta fiktiva ärende-/importmall och definiera mätetalens källor. | Service, avtal, årsvolym och kickback har skilda händelser och källreferenser. Inga nya verkliga satser eller automatiska beräkningar. |
| Senare / PILOT-04 | Gemensam ärendelagring och verklig behörighet i godkänd miljö. | Genomförande väntar på D-02/D-03 och separat mandat. Agenten får förbereda alternativ och verifieringsplan inom nuvarande uppdrag. |
| Senare / DATA-01 | Verkligt kommersiellt utfall och kickback per kanal. | Genomförande väntar på D-04 och data-/integrationsmandat. Saknat underlag är inte nollutfall. |

Generell Academy-/CPQ-/säljapputbyggnad och leverantörsresearch utan konkret
pilotbehov prioriteras efter denna kö. Nedan bevaras tidigare belägg och
leveranshistorik. Historiska hyresgäststeg nedan beskriver äldre versioner
och är inte dagens arbetssätt eller en kö för återinförande.

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
