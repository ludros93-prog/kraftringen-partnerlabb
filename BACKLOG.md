# Prioriterad utvecklingskö

Källor: användarens aktiverade masterprompt, aktuell kod och isolerade
reproduktioner 8 oktober 2026. Detta är ingen undersökning av verkligt
användarbeteende. Bekräftade affärsfakta finns i AGENTS.md.

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

- Status: behöver avgränsas och reproduceras i gränssnittet.
- Belägg: receipt ligger modullokalt; serviceposten sparas redan i moveins.
- Möjlig nytta: hitta befintligt underlag utan att registrera samma sak igen.
- Avgränsning: återanvänd faktiskt sparad post och dess aktuella status.
  Skapa inte automatisk dubblett, kund, avtal eller hypotetisk bekräftelse.

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
