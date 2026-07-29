import type { ProofStripItem } from "@/lib/site";

/**
 * De bewijsstrip (DIBA-RULES §8 en §11).
 *
 * "Eén vaste vorm, overal identiek" — daarom staat de opmaak hier en niet per pagina.
 * De homepage had de vier cijfers als hardgecodeerde strings staan, en de acnepagina
 * rende de ruwe getallen uit `site.ts` zonder plus en zonder duizendscheiding: "8000"
 * in plaats van "8.000+". Dat is precies wat §11 verbiedt.
 *
 * De vier waarden zijn canoniek en komen altijd uit `site.ts`. Nooit een cijfer hier
 * intypen, nooit afronden naar vaagheid.
 */

/** Jaartallen krijgen geen duizendscheiding; aantallen wel, plus hun achtervoegsel. */
function formatteer(item: ProofStripItem): string {
  if (!item.suffix) return String(item.value);
  return `${item.value.toLocaleString("nl-NL")}${item.suffix}`;
}

export default function ProofBar({
  items,
  className = "",
}: {
  items: readonly ProofStripItem[];
  className?: string;
}) {
  return (
    <section
      className={`border-y border-[var(--g-100)] bg-white px-5 sm:px-9 lg:px-[7.5vw] ${className}`.trim()}
      aria-label="Diba Clinics in cijfers"
    >
      <div className="mx-auto grid max-w-[1800px] divide-y divide-[var(--g-100)] md:grid-cols-4 md:divide-x md:divide-y-0">
        {items.map((item) => (
          <div key={item.label} className="py-7 text-center">
            <strong className="block text-3xl tracking-[-.06em] text-[var(--g-700)] tabular-nums">
              {formatteer(item)}
            </strong>
            <span className="diba-label mt-2 block text-[var(--t-muted)]">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
