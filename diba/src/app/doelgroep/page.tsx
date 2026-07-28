import type { Metadata } from "next";
import DoelgroepHubTemplate from "@/components/templates/DoelgroepHubTemplate";
import { PAGE_DEFAULTS } from "@/lib/page-defaults";

export const metadata: Metadata = {
  title: "Doelgroepen",
  description: "[COPY-NODIG]",
};

export default function DoelgroepHubPage() {
  return <DoelgroepHubTemplate siteUrl={PAGE_DEFAULTS.siteUrl} />;
}
