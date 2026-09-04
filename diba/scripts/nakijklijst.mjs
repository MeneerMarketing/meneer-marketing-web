import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

/**
 * Genereert NAKIJKLIJST.md: alles wat de kliniek nog moet bevestigen.
 *
 * WAAROM DIT EEN SCRIPT IS EN GEEN DOCUMENT.
 *
 * Er staan ruim driehonderd markeringen in de code. Een lijst die met de hand wordt
 * overgetypt klopt na de eerste wijziging niet meer, en dan is hij erger dan geen lijst:
 * dan denkt iemand dat hij alles heeft nagekeken terwijl er drie regels bij zijn gekomen.
 *
 * Draai `npm run nakijklijst` en het document is weer actueel. Wat eruit verdwenen is,
 * is nagekeken en uit de code gehaald; wat erbij staat, staat er nog.
 *
 * DE VLAGGEN, EN WAT ZE BETEKENEN.
 *
 * - MEDISCHE-CHECK-ROJDA  Een medische bewering. Klopt hij, en mag hij zo op de site?
 * - BESLUIT-OKAN          Een keuze die niet aan de bouwer is maar aan de kliniek.
 * - GEGEVEN-NODIG         Een getal of feit dat ingevuld is met een werkbare aanname.
 * - PRIJS-NODIG           Een bedrag dat ingevuld is met een werkbare aanname.
 * - COPY-NODIG            Tekst die geschreven is en akkoord nodig heeft.
 * - BEELD-NODIG           Een foto die er nog niet is.
 *
 * Let op het verschil dat de meeste tijd scheelt: GEGEVEN-NODIG en PRIJS-NODIG betekenen
 * niet dat er niets staat. Er staat wél iets, en het is een aanname. Wie ze overslaat
 * publiceert dus geen leeg veld maar een verzonnen getal.
 */

const WORTEL = new URL("..", import.meta.url).pathname.replace(
  /^\/([A-Za-z]:)/,
  "$1",
);
const BRON = join(WORTEL, "src");
const UIT = join(WORTEL, "NAKIJKLIJST.md");

const VLAGGEN = [
  "MEDISCHE-CHECK-ROJDA",
  "BESLUIT-OKAN",
  "GEGEVEN-NODIG",
  "PRIJS-NODIG",
  "COPY-NODIG",
  "BEELD-NODIG",
];

const EIGENAAR = {
  "MEDISCHE-CHECK-ROJDA": "Rojda",
  "BESLUIT-OKAN": "Okan",
  "GEGEVEN-NODIG": "Okan",
  "PRIJS-NODIG": "Okan",
  "COPY-NODIG": "Okan",
  "BEELD-NODIG": "Okan",
};

const UITLEG = {
  "MEDISCHE-CHECK-ROJDA":
    "Medische bewering. Klopt hij, en mag hij in deze bewoording op de site?",
  "BESLUIT-OKAN": "Een keuze die niet aan de bouwer is maar aan de kliniek.",
  "GEGEVEN-NODIG":
    "Er staat een werkbare aanname. Bevestig hem of geef het juiste getal.",
  "PRIJS-NODIG":
    "Er staat een werkbaar bedrag. Bevestig het of geef het juiste tarief.",
  "COPY-NODIG": "Tekst is geschreven. Akkoord nodig van wie erover gaat.",
  "BEELD-NODIG": "Hier hoort een foto die er nog niet is.",
};

/** Van bestandspad naar iets wat een mens herkent. */
function onderwerp(pad) {
  const d = pad.split(sep);
  const naam = d[d.length - 1].replace(/\.(tsx?|ts)$/, "");
  if (d.includes("app")) {
    const i = d.indexOf("app");
    const route = d.slice(i + 1, -1).filter((s) => !s.startsWith("["));
    return route.length ? "/" + route.join("/") : "Homepage";
  }
  if (d.includes("data")) return "Inhoud: " + naam;
  if (d.includes("components")) return "Onderdeel: " + naam;
  return naam;
}

/* De componentenshowcase onder /dev staat vol placeholders, en met opzet: dat is een
   demopagina voor de bouwer en geen inhoud die iemand moet nakijken. Wie hem meeneemt
   zet zestien regels op de lijst die niemand ooit ziet. */
const OVERSLAAN = ["dev", "node_modules"];

function loop(dir, uit = []) {
  for (const naam of readdirSync(dir)) {
    const pad = join(dir, naam);
    if (statSync(pad).isDirectory()) {
      if (!OVERSLAAN.includes(naam)) loop(pad, uit);
    } else if (/\.(tsx?|ts)$/.test(pad)) {
      uit.push(pad);
    }
  }
  return uit;
}

/**
 * De zin achter een vlag, leesbaar gemaakt.
 *
 * Lange teksten staan over meerdere regels, en dan staat de vlag op de laatste. De regel
 * op zichzelf leverde dan fragmenten op als `",` en daar kan niemand iets mee. Dit loopt
 * terug tot het begin van de tekst.
 */
