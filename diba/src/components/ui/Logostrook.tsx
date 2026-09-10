import { LOGOSTROOK } from "@/data/team";

/**
 * De logo's van de verenigingen en registers waar Diba bij hoort.
 *
 * Yasin, 9 september 2026: de site mist de logo's van NVH, ANBOS, SKIN Register en het
 * Kwaliteitsregister Paramedici, "zodat we echt professioneel ogen". Ze staan onderaan
 * elke pagina in de voettekst en op de registratiepagina bij de kaarten.
 *
 * WAAROM ZE BIJ ELKAAR STAAN EN NIET OVER DE BREEDTE.
 *
 * Ze stonden eerst in zes even brede vakken over de hele voettekst. Op een breed scherm gaf
 * dat honderdvijftig punten lucht tussen elk logo, en dan lijkt het geen rij maar zes losse
 * plaatjes. Yasin, 10 september 2026: "veel te gespreid, kun je dat niet centreren en met
 * minder witruimte ertussen?" Dus nu een rij die zichzelf midden onder de voettekst zet,
 * met een vaste afstand tussen de logo's die niet meegroeit met het scherm.
 *
 * OP EEN TELEFOON DRIE EN DRIE.
 *
 * Boven de drie brede woordmerken (NVH, ZorgkaartNederland, ANBOS), daaronder de drie ronde
 * tekens. Die volgorde staat in de gegevens, niet hier. Zo begint elke rij met eenzelfde
 * soort merk in plaats van een postzegel naast een banier.
 *
 * EVEN HOOG IS NIET EVEN GROOT.
 *
 * De hoogte per merk staat in `hoogte` (`data/team.ts`) en houdt het bedekte vlak ongeveer
 * gelijk: een breed woordmerk staat lager dan een rond zegel, anders wordt het ene een
 * banier en het andere een knikker. Alle merken hangen aan dezelfde middellijn, want een
 * rij logo's leest als een rij zodra hun harten op één hoogte staan.
 *
 * Grijs in rust en in kleur bij aanwijzen: zes merken in zes kleuren onder elke pagina
 * zouden de voettekst een reclameblok maken. Geen doorzichtigheid erbovenop, want het zegel
 * van het SKIN Register is oranje en werd daarmee een vlek. Elk logo linkt naar het
 * register zelf, want een keurmerk dat je niet kunt nakijken is een plaatje.
 *
 * Gewone `img` en geen next/image: statische SVG's en kleine PNG's uit de eigen map, en
 * SVG via next/image vraagt om `dangerouslyAllowSVG`. Zie ook VerzekeraarLogo.
 */
export default function Logostrook({ className = "" }: { className?: string }) {
  return (
    <ul
      className={`mx-auto grid max-w-[22rem] grid-cols-3 items-center justify-items-center gap-x-6 gap-y-6 sm:max-w-none sm:flex sm:flex-wrap sm:justify-center sm:gap-x-12 sm:gap-y-8 ${className}`.trim()}
    >
      {LOGOSTROOK.map((l) => (
        <li key={l.naam} className="flex justify-center">
          <a
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            title={l.naam}
            /* Een vak van vaste hoogte en minstens even breed, met het logo in het
               midden: daardoor hangen alle merken aan dezelfde lijn en is het aanraakdoel
               overal even groot. De ondergrens in de breedte is er ook voor het moment
               waarop het plaatje nog niet geladen is: zonder die grens krimpt de link dan
               tot een paar punten en valt er niet op te tikken. */
            className="flex h-14 min-w-14 items-center justify-center rounded-[var(--r-sm)] px-1 grayscale transition-[filter] duration-300 hover:grayscale-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--g-700)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={l.logo}
              alt={l.naam}
              /* `object-contain` naast een vaste hoogte: in een smal vak krimpt het logo
                 mee in plaats van uitgerekt te worden. */
              className="max-w-full object-contain"
              style={{ height: l.hoogte }}
              loading="lazy"
            />
          </a>
        </li>
      ))}
    </ul>
  );
}
