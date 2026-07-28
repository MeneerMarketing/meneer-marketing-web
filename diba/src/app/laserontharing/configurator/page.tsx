import type { Metadata } from "next";
import LaserConfiguratorTemplate from "@/components/templates/LaserConfiguratorTemplate";
import { SchemaMarkup, breadcrumbSchema } from "@/lib/schema";
import { PAGE_DEFAULTS } from "@/lib/page-defaults";

export const metadata: Metadata = {
  title: "Laserprijs berekenen",
  description:
    "Kies je zones en zie direct je laserprijs. GentleMax Pro, veilig voor elk huidtype. [COPY-NODIG]",
};

export default function LaserConfiguratorPage() {
  return (
    <>
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: PAGE_DEFAULTS.siteUrl },
          { name: "Laserontharing", url: `${PAGE_DEFAULTS.siteUrl}/laserontharing` },
          {
            name: "Laserprijs berekenen",
            url: `${PAGE_DEFAULTS.siteUrl}/laserontharing/configurator`,
          },
        ])}
      />
      <LaserConfiguratorTemplate whatsappHref={PAGE_DEFAULTS.whatsappHref} />
    </>
  );
}
