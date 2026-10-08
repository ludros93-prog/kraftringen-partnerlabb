# GitHubövergångens status

- Status: `active` — GitHub är huvudkälla för kod och arbetsminne.
- Repo: https://github.com/ludros93-prog/kraftringen-partnerlabb
- Synlighet: publikt, uttryckligen valt av användaren den 8 oktober 2026.
- Första importen är pushad och återläst från GitHub-main:
  `344dead6445cbdd3e3faa81472f06062b9116add`.
- Aktuell Sites-källa vid importen:
  `7b8f4988aff6aac4712a3c411e0d6c2770b14488`. Hela historiken och den
  senaste frontendversionen ingår. GitHub-main kan därefter ha nyare commits.
- Daniel: GitHub-kontot `daniel-smail` har verifierad `read`-behörighet.
  Publik läsning ger inte skrivåtkomst. Anslutningen nekades att bjuda in
  honom med HTTP 403; repoägaren behöver ordna utvecklaråtkomst i Collaborators.
- Aktiv arbetsrutin: RUNBOOK.md och COLLABORATION.md, egen gren + pull request.
  Ludwig/Codex samordnar integration till main och Sites-publicering.
- Samma timuppgift `Automation_e03c6b2fc3448191a58c63c969a090c0` har en sparad,
  återläst prompt för färsk GitHub-main och egen agent/-gren + PR. Schema och
  Europe/Stockholm är bevarade. Uppgiften är tillfälligt pausad under sista
  källöverföringen; återaktivering kvitteras i WORKLOG.md.

## Publicerad portal och källöverföring

Sites är publiceringsmål för det befintliga projektet
`appgprj_6ac600ecf7d48191923687550810c1d4`. Portalen har fortfarande custom-
åtkomst enligt samma delningspolicy. GitHub-repots publika kod ändrar inte
Sites-inloggningen.

Senast verifierade lyckade publicering är version 11 med SHA
`6882cde49905a672087809b7829d23d3fa59c117` på
https://kraftringen-partnerlabb.rosen123.chatgpt.site.
Övergången ändrar bara utvecklingsinstruktioner; dist och hostingmanifest är
identiska med den färska Sites-källan. Ingen ny frontendpublicering behövs.

För över GitHub-main med bibehållen historik och fast-forward enligt RUNBOOK.
Aktuell kvittens står i WORKLOG.md. Automatisk synk, GitHub Actions, grenskydd
eller centralt delad testdata införs inte genom denna källflytt.
