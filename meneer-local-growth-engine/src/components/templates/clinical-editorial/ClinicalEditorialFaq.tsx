import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { EditorialIcon } from "@/components/templates/editorial/EditorialIcon";
import type { EditorialModel } from "@/components/templates/editorial/editorialModel";
import { plainText } from "@/lib/text";
import type { StudioFaq } from "@/types/studio";

interface Props {
  faqs: StudioFaq[];
  booking: EditorialModel["booking"];
}

/** FAQ-blok voor huidkliniek editorial. Geen Pilates-poses of proefles-copy. */
export function ClinicalEditorialFaq({ faqs, booking }: Props) {
  if (faqs.length === 0) return null;

  return (
    <section className="ed-surface border-b border-[var(--ed-line)]">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-5 py-20 md:px-10 md:py-24 lg:grid-cols-12 lg:gap-16 lg:px-16 lg:py-28">
        <ScrollReveal className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <p className="ed-label text-[var(--ed-accent)]">Praktisch</p>
            <h2 className="ed-serif ed-h2 mt-4 max-w-[16ch]">Goed om te weten</h2>
            <p className="mt-6 max-w-[34ch] text-[0.97rem] leading-relaxed text-[var(--ed-fg-70)]">
              Staat je vraag er niet tussen? Plan een intake en stel hem direct
              aan het team.
            </p>
            <a
              href={booking.href}
              {...(booking.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="ed-label group mt-8 inline-flex items-center gap-3 text-[var(--ed-fg)]"
            >
              <span className="ed-link">{booking.label}</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--ed-line)] text-[var(--ed-accent)] transition-all duration-500 ease-[var(--ease-premium)] group-hover:border-[var(--ed-accent-line)] group-hover:bg-[var(--ed-accent-soft)]">
                <EditorialIcon name="arrow" className="h-3.5 w-3.5" />
              </span>
            </a>
          </div>
        </ScrollReveal>

        <div className="ed-faq lg:col-span-7 lg:col-start-6">
          {faqs.map((faq) => (
            <details
              key={faq.id}
              className="group border-b border-[var(--ed-line)] py-5 first:border-t first:border-[var(--ed-line)]"
            >
              <summary className="ed-serif flex cursor-pointer list-none items-start justify-between gap-6 text-[1.15rem] leading-snug marker:content-none">
                <span>{plainText(faq.question)}</span>
                <span
                  aria-hidden
                  className="mt-1 shrink-0 text-[var(--ed-accent)] transition-transform duration-500 ease-[var(--ease-premium)] group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-[58ch] text-[0.97rem] leading-relaxed text-[var(--ed-fg-70)]">
                {plainText(faq.answer)}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
