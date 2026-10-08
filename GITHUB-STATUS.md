# GitHubövergångens status

- Status: `prepared` — förberedd, inte aktiverad.
- Destination: https://github.com/ludros93-prog/kraftringen-partnerlabb
- Repot finns och är publikt. Användaren valde uttryckligen att behålla
  det publikt den 8 oktober 2026. Uppladdning är ännu inte verifierad.
- Daniel: GitHub-kontot `daniel-smail` är bekräftat. Ingen inbjudan eller
  tilldelad GitHub-behörighet är bekräftad här. GitHub nekade anslutningens
  försök att bjuda in honom med HTTP 403; ägaren behöver ordna åtkomsten.
- Aktiv huvudkälla: det befintliga Sites-projektets Git-källa.
- Aktiv arbetsrutin: RUNBOOK-SITES.md, med befintliga Sites-timuppgiften.

Kandidater för gemensam GitHub-utveckling är förberedda. De gör inte GitHub
till huvudkälla förrän övergången är verifierad och status ändras till
`active` av ansvarig samordnare.

## Aktivera först efter verifierad övergång

Samordnaren ska kontrollera att:

1. Det angivna publika repot finns och samordnaren har källåtkomst.
   Daniels utvecklaråtkomst dokumenteras separat och får inte antas.
2. Aktuell Sites-historik, källkod och arbetsminne har laddats upp med bevarade
   commits. GitHub-huvudgrenen har rätt SHA och inga credentials ingår.
3. CLAUDE/AGENTS/RUNBOOK är samstämmiga med GitHub som huvudkälla och gren + PR.
4. Samma befintliga timagent har ändrats till GitHub-källa och gren + PR.
   Sparad prompt och aktivering är verifierade; ingen dubbel timagent finns.

Ändra sedan status till `active`, ange faktisk repo-URL, åtkomst, bas-SHA och
datum och uppdatera WORKLOG. Källöverföring tillbaka till Sites och GitHub
Actions-resultat ska fortsatt redovisas som verifierade först när de har
körts. Den publicerade portalen ska behålla samma projekt, URL och åtkomst.
