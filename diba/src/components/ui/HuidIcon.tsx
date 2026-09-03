/**
 * De huidicoonset: de huid in doorsnede.
 *
 * WAAROM DEZE NAAST Icon.tsx STAAT EN ER NIET IN.
 *
 * Icon.tsx is gereedschap: pijlen, kruisjes, vinkjes. Twaalf bij twaalf betekenis, en je
 * leest ze niet, je gebruikt ze. Deze zijn iets anders. Het zijn kleine illustraties van
 * wat er in een huid gebeurt, en je kijkt er wél naar. Andere maat (48 in plaats van 24),
 * andere lijndikte, ander doel.
 *
 * Ze door elkaar zetten zou betekenen dat een pijltje en een haarzakje dezelfde
 * standaardinstellingen delen, en dan schuift op een dag de een mee met de ander.
 *
 * DE BEELDTAAL IS DIE VAN DE SITE ZELF.
 *
 * Elke icoon is een doorsnede: een horizontale huidlijn, en daaronder wat er speelt. Dat is
 * niet toevallig gekozen maar precies wat `HUIDLAGEN` in behandelingen.ts al doet, en wat
 * op de apparatuurpagina's het werkingsvenster tekent. Een porie die van opzij wordt
 * getoond hoort bij een site die uitlegt op welke diepte een behandeling werkt.
 *
 * Vandaar ook de twee dubbele lijntjes links en rechts in de meeste iconen: dat is de
 * opperhuid, en daar begint elk verhaal op deze site.
 *
 * TECHNISCH.
 *
 * currentColor, dus ze nemen de kleur van hun omgeving aan: mintgroen op wit, wit op een
 * groen vlak. Geen bestanden, geen extra verzoek, en scherp op elk scherm. Standaard
 * verborgen voor hulpsoftware, want in vrijwel elke plek waar ze staan zegt de tekst
 * ernaast al wat ze betekenen. Draagt een icoon op zichzelf betekenis, geef dan `label`
 * mee.
 *
 * Lijndikte 2 op een venster van 48 komt neer op dezelfde optische zwaarte als de 1.75 op
 * 24 in Icon.tsx. Onder de 32 pixels worden deze te druk; gebruik daar de gewone set.
 */

export type HuidIconProps = {
  className?: string;
  /** Pixelmaat. Standaard 48; onder de 32 worden ze te fijn. */
  size?: number;
  /** Zet een label als het icoon op zichzelf betekenis draagt. */
  label?: string;
};

function svgProps({ className, size = 48, label }: HuidIconProps) {
  return {
    className,
    width: size,
    height: size,
    viewBox: "0 0 48 48",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...(label
      ? { role: "img" as const, "aria-label": label }
      : { "aria-hidden": true as const, focusable: false as const }),
  };
}

/**
 * De opperhuid links en rechts van een porie.
 *
 * Vier lijntjes die in vijf van de acht iconen terugkomen. Ze staan hier één keer, want
 * zodra ze per icoon worden overgetypt lopen de lengtes uiteen en staat de huid op de ene
 * kaart twee pixels hoger dan op de andere.
 */
function Opperhuid() {
  return (
    <>
      <path d="M1.5 22.5h12.2" />
      <path d="M1.5 27.6h10.9" />
      <path d="M34.3 22.5h12.2" />
      <path d="M35.6 27.6h10.9" />
    </>
  );
}

/** De porie zelf: smalle hals, ronde bodem. De vorm waar alles in gebeurt. */
const PORIE =
  "M13.7 22.5c2.7 1.2 3.4 3.4 2.1 5.6-2 3.3-2 7.6.1 10.4 3.4 4.6 12.8 4.6 16.2 0 2.1-2.8 2.1-7.1.1-10.4-1.3-2.2-.6-4.4 2.1-5.6";

/* ── 1. Het haarzakje ──────────────────────────────────────────────────── */

/** Een haar die uit de wortel omhoog komt. Voor ontharen en ingegroeide haren. */
export function Haarzakje(props: HuidIconProps) {
  return (
    <svg {...svgProps(props)}>
      <Opperhuid />
      <path d={PORIE} />
      {/* De bol onderin is de haarwortel: waar licht bij ontharen op mikt. */}
      <circle cx="24" cy="34.5" r="6.4" />
      {/* De haar zelf, als één omtrek: omhoog, haakt naar rechts, en terug omlaag. */}
      <path d="M20.6 28.6C21 19 22.6 8.4 34.8 2.6c-5.4 5.6-7.4 16.2-6.4 26" />
    </svg>
  );
}

