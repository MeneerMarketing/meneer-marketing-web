import Image from "next/image";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import type { ClinicalJourneyStep } from "@/components/templates/clinical-editorial/clinicalEditorialModel";

const JOURNEY_PHASE_LABELS = ["Intake", "Plan", "Sessie", "Onderhoud"] as const;

export function ClinicalEditorialJourney({
  steps,
  bookingHref,
}: {
  steps: ClinicalJourneyStep[];
  bookingHref: string;
}) {
  if (steps.length === 0) return null;

  return (
    <section id="traject" className="ed-surface">
      <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-24 lg:px-16 lg:py-28">
        <ScrollReveal>
          <p className="ed-label text-[var(--ed-accent)]">Jouw traject</p>
          <h2 className="ed-serif ed-h2 mt-4 max-w-[20ch]">
            Van intake tot nazorg
          </h2>
          <p className="mt-4 max-w-[48ch] text-[15px] leading-relaxed text-[var(--ed-fg-70)]">
            Geen vaste behandeltijd in minuten op de site. Wel een helder pad:
            analyse, plan, behandeling en onderhoud.
          </p>
        </ScrollReveal>

        <div className="mt-14 flex flex-col gap-5">
          {steps.slice(0, 4).map((step, index) => {
            const flip = index % 2 === 1;
            return (
              <ScrollReveal key={step.id} delayMs={index * 80}>
                <article className="grid overflow-hidden border border-[var(--ed-line)] bg-[var(--ed-bg)] lg:grid-cols-12">
                  {step.image ? (
                    <div
                      className={`relative min-h-[14rem] lg:col-span-5 lg:min-h-[20rem] ${
                        flip ? "lg:order-2" : ""
                      }`}
                    >
                      <Image
                        src={step.image.url}
                        alt={step.image.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 40vw"
                      />
                    </div>
                  ) : null}
                  <div
                    className={`flex flex-col justify-center px-7 py-9 sm:px-10 lg:col-span-7 lg:px-14 lg:py-12 ${
                      flip ? "lg:order-1" : ""
                    }`}
                  >
                    <span className="ed-label text-[var(--ed-accent)]">
                      {JOURNEY_PHASE_LABELS[index] ?? "Traject"}
                    </span>
                    <h3 className="ed-serif mt-3 text-[clamp(1.5rem,2.5vw,2.25rem)] tracking-tight">
                      {step.title}
                    </h3>
                    <p className="mt-4 max-w-[48ch] text-[15px] leading-relaxed text-[var(--ed-fg-70)]">
                      {step.body}
                    </p>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <a href={bookingHref} className="ed-label ed-btn inline-flex px-8 py-4">
            Start met gratis intake
          </a>
        </div>
      </div>
    </section>
  );
}

export function ClinicalEditorialAbout({
  studioName,
  city,
  heading,
  lead,
  paragraphs,
  pillars,
  facts,
  image,
  booking,
}: {
  studioName: string;
  city: string;
  heading: string;
  lead: string;
  paragraphs: string[];
  pillars: Array<{ title: string; body: string }>;
  facts: { value: string; label: string }[];
  image: { url: string; alt: string } | null;
  booking: { href: string; external: boolean; label: string };
}) {
  return (
    <section id="over" className="relative overflow-hidden border-b border-[var(--ed-line)] bg-[var(--ed-paper)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.45]"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 100% 0%, color-mix(in srgb, var(--ed-accent-base) 18%, transparent), transparent 70%), radial-gradient(ellipse 50% 40% at 0% 100%, color-mix(in srgb, var(--ed-ink) 6%, transparent), transparent 65%)",
        }}
      />

      <div className="relative mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-24 lg:px-16 lg:py-32">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-10">
          <ScrollReveal className="lg:col-span-6 xl:col-span-5">
            <p className="ed-label text-[var(--ed-accent)]">Over de kliniek</p>
            <h2 className="ed-serif ed-h2 mt-4 text-[clamp(2.4rem,5vw,3.75rem)] leading-[0.95] tracking-tight">
              {heading}
            </h2>
            <p className="mt-6 max-w-[44ch] text-[1.05rem] leading-relaxed text-[var(--ed-fg-70)]">
              {lead}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {pillars.map((pillar, index) => (
                <article
                  key={pillar.title}
                  className="border border-[var(--ed-line)] bg-white/70 p-4 backdrop-blur-sm transition-colors duration-300 hover:border-[var(--ed-accent)]/35"
                  style={{ transitionDelay: `${index * 40}ms` }}
                >
                  <p className="ed-label text-[var(--ed-accent)]">{pillar.title}</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-[var(--ed-fg-70)]">
                    {pillar.body}
                  </p>
                </article>
              ))}
            </div>

            {paragraphs.length > 0 ? (
              <div className="mt-8 space-y-3 border-l-2 border-[var(--ed-accent)]/50 pl-5 text-[15px] leading-relaxed text-[var(--ed-fg-70)]">
                {paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 28)}>{paragraph}</p>
                ))}
              </div>
            ) : null}

            <a
              href={booking.href}
              {...(booking.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="ed-label ed-btn mt-10 inline-flex px-7 py-4"
            >
              {booking.label}
            </a>
          </ScrollReveal>

          <div className="relative lg:col-span-6 xl:col-span-7">
            <ScrollReveal delayMs={80}>
              <div className="relative">
                {image ? (
                  <div className="relative aspect-[4/5] overflow-hidden border border-[var(--ed-line)] shadow-[0_24px_80px_-24px_rgba(42,33,26,0.35)]">
                    <Image
                      src={image.url}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 45vw"
                    />
                  </div>
                ) : null}

                <div className="absolute -bottom-6 left-4 right-4 border border-[var(--ed-line)] bg-white/95 p-5 backdrop-blur-md sm:left-8 sm:right-auto sm:max-w-[20rem]">
                  <p className="ed-label text-[var(--ed-fg-50)]">Waarom {studioName}</p>
                  <p className="ed-serif mt-2 text-xl leading-snug text-[var(--ed-fg)]">
                    Huidanalyse eerst. Behandeling pas als het plan klopt.
                  </p>
                </div>

                {facts.length > 0 ? (
                  <dl className="absolute -right-2 top-6 hidden min-w-[11rem] border border-[var(--ed-line)] bg-[var(--ed-ink)] p-4 text-white shadow-lg lg:block">
                    {facts.slice(0, 2).map((fact) => (
                      <div key={fact.label} className="not-last:mb-4">
                        <dt className="ed-label text-white/55">{fact.label}</dt>
                        <dd className="ed-serif mt-1 text-2xl">{fact.value}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </div>
            </ScrollReveal>
          </div>
        </div>

        {facts.length > 0 ? (
          <ScrollReveal delayMs={120}>
            <dl className="mt-14 grid grid-cols-2 gap-4 border-t border-[var(--ed-line)] pt-8 md:grid-cols-3">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="border border-[var(--ed-line)] bg-white/60 px-5 py-4"
                >
                  <dt className="ed-label text-[var(--ed-fg-50)]">{fact.label}</dt>
                  <dd className="ed-serif mt-2 text-[clamp(1.35rem,2.5vw,2rem)] leading-tight text-[var(--ed-fg)]">
                    {fact.value}
                  </dd>
                  {fact.label === "Locatie" && city ? (
                    <dd className="mt-1 text-xs text-[var(--ed-fg-50)]">{city}</dd>
                  ) : null}
                </div>
              ))}
            </dl>
          </ScrollReveal>
        ) : null}
      </div>
    </section>
  );
}
