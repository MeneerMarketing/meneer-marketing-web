"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import FigmaHeading from "@/components/figma/FigmaHeading";
import { FigmaBreadcrumbs, FigmaFilterPills } from "@/components/figma/FigmaTemplateUi";
import ProofStrip from "@/components/ui/ProofStrip";
import ReviewCard from "@/components/ui/ReviewCard";
import {
  REVIEW_TOPICS,
  reviewsForTopic,
  type ReviewTopic,
} from "@/data/reviews";
import { figmaBtnPrimary } from "@/lib/figma-home-layout";
import {
  figmaBody,
  figmaInnerContainer,
  figmaLabel,
  figmaSection,
  figmaSectionTight,
} from "@/lib/figma-inner-layout";
import type { ProofItem } from "@/components/ui/ProofStrip";

export type ReviewsTemplateProps = {
  proofItems: ProofItem[];
};

export default function ReviewsTemplate({ proofItems }: ReviewsTemplateProps) {
  const [topic, setTopic] = useState<ReviewTopic>("alle");
  const reviews = useMemo(() => reviewsForTopic(topic), [topic]);

  return (
    <main className="pb-20">
      <section className={`${figmaInnerContainer} ${figmaSection}`} data-reveal>
        <FigmaBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Reviews" },
          ]}
        />
        <p className={figmaLabel}>Reviews</p>
        <FigmaHeading
          as="h1"
          size="hero"
          text="Wat klanten *echt* zeggen"
          className="mt-4 max-w-3xl"
        />
        <p className={`mt-7 max-w-2xl ${figmaBody}`}>
          Reviews komen uit Salonized-export. Filter op onderwerp.
        </p>
        <FigmaFilterPills
          className="mt-9"
          items={REVIEW_TOPICS}
          value={topic}
          onChange={setTopic}
          ariaLabel="Review-onderwerp"
        />
      </section>

      <section className={`${figmaInnerContainer} py-10`} data-reveal>
        <ProofStrip items={proofItems} highlightLabel="Klantreviews" />
      </section>

      <section className={`${figmaInnerContainer} ${figmaSectionTight} pb-24`} data-reveal>
        {reviews.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r) => (
              <ReviewCard
                key={r.id}
                quote={r.quote}
                name={r.name}
                treatment={r.treatment}
                stars={r.stars}
              />
            ))}
          </div>
        ) : (
          <p className={figmaBody}>Nog geen reviews voor dit onderwerp in de export.</p>
        )}
        <div className="mt-10">
          <Link href="/intake" className={figmaBtnPrimary}>
            Start uw intake (4 min) ↗
          </Link>
        </div>
      </section>
    </main>
  );
}
