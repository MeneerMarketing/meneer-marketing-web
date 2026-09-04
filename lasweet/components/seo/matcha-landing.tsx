import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { MatchaFlavourPicker } from "@/components/seo/matcha-flavour-picker";
import { SeoFaq } from "@/components/seo/seo-faq";
import { TiltedPhoto } from "@/components/seo/tilted-photo";
import { VisitPanel } from "@/components/seo/visit-panel";
import { MATCHA_FAQS } from "@/lib/seo";
import { SITE } from "@/lib/site";
import heroPour from "@/public/photos/hero-pour.png";
import pourStrawberry from "@/public/photos/pour-strawberry.png";
import cupsStack from "@/public/photos/cups-stack.png";
import matchaPowder from "@/public/photos/matcha-powder-gold.png";
import elaDrinks from "@/public/photos/ela-drinks-sip.png";

const STICKERS = [
  { label: "Strawberry viral", tilt: "-rotate-2", tone: "berry" as const },
  { label: "Iced matcha", tilt: "rotate-3", tone: "matcha" as const },
  { label: "Enschede", tilt: "-rotate-1", tone: "cream" as const },
];

function stickerClass(tone: "berry" | "matcha" | "cream"): string {
  if (tone === "berry") return "bg-beige text-ink";
  if (tone === "matcha") return "bg-matcha text-cream";
  return "bg-cream text-matcha-deep border border-ink/10";
}

