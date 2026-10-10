# Partnerlivs pilotagent

Aktivt uppdrag från Ludwig den 10 oktober 2026: förbered Partnerlabb för en
enkel verklig pilot med ett fastighetsbolag och en ansvarig på Kraftringen.
Nyare styrning samma dag: kom så långt som möjligt utan en faktisk kund och
leverera en mycket snygg, enkel och intuitiv kunddemo. Slutför självständigt
allt oberoende frontend-, test- och demoarbete; avsaknad av pilotkund är
inte ett stoppvillkor för en färdig fungerande demo.
Detta styr prioriteringen före generell funktionsutbyggnad i MISSION.md.
AGENTS.md:s affärs-, data- och samarbetsregler gäller fortfarande.

Senaste förtydligandet ersätter den tidigare hyresgäststyrda demon:
fastighetsbolaget gör allt aktivt arbete i portalen, via Excel-import med
befintliga fullmaktsbilagor eller manuell registrering med bilaga.
Hyresgästen fyller inte i, signerar inte och navigerar inte i portalen.
Godkänt uppdrag/fullmakt och avtalsval måste fortfarande hanteras enligt
verksamhetens process; en filuppladdning bevisar inte deras giltighet.

Den schemalagda uppgiftens avsedda prompt finns i PILOT-AGENT-PROMPT.txt.
WORKLOG.md kvitterar faktisk konfiguration först efter verktygets återläsning.

## Mål och leveransordning

Fastighetsbolaget ska enkelt kunna registrera en eller flera inflyttningar,
bifoga befintliga fullmakter, förmedla komplett underlag och följa
återkopplingen. Hyresgästen har inga aktiva portalsteg. Kraftringens
handläggare ska se vad som behöver göras, vem som ansvarar och vad som
saknas. Börja med ett tydligt sammanhängande flöde.

1. Slutför båda vägarna i en sammanhängande fiktiv generalrepetition:
   fastighetsbolag → manuell registrering eller Excel-granskning →
   fullmaktsbilagor → förmedling → Kraftringen → återkoppling. Gör varje
   nästa handling tydlig med lugn visuell hierarki, lättläst svenska och få konkurrerande val.
   Visuella riktlinjer är våra designval; verkligt användarbeteende är ännu
   inte verifierat. Ta vid befintliga förslag och undvik dubbelarbete.
2. Verifiera mobil, tangentbord, utkast och återfinnande av samma kvitto.
   Generalrepetitionen ska kunna startas om och upprepas med fiktiva data
   utan att ändra labbets ordinarie lokala data, utkast eller bilagor.
   Kontrollera radvalidering, dubbletter, avbruten import, dokumentkoppling
   och misslyckad lagring. En bifogad fil ska gå att återöppna efter omladdning.
   En separat demoyta via `?demo=inflyttning`, egna lagringsnycklar och guidad
   navigation är implementationsval, inte en ny backend eller behörighetsgräns.
3. Förbered delad ärendelagring och verklig behörighetsstyrning som ett
   konkret beslutsunderlag. Implementera dem först när godkänd driftmiljö,
   nödvändiga verksamhetsregler och separat mandat har lämnats.
4. Förbered kommersiell uppföljning från kontrollerade underlag för alla tre
   partnerkanalerna. Börja med en liten importmall och fiktiv provdata;
   faktisk data och kickbackregler måste godkännas och lämnas av Kraftringen.
5. Anpassa verklig pilotdrift efter verksamhetsbeslut och användaråterkoppling.

En demo är färdig när dess fiktiva huvudflöde, avbrott och återställning kan
genomföras och verifieras. Faktiska kunder behövs för verkliga användarutfall
och förankrade produktionskrav; de behövs inte för att slutföra den demon.

Academy-utbyggnad, avancerad offertmotor, ny säljapp, automatiska betalningar
och komplett drift för alla kanaler prioriteras senare. Bevara fungerande
funktioner. Färre steg och tydligt ansvar väger tyngre än fler menyer.

## Återkommande arbetspass

- Hämta färsk GitHub-main, läs instruktioner, PILOT-FACTS, PILOT-DECISIONS,
  PILOT-ACCEPTANCE, BACKLOG och senaste WORKLOG. Kontrollera öppna PR:er,
  uppgiftsrapporter och parallellt arbete innan en uppgift väljs.
- Fortsätt en befintlig egen uppgift när det är möjligt. Välj annars högsta
  genomförbara pilotuppgift och dokumentera problem och avgränsning.
- Arbeta i egen agent/-gren eller isolerad worktree. Återanvänd en egen gren
  för fortsättningsarbete, bevara andras commits och hämta nya basändringar.
- Implementera endast en motiverad avgränsad ändring och kör relevanta
  kontroller. Dokumentera vad som testats och vad som återstår att verifiera.
- Spara checkpoint, belägg och nästa steg i arbetsgrenen samt lämna ett
  konkret PR-underlag. Ingen direkt main-push, merge eller Sites-publicering
  från ett schemalagt pass. Ludwig/Codex samordnar integrationen.
