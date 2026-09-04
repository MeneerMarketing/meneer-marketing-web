import Image from "next/image";
import {
  CalendarCheckIcon,
  CookieIcon,
  CoffeeIcon,
  InstagramLogoIcon,
  StorefrontIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/reveal";
import { OrderBuilder } from "@/components/order-builder";
import cookieBoxTop from "@/public/photos/cookie-box-top.png";

const FACTS = [
  {
    icon: CookieIcon,
    title: "Cookies vanaf 4",
    text: "Mix smaken in één box. Ela bakt ze vers voor jouw moment.",
  },
  {
    icon: CoffeeIcon,
    title: "Matcha op locatie",
    text: "Iced matcha drink je bij Ela. Walk-in op zaterdag.",
  },
  {
    icon: CalendarCheckIcon,
    title: "Even vooruit plannen",
    text: "Afhalen alleen op zaterdag. Dan staat jouw box klaar.",
  },
  {
    icon: StorefrontIcon,
    title: "Afhalen in Enschede",
    text: "Haaksbergerstraat 302. Zaterdag ook walk-in zonder bestelling.",
  },
] as const;

export function OrderPage() {
  return (
    <>
      <section className="relative overflow-hidden pb-10 pt-6 md:pb-14 md:pt-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-10 size-[380px] rounded-full bg-beige-mist blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-28 bottom-0 size-[280px] rounded-full bg-beige/20 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 px-5 md:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <div>
            <Reveal>
              <span className="inline-block rounded-full border border-ink/10 bg-parchment px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                Bestellen · Enschede
              </span>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="mt-5 font-display text-5xl font-semibold leading-[0.92] tracking-[-0.06em] text-ink sm:text-6xl xl:text-7xl">
                Stel jouw{" "}
                <span className="font-semibold text-matcha">box</span> samen.
              </h1>
            </Reveal>

            <Reveal delay={0.14}>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-ink-soft md:text-lg">
                Kies je cookie-smaken en aantallen, pak een zaterdag om af te
                halen, en rond je bestelling af. Matcha drink je op locatie.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#bestelformulier"
                  className="inline-flex items-center gap-2 rounded-full bg-matcha px-7 py-4 text-[13px] font-bold uppercase tracking-[0.12em] text-cream transition-all duration-300 hover:bg-matcha-deep active:scale-[0.98]"
                >
                  Start je bestelling
                </a>
                <a
                  href="https://ig.me/m/la.sweetbyela"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-7 py-4 text-[13px] font-bold uppercase tracking-[0.12em] text-ink transition-colors duration-300 hover:border-matcha hover:text-matcha-deep active:scale-[0.98]"
                >
                  <InstagramLogoIcon size={18} weight="fill" />
                  Liever direct DM
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[380px]">
              <div
                aria-hidden="true"
                className="absolute inset-3 -translate-x-2 translate-y-3 rotate-6 rounded-[2rem] bg-parchment"
              />
              <div className="relative -rotate-3 overflow-hidden rounded-[2.5rem] shadow-[0_40px_90px_-30px_rgba(68,57,43,0.45)] transition-transform duration-500 hover:rotate-0">
                <div className="relative aspect-[4/5]">
                  <Image
                    src={cookieBoxTop}
                    alt="Lá Sweet cookie box van boven, klaar om te bestellen"
                    fill
                    priority
                    quality={95}
                    sizes="(max-width: 640px) 340px, 380px"
                    className="object-cover"
                  />
                </div>
              </div>
              <span className="absolute -right-2 top-8 z-10 rotate-6 rounded-full bg-beige px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-ink shadow-lg sm:-right-4">
                Fresh batch
              </span>
              <span className="absolute -left-2 bottom-12 z-10 -rotate-6 rounded-full bg-matcha px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-cream shadow-lg">
                Vanaf 4
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="stripe-bg py-10 lg:py-14">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-4 px-5 sm:grid-cols-2 md:px-10 lg:grid-cols-4">
          {FACTS.map((fact, index) => (
            <Reveal key={fact.title} delay={0.04 * index}>
              <div className="flex h-full items-start gap-3 rounded-2xl border border-ink/10 bg-cream/80 p-5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-beige-mist text-beige-deep">
                  <fact.icon size={18} weight="fill" />
                </span>
                <div>
                  <p className="font-display text-base font-bold text-ink">
                    {fact.title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                    {fact.text}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section
        id="bestelformulier"
        className="bg-cream py-16 lg:py-24"
      >
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-5 md:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <h2 className="font-display text-4xl font-semibold leading-[0.94] tracking-[-0.05em] text-ink md:text-5xl">
                Jouw smaken.{" "}
                <span className="font-semibold text-matcha">Jouw box.</span>
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-ink-soft">
                Vul je cookie box in, kies een zaterdag om af te halen, en rond
                je bestelling af. Ela bevestigt of de batch lukt.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-8 space-y-3">
                <div className="rounded-2xl border border-ink/10 bg-white/70 p-5">
                  <p className="font-display text-lg font-bold text-ink">
                    Hoe werkt het?
                  </p>
                  <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-soft">
                    <li>Kies cookies met de + knoppen (vanaf 4).</li>
                    <li>Kies een zaterdag om af te halen.</li>
                    <li>Rond af met bestellen en betalen.</li>
                  </ul>
                </div>
                <div className="rounded-2xl bg-matcha-deep p-5 text-cream">
                  <p className="font-display text-lg font-bold">
                    Walk-in op zaterdag
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-cream/80">
                    Geen pre-order nodig tussen 14:00 en 20:00. Op is op, dus
                    bestellen blijft de slimste route voor een volle box.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.08}>
            <OrderBuilder />
          </Reveal>
        </div>
      </section>
    </>
  );
}
