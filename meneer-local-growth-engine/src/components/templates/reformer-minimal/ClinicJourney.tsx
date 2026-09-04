import Image from "next/image";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { CLINIC_CURATED_IMAGE_POOL } from "@/lib/previewImagePolicy";
import type { ClinicStep } from "@/components/templates/reformer-minimal/clinicModel";

interface Props {
  steps: ClinicStep[];
}

/**
 * Traject als zigzag-bands met foto i.p.v. icons.
 * Pose-icons horen bij de tarieven.
 */
export function ClinicJourney({ steps }: Props) {
  if (steps.length === 0) return null;

  return (
    <section className="fc-plane-010">
      <div className="mx-auto px-5 py-20 sm:px-8 lg:px-[5vw] lg:py-28">
        <ScrollReveal>
          <p className="figma-label text-[var(--fc-label)]">Traject</p>
          <h2 className="figma-display-l mt-4 max-w-[18ch] lg:max-w-none lg:whitespace-nowrap">
            <span className="font-bold">Wat kun je</span>{" "}
            <span className="font-light">verwachten</span>
          </h2>
          <p className="mt-4 max-w-[42ch] text-[15px] leading-7 text-[var(--fc-ink-soft)]">
            Dit voel je meteen in de studio. Scherp, rustig en gericht op jou.
          </p>
        </ScrollReveal>

        <div className="mt-14 flex flex-col gap-4 lg:gap-5">
          {steps.slice(0, 4).map((step, index) => {
            const flip = index % 2 === 1;
            const image = step.image ?? CLINIC_CURATED_IMAGE_POOL[index % CLINIC_CURATED_IMAGE_POOL.length]!;

            return (
              <ScrollReveal key={step.id} delayMs={index * 90}>
                <article className="group relative grid overflow-hidden rounded-[var(--fc-radius-lg)] bg-[var(--fc-mist)] lg:grid-cols-12">
                  <div
                    className={`relative min-h-[12rem] overflow-hidden bg-[var(--fc-paper)] sm:min-h-[14rem] lg:col-span-5 lg:min-h-[18rem] ${
                      flip ? "lg:order-2" : ""
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="object-cover transition-transform duration-700 ease-[var(--fc-ease)] group-hover:scale-[1.03]"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                  </div>

                  <div
                    className={`flex flex-col justify-center px-7 py-8 sm:px-9 sm:py-10 lg:col-span-7 lg:px-12 ${
                      flip ? "lg:order-1" : ""
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="figma-label rounded-full bg-[var(--fc-paper)] px-3 py-1 text-[var(--fc-accent-deep)]">
                        {labelForIndex(index)}
                      </span>
                    </div>
                    <h3 className="mt-4 text-[clamp(1.45rem,2.4vw,2rem)] font-semibold tracking-tight text-[var(--fc-ink)]">
                      {step.title}
                    </h3>
                    <p className="mt-3 max-w-[46ch] text-[15px] leading-7 text-[var(--fc-ink-soft)] sm:text-[16px]">
                      {step.body}
                    </p>
                    <span
                      aria-hidden
                      className="mt-8 h-px w-16 bg-[var(--fc-accent-deep)] transition-all duration-700 ease-[var(--fc-ease)] group-hover:w-28"
                    />
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function labelForIndex(index: number): string {
  const labels = ["In de les", "In de groep", "In de cues", "In de ruimte"];
  return labels[index] ?? "In de studio";
}
