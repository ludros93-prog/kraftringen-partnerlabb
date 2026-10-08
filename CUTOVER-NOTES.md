# Överlämning till ansvarig migreringsagent

Detta är arbetsanteckningar, inte en påstådd genomförd migrering. Kandidaterna
i samma scratch-katalog har inte skrivits till projektet eller GitHub.

## Säker övergång

1. Läs färsk Sites-källa och metadata. Notera källans HEAD och den faktiskt
   publicerade SHA:n; arbetsloggens senare dokumentationscommit kan göra dem
   olika utan att `dist/` har ändrats.
2. Repo kunde inte skapas av integrationen; användaren har ombetts skapa ett
   tomt privat repo. Behåll nuvarande Sites-huvudkälla och befintlig timagent
   tills en verklig destination och uppladdning verifierats. Kontrollera
   pågående ändringar igen vid faktisk övergång. Skapa ingen dubbel timagent.
3. Importera den aktuella Sites-Git-historiken till ett privat GitHub-repo.
   Behåll ursprungscommits så GitHub-main kan överföras tillbaka till Sites
   med fast-forward. Undvik export + ny `git init`, som skapar separata
   historiker och frestar till force-push vid första publiceringen.
4. Lägg kandidatdokumenten på den importerade huvudkällan. AGENTS, MISSION och
   README har riktade patchar för lätt granskning; RUNBOOK ersätter den gamla
   direkta publiceringsrutinen. Applicera inte hela kandidater blint om den
   färska källan har andra nytillkomna ändringar.
5. Planerad destination är https://github.com/ludros93-prog/kraftringen-partnerlabb,
   utan bekräftad existens/uppladdning. Daniel har bekräftat kontot
   `daniel-smail`; någon inbjudan/behörighet är ännu inte bekräftad. Markera
   GITHUB-STATUS.md `active` först efter verifierad privat uppladdning och
   uppdaterad timuppgift. Sites-visningsåtkomst är inte GitHub-åtkomst.
6. Uppdatera samma timagents prompt till GitHub + egen gren + PR. Kontrollera
   att den äldre direkta Sites-byggvägen inte längre står i det sparade
   uppdraget. Återaktivera bara när huvudkälla och instruktioner är klara;
   verifiera den sparade uppgiften och redovisa dess faktiska aktivering.
7. Behåll den publicerade portalen på nuvarande version under migreringen.
   Dokumentationsövergången behöver ingen frontendpublicering. Kontrollera
   huvudkällornas SHA:n och Git-historik; provad automatisk synk ska inte
   påstås förrän ett sådant flöde faktiskt har körts.

## Kort schemaprompt, fyll i verklig repo-adress

Hämta aktuell main från det privata Partnerlabb-repot på <VERKLIG GITHUB-URL>.
Läs AGENTS.md, MISSION.md, RUNBOOK.md, COLLABORATION.md, BACKLOG.md och
WORKLOG.md samt öppna pull requests. Välj en belagd, avgränsad förbättring,
arbeta på en egen agent/-gren, implementera och testa relevanta flöden och
lämna en pull request till main med användarnytta, tester och uppdaterat
arbetsminne. Ludwig/Codex samordnar integration och publicering till befintliga
Sites-projektet. Gör ingen direkt push till main eller Sites och ändra inte
schema eller åtkomst. Om GitHub-källåtkomst eller PR-behörighet saknas,
rapportera exakt hinder och bevara tillåtet arbete; återgå inte till Sites
som en separat utvecklingskälla. Skilj kandidat, öppnad PR och faktisk
publicering i rapporteringen.

## Vad kandidaten inte inför

Ingen ny backend, gemensam testdata, GitHub Actions, grenskydd, automatisk
publicering eller externa aviseringar. Sådana funktioner kräver en verklig
implementation och verifiering innan de kan beskrivas som införda.

PR-mallen kan laddas upp som `.github/pull_request_template.md`. QA-workflow
är en inaktiv mall i `templates/github-actions-qa.yml`; grunduppladdningen
kräver ingen workflow-fil eller särskild workflow-behörighet. Aktivering
senare sker efter verifierad Actionsåtkomst genom att lägga mallen i
`.github/workflows/quality.yml`. Mallen använder bara `contents: read`, lokala
fiktiva testdata och befintliga Playwright-kontroller, utan deployment/secrets.
