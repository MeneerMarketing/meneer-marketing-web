/**
 * Staat dezelfde review twee keer op één pagina?
 *
 * WAT YASIN ZAG. Op /laserontharing stonden twee van de drie kaarten met dezelfde tekst:
 * "Ik heb een hele fijne ervaring gehad bij Demi" naast "... bij Demy", allebei van
 * Andrijana, vier en vijf maanden geleden. 15 september 2026: "ik zie hier 2 x dezelfde
 * review waarom gebeurd dat."
 *
 * WAAROM DAT GEEN TOEVAL WAS. Een klant die vaker komt schrijft na elk bezoek ongeveer
 * hetzelfde, en dan staat het twee keer op Salonized. De keuze in `ReviewsBijOnderwerp`
 * zoekt drie reviews van gelijke lengte — en twee bijna gelijke teksten zijn bijna even
 * lang. Precies de verkeerde twee hadden dus de grootste kans om samen te vallen.
 *
 * `salonized-reviews.ts` haalt die stellen er nu bij het uitleveren uit. Deze controle
 * meet of dat op het scherm ook klopt, en of het klopt blijft als er een blok bijkomt of
 * als de data ververst wordt.
 *
 * WAT HIER NIET MEETELT. /reviews en de vertalingen daarvan. Dat is het volledige archief
 * en dat hoort alles te tonen wat Salonized heeft, ook twee bezoeken van dezelfde klant
 * die ongeveer hetzelfde opleverden. Zie `data/reviews-archief.ts`.
 *
 *   BASIS=http://localhost:3021 npm run reviews
 */
import { chromium } from "playwright";
import { alleAdressen } from "./lib/paden.mjs";

const BASIS = process.env.BASIS ?? "http://localhost:3010";

/* Dezelfde grens als in `salonized-reviews.ts`, en om dezelfde reden: gemeten liggen de
   dubbele op 0,84 en hoger en het hoogste stel dat echt twee reviews is op 0,67. */
const ZELFDE_VERHAAL = 0.8;

const LEES = () => {
  /* Een reviewkaart herken je aan het citaat: dat staat in een blockquote of in een alinea
     die met een aanhalingsteken begint.

     Alleen het buitenste element telt. Een reviewkaart is `<blockquote><p>"..."</p></blockquote>`,
     dus zonder deze regel leest elke kaart zichzelf twee keer en meldt de controle overal
     een gelijkenis van precies 1. */
  const gevonden = [...document.querySelectorAll("blockquote, p")].filter(
    (el) => /^[“"']/.test((el.textContent ?? "").trim()),
  );
  return gevonden
    .filter((el) => !gevonden.some((a) => a !== el && a.contains(el)))
    .map((el) => (el.textContent ?? "").replace(/\s+/g, " ").trim())
    .filter((t) => t.length > 40);
};

const kaal = (t) =>
  t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();

function gelijkenis(a, b) {
  const paren = (t) => {
    const uit = new Map();
    for (let i = 0; i < t.length - 1; i++) {
      const p = t.slice(i, i + 2);
      uit.set(p, (uit.get(p) ?? 0) + 1);
    }
    return uit;
  };
  const pa = paren(a);
  const pb = paren(b);
  let gedeeld = 0;
  for (const [p, n] of pa) gedeeld += Math.min(n, pb.get(p) ?? 0);
  const totaal = a.length - 1 + (b.length - 1);
  return totaal > 0 ? (2 * gedeeld) / totaal : 0;
}

const browser = await chromium.launch();
const pagina = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
});

/* Het archief hoort alles te tonen; daar is dubbel geen fout maar de bedoeling. */
const ARCHIEF = /^\/(reviews|en\/reviews|es\/reviews)$/;
const paden = (await alleAdressen(BASIS)).filter((p) => !ARCHIEF.test(p));

const bevindingen = [];
for (const pad of paden) {
  try {
    await pagina.goto(`${BASIS}${pad}`, { waitUntil: "domcontentloaded" });
    await pagina.waitForTimeout(100);
    const citaten = (await pagina.evaluate(LEES))
      .map(kaal)
      .filter((t) => t.length >= 25);
    for (let i = 0; i < citaten.length; i++) {
      for (let j = i + 1; j < citaten.length; j++) {
        const g = gelijkenis(citaten[i], citaten[j]);
        if (g >= ZELFDE_VERHAAL) {
          bevindingen.push({
            pad,
            g: Math.round(g * 100) / 100,
            a: citaten[i].slice(0, 70),
            b: citaten[j].slice(0, 70),
          });
        }
      }
    }
  } catch {
    /* Een pagina die niet laadt is het probleem van een andere controle. */
  }
}

await browser.close();

console.log(
  `\n${paden.length} pagina's nagelopen; het archief zelf telt niet mee.\n`,
);

if (bevindingen.length === 0) {
  console.log("ok — nergens staat dezelfde review twee keer op een pagina.");
} else {
  console.log(
    `${bevindingen.length} keer twee kaarten met hetzelfde verhaal:\n`,
  );
  for (const b of bevindingen) {
    console.log(`   ${b.pad}   (gelijkenis ${b.g})`);
    console.log(`      "${b.a}"`);
    console.log(`      "${b.b}"`);
  }
  process.exitCode = 1;
}
