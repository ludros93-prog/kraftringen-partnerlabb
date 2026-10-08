# Daniel utvecklar, Ludwig godkänner

Användarens beslut: Daniel får utveckla Partnerlabb, men Ludwig måste godkänna
hans konkreta ändringar före integration till main och publicering på Sites.
Arbetsgren och pull request är förslag; de gör ingen ändring live.

## Faktiskt sparat och återstående inställningar

- Gemensamma instruktioner och PR-mall kräver uttryckligt godkännande av PR
  och aktuell HEAD-SHA. Nya kodcommits kräver förnyat godkännande.
- .github/CODEOWNERS anger @ludros93-prog som kodägare för alla filer, inklusive
  granskning av ändringar i .github/.
- Daniel har senast verifierad read-behörighet. Inbjudan med skrivåtkomst
  nekades med HTTP403. Ingen skickad eller accepterad inbjudan påstås.
- GitHub-anslutningen nekades att läsa och ändra branch protection med HTTP403.
  Tekniskt skydd är inte verifierat. Instruktioner och CODEOWNERS ensamma
  stoppar inte GitHub-pushar; ägaren behöver aktivera granskningsregeln.
- Sites-projektets custom-åtkomst och publicerad frontend ändras inte.

## Ge Daniel utvecklaråtkomst

Repoägaren öppnar:
https://github.com/ludros93-prog/kraftringen-partnerlabb/settings/access

Välj Add people, sök daniel-smail och skicka en inbjudan till skrivåtkomst.
Daniel behöver acceptera inbjudan. Skrivåtkomst ger utveckling i arbetsgrenar
och PR; godkännandekravet för huvudgrenen hanteras separat nedan.

## Kräv Ludwigs granskning i GitHub

Öppna repots Settings → Branches:
https://github.com/ludros93-prog/kraftringen-partnerlabb/settings/branches

Skapa en branch protection-regel för main, eller uppdatera den befintliga
utan att ta bort andra skydd. Om GitHub visar regler under Rules gäller samma
granskningskrav för main. Slå på:

1. Require a pull request before merging.
2. Require approvals: minst 1, bevara ett högre befintligt krav.
3. Require review from Code Owners.
4. Dismiss stale pull request approvals when new commits are pushed.

Tillåt inte force push eller radering av main. Bevara övriga befintliga
kontroller. Inställningen Require approval of the most recent reviewable
push behövs inte här: återkallade gamla godkännanden och kodägarens granskning
kräver en aktuell granskning utan att Ludwigs egna korrigeringar kräver en
andra kodägare.

Behåll ägarens möjlighet att integrera egna behöriga ändringar. Agentens PR
kan vara skapad med Ludwigs konto och GitHub tillåter inte granskning av egen
PR. För Daniels arbete får varken agenten eller samordnaren använda ägarens
rättigheter för att ersätta hans uttryckliga godkännande. Kontrollera aktuellt
godkännande även vid vidarebearbetning på en annan gren.

Efter sparandet ska Daniels behörighet och granskningsregeln läsas tillbaka
innan de beskrivs som aktiverade. En inbjudan som väntar på svar är ett eget steg.

## Underlag

- CODEOWNERS: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners
- Skyddade grenar: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches
- GitHub-granskning: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/approving-a-pull-request-with-required-reviews
