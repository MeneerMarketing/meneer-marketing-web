import type { StudioData, TemplateVariant } from "@/types/studio";
import { ClinicalEditorialTemplate } from "@/components/templates/clinical-editorial/ClinicalEditorialTemplate";
import { SkinClinicCinematicTemplate } from "@/components/templates/clinical-cinematic/SkinClinicCinematicTemplate";
import { SkinClinicMinimalTemplate } from "@/components/templates/clinical-minimal/SkinClinicMinimalTemplate";
import { EditorialTemplate } from "@/components/templates/editorial/EditorialTemplate";
import { ReformerMinimalTemplate } from "@/components/templates/reformer-minimal/ReformerMinimalTemplate";
import { CinematicTemplate } from "@/components/templates/cinematic/CinematicTemplate";
import { ClinicalAtelierTemplate } from "@/components/templates/clinical-atelier/ClinicalAtelierTemplate";
import { isSkinClinicStudio } from "@/lib/clinicPreviewFallbacks";

interface Props {
  studio: StudioData;
  variant: TemplateVariant;
}

export function TemplateRenderer({ studio, variant }: Props) {
  const isClinic = isSkinClinicStudio(studio);

  switch (variant) {
    case "editorial":
      return isClinic ? (
        <ClinicalEditorialTemplate studio={studio} />
      ) : (
        <EditorialTemplate studio={studio} />
      );
    case "reformer-minimal":
      return isClinic ? (
        <SkinClinicMinimalTemplate studio={studio} />
      ) : (
        <ReformerMinimalTemplate studio={studio} />
      );
    // DB-variant blijft soft-movement; renderer is Cinematic Form v2.
    case "soft-movement":
      return isClinic ? (
        <SkinClinicCinematicTemplate studio={studio} />
      ) : (
        <CinematicTemplate studio={studio} />
      );
    case "clinical-atelier":
      return <ClinicalAtelierTemplate studio={studio} />;
    default: {
      const _exhaustive: never = variant;
      return _exhaustive;
    }
  }
}
