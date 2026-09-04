import { ScrollReveal } from "@/components/motion/ScrollReveal";
import type { CineModel } from "@/components/templates/cinematic/cinematicModel";

interface Props {
  model: CineModel;
  variant?: "pilates" | "skin-clinic";
}

/**
 * Vragen als register achterin het magazine: kop links, lijst rechts. Native
 * details/summary, dus toetsenbord en screenreader werken zonder extra code.
 */
export function CinematicFaq({ model, variant = "pilates" }: Props) {
  const { faqs, contact, booking } = model;

  return (
    <section id="faq" className="bg-[var(--cn-cream)]">
      <div className="mx-auto px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-16">
          <ScrollReveal>
            <div className="lg:sticky lg:top-24">
              <p className="cine-label text-[var(--cn-muted)]">Vragen</p>
              <h2 className="cine-display cine-display-l cine-lower mt-5 text-[var(--cn-oxblood)]">
                goed om
                <br />
                <span className="cine-italic">te weten.</span>
              </h2>
              <p className="mt-6 max-w-[32ch] text-[13.5px] leading-6 text-[var(--cn-body)]">
                {variant === "skin-clinic"
                  ? "Staat je vraag er niet bij? Mail of bel de kliniek, je krijgt antwoord van iemand die je huid kent."
                  : "Staat je vraag er niet bij? Mail of bel de studio, je krijgt antwoord van iemand die er lesgeeft."}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href={booking.href}
                  {...(booking.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="cine-pill cine-pill-ink"
                >
                  {booking.label}
                </a>
                {contact.email ? (
                  <a
                    href={`mailto:${contact.email}`}
                    className="cine-label text-[var(--cn-clay)] underline decoration-[var(--cn-line)] decoration-1 underline-offset-4 transition-colors duration-300 hover:text-[var(--cn-oxblood)]"
                  >
                    {contact.email}
                  </a>
                ) : null}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={90}>
            <div className="border-t border-[var(--cn-line)]">
              {faqs.map((faq) => (
                <details
                  key={faq.id}
                  className="group border-b border-[var(--cn-line)]"
                >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                    <span className="cine-display cine-lower text-[1.2rem] leading-tight text-[var(--cn-ink)] transition-colors duration-300 group-hover:text-[var(--cn-oxblood)] sm:text-[1.5rem]">
                      {faq.question}
                    </span>
                    <span
                      aria-hidden
                      className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--cn-line)] text-[var(--cn-clay)] transition-transform duration-500 ease-[var(--cn-ease)] group-open:rotate-45 group-open:border-[var(--cn-clay)]"
                    >
                      +
                    </span>
                  </summary>
                  <p className="max-w-[62ch] pb-7 pr-14 text-[13.5px] leading-7 text-[var(--cn-body)]">
                    {faq.answer}
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
