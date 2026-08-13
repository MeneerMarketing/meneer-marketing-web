import { ScrollReveal } from "@/components/motion/ScrollReveal";
import type { CineModel } from "@/components/templates/cinematic/cinematicModel";

interface Props {
  model: CineModel;
}

/**
 * Tarieven als magazine-spread: open kolommen met haarlijnen ertussen, en één
 * plaat in espresso voor het abonnement dat de studio het meest verkoopt. Geen
 * drie identieke kaarten, want dan kijkt niemand ergens naar.
 */
export function CinematicPricing({ model }: Props) {
  const { plans, booking, primaryService } = model;

  if (plans.length === 0) return null;

  return (
    <section id="tarieven" className="bg-[var(--cn-cream)]">
      <div className="mx-auto px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <ScrollReveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="cine-label text-[var(--cn-muted)]">Tarieven</p>
              <h2 className="cine-display cine-display-l cine-lower mt-5 text-[var(--cn-oxblood)]">
                wat het kost
                <br />
                <span className="cine-italic">en wat je krijgt.</span>
              </h2>
            </div>
            <p className="max-w-[34ch] text-[13.5px] leading-6 text-[var(--cn-body)] sm:text-[14px]">
              Start met een pack en stap over op een membership zodra{" "}
              {primaryService ? primaryService.toLowerCase() : "pilates"} in je week
              past. Je plan loopt per maand, dus je kiest zelf hoe lang je blijft.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-10 grid items-stretch gap-6 sm:mt-14 lg:grid-cols-3 lg:gap-8">
          {plans.map((plan, index) => (
            <ScrollReveal key={plan.id} delayMs={index * 90} className="h-full">
              {plan.featured ? (
                <div className="relative flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-[var(--cn-dark)] p-7 text-[var(--cn-on-dark)] sm:p-8 lg:-mt-4 lg:pb-9">
                  <div
                    aria-hidden
                    className="cine-grain pointer-events-none absolute inset-0"
                  />
                  <div className="relative flex flex-1 flex-col">
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="cine-label text-[var(--cn-on-dark-soft)]">
                        {plan.name}
                      </p>
                      <p className="cine-label text-[var(--cn-on-dark)]">
                        Meest gekozen
                      </p>
                    </div>

                    <p className="cine-display mt-7 text-[3.25rem] leading-none tabular-nums">
                      {plan.price}
                    </p>
                    <p className="cine-label mt-3 text-[var(--cn-on-dark-soft)]">
                      {plan.period}
                    </p>

                    <p className="mt-6 max-w-[32ch] text-[13.5px] leading-6 text-[var(--cn-on-dark-soft)]">
                      {plan.description}
                    </p>

                    <ul className="mt-7 space-y-3 border-t border-white/15 pt-6">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex gap-3 text-[13px] leading-6 text-[var(--cn-on-dark)]"
                        >
                          <span
                            aria-hidden
                            className="mt-[0.65rem] h-[1px] w-4 shrink-0 bg-[rgba(246,241,232,0.55)]"
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto pt-8">
                      <a
                        href={booking.href}
                        {...(booking.external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="cine-pill cine-pill-solid"
                      >
                        {booking.label}
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex h-full flex-col border-t border-[var(--cn-ink)]/25 pt-7">
                  <p className="cine-label text-[var(--cn-muted)]">{plan.name}</p>

                  <p className="cine-display mt-7 text-[3rem] leading-none tabular-nums text-[var(--cn-oxblood)]">
                    {plan.price}
                  </p>
                  <p className="cine-label mt-3 text-[var(--cn-muted)]">
                    {plan.period}
                  </p>

                  <p className="mt-6 max-w-[32ch] text-[13.5px] leading-6 text-[var(--cn-body)]">
                    {plan.description}
                  </p>

                  <ul className="mt-7 space-y-3 border-t border-[var(--cn-line)] pt-6">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex gap-3 text-[13px] leading-6 text-[var(--cn-ink)]"
                      >
                        <span
                          aria-hidden
                          className="mt-[0.65rem] h-[1px] w-4 shrink-0 bg-[var(--cn-clay)]"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-8">
                    <a
                      href={booking.href}
                      {...(booking.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="cine-pill cine-pill-ink"
                    >
                      {booking.label}
                    </a>
                  </div>
                </div>
              )}
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
