import type { PillarPageData } from "@/data/pillar-pages";
import { getPillarPremium } from "@/data/pillar-premium";
import { PillarLandingView } from "@/components/pillars/PillarLandingView";
import { PillarPremiumView } from "@/components/pillars/premium/PillarPremiumView";

/**
 * Router: premium layout als die bestaat, anders de standaard pillar-pagina.
 */
export function PillarPageView({ data }: { data: PillarPageData }) {
  const premium = getPillarPremium(data.slug);
  if (premium) {
    return <PillarPremiumView data={data} premium={premium} />;
  }
  return <PillarLandingView data={data} />;
}
