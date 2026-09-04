/**
 * De taalkiezer in de topbalk.
 *
 * Alleen Nederlands is er. De andere drie staan er zichtbaar bij en zijn nog niet te
 * kiezen; dat is eerlijker dan ze verbergen en later toveren, en het laat meteen zien
 * welke kant het op gaat.
 *
 * Gebouwd op `details`/`summary` en niet op React-state. Dat werkt met toetsenbord en
 * muis zonder één regel JavaScript, en na de hydratieproblemen van deze week is een
 * bediening die ook zonder JavaScript werkt de veiligere keuze voor iets dat in elke
 * header staat.
 *
 * De vlagkleuren staan hier hard en niet in het tokenblok. Dat is bewust: het zijn geen
 * merkkleuren maar de kleuren van vier landsvlaggen, en die zijn niet aan onze huisstijl
 * aan te passen.
 */

type Taal = {
  readonly code: string;
  readonly naam: string;
  readonly actief?: true;
};

const TALEN: readonly Taal[] = [
  { code: "NL", naam: "Nederlands", actief: true },
  { code: "EN", naam: "English" },
  { code: "ES", naam: "Español" },
  { code: "FR", naam: "Français" },
];

function Vlag({ code }: { code: string }) {
  const gedeeld = {
    width: 20,
    height: 14,
    className: "shrink-0 rounded-[2px]",
  } as const;

  if (code === "NL") {
    return (
      <svg viewBox="0 0 20 14" {...gedeeld} aria-hidden="true">
        <rect width="20" height="14" fill="#fff" />
        <rect width="20" height="4.67" fill="#ae1c28" />
        <rect y="9.33" width="20" height="4.67" fill="#21468b" />
      </svg>
    );
  }
  if (code === "FR") {
    return (
      <svg viewBox="0 0 20 14" {...gedeeld} aria-hidden="true">
        <rect width="20" height="14" fill="#fff" />
        <rect width="6.67" height="14" fill="#002395" />
        <rect x="13.33" width="6.67" height="14" fill="#ed2939" />
      </svg>
    );
  }
  if (code === "ES") {
    return (
      <svg viewBox="0 0 20 14" {...gedeeld} aria-hidden="true">
        <rect width="20" height="14" fill="#c60b1e" />
        <rect y="3.5" width="20" height="7" fill="#ffc400" />
      </svg>
    );
  }
  // EN — vereenvoudigde Union Jack: de diagonalen zijn op 20 bij 14 toch niet leesbaar.
  return (
    <svg viewBox="0 0 20 14" {...gedeeld} aria-hidden="true">
      <rect width="20" height="14" fill="#012169" />
      <path d="M0 0l20 14M20 0L0 14" stroke="#fff" strokeWidth="2.6" />
      <path d="M10 0v14M0 7h20" stroke="#fff" strokeWidth="4.4" />
      <path d="M10 0v14M0 7h20" stroke="#c8102e" strokeWidth="2.4" />
    </svg>
  );
}

export default function Taalkiezer() {
  const huidig = TALEN[0];

  return (
    <details className="group relative">
      <summary className="diba-label flex h-9 cursor-pointer list-none items-center gap-2 rounded-[var(--r-pill)] px-2 text-[var(--t-label)] transition-colors hover:bg-[var(--g-100)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] [&::-webkit-details-marker]:hidden">
        <Vlag code={huidig.code} />
        {huidig.code}
        <svg
          viewBox="0 0 12 12"
          className="h-2.5 w-2.5 transition-transform group-open:rotate-180"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M2.5 4.5 6 8l3.5-3.5" />
        </svg>
      </summary>

      <ul className="absolute right-0 z-40 mt-2 w-48 overflow-hidden rounded-[var(--r-sm)] border border-[var(--g-100)] bg-white py-1 shadow-[var(--shadow-float)]">
        {TALEN.map((t) => (
          <li key={t.code}>
            <span
              className={`flex items-center gap-3 px-4 py-2.5 text-[14px] ${
                t.actief
                  ? "font-medium text-[var(--t-strong)]"
                  : "text-[var(--t-muted)]"
              }`}
            >
              <Vlag code={t.code} />
              {t.naam}
              {t.actief ? (
                <svg
                  viewBox="0 0 16 16"
                  className="ml-auto h-3.5 w-3.5 text-[var(--g-700)]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 8.5 6.5 12 13 4.5" />
                </svg>
              ) : (
                <span className="diba-label ml-auto text-[var(--t-muted)]">
                  Straks
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </details>
  );
}
