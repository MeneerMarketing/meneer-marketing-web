import { DIENSTEN_HUB_PILLARS } from "@/data/diensten-hub";
import { DienstenPillarHubSection } from "@/components/diensten/hub/DienstenPillarHubSection";

export function DienstenHubPillars() {
  return (
    <div id="hub-pillars">
      {DIENSTEN_HUB_PILLARS.map((pillar, index) => (
        <DienstenPillarHubSection key={pillar.slug} pillar={pillar} index={index} />
      ))}
    </div>
  );
}
