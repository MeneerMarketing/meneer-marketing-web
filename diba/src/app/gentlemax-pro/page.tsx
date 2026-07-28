import type { Metadata } from "next";
import ContentPageTemplate from "@/components/templates/ContentPageTemplate";
import { PAGE_DEFAULTS } from "@/lib/page-defaults";

export const metadata: Metadata = {
  title: "GentleMax Pro",
  description: "[COPY-NODIG]",
};

export default function GentleMaxProPage() {
  return (
    <ContentPageTemplate
      h1="GentleMax Pro: het *bewijs*"
      intro="[COPY-NODIG: GentleMax Pro intro, veilig voor elk huidtype Fitzpatrick I-VI] [MEDISCHE-CHECK-ROJDA]"
      breadcrumbLabel="GentleMax Pro"
      breadcrumbPath="/gentlemax-pro"
      secties={[
        {
          kop: "Waarom dit *apparaat*",
          alineas: ["[COPY-NODIG] [MEDISCHE-CHECK-ROJDA]"],
        },
        {
          kop: "Voor *laserontharing*",
          alineas: [
            "[COPY-NODIG]",
            "Bereken uw prijs via de configurator.",
          ],
        },
      ]}
      primaireCta={{ label: "Bereken uw laserprijs", href: "/laserontharing/configurator" }}
      {...PAGE_DEFAULTS}
    />
  );
}
