# PILOT-01 — Acceptanspaket för inflyttningsservice

Mål: ett fastighetsbolag och en utsedd handläggare på Kraftringen ska kunna
följa samma inflyttningsärende från frivilligt tjänsteval till återkoppling.
Detta är ett föreslaget acceptanspaket, inte ett fastställt arbetssätt eller
en kvittens på att Partnerlabb kan ta emot riktiga ärenden.

## Testunderlag och gräns

Använd två fiktiva partners, `Exempelfastigheter AB` och `Exempelbo
Förvaltning`, samt hyresgästen `Test Hyresgäst` med kontaktadressen
`hyresgast@inflyttning.example`. Även bostadsuppgifter ska vara påhittade.
Ett testdatum är inte en svarstid eller ett leveranslöfte.

Fält i nuvarande demo används enbart för att testa befintlig kod. De
bekräftar inte vilka person-, bostads- eller avtalsuppgifter verksamheten
behöver. Fullmaktsmarkeringen är en simulering utan rättsverkan.

Den bekräftade affärsidén omfattar partnerns förmedling till Kraftringen.
En direktlänk där hyresgästen lämnar underlaget direkt till Kraftringen är
ett separat förslag; byt inte förmedlingssätt innan beslut finns.

## Fiktiva testfall

Kör fallen i ordning mot en isolerad testprofil. Anteckna källrevision,
testfall, faktiskt resultat och eventuellt fel. Ett fall utan genomförd
verifiering märks `Ej testat`; en saknad beslutad förutsättning märks
`Blockerat`.

| Fall | Handling | Godkänt resultat i lokal demo |
|---|---|---|
| A1 — Frivilligt val | Öppna ett nytt underlag och avstå från tjänsten. | Inget nytt serviceärende, kundrecord, avtal eller ekonomiskt utfall skapas. Tjänsteval och fullmaktsmarkering är inte förvalda i ett nytt underlag. Återupptagna egna val ska vara möjliga att ändra före registrering. |
| A2 — Registrering | Lämna fiktivt underlag, gör uttryckliga demoval, granska och registrera en gång. | Exakt ett serviceunderlag får en referens och tillhör rätt partner. Det är ännu inte förmedlat. Kvittot beskriver registreringen utan att påstå giltig fullmakt eller elavtal. |
| A3 — Förmedling | Partnern väljer att förmedla det registrerade underlaget. | Samma ärende får förmedlingsstatus och en historikhändelse. Den interna arbetslistan visar Kraftringens nästa insats. Ett partnerperspektiv får inte redigera interna handläggningsfält. |
| A4 — Handläggning | Kraftringen tar upp ärendet och anger nästa steg. | Elhandel, elnätshantering och hyresgästens erbjudandeval följs separat. Angivet nästa steg sparas och återfinns efter omladdning. En intern anteckning återges inte i partnerns vy eller testkvitto. |
| A5 — Komplettering | Kraftringen begär en konkret komplettering. Partnern korrigerar tillåtet bostadsunderlag och förmedlar igen. | Ändringen behåller samma referens och historik. Partnern ändrar inte hyresgästens tjänsteval eller fullmaktsmarkering. Kraftringen får en mottagningsinsats; partnerns gamla kompletteringsplan/datum tillskrivs inte automatiskt Kraftringen. En senare uttrycklig intern plan behålls. |
| A6 — Återkoppling utan elavtal | Slutför den simulerade hjälpen med hyresgästens erbjudandeval satt till avstående. | Ärendet kan få återkoppling om hjälpen enligt demots föreslagna statusregler. Avstående förblir synligt och inget kundrecord, elavtal, intäkt eller kickback skapas. Slutförd service är inte bevis på ett elhandelsavtal. |
| A7 — Avbrott och befintlig registrering | Avbryt ett utkast, ladda om och registrera färdigt. Ladda sedan om efter registreringen. | Utkast återupptas inom samma partner/flik, utan nytt ärende före slutregistrering. Återfinnande av ett registrerat underlag ska använda samma post och aktuell status, utan dubblett. Den sista delen är ett förslag i öppet PR #1 och ska verifieras på vald kandidat. |
| A8 — Avgränsning och fel | Byt exempelpartner, prova felande lagring och genomför relevanta steg på mobil och med tangentbord. | Partner B:s vy visar inte partner A:s testärende. Misslyckad lagring ger begripligt fel och ingen falsk sparbekräftelse. Berörda steg kan genomföras vid 320/390 px och med tangentbord. Befintliga poster och kommersiella exempelvärden bevaras. |

