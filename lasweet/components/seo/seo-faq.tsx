import { Reveal } from "@/components/reveal";
import type { FaqItem } from "@/lib/seo";

interface SeoFaqProps {
  title: string;
  intro: string;
  faqs: readonly FaqItem[];
}

export function SeoFaq({ title, intro, faqs }: SeoFaqProps) {
  return (
    <section className="bg-cream py-16 lg:py-24" aria-labelledby="seo-faq-heading">
      <div className="mx-auto max-w-[800px] px-5 md:px-10">
        <Reveal>
          <h2
            id="seo-faq-heading"
            className="font-display text-3xl font-semibold leading-[0.94] tracking-[-0.05em] text-ink md:text-4xl"
          >
            {title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">{intro}</p>
        </Reveal>

        <div className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
          {faqs.map((faq, index) => (
            <Reveal key={faq.question} delay={0.04 * index}>
              <details className="group py-5">
                <summary className="cursor-pointer list-none font-display text-xl font-bold leading-snug tracking-tight text-ink marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start justify-between gap-4">
                    <span>{faq.question}</span>
                    <span
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-matcha transition-transform duration-300 group-open:rotate-45"
                    >
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-3 max-w-prose text-base leading-relaxed text-ink-soft">
                  {faq.answer}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
