import { readFileSync, writeFileSync } from "fs";

const mislukt = [];
function bewerk(pad, paren) {
  let t = readFileSync(pad, "utf8");
  for (const [van, naar] of paren) {
    if (!t.includes(van)) {
      mislukt.push(`${pad}: ${van.split("\n")[0].trim().slice(0, 50)}`);
      continue;
    }
    t = t.split(van).join(naar);
  }
  writeFileSync(pad, t);
}

/* ── 1. De huidtypering: vlag in de JSX, en vaste hexcodes ── */
bewerk("src/components/laser/LaserHuidtypeRing.tsx", [
  [
    `          GentleMax Pro kan veilig worden ingezet bij Fitzpatrick I tot VI. In
          de configurator kies je je type; wij stemmen fluence en koeling daarop
          af. [MEDISCHE-CHECK-ROJDA]`,
    `          {/* [MEDISCHE-CHECK-ROJDA]: de uitspraak over Fitzpatrick I tot VI. De vlag
              stond in de zin zelf en dus op het scherm. */}
          De Gentle Laser Pro-U werkt op Fitzpatrick I tot en met VI. In de
          configurator kies je je type; de energie en de koeling worden daarop
          afgestemd.`,
  ],
  ["#5f7765", "var(--t-muted)"],
  ["#dce8d9", "var(--g-100)"],
  ["#286943", "var(--g-700)"],
  ["#eff8ea", "var(--g-050)"],
  ["#95c592", "var(--g-300)"],
  ["#17372a", "var(--t-strong)"],
  ["#f2f7ef", "var(--g-025)"],
  ["#cbe5bf", "var(--g-200)"],
  ["#5d9564", "var(--t-label)"],
]);

/* ── 2. Het team: de naam liep niet door publicCopy, ook niet in de schema ── */
bewerk("src/components/templates/TeamTemplate.tsx", [
  [
    `      {leden.map((m) => (
        <SchemaMarkup
          key={m.slug}
          data={physicianSchema({
            name: m.name,`,
    `      {/* Alleen leden met een echte naam krijgen structured data.

          Hier ging \`[COPY-NODIG]\` als \`name\` de schema.org-blokken in, en dat is
          erger dan een placeholder op het scherm: dat publiceert een verzonnen
          zorgverlener naar zoekmachines. Geen naam betekent geen vermelding. */}
      {leden
        .filter((m) => publicCopy(m.name) !== "")
        .map((m) => (
        <SchemaMarkup
          key={m.slug}
          data={physicianSchema({
            name: publicCopy(m.name),`,
  ],
  [
    `            siteUrl,
          })}
        />
      ))}`,
    `            siteUrl,
          })}
        />
      ))}`,
  ],
  [
    `                  <h2 className="text-2xl font-medium tracking-[-.04em] text-[#17372a] md:text-3xl">
                    {m.name}
                  </h2>`,
    `                  <h2 className="text-2xl font-medium tracking-[-.04em] text-[#17372a] md:text-3xl">
                    {publicCopy(m.name, "Naam volgt")}
                  </h2>`,
  ],
  [
    `                      Boek bij {m.name.split(" ")[0]} <Arrow />`,
    `                      {publicCopy(m.name)
                        ? \`Boek bij \${publicCopy(m.name).split(" ")[0]}\`
                        : "Plan een afspraak"}{" "}
                      <Arrow />`,
  ],
]);

/* ── 3. De resultatengalerij: drie meetwaarden ongefilterd ── */
bewerk("src/components/ui/ResultatenGallery.tsx", [
  [`              sessions={item.sessions}`, `              sessions={publicCopy(item.sessions, "Volgt")}`],
  [`              skinType={item.skinType}`, `              skinType={publicCopy(item.skinType, "Volgt")}`],
]);

if (mislukt.length) {
  console.error("NIET GEVONDEN:\n" + mislukt.map((m) => " - " + m).join("\n"));
  process.exit(1);
}
console.log("ok");
