/**
 * Staan er woorden aan elkaar geplakt, of staat er juist een spatie te veel?
 *
 * Yasin, 13 september 2026: "ik zie in titels how wework en what westand for enz, ook in
 * het nederlands staat er hoe wijwerken. loop alles goed na."
 *
 * WAAR DAT VANDAAN KOMT. JSX gooit de witruimte weg tussen een accolade en het element of
 * de accolade op de volgende regel:
 *
 *     {t("Hoe wij")}
 *     <span className="diba-accent">{t("werken")}</span>
 *
 * Dat rendert als "Hoe wijwerken". In de Nederlandse bron stond er platte tekst tussen de
 * twee, en die tekst is bij het bedraden een expressie geworden; de spatie die er eerst
 * gewoon stond hoort er nu als `{" "}` bij. Het is nooit een keuze, altijd een fout.
 *
 * HOE DIT MEET. Niet in de bron maar in de browser, want alleen daar is te zien of er
 * echt geen spatie staat. Per element gaat het langs de kinderen; bij elke overgang van
 * kind naar kind meet het het laatste teken van links en het eerste teken van rechts met
 * een Range. Staan die op dezelfde regel en raken ze elkaar bijna, dan zit er geen spatie
 * tussen en zijn het twee woorden die aan elkaar plakken.
 *
 * `scratch/spatie.py` keek naar `{...}` gevolgd door `{...}` in de bron. Dat miste de helft:
 * `{...}` gevolgd door `<span>` is precies dezelfde fout, en zo ontstond "hoe wijwerken".
 *
 * WAT NIET MEETELT. Leestekens en symbolen aan weerskanten van de naad: een euroteken voor
 * een bedrag, een punt na een link, een streepje in een bereik. Alleen letter-tegen-letter
 * en letter-tegen-cijfer is fout. Onzichtbare tekst telt niet mee, en een naad waar links
 * en rechts op verschillende regels staan ook niet.
 *
 * EN DE OMGEKEERDE FOUT. `{" "}` is het gereedschap waarmee je een plakfout repareert, en
 * het maakt zijn eigen fout: zet je hem voor een zin die zelf met een leesteken begint, dan
 * krijg je "Rotterdam , sinds 2017". Dat stond in de voettekst, dus op elke pagina van de
 * site, en op nog vier andere plekken. De tweede meting onderin dit bestand zoekt naar een
 * spatie vlak voor een leesteken; zie daar waarom dat niet op losse tekstknooppunten kan.
 *
 *   BASIS=http://localhost:3021 npm run spaties
 *   ALLES=1 BASIS=... npm run spaties      (alle bevindingen, niet de eerste dertig)
 *   BREEDTE=375 BASIS=... npm run spaties  (een regelafbreking die alleen op een
 *                                           telefoon wegvalt, valt alleen daar op)
 */

import { chromium } from "playwright";
import { alleAdressen } from "./lib/paden.mjs";

const BASIS = process.env.BASIS ?? "http://localhost:3010";
const ALLES = process.env.ALLES === "1";
const BREEDTE = Number(process.env.BREEDTE ?? 1280);

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: BREEDTE, height: 900 },
});
const pagina = await context.newPage();

/* Alle talen, ook die nog niet in de sitemap staat. Zie scripts/lib/paden.mjs. */
const paden = await alleAdressen(BASIS);

