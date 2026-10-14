// TARTALOM: itt kell szerkeszteni, a kódhoz nem kell nyúlni.
// shape: ball | book | piano | dumbbell | rope | monitor | cap | flask | cube
export const TEAM_NAME = "import team name here";

const R = 0xe8222a;
const ph = (room) => [{ name: "Ide jön a tárgy", shape: "cube", color: R, text: `TODO: ${room} szoba tárgya és leírása.` }];

export const OWNERS = [
  {
    name: "Tóth Péter", role: "Vezető fejlesztő", from: 0, to: 8,
    rooms: {
      // A "jelen" a bemutatkozó csarnokba került.
      intro: [
        { name: "Tóth Péter", shape: "cube", color: R, text: "Tóth Péter vagyok, a csapat vezető fejlesztője." },
        { name: "Fagott", shape: "bassoon", color: 0x6b3a1e, text: "Fagottozom, és szeretek zenét készíteni." },
        { name: "Programozás", shape: "monitor", color: 0x222222, text: "Programozom, és videojátékokon dolgozom." },
        { name: "Kung fu", shape: "belt", color: 0x111111, text: "Kung fut csinálok." },
        { name: "Tanulás", shape: "book", color: 0x2a5ae8, text: "Középiskolában tanulok, és egyre többet rajzolok." },
      ],
      past: [
        { name: "Rajzolás", shape: "pencil", color: 0xf2c12a, text: "Régen sokat rajzoltam." },
        { name: "Furulya", shape: "recorder", color: 0xe8d9b0, text: "Furulyázni tanultam." },
        { name: "Úszás", shape: "glasses", color: 0x2a5ae8, text: "Régen úsztam." },
        { name: "Kristálygyűjtemény", shape: "crystal", color: 0x9a6ae8, text: "Kristályokat gyűjtöttem." },
        { name: "Videojátékok", shape: "controller", color: 0x222222, text: "Régen is sokat játszottam videojátékokkal." },
      ],
      hobby: [
        { name: "Kung fu", shape: "belt", color: 0x111111, text: "A kung fu mestere vagyok." },
        { name: "Fagott", shape: "bassoon", color: 0x6b3a1e, text: "10 éve fagottozom." },
        { name: "Videojáték-fejlesztés", shape: "monitor", color: 0x222222, text: "Mellékhobbi, mióta az iskolában programozást tanulok." },
        { name: "Barátok", shape: "cube", color: R, text: "A barátokkal lógás nem hobbi, csak valami, amit élvezek." },
      ],
      future: [
        { name: "Informatika egyetem", shape: "cap", color: 0x111111, text: "Informatikai egyetemre szeretnék menni." },
        { name: "Játékfejlesztő állás", shape: "controller", color: 0x222222, text: "Játékfejlesztőként szeretnék dolgozni." },
        { name: "Tartalomkészítés", shape: "pencil", color: R, text: "Zenét, művészetet és játékokhoz scripteket szeretnék készíteni." },
        { name: "Kung fu sportként", shape: "belt", color: 0x111111, text: "A kung fut a jövőben is sportként folytatnám." },
      ],
      gift: [
        { name: "Mini fagott", shape: "bassoon", color: 0x6b3a1e, text: "Egy miniatűr fagott." },
        { name: "Aranyszínű számítógép", shape: "monitor", color: 0xc9a227, text: "Egy aranyszínű számítógép." },
        { name: "Retro kontroller", shape: "controller", color: 0x888888, text: "Egy retro stílusú kontroller." },
        { name: "Nagyapaóra", shape: "clock", color: 0x4a2f1c, text: "Egy nagyapaóra." },
        { name: "Kerek szemüveg", shape: "glasses", color: 0x222222, text: "Egy kerek szemüveg." },
        { name: "Grafitceruza", shape: "pencil", color: 0x888888, text: "Egy grafitceruza." },
      ],
    },
  },
  {
    name: "Gál Péter", role: "Scrum Master / Projektkoordinátor", from: 8, to: 16,
    rooms: {
      intro: [{ name: "Gál Péter", shape: "cube", color: R, text: "Gál Péter vagyok, a csapat Scrum Mastere." }],
      past: [
        { name: "Sakk", shape: "chess", color: 0xf2f2f2, text: "Általános iskolában 6 évig sakkoztam." },
        { name: "Tankönyvek", shape: "book", color: 0x2a5ae8, text: "Az elmúlt 11 évet iskolában töltöttem." },
      ],
      hobby: [
        { name: "Foci", shape: "ball", color: 0xf2f2f2, text: "A foci végigkísérte az életem nagy részét, már 11 szezon van mögöttem." },
        { name: "Videójáték", shape: "controller", color: 0x222222, text: "Imádok játszani, a videójátékok a szenvedélyem." },
        { name: "Hot Wheels", shape: "car", color: R, text: "Kezdő Hot Wheels gyűjtő vagyok." },
        { name: "LEGO", shape: "lego", color: 0xf2c12a, text: "LEGO gyűjtő vagyok." },
      ],
      future: [
        { name: "Programozó", shape: "monitor", color: 0x222222, text: "A jövőben mindenképp informatikával szeretnék foglalkozni, lehetőleg programozóként." },
        { name: "Világutazás", shape: "globe", color: 0x2a8ae8, text: "Szeretném bejárni a világot és rengeteget utazni." },
      ],
      gift: [
        { name: "Képeslapok", shape: "card", color: 0x2aa84a, text: "A bejárt helyszíneimre utalnak." },
        { name: "Focimeccs jegyek", shape: "card", color: R, text: "A focira utalnak." },
        { name: "Repülőjegy", shape: "plane", color: 0xf2f2f2, text: "Még sokféle helyre fogok utazni." },
      ],
    },
  },
];
