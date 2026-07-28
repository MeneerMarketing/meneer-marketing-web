import type { Metadata } from "next";
import FigmaHomeApp from "@/components/figma/FigmaHomeApp";
import { HOME_FAQ_ITEMS } from "@/data/home-faq";
import { publicCopy } from "@/lib/copy-flags";
import { SchemaMarkup, faqSchema } from "@/lib/schema";
import { DIBA_CITAAT, DIBA_SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `${DIBA_SITE.name} | Huidkliniek Rotterdam`,
  description: DIBA_CITAAT,
};

/** Homepage = Figma Make export, wired aan DIBA-regels. */
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
      <FigmaHomeApp />
    </>
  );
}
