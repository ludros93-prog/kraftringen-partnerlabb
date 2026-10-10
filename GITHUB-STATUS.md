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
- Samma timuppgift `Automation_e03c6b2fc3448191a58c63c969a090c0` heter
  **Partnerlivs pilotagent**. Den 10 oktober 2026 kl. 20:53 UTC bekräftade
  privat återläsning enabled=true och exakt prompt enligt
  PILOT-AGENT-PROMPT.txt, med oförändrat timschema och Europe/Stockholm.
  Uppdraget omfattar nu enkel Savera-uppföljning, Insikter och partnerns
  kunder/kickback tillsammans med stabil Excel-/manuell inflyttning.
  Fastighetsbolaget gör allt aktivt portalarbete; hyresgästen har inga
  portalsteg. Egen agent/-gren + PR och Daniels godkännandekrav består.
  Ingen extra automation skapades. Senaste registrerade körning är
  20:06:42 UTC; next_run_time saknar värde. Detta verifierar konfiguration
  och aktivering, inte att den nya prompten redan har körts.

## Publicerad portal och källöverföring

Sites är publiceringsmål för det befintliga projektet
`appgprj_6ac600ecf7d48191923687550810c1d4`. Portalen har fortfarande custom-
åtkomst enligt samma delningspolicy. GitHub-repots publika kod ändrar inte
Sites-inloggningen.

Senast verifierade lyckade publicering är version 15 med SHA
`3e1b873f5a2fdacf1dbd14e733155a226d53f5ed` på
https://kraftringen-partnerlabb.rosen123.chatgpt.site.
Savera öppnas via `#savera`, Insikter via `#insikter`, fastighetspartnerns
resultat via `?workspace=estate1#property-results`. Kunddemot finns kvar
via `?demo=inflyttning#demo`. PR #10 integrerades i GitHub-main och fördes
fast-forward till Sites-källan utan att PR #8:s importkorrigering eller
andras historik skrevs över.
Native deployment `appgdep_6acaa585ed088191b855c17684a773c3` bekräftade
`succeeded` den 10 oktober 2026 kl. 20:52:37 UTC. Version-ID:
`appgprj_6ac600ecf7d48191923687550810c1d4~appgver_948b364251f08191a24280bf34cc0866`.
Färsk metadata bekräftade version 15, custom-åtkomst och policyrevision 4.
104 browserkontroller för rapporterna, 62 för servicekedjan och 5 för
integritet passerar; även Node-regressioner, syntax och visuell mobil-/
desktopkontroll passerar. Den tidigare browserluckan för PR #8 är därmed
verifierad i denna samlade leverans. Detta är fortfarande fiktiv, lokal
frontenddata. Efterhandskvittensen ändrar endast dokumentation.

För över GitHub-main med bibehållen historik och fast-forward enligt RUNBOOK.
Första överföringen är verifierad med gemensam SHA
`c777983132282ffef40c0cdde503b00eb2ab2002`; senare dokumentationscommits kan
följa. Aktuell kvittens står i WORKLOG.md. Automatisk synk, GitHub Actions, grenskydd
eller centralt delad testdata införs inte genom denna källflytt.
