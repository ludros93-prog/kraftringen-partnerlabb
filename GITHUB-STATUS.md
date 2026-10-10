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

Senast verifierade lyckade publicering är version 16 med SHA
`042f40acc77175f257bb141335d29057b29c07b4` på
https://kraftringen-partnerlabb.rosen123.chatgpt.site.
PR #12 bevarar fastighetspartnerns rapportperiod efter omladdning.
Alla tidigare publicerade moduler och historik är bevarade; jämfört med
version 15 ändras endast dist/property-results.js i publiceringsinnehållet.
GitHub-main överfördes fast-forward till Sites utan force-push.

Native deployment `appgdep_6acaab2f57c88191bb7afa714431b704` bekräftade
`succeeded` den 10 oktober 2026 kl. 21:16:36 UTC. Version-ID:
`appgprj_6ac600ecf7d48191923687550810c1d4~appgver_67a3b4aaca588191b2f391ce2fcd4bac`.
Färsk metadata bekräftade version 16 och exakt oförändrad custom-delning,
policyrevision 4 och tre externa visningsbehörigheter.
Alla fem Node-regressioner (20 kontroller), syntax/AST och extra
lagrings-/isoleringsfall passerar. Browserregressionen är utökad men
inte omkörd i denna miljö; historiska version 15-tester är separata belägg.
Detaljer och kvarvarande browserkontroll finns i WORKLOG.

Savera öppnas via `#savera`, Insikter via `#insikter`, fastighetspartnerns
resultat via `?workspace=estate1#property-results`. Kunddemot finns kvar
via `?demo=inflyttning#demo`. Detta är fortfarande fiktiv, lokal frontenddata.
Efterhandskvittensen ändrar endast dokumentation, inte dist/ eller hostingmanifest.

För över GitHub-main med bibehållen historik och fast-forward enligt RUNBOOK.
Första överföringen är verifierad med gemensam SHA
`c777983132282ffef40c0cdde503b00eb2ab2002`; senare dokumentationscommits kan
följa. Aktuell kvittens står i WORKLOG.md. Automatisk synk, GitHub Actions, grenskydd
eller centralt delad testdata införs inte genom denna källflytt.
