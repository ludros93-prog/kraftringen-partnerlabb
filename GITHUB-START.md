# GitHub för Codex och Claude Code

Destination: https://github.com/ludros93-prog/kraftringen-partnerlabb

Användaren skapade repot och valde uttryckligen att låta det vara publikt
den 8 oktober 2026. Källkod och hela Git-historiken är uppladdade. GITHUB-STATUS.md
beskriver det aktiva arbetssättet och verifierade övergångsfakta.

GitHub nekade anslutningen att bjuda in `daniel-smail` med HTTP 403.
Repoägaren behöver ge Daniel utvecklaråtkomst under Settings → Collaborators.
Publik läsning innebär inte att Daniel får skicka grenar till repot.
Hans Sites-visningsåtkomst är separat.

## Börja utveckla

Klona den gemensamma källan:

```sh
git clone https://github.com/ludros93-prog/kraftringen-partnerlabb.git
cd kraftringen-partnerlabb
```

Daniel startar Claude Code i katalogen. CLAUDE.md läser samma instruktioner
som Codex: AGENTS.md, MISSION.md, RUNBOOK.md, COLLABORATION.md och arbetsminnet.
Använd varsitt GitHub-konto och godkänd verktygsanslutning.

Arbeta i egna `claude/`, `codex/` eller `agent/`-grenar och lämna en pull
request till `main`. Ludwig/Codex samordnar integration och publicering.
Se COLLABORATION.md och RUNBOOK.md för hela arbetsgången.

Appen kan köras lokalt utan paketinstallation eller byggsteg:

```sh
python -m http.server 8000 --directory dist
```

Öppna http://localhost:8000. qa/ innehåller återkörbara kontroller som
kräver Python Playwright och Chromium enbart för verifieringen.

## Kod, testdata och publicering

Git-historiken bevaras, så koden kan föras till samma Sites-projekt med
fast-forward. Ingen automatisk publicering, CI eller gemensam databas
antas. GitHub Actions-mallen i templates/ är ännu inaktiv.

Testärenden lagras i varje webbläsare. GitHub delar koden, inte lokala
testärenden. Lägg aldrig tokens, webbläsarexporter eller riktiga
kunduppgifter i repot och dela inte verktygens credentials med varandra.

Den publicerade testportalen finns fortsatt på
https://kraftringen-partnerlabb.rosen123.chatgpt.site.
