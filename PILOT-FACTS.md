# Pilotens fakta och belägg

Första inventering: 10 oktober 2026. Datum nedan avser dokumentation eller
observation; användarens tidigare verksamhetsbeskrivning finns i denna
konversation och AGENTS.md. Uppdatera endast när nytt belägg finns.

| Typ | Underlag | Källa / observation | Betydelse för arbetet |
| --- | --- | --- | --- |
| Bekräftat | Agenten ska hjälpa till att göra Partnerlabb enkelt och användbart, med återkommande arbete. | Ludwigs instruktion ”Skapa agenten”, 2026-10-10. | Pilotprioritering; återanvänd samma befintliga timuppgift. |
| Bekräftat, mål | Kom så långt som möjligt utan en faktisk kund; gör en mycket snygg, enkel och intuitiv kunddemo. | Ludwigs nya styrning ”kom så långt du kan utan en faktisk kund”, 2026-10-10. | Slutför oberoende frontend-, test- och demoarbete självständigt. Saknad pilotkund stoppar inte en fungerande fiktiv demo. |
| Bekräftat | Partnern erbjuder frivillig inflyttningsservice vid hyresavtal. Hyresgästen lämnar underlag/fullmakt; partnern förmedlar; Kraftringen hanterar och återkopplar. | Användarens verksamhetsbeskrivning; AGENTS.md, avläst 2026-10-10. | Överlämning och ansvar ska vara tydliga; serviceval är inte avtalsval. |
| Bekräftat | Fastighetsbolagets egen elförbrukning är en separat företagsaffär. | Samma verksamhetsbeskrivning. | Blanda inte ihop hyresgästkanal och partnerns egna avtal. |
| Bekräftat | Savera säljer till företag. Utbud: Rörligt pris, Kvartspris, Poolportfölj Trygg, Poolportfölj Offensiv, Individuell portfölj, Kraftringen Stabil. | Användarens uttryckliga produktlista; AGENTS.md. | Följ avtal, avtalad årsvolym i MWh, produkt och säljare per månad/år. Villkor och priser saknas. |
| Bekräftat | Face2face säljer konsumentavtalen Opti och kvartspris och använder Beest. | Användarens bekräftelse; AGENTS.md. | Följ avtal, produkt och geografi internt; ersätt inte Beest med en ny säljapp. |
| Bekräftat | Bortfall före avtalsstart och churn efter start ska visas som separata mått. | Användarens svar i konversationen. | Definiera period och korrekt bas för varje mått. |
| Bekräftat | Kickback ska kunna följas för alla tre partnerkanaler. | Användarens uttryckliga instruktion. | Redovisningsbehov är bekräftat; faktiska regler och belopp är det inte. |
| Bekräftat, tekniskt | GitHub-main var 347f02a1a1cdfe47e2abb33793e9f24b1575f758 vid uppdragets start. Repo är publikt. | GitHub-läsning och git fetch, 2026-10-10. | Gemensam kodkälla; inga riktiga kundärenden eller hemligheter i repo. |
| Bekräftat, tekniskt | Prototypen är statisk med localStorage/sessionStorage. Ingen delad backend, verklig rollstyrning eller Beest-integration finns. | Aktuell kod och README.md, avläst 2026-10-10. | Två användare delar inte ärendedata. Demovyer är inte behörighetsgränser. |
| Bekräftat, tekniskt | INFLYTT-01, -02 och -03 har publiceringskvittens. PR #1 införlivades genom kunddemot i PR #4; native GitHub-status är merged. | WORKLOG.md, [PR #4](https://github.com/ludros93-prog/kraftringen-partnerlabb/pull/4) och Sites version 12, SHA c956ab385493df4479338cec6a60ccfed1f69bc3, verifierat 2026-10-10 kl. 19:07 UTC. | Återanvänd publicerad kvittoåterupptagning; skapa ingen konkurrerande kopia. |
| Bekräftat, instruktion | Ludwig ska godkänna Daniels konkreta PR och aktuella HEAD-SHA före integration/publicering. | Användarbeslut och COLLABORATION.md. | Ta inte in Daniels ogranskade arbete i agentens egen leverans. |
| Förslag | Avgränsa första verkliga piloten till ett fastighetsbolag och en namngiven Kraftringen-handläggare. | Senaste pilotupplägget, dokumenterat 2026-10-10. | Föreslagen avgränsning; inga deltagare är utsedda här. |
| Förslag, designval | Fem guidade moment: partner, hyresgäst, förmedling, Kraftringen och återkoppling, med tydlig hierarki och nästa handling. | Anpassning av det bekräftade arbetssättet till kunddemo, 2026-10-10. | Verifiera att demoflödet går att genomföra; beskriv inte designval som bevis på faktisk användarnytta. |
| Bekräftat, tekniskt | `?demo=inflyttning` öppnar en separat fiktiv demoyta med egna lokala ärende-/utkastnycklar och återställning av bara denna yta. | Källkod, 34 browserkontroller och lyckad Sites-publicering version 12 den 2026-10-10; kvittens i WORKLOG. | Generalrepetitionen bevarar ordinarie labbdata. Guidad navigation och lokal isolering är inga riktiga behörigheter. |
| Förslag | Direkt hyresgästlänk eller QR kan minska fastighetsbolagets arbete. | Pilotresonemang, 2026-10-10. | Behöver beslut om förmedlingsansvar och godkänd process före ändring. |
| Förslag | Börja uppföljningen med kontrollerade importer/avstämningar innan automatiska integrationer. | Pilotresonemang, 2026-10-10. | Förbered en liten fiktiv mall; faktisk datakälla och mandat saknas. |
| Saknas | Namn på pilotpartner, ansvarig handläggare och ett anonymiserat representativt ärende. | Inte lämnat i nuvarande underlag, 2026-10-10. | [Beslut D-01](PILOT-DECISIONS.md). Behövs för verklig pilot och användarutfall, inte för färdig fiktiv demo. Inga verkliga tids-/nyttopåståenden kan göras. |
| Saknas | Godkända uppgifter, fullmaktsmall, identifiering, signering och återkopplingsprocess. | AGENTS.md och aktuella öppna beslut, 2026-10-10. | [Beslut D-02](PILOT-DECISIONS.md). Nuvarande formulärfält är demo, inte godkänd verksamhetsmall. |
| Saknas | Godkänd miljö för gemensam lagring, identiteter, åtkomst, personuppgifter och pilotdrift samt genomförandemandat. | Nuvarande uppdrag gäller frontend; inget senare driftbeslut finns här. | [Beslut D-03](PILOT-DECISIONS.md). Förbered specifikation; aktivera inte backend/persondata. |
| Saknas | Verifierade avtals-/volym-/churndatakällor och kickbackregler per kanal. | DATA-01, 2026-10-10. | [Beslut D-04](PILOT-DECISIONS.md). Saknat underlag får inte visas som nollutfall eller påhittad verklig ekonomi. |

MWh betyder i nuvarande rapporter **avtalad årsvolym för periodens nya avtal**,
inte levererad el under månaden. Verklig energi, avtalsutfall och ekonomiskt
resultat kräver egna källor och definitioner. Regeluppgifter som inte behövs
för pilotuppgiften får inte förvandlas till produktlöften.
