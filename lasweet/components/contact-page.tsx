import Image from "next/image";
import Link from "next/link";
import {
  InstagramLogoIcon,
  MapPinIcon,
  ClockIcon,
  TiktokLogoIcon,
  PaperPlaneTiltIcon,
  CookieIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/reveal";
import openSign from "@/public/photos/open-sign.png";
import pourStrawberry from "@/public/photos/pour-strawberry.png";

const INSTAGRAM = "https://www.instagram.com/la.sweetbyela";
const TIKTOK = "https://www.tiktok.com/@la.sweetbyela";
const MAPS =
  "https://www.google.com/maps/search/?api=1&query=Haaksbergerstraat+302+Enschede";

export function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pb-12 pt-6 md:pb-20 md:pt-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 top-20 size-[420px] rounded-full bg-beige-mist blur-3xl"
        />

        <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 px-5 md:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <div>
            <Reveal>
              <span className="inline-block rounded-full border border-ink/10 bg-parchment px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-ink-soft sm:px-4 sm:py-2 sm:text-[11px]">
                Enschede · Haaksbergerstraat
              </span>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="mt-5 font-display text-5xl font-semibold leading-[0.92] tracking-[-0.06em] text-ink sm:text-6xl xl:text-7xl">
                Zeg <span className="font-semibold text-matcha">hallo</span>.
                <br />
                Of kom gewoon
                <br />
                even langs.
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-6 max-w-md text-base leading-relaxed text-ink-soft md:text-lg">
                Bestellingen gaan via Instagram. Walk-in kan op zaterdag. En
                als je gewoon wilt babbelen over cookies: DM staat open.
              </p>
            </Reveal>

            <Reveal delay={0.22}>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={INSTAGRAM}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-matcha px-7 py-4 text-[13px] font-bold uppercase tracking-[0.12em] text-cream transition-all duration-300 hover:bg-matcha-deep active:scale-[0.98]"
                >
                  <InstagramLogoIcon size={18} weight="fill" />
                  Stuur een DM
                </a>
                <a
                  href={MAPS}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-7 py-4 text-[13px] font-bold uppercase tracking-[0.12em] text-ink transition-colors duration-300 hover:border-matcha hover:text-matcha-deep active:scale-[0.98]"
                >
                  <MapPinIcon size={18} weight="fill" />
                  Route plannen
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[400px]">
              <div
                aria-hidden="true"
                className="absolute inset-3 translate-x-2 translate-y-3 -rotate-6 rounded-[2rem] bg-parchment"
              />
              <div className="relative rotate-3 overflow-hidden rounded-[2.5rem] shadow-[0_40px_90px_-30px_rgba(68,57,43,0.45)] transition-transform duration-500 hover:rotate-1">
                <div className="relative aspect-[4/5]">
                  <Image
                    src={openSign}
                    alt="Open-bordje van Lá Sweet by Ela in Enschede"
                    fill
                    priority
                    quality={95}
                    sizes="(max-width: 640px) 340px, 400px"
                    className="object-cover"
                  />
                </div>
              </div>
              <span className="absolute -left-2 bottom-10 z-10 rotate-[-8deg] rounded-full bg-beige px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-ink shadow-lg sm:-left-4">
                DM me
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Info cards */}
      <section className="stripe-bg py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-5 px-5 md:grid-cols-2 md:px-10 lg:grid-cols-3 lg:gap-6">
          <Reveal>
            <a
              href={MAPS}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col rounded-[1.75rem] border border-ink/10 bg-cream p-7 shadow-[0_20px_50px_-30px_rgba(68,57,43,0.35)] transition-transform duration-300 hover:-translate-y-1 hover:rotate-[-1deg] md:p-8"
            >
              <span className="flex size-12 items-center justify-center rounded-full bg-matcha text-cream">
                <MapPinIcon size={22} weight="fill" />
              </span>
              <h2 className="mt-5 font-display text-2xl font-semibold tracking-[-0.04em] text-ink">
                Bezoek
              </h2>
              <p className="mt-3 text-base leading-relaxed text-ink-soft">
                Haaksbergerstraat 302
                <br />
                7513 EH Enschede
              </p>
              <span className="mt-auto pt-6 text-[12px] font-bold uppercase tracking-[0.14em] text-matcha-deep transition-transform duration-300 group-hover:translate-x-1">
                Open in Maps &rarr;
              </span>
            </a>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="flex h-full flex-col rounded-[1.75rem] border border-ink/10 bg-cream p-7 shadow-[0_20px_50px_-30px_rgba(68,57,43,0.35)] transition-transform duration-300 hover:-translate-y-1 hover:rotate-[1deg] md:p-8">
              <span className="flex size-12 items-center justify-center rounded-full bg-matcha-deep text-cream">
                <ClockIcon size={22} weight="fill" />
              </span>
              <h2 className="mt-5 font-display text-2xl font-semibold tracking-[-0.04em] text-ink">
                Walk-in
              </h2>
              <p className="mt-3 text-base leading-relaxed text-ink-soft">
                Zaterdag van 14:00 tot 20:00 kun je binnenlopen voor iced matcha
                en crumble cookies. Doordeweeks vooral op bestelling. Check Insta
                als de uren een keer afwijken.
              </p>
              <p className="mt-auto pt-6 text-[12px] font-bold uppercase tracking-[0.14em] text-ink-soft">
                Check Insta voor updates
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.14}>
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col rounded-[1.75rem] bg-matcha-deep p-7 text-cream shadow-[0_20px_50px_-28px_rgba(111,3,19,0.55)] transition-transform duration-300 hover:-translate-y-1 hover:rotate-[-1deg] md:col-span-2 md:p-8 lg:col-span-1"
            >
              <span className="flex size-12 items-center justify-center rounded-full bg-cream text-matcha-deep">
                <PaperPlaneTiltIcon size={22} weight="fill" />
              </span>
              <h2 className="mt-5 font-display text-2xl font-semibold tracking-[-0.04em]">
                Bestellen
              </h2>
              <p className="mt-3 text-base leading-relaxed text-cream/80">
                Box vanaf 4 cookies, afhalen in Enschede. Stuur je wensen in een
                DM, dan regelen we de rest.
              </p>
              <span className="mt-auto pt-6 text-[12px] font-bold uppercase tracking-[0.14em] text-parchment transition-transform duration-300 group-hover:translate-x-1">
                @la.sweetbyela &rarr;
              </span>
            </a>
          </Reveal>
        </div>
      </section>

      {/* Social + open sign */}
      <section className="bg-cream py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 px-5 md:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <div className="relative mx-auto w-full max-w-[280px] -rotate-3 sm:max-w-[320px]">
              <div className="overflow-hidden rounded-[2rem] border-[6px] border-parchment shadow-[0_28px_70px_-28px_rgba(68,57,43,0.4)]">
                <div className="relative aspect-square">
                  <Image
                    src={pourStrawberry}
                    alt="Strawberry matcha wordt ingeschonken bij Lá Sweet"
                    fill
                    quality={90}
                    sizes="320px"
                    className="object-cover"
                  />
                </div>
              </div>
              <span className="absolute -right-3 top-6 rotate-6 rounded-full bg-matcha px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-cream shadow-lg">
                Fresh layers
              </span>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <h2 className="font-display text-4xl font-semibold leading-[0.94] tracking-[-0.05em] text-ink md:text-5xl">
                Volg het <span className="font-semibold text-matcha">bakken</span>.
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-ink-soft">
                Nieuwe smaken, drops en zaterdag-updates zie je als eerste op
                TikTok en Instagram.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href={INSTAGRAM}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 rounded-full border border-ink/15 bg-white px-6 py-4 transition-colors hover:border-matcha hover:bg-matcha-mist"
                >
                  <span className="flex size-10 items-center justify-center rounded-full bg-matcha text-cream">
                    <InstagramLogoIcon size={18} weight="fill" />
                  </span>
                  <span>
                    <span className="block font-display text-lg font-bold text-ink">
                      Instagram
                    </span>
                    <span className="text-sm text-ink-soft">@la.sweetbyela</span>
                  </span>
                </a>
                <a
                  href={TIKTOK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 rounded-full border border-ink/15 bg-white px-6 py-4 transition-colors hover:border-matcha hover:bg-matcha-mist"
                >
                  <span className="flex size-10 items-center justify-center rounded-full bg-ink text-cream">
                    <TiktokLogoIcon size={18} weight="fill" />
                  </span>
                  <span>
                    <span className="block font-display text-lg font-bold text-ink">
                      TikTok
                    </span>
                    <span className="text-sm text-ink-soft">@la.sweetbyela</span>
                  </span>
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.16}>
              <Link
                href="/bestellen"
                className="mt-8 inline-flex items-center gap-2 font-display text-lg font-bold text-matcha-deep transition-colors hover:text-matcha"
              >
                <CookieIcon size={22} weight="fill" />
                Liever meteen een box bestellen?
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
