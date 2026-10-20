# MEseum – Hamburger csapat

First person, retro stílusú 3D múzeum, ami három csapattag önéletrajzaként működik.
A játékbeli óra 24 órája három részre oszlik: 0–8 Tóth Péter, 8–16 Gál Péter, 16–24 Katona Gergő.
Az óra állása dönt a kiállításról és a fényekről (éjjel sötét, délben világos).

## Futtatás
Live server index.html

## Irányítás
WASD mozgás · Shift futás · egér nézelődés · Esc szünet menü (múzeum-választó, időtempó csúszka) · 1/2/3 múzeumváltás · +/- idő gyorsítása/lassítása.
Alapérték: 1 perc = 1 óra (a csúszkán 1–120 mp/óra).

## Tartalom szerkesztése
Mindenki a `js/data.js`-ben a saját blokkját tölti ki (`intro`, `past`, `hobby`, `future`, `gift`). Egy szobába 1–6 tárgy fér el.
Modellek (`shape`): ball, book, piano, dumbbell, rope, monitor, cap, flask, cube. A csapatnév a `TEAM_NAME` konstansban van.

## Szerepkör- és feladatmátrix
| Fájl / feladat | Szerepkör | Felelős |
| --- | --- | --- |
| `js/main.js` (mozgás, napszak, kiállítás, főciklus), `js/museum.js` (épület, szobák, kültér), `js/models.js` (tárgyak) | Lead Developer | Tóth Péter |
| `index.html`, `css/style.css` (HUD, szünet menü, info panel), tesztelés | UI/UX + QA | Katona Gergő |
| `docs/`, Trello, stakeholder-térkép, `README.md` | Scrum Master | Gál Péter |
| `js/data.js` | mindenki a saját blokkjáért | |

## Kódszerkezet (kezdőknek)
- `js/museum.js`: az épület adatokból épül (ROOMS, HALL_WALLS listák). Új fal vagy szoba = új sor a listában.
- `js/models.js`: a tárgyak egyszerű dobozokból, hengerekből, gömbökből állnak.
- `js/main.js`: 6 számozott rész (jelenet, kiállítás, napszak, irányítás, tárgyra nézés, főciklus).
- A játékos kint, a múzeum előtt kezd, a bejárat a déli oldalon, a MEseum felirat alatt van.