export function MatchaLanding() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pb-12 pt-6 md:pb-20 md:pt-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-10 size-[380px] rounded-full bg-beige-mist blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-16 bottom-0 size-[260px] rounded-full bg-beige/25 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 px-5 md:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <div>
            <Reveal>
              <span className="inline-block rounded-full border border-ink/10 bg-parchment px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                Matcha · Enschede · {SITE.handle}
              </span>
            </Reveal>

            <Reveal delay={0.06}>
              <h1 className="mt-5 font-display text-5xl font-semibold leading-[0.92] tracking-[-0.06em] text-ink sm:text-6xl xl:text-7xl">
                Matcha in{" "}
                <span className="font-semibold text-matcha">Enschede</span>
                <span className="block text-[0.72em] font-bold text-ink-soft sm:mt-1">
                  iced, strawberry &amp; meer
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft md:text-lg">
                Zoek je matcha in Enschede? Bij Lá Sweet by Ela drink je iced
                matcha en strawberry matcha die per laagje wordt opgebouwd.
                Vers opgeklopt door Ela, bekend van TikTok, af te halen aan de{" "}
                {SITE.streetAddress}.
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/bestellen"
                  className="inline-flex items-center gap-2 rounded-full bg-matcha px-7 py-4 text-[13px] font-bold uppercase tracking-[0.12em] text-cream transition-all duration-300 hover:bg-matcha-deep active:scale-[0.98]"
                >
                  Matcha bestellen
                </Link>
                <Link
                  href="/#matcha"
                  className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-7 py-4 text-[13px] font-bold uppercase tracking-[0.12em] text-ink transition-colors duration-300 hover:border-matcha hover:text-matcha-deep active:scale-[0.98]"
                >
                  Bekijk menukaart
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.22}>
              <div className="mt-8 flex flex-wrap gap-2">
                {STICKERS.map((sticker) => (
                  <span
                    key={sticker.label}
                    className={`inline-block rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] shadow-sm ${sticker.tilt} ${stickerClass(sticker.tone)}`}
                  >
                    {sticker.label}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <TiltedPhoto
              src={heroPour}
              alt="Strawberry matcha enschede: iced matcha wordt ingeschonken bij Lá Sweet by Ela"
              priority
              tilt="right"
            />
          </Reveal>
        </div>
      </section>

      {/* Quick facts */}
      <section className="stripe-bg py-10 lg:py-14">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-4 px-5 sm:grid-cols-3 md:px-10">
          {[
            {
              label: "Waar",
              text: `${SITE.streetAddress}, ${SITE.addressLocality}`,
            },
            {
              label: "Walk-in",
              text: `Zaterdag ${SITE.walkInOpens}-${SITE.walkInCloses}`,
            },
            {
              label: "Prijzen",
              text: "Iced matcha €5,50 · flavored €6,50",
            },
          ].map((fact, index) => (
            <Reveal key={fact.label} delay={0.04 * index}>
              <div className="h-full rounded-2xl border border-ink/10 bg-cream/85 p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft">
                  {fact.label}
                </p>
                <p className="mt-2 font-display text-lg font-bold leading-snug text-ink">
                  {fact.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Interactive picker + story */}
      <section className="bg-cream py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-stretch gap-10 px-5 md:px-10 lg:grid-cols-2 lg:gap-14">
          <div className="flex h-full flex-col justify-center">
            <Reveal>
              <h2 className="font-display text-3xl font-semibold leading-[0.94] tracking-[-0.05em] text-ink md:text-4xl">
                Iced matcha Enschede,{" "}
                <span className="font-semibold text-matcha">jij kiest</span>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-soft md:text-lg">
                Classic iced matcha of een flavored cup: blue, cherry, mango,
                vanilla, white chocolate of de strawberry matcha die TikTok
                overnam. Tik een smaak, kies je melk, stuur een DM. Zo simpel
                is matcha bestellen in Enschede.
              </p>
            </Reveal>
            <Reveal delay={0.08} className="mt-8">
              <MatchaFlavourPicker />
            </Reveal>
          </div>

          <Reveal delay={0.1} className="flex h-full flex-col gap-6">
            <div className="relative flex-1 overflow-hidden rounded-[2rem] border-[6px] border-cream shadow-[0_28px_70px_-28px_rgba(68,57,43,0.45)]">
              <div className="relative min-h-[280px] h-full aspect-[4/5] lg:aspect-auto lg:min-h-full">
                <Image
                  src={pourStrawberry}
                  alt="Iced strawberry matcha met roze laagjes, viral matcha van Lá Sweet in Enschede"
                  fill
                  quality={92}
                  sizes="(max-width: 1023px) 100vw, 45vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="rounded-[1.75rem] bg-matcha-deep p-6 text-cream md:p-8">
              <p className="font-display text-2xl font-bold leading-snug tracking-tight md:text-3xl">
                &ldquo;Die roze laagjes? Dat is onze strawberry matcha.&rdquo;
              </p>
              <p className="mt-3 text-sm leading-relaxed text-cream/75">
                Ela bouwt elke cup zelf. Op is op, dus op zaterdag kom je op
                tijd, of je reserveert via Instagram.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Strawberry deep dive */}
      <section className="overflow-hidden bg-parchment py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 px-5 md:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <TiltedPhoto
              src={cupsStack}
              alt="Gestapelde iced matcha bekers van Lá Sweet by Ela in Enschede"
              tilt="left"
              sizes="(max-width: 1023px) 340px, 400px"
            />
          </Reveal>

          <div>
            <Reveal>
              <h2 className="font-display text-3xl font-semibold leading-[0.94] tracking-[-0.05em] text-ink md:text-4xl">
                Strawberry matcha Enschede
              </h2>
              <div className="mt-5 space-y-4 text-base leading-relaxed text-ink-soft md:text-lg">
                <p>
                  De strawberry matcha ging hard op TikTok: roze, groen, ijs,
                  en die first sip die iedereen filmt. In Enschede haal je hem
                  bij Lá Sweet, niet bij een anonieme keten. Ela maakt &apos;m
                  vers, met aardbei en matcha die elkaar niet in de weg zitten.
                </p>
                <p>
                  Classic iced matcha blijft de heldere keuze voor wie puur
                  groen wil. Flavored cups (strawberry, blue, cherry, mango,
                  vanilla, white chocolate) zitten op €6,50. Melk naar keuze:
                  koe, haver, kokos of amandel.
                </p>
                <p>
                  Klein genoeg om elke batch zelf te checken. Groot genoeg voor
                  de viral-vibe. Dat is het verschil met &ldquo;ergens een
                  matcha&rdquo; in de stad.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-8 grid grid-cols-2 gap-3">
                {[
                  { k: "Classic", v: "€5,50" },
                  { k: "Flavored", v: "€6,50" },
                  { k: "Viral pick", v: "Strawberry" },
                  { k: "Melk", v: "4 opties" },
                ].map((item) => (
                  <div
                    key={item.k}
                    className="rounded-2xl border border-ink/10 bg-cream/80 px-4 py-3"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-soft">
                      {item.k}
                    </p>
                    <p className="mt-1 font-display text-lg font-bold text-ink">
                      {item.v}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Local / Ela / cookies cross */}
      <section className="bg-cream py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-stretch gap-10 px-5 md:px-10 lg:grid-cols-2 lg:gap-14">
          <Reveal className="order-2 flex h-full flex-col justify-center lg:order-1">
            <h2 className="font-display text-3xl font-semibold leading-[0.94] tracking-[-0.05em] text-ink md:text-4xl">
              Lokale matcha,{" "}
              <span className="font-semibold text-matcha">kleine batches</span>
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-ink-soft md:text-lg">
              <p>
                Lá Sweet by Ela is geen franchise. Het is Ela in Enschede:
                cookies die Tubantia al &ldquo;bijna te mooi om op te
                eten&rdquo; noemde, en matcha die op socials leeft. Je bestelt
                via Instagram DM, of je loopt zaterdag binnen.
              </p>
              <p>
                Combineer je cup met{" "}
                <Link
                  href="/koekjes-enschede"
                  className="font-semibold text-matcha-deep underline decoration-matcha/40 underline-offset-4 transition-colors hover:text-matcha"
                >
                  crumble cookies uit Enschede
                </Link>
                . Of blijf bij de menukaart op de{" "}
                <Link
                  href="/"
                  className="font-semibold text-matcha-deep underline decoration-matcha/40 underline-offset-4 transition-colors hover:text-matcha"
                >
                  homepage
                </Link>
                . Afhalen altijd aan de Haaksbergerstraat.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex rounded-full border border-ink/20 px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.12em] text-ink transition-colors hover:border-matcha hover:text-matcha-deep"
              >
                Route &amp; contact
              </Link>
              <a
                href={SITE.tubantiaArticle}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full border border-ink/20 px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.12em] text-ink transition-colors hover:border-matcha hover:text-matcha-deep"
              >
                Tubantia over Ela
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="order-1 lg:order-2">
            <div className="grid h-full grid-cols-2 gap-4">
              <div className="relative col-span-2 overflow-hidden rounded-[2rem] shadow-[0_28px_70px_-28px_rgba(68,57,43,0.4)] sm:col-span-1 sm:row-span-2 sm:rotate-2">
                <div className="relative aspect-[3/4] sm:h-full sm:min-h-[420px] sm:aspect-auto">
                  <Image
                    src={elaDrinks}
                    alt="Ela drinkt iced matcha bij Lá Sweet in Enschede"
                    fill
                    quality={90}
                    sizes="(max-width: 640px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="relative hidden overflow-hidden rounded-[1.75rem] shadow-lg sm:block sm:-rotate-3">
                <div className="relative aspect-square">
                  <Image
                    src={matchaPowder}
                    alt="Matcha poeder en gouden details bij Lá Sweet by Ela"
                    fill
                    quality={90}
                    sizes="30vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="col-span-2 rounded-[1.75rem] border border-ink/10 bg-beige-mist p-5 sm:col-span-1">
                <p className="font-display text-lg font-bold text-ink">
                  Cookie erbij?
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  Matcha + crumble cookie is de combo. Bekijk de{" "}
                  <Link
                    href="/koekjes-enschede"
                    className="font-semibold text-matcha-deep underline underline-offset-2"
                  >
                    koekjes in Enschede
                  </Link>
                  .
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <VisitPanel
        title="Afhalen aan de Haaksbergerstraat"
        body="Walk-in op zaterdag, pre-order via Instagram als je jouw strawberry matcha of iced matcha zeker wilt. Lá Sweet zit in Enschede, midden in de wijk, makkelijk te vinden."
        crossLink={{ href: "/koekjes-enschede", label: "Naar cookies" }}
      />

      <SeoFaq
        title="Vragen over matcha in Enschede"
        intro="Snel antwoord, zonder marketingpraat. Mis je iets? Stuur een DM."
        faqs={MATCHA_FAQS}
      />

      {/* Closing CTA */}
      <section className="bg-matcha-deep py-16 text-cream lg:py-20">
        <div className="mx-auto max-w-[800px] px-5 text-center md:px-10">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold leading-[0.94] tracking-[-0.05em] md:text-4xl">
              Klaar voor jouw iced matcha?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-cream/75">
              Stuur je smaak via Instagram, of kom zaterdag langs. Enschede
              drinkt matcha bij Ela.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/bestellen"
                className="inline-flex rounded-full bg-cream px-8 py-4 text-[13px] font-bold uppercase tracking-[0.12em] text-matcha-deep transition-all duration-300 hover:bg-parchment active:scale-[0.98]"
              >
                Bestel nu
              </Link>
              <Link
                href="/"
                className="inline-flex rounded-full border border-cream/30 px-8 py-4 text-[13px] font-bold uppercase tracking-[0.12em] text-cream transition-colors hover:border-cream"
              >
                Terug naar home
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
