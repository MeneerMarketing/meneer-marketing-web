import type { Metadata } from "next";
import FigmaHomeApp from "@/components/figma/FigmaHomeApp";
import { HOME_FAQ_ITEMS } from "@/data/home-faq";
import { publicCopy } from "@/lib/copy-flags";
import { homeWensen } from "@/lib/home-wensen";
import { SchemaMarkup, faqSchema } from "@/lib/schema";
import { DIBA_SITE } from "@/lib/site";
import { zoekmachineVelden } from "@/lib/seo";

export const metadata: Metadata = zoekmachineVelden({
  pad: "/",
  titel: `Huidkliniek Rotterdam | ${DIBA_SITE.name}`,
  omschrijving:
    "Huidkliniek in Rotterdam. We meten je huid, leggen uit wat er in jouw geval mogelijk is en wat het oplevert. Prijzen vooraf online.",
});

/** Homepage = de schermvullende video-hero met de Figma-secties. */
export default function HomePage() {
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
      {/* De huidwensen met hun behandelingen worden hier, op de server, samengesteld en
          als kale props doorgegeven: de behandelingendata blijft uit de browser. */}
      {/* De schermvullende hero. Stond tot 11 september 2026 op een eigen route om te
          vergelijken; die route is weg sinds deze hier staat. */}
      <FigmaHomeApp hero="schermvullend" wensen={homeWensen()} />
    </>
  );
}
