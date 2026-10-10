# Bildkällor

## Excel-import

`dist/vendor/exceljs-4.4.0.min.js` är ExcelJS 4.4.0, hämtad den 10 oktober
2026 från https://cdn.jsdelivr.net/npm/exceljs@4.4.0/dist/exceljs.min.js.
Den serveras lokalt och läser/skapar `.xlsx` i webbläsaren. Inga filer skickas
till en extern importtjänst. Projektkälla: https://github.com/exceljs/exceljs.
MIT-licensen sparas i `dist/vendor/exceljs-license.txt` från samma versionspaket.

`dist/assets/inflyttning-testbilaga.pdf` skapades i detta projekt den 10 oktober
2026 med ReportLab. Det är en tydligt märkt fiktiv fil för uppladdningsprov,
utan underskrift, personuppgifter, fullmaktsvillkor eller rättsverkan.
Dokumentet är ingen föreslagen eller godkänd fullmaktsmall.

## Typografi

`dist/assets/inter-variable.woff2` är Inter Variable från projektets officiella
källa: https://github.com/rsms/inter/tree/master/docs/font-files.
Den hämtades den 10 oktober 2026 och serveras lokalt utan extern fontförfrågan.
SIL Open Font License finns i `dist/assets/inter-license.txt` och originalet på
https://github.com/rsms/inter/blob/master/LICENSE.txt.

Prototypen använder följande bilder från Unsplash. Filerna är sparade lokalt under `dist/assets/`.

| Fil | Källa |
| --- | --- |
| `dist/assets/wind.jpg` | [Unsplash – vindkraft](https://images.unsplash.com/photo-1466611653911-95081537e5b7) |
| `dist/assets/office.jpg` | [Unsplash – kontorsmiljö](https://images.unsplash.com/photo-1497366811353-6870744d04b2) |
| `dist/assets/solar.jpg` | [Unsplash – solenergi](https://images.unsplash.com/photo-1509391366360-2e959784a276) |
| `dist/assets/home.jpg` | [Unsplash – bostadsillustration](https://images.unsplash.com/photo-1600585154340-be6161a56a0c) |

Bilderna illustrerar energi och arbetsmiljö i översikten, Academy, materialvyn och kundsideförhandsvisningar. De visar inte verifierade kunder, anläggningar eller verksamhetsplatser hos Kraftringen och antas inte vara godkända Kraftringen-bilder. En solenergibild innebär inte att solprodukter ingår i portalens beslutade produktutbud.

Fotografernas namn och bildsidornas adresser har inte verifierats; källänkarna ovan dokumenterar de använda bildresurserna utan tillskrivning som saknar underlag.

## Elakademin

| Resurs | Källa och användning |
| --- | --- |
| `dist/assets/elakademin-cover.png` | Omslag från den färdiga Elakademins egen Higgsedit-komposition. Innehåller utbildningsgrafik och ett genererat vuxenporträtt. Porträttet föreställer ingen verifierad Kraftringen-medarbetare. |
| Sex MP4-länkar i `dist/elakademin-data.js` | Slutliga, redan publicerade kapitelfilmer från Elakademin. Kapitel 4 använder den korrigerade filmen. 1920 × 1080, H.264/AAC, svenskt tal och inbränd svensk text; sammanlagd speltid 11:29. Filerna spelas från Higgsfields media-CDN och har inte kopierats eller producerats på nytt. |
| `dist/assets/elakademin-kundguide.pdf` | Elakademins färdiga kundguide på 12 sidor, kopierad från samma utbildningsportal. Innehåller företagsinriktade undervisningsexempel, ordlista, checklista och publika källor. |

Kursens text och originalfrågor kommer från den färdiga Elakademin (`/workspace/training/course.json`); de slutliga filmerna och filmmanusen från dess `video-manifest.json`. Publika produktkällor finns i kursdialogen. Interna Gamma-original, interna presentationsbilder och administrativa videoprojekt har inte lagts till i partnerportalens publika filer. Omslaget är utbildningsmaterial som byggts för denna utbildning och antas inte vara en separat godkänd Kraftringen-varumärkestillgång.
