import type { Metadata } from "next";
import ContentPageTemplate from "@/components/templates/ContentPageTemplate";
import { PAGE_DEFAULTS } from "@/lib/page-defaults";
import { NOG_IN_AANBOUW } from "@/lib/pagina-af";

export const metadata: Metadata = {
  title: "Laserontharing",
  ...NOG_IN_AANBOUW,
};

export default function LaserontharingPage() {
  return (
    <ContentPageTemplate
      h1="Laserontharing, *jouw* prijs vooraf"
      intro="Kies je zones, zie direct je prijs en het aantal sessies. GentleMax Pro, veilig voor elk huidtype. [MEDISCHE-CHECK-ROJDA]"
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
      primaireCta={{ label: "Bereken je laserprijs", href: "/laserontharing/configurator" }}
      {...PAGE_DEFAULTS}
    />
  );
}
