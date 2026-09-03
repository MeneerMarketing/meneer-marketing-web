import type { Metadata } from "next";
import FigmaHomeApp from "@/components/figma/FigmaHomeApp";
import { HOME_FAQ_ITEMS } from "@/data/home-faq";
import { publicCopy } from "@/lib/copy-flags";
import { SchemaMarkup, faqSchema } from "@/lib/schema";
import { DIBA_SITE } from "@/lib/site";
import { zoekmachineVelden } from "@/lib/seo";

export const metadata: Metadata = zoekmachineVelden({
  pad: "/",
  titel: `Huidkliniek Rotterdam | ${DIBA_SITE.name}`,
  omschrijving:
    "Huidkliniek in Hillegersberg, Rotterdam. We meten je huid, leggen uit wat er in jouw geval mogelijk is en wat het oplevert. Prijzen vooraf online.",
});

/** Homepage = hero-variant met achtergrondvideo + Figma-secties. */
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
      <FigmaHomeApp heroVariant />
    </>
  );
}
