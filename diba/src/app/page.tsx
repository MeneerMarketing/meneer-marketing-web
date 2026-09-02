import type { Metadata } from "next";
import FigmaHomeApp from "@/components/figma/FigmaHomeApp";
import { HOME_FAQ_ITEMS } from "@/data/home-faq";
import { publicCopy } from "@/lib/copy-flags";
import { SchemaMarkup, faqSchema } from "@/lib/schema";
import { DIBA_SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: `Huidkliniek Rotterdam | ${DIBA_SITE.name}`,
  description:
    "Huidkliniek in Hillegersberg, Rotterdam. Advies over huidverbetering en laserontharing, en wat in jouw situatie wel of niet zinvol is.",
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
