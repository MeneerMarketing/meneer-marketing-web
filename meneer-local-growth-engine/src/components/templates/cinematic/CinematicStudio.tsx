import Image from "next/image";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import type { CineModel } from "@/components/templates/cinematic/cinematicModel";

interface Props {
  model: CineModel;
  variant?: "pilates" | "skin-clinic";
}

/**
 * De studio als dubbelpagina: beeldcompositie links, kolom met kop, cijfers en
 * korte notities rechts. Het kleine beeld valt over het grote heen, zoals een
 * ingeplakte foto in een magazine.
 */
export function CinematicStudio({ model, variant = "pilates" }: Props) {
  const { studio, hours, contact } = model;

  return (
    <section id={variant === "skin-clinic" ? "kliniek" : "studio"} className="bg-[var(--cn-cream-2)]">
      <div className="mx-auto px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-stretch lg:gap-16">
          <ScrollReveal className="h-full">
            <div className="relative h-full pb-14 sm:pb-16">
              {studio.main ? (
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-[var(--cn-dark)] sm:aspect-[5/4] lg:aspect-auto lg:h-full lg:min-h-[28rem]">
                  <div className="cine-media absolute inset-0">
                    <Image
                      src={studio.main.url}
                      alt={studio.main.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 46vw"
                    />
                  </div>
                  <div
                    aria-hidden
                    className="cine-grain pointer-events-none absolute inset-0"
                  />
                </div>
              ) : null}

              {studio.inset ? (
                <div className="absolute bottom-0 right-6 w-[44%] max-w-[13rem] overflow-hidden rounded-[1.25rem] ring-[6px] ring-[var(--cn-cream-2)] sm:right-10">
                  <div className="relative aspect-[4/5]">
                    <div className="cine-media absolute inset-0">
                      <Image
                        src={studio.inset.url}
                        alt={studio.inset.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 46vw, 20vw"
                      />
                    </div>
                    <div
                      aria-hidden
                      className="cine-grain pointer-events-none absolute inset-0"
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={90} className="h-full">
            <div className="flex h-full flex-col">
              <p className="cine-label text-[var(--cn-muted)]">
                {variant === "skin-clinic" ? "De kliniek" : "De studio"}
              </p>
              <h2 className="cine-display cine-display-l cine-lower mt-5 text-[var(--cn-oxblood)]">
                {studio.first}
                <br />
                <span className="cine-italic">{studio.second}</span>
              </h2>

              <p className="mt-6 max-w-[54ch] text-[13.5px] leading-6 text-[var(--cn-body)] sm:text-[14.5px] sm:leading-7">
                {studio.body}
              </p>

              {studio.facts.length > 0 ? (
                <dl className="mt-9 flex flex-wrap gap-x-12 gap-y-6 border-y border-[var(--cn-line)] py-7">
                  {studio.facts.map((fact) => (
                    <div key={fact.label}>
                      <dd className="cine-display text-[2.1rem] leading-none tabular-nums text-[var(--cn-ink)]">
                        {fact.value}
                      </dd>
                      <dt className="cine-label mt-2 text-[var(--cn-muted)]">
                        {fact.label}
                      </dt>
                    </div>
                  ))}
                </dl>
              ) : null}

              {studio.notes.length > 0 ? (
                <ul className="mt-2">
                  {studio.notes.map((note) => (
                    <li
                      key={note.id}
                      className="border-b border-[var(--cn-line)] py-5"
                    >
                      <p className="cine-display cine-lower text-[1.25rem] leading-none text-[var(--cn-clay)]">
                        {note.title}
                      </p>
                      <p className="mt-2 max-w-[48ch] text-[13px] leading-6 text-[var(--cn-body)]">
                        {note.body}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="mt-auto flex flex-col gap-2 pt-8 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
                {contact.address ? (
                  <p className="cine-label max-w-[24ch] leading-5 text-[var(--cn-muted)]">
                    {contact.address}
                  </p>
                ) : null}
                {hours ? (
                  <p className="cine-label max-w-[26ch] leading-5 text-[var(--cn-muted)] sm:text-right">
                    {hours}
                  </p>
                ) : null}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
