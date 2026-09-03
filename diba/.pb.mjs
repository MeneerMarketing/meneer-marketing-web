import { readFileSync, writeFileSync } from "fs";
const pad = "src/components/huidprofiel/ProfielBouwer.tsx";
let t = readFileSync(pad, "utf8");
const mislukt = [];
const zet = (van, naar) => {
  if (!t.includes(van)) {
    mislukt.push(van.split("\n")[0].trim().slice(0, 55));
    return;
  }
  t = t.replace(van, naar);
};

/* pl-13 bestaat niet in Tailwind. */
zet("lg:p-11 lg:pl-13", "lg:p-11 lg:pl-14");

/* Blok één opent voor vraag 1: de kaarten krijgen ruimte tussen zich in. */
zet(
  `      {/* ── 1. De scan ── */}
      <Vraag`,
  `      {/* ── Blok 1: wat je wil ── */}
      <Blokkop
        nummer="Deel 1"
        kop="Wat je wil bereiken"
        zin="Vier vragen over je doel, je huid en hoeveel hersteltijd je hebt. Hiermee kunnen we al ordenen wat er bij je past."
      />

      <div className="mt-8 space-y-4">
        {/* ── 1. De scan ── */}
        <Vraag`,
);

/* Blok twee opent voor vraag 5. */
zet(
  `      {/* ── 5. Conditie ── */}
      <Vraag`,
  `      </div>

      {/* ── Blok 2: wat je huid aankan ── */}
      <div className="mt-16">
        <Blokkop
          nummer="Deel 2"
          kop="Wat je huid aankan"
          zin="Deze vier gaan over grenzen. Retinol, zwangerschap, een gebruinde huid, neiging tot littekens: dingen die in de praktijk pas aan de balie boven tafel komen, en dan een afspraak kosten."
        />
      </div>

      <div className="mt-8 space-y-4">
        {/* ── 5. Conditie ── */}
        <Vraag`,
);

/* En sluiten na vraag 8, vlak voor de uitkomst. */
const naVraag8 = t.indexOf(`      </Vraag>`, t.indexOf("nummer={8}"));
if (naVraag8 === -1) mislukt.push("einde van vraag 8 niet gevonden");
else {
  const eind = naVraag8 + `      </Vraag>`.length;
  t = t.slice(0, eind) + `\n      </div>` + t.slice(eind);
}

writeFileSync(pad, t);
if (mislukt.length) {
  console.error("NIET GEVONDEN:\n" + mislukt.map((m) => " - " + m).join("\n"));
  process.exit(1);
}
console.log("ok");
