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
 *
 * MOBIEL — dit stond op één kolom onder elkaar en werd daarmee 462px hoog: zeventig
 * procent van een iPhone-scherm voor vier getallen, op elke pagina, direct onder de hero.
 * Nu twee bij twee met kleinere cijfers, wat neerkomt op ongeveer een kwart daarvan. Vanaf
 * md staan ze weer op één rij zoals ze bedoeld zijn.
 */

/**
 * Jaartallen krijgen geen duizendscheiding; aantallen wel, plus hun achtervoegsel.
 *
 * "Is dit een jaartal" werd eerder afgeleid uit het ontbreken van een achtervoegsel. Dat
 * hield stand tot het reviewaantal ook zonder plusje kwam te staan, en toen verscheen er
 * "3883" op elke pagina in plaats van "3.883". Nu staat het als vlag in de data.
 */
function formatteer(item: ProofStripItem): string {
  if (item.isJaartal) return String(item.value);
  return `${item.value.toLocaleString("nl-NL")}${item.suffix ?? ""}`;
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
      className={`bg-white px-5 sm:px-9 lg:px-[7.5vw] ${className}`.trim()}
      aria-label="Diba Clinics in cijfers"
    >
      <div className="mx-auto grid grid-cols-2 gap-px bg-[var(--g-100)] md:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="bg-white py-4 text-center md:py-7">
            <strong className="block text-xl tracking-[-.05em] text-[var(--g-700)] tabular-nums md:text-3xl md:tracking-[-.06em]">
              {formatteer(item)}
            </strong>
            <span className="diba-label mt-1 block text-[var(--t-muted)] md:mt-2">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
