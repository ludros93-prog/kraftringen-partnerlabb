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
- Godkännande: Daniels ändringar behöver Ludwigs uttryckliga godkännande av
  konkret PR och aktuell commit före integration och Sites-publicering.
- Kodägare: .github/CODEOWNERS anger @ludros93-prog för alla filer. Tekniskt
  grenskydd är inte verifierat: anslutningen nekades att läsa och ändra
  granskningsregler med HTTP403. Ägaren behöver aktivera kravet i GitHub.
  Se GITHUB-ACCESS.md. CODEOWNERS-filen ensam spärrar inte direkt push.
- Samma timuppgift `Automation_e03c6b2fc3448191a58c63c969a090c0` heter nu
  **Partnerlivs pilotagent**. Den 10 oktober 2026 kl. 18:39 UTC bekräftade
  privat återläsning enabled, exakt prompt enligt PILOT-AGENT-PROMPT.txt,
  oförändrat timschema och Europe/Stockholm. Pilotmissionen och egen
  agent/-gren + PR styr arbetet; Daniels godkännandekrav består.
  Ingen extra automation skapades. Detta verifierar konfiguration och
  aktivering, inte en redan utförd körning med det nya pilotuppdraget.

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
Första överföringen är verifierad med gemensam SHA
`c777983132282ffef40c0cdde503b00eb2ab2002`; senare dokumentationscommits kan
följa. Aktuell kvittens står i WORKLOG.md. Automatisk synk, GitHub Actions, grenskydd
eller centralt delad testdata införs inte genom denna källflytt.
