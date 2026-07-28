import type { Metadata } from "next";
import DoelgroepHubTemplate from "@/components/templates/DoelgroepHubTemplate";
import { PAGE_DEFAULTS } from "@/lib/page-defaults";
import { NOG_IN_AANBOUW } from "@/lib/pagina-af";

export const metadata: Metadata = {
  title: "Doelgroepen",
  ...NOG_IN_AANBOUW,
};

export default function DoelgroepHubPage() {
  return <DoelgroepHubTemplate siteUrl={PAGE_DEFAULTS.siteUrl} />;
}
