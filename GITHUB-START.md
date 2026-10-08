# Klar för privat GitHub-uppladdning

Detta paket är förberett från Partnerlabbs aktuella Sites-källa. Det är ännu
inte uppladdat till GitHub. GitHub-anslutningen för `ludros93-prog` nekade
skapandet av ett nytt repo med `Resource not accessible by integration`.

Skapa ett tomt **privat** repo med namnet `kraftringen-partnerlabb` på
https://github.com/new och skicka dess länk till den ansvariga Codex-chatten.
Välj inga extra startfiler om hela historiken ska importeras direkt.

Daniel har angett det verifierade GitHub-kontot `daniel-smail`. Inbjudan till
redigeringsåtkomst ska göras först när rätt privat repo finns och har verifierats.
Ingen GitHub-inbjudan är skickad än. Hans Sites-visningsåtkomst är separat.

## Vad som är klart

- Körbar frontend under dist/, lokala verifieringsskript under qa/ och
  gemensamt arbetsminne.
- CLAUDE.md som läser de gemensamma instruktionerna.
- Förberett arbetsflöde för egna grenar och pull requests, med en publicerare.
- Bevarad Git-historik så att framtida GitHub-versioner kan föras tillbaka
  till det befintliga Sites-projektet utan force-push.

## Kontrollera före uppladdning

Läs GITHUB-STATUS.md och CUTOVER-NOTES.md. Om Sites har fått senare ändringar,
importera dem innan övergången så att ett äldre paket inte blir huvudversion.
Verifiera att målrepot är privat och att rätt GitHub-anslutningar har åtkomst.
Först därefter aktiveras GitHub som huvudkälla och samma timagent får den nya
grenen/PR-rutinen. Skapa ingen andra konkurrerande timagent.

Den publicerade webbplatsen är fortsatt
https://kraftringen-partnerlabb.rosen123.chatgpt.site.

## Bevara historiken vid överföring

ZIP-paketet innehåller partnerlabb-history.bundle med Git-historiken. En
utvecklingsagent kan läsa det i en färsk katalog med git clone och sedan
koppla den verifierade privata GitHub-adressen som remote. Initiera inte ett
nytt orelaterat Git-projekt från enbart dist-filerna och använd inte force-push.
Skicka inte Sites- eller GitHub-tokens till Daniel eller lägg dem i repo eller
chattprompt. Varje verktyg använder sin egen godkända GitHub-anslutning.
