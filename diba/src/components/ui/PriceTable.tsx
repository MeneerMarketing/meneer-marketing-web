/**
 * DIBA PriceTable — referentie batch 2 (DIBA-RULES.md §8 prijs-componenten)
 * Altijd volledige prijzen, geen sterretjes-voetnoten met addertjes.
 * Trajectprijs naast losse prijs, termijnbedrag klein eronder ("of €62/mnd").
 * Cijfers tabular lining. Server component, semantische tabel.
 * Prijzen komen uit getypeerde data — NOOIT verzonnen ([PRIJS-NODIG] tot Okan levert).
 */

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
  /** Zichtbare titel boven de tabel, bv. "Laserontharing — prijzen" */
  caption: string;
  rows: PriceRow[];
};

const euro = new Intl.NumberFormat("nl-NL", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function fmtPrice(value: number | undefined): string | null {
  if (value === undefined) return null;
  if (value === 0) return "[PRIJS-NODIG]";
  return euro.format(value);
}

export default function PriceTable({ caption, rows }: PriceTableProps) {
  return (
    <table className="w-full border-collapse text-left">
      <caption className="pb-4 text-left text-xl font-medium tracking-[-.03em] text-[#17372a] md:text-2xl">
        {caption}
      </caption>
      <thead>
        <tr className="border-b border-[#dce8d9]">
          <th
            scope="col"
            className="py-3 pr-3 text-[11px] font-semibold uppercase tracking-[.1em] text-[#5d8166]"
          >
            Behandeling
          </th>
          <th
            scope="col"
            className="w-[22%] py-3 pr-3 text-right text-[11px] font-semibold uppercase tracking-[.1em] text-[#5d8166]"
          >
            Losse prijs
          </th>
          <th
            scope="col"
            className="w-[30%] py-3 text-right text-[11px] font-semibold uppercase tracking-[.1em] text-[#5d8166]"
          >
            Traject
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={`${row.name}-${i}`} className="border-b border-[#e8f0e4] align-top">
            <th
              scope="row"
              className="py-4 pr-3 text-[15px] font-normal leading-relaxed text-[#17372a]"
            >
              {row.name}
            </th>
            <td className="py-4 pr-3 text-right text-[15px] text-[#17372a] tabular-nums">
              {(() => {
                const p = fmtPrice(row.single);
                if (p === null) {
                  return <span className="text-[13px] text-[#9ab09a]">n.v.t.</span>;
                }
                return p.startsWith("[") ? (
                  <span className="text-[13px] text-[#5f7765]">{p}</span>
                ) : (
                  p
                );
              })()}
            </td>
            <td className="py-4 text-right tabular-nums">
              {row.traject ? (
                <>
                  <span className="text-[15px] font-medium text-[#17372a]">
                    {(() => {
                      const p = fmtPrice(row.traject.price);
                      return p?.startsWith("[") ? (
                        <span className="text-[13px] font-normal text-[#5f7765]">{p}</span>
                      ) : (
                        p
                      );
                    })()}
                  </span>
                  {row.traject.sessions ? (
                    <span className="text-[13px] text-[#5f7765]">
                      {" "}
                      ({row.traject.sessions})
                    </span>
                  ) : null}
                  {row.traject.perMonth !== undefined ? (
                    <span className="block text-[13px] leading-relaxed text-[#5f7765]">
                      {(() => {
                        const p = fmtPrice(row.traject?.perMonth);
                        return p?.startsWith("[") ? p : `of ${p}/mnd`;
                      })()}
                    </span>
                  ) : null}
                </>
              ) : (
                <span className="text-[13px] text-[#9ab09a]">n.v.t.</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
