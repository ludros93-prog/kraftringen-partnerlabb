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
  **Partnerlivs pilotagent**. Den 10 oktober 2026 kl. 19:32 UTC bekräftade
  privat återläsning enabled, exakt prompt enligt PILOT-AGENT-PROMPT.txt,
  oförändrat timschema och Europe/Stockholm. Det senaste uppdraget är att
  färdigställa och förbättra en snygg, enkel kunddemo utan att invänta en
  faktisk kund. Fastighetsbolaget sköter allt aktivt portaljobb via Excel eller
  manuell registrering med fullmaktsbilagor; hyresgästen har inga aktiva
  portalsteg. Pilotmissionen och egen agent/-gren + PR styr arbetet;
  Daniels godkännandekrav består.
  Ingen extra automation skapades. Detta verifierar konfiguration och
  aktivering, inte en redan utförd körning med det nya pilotuppdraget.

## Publicerad portal och källöverföring

Sites är publiceringsmål för det befintliga projektet
`appgprj_6ac600ecf7d48191923687550810c1d4`. Portalen har fortfarande custom-
åtkomst enligt samma delningspolicy. GitHub-repots publika kod ändrar inte
Sites-inloggningen.

Senast verifierade lyckade publicering är version 14 med SHA
`b05a5d5863852349ea372e089f34b679bb10f728` på
https://kraftringen-partnerlabb.rosen123.chatgpt.site.
Kunddemot öppnas via `?demo=inflyttning#demo`. PR #8 integrerades i GitHub-main,
fördes fast-forward till Sites-källan och publicerades från exakt samma SHA.
Native deployment `appgdep_6acaa273de2c8191a9b7a0c0baf051fa` bekräftade
`succeeded` den 10 oktober 2026 kl. 20:39 UTC. Custom-åtkomst, policyrevision 4
och tre externa visningsanvändare bevarades. Riktade Node-kontroller passerade;
full browserregression kunde inte köras om i aktuell miljö. Verifiering och
versions-ID finns i WORKLOG.md. Efterhandskvittensen ändrar endast dokumentation.

För över GitHub-main med bibehållen historik och fast-forward enligt RUNBOOK.
Första överföringen är verifierad med gemensam SHA
`c777983132282ffef40c0cdde503b00eb2ab2002`; senare dokumentationscommits kan
följa. Aktuell kvittens står i WORKLOG.md. Automatisk synk, GitHub Actions, grenskydd
eller centralt delad testdata införs inte genom denna källflytt.
