import type { Metadata } from "next";
import Link from "next/link";
import HeroVariant from "@/components/hero-variant/HeroVariant";
import Label from "@/components/ui/Label";

/**
 * Voorbeeldroute voor de hero-variant.
 *
 * Staat los van `/` zodat de bestaande homepage onaangeroerd blijft. Bevalt deze opzet,
 * dan verhuist HeroVariant naar de homepage; bevalt hij niet, dan gaat deze map weg en is
 * er niets veranderd.
 *
 * Alleen het bovenste deel van de pagina staat hier. De rest van de homepage zit in
 * FigmaHomeApp en hoort daar; die eerst uit elkaar trekken zou precies het risico
 * introduceren dat deze route juist vermijdt.
 */

export const metadata: Metadata = {
  title: "Hero-variant (voorbeeld)",
  robots: { index: false, follow: false },
};

export default function HomeVariantPage() {
  return (
    <main className="figma-home bg-white text-[var(--t-strong)]">
      <HeroVariant />

      <section className="mx-auto max-w-[1800px] px-5 pb-24 sm:px-9 lg:px-[7.5vw]">
        <div className="rounded-[var(--r-md)] bg-[var(--g-050)] p-7 sm:p-10">
          <Label>Alleen ter beoordeling</Label>
          <h2 className="diba-display-s mt-4 max-w-[24ch]">
            Dit is een voorbeeld,
            <br />
            <span className="diba-accent">geen vervanging.</span>
          </h2>
          <p className="mt-5 max-w-[64ch] text-[16px] leading-7 text-[var(--t-body)]">
            De bestaande homepage staat er nog precies zoals hij was. Vind je deze opzet
            beter, dan zetten we hem daar neer; vind je van niet, dan gaat deze pagina weg
            en is er niets gebeurd.
          </p>
          <ul className="mt-7 space-y-2 text-[15px] leading-7 text-[var(--t-body)]">
            <li>
              De waardering staat linksboven met de bron erbij en linkt naar Salonized.
            </li>
            <li>
              De taalkiezer toont vier talen; alleen Nederlands is er, de rest staat als
              &quot;straks&quot; aangemerkt.
            </li>
            <li>
              Het Salonized-beeldmerk ontbreekt nog. Zolang dat er niet is staat de naam
              er als woord, want een verzonnen logo is erger dan geen logo.
            </li>
            <li>Wie de medische inhoud nakijkt moet nog worden vastgelegd.</li>
          </ul>
          <Link
            href="/"
            className="diba-label mt-8 inline-block text-[var(--g-700)] underline underline-offset-4"
          >
            Naar de huidige homepage
          </Link>
        </div>
      </section>
    </main>
  );
}