/* ── 2. De verstopte porie ─────────────────────────────────────────────── */

/** Een porie die is volgelopen. Voor onzuiverheden, mee-eters en grove poriën. */
export function VerstoptePorie(props: HuidIconProps) {
  return (
    <svg {...svgProps(props)}>
      <Opperhuid />
      <path d={PORIE} />
      {/* Talg en cellen, in verschillende maten: geen raster, want dan oogt het als een
          patroon in plaats van als iets dat is blijven liggen. */}
      <circle cx="18.4" cy="26.2" r="1" fill="currentColor" stroke="none" />
      <circle cx="28.6" cy="26" r="1" fill="currentColor" stroke="none" />
      <circle cx="24.2" cy="29.4" r="1" fill="currentColor" stroke="none" />
      <circle cx="18.1" cy="35.4" r="1" fill="currentColor" stroke="none" />
      <circle cx="22.5" cy="38" r="1" fill="currentColor" stroke="none" />
      <circle cx="19.2" cy="31" r="2.1" />
      <circle cx="29.2" cy="34.4" r="2.7" />
    </svg>
  );
}

/* ── 3. De huid die wordt gladgetrokken ────────────────────────────────── */

/** Een bult die naar buiten wordt gladgetrokken. Voor verslapping en lijnen. */
export function HuidStrakker(props: HuidIconProps) {
  return (
    <svg {...svgProps(props)}>
      {/* De pijlen wijzen naar buiten: de bult wordt vlak getrokken, niet samengeknepen. */}
      <path d="M16.8 7.8c-1.3 4.7-4.3 6.2-8.3 6.2" />
      <path d="M10.8 11.6 8 14l2.8 2.4" />
      <path d="M31.2 7.8c1.3 4.7 4.3 6.2 8.3 6.2" />
      <path d="M37.2 11.6 40 14l-2.8 2.4" />
      {/* De huid met een lichte welving erin. */}
      <path d="M1.5 20.2c7.5 0 14-2.6 22.5-2.6s15 2.6 22.5 2.6" />
      <path d="M1.5 25.4h45" />
      {/* De diepere lagen, in halfsteens verband zodat het weefsel oogt en geen liniaal. */}
      <path
        d="M1.5 31h3.4M9.6 31h7M23.1 31h6.7M35.5 31h6.6M46.5 31h0"
        strokeWidth="2.2"
      />
      <path
        d="M5.6 36.4h6.5M18.2 36.4h6.6M31 36.4h6.6M43.4 36.4h3.1"
        strokeWidth="2.2"
      />
      <path
        d="M1.5 41.8h3.4M9.6 41.8h7M23.1 41.8h6.7M35.5 41.8h6.6"
        strokeWidth="2.2"
      />
    </svg>
  );
}

/* ── 4. De porie met vocht ─────────────────────────────────────────────── */

/** Een druppel in de porie, met stralen erboven. Voor droge en vochtarme huid. */
export function PorieVocht(props: HuidIconProps) {
  return (
    <svg {...svgProps(props)}>
      <path d="M11.7 11.3 14.9 14" />
      <path d="M17.9 8.4v3.7" />
      <path d="M30.1 8.4v3.7" />
      <path d="M36.3 11.3 33.1 14" />
      <Opperhuid />
      <path d={PORIE} />
      {/* De druppel: punt omhoog, want hij zakt naar binnen en niet naar buiten. */}
      <path d="M24 20.6s-6.9 8.9-6.9 13.3a6.9 6.9 0 0 0 13.8 0c0-4.4-6.9-13.3-6.9-13.3Z" />
      <path d="M24 37.4a3.5 3.5 0 0 0 3.5-3.5" />
    </svg>
  );
}

/* ── 5. De huid die licht teruggeeft ───────────────────────────────────── */

