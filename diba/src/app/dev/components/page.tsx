import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import FigmaFaqList from "@/components/figma/FigmaFaqList";
import FigmaHeading from "@/components/figma/FigmaHeading";
import BeforeAfterSlider from "@/components/ui/BeforeAfterSlider";
import DeLijn from "@/components/ui/DeLijn";
import { TextField, TextareaField } from "@/components/ui/FormField";
import MeasurementBlock from "@/components/ui/MeasurementBlock";
import PriceTable from "@/components/ui/PriceTable";
import ProofStrip from "@/components/ui/ProofStrip";
import ReviewCard from "@/components/ui/ReviewCard";
import StickyActionBar from "@/components/ui/StickyActionBar";
import {
  figmaBtnMint,
  figmaBtnPrimary,
  figmaHomeShell,
} from "@/lib/figma-home-layout";
import {
  figmaBody,
  figmaCardWhite,
  figmaInnerContainer,
  figmaLabel,
  figmaSection,
} from "@/lib/figma-inner-layout";
import { DIBA_PROOF_STRIP_ITEMS, DIBA_WHATSAPP_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Componenten (dev)",
  robots: { index: false, follow: false },
};

const DEV_FAQ = [
  {
    question: "[COPY-NODIG: echte FAQ-vraag]",
    answer: "[COPY-NODIG] [MEDISCHE-CHECK-ROJDA]",
  },
  {
    question: "[COPY-NODIG]",
    answer: "[COPY-NODIG]",
  },
] as const;

const DEV_PRICE_ROWS = [
  {
    name: "[COPY-NODIG]",
    single: 0,
    traject: { price: 0, sessions: "5 sessies", perMonth: 0 },
  },
  {
    name: "[COPY-NODIG]",
    traject: { price: 0, sessions: "3 sessies" },
  },
] as const;

function DevSection({
  title,
  children,
  wide = false,
}: {
  readonly title: string;
  readonly children: ReactNode;
  readonly wide?: boolean;
}) {
  return (
    <section className="py-12 first:border-t-0">
      <p className={figmaLabel}>{title}</p>
      <FigmaHeading as="h2" size="card" text={title} className="mt-3" />
      <div className={`mt-8 ${wide ? "w-full" : ""}`}>{children}</div>
    </section>
  );
}

export default function DevComponentsPage() {
  return (
    <div className={figmaHomeShell}>
      <main className={`${figmaInnerContainer} ${figmaSection} pb-24`}>
        <p className={`mb-10 max-w-2xl ${figmaBody}`}>
          Figma design system review. Niet indexeren. Alle kerncomponenten na
          site-wide migratie.
        </p>

        <div className="mb-12 flex flex-col gap-6">
          <FigmaHeading
            as="h1"
            size="hero"
            text="Eerlijk advies voor *jouw* huid"
          />
          <FigmaHeading as="h2" size="section" text="Is het *nodig*?" />
          <DeLijn length="lang" dot={62} />
        </div>

        <DevSection title="Knoppen">
          <div className="flex max-w-md flex-col items-start gap-3">
            <span className={figmaBtnPrimary}>Plan Behandeling Nul ↗</span>
            <span className={figmaBtnMint}>Bekijk alle prijzen ↗</span>
            <Link
              href="/contact"
              className="text-[14px] font-medium text-[var(--g-700)] underline-offset-4 hover:underline"
            >
              Nog niet zeker? Stel je vraag
            </Link>
          </div>
        </DevSection>

        <DevSection title="Proof-strip">
          <ProofStrip
            items={[...DIBA_PROOF_STRIP_ITEMS]}
            highlightLabel="Klantreviews"
          />
        </DevSection>

        <DevSection title="Reviewkaart">
          <div className="max-w-md">
            <ReviewCard
              quote="[COPY-NODIG: echte review uit Salonized-export]"
              name="[COPY-NODIG]"
              treatment="[COPY-NODIG]"
              stars={5}
            />
          </div>
        </DevSection>

        <DevSection title="FAQ">
          <div className="max-w-2xl">
            <FigmaFaqList items={[...DEV_FAQ]} />
          </div>
        </DevSection>

        <DevSection title="Formuliervelden">
          <div className="flex max-w-md flex-col gap-6">
            <TextField
              id="email"
              label="E-mailadres"
              type="email"
              placeholder="naam@voorbeeld.nl"
            />
            <TextField
              id="email-err"
              label="E-mailadres"
              type="email"
              defaultValue="naam.voorbeeld.nl"
              error="Dit e-mailadres mist een @"
            />
            <TextareaField
              id="vraag"
              label="Je vraag"
              hint="Hoe concreter, hoe beter we kunnen helpen."
            />
          </div>
        </DevSection>

        <DevSection title="Prijstabel" wide>
          <div
            className={`${figmaCardWhite} max-w-2xl overflow-x-auto p-6 sm:p-8`}
          >
            <PriceTable
              caption="[COPY-NODIG: tabeltitel]"
              rows={[...DEV_PRICE_ROWS]}
            />
          </div>
        </DevSection>

        <DevSection title="Voor/na-slider">
          <BeforeAfterSlider
            before={{
              src: "/dev/voor.svg",
              alt: "[BEELD-NODIG: bv. huid met melasma vóór behandeling, huidtype IV]",
            }}
            after={{
              src: "/dev/na.svg",
              alt: "[BEELD-NODIG: dezelfde huid na behandeling]",
            }}
            sessions="[COPY-NODIG: x sessies]"
            timeline="[COPY-NODIG: x maanden]"
            skinType="[COPY-NODIG: huidtype x]"
          />
        </DevSection>

        <DevSection title="EVE-M meting-blok">
          <div className="max-w-2xl">
            <MeasurementBlock
              context="[COPY-NODIG: traject + meetmoment] [MEDISCHE-CHECK-ROJDA]"
              metrics={[
                { label: "[COPY-NODIG: metriek]", baseline: 100, current: 60 },
                {
                  label: "[COPY-NODIG: metriek]",
                  baseline: 40,
                  current: 70,
                  lowerIsBetter: false,
                },
              ]}
            />
          </div>
        </DevSection>

        <div
          className="mt-12 min-h-[120vh] rounded-[1.5rem] border border-dashed border-[var(--g-100)] bg-[var(--g-025)] p-6 md:hidden"
          aria-hidden="true"
        >
          <p className={figmaBody}>
            Scroll-zone voor sticky actiebalk-test (alleen mobiel).
          </p>
        </div>
      </main>

      <StickyActionBar whatsappHref={DIBA_WHATSAPP_URL} intakeHref="/intake" />
    </div>
  );
}
