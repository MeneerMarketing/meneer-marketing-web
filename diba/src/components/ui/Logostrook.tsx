import { LOGOSTROOK } from "@/data/team";

/**
 * De logo's van de verenigingen en registers waar Diba bij hoort.
 *
 * Yasin, 9 september 2026: de site mist de logo's van NVH, ANBOS, SKIN Register en het
 * Kwaliteitsregister Paramedici, "zodat we echt professioneel ogen". Ze staan onderaan
 * elke pagina in de voettekst en op de registratiepagina bij de kaarten.
 *
 * Grijs in rust en in kleur bij aanwijzen: zes merken in zes kleuren onder elke pagina
 * zouden de voettekst een reclameblok maken. Elk logo linkt naar het register zelf, want
 * een keurmerk dat je niet kunt nakijken is een plaatje.
 *
 * Gewone `img` en geen next/image: statische SVG's en kleine PNG's uit de eigen map, en
 * SVG via next/image vraagt om `dangerouslyAllowSVG`. Zie ook VerzekeraarLogo.
 */
export default function Logostrook({ className = "" }: { className?: string }) {
  return (
    <ul
      className={`flex flex-wrap items-center gap-x-9 gap-y-5 ${className}`.trim()}
    >
      {LOGOSTROOK.map((l) => (
        <li key={l.naam}>
          <a
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            title={l.naam}
            className="inline-flex items-center gap-3 opacity-75 grayscale transition-[opacity,filter] duration-300 hover:opacity-100 hover:grayscale-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--g-700)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={l.logo}
              alt={l.naam}
              className={`w-auto ${l.hoog ? "h-10" : "h-7"}`}
              loading="lazy"
            />
            {l.tekst ? (
              <span className="diba-label text-[var(--t-muted)]">
                {l.tekst}
              </span>
            ) : null}
          </a>
        </li>
      ))}
    </ul>
  );
}
