import { VerticalLauncherWizard } from "@/components/dashboard/VerticalLauncherWizard";
import { listWizardCatalogOptions } from "@/lib/verticals/verticalLauncherBlueprint";
import { refreshDynamicVerticalPackCache } from "@/services/verticals/dynamicVerticalPack";
import { verticalRegistry } from "@/verticals/registry";

export default async function VerticalLauncherPage() {
  await refreshDynamicVerticalPackCache();

  const blockedSlugs = Object.entries(verticalRegistry)
    .filter(([, pack]) => pack.status === "ACTIVE")
    .map(([slug]) => slug);

  return (
    <VerticalLauncherWizard
      catalog={listWizardCatalogOptions()}
      blockedSlugs={blockedSlugs}
    />
  );
}
