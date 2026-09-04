import { Plus_Jakarta_Sans } from "next/font/google";
import type { StudioData } from "@/types/studio";
import { ConceptBanner } from "@/components/preview/ConceptBanner";
import { AtelierChrome, AtelierFooter } from "@/components/templates/clinical-atelier/AtelierChrome";
import { AtelierHome } from "@/components/templates/clinical-atelier/AtelierHome";
import { buildClinicalAtelierModel } from "@/components/templates/clinical-atelier/clinicalAtelierModel";
import "./clinical-atelier.css";

const atelierSans = Plus_Jakarta_Sans({
  variable: "--font-atelier-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

interface Props {
  studio: StudioData;
}

/**
 * Template D — Atelier Clinical (LUMEN / Figma Setup).
 * Premium petrol editorial huidkliniek homepage.
 */
export function ClinicalAtelierTemplate({ studio }: Props) {
  const model = buildClinicalAtelierModel(studio);

  return (
    <div
      className={`clinical-atelier-root ${atelierSans.variable} relative min-h-screen overflow-x-clip bg-warm-white font-sans pb-20 md:pb-0`}
    >
      <ConceptBanner studio={studio} tone="light" />
      <AtelierChrome model={model} />
      <main>
        <AtelierHome model={model} />
      </main>
      <AtelierFooter model={model} />
    </div>
  );
}

export { buildClinicalAtelierModel } from "@/components/templates/clinical-atelier/clinicalAtelierModel";
