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
    naam: "andere klinieken kleiner maken",
    bron: "Hoe Diba klinkt",
    uitleg:
      'De gids: "rustig en zelfverzekerd, zonder andere klinieken kleiner te maken." Onze prijslijst wordt niet duidelijker van een uitleg over waarom de rest die van hen verzwijgt.',
    test: (t) =>
      /\b(de meeste|andere|veel) (klinieken|salons|aanbieders)\b/i.test(t) ||
      /\b(elders|ergens anders) (wordt|krijg je|beloven ze)\b/i.test(t),
    grens: 0,
  },
  {
    naam: "de site die zichzelf prijst",
    bron: "Hoe Diba klinkt",
    uitleg:
      "Uitleggen hoe eerlijk of volledig deze pagina is. Eerlijkheid toon je door te zeggen wat iets niet doet; het bewijs staat er dan al.",
    test: (t) =>
      /\b(daarom staan|daarom staat|hier staat|deze pagina)\b[^.!?]{0,60}\b(eerlijk|volledig|compleet|niets weg)\b/i.test(
        t,
      ) ||
      /\b(is geen eerlijkheid maar|een folder van de fabrikant|zonder omweg)\b/i.test(t),
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

/**
 * Koppen die op een ontkenning staan.
 *
 * Eerst telde dit de dichtheid van het woord "geen" over alle tekst, met een drempel van
 * vijf procent. Dat bleek het verkeerde te meten: op de behandelingenpagina is "Geen." de
 * juiste waarde in de kolom hersteltijd, en "er is geen hersteltijd" is precies zo concreet
 * als de gids vraagt. Die omlaag jagen maakt de tekst vager in plaats van beter.
 *
 * Wat wél een tic is, is de ontkenning als kopvorm: eerst zeggen wat iets niet is en de
 * lezer laten wachten op wat het wel is. Daar gaat het hieronder over.
 *
 * De grens staat niet op nul. "Wij behandelen geen eczeem" en "Tien dingen die wij niet
 * doen" zijn de eerlijkheid waar de gids om vraagt; die horen te blijven staan.
 */
const ontkenningskoppen = regels.filter(
  (r) => /^\*\*[^*]+\*\*$/.test(r.t) && /\b(geen|niet|nooit)\b/i.test(r.t),
);

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
  `${ontkenningskoppen.length} koppen staan op een ontkenning. Een deel daarvan hoort zo;` +
    ` het gaat om de koppen die eerst zeggen wat iets niet is.`,
);

process.exitCode = bevindingen.length ? 1 : 0;
