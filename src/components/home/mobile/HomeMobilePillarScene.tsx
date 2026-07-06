import type { UspSceneId } from "@/data/home-usps";
import { UspMiniScene } from "@/components/home/usp/UspMiniScene";
import type { PillarSlug } from "@/lib/navigation";

const PILLAR_SCENE: Record<PillarSlug, UspSceneId> = {
  strategie: "plan",
  bouwen: "build",
  vindbaarheid: "discover",
  campagnes: "ads",
  behoud: "contact",
};

export function HomeMobilePillarScene({
  pillarId,
  className,
}: {
  pillarId: PillarSlug;
  className?: string;
}) {
  return <UspMiniScene scene={PILLAR_SCENE[pillarId]} className={className} />;
}
