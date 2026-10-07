# Partnerlabb – B2B-prototyp

Ludwig och Håkan har valt **aktiv säljpartner**: partnern arbetar vidare med affären. Registrering, ansvarstilldelning, informationsdelning och statusar i denna version är förslag att testa, inte beslutade affärsprocesser. Ingen byggplattform är vald.

## Starta

Kör från projektroten:

```sh
python -m http.server 8000 --directory dist
```

Öppna <http://localhost:8000>. Appen består av vanlig HTML, CSS och JavaScript i `dist/`; inga paket eller byggsteg krävs.

## Vad som fungerar

- Två demovyer: **Partner** och **Internt team**, med två fiktiva exempelpartners.
- Registrera företag eller BRF, kundens frågeställning och nästa steg; valfria kontaktuppgifter och datum använder exempeldata.
- Partnern dokumenterar senaste kontakt eller aktivitet och uppdaterar nästa steg.
- Det interna teamet tilldelar en demoansvarig, ändrar föreslagen status och delar återkoppling. Interna testanteckningar visas bara i den interna demovyn.
- Sökning, statusfilter, aktivitetsöversikt, exempelunderlag, JSON-export för vald demovy och återställning av de fyra ursprungliga exempelaffärerna.

En varning för identiskt företagsnamn är en hjälp i testet. Den avgör inte hur dubbla registreringar ska hanteras.

## Testa första flödet

1. Välj **Partner / Exempelpartner Syd** och registrera en påhittad affär.
2. Byt till **Internt team**, välj affären, tilldela **Demoansvarig A** och dela återkoppling. Lägg också till en intern testanteckning.
3. Byt tillbaka till samma partner. Kontrollera återkopplingen, dokumentera en ny kontakt och uppdatera nästa steg.
4. Kontrollera att den interna anteckningen inte visas i partnervyn och att partnerns aktivitet visas internt. Byt exempelpartner för att granska den andra demovyn.

## Begränsningar

Använd enbart påhittade uppgifter. Data sparas i `localStorage` för aktuell webbplats och webbläsare. **Två datorer delar inte affärsdata**, och öppna flikar synkas inte automatiskt. Exporten är ingen synkronisering; återställning tar bort lokala teständringar.

**Demovyerna är ingen säkerhet eller inloggning.** All data, även interna anteckningar, finns i webbläsaren och kan läsas där. En skarp portal behöver identifierade användare, delad databas och behörighetskontroller på servern.

Inga integrationer med Dynamics, Oneflow eller B2B Veckokollen ingår. Produktvillkor, priser, offertbefogenhet, leadägande, exklusivitet och eventuell ersättning är inte införda. Partnerns uppdrag, tillåtna uppgifter och insyn samt internt mottagaransvar behöver beslutas.

## Förslag för att bygga tillsammans

Starta med **ett gemensamt Replit Core-projekt**, varsin inloggning och redigeringsåtkomst. Använd Teams för samtalet, låt en AI-ändring åt gången bli klar och testa resultatet tillsammans. Att dela den färdiga portalen ger inte automatiskt åtkomst till byggprojektet.

Replit dokumenterar samarbete i samma projekt. Core har en aktiv bakgrundsuppgift per projekt; Pro dokumenterar upp till tio parallella Agent-uppgifter. Det innebär inte att två AI-uppgifter kan ändra samma filer utan konflikter. Konton, abonnemang och det praktiska samarbetet har inte testats här.

Lovable dokumenterar separata utkast som accepteras ett i taget. ChatGPT Sites dokumenterar redigeringsbehörighet inom samma workspace, men samtidig AI-redigering är inte verifierad. När projektet läggs i GitHub kan Codex arbeta på en separat gren eller worktree och ändringarna granskas innan de förs ihop.

Officiella källor kontrollerade 7 oktober 2026:

- [Replit: Invite teammates](https://docs.replit.com/build/invite-teammates)
- [Lovable: Collaboration](https://docs.lovable.dev/features/collaboration) och [Drafts](https://docs.lovable.dev/features/drafts)
- [ChatGPT Sites: Creating and using Sites](https://help.openai.com/en/articles/20001339-creating-and-using-chatgpt-sites)
- [Codex: Git worktrees](https://learn.chatgpt.com/docs/environments/git-worktrees) och [Cloud](https://learn.chatgpt.com/docs/cloud)
