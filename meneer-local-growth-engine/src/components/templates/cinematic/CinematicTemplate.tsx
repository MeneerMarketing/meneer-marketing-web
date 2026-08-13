import type { StudioData } from "@/types/studio";
import { ConceptBanner } from "@/components/preview/ConceptBanner";
import { CinematicBand } from "@/components/templates/cinematic/CinematicBand";
import { CinematicClasses } from "@/components/templates/cinematic/CinematicClasses";
import { CinematicContact } from "@/components/templates/cinematic/CinematicContact";
import { CinematicFaq } from "@/components/templates/cinematic/CinematicFaq";
import { CinematicHero } from "@/components/templates/cinematic/CinematicHero";
import { CinematicInstructors } from "@/components/templates/cinematic/CinematicInstructors";
import { CinematicPricing } from "@/components/templates/cinematic/CinematicPricing";
import { CinematicReviews } from "@/components/templates/cinematic/CinematicReviews";
import { CinematicSchedule } from "@/components/templates/cinematic/CinematicSchedule";
import { CinematicStudio } from "@/components/templates/cinematic/CinematicStudio";
import { buildCineModel } from "@/components/templates/cinematic/cinematicModel";

interface Props {
  studio: StudioData;
}

/**
 * Variant C — Cinematic Form.
 * Filmische magazine-stijl: volbeeld opening, high-contrast serif met italic,
 * oxblood en cream, fijne korrel. Wordt stap voor stap uitgebouwd.
 */
export function CinematicTemplate({ studio }: Props) {
  const model = buildCineModel(studio);

  return (
    <div className="cine-root relative overflow-x-clip">
      <ConceptBanner studio={studio} tone="dark" />
      <CinematicHero model={model} />
      <CinematicClasses model={model} />
      <CinematicBand model={model} />
      <CinematicSchedule model={model} />
      <CinematicInstructors model={model} />
      <CinematicStudio model={model} />
      <CinematicPricing model={model} />
      <CinematicReviews model={model} />
      <CinematicFaq model={model} />
      <CinematicContact model={model} />
    </div>
  );
}