/** Glans boven een gladde huid. Voor een doffe huid en gezichtsbehandelingen. */
export function HuidGlans(props: HuidIconProps) {
  return (
    <svg {...svgProps(props)}>
      {/* Drie glansjes op verschillende maat: gelijke maten lezen als een patroon, en
          glans is juist onregelmatig. */}
      <path d="M24 2.4c.7 2.6 1.4 3.3 4 4-2.6.7-3.3 1.4-4 4-.7-2.6-1.4-3.3-4-4 2.6-.7 3.3-1.4 4-4Z" />
      <path d="M36.6 9.6c1 3.6 1.9 4.6 5.5 5.5-3.6 1-4.6 1.9-5.5 5.5-1-3.6-1.9-4.6-5.5-5.5 3.6-1 4.6-1.9 5.5-5.5Z" />
      <path d="M9.4 13.6c.7 2.6 1.4 3.3 4 4-2.6.7-3.3 1.4-4 4-.7-2.6-1.4-3.3-4-4 2.6-.7 3.3-1.4 4-4Z" />
      <path d="M1.5 25.2h45" />
      {/* De golf: een huid die licht in één richting terugkaatst in plaats van verstrooit. */}
      <path d="M1.5 29.6c3.8 0 3.8 3.6 7.5 3.6s3.8-3.6 7.5-3.6 3.8 3.6 7.5 3.6 3.8-3.6 7.5-3.6 3.8 3.6 7.5 3.6 3.8-3.6 7.5-3.6" />
      <path
        d="M1.5 37.4h2.8M9.4 37.4h2.8M17.3 37.4h2.8M25.2 37.4h2.8M33.1 37.4h2.8M41 37.4h2.8"
        strokeWidth="2.2"
      />
      <path
        d="M5.4 42h2.8M13.3 42h2.8M21.2 42h2.8M29.1 42h2.8M37 42h2.8"
        strokeWidth="2.2"
      />
      <path
        d="M9.4 46.5h2.8M17.3 46.5h2.8M25.2 46.5h2.8M33.1 46.5h2.8"
        strokeWidth="2.2"
      />
    </svg>
  );
}

/* ── 6. Het bultje ─────────────────────────────────────────────────────── */

/** Iets dat boven de huid uitkomt. Voor steelwratjes, milia en bultjes. */
export function HuidBultje(props: HuidIconProps) {
  return (
    <svg {...svgProps(props)}>
      <path d="M12.4 10.3 16.6 12.8" />
      <path d="M24 3.4v4.2" />
      <path d="M35.6 10.3 31.4 12.8" />
      {/* De bult loopt vloeiend uit de huidlijn omhoog: het zit vast aan de huid en het
          ligt er niet op. */}
      <path d="M1.5 24.6h7.2c5 0 5.3-10.4 15.3-10.4s10.3 10.4 15.3 10.4h7.2" />
      <path d="M1.5 30.2h45" />
      <circle cx="6.4" cy="37.2" r="1.9" />
      <circle cx="18.4" cy="37.2" r="1.9" />
      <circle cx="30.4" cy="37.2" r="1.9" />
      <circle cx="42.4" cy="37.2" r="1.9" />
      <circle cx="12.4" cy="43.6" r="1.9" />
      <circle cx="24.4" cy="43.6" r="1.9" />
      <circle cx="36.4" cy="43.6" r="1.9" />
    </svg>
  );
}

/* ── 7. Het potje ──────────────────────────────────────────────────────── */

/** Verzorging: het enige icoon dat geen huid toont. Voor nazorg en producten. */
export function Cremepotje(props: HuidIconProps) {
  return (
    <svg {...svgProps(props)}>
      {/* Het deksel ernaast en niet erop: dit gaat over gebruiken, niet over kopen. */}
      <path d="M2.1 22.6 1 20.1a3.4 3.4 0 0 1 1.7-4.5L31.3 2.9a3.4 3.4 0 0 1 4.5 1.7l1.1 2.5Z" />
      <path d="M35 8 3.7 22.1" />
      {/* De crème zelf, als een geknepen krul. */}
      <path d="M21.5 24.4a3.6 3.6 0 0 1 3.6-3.4c3.4 0 5.1-1.7 5.1-5.1 3 2 4.9 5.2 5.1 8.5a3.6 3.6 0 0 1 3.6 3.4" />
      <path d="M15.5 24.4h29.1v6.2H15.5z" />
      <path d="M15.5 27.5h11.3" />
      <path d="M36.5 30.6h8.1" />
      {/* Het lichaam van het potje, met het etiket erin uitgespaard. */}
      <path d="M12.5 30.6h34.4v9.6a5.9 5.9 0 0 1-5.9 5.9H18.4a5.9 5.9 0 0 1-5.9-5.9z" />
      <path d="M25.6 35.5h21.3v7.4H25.6z" />
    </svg>
  );
}

/* ── 8. De pincet ──────────────────────────────────────────────────────── */

