export type PriceRow = {
  name: string;
  /** Losse prijs in euro's; weglaten als alleen traject bestaat */
  single?: number;
  traject?: {
    price: number;
    /** bv. "5 sessies" — toont context bij de trajectprijs */
    sessions?: string;
    /** maandbedrag bij termijnbetaling */
    perMonth?: number;
  };
};

export type PriceTableProps = {
  /** Zichtbare titel boven de tabel, bv. "Laserontharing, gelaat" */
  caption: string;
  rows: PriceRow[];
};

const euro = new Intl.NumberFormat("nl-NL", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/**
 * Nul betekent "nog niet bekend" en nooit "gratis".
 *
 * Hier stond letterlijk "[PRIJS-NODIG]", en dat verscheen dus op het scherm van iedereen
 * die de prijzenpagina opende. Vlaggen horen in de broncode, niet in beeld. De code die
 * daarop controleerde (`p.startsWith("[")`) is meeverdwenen: die kon na die fix niets
 * meer vinden, en dode takken die op een opgelost probleem wachten lezen als een
 * waarschuwing die er niet meer is.
 */
function fmtPrice(value: number | undefined): string | null {
  if (value === undefined) return null;
  if (value === 0) return "Nog niet bekend";
  return euro.format(value);
}

export default function PriceTable({ caption, rows }: PriceTableProps) {
  /**
   * De trajectkolom staat er alleen als er iets in staat.
   *
   * De kliniek publiceert geen trajectprijzen, dus na het overnemen van de echte tarieven
   * stond er tweeënzestig keer "n.v.t." onder een kop die nergens naar verwees. Een lege
   * kolom is niet neutraal: hij suggereert dat er een traject bestaat dat wij niet willen
   * noemen. Komen ze er, dan verschijnt de kolom vanzelf weer.
   */
  const heeftTraject = rows.some((r) => r.traject);

  return (
    <table className="w-full border-collapse text-left">
      <caption className="pb-4 text-left text-xl font-medium tracking-[-.03em] text-[var(--t-strong)] md:text-2xl">
        {caption}
      </caption>
      <thead>
        <tr>
          <th
            scope="col"
            className="py-3 pr-3 text-[11px] font-semibold tracking-[.1em] text-[var(--t-label)] uppercase"
          >
            Behandeling
          </th>
          <th
            scope="col"
            className="w-[30%] py-3 pr-3 text-right text-[11px] font-semibold tracking-[.1em] text-[var(--t-label)] uppercase"
          >
            Per sessie
          </th>
          {heeftTraject ? (
            <th
              scope="col"
              className="w-[30%] py-3 text-right text-[11px] font-semibold tracking-[.1em] text-[var(--t-label)] uppercase"
            >
              Traject
            </th>
          ) : null}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          /* Om en om gevuld in plaats van een lijntje onder elke regel.
             Vijfentachtig regels met een streepje eronder geven vijfentachtig lijnen op
             een pagina waar deze huisstijl er nul voert, en ze maken de lijst bovendien
             hoger dan nodig. Een zebra leest bij een prijslijst net zo goed, want je oog
             volgt de rij en niet de scheiding. */
          <tr
            key={`${row.name}-${i}`}
            className={`align-top ${i % 2 === 1 ? "bg-[var(--g-025)]" : ""}`}
          >
            <th
              scope="row"
              className="rounded-l-[var(--r-sm)] py-3 pr-3 pl-4 text-[15px] leading-6 font-normal text-[var(--t-strong)]"
            >
              {row.name}
            </th>
            <td className="py-3 pr-3 text-right text-[15px] leading-6 text-[var(--t-strong)] tabular-nums">
              {fmtPrice(row.single) ?? (
                <span className="text-[13px] text-[var(--t-muted)]">
                  n.v.t.
                </span>
              )}
            </td>
            {heeftTraject ? (
              <td className="rounded-r-[var(--r-sm)] py-3 pr-4 text-right leading-6 tabular-nums">
                {row.traject ? (
                  <>
                    <span className="text-[15px] font-medium text-[var(--t-strong)]">
                      {fmtPrice(row.traject.price)}
                    </span>
                    {row.traject.sessions ? (
                      <span className="text-[13px] text-[var(--t-muted)]">
                        {" "}
                        ({row.traject.sessions})
                      </span>
                    ) : null}
                    {row.traject.perMonth !== undefined ? (
                      <span className="block text-[13px] leading-relaxed text-[var(--t-muted)]">
                        of {fmtPrice(row.traject.perMonth)} per maand
                      </span>
                    ) : null}
                  </>
                ) : (
                  <span className="text-[13px] text-[var(--t-muted)]">
                    n.v.t.
                  </span>
                )}
              </td>
            ) : null}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
