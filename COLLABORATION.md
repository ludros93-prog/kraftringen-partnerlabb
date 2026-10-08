# Arbeta tillsammans i Partnerlabb

GitHubövergången är förberedd och ännu inte aktiverad. Målet är ett privat
repo på https://github.com/ludros93-prog/kraftringen-partnerlabb. Att repot
finns eller innehåller koden är ännu inte verifierat. GITHUB-STATUS.md visar
aktuell status; tills den är `active` gäller Sites som huvudkälla och
RUNBOOK-SITES.md som arbetsrutin.

Följande arbetssätt gäller efter verifierad aktivering: GitHub blir den
gemensamma källan för kod, instruktioner och arbetsminne. Ludwig använder
ChatGPT/Codex och Daniel använder Claude Code med GitHub-kontot `daniel-smail`.
Verktygen arbetar mot samma repo med varsitt konto och separata arbetsgrenar.
Tillgång till repot och till den publicerade portalen hanteras separat;
Daniels GitHub-inbjudan och behörighet är ännu inte bekräftade.

## En uppgift per arbetsgren

1. Läs AGENTS.md, MISSION.md, RUNBOOK.md, BACKLOG.md och senaste WORKLOG.md.
   Läs öppna pull requests innan du börjar, så att samma uppgift inte byggs
   två gånger.
2. Hämta aktuell `main`. Skapa en egen gren, exempelvis
   `codex/inflytt-nasta-steg`, `claude/partner-resultat` eller
   `agent/inflytt-02`. Parallella uppgifter använder olika grenar/checkouter.
3. Beskriv vilket problem du tar och genomför en avgränsad förbättring.
   Bevara fungerande flöden, lokalt sparad data och de bekräftade affärsfakta
   som finns i AGENTS.md.
4. Kör kontroller som är relevanta för ändringen. Starta appen med
   `python -m http.server 8000 --directory dist` om du vill testa lokalt.
5. Skicka din gren till GitHub och öppna en pull request till `main`.
   Ange användarnytta, berörda flöden, faktiskt körda tester och eventuella
   begränsningar. Ett kodförslag är färdigt när det går att granska och testa.

Om någon annan ändrat samma del hämtar du den nya basen och löser konflikten
i din egen gren. Kör berörda kontroller igen. Skriv inte över någon annans
arbete och använd aldrig force-push till den gemensamma huvudgrenen.

## Integrera och publicera

Ludwig/Codex är inledningsvis samordnare. Samordnaren granskar och testar
förslagen, för in färdiga ändringar i `main` och publicerar den samlade,
verifierade versionen till samma Partnerlabb-länk:

https://kraftringen-partnerlabb.rosen123.chatgpt.site

Sites används som publiceringsmål. Ändringar ska först finnas i GitHubs
`main`; Sites-källan ska inte utvecklas separat. Det finns ingen antagen
automatisk synk. Följ den verifierade källöverföringen i RUNBOOK vid varje
publicering och bevara webbplatsens nuvarande åtkomst.

Återkommande masteragentpass följer också arbetsgren och pull request.
Agenten kan utveckla självständigt, men publicerar inte vid sidan av
samordnaren. Dokumentera uppnått resultat: kandidat, öppnad pull request,
integrerad ändring och lyckad publicering är olika steg.

## Gemensam kod och lokal testdata

Alla arbetar på samma kodbas. Testärenden, demoframsteg och formulärdata
lagras fortfarande i respektive webbläsare; de delas inte genom GitHub.
Lägg inte webbläsarexporter, kunduppgifter, tokens eller personliga
åtkomstuppgifter i repot. En framtida gemensam datalagring är ett separat
utvecklingsbeslut och ingår inte i flytten till GitHub.