A8 verifierar endast demots visningslogik. Perspektivbyte i samma
webbläsare är inte ett test av riktig autentisering eller åtkomstkontroll.

## Befintlig kodverifiering att återanvända

- `qa/movein-service.py`: tjänsteval, registrering, förmedling,
  komplettering, separata handläggningsdelar, återkoppling utan accepterat
  erbjudande, vyavgränsning, oförändrade affärsvärden och responsivitet.
- `qa/movein-drafts.py`: utkast, avbrott, partnerisolering, felande lagring,
  omladdning, tangentbord och mobil.
- `qa/movein-next-action.mjs`: avslutad kompletteringsplan, historik och
  Kraftringens nästa insats efter återförmedling.
- PR #1, `codex/inflytt-03-kvitto`: föreslaget återfinnande av registrerat
  testunderlag samt `qa/movein-receipt.mjs`. PR:en är öppen och var inte
  integrerad vid kontrollen den 10 oktober 2026. Aktuell verifiering ska
  knytas till PR:ens dåvarande HEAD, inte en äldre commit.

PR #1 redovisar körda syntax-/modulkontroller och att browser-QA återstår.
Denna dokumentation är ingen ny testkörning eller kvittens på att alla
acceptansfall passerar. Uppdatera förväntningar och tester tillsammans om
verksamheten senare beslutar ett annat flöde.

## Innan samma paket kan användas i en riktig pilot

Följande ska vara beslutade och verifierade i den godkända pilotmiljön.
Lokal demodata eller tester i ett enda webbläsarkonto uppfyller inte kraven.

| Förutsättning | Bevis som behövs |
|---|---|
| Arbetssätt och ansvar | Namngiven pilotpartner och handläggare; beslutad förmedlingsväg, nödvändiga uppgifter, fullmakts-/avtalsprocess och definition av slutförd hjälp. De föreslagna enkla statusarna fastställs eller ändras. |
| Gemensamt ärende | Partner och handläggare i separata sessioner ser samma verkliga pilotärende och dess uppdateringar från godkänd lagring. Referens och historik består efter avbrott; upprepad inskickning skapar inte okontrollerade dubbletter. |
| Riktiga behörigheter | Separata testidentiteter visar att endast avsedda ärenden och uppgifter är åtkomliga, även vid direkt åtkomstförsök. Interna anteckningar skyddas i tjänsten, inte bara genom dolda gränssnitt. |
| Verklig återkoppling | Beslutad mottagare får den beslutade återkopplingen genom godkänd kanal. Utebliven eller misslyckad återkoppling går att upptäcka och åtgärda; sparad text räknas inte automatiskt som skickat meddelande. |
| Service, avtal och ekonomi | Slutförd service och ett aktiverat elhandelsavtal kan beläggas var för sig. Kickback stäms av mot godkänt underlag. Saknade ekonomiska uppgifter redovisas som saknade, utan uppskattade ersättningsregler. |
| Pilotbeslut | Ansvariga accepterar genomfört flödestest, kvarvarande avvikelser och hur ett ärende tas om hand vid driftproblem, innan riktiga hyresgästuppgifter tas emot. |

Vid en liten överenskommen serie pilotinflyttningar följs faktiskt
genomförda steg, kompletteringar, handläggning och återkoppling. Anteckna
var användarna fastnar och vilka manuella insatser som krävs. Ange ingen
utlovad tidsbesparing eller konvertering innan den har mätts.
