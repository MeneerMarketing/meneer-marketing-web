import type { Metadata } from "next";
import ContentPageTemplate from "@/components/templates/ContentPageTemplate";
import { PAGE_DEFAULTS } from "@/lib/page-defaults";

export const metadata: Metadata = {
  title: "Laserontharing",
  description: "[COPY-NODIG]",
};

export default function LaserontharingPage() {
  return (
    <ContentPageTemplate
      h1="Laserontharing, *uw* prijs vooraf"
      intro="Kies uw zones, zie direct uw prijs en het aantal sessies. GentleMax Pro, veilig voor elk huidtype. [MEDISCHE-CHECK-ROJDA]"
      breadcrumbLabel="Laserontharing"
      breadcrumbPath="/laserontharing"
      secties={[
        {
          kop: "Hoe het *werkt*",
          alineas: ["[COPY-NODIG: laserontharing uitleg]"],
        },
        {
          kop: "Prijzen",
          alineas: [
            "[PRIJS-NODIG]",
            "Gebruik de configurator voor een persoonlijke prijsopbouw.",
          ],
        },
      ]}
      primaireCta={{ label: "Bereken uw laserprijs", href: "/laserontharing/configurator" }}
      {...PAGE_DEFAULTS}
    />
  );
}
