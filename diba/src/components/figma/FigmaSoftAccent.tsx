import DibaLeafMark from "@/components/ui/DibaLeafMark";

type FigmaSoftAccentProps = {
  /** traject = lichte sectie · clinic = groene fotokaart · cta = donkergroene band */
  variant: "traject" | "clinic" | "cta";
  className?: string;
};

/**
 * Het merkaccent op grote vlakken: het Diba-blad, groot en aangesneden door de rand.
 *
 * Verving de blur-orbs met ringen en losse stippen. Die lazen als toevallige vormen in
 * plaats van als merk, en decoratieve verlopen zijn sowieso verboden (§2).
 *
 * Twee dingen zijn hier doorgerekend en niet op gevoel gekozen:
 *
 * - **Dekking.** Tekst over een blad-watermerk zakt snel onder WCAG AA: op de
 *   donkergroene band haalt de bodytekst zelfs bij 12% blad nog maar 4,14:1. Daarom
 *   staat het blad in de vrije ruimte, en zijn de tonen zo gekozen dat een beetje
 *   overlap de tekst nooit onder de norm duwt.
 * - **Aansnijding.** Bij meer dan ongeveer een kwart eraf herken je de vorm niet meer
 *   en leest het als een vlek. Dat was precies wat er mis was met de oude decoratie.
 *
 * De rotatie is 180° gedraaid ten opzichte van het logo: zo wijst de punt het vlak in
 * en wordt de ronde voet aangesneden, in plaats van andersom. De punt is het scherpste
 * deel van de vorm — die hoort zichtbaar te zijn, niet weggesneden door de rand.
 */

const varianten = {
  // Lichte sectie: rechtsboven, in de ruimte boven de alinea. Heel bleek, want daar mag
  // tekst overheen vallen zonder dat het contrast zakt (getoetst op 100% overlap).
  traject:
    "pointer-events-none absolute -right-10 -top-10 h-[240px] w-[240px] rotate-[188deg] text-[var(--g-050)] sm:-right-12 sm:h-[300px] sm:w-[300px] lg:h-[340px] lg:w-[340px]",
  // Groene fotokaart: rechtsboven, weg van de tekst linksonder.
  clinic:
    "pointer-events-none absolute -right-10 -top-8 h-[200px] w-[200px] rotate-[188deg] text-white/25 sm:-right-12 sm:h-[260px] sm:w-[260px] lg:h-[300px] lg:w-[300px]",
  // Donkergroene band: een blad dat dieper is dan het vlak, als reliëf. Dat is hier de
  // veilige kant op — een donkerder blad tilt het tekstcontrast juist omhoog (wit gaat
  // van 6,58 naar 7,06), waar een lichter blad het onder de norm duwt.
  // Het blad stak nauwelijks uit: op -top-12 hing hij binnen de band en las hij als een
  // vlek in de hoek in plaats van als een vorm die van buiten het vlak binnenkomt. Nu is de
  // voet fors boven de rand getild, zodat je rechtsboven een blad ziet dat de band
  // binnendringt. De aansnijding blijft onder een kwart, want daarboven herken je de vorm
  // niet meer. Verhouding blijft gelijk: verder omhoog gaat gelijk op met verder naar rechts.
  cta: "pointer-events-none absolute -right-16 -top-28 h-[240px] w-[240px] rotate-[188deg] text-[var(--g-800)]/45 sm:-right-20 sm:-top-36 sm:h-[320px] sm:w-[320px] lg:-right-24 lg:-top-44 lg:h-[400px] lg:w-[400px]",
} as const;

export default function FigmaSoftAccent({
  variant,
  className = "",
}: FigmaSoftAccentProps) {
  return (
    <DibaLeafMark className={`${varianten[variant]} ${className}`.trim()} />
  );
}
