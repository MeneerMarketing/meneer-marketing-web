import type { Metadata } from "next";
import ContentPageTemplate from "@/components/templates/ContentPageTemplate";
import { DIBA_CITAAT } from "@/lib/site";
import { PAGE_DEFAULTS } from "@/lib/page-defaults";

export const metadata: Metadata = {
  title: "Over ons",
  description: DIBA_CITAAT,
};

export default function OverOnsPage() {
  return (
    <ContentPageTemplate
      h1="Over *Diba* Clinics"
      intro={DIBA_CITAAT}
      breadcrumbLabel="Over ons"
      breadcrumbPath="/over-ons"
      secties={[
        {
          kop: "Wat ons *anders* maakt",
          alineas: [
            "[COPY-NODIG: over-ons paragraaf 2]",
            "[COPY-NODIG: over-ons paragraaf 3] [MENSELIJKE-ZIN]",
          ],
        },
        {
          kop: "Rotterdam, *Hillegersberg*",
          alineas: [
            "[COPY-NODIG: locatie en bereikbaarheid]",
            "Weissenbruchlaan 166, 3054 HG Rotterdam",
          ],
        },
      ]}
      primaireCta={{ label: "Start uw intake (4 min)", href: "/intake" }}
      {...PAGE_DEFAULTS}
    />
  );
}
