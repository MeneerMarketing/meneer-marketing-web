"use client";

import Link from "next/link";
import FigmaReviewsExperience from "@/components/figma/FigmaReviewsExperience";
import FigmaSoftAccent from "@/components/figma/FigmaSoftAccent";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import ProofBar from "@/components/ui/ProofBar";
import type { ProofStripItem } from "@/lib/site";

export type ReviewsTemplateProps = {
  proofItems: readonly ProofStripItem[];
};

export default function ReviewsTemplate({ proofItems }: ReviewsTemplateProps) {
  return (
    <main className="figma-home min-h-screen bg-[var(--g-010)] text-[var(--t-strong)] pb-24">
      {/* Hero */}
      <section className="relative overflow-hidden px-5 sm:px-9 lg:px-[7.5vw]">
        <FigmaSoftAccent variant="traject" />
        <div className="relative mx-auto py-20 lg:py-28">
          <nav
            aria-label="Broodkruimels"
            className="diba-label mb-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-[var(--t-label)]"
          >
            <Link href="/" className="transition hover:text-[var(--g-700)]">
              Home
            </Link>
            <span aria-hidden className="opacity-40">
              /
            </span>
            <span className="text-[var(--g-700)]">Reviews</span>
          </nav>

          <Label>Klantreviews</Label>
          <h1 className="diba-display-l mt-5 max-w-[14ch]">
            5,0 sterren.
            <br />
            <span className="diba-accent">3.883 verhalen.</span>
          </h1>
          <p className="mt-7 max-w-[44ch] text-[16px] leading-7 text-[var(--t-body)]">
            Live uit Salonized. Filter op onderwerp, lees de highlights of
            blader door echte quotes van klanten in Hillegersberg.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button href="/intake">Start je intake (4 min)</Button>
            <Button
              href="https://dibaclinics.salonized.com/reviews"
              variant="secundair"
              target="_blank"
              rel="noopener noreferrer"
            >
              Bekijk op Salonized
            </Button>
          </div>
        </div>
      </section>

      <ProofBar items={proofItems} />

      <section className="px-5 sm:px-9 lg:px-[7.5vw]">
        <div className="mx-auto py-16 lg:py-24">
          <FigmaReviewsExperience />
        </div>
      </section>

      <section className="bg-[var(--g-050)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-20">
        <div className="mx-auto flex flex-wrap items-center justify-between gap-8 rounded-[var(--r-lg)] bg-white px-7 py-8 sm:px-10">
          <div className="max-w-lg">
            <Label>Klaar voor je plan?</Label>
            <p className="mt-3 diba-card-title text-[var(--t-strong)]">
              Je huid verdient hetzelfde niveau van zorg.
            </p>
            <p className="mt-3 text-[15px] leading-7 text-[var(--t-body)]">
              Start met een intake van vier minuten. Wij meten eerst, behandelen
              daarna.
            </p>
          </div>
          <Button href="/intake">Start je intake (4 min)</Button>
        </div>
      </section>
    </main>
  );
}
