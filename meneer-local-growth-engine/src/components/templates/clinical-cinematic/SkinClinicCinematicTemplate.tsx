import { buildCinematicBrandStyle } from "@/lib/brandPalette";
import type { StudioData } from "@/types/studio";
import { ConceptBanner } from "@/components/preview/ConceptBanner";
import { CinematicBand } from "@/components/templates/cinematic/CinematicBand";
import { CinematicContact } from "@/components/templates/cinematic/CinematicContact";
import { CinematicFaq } from "@/components/templates/cinematic/CinematicFaq";
import { CinematicHero } from "@/components/templates/cinematic/CinematicHero";
import { CinematicInstructors } from "@/components/templates/cinematic/CinematicInstructors";
import { CinematicPricing } from "@/components/templates/cinematic/CinematicPricing";
import { CinematicReviews } from "@/components/templates/cinematic/CinematicReviews";
import { CinematicSocials } from "@/components/templates/cinematic/CinematicSocials";
import { CinematicStudio } from "@/components/templates/cinematic/CinematicStudio";
import { buildSkinClinicCineBundle } from "@/components/templates/clinical-cinematic/skinClinicCinematicModel";
import { buildClinicSocialLinks } from "@/components/templates/reformer-minimal/clinicModel";
import {
  SkinClinicCinematicConcerns,
  SkinClinicCinematicJourney,
  SkinClinicCinematicTreatments,
} from "@/components/templates/clinical-cinematic/SkinClinicCinematicSections";

interface Props {
  studio: StudioData;
}

/**
 * Template C voor huidklinieken — cinematic soft movement, filmisch magazine.
 * Derde skin-clinic template (soft-movement variant).
 */
export function SkinClinicCinematicTemplate({ studio }: Props) {
  const { model, skinConcerns, journey } = buildSkinClinicCineBundle(studio);
  const socials = buildClinicSocialLinks(studio);
  const brandStyle = buildCinematicBrandStyle(studio);

  return (
    <div className="cine-root sc-skin-cine relative overflow-x-clip" style={brandStyle}>
      <ConceptBanner studio={studio} tone="dark" />
      <CinematicHero model={model} variant="skin-clinic" />
      <SkinClinicCinematicTreatments
        statement={model.statement}
        classes={model.classes}
        booking={model.booking}
      />
      <CinematicBand model={model} />
      <SkinClinicCinematicConcerns
        concerns={skinConcerns}
        studioName={model.studioName}
        city={model.city}
        booking={model.booking}
      />
      <SkinClinicCinematicJourney steps={journey} booking={model.booking} />
      <CinematicInstructors model={model} variant="skin-clinic" />
      <CinematicStudio model={model} variant="skin-clinic" />
      <CinematicPricing model={model} variant="skin-clinic" />
      <CinematicReviews model={model} variant="skin-clinic" />
      <CinematicFaq model={model} variant="skin-clinic" />
      <CinematicSocials
        studioName={model.studioName}
        socials={socials}
        images={
          model.gallery.length > 0
            ? model.gallery
            : [model.heroImage, ...model.heroShots]
        }
        variant="skin-clinic"
      />
      <CinematicContact model={model} variant="skin-clinic" />
    </div>
  );
}
