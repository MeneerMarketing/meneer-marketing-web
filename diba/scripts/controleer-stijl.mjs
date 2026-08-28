/**
 * Telt de schrijfpatronen die in SCHRIJFSTIJL.md zijn afgesproken als "doen we niet meer".
 *
 * WAAROM DIT ER IS.
 *
 * Okan las in augustus 2026 alle teksten na en wees niet een pagina af maar een patroon:
 * koppen in twee helften met een komma, het geen-X-wel-Y-ritme, en losse zinnetjes met een
 * punt ertussen. Dat zat door honderd pagina's heen, en bij honderd pagina's is opletten
 * geen methode meer.
 *
 * Dit script vervangt het lezen niet. Een tekst kan aan alle regels hieronder voldoen en
 * nog steeds nergens over gaan. Wat het wel doet is voorkomen dat een patroon dat we eruit
 * hebben gehaald er stilletjes weer in kruipt, één pagina tegelijk.
 *
 * Het leest TEKSTEN.md, dus draai eerst `npm run teksten`. Dat is met opzet: het gaat om
 * wat de bezoeker ziet en niet om wat er in de bronbestanden staat.
 */
import { readFileSync } from "fs";

const md = readFileSync("TEKSTEN.md", "utf8").split(/\r?\n/);

/* Per regel bijhouden op welke pagina hij staat, zodat een melding bruikbaar is. */
const regels = [];
let pad = "(nog geen pagina)";
for (const r of md) {
  const t = r.trim();
  if (t.startsWith("### /")) {
    pad = t.slice(4);
    continue;
  }
  if (!t || t === "---" || t.startsWith("#") || t.startsWith("_")) continue;
  /* De twee regels die de export zelf toevoegt zijn geen paginatekst. */
  if (/^\*\*(Tabbladtitel|Google-omschrijving):\*\*/.test(t)) continue;
  regels.push({ pad, t });
}

/**
 * De patronen.
 *
 * `grens` is het aantal waarboven het een tic wordt in plaats van een keuze. Nul betekent:
 * dit willen we nergens meer zien. De rest heeft ruimte, want één keer "geen" in een zin
 * is gewoon Nederlands.
 */
const PATRONEN = [
  {
    naam: "kop in twee helften met een komma",
    uitleg: 'Bijvoorbeeld: "Twee seconden, en je weet het zelf."',
    test: (r) => /^\*\*[^*]{3,45},\s+(en|maar|of)\b[^*]{3,55}\*\*$/.test(r),
    grens: 0,
  },
  {
    naam: "Eerst X. Dan Y.",
    uitleg: "Twee halve zinnen als slogan.",
    test: (r) => /\bEerst\b[^.!?]{1,35}\.\s*(Dan|Daarna)\b/i.test(r),
    grens: 0,
  },
  {
    naam: "losse woorden met punten ertussen",
    uitleg: 'Bijvoorbeeld: "Eerlijk. Helder. Persoonlijk."',
    test: (r) => /^\*?\*?([A-Z][a-zà-ÿ]{2,12}\.\s+){2,}[A-Z][a-zà-ÿ]{2,12}\.\*?\*?$/.test(r),
    grens: 0,
  },
  {
    naam: "geen X, wel Y",
    uitleg: "Het contrast als vaste vorm.",
    test: (r) => /\bgeen\b[^.!?]{0,45}[.,]\s*(wel|maar wel)\b/i.test(r),
    grens: 0,
  },
  {
    naam: "zeggen dat we eerlijk zijn",
    uitleg: "Als de tekst eerlijk is, merkt de lezer dat zelf.",
    test: (r) => /\b(eerlijk gezegd|wij zijn eerlijk|omdat wij eerlijk)\b/i.test(r),
    grens: 2,
  },
  {
    naam: "superlatief of grote belofte",
    uitleg: "beste versie, revolutionair, uniek, perfect.",
    test: (r) =>
      /\b(de beste versie|revolutionair|uniek(e)? aanpak|perfecte huid|gegarandeerd)\b/i.test(r),
    grens: 0,
  },
  {
    naam: "druk zetten",
    uitleg: "Korting, schaarste, tijdelijk aanbod.",
    test: (r) =>
      /\b(alleen deze maand|op=op|laatste plekken|nu met korting|tijdelijke actie|actie loopt|nog \d+ plekken)\b/i.test(r),
    grens: 0,
  },
];

const bevindingen = [];
for (const p of PATRONEN) {
  const raak = regels.filter((r) => p.test(r.t));
  if (raak.length > p.grens) bevindingen.push({ p, raak });
}

/* "geen" telt apart: geen patroon maar een dichtheid. */
const metGeen = regels.filter((r) => /\bgeen\b/i.test(r.t)).length;
const aandeel = (metGeen / regels.length) * 100;

console.log(`${regels.length} zichtbare tekstregels gecontroleerd.\n`);

if (!bevindingen.length) {
  console.log("ok — geen van de afgesproken patronen gevonden.");
} else {
  for (const { p, raak } of bevindingen) {
    console.log(`${raak.length}x  ${p.naam}  (grens: ${p.grens})`);
    console.log(`      ${p.uitleg}`);
    for (const r of raak.slice(0, 4)) console.log(`      ${r.pad}  ${r.t.slice(0, 88)}`);
    if (raak.length > 4) console.log(`      ... en nog ${raak.length - 4}`);
    console.log("");
  }
}

console.log(
  `"geen" staat op ${metGeen} regels (${aandeel.toFixed(1)}%). Boven de 5% wordt het een tic.`,
);

process.exitCode = bevindingen.length ? 1 : 0;
