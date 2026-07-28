import type { Metadata } from "next";
import ContentPageTemplate from "@/components/templates/ContentPageTemplate";
import { PAGE_DEFAULTS } from "@/lib/page-defaults";

export const metadata: Metadata = {
  title: "Werken bij Diba",
  description: "[COPY-NODIG]",
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
