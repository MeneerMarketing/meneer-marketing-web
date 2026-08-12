import Link from "next/link";
import BeforeAfterSlider from "@/components/ui/BeforeAfterSlider";
import FigmaHeading from "@/components/figma/FigmaHeading";
import { publicCopy } from "@/lib/copy-flags";
import {
  figmaInnerContainer,
  figmaSectionTight,
} from "@/lib/figma-inner-layout";

/**
 * NIET MEER IN GEBRUIK, EN NIET ZOMAAR WEER AANZETTEN.
 *
 * /resultaten draaide hierop en toonde drie dev-placeholders. Die pagina laat nu zien
 * waarom een voor-en-na-foto zonder protocol niets bewijst, en krijgt pas beelden zodra er
 * echte zijn (zie `src/app/resultaten/page.tsx` en `src/data/fotobewijs.ts`).
 *
 * De placeholders hieronder bevatten `[COPY-NODIG]` en `[BEELD-NODIG]`. Die worden door
 * `publicCopy` afgevangen in de bijschriften, maar niet in de alt-teksten. Wie dit
 * component opnieuw inzet zonder echte data zet dus vlaggen op het scherm.
 */
export type ResultaatItem = {
  id: string;
  behandeling: string;
  pillarHref: string;
  before: { src: string; alt: string };
  after: { src: string; alt: string };
  sessions: string;
  timeline: string;
  skinType: string;
};

/** Dev-placeholders tot Aleks echte voor/na levert. Abstracte SVG's, geen mensen. */
export const RESULTATEN_PLACEHOLDERS: readonly ResultaatItem[] = [
  {
    id: "acne-dev",
    behandeling: "Acne",
    pillarHref: "/huidproblemen/acne",
    before: {
      src: "/dev/voor.svg",
      alt: "[BEELD-NODIG: acne voor behandeling]",
    },
    after: { src: "/dev/na.svg", alt: "[BEELD-NODIG: acne na behandeling]" },
    sessions: "[COPY-NODIG: x sessies]",
    timeline: "[COPY-NODIG: x maanden]",
    skinType: "[COPY-NODIG: huidtype]",
  },
  {
    id: "pigment-dev",
    behandeling: "Pigmentvlekken",
    pillarHref: "/huidproblemen/pigmentvlekken",
    before: {
      src: "/dev/voor.svg",
      alt: "[BEELD-NODIG: pigment voor behandeling]",
    },
    after: { src: "/dev/na.svg", alt: "[BEELD-NODIG: pigment na behandeling]" },
    sessions: "[COPY-NODIG: x sessies]",
    timeline: "[COPY-NODIG: x maanden]",
    skinType: "[COPY-NODIG: huidtype]",
  },
  {
    id: "rosacea-dev",
    behandeling: "Roodheid",
    pillarHref: "/huidproblemen/rosacea",
    before: {
      src: "/dev/voor.svg",
      alt: "[BEELD-NODIG: roodheid voor behandeling]",
    },
    after: {
      src: "/dev/na.svg",
      alt: "[BEELD-NODIG: roodheid na behandeling]",
    },
    sessions: "[COPY-NODIG: x sessies]",
    timeline: "[COPY-NODIG: x maanden]",
    skinType: "[COPY-NODIG: huidtype]",
  },
] as const;

export type ResultatenGalleryProps = {
  items?: readonly ResultaatItem[];
};

export default function ResultatenGallery({
  items = RESULTATEN_PLACEHOLDERS,
}: ResultatenGalleryProps) {
  return (
    <section className={`${figmaInnerContainer} ${figmaSectionTight} pb-24`}>
      <div className="grid gap-12 md:grid-cols-2">
        {items.map((item) => (
          <article key={item.id} data-reveal className="flex flex-col gap-4">
            <FigmaHeading as="h2" size="card" text={item.behandeling} />
            <BeforeAfterSlider
              before={item.before}
              after={item.after}
              // Alle drie de meetwaarden door de vlaggenfilter: het zijn nog
              // placeholders, en die stonden hier zichtbaar op het scherm.
              sessions={publicCopy(item.sessions, "Volgt")}
              timeline={publicCopy(item.timeline, "Volgt")}
              skinType={publicCopy(item.skinType, "Volgt")}
            />
            <Link
              href={item.pillarHref}
              className="text-[14px] font-medium text-[#286943] underline-offset-4 hover:underline"
            >
              Lees meer over {item.behandeling.toLowerCase()} →
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
