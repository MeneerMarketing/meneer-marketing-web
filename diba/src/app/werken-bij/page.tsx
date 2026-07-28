import type { Metadata } from "next";
import ContentPageTemplate from "@/components/templates/ContentPageTemplate";
import { PAGE_DEFAULTS } from "@/lib/page-defaults";
import { NOG_IN_AANBOUW } from "@/lib/pagina-af";

export const metadata: Metadata = {
  title: "Werken bij Diba",
  ...NOG_IN_AANBOUW,
};

export default function WerkenBijPage() {
  return (
    <ContentPageTemplate
      h1="Werken bij *Diba*"
      intro="[COPY-NODIG: werken-bij intro]"
      breadcrumbLabel="Werken bij"
      breadcrumbPath="/werken-bij"
      secties={[
        {
          alineas: [
            "[COPY-NODIG: vacatures en cultuur]",
            "[COPY-NODIG: sollicitatie-route]",
          ],
        },
      ]}
      {...PAGE_DEFAULTS}
    />
  );
}
