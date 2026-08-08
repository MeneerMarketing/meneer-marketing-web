import { DienstFAQ } from "@/components/diensten/DienstFAQ";
import { Reveal } from "@/components/effects/Reveal";
import type { PillarFaqItem } from "@/data/pillar-faqs";

interface PillarFaqSectionProps {
  faqs: readonly PillarFaqItem[];
  idPrefix: string;
  variant?: "light" | "dark";
}

export function PillarFaqSection({
  faqs,
  idPrefix,
  variant = "light",
}: PillarFaqSectionProps) {
  if (faqs.length === 0) return null;

  const isDark = variant === "dark";

  return (
    <section
      className={
        isDark
          ? "border-b border-slate-800 bg-slate-950"
          : "border-b border-mm-border bg-mm-bg"
      }
      aria-labelledby={`${idPrefix}-faq-heading`}
    >
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <Reveal>
          <h2
            id={`${idPrefix}-faq-heading`}
            className={`text-2xl font-extrabold tracking-tight sm:text-3xl ${
              isDark ? "text-white" : "text-mm-text"
            }`}
          >
            Veelgestelde vragen over dit blok
          </h2>
          <p className={`mt-2 ${isDark ? "text-slate-400" : "text-mm-muted"}`}>
            Kort en eerlijk. In een gesprek maak ik het concreet voor jouw situatie.
          </p>
        </Reveal>
        <div className="mt-8">
          <DienstFAQ items={[...faqs]} idPrefix={idPrefix} />
        </div>
      </div>
    </section>
  );
}
