import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { EditorialIcon } from "@/components/templates/editorial/EditorialIcon";
import { EditorialSpotlightCard } from "@/components/templates/editorial/EditorialSpotlightCard";
import type { EditorialModel } from "@/components/templates/editorial/editorialModel";
import { formatDisplayLabel, plainText } from "@/lib/text";
import type { StudioMembership, StudioService } from "@/types/studio";

interface Props {
  memberships: StudioMembership[];
  services: StudioService[];
  booking: EditorialModel["booking"];
  pricingNote: string | null;
}

type CtaVariant = "solid" | "outline" | "compact";

const CTA_STYLES: Record<CtaVariant, string> = {
  solid: "bg-[var(--ed-fg)] px-8 py-4 text-[var(--ed-bg)]",
  outline:
    "border border-[var(--ed-line-strong)] px-7 py-3.5 text-[var(--ed-fg)]",
  compact:
    "border border-[var(--ed-line-strong)] px-5 py-2.5 text-[10px] text-[var(--ed-fg)]",
};

function Cta({
  booking,
  label,
  variant,
}: {
  booking: EditorialModel["booking"];
  label: string;
  variant: CtaVariant;
}) {
  return (
    <a
      href={booking.href}
      {...(booking.external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className={`ed-label ed-btn group inline-flex items-center justify-center gap-2.5 rounded-full transition-colors duration-300 hover:text-white ${CTA_STYLES[variant]}`}
    >
      {label}
      <EditorialIcon
        name="arrow"
        className="h-3.5 w-3.5 transition-transform duration-500 ease-[var(--ease-premium)] group-hover:translate-x-1"
      />
    </a>
  );
}

function Check() {
  return (
    <span
      aria-hidden
      className="mt-[2px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--ed-accent-soft)] text-[var(--ed-accent)]"
    >
      <EditorialIcon name="check" className="h-3 w-3" strokeWidth={2.1} />
    </span>
  );
}

/** Tarieven voor huidkliniek editorial. Geen Pilates-poses of genummerde badges. */
export function ClinicalEditorialPricing({
  memberships,
  services,
  booking,
  pricingNote,
}: Props) {
  const hasMemberships = memberships.length > 0;
  if (!hasMemberships && services.length === 0) return null;

  const plans = memberships.slice(0, 4);
  const hero = plans.find((plan) => plan.featured) ?? plans[0];
  const rest = plans.filter((plan) => plan.id !== hero?.id);

  return (
    <section id="tarieven" className="ed-deep relative overflow-hidden">
      <span aria-hidden className="ed-glow pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-24 lg:px-16 lg:py-28">
        <ScrollReveal>
          <p className="ed-label text-[var(--ed-accent)]">
            {hasMemberships ? "Pakketten & tarieven" : "Behandelingen"}
          </p>
          <h2 className="ed-serif ed-h2 mt-4 max-w-[34ch]">
            {hasMemberships
              ? "Kies het traject dat bij je huid past"
              : "Behandelingen en indicatieve tarieven"}
          </h2>
          {pricingNote ? (
            <p className="mt-5 max-w-[52ch] text-[1rem] leading-relaxed text-[var(--ed-fg-70)]">
              {pricingNote}
            </p>
          ) : null}
        </ScrollReveal>

        {hero ? (
          <ScrollReveal delayMs={70} className="mt-14">
            <EditorialSpotlightCard className="ed-light overflow-hidden rounded-[22px] p-7 md:p-10 lg:p-12">
              <span
                aria-hidden
                className="ed-sheen absolute inset-x-0 top-0 z-10 h-[2px]"
              />

              <div className="relative z-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
                <div className="lg:col-span-6">
                  {hero.featured ? (
                    <span className="ed-label-xs inline-flex items-center gap-2.5 rounded-full border border-[var(--ed-accent-line)] px-4 py-1.5 text-[var(--ed-accent)]">
                      <span
                        aria-hidden
                        className="h-1.5 w-1.5 rounded-full bg-[var(--ed-accent)]"
                      />
                      Meest gekozen
                    </span>
                  ) : null}

                  <h3
                    className={`ed-serif text-[clamp(1.8rem,2.8vw,2.5rem)] leading-[1.06] tracking-tight ${
                      hero.featured ? "mt-7" : ""
                    }`}
                  >
                    {formatDisplayLabel(plainText(hero.name))}
                  </h3>

                  <div className="mt-8 flex items-end gap-3.5">
                    <p className="ed-serif text-[clamp(3rem,5vw,4.2rem)] leading-none tracking-tight">
                      {plainText(hero.price_label)}
                    </p>
                    <p className="ed-label pb-2.5 text-[var(--ed-fg-52)]">
                      {plainText(hero.period)}
                    </p>
                  </div>

                  <p className="mt-7 max-w-[46ch] border-t border-[var(--ed-line)] pt-7 text-[1rem] leading-relaxed text-[var(--ed-fg-70)]">
                    {plainText(hero.description)}
                  </p>
                </div>

                <div className="lg:col-span-6 lg:border-l lg:border-[var(--ed-line)] lg:pl-14">
                  <p className="ed-label text-[var(--ed-fg-52)]">Inbegrepen</p>
                  <ul className="mt-5 divide-y divide-[var(--ed-line)]">
                    {hero.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3.5 py-4 text-[0.98rem] leading-snug text-[var(--ed-fg-70)]"
                      >
                        <Check />
                        <span>{plainText(feature)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="relative z-10 mt-10 flex flex-col gap-6 border-t border-[var(--ed-line)] pt-8 sm:flex-row sm:items-center sm:justify-between">
                <Cta booking={booking} label={booking.label} variant="solid" />
                {booking.external ? (
                  <p className="ed-label flex items-center gap-2.5 text-[var(--ed-fg-52)]">
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 rounded-full bg-[var(--ed-accent)]"
                    />
                    Online te boeken
                  </p>
                ) : null}
              </div>
            </EditorialSpotlightCard>
          </ScrollReveal>
        ) : null}

        {rest.length > 0 ? (
          <ScrollReveal delayMs={140} className="mt-5">
            <div className="overflow-hidden rounded-[22px] border border-[var(--ed-line)]">
              <p className="ed-label border-b border-[var(--ed-line)] px-7 py-5 text-[var(--ed-fg-52)] md:px-10">
                Overige pakketten
              </p>

              <ul className="divide-y divide-[var(--ed-line)]">
                {rest.map((plan, index) => (
                  <li
                    key={plan.id}
                    className="group flex flex-col gap-6 px-7 py-7 transition-colors duration-500 md:flex-row md:items-center md:justify-between md:px-10 hover:bg-[var(--ed-bg-raised)]"
                  >
                    <div className="min-w-0">
                      <h3 className="ed-serif text-[1.35rem] leading-tight md:text-[1.5rem]">
                        {formatDisplayLabel(plainText(plan.name))}
                      </h3>

                      <p className="mt-3.5 max-w-[54ch] text-[0.93rem] leading-relaxed text-[var(--ed-fg-70)]">
                        {plainText(plan.description)}
                      </p>

                      {plan.features.length > 0 ? (
                        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2.5">
                          {plan.features.slice(0, 4).map((feature) => (
                            <li
                              key={feature}
                              className="flex items-center gap-2 text-[0.86rem] text-[var(--ed-fg-52)]"
                            >
                              <EditorialIcon
                                name="check"
                                className="h-3 w-3 text-[var(--ed-accent)]"
                                strokeWidth={2.1}
                              />
                              {plainText(feature)}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>

                    <div className="flex shrink-0 items-center gap-6 md:pl-8">
                      <div className="md:text-right">
                        <p className="ed-serif text-[1.9rem] leading-none tracking-tight">
                          {plainText(plan.price_label)}
                        </p>
                        <p className="ed-label mt-2 text-[var(--ed-fg-52)]">
                          {plainText(plan.period)}
                        </p>
                      </div>
                      <Cta booking={booking} label="Kies" variant="compact" />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        ) : null}

        {!hasMemberships ? (
          <>
            <div className="mt-12 grid gap-4 md:grid-cols-2">
              {services.map((service, index) => {
                const name = formatDisplayLabel(plainText(service.name));

                return (
                  <ScrollReveal key={service.id} delayMs={index * 70}>
                    <article className="group flex h-full flex-col rounded-[20px] border border-[var(--ed-line)] p-7 transition-colors duration-500 md:p-9 hover:border-[var(--ed-accent-line)] hover:bg-[var(--ed-bg-raised)]">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="ed-serif ed-h3 min-w-0">{name}</h3>
                        {service.duration_minutes ? (
                          <span className="ed-label shrink-0 rounded-full border border-[var(--ed-line)] px-3.5 py-1.5 text-[var(--ed-fg-52)]">
                            {`${service.duration_minutes} min`}
                          </span>
                        ) : null}
                      </div>

                      <p className="mt-5 flex-1 text-[0.95rem] leading-relaxed text-[var(--ed-fg-70)]">
                        {plainText(service.description)}
                      </p>

                      <span
                        aria-hidden
                        className="mt-7 h-px w-full origin-left scale-x-0 bg-[var(--ed-accent-line)] transition-transform duration-700 ease-[var(--ease-premium)] group-hover:scale-x-100"
                      />
                    </article>
                  </ScrollReveal>
                );
              })}
            </div>

            <div className="mt-10">
              <Cta booking={booking} label={booking.label} variant="solid" />
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
