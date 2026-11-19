Catalogul din `categories.js` reproduce cele 80 de categorii din `Categorii_karate.xlsx`.

- Probele individuale sunt Traseu tehnic, Makiwara, Kata individual, Kata open, Kumite individual și Kumite open.
- Kata echipe rămâne înscriere cu trei membri.
- La 9 ani se folosește grupa 9–10 ani, conform regulii confirmate. Intervalele originale rămân vizibile în catalog.
- Echipele sunt repartizate după vârsta celui mai mare membru, fără restricție de grad.
- Sexul și greutatea nu schimbă codul din Excel. Backendul păstrează separarea tabelelor după sex, prin prefixele M/F.
- O probă fără categorie eligibilă blochează trimiterea formularului. Codul și grupa sunt afișate înainte de înscriere.
- Se păstrează posibilitatea de a trimite o listă goală de probe, fără înscriere sau plată.

Taxele sunt calculate în backend numai pentru probele la care înscrierea este validă:

- Probele individuale, cu excepția Kata Open: 100 lei pentru o probă, 150 lei pentru două, 200 lei pentru trei sau mai multe. Kumite Open intră în acest pachet.
- Kata Open: 100 lei separat, adăugați peste taxa pachetului; nu se numără printre probele pachetului. Doar Kata Open costă 100 lei, două probe obișnuite + Kata Open costă 250 lei, trei sau mai multe probe obișnuite + Kata Open costă 300 lei.
- Kata echipe: 150 lei pe echipă/probă, înregistrat în evidența plăților ca 50 lei pentru fiecare dintre cei trei membri.
- Probele duplicate nu se taxează din nou în aceeași înscriere, iar probele neeligibile nu sunt taxate.

Contractul API păstrează endpointurile `/api/sportivi/adauga` și `/api/echipe/adauga`, iar `probe` conține codurile din Excel. Exemplu pentru un sportiv de 9 ani, 7 Kyu:

```json
{"tip":"sportiv","club":"Club","nume":"Sportiv","varsta":"9","kg":"30","kyu":"7 Kyu","gen":"Masculin","probe":["T8","MM8","KAT11","KU4"]}
```

Backendul recalculează categoria și respinge codurile nepotrivite. `introduse` și `nereusite` păstrează formatul de listă. Backendul acceptă și identificatorii vechi de probe pentru actualizarea succesivă a celor două aplicații.

Actualizarea backendului este în proiectul `SiteDBSportDataMicro/SITEDBMICRO2.0`. Instrucțiunile pentru tabele și publicare sunt în `database/README-categorii.md` din acel proiect. Backendul și tabelele necesare trebuie pregătite înainte de publicarea frontendului.

Verificarea regulilor frontendului:

```powershell
node --test --test-isolation=none tests/categories.test.js
node --check script.js
```