const ZOEK = () => {
  const uit = [];

  /** Het laatste tekstknooppunt binnen een knoop, of de knoop zelf als hij tekst is. */
  const laatsteTekst = (n) => {
    if (n.nodeType === Node.TEXT_NODE) return n.nodeValue.trim() ? n : null;
    if (n.nodeType !== Node.ELEMENT_NODE) return null;
    for (let i = n.childNodes.length - 1; i >= 0; i--) {
      const k = laatsteTekst(n.childNodes[i]);
      if (k) return k;
    }
    return null;
  };
  const eersteTekst = (n) => {
    if (n.nodeType === Node.TEXT_NODE) return n.nodeValue.trim() ? n : null;
    if (n.nodeType !== Node.ELEMENT_NODE) return null;
    for (const k of n.childNodes) {
      const t = eersteTekst(k);
      if (t) return t;
    }
    return null;
  };

  const rechtOpTeken = (tekst, index) => {
    const r = document.createRange();
    r.setStart(tekst, index);
    r.setEnd(tekst, index + 1);
    const rects = [...r.getClientRects()].filter((x) => x.width || x.height);
    return rects.length ? rects[rects.length - 1] : null;
  };

  const woord = (c) => /[\p{L}\p{N}]/u.test(c);

  const zichtbaar = (el) => {
    const s = getComputedStyle(el);
    if (s.display === "none" || s.visibility === "hidden") return false;
    if (parseFloat(s.opacity) === 0) return false;
    return el.getClientRects().length > 0;
  };

  for (const el of document.querySelectorAll("body *")) {
    if (el.closest("script, style, svg, noscript")) continue;
    if (el.childNodes.length < 2) continue;
    if (!zichtbaar(el)) continue;

    const kinderen = [...el.childNodes].filter(
      (n) =>
        (n.nodeType === Node.TEXT_NODE && n.nodeValue.trim()) ||
        (n.nodeType === Node.ELEMENT_NODE &&
          !n.matches("script, style, svg, br") &&
          n.textContent.trim() &&
          zichtbaar(n)),
    );

    for (let i = 0; i < kinderen.length - 1; i++) {
      const links = laatsteTekst(kinderen[i]);
      const rechts = eersteTekst(kinderen[i + 1]);
      if (!links || !rechts) continue;

      const lv = links.nodeValue;
      const rv = rechts.nodeValue;
      const li = lv.replace(/\s+$/, "").length - 1;
      const riRuw = rv.length - rv.replace(/^\s+/, "").length;
      if (li < 0 || riRuw >= rv.length) continue;
      /* Ergens tussen de twee staat witruimte in de tekst zelf: dan is het goed. */
      if (/\s$/.test(lv) || /^\s/.test(rv)) continue;

      const a = lv[li];
      const b = rv[riRuw];
      if (!woord(a) || !woord(b)) continue;

      const ra = rechtOpTeken(links, li);
      const rb = rechtOpTeken(rechts, riRuw);
      if (!ra || !rb) continue;
      /* Tekst die met `truncate` wordt afgekapt loopt door buiten zijn eigen vlak. Het
         laatste teken staat dan ergens achter de rand, en toevallig tegen het volgende
         stuk aan. Dat is geen plakfout maar een afgekapte regel. */
      const vlak = links.parentElement?.getBoundingClientRect();
      if (vlak && ra.right > vlak.right + 0.5) continue;
      /* Verschillende regels: dan plakt er niets. */
      if (Math.abs(ra.top - rb.top) > 3) continue;
      /* Een spatie is op elke maat breder dan anderhalve pixel. */
      if (rb.left - ra.right > 1.5) continue;

      const staart = lv.slice(Math.max(0, li - 14), li + 1);
      const kop = rv.slice(riRuw, riRuw + 15);
      uit.push({
        tag: el.tagName.toLowerCase(),
        klasse: (el.className || "").toString().slice(0, 40),
        fragment: `${staart}${kop}`,
        naad: `${a}|${b}`,
        links: lv.trim(),
        rechts: rv.trim(),
      });
    }
  }

  /* DE ANDERE KANT VAN DEZELFDE FOUT: EEN SPATIE TE VEEL.
     ────────────────────────────────────────────────────

     Hierboven gaat het om een ontbrekende spatie. Bij het repareren daarvan is `{" "}` het
     gereedschap, en dat gereedschap maakt zijn eigen fout: staat de zin erachter al met een
     leesteken te beginnen, dan krijg je "Rotterdam , sinds 2017". Die stond in de voettekst,
     dus op elke pagina van de site, en de meting hierboven zag hem niet: die kijkt naar
     letters die tegen letters aan plakken.

     Dit kan niet op losse tekstknooppunten: "Rotterdam", " " en ", sinds 2017" zijn er drie,
     en de browser voegt ze niet samen. Het moet dus over de tekst van het element eromheen,
     en alleen over elementen zonder blokken erin — anders plakt `textContent` het eind van
     de ene alinea aan het begin van de volgende en meet je een naad die op het scherm niet
     bestaat. */
  const blok = (e) => {
    const d = getComputedStyle(e).display;
    return /^(block|flex|grid|list|table)/.test(d);
  };

  for (const el of document.querySelectorAll("body *")) {
    if (el.closest("script, style, svg, noscript")) continue;
    if (!zichtbaar(el)) continue;
    if ([...el.querySelectorAll("*")].some(blok)) continue;

    const tekst = el.textContent ?? "";
    /* Ook de harde spatie ( ), want die staat er in bedragen en telefoonnummers. */
    /* Een smiley telt niet mee. In de reviews staat "Tot snel weer :)" en dat is geen
       dubbele punt met een spatie ervoor maar een gezichtje, letterlijk zoals de klant het
       schreef. Vandaar de uitsluiting van een haakje, een streepje of een D of P erachter. */
    const m = tekst.match(/.{0,25}[  ][,.;:!?](?![-)(DPp]).{0,15}/);
    if (!m) continue;

    uit.push({
      tag: el.tagName.toLowerCase(),
      klasse: (el.className || "").toString().slice(0, 40),
      fragment: m[0].replace(/\s+/g, " ").trim(),
      naad: "spatie|leesteken",
      links: "",
      rechts: "",
    });
  }

  return uit;
};

