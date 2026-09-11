import type { Metadata } from "next";
import FigmaHomeApp from "@/components/figma/FigmaHomeApp";
import { HOME_FAQ_ITEMS } from "@/data/home-faq";
import { publicCopy } from "@/lib/copy-flags";
import { homeWensen } from "@/lib/home-wensen";
import { SchemaMarkup, faqSchema } from "@/lib/schema";
import { DIBA_SITE } from "@/lib/site";
import { zoekmachineVelden } from "@/lib/seo";

/**
 * De vergelijkingsroute voor de hero.
 *
 * Deze pagina is letterlijk de homepage met één ander bovenblok: de schermvullende video
 * met een doorschijnende balk en navigatie erover (Yasin, 11 september 2026). Alles
 * eronder is dezelfde component met dezelfde gegevens, zodat een vergelijking over de hero
 * gaat en nergens anders over.
 *
 * `noindex`, want twee routes met dezelfde inhoud horen niet allebei in Google.
 */
export const metadata: Metadata = {
  ...zoekmachineVelden({
    pad: "/home-variant",
    titel: `Hero-variant | ${DIBA_SITE.name}`,
    omschrijving:
      "Vergelijkingsroute: dezelfde homepage met een schermvullende video-hero.",
  }),
  robots: { index: false, follow: false },
};

export default function HomeVariantPage() {
  return (
    <>
      <SchemaMarkup
        data={faqSchema(
          HOME_FAQ_ITEMS.map((item) => ({
            question: item.question,
            answer: publicCopy(item.answer),
          })),
        )}
      />
      <FigmaHomeApp hero="schermvullend" wensen={homeWensen()} />
    </>
  );
}
