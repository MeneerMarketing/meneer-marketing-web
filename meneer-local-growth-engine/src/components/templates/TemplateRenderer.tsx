import type { StudioData, TemplateVariant } from "@/types/studio";
import { EditorialTemplate } from "@/components/templates/editorial/EditorialTemplate";
import { ReformerMinimalTemplate } from "@/components/templates/reformer-minimal/ReformerMinimalTemplate";
import { SoftMovementTemplate } from "@/components/templates/soft-movement/SoftMovementTemplate";

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
    case "soft-movement":
      return <SoftMovementTemplate studio={studio} />;
    default: {
      const _exhaustive: never = variant;
      return _exhaustive;
    }
  }
}
