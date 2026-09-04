import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { EditorialFigure } from "@/components/templates/editorial/EditorialFigure";
import { EditorialIcon } from "@/components/templates/editorial/EditorialIcon";
import { EditorialSeal } from "@/components/templates/editorial/EditorialSeal";
import type { EditorialModel } from "@/components/templates/editorial/editorialModel";

interface Props {
  about: EditorialModel["about"];
  collage: EditorialModel["collage"];
  seal: EditorialModel["seal"];
  link: { href: string; label: string } | null;
}

/** Tekstkolom en beeldcollage vullen dezelfde hoogte, ook bij dunne copy. */
export function EditorialStudio({ about, collage, seal, link }: Props) {
  const [primary, secondary] = collage;

  return (
    <section id="studio" className="border-b border-[var(--ed-line)]">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-stretch gap-12 px-5 py-20 md:px-10 md:py-24 lg:grid-cols-12 lg:gap-16 lg:px-16 lg:py-32">
        <ScrollReveal className="lg:col-span-6">
          <div className="flex h-full flex-col justify-between">
            <div>
              <p className="ed-label text-[var(--ed-accent)]">De studio</p>
              <h2 className="ed-serif ed-h2 mt-4 max-w-[34ch]">{about.heading}</h2>
              <div className="mt-8 space-y-5">
                {about.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="max-w-[58ch] text-[1rem] leading-relaxed text-[var(--ed-fg-70)] md:text-[1.08rem]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {about.meta.length > 0 || link ? (
              <div className="mt-12 border-t border-[var(--ed-line)] pt-8">
                {about.meta.length > 0 ? (
                  <ul className="flex flex-wrap gap-3">
                    {about.meta.map((item) => (
                      <li
                        key={item.id}
                        className="group flex items-center gap-3.5 rounded-full border border-[var(--ed-line)] px-5 py-2.5 transition-colors duration-500 hover:border-[var(--ed-accent-line)]"
                      >
                        <span
                          aria-hidden
                          className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--ed-accent)] transition-transform duration-700 ease-[var(--ease-premium)] group-hover:scale-150"
                        />
                        <span>
                          <span className="ed-label-xs block text-[var(--ed-fg-52)]">
                            {item.label}
                          </span>
                          <span className="ed-serif block text-[1.05rem] leading-tight">
                            {item.value}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {link ? (
                  <a
                    href={link.href}
                    className="ed-label group mt-8 inline-flex items-center gap-3 text-[var(--ed-fg)]"
                  >
                    <span className="ed-link">{link.label}</span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--ed-line)] text-[var(--ed-accent)] transition-all duration-500 ease-[var(--ease-premium)] group-hover:border-[var(--ed-accent-line)] group-hover:bg-[var(--ed-accent-soft)]">
                      <EditorialIcon name="arrow" className="h-3.5 w-3.5" />
                    </span>
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
        </ScrollReveal>

        {primary ? (
          <ScrollReveal className="lg:col-span-6" delayMs={90}>
            <div className="relative">
              <EditorialFigure
                image={primary}
                parallax
                sizes="(max-width: 1024px) 92vw, 45vw"
                className="aspect-[4/5] md:aspect-[4/3]"
              />
              {secondary ? (
                <EditorialFigure
                  image={secondary}
                  sizes="(max-width: 1024px) 92vw, 22vw"
                  className="mt-4 aspect-[4/3] w-full border-[6px] border-[var(--ed-bg)] md:absolute md:-bottom-12 md:-left-10 md:mt-0 md:aspect-[3/4] md:w-[38%] md:border-8"
                />
              ) : null}
              {seal ? (
                <div className="absolute -top-9 right-5 hidden w-[8.5rem] md:block lg:-right-7 lg:w-[9.5rem]">
                  <EditorialSeal
                    ring={seal.ring}
                    value={seal.value}
                    caption={seal.caption}
                    className="ed-float w-full"
                  />
                </div>
              ) : null}
            </div>
          </ScrollReveal>
        ) : null}
      </div>
    </section>
  );
}