- Högst två färdiga pilotförslag får samtidigt vänta på granskning. Räkna
  befintliga öppna, färdiga PR:er före ny leverans. PR #1 är redan merged
  via PR #4; räkna inte historiska PR:er som öppna. När två väntar,
  förbättra verifiering och befintliga beslutsunderlag. Öppna inte fler färdiga förslag eller parallella kopior.

Gränsen på två är en arbetsregel, inte ett tekniskt processlås. Kontrollera
aktuellt arbete igen före push. Vid överlapp, återuppta eller samordna den
befintliga uppgiften. Gör inga tomma datumcommits eller rutinmässiga
ombyggnader när inget nytt välgrundat arbete finns.

Schemat ger återkommande arbetspass dag och natt. Det innebär inte oavbruten
exekvering, garanterad återstart, en hård kostnadsgräns eller leverans varje
timme. Ändra inte agentens schema, prompt eller aktivering under ett pass.

## Fakta och saknat underlag

PILOT-FACTS skiljer bekräftat underlag, förslag och sådant som saknas, med
källa och observationsdatum. En testad kodlösning är inte belägg för verkligt
användarbehov, godkända fält eller produktionsberedskap.

Pilotpartner, handläggare, godkänd fullmakt, nödvändiga uppgifter, driftmiljö
och ersättningsregler saknas fortfarande. Håll en kort konkret beslutskö i
PILOT-DECISIONS. Förbered granskningsbara underlag före frågor och fortsätt
med oberoende tillåtet arbete. Fråga inte samma sak på nytt utan ny information.
Parkera bara den uppgift som faktiskt beror på ett saknat beslut. Slutför
övrig demo, tester och visuell kvalitet utan att invänta en verklig kund.

Partnerns registrering och förmedling av underlaget är nu uttryckligen
bekräftad. Direktlänk eller QR för hyresgästens registrering ingår inte i
det beslutade flödet och ska inte återinföras som förbättringsmål.
Excelkolumner, filgränser och valideringsregler i demon är tekniska
demoförslag tills godkänt verksamhetsunderlag har lämnats.

## Mandat och datagränser

Nuvarande produkt är en statisk frontendprototyp med lokal webbläsardata.
Befintliga fullmakter kan bifogas som fiktiva binära testfiler i IndexedDB,
med skilda demo-/normalscope. Det är ingen gemensam dokumentlagring och
JSON-exporten innehåller inte filernas innehåll. En filbilaga innebär inte
att fullmakten eller samtycket har juridiskt verifierats.
Agenten får förbättra den, skapa fiktiva testfall och förbereda specifikation,
datamodell och godkännandekriterier för nästa etapp. Nya backendtjänster,
verkliga integrationer, riktiga kunduppgifter, bindande avtal och betalningar
kräver separat underlag och mandat. Ett allmänt pilotmål ersätter inte detta.

Publikt GitHub ska bara innehålla fiktiva kundärenden och .example-kontakter.
Lagra inte verkliga kundexporter eller hemligheter där. Bevara den befintliga
privata Sites-delningen och projektet. Demovyväljaren är inget åtkomstskydd.

Serviceanmälan, förmedling, slutförd inflyttningshjälp och nytt elhandelsavtal
är skilda händelser. Inget serviceärende skapar automatiskt avtal, intäkt
eller kickback. Använd Kraftringens godkända fullmakts-/signeringsprocess när
den finns. Hitta inte på regler, priser, beräkningssatser eller behörigheter.

Daniels arbete behöver Ludwigs faktiska godkännande av konkret PR och aktuell
HEAD-SHA före GitHub-APPROVE, merge eller publicering. Nya commits behöver
förnyat godkännande. Kravet följer ändringen mellan grenar; teknisk användning
av Ludwigs konto är inget samtycke. Oberoende, redan auktoriserat agentarbete
behåller sitt mandat. Tekniskt grenskydd är fortfarande inte verifierat.

## Rapportering

Rapportera kort i uppgiftens befintliga arbetsyta:

- Gjort och testat: konkret resultat, relevant testbelägg och gren/PR-länk.
- Behöver beslut: endast nya eller ändrade frågor med färdigt underlag.
- Nästa steg: högsta genomförbara uppgift och vad den ska visa.

Skilj förslag, färdig PR, integration och lyckad publicering. Sammanfatta
senaste dygnets väsentliga resultat vid första passet efter kl. 08 svensk
tid och använd tidigare uppgiftsrapporter för att undvika dubbla dagsrapporter.
Detta är beteende för samma timuppgift, ingen separat garanterad morgonkörning.
Om tidigare rapportstatus inte går att läsa, ange osäkerheten och undvik att
påstå att en exakt rapporttid eller deduplicering har verifierats.
Skicka inga externa utskick utan ett uttryckligt uppdrag.
