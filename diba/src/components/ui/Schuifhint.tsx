/**
 * De regel boven een blok dat op een telefoon opzij schuift.
 *
 * Yasin, 10 september 2026, over de bewaartabel: "je ziet niet dat je kan swipen naar
 * rechts." Dat gold voor drie blokken op de site. Bij de bewaartermijnen kon de tabel
 * weg en zijn het blokken onder elkaar geworden; het nazorgrooster en de dieptevergelijker
 * zijn een raster van rijen tegen kolommen, en dat valt niet in blokken uiteen zonder dat
 * je de vergelijking kwijtraakt. Die schuiven dus wel, en dan hoort er te staan dat dat kan.
 *
 * Alleen onder `sm`, want daarboven past het gewoon en is de regel onzin.
 */
export default function Schuifhint({ wat }: { wat: string }) {
  return (
    <p className="diba-label mt-4 flex items-center gap-2 text-[var(--t-muted)] sm:hidden">
      <span aria-hidden="true">↔</span>
      Schuif {wat} opzij om alles te zien
    </p>
  );
}
