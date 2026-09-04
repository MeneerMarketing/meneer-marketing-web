import { SectionTitle } from "@/components/dashboard/ui";
import { DiscoveryLauncherForm } from "@/components/dashboard/DiscoveryLauncherForm";
import { getDiscoveryLauncherContext } from "@/services/verticals/discoveryLauncherContext";

export default async function DiscoveryNewPage() {
  const { verticals, countriesByVertical } = await getDiscoveryLauncherContext();

  return (
    <div>
      <SectionTitle
        eyebrow="Discovery Launcher"
        title="Nieuwe prospects zoeken"
        description="Kies vertical, land en stad. Wizard-verticals verschijnen hier automatisch na provision."
      />
      <DiscoveryLauncherForm verticals={verticals} countriesByVertical={countriesByVertical} />
    </div>
  );
}
