import type { Metadata } from "next";
import FigmaHeading from "@/components/figma/FigmaHeading";
import { FigmaBreadcrumbs } from "@/components/figma/FigmaTemplateUi";
import ResultatenGallery from "@/components/ui/ResultatenGallery";
import {
  figmaBody,
  figmaInnerContainer,
  figmaLabel,
  figmaSection,
} from "@/lib/figma-inner-layout";

export const metadata: Metadata = {
  title: "Resultaten",
  description: "Voor/na-resultaten bij Diba Clinics, met sessies, tijdlijn en huidtype.",
};

export default function ResultatenPage() {
  return (
    <main className="pb-20">
      <section className={`${figmaInnerContainer} ${figmaSection}`} data-reveal>
        <FigmaBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Resultaten" },
          ]}
        />
        <p className={figmaLabel}>Resultaten</p>
        <FigmaHeading
          as="h1"
          size="hero"
          text="Resultaten bij *echte* klanten"
          className="mt-4 max-w-3xl"
        />
        <p className={`mt-7 max-w-2xl ${figmaBody}`}>
          Voor/na-beelden volgen het protocol: sessies, tijdlijn en huidtype staan er altijd bij.
          Tot Aleks levert: dev-placeholders met het juiste kader.
        </p>
      </section>
      <ResultatenGallery />
    </main>
  );
}
