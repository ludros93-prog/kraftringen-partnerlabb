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
  **Partnerlivs pilotagent**. Den 10 oktober 2026 kl. 21:21 UTC bekräftade
  privat återläsning enabled=true och exakt prompt enligt
  PILOT-AGENT-PROMPT.txt, med oförändrat timschema och Europe/Stockholm.
  Uppdraget omfattar nu generiska säljpartners under Partners, valbara
  B2B/B2C/båda, gemensamma Kunder & avtal och Insikter samt fem B2C-produkter.
  Kunder/kickback och stabil Excel-/manuell inflyttning består.
  Fastighetsbolaget gör allt aktivt portalarbete; hyresgästen har inga
  portalsteg. Egen agent/-gren + PR och Daniels godkännandekrav består.
  Ingen extra automation skapades. Senaste registrerade körning är
  21:08:14 UTC; next_run_time saknar värde. Detta verifierar konfiguration
  och aktivering, inte att den nya prompten redan har körts.

## Publicerad portal och källöverföring

Sites är publiceringsmål för det befintliga projektet
`appgprj_6ac600ecf7d48191923687550810c1d4`. Portalen har fortfarande custom-
åtkomst enligt samma delningspolicy. GitHub-repots publika kod ändrar inte
Sites-inloggningen.

Senast verifierade lyckade publicering är version 17 med SHA
`3ca57eb96816a5eae16f4dd9d96e8f7289361807` på
https://kraftringen-partnerlabb.rosen123.chatgpt.site.
PR #13 samlar säljpartners under Partners med valbara kundsegment,
gemensam avtalsöversikt/Insikter och fem konsumentprodukter. Den parallellt
sammanslagna PR #12 om fastighetspartnerns rapportperiod bevarades.
GitHub-main överfördes fast-forward till Sites utan force-push.

Native deployment `appgdep_6acaac334bcc8191aab0aadc92004c4f` bekräftade
`succeeded` den 10 oktober 2026 kl. 21:21:08 UTC. Version-ID:
`appgprj_6ac600ecf7d48191923687550810c1d4~appgver_cd98ef6a3bd481918dd7ea256e03d789`.
Färsk metadata bekräftade version 17 och oförändrad custom-delning,
policyrevision 4. Paketet är byggt från och pushat med samma SHA.

Verifiering: 105 generiska browserkontroller, 23 data- och åtta
registerkontroller; inflyttningskedjans 62 service- och fem
integritetskontroller samt riktade befintliga regressioner passerade.
Efter merge av PR #12 passerade fastighetsperiodens Node-kontroll och
20 browserkontroller. Mobil 320/390 och desktop, perpartnerfilter,
blandade segment, datum, sparfel, migration och reset är kontrollerade.

Öppna Partners och välj Savera eller Face2face. Direktlänkar:
`?partner=syd#partner-sales`, `?partner=vast#partner-insights`.
Äldre `#savera` och `#insikter` öppnar samma Savera-underflöden.
Fastighetspartnerns resultat finns via `?workspace=estate1#property-results`
och kunddemot via `?demo=inflyttning#demo`. All data är fiktiv och lokal.
Efterhandskvittensen ändrar endast dokumentation, inte dist/ eller manifest.

För över GitHub-main med bibehållen historik och fast-forward enligt RUNBOOK.
Första överföringen är verifierad med gemensam SHA
`c777983132282ffef40c0cdde503b00eb2ab2002`; senare dokumentationscommits kan
följa. Aktuell kvittens står i WORKLOG.md. Automatisk synk, GitHub Actions, grenskydd
eller centralt delad testdata införs inte genom denna källflytt.