function zinBij(regels, i) {
  let stuk = regels[i];
  let j = i;
  /* Terug tot waar de eigenschap begint, maar hooguit vier regels: zonder die rem loopt
     hij bij JSX door tot boven in de component en levert hij opmaak in plaats van tekst. */
  while (
    j > 0 &&
    i - j < 4 &&
    !/^\s*(\/\/|\*)/.test(regels[j]) &&
    !/^\s*[a-zA-Z]+\s*[:=]/.test(regels[j])
  ) {
    j--;
    stuk = regels[j] + " " + stuk;
  }
  const zin = stuk
    .replace(/\[[A-Z-]+(?::[^\]]*)?\]/g, "")
    .replace(/^\s*[a-zA-Z]+\s*[:=]\s*/, "")
    .replace(/["'`]/g, "")
    .replace(/\s+/g, " ")
    .replace(/[\s,]+$/, "")
    .trim();
  // Zit er opmaak in, dan is het geen zin om na te lezen maar code.
  return /className|<\/|\/>|\{\/\*/.test(zin) ? "" : zin;
}

const treffers = [];
for (const pad of loop(BRON)) {
  const regels = readFileSync(pad, "utf8").split("\n");
  /* Commentaar is toelichting voor de bouwer en geen inhoud om na te kijken. Dat geldt
     ook voor JSX-commentaar: dat begint met {/* en loopt over meerdere regels door, dus
     regel voor regel kijken volstaat niet. */
  let inJsxCommentaar = false;
  regels.forEach((regel, i) => {
    const opent = regel.includes("{/*");
    const sluit = regel.includes("*/}");
    const wasInCommentaar = inJsxCommentaar;
    if (opent && !sluit) inJsxCommentaar = true;
    if (sluit) inJsxCommentaar = false;
    if (wasInCommentaar || (opent && sluit) || (opent && !sluit)) return;
    if (/^\s*(\*|\/\/|\/\*)/.test(regel)) return;
    for (const vlag of VLAGGEN) {
      if (!regel.includes("[" + vlag)) continue;
      // De zin zonder de vlaggen: dat is wat de bezoeker leest.
      const zin = zinBij(regels, i);
      treffers.push({
        vlag,
        onderwerp: onderwerp(pad),
        bestand: relative(WORTEL, pad).split(sep).join("/") + ":" + (i + 1),
        zin: zin.length > 300 ? zin.slice(0, 297) + "..." : zin,
      });
    }
  });
}

const perEigenaar = {};
for (const t of treffers) {
  const e = EIGENAAR[t.vlag];
  ((perEigenaar[e] ??= {})[t.vlag] ??= []).push(t);
}

const nu = new Date().toLocaleDateString("nl-NL", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

let md = `# Nakijklijst Diba Clinics

*Automatisch gegenereerd op ${nu}. Draai \`npm run nakijklijst\` voor een verse versie.*

Dit is alles wat er op de site staat en nog bevestigd moet worden. Het is met opzet
ingevuld en niet leeggelaten: een lege pagina laat zich niet beoordelen en een site met
gaten laat zich niet presenteren. Wat er staat is een werkbare aanname, en dat is precies
wat hier nagekeken moet worden.

**Let op het verschil dat de meeste tijd scheelt.** Bij \`GEGEVEN-NODIG\` en
\`PRIJS-NODIG\` staat er wél iets op de site. Wie die regels overslaat publiceert dus geen
leeg veld maar een verzonnen getal.

**Totaal: ${treffers.length} regels.**

`;

for (const [eigenaar, vlaggen] of Object.entries(perEigenaar).sort()) {
  const aantal = Object.values(vlaggen).reduce((n, v) => n + v.length, 0);
  md += `\n## Voor ${eigenaar} (${aantal})\n`;
  for (const [vlag, rijen] of Object.entries(vlaggen).sort(
    (a, b) => b[1].length - a[1].length,
  )) {
    md += `\n### ${vlag} · ${rijen.length}\n\n${UITLEG[vlag]}\n`;
    const perOnderwerp = {};
    for (const r of rijen) (perOnderwerp[r.onderwerp] ??= []).push(r);
    for (const [ond, rs] of Object.entries(perOnderwerp).sort()) {
      md += `\n**${ond}** (${rs.length})\n\n`;
      for (const r of rs) {
        md += r.zin
          ? `- ${r.zin}\n  <sub>${r.bestand}</sub>\n`
          : `- <sub>${r.bestand}</sub>\n`;
      }
    }
  }
}

writeFileSync(UIT, md, "utf8");
console.log(
  `NAKIJKLIJST.md geschreven: ${treffers.length} regels over ${Object.keys(perEigenaar).length} eigenaren.`,
);
