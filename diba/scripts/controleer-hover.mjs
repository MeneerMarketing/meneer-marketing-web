/**
 * Verdwijnt er iets als je eroverheen gaat?
 *
 * Aanleiding: op /prijzen staat de lijst in een sectie met `bg-[var(--g-050)]` en hadden de
 * rijen `hover:bg-[var(--g-050)]`. Een witte rij werd bij hover dus exact de kleur van de
 * achtergrond eronder, en dan lijkt de rij weg te vallen in plaats van op te lichten.
 *
 * HOE DIT MEET, EN WAAROM NIET ANDERS.
 *
 * Eerst probeerde ik de hoverkleur echt op het element te zetten en het resultaat te lezen.
 * Dat werkt niet: de opgegeven kleur kwam er niet doorheen en de meting gaf de bestaande
 * achtergrond terug, wat honderdzevenenveertig verzonnen fouten opleverde.
 *
 * Nu leest het script de klassenaam uit en zoekt het de kleur op in het palet op :root. Dat
 * is dezelfde bron als waar Tailwind hem vandaan haalt, en er komt geen browsergedrag meer
 * tussen.
 *
 *   BASIS=http://localhost:3021 npm run hover
 */
import { chromium } from "playwright";

const BASIS = process.env.BASIS ?? "http://localhost:3010";

/** Onder dit verschil is de hover niet meer te zien. Op een schaal van 0 tot 255. */
const GRENS = 6;

const browser = await chromium.launch();
const pagina = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await pagina.goto(`${BASIS}/sitemap.xml`, { waitUntil: "domcontentloaded" });
const xml = await pagina.content();
const paden = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => new URL(m[1]).pathname)
  .filter((p, i, a) => a.indexOf(p) === i)
  .sort();

const bevindingen = [];

for (const pad of paden) {
  await pagina.goto(`${BASIS}${pad}`, { waitUntil: "domcontentloaded" }).catch(() => {});

  const fouten = await pagina
    .evaluate((grens) => {
      const wortel = getComputedStyle(document.documentElement);
      const uit = [];

      const hex = (h) => {
        const s = h.replace("#", "").trim();
        const v =
          s.length === 3
            ? s.split("").map((c) => parseInt(c + c, 16))
            : [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16));
        return v.some(Number.isNaN) ? null : v;
      };
      const rgb = (s) => {
        if (!s) return null;
        if (s.startsWith("#")) return hex(s);
        const n = (s.match(/\d+(\.\d+)?/g) ?? []).slice(0, 3).map(Number);
        return n.length === 3 ? n : null;
      };

      /** De klassenaam omzetten naar een kleur, via het palet op :root. */
      const hoverKleur = (klas) => {
        const m = klas.match(/hover:bg-\[var\((--[\w-]+)\)\]/);
        if (m) return rgb(wortel.getPropertyValue(m[1]).trim());
        if (/hover:bg-white(?![/\w])/.test(klas)) return [255, 255, 255];
        return null; // doorzichtige varianten zoals white/10 laten we met rust
      };

      /** De kleur waar het element zelf op staat. */
      const eigenKleur = (el) => {
        let p = el;
        while (p) {
          const c = getComputedStyle(p).backgroundColor;
          if (c && c !== "rgba(0, 0, 0, 0)" && c !== "transparent") return rgb(c);
          p = p.parentElement;
        }
        return rgb(getComputedStyle(document.body).backgroundColor);
      };

      const afstand = (a, b) => Math.max(...a.map((v, i) => Math.abs(v - b[i])));

      /** De eerste omliggende kleur die van de kaart zelf verschilt. */
      const omgevingKleur = (el, eigen) => {
        let p = el.parentElement;
        while (p) {
          const c = getComputedStyle(p).backgroundColor;
          if (c && c !== "rgba(0, 0, 0, 0)" && c !== "transparent") {
            const k = rgb(c);
            if (k && afstand(k, eigen) >= 3) return k;
          }
          p = p.parentElement;
        }
        return null;
      };

      for (const el of document.querySelectorAll("[class*='hover:bg-']")) {
        const klas = el.getAttribute("class") ?? "";
        const hover = hoverKleur(klas);
        if (!hover) continue;

        const doos = el.getBoundingClientRect();
        if (doos.width < 60 || doos.height < 20) continue;

        const eigen = eigenKleur(el);
        if (!eigen) continue;
        const omgeving = omgevingKleur(el, eigen);

        /* Twee manieren waarop een hover mislukt: hij lijkt op de kaart zelf en dan
           gebeurt er zichtbaar niets, of hij lijkt op de omgeving en dan lost de kaart
           erin op. */
        const dEigen = afstand(hover, eigen);
        const dOmgeving = omgeving ? afstand(hover, omgeving) : 255;
        if (dEigen >= grens && dOmgeving >= grens) continue;

        uit.push({
          klasse: (klas.match(/hover:bg-\[?[^\s]+/) ?? [""])[0],
          soort: dEigen < grens ? "geen verschil met de kaart" : "lost op in de omgeving",
          hover: hover.join(","),
          onder: (dEigen < grens ? eigen : omgeving).join(","),
          verschil: Math.min(dEigen, dOmgeving),
          tekst: (el.textContent ?? "").trim().slice(0, 54),
        });
      }
      return uit;
    }, GRENS)
    .catch(() => []);

  for (const f of fouten) bevindingen.push({ pad, ...f });
}

await browser.close();

/* Dezelfde klasse op dezelfde ondergrond is een fout, niet vijftig. */
const perFout = new Map();
for (const b of bevindingen) {
  const sleutel = `${b.klasse} — ${b.soort} rgb(${b.onder})`;
  if (!perFout.has(sleutel)) perFout.set(sleutel, []);
  perFout.get(sleutel).push(b);
}

console.log(
  `\n${bevindingen.length} plaatsingen waarvan de hover wegvalt tegen de achtergrond ` +
    `(verschil onder ${GRENS} van 255).\n`,
);

for (const [sleutel, lijst] of [...perFout.entries()].sort(
  (a, b) => b[1].length - a[1].length,
)) {
  const e = lijst[0];
  const paden = [...new Set(lijst.map((x) => x.pad))];
  console.log(`${String(lijst.length).padStart(3)}x  ${sleutel}   verschil ${e.verschil}`);
  console.log(`      "${e.tekst}"`);
  console.log(
    `      ${paden.slice(0, 3).join(", ")}${paden.length > 3 ? ` en nog ${paden.length - 3}` : ""}`,
  );
  console.log("");
}

if (bevindingen.length === 0) {
  console.log("ok — elke hover is te zien tegen de achtergrond waarop hij ligt.");
}
