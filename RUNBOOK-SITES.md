# Återkommande utvecklingspass

## Uppdrag och beständig källa

Arbeta enbart med Partnerlabb, Sites `appgprj_6ac600ecf7d48191923687550810c1d4`.
Användaren har aktiverat bygguppdraget i `MISSION.md`, inklusive test och
publicering inom befintlig prototyp. Rutinmässiga reversibla ändringar behöver
ingen ny godkännandefråga. Affärsvillkor och verkliga integrationer är fortsatt
öppna frågor enligt `AGENTS.md`.

Arbetsminnet finns i Git-källan, inte i webbläsarens localStorage. Deployment
innehåller bara `dist/` och `.openai/hosting.json`; en läsning av den publicerade
HTML-sidan räcker inte för att läsa detta uppdrag. Varje färskt pass måste öppna
aktuell Sites-källkod och läsa AGENTS, MISSION, RUNBOOK, BACKLOG och WORKLOG.
Använd aktuell Sites-skill och dess källåtkomst. Förutsätt inte att tidigare
`/workspace/scratch`-skript eller en viss lokal checkout finns i en ny miljö.
Läs instruktionsfiler innan implementation och följ miljöns verktygskontrakt.

## Arbetsgång

1. Läs Site-metadata, lyckad publicering och aktuell fjärrkälla. Skilj sparad
   version från publicerad version. Bevara Site-identitet och åtkomst.
2. Kontrollera kvarvarande egna eller främmande ändringar och pågående arbete.
   Återuppta ett eget dokumenterat utkast eller välj högsta genomförbara
   backloguppgift. Starta inte en konkurrerande implementation av samma uppgift.
3. Arbeta på en avgränsad kandidat. Använd separat arbetsgren/checkout vid
   parallellt arbete. En samordnare integrerar och publicerar.
4. Bekräfta problemet med tillgänglig kod, reproduktion eller faktisk återkoppling.
   Anteckna förutsättningar och begränsningar. Implementera en konkret förbättring.
5. Kör relevanta kontroller för ändrade flöden. Behåll statisk `dist/`-portabilitet,
   lokal lagring/migreringar, partneravgränsning och fristående ekonomiska fixtures.
   Använd syntetiska testuppgifter. Dokumentera faktiskt körda kontroller.
6. Läs aktuell fjärrrevision före integration/push. Om någon annan ändrat basen,
   förena ändringarna och gör om berörda kontroller. Använd aldrig force-push.
7. Använd Sites-källflödet för commit/push och bygg deploymentarkivet från exakt
   samma SHA. För statisk app behövs inget paketbygge. Lagra aldrig credentials
   i filer, loggar, Git, prompt eller arkiv; passera tillåtna tokens genom stdin.
8. Spara exakt pushad revision som Sites-version och publicera med verktyget
   för befintlig publik. Custom-delning ska bevaras. Vid pågående publicering
   eller osäker samtidig ändring: förena arbetet innan ytterligare publicering.
9. Verifiera native deploymentkvittens. Följ endast icke-terminal deployment.
   Succeeded med URL är publiceringsbevis; ett lokalt test eller saved-version
   bevisar inte att ändringen är live.
10. Uppdatera backlog och logg med resultat och nästa uppgift. Exakta version/
    deployment/SHA fås efter publicering; registrera dem i en dokumentations-
    revision eller förankra dem vid nästa pass. Hitta inte på förväntade ID:n.

En schemalagd körning väljer en slutförbar uppgift. Om den behöver fler pass,
bevara kandidat och nästa steg utan att lämna halvfärdig kod i publicerad app.
Schemaläggningen garanterar inte processlås mellan olika utvecklingsmiljöer:
aktuella fjärrrevisioner och en ansvarig samordnare ska kontrolleras varje gång.

## När förutsättningar saknas

Om miljön saknar kodexecutor, källåtkomst eller publiceringsverktyg: redovisa det
exakta hindret. Kalla inte research för implementation eller ett begärt run för
en utförd körning. Gör tillåten oberoende analys och spara den när det är möjligt.
Vid osäkert sparresultat, läs tillbaka innan nytt försök så inget dupliceras.
Återförsök bara ett verifierat tillfälligt fel och skapa inga återförsöksloopar.

Körningen ändrar inte sitt eget eller andras schema, prompt eller aktivering.
Schemat styr när pass startas, inte oavbruten exekvering, garanterad återstart
eller garanterad leverans varje timme. Inga nya tjänster eller externa utskick
ingår i detta utvecklingsuppdrag.

## Kort kvittens

Ange uppgift, avgränsad användarnytta, testbelägg, faktisk källrevision och
publiceringsstatus, konkret hinder och nästa steg. Uppdatera bara belagda
resultat. När ingen meningsfull ändring eller ny blockerare finns: undvik
rutinmässiga allt-ser-bra-ut-meddelanden och tomma datum-/kodcommits.
