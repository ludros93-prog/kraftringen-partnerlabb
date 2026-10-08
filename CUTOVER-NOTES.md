# GitHubövergång och källöverföring

Aktuell status och faktiskt verifierade resultat står i GITHUB-STATUS.md
och WORKLOG.md. Repo: https://github.com/ludros93-prog/kraftringen-partnerlabb.
Användaren har valt publik GitHub-kod. Sites-projektets befintliga custom-
åtkomst hanteras separat och ska bevaras.

## Övergångens ordning

1. Pausa samma befintliga timuppgift under källbytet, läs färsk Sites-källa
   och ta in eventuella senare ändringar. Skapa ingen andra timagent.
2. För över aktuell källkod och Git-historik till det verifierade GitHub-
   repot. Behåll ursprungscommits; skapa inte en ny orelaterad Git-historik.
3. Verifiera GitHub-huvudgrenens SHA och dokumentera Daniels faktiska
   åtkomst. Om anslutningen inte kan bjuda in honom får ägaren göra det.
   Publik läsning och Sites-visning är inte utvecklaråtkomst.
4. Ändra samma timagents prompt till färsk GitHub-main, egen agent/-gren
   och pull request. Samordnaren integrerar och publicerar. Läs tillbaka
   den sparade prompten och bevara schema och tidszon.
5. Markera GITHUB-STATUS.md active först efter verifierad uppladdning och
   sparad gemensam rutin. Push/verifiera aktiveringsdokumentationen.
6. För GitHub-main till Sites-källan med fast-forward och verifiera samma
   SHA. Behåll publicerad frontendversion när enbart dokument ändrats.
7. Återaktivera samma timagent och läs tillbaka aktivering och schema.
   Dokumentera kvittensen; en aktiverad uppgift bevisar inte utförd körning.

## Schemalagt utvecklingspass

Hämta aktuell main från https://github.com/ludros93-prog/kraftringen-partnerlabb.
Läs AGENTS.md, MISSION.md, RUNBOOK.md, COLLABORATION.md, BACKLOG.md,
GITHUB-STATUS.md och WORKLOG.md samt öppna pull requests. Välj en belagd,
avgränsad förbättring, arbeta på en egen agent/-gren, implementera och testa
relevanta flöden och lämna en pull request till main med användarnytta,
tester och uppdaterat arbetsminne. Ludwig/Codex samordnar integration och
publicering till det befintliga Sites-projektet. Gör ingen direkt push till
main eller Sites och ändra inte schema eller åtkomst. Om GitHub-källåtkomst
eller PR-behörighet saknas, rapportera exakt hinder och bevara tillåtet
arbete; återgå inte till Sites som en separat utvecklingskälla. Skilj
kandidat, öppnad PR och faktisk publicering i rapporteringen.

## Första senare frontendpubliceringen

Följ RUNBOOK.md och aktuell Sites-skill. Hämta aktuell metadata, bevara
projekt-ID och åtkomst, överför verifierad GitHub-main med bibehållen
historik och paketera exakt revision. Kontrollera version och lyckad
deployment. Denna dokumentationsövergång bevisar ingen automatisk synk
eller GitHub-publicering av en frontendändring.

PR-mallen finns i .github/pull_request_template.md. QA-workflow är en
inaktiv mall i templates/github-actions-qa.yml. CI, grenskydd, ny backend,
gemensam testdata, automatisk publicering och externa aviseringar ingår
inte innan de har implementerats och verifierats.