/** Een haar die wordt uitgetrokken. Voor epileren, en waarom dat niet altijd slim is. */
export function PincetHaar(props: HuidIconProps) {
  return (
    <svg {...svgProps(props)}>
      {/* De pincet: twee benen, een band eromheen, en de punt die de haar vastheeft. */}
      <path d="M17.3 4.3 18.6 18" />
      <path d="M30.7 4.3 29.4 18" />
      <path d="M17.6 18.2h12.8a1.4 1.4 0 0 1 1.4 1.4v3.1a1.4 1.4 0 0 1-1.4 1.4H17.6a1.4 1.4 0 0 1-1.4-1.4v-3.1a1.4 1.4 0 0 1 1.4-1.4Z" />
      <path d="M18.6 24.1c0 3 2.4 4.6 5.4 4.6s5.4-1.6 5.4-4.6" />
      {/* De huid trekt mee omhoog waar de haar vandaan komt: dat is waarom het pijn doet
          en waarom er een kuiltje van kan overblijven. */}
      <path d="M20.6 28.2c-6.6 1-13.2 3.1-17.4 4.2A3.6 3.6 0 0 0 .8 35.9v6" />
      <path d="M27.4 28.2c6.6 1 13.2 3.1 17.4 4.2a3.6 3.6 0 0 1 2.4 3.5v6" />
      <path d="M.8 35.9c6.4-1.8 11.6-2.9 16.6-2" />
      <path d="M20.9 33.2c1 4.5 1.2 9.1 1.1 13.6" />
      <path d="M27.1 33.2c-1 4.5-1.2 9.1-1.1 13.6" />
      <path d="M24 28.7v18.1" />
      {/* De haarzakjes eromheen, die gewoon blijven zitten. */}
      <path d="M4.6 33.8 7 37.6v5.3" />
      <path d="M11.4 38.6l2.2 2.2v2.1" />
      <path d="M34.4 33.8l2.4 3.8v5.3" />
      <path d="M43.4 33.8 41 37.6v5.3" />
      <path d="M38.6 38.6l2.2-2.2" />
    </svg>
  );
}

/**
 * De set als lijst, voor plekken die er doorheen willen lopen.
 *
 * De sleutel is beschrijvend en niet de paginanaam: een porie met een druppel hoort bij een
 * droge huid én bij vochtarm én bij hydrateren, en als de sleutel "droge-huid" heette zou
 * hergebruik ergens anders vreemd aanvoelen.
 */
export const HUIDICONEN = {
  haarzakje: Haarzakje,
  "verstopte-porie": VerstoptePorie,
  "huid-strakker": HuidStrakker,
  "porie-vocht": PorieVocht,
  "huid-glans": HuidGlans,
  "huid-bultje": HuidBultje,
  cremepotje: Cremepotje,
  "pincet-haar": PincetHaar,
} as const;

export type HuidIconNaam = keyof typeof HUIDICONEN;

/**
 * Waarom hier geen tweede set staat.
 *
 * Er stonden hier zestien iconen die ik erbij had getekend, in dezelfde taal maar niet uit
 * de set die Yasin aanleverde. Zijn reactie was kort: hij had een iconenpakket gestuurd en
 * wilde dat dát pakket vaker terugkwam, niet dat er een tweede naast kwam te staan.
 *
 * Ze werden bovendien nergens gebruikt: nul aanroepen in de hele site. Zestien ongebruikte
 * componenten die eruitzien alsof ze bij het merk horen zijn erger dan geen, want de
 * volgende die hier komt kan niet zien welke acht de echte zijn.
 *
 * De acht hierboven zijn de set. De sleutels beschrijven wat er te zien is en niet bij welke
 * pagina ze horen, juist zodat één icoon op meerdere plekken kan staan: een porie met een
 * druppel hoort bij een droge huid, bij vochtarm en bij hydrateren.
 */

/**
 * Het icoon op naam, zodat data een sleutel kan dragen in plaats van een component.
 *
 * De set werd tot nu toe altijd rechtstreeks aangeroepen: `<VerstoptePorie />`. Dat werkt op
 * een pagina, maar niet in een lijst waar per item een ander icoon hoort. Daar moet de data
 * kunnen zeggen wélk icoon, en dat kan alleen met een sleutel.
 *
 * Vandaar deze: hij zoekt de sleutel op in de set en tekent hem. Staat de sleutel er niet,
 * dan tekent hij niets in plaats van te breken — een ontbrekend icoon mag nooit een pagina
 * meenemen.
 */
export default function HuidIcon({
  naam,
  ...props
}: HuidIconProps & { naam: HuidIconNaam }) {
  const Icoon = HUIDICONEN[naam];
  if (!Icoon) return null;
  return <Icoon {...props} />;
}
