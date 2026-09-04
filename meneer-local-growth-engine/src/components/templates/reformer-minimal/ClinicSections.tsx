import { ScrollReveal } from "@/components/motion/ScrollReveal";
import type { StudioFaq } from "@/types/studio";
import { plainText } from "@/lib/text";

export { ClinicTeam } from "@/components/templates/reformer-minimal/ClinicTeam";

/** DIBA-achtige FAQ: kop links, accordion rechts, pilates-kleuren. */
export function ClinicFaq({
  faqs,
  variant = "pilates",
}: {
  faqs: StudioFaq[];
  variant?: "pilates" | "skin-clinic";
}) {
  if (faqs.length === 0) return null;

  return (
    <section id="faq" className="fc-plane-010">
      <div className="mx-auto px-5 py-20 sm:px-8 lg:px-[5vw] lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-14">
          <ScrollReveal>
            <p className="figma-label text-[var(--fc-label)]">Goed om te weten</p>
            <h2 className="figma-display-l mt-4 max-w-[14ch]">
              Eerst even dit.
            </h2>
            <p className="mt-6 max-w-[34ch] text-[15px] leading-7 text-[var(--fc-ink-soft)]">
              {variant === "skin-clinic"
                ? "Duidelijke antwoorden op intake, behandelingen, hersteltijd en nazorg."
                : "Duidelijke antwoorden op wat je vooraf wilt weten over lessen, boeken en de studio."}
            </p>
          </ScrollReveal>

          <ScrollReveal delayMs={80}>
            <div className="border-t border-[var(--fc-line)]">
              {faqs.map((faq) => (
                <details
                  key={faq.id}
                  className="group border-b border-[var(--fc-line)] py-6"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[17px] tracking-[-0.03em] text-[var(--fc-ink)] sm:text-xl [&::-webkit-details-marker]:hidden">
                    <span>{plainText(faq.question)}</span>
                    <span
                      aria-hidden
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--fc-wash)] text-[var(--fc-accent-deep)] transition-transform duration-300 ease-[var(--fc-ease)] group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="max-w-[68ch] pt-4 text-[15px] leading-7 text-[var(--fc-ink-soft)]">
                    {plainText(faq.answer)}
                  </p>
                </details>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
