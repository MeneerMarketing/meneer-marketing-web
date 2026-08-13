import Image from "next/image";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import type { CineModel } from "@/components/templates/cinematic/cinematicModel";

interface Props {
  model: CineModel;
}

/**
 * Statement met de lessen eronder. Kop links in twee regels, tekst rechts,
 * daaronder filmische kaarten die bij hover hun beschrijving vrijgeven.
 */
export function CinematicClasses({ model }: Props) {
  const { statement, classes, booking } = model;

  return (
    <section id="lessen" className="bg-[var(--cn-cream)]">
      <div className="mx-auto px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <ScrollReveal>
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-16">
            <h2 className="cine-display cine-display-l cine-lower text-[var(--cn-oxblood)]">
              {statement.first}
              <br />
              <span className="cine-italic">{statement.second}</span>
            </h2>
            <p className="max-w-[52ch] text-[13.5px] leading-6 text-[var(--cn-body)] sm:text-[14px] lg:pt-3">
              {statement.body}
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {classes.slice(0, 3).map((item, index) => (
            <ScrollReveal key={item.id} delayMs={index * 90}>
              <a
                href={booking.href}
                {...(booking.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="group relative block h-full overflow-hidden rounded-[1.75rem] bg-[var(--cn-dark)]"
              >
                <div className="relative aspect-[5/6] sm:aspect-[4/5]">
                  {item.image ? (
                    <div className="cine-media absolute inset-0">
                      <Image
                        src={item.image.url}
                        alt={item.image.alt}
                        fill
                        className="object-cover transition-transform duration-[900ms] ease-[var(--cn-ease)] group-hover:scale-[1.05]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  ) : null}

                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-[rgba(20,7,4,0.9)] via-[rgba(20,7,4,0.25)] to-[rgba(20,7,4,0.35)]"
                  />
                  <div
                    aria-hidden
                    className="cine-grain pointer-events-none absolute inset-0"
                  />

                  <div className="absolute inset-x-6 top-6 flex items-start justify-between gap-4">
                    <span className="cine-label text-[var(--cn-on-dark-soft)]">
                      {item.highlight ? "Signatuur" : "Les"}
                    </span>
                    <span className="cine-label text-right text-[var(--cn-on-dark-soft)]">
                      {item.room}
                    </span>
                  </div>

                  <div className="absolute inset-x-6 bottom-6">
                    <div className="flex items-end justify-between gap-4">
                      <h3 className="cine-display cine-lower text-[1.65rem] leading-none text-[var(--cn-on-dark)] sm:text-[1.85rem]">
                        {item.name}
                      </h3>
                      {item.duration ? (
                        <span className="cine-label shrink-0 pb-1 text-[var(--cn-on-dark-soft)]">
                          {item.duration}
                        </span>
                      ) : null}
                    </div>

                    {/* Zonder hover (touch) staat de tekst gewoon open. */}
                    <div className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-[600ms] ease-[var(--cn-ease)] motion-reduce:transition-none sm:grid-rows-[0fr] sm:group-hover:grid-rows-[1fr] sm:group-focus-visible:grid-rows-[1fr]">
                      <div className="overflow-hidden">
                        <p className="max-w-[34ch] pt-3 text-[13px] leading-6 text-[var(--cn-on-dark-soft)]">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/25 pt-4">
                      <span className="cine-label text-[var(--cn-on-dark)]">
                        Meer info
                      </span>
                      <span
                        aria-hidden
                        className="text-[var(--cn-on-dark)] transition-transform duration-500 ease-[var(--cn-ease)] group-hover:translate-x-1.5"
                      >
                        →
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            </ScrollReveal>
          ))}
        </div>

        {classes.length > 3 ? (
          <ScrollReveal delayMs={120}>
            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-[var(--cn-line)] pt-6">
              <span className="cine-label text-[var(--cn-muted)]">
                Ook in de studio
              </span>
              {classes.slice(3).map((item) => (
                <span
                  key={item.id}
                  className="cine-pill cine-pill-ink"
                >
                  {item.name}
                  {item.duration ? (
                    <span className="text-[var(--cn-muted)]">{item.duration}</span>
                  ) : null}
                </span>
              ))}
            </div>
          </ScrollReveal>
        ) : null}
      </div>
    </section>
  );
}