const bevindingen = [];
for (const pad of paden) {
  try {
    await pagina.goto(`${BASIS}${pad}`, { waitUntil: "domcontentloaded" });
    await pagina.waitForTimeout(120);
    const gevonden = await pagina.evaluate(ZOEK);
    for (const g of gevonden) bevindingen.push({ pad, ...g });
  } catch {
    /* Een pagina die niet laadt is het probleem van een andere controle. */
  }
}

await browser.close();

/* Dezelfde plakfout staat vaak op tientallen pagina's. Groeperen op het fragment. */
const groepen = new Map();
for (const b of bevindingen) {
  const g = groepen.get(b.fragment) ?? { ...b, paden: [] };
  g.paden.push(b.pad);
  groepen.set(b.fragment, g);
}
const lijst = [...groepen.values()].sort(
  (a, b) => b.paden.length - a.paden.length,
);

/* Voor het herstelscript: de twee teksten aan weerskanten van elke naad. */
if (process.env.JSON === "1") {
  const naden = lijst.map((g) => ({
    links: g.links,
    rechts: g.rechts,
    pad: g.paden[0],
    fragment: g.fragment,
  }));
  const { writeFileSync } = await import("fs");
  writeFileSync("scratch/naden.json", JSON.stringify(naden, null, 1), "utf8");
  console.log(`
scratch/naden.json geschreven: ${naden.length} naden.`);
}

console.log(
  `\n${paden.length} pagina's nagelopen op ${BREEDTE} pixels breed.\n`,
);

if (lijst.length === 0) {
  console.log("ok — nergens staan twee woorden aan elkaar geplakt.");
} else {
  console.log(
    `${lijst.length} plakfout(en), samen ${bevindingen.length} keer op de site.\n`,
  );
  for (const g of ALLES ? lijst : lijst.slice(0, 30)) {
    console.log(
      `  ${String(g.paden.length).padStart(4)}x  <${g.tag}>  "${g.fragment}"`,
    );
    console.log(
      `        ${g.paden.slice(0, 3).join(", ")}${g.paden.length > 3 ? ` en nog ${g.paden.length - 3}` : ""}`,
    );
  }
  if (!ALLES && lijst.length > 30) {
    console.log(`\n  en nog ${lijst.length - 30}. ALLES=1 toont ze allemaal.`);
  }
  process.exitCode = 1;
}
