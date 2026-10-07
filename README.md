# Kraftringen Partnerportal – frontendprototyp

En klickbar partnerarbetsplats utifrån referensbildernas marinblå och petrolfärgade uttryck. Ludwig och Håkan har valt **aktiv säljpartner** som arbetar vidare med affären. Företag och BRF inom elhandel är fokus; privatkunder, fiber och andra produktområden i bilderna ingår inte.

Denna etapp omfattar hela arbetsplatsens frontend. Flöden, pipelinesteg, utbildningar och partnerresan är förslag att testa. Backend och integrationer ingår inte nu; ingen byggplattform är vald.

## Starta

Kör från projektroten:

```sh
python -m http.server 8000 --directory dist
```

Öppna <http://localhost:8000>. Appen består av vanlig HTML, CSS och JavaScript i `dist/`; inga paket eller byggsteg krävs.

## Arbetsplatsens vyer

| Vy | Det går att testa |
| --- | --- |
| Översikt & pipeline | Nyckeltal från exempeldata, nästa steg, aktivitetshistorik och affärer per föreslaget steg. |
| Kunder | Registrera företag eller BRF, söka och filtrera, dokumentera kontakt och nästa steg. Internt team tilldelar demoansvarig, ändrar status eller pipelinesteg och delar återkoppling. |
| Offerter & avtal | Offertstudion har fyra steg: **Välj område → Beskriv behov → Välj kund → Granska & spara**. Sparade behovsunderlag kan öppnas igen, hämtas som TXT och markeras som skickade i en simulering. |
| Avtal & dokument | Prova lokala demosteg för fullmakt, avtal och signering samt öppna dokumentbiblioteket. |
| Kundsidor | Skapa och redigera kundsidans rubrik, introduktion, bild och kontaktknapp. Förhandsgranska och prova kontaktformuläret. |
| Partner Academy | Fyra demokurser med tre textmoment vardera, kategorifilter, bokmärken, klarmarkering och lokala framsteg per exempelpartner. En anmälan till en exempelgenomgång kan markeras i demo. |
| Material & kampanjer | Filtrera, förhandsvisa och hämta fyra TXT-mallar samt läsa en exempelbrief för kampanjplanering. |
| Provision | Visar öppna beslut och saknat underlag. **Ingen ersättning beräknas.** |
| Rapporter | Antal kunder och affärer per partner eller steg, aktivitetslogg och JSON-export av kunddata, offertutkast och kundsidor för vald demovy. |
| Partnerresan | Åtta föreslagna steg: Rekrytera, Onboarda, Certifiera, Aktivera, Sälja, Leverera, Utveckla och Behålla. Testaktiviteter kan markeras lokalt. |
| Hjälp & support / Test & beslut | FAQ, lokala testförfrågningar, öppna beslut, dataexport och återställning av exempeldata. |

Två demovyer, **Partner** och **Internt team**, visar olika perspektiv. Exempelpartner Syd och Väst har separata listor i partnervyn. Interna testanteckningar döljs där. Varningen för identiska kundnamn är en testhjälp; regler för dubbla registreringar är inte beslutade.

## Testa ett sammanhängande flöde

1. Välj **Partner / Exempelpartner Syd** och registrera en fiktiv kunddialog i **Kunder**.
2. Byt till **Internt team**, tilldela **Demoansvarig A**, dela återkoppling och skriv en intern testanteckning.
3. Byt tillbaka till partnern, läs återkopplingen och dokumentera kontakt och nästa steg. Kontrollera att den interna anteckningen inte visas.
4. Öppna **Offerter & avtal**, gå igenom de fyra stegen och spara ett behovsunderlag för kunden. Hämta TXT-underlaget och prova simulerat utskick samt fullmakts-, avtals- och signeringsstegen.
5. Skapa och förhandsgranska en **Kundsida**, klarmarkera ett Academy-moment och en aktivitet i **Partnerresan**. Granska **Rapporter** och ladda om för att kontrollera sparade ändringar.

## Lokal data och demosteg

Använd enbart påhittade uppgifter. Sparad testdata ligger i `localStorage` för aktuell webbplats och webbläsare under `partnerlabb.portal.v2`. Om giltig v2-data saknas läses tidigare kunddata från `partnerlabb.active.v1` på samma webbplats; kunder utan pipelinesteg får **Kunddialog**. Den gamla v1-posten raderas inte. Återställning återgår till den nya versionens sju exempelkunder och tar bort lokala teständringar.

Två datorer delar inte data och öppna flikar synkas inte automatiskt. JSON-exporten är ett granskningsunderlag, ingen synkronisering eller fullständig säkerhetskopia av utbildningar, partnerresan och supportförfrågningar.

Utskick, signering, kundsidepublicering, mötesbokning och supportkontakt är simuleringar. TXT-filer är demounderlag, inga kommersiella offerter, juridiska fullmakter eller avtal. Academy ger inga verkliga certifikat. Pris, produktvillkor, partnerns mandat och eventuell ersättning kräver underlag från Ludwig och Håkan.

Demovyerna styr visningen utan inloggning eller åtkomstskydd; även interna anteckningar finns i webbläsaren. Inga riktiga kunduppgifter eller anslutningar till Dynamics, Oneflow eller B2B Veckokollen används.

## Filer

- `dist/app.js`: gemensam navigation, lokal data, kunder, pipeline, översikt och rapporter.
- `dist/studio.js`: offertstudio och simulerade dokumentsteg.
- `dist/academy.js`: demokurser och utbildningsframsteg.
- `dist/partner.js`: kundsidor, material, partnerresan och support.
- [ASSETS.md](ASSETS.md): bildkällor. Bilderna är illustrationer, inte antagna godkända Kraftringen-bilder.

## Förslag för att bygga tillsammans

Förslag: **ett gemensamt Replit Core-projekt**, varsin inloggning, redigeringsåtkomst och Teams för samtalet. Börja med en AI-ändring åt gången. Core dokumenterar en aktiv bakgrundsuppgift per projekt; Pro upp till tio parallella Agent-uppgifter. Samma filer kan ändå ge konflikter. Konton och abonnemang har inte testats här.

Lovable dokumenterar separata utkast som accepteras ett i taget. ChatGPT Sites dokumenterar redigeringsbehörighet inom samma workspace; samtidig AI-redigering är inte verifierad. Senare kan GitHub och Codex med separata grenar eller worktrees användas. Att dela den färdiga portalen är ett annat samarbete än att redigera byggprojektet.

Officiella källor kontrollerade 7 oktober 2026:

- [Replit: Invite teammates](https://docs.replit.com/build/invite-teammates)
- [Lovable: Collaboration](https://docs.lovable.dev/features/collaboration) och [Drafts](https://docs.lovable.dev/features/drafts)
- [ChatGPT Sites: Creating and using Sites](https://help.openai.com/en/articles/20001339-creating-and-using-chatgpt-sites)
- [Codex: Git worktrees](https://learn.chatgpt.com/docs/environments/git-worktrees) och [Cloud](https://learn.chatgpt.com/docs/cloud)
