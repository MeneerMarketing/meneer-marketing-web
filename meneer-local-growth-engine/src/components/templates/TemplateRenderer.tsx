import type { StudioData, TemplateVariant } from "@/types/studio";
import { EditorialTemplate } from "@/components/templates/editorial/EditorialTemplate";
import { ReformerMinimalTemplate } from "@/components/templates/reformer-minimal/ReformerMinimalTemplate";
import { CinematicTemplate } from "@/components/templates/cinematic/CinematicTemplate";

interface Props {
  studio: StudioData;
  variant: TemplateVariant;
}

export function TemplateRenderer({ studio, variant }: Props) {
  switch (variant) {
    case "editorial":
      return <EditorialTemplate studio={studio} />;
    case "reformer-minimal":
      return <ReformerMinimalTemplate studio={studio} />;
    // Variant-key blijft 'soft-movement' voor bestaande previews in de database.
    case "soft-movement":
      return <CinematicTemplate studio={studio} />;
    default: {
      const _exhaustive: never = variant;
      return _exhaustive;
    }
  }
}
