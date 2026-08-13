import Image from "next/image";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { plainText } from "@/lib/text";
import type { StudioTeamMember } from "@/types/studio";

interface Props {
  team: StudioTeamMember[];
}

const OFFSETS = ["", "md:mt-14", "md:mt-7", "md:mt-20"];

export function EditorialTeam({ team }: Props) {
  if (team.length === 0) return null;

  return (
    <section className="ed-surface border-b border-[var(--ed-line)]">
      <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-24 lg:px-16 lg:py-28">
        <ScrollReveal>
          <p className="ed-label text-[var(--ed-accent)]">Instructie</p>
          <h2 className="ed-serif ed-h2 mt-4">De mensen op de vloer</h2>
        </ScrollReveal>

        <div className="mt-14 grid gap-10 md:grid-cols-2 md:gap-8 lg:grid-cols-3 lg:gap-10">
          {team.slice(0, 6).map((member, index) => {
            const role = plainText(member.role);

            return (
              <ScrollReveal
                key={member.id}
                delayMs={index * 80}
                className={OFFSETS[index % OFFSETS.length]}
              >
                <article className="group">
                  <div className="relative aspect-[3/4] overflow-hidden bg-[var(--ed-bg-raised)]">
                    {member.image_url ? (
                      <Image
                        src={member.image_url}
                        alt={plainText(member.name)}
                        fill
                        sizes="(max-width: 768px) 92vw, 32vw"
                        className="ed-grade object-cover transition-transform duration-[1300ms] ease-[var(--ease-premium)] group-hover:scale-[1.05]"
                      />
                    ) : null}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-[var(--ed-accent)] opacity-0 mix-blend-multiply transition-opacity duration-700 group-hover:opacity-10"
                    />
                    {role ? (
                      <span className="ed-label-xs absolute bottom-4 left-4 flex items-center gap-2.5 rounded-full bg-[var(--ed-bg-veil)] px-4 py-2 backdrop-blur-[3px] transition-transform duration-700 ease-[var(--ease-premium)] group-hover:-translate-y-1">
                        <span
                          aria-hidden
                          className="h-1.5 w-1.5 rounded-full bg-[var(--ed-accent)]"
                        />
                        {role}
                      </span>
                    ) : null}
                  </div>

                  <h3 className="ed-serif mt-6 text-[1.5rem] leading-tight">
                    {plainText(member.name)}
                  </h3>
                  <span
                    aria-hidden
                    className="mt-3 block h-px w-full origin-left scale-x-[0.12] bg-[var(--ed-accent-line)] transition-transform duration-700 ease-[var(--ease-premium)] group-hover:scale-x-100"
                  />
                  <p className="mt-4 max-w-[42ch] text-[0.94rem] leading-relaxed text-[var(--ed-fg-70)]">
                    {plainText(member.bio)}
                  </p>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
