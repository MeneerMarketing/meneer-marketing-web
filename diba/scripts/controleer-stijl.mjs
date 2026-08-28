/**
 * Controleert de teksten tegen DIBA-COPY-STYLE-GUIDE.md.
 *
 * WAAROM DIT ER IS.
 *
 * Okan las in augustus 2026 alle teksten na en wees niet een pagina af maar een patroon:
 * losse kreten met punten ertussen, vaste tegenstellingen, en beloftes die harder klinken
 * dan ze zijn. Dat zat door honderd pagina's heen, en bij honderd pagina's is opletten geen
 * methode meer.
 *
 * Dit vervangt het lezen niet. Een tekst kan aan alles hieronder voldoen en nog steeds
 * nergens over gaan. Wat het wel doet is voorkomen dat een patroon dat we eruit hebben
 * gehaald er stilletjes weer in kruipt, één nieuwe pagina tegelijk.
 *
 * Het leest TEKSTEN.md, dus draai eerst `npm run teksten`. Dat is met opzet: het gaat om
 * wat de bezoeker ziet en niet om wat er in de bronbestanden staat.
 *
 * De regels komen letterlijk uit de stijlgids. Staat er hier iets dat daar niet staat, dan
 * is dit bestand voorgelopen en hoort het teruggedraaid; de gids is de bron.
 */
import { readFileSync } from "fs";

const md = readFileSync("TEKSTEN.md", "utf8").split(/\r?\n/);

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

/** Haalt de opmaak van de export weg zodat de test op de zin zelf werkt. */
const kaal = (t) =>
  t
    .replace(/^\*\*(.+)\*\*$/, "$1")
    .replace(/^> knop:\s*/, "")
    .replace(/^[->*]\s*/, "")
    .trim();

/** Is dit een knoptekst? Die hebben hun eigen regels in de gids. */
const isKnop = (t) => /^> knop:/.test(t);

/**
 * De regels.
 *
 * `grens` is het aantal waarboven het een tic wordt in plaats van een keuze. Nul betekent:
 * dit willen we nergens zien.
 */
const REGELS = [
  {
    naam: "losse kreten met punten ertussen",
    bron: "Natuurlijk Nederlands",
    uitleg: 'Zoals "Eerlijk. Deskundig. Menselijk." of "Analyse. Inzicht. Behandeling."',
    test: (t) => /^([A-Z][a-zà-ÿ]{2,14}\.\s+){2,}[A-Z][a-zà-ÿ]{2,14}\.?$/.test(t),
    grens: 0,
  },
  {
    naam: "Eerst X. Dan Y.",
    bron: "Natuurlijk Nederlands",
    uitleg: "Twee halve zinnen als slogan.",
    test: (t) => /\bEerst\b[^.!?]{1,35}\.\s*(Dan|Daarna)\b/i.test(t),
    grens: 0,
  },
  {
    naam: "kop in twee helften met een komma",
    bron: "Koppen",
    uitleg: 'Zoals "Twee seconden, en je weet het zelf." Een kop vertelt waar het over gaat.',
    test: (t, ruw) =>
      /^\*\*[^*]{3,45},\s+(en|maar|of)\b[^*]{3,55}\*\*$/.test(ruw),
    grens: 0,
  },
  {
    naam: "geen X, wel Y",
    bron: "Natuurlijk Nederlands",
    uitleg: "De vaste tegenstelling.",
    test: (t) => /\bgeen\b[^.!?]{0,45}[.,]\s*(wel|maar wel)\b/i.test(t),
    grens: 0,
  },
  {
    naam: "beautycliché of grote belofte",
    bron: "Woorden en claims die we vermijden",
    uitleg: "ontdek, ervaar de kracht van, verwen jezelf, stralende huid, transformerend.",
    test: (t) =>
      /\b(ontdek|ervaar de kracht|verwen jezelf|stralende huid|transformerend|revolutionair|ultiem|de beste versie)\b/i.test(
        t,
      ),
    grens: 0,
  },
  {
    naam: "absolute claim",
    bron: "Medische toon",
    uitleg: "perfect, vlekkeloos, voor altijd, gegarandeerd, pijnloos, risicovrij.",
    test: (t) =>
      /\b(perfecte? huid|vlekkeloos|voor altijd|gegarandeerd resultaat|volledig pijnloos|risicovrij)\b/i.test(
        t,
      ),
    grens: 0,
  },
  {
    naam: "luxe of exclusief als verkoopargument",
    bron: "Diba klinkt niet zo",
    uitleg: "Diba is geen luxemerk.",
    test: (t) => /\b(luxueus|exclusieve? (behandeling|ervaring)|premium ervaring)\b/i.test(t),
    grens: 0,
  },
  {
    naam: "knop zonder bestemming",
    bron: "CTA's en knoppen",
    uitleg: 'Zoals "Ontdek nu", "Klik hier", "Boek vandaag nog".',
    test: (t, ruw) =>
      isKnop(ruw) &&
      /^(ontdek nu|klik hier|claim jouw plek|boek vandaag|mis het niet|nog maar enkele)/i.test(t),
    grens: 0,
  },
  {
    naam: "nep-urgentie",
    bron: "CTA's en knoppen",
    uitleg: "Schaarste of korting zonder controleerbare reden.",
    test: (t) =>
      /\b(alleen deze maand|op=op|laatste plekken|nu met korting|tijdelijke actie|nog \d+ plekken)\b/i.test(
        t,
      ),
    grens: 0,
  },
  {
    naam: "zichtbare redactievlag",
    bron: "Medische toon en controle",
    uitleg: "ROJDA-CHECK en soortgenoten horen nooit op het scherm.",
    test: (t) => /\[(ROJDA-CHECK|MEDISCHE-CHECK|COPY-NODIG|PRIJS-NODIG|GEGEVEN-NODIG)/i.test(t),
    grens: 0,
  },
  {
    naam: "merknaam verkeerd geschreven",
    bron: "Eindcontrole",
    uitleg: "Het is Diba Clinics, niet DIBA Clinics.",
    test: (t) => /\bDIBA\s+Clinics\b/.test(t),
    grens: 0,
  },
];

const bevindingen = [];
for (const r of REGELS) {
  const raak = regels.filter((x) => r.test(kaal(x.t), x.t));
  if (raak.length > r.grens) bevindingen.push({ r, raak });
}

/* "geen" telt apart: geen patroon maar een dichtheid. */
const metGeen = regels.filter((r) => /\bgeen\b/i.test(r.t)).length;
const aandeel = (metGeen / regels.length) * 100;

console.log(`${regels.length} zichtbare tekstregels, getoetst aan DIBA-COPY-STYLE-GUIDE.md\n`);

if (!bevindingen.length) {
  console.log("ok — geen van de regels uit de gids overtreden.");
} else {
  for (const { r, raak } of bevindingen) {
    console.log(`${String(raak.length).padStart(4)}x  ${r.naam}   [${r.bron}]`);
    console.log(`        ${r.uitleg}`);
    for (const x of raak.slice(0, 3)) console.log(`        ${x.pad}  ${kaal(x.t).slice(0, 82)}`);
    if (raak.length > 3) console.log(`        ... en nog ${raak.length - 3}`);
    console.log("");
  }
}

console.log(
  `"geen" staat op ${metGeen} regels (${aandeel.toFixed(1)}%). Boven de 5% wordt het een tic.`,
);

process.exitCode = bevindingen.length ? 1 : 0;
