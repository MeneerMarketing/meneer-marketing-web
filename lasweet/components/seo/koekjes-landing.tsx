import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { CookieBoxPicker } from "@/components/seo/cookie-box-picker";
import { SeoFaq } from "@/components/seo/seo-faq";
import { TiltedPhoto } from "@/components/seo/tilted-photo";
import { VisitPanel } from "@/components/seo/visit-panel";
import { COOKIES_FAQS } from "@/lib/seo";
import { SITE } from "@/lib/site";
import cookieHalves from "@/public/photos/cookie-halves.png";
import cookieBoxOpen from "@/public/photos/cookie-box-open.png";
import redVelvet from "@/public/photos/cookie-red-velvet.png";
import appleCrumble from "@/public/photos/cookie-apple-crumble.png";
import cookiesShare from "@/public/photos/cookies-share.png";
import elaBoxes from "@/public/photos/ela-boxes.png";

const STICKERS = [
  { label: "Crumble cookies", tilt: "-rotate-2", tone: "matcha" as const },
  { label: "Tubantia hit", tilt: "rotate-2", tone: "berry" as const },
  { label: "Box vanaf 4", tilt: "-rotate-1", tone: "cream" as const },
];

function stickerClass(tone: "berry" | "matcha" | "cream"): string {
  if (tone === "berry") return "bg-beige text-ink";
  if (tone === "matcha") return "bg-matcha text-cream";
  return "bg-cream text-matcha-deep border border-ink/10";
}

export function KoekjesLanding() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pb-12 pt-6 md:pb-20 md:pt-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 top-20 size-[340px] rounded-full bg-beige-mist blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 bottom-10 size-[280px] rounded-full bg-beige/20 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 px-5 md:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div>
            <Reveal>
              <span className="inline-block rounded-full border border-ink/10 bg-parchment px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                Koekjes · Cookies · Enschede
              </span>
            </Reveal>

            <Reveal delay={0.06}>
              <h1 className="mt-5 font-display text-5xl font-semibold leading-[0.92] tracking-[-0.06em] text-ink sm:text-6xl xl:text-7xl">
                Koekjes &amp;{" "}
                <span className="font-semibold text-matcha">cookies</span>
                <br />
                in Enschede
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft md:text-lg">
                Handgemaakte crumble cookies, in kleine batches door Ela. Red
                velvet aardbei, tiramisu, brownie Kinder Bueno, witte Kinder
                Bueno, appel crumble, lotus en matcha. Cookie box vanaf 4
                stuks, afhalen aan {SITE.streetAddress}.
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/bestellen"
                  className="inline-flex items-center gap-2 rounded-full bg-matcha px-7 py-4 text-[13px] font-bold uppercase tracking-[0.12em] text-cream transition-all duration-300 hover:bg-matcha-deep active:scale-[0.98]"
                >
                  Cookie box bestellen
                </Link>
                <Link
                  href="/#cookies"
                  className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-7 py-4 text-[13px] font-bold uppercase tracking-[0.12em] text-ink transition-colors duration-300 hover:border-matcha hover:text-matcha-deep active:scale-[0.98]"
                >
                  Bekijk smaken
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
              src={cookieHalves}
              alt="Crumble cookies Enschede: Kinder Bueno cookie helften van Lá Sweet by Ela"
              priority
              tilt="left"
            />
          </Reveal>
        </div>
      </section>

      {/* Facts */}
      <section className="stripe-bg py-10 lg:py-14">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-4 px-5 sm:grid-cols-3 md:px-10">
          {[
            { label: "Box", text: "Vanaf 4 cookies, smaken mixen mag" },
            {
              label: "Afhalen",
              text: `${SITE.streetAddress}, Enschede`,
            },
            {
              label: "Walk-in",
              text: `Zaterdag ${SITE.walkInOpens}-${SITE.walkInCloses}`,
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

      {/* What are crumble cookies */}
      <section className="bg-cream py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-stretch gap-10 px-5 md:px-10 lg:grid-cols-2 lg:gap-14">
          <Reveal className="flex h-full flex-col justify-center">
            <h2 className="font-display text-3xl font-semibold leading-[0.94] tracking-[-0.05em] text-ink md:text-4xl">
              Crumble cookies Enschede
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-ink-soft md:text-lg">
              <p>
                Op zoek naar koekjes in Enschede, of cookies die eruitzien alsof
                ze van TikTok komen? Lá Sweet bakt crumble cookies met een
                zachte kern en een dikke topping. Verse batch van Ela, uit de
                oven, met de hand afgewerkt.
              </p>
              <p>
                Of je nu &ldquo;koekjes Enschede&rdquo; of &ldquo;cookies
                Enschede&rdquo; intypt: je zoekt hetzelfde. Hier krijg je
                handwerk, kleine oplage, en smaken die wisselen. Op is op.
              </p>
              <p>
                Tubantia noemde ze een hit in Enschede. Creators filmen de first
                bite. Jij bestelt een box en haalt &apos;m af aan de
                Haaksbergerstraat.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="grid h-full grid-cols-2 gap-4">
            <div className="relative col-span-2 overflow-hidden rounded-[2rem] shadow-[0_28px_70px_-28px_rgba(68,57,43,0.4)] sm:col-span-1 sm:row-span-2 sm:-rotate-2">
              <div className="relative aspect-[4/5] sm:h-full sm:min-h-[400px] sm:aspect-auto">
                <Image
                  src={redVelvet}
                  alt="Red velvet crumble cookie met aardbei van Lá Sweet Enschede"
                  fill
                  quality={92}
                  sizes="(max-width: 640px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="relative hidden overflow-hidden rounded-[1.75rem] rotate-3 shadow-lg sm:block">
              <div className="relative aspect-square">
                <Image
                  src={appleCrumble}
                  alt="Apple crumble cookie Enschede van Lá Sweet by Ela"
                  fill
                  quality={90}
                  sizes="30vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="col-span-2 rounded-[1.75rem] bg-matcha-deep p-5 text-cream sm:col-span-1">
              <p className="font-display text-lg font-bold leading-snug">
                &ldquo;Elke koek moet perfect zijn.&rdquo;
              </p>
              <p className="mt-2 text-sm text-cream/70">Tubantia over Ela</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Interactive box picker */}
      <section className="stripe-bg py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-start gap-10 px-5 md:px-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <h2 className="font-display text-3xl font-semibold leading-[0.94] tracking-[-0.05em] text-ink md:text-4xl">
                Stel je cookie box samen
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-soft md:text-lg">
                Kies 4, 8 of 12 stuks. Mix smaken. Dit is een teaser: op de
                bestelpagina stuur je de echte aanvraag via Instagram DM. Handig
                voor verjaardagen, bruiloften, of omdat het woensdag is.
              </p>
            </Reveal>
            <Reveal delay={0.08} className="mt-8 hidden lg:block">
              <div className="relative overflow-hidden rounded-[2rem] border-[6px] border-cream shadow-[0_28px_70px_-28px_rgba(68,57,43,0.45)] rotate-2">
                <div className="relative aspect-[4/5]">
                  <Image
                    src={cookieBoxOpen}
                    alt="Open cookie box met crumble cookies van Lá Sweet in Enschede"
                    fill
                    quality={90}
                    sizes="420px"
                    className="object-cover"
                  />
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.06}>
            <CookieBoxPicker />
          </Reveal>
        </div>
      </section>

      {/* Smaken gallery strip */}
      <section className="bg-cream py-16 lg:py-20">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold leading-[0.94] tracking-[-0.05em] text-ink md:text-4xl">
              De smaken die je kunt bestellen
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft">
              De kaart wisselt per week. Dit is de vaste cast: Red velvet
              aardbei, Tiramisu, Brownie Kinder Bueno, Witte Kinder Bueno, Appel
              crumble, Lotus en Matcha. Meer zien op de{" "}
              <Link
                href="/#cookies"
                className="font-semibold text-matcha-deep underline decoration-matcha/40 underline-offset-4"
              >
                homepage-smaken
              </Link>
              .
            </p>
          </Reveal>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              {
                photo: redVelvet,
                name: "Red velvet aardbei",
                alt: "Red velvet aardbei cookie Enschede van Lá Sweet",
              },
              {
                photo: cookieHalves,
                name: "Brownie Kinder Bueno",
                alt: "Brownie Kinder Bueno cookies Enschede",
              },
              {
                photo: appleCrumble,
                name: "Appel crumble",
                alt: "Appel crumble cookies Enschede",
              },
              {
                photo: cookiesShare,
                name: "Tiramisu & meer",
                alt: "Crumble cookies delen bij Lá Sweet Enschede",
              },
            ].map((item, index) => (
              <Reveal key={item.name} delay={0.05 * index}>
                <figure
                  className={`overflow-hidden rounded-[1.5rem] border border-ink/10 bg-parchment transition-transform duration-500 hover:-translate-y-1 ${
                    index % 2 === 0 ? "-rotate-1" : "rotate-1"
                  }`}
                >
                  <div className="relative aspect-square">
                    <Image
                      src={item.photo}
                      alt={item.alt}
                      fill
                      quality={88}
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="px-3 py-3 font-display text-sm font-bold text-ink md:text-base">
                    {item.name}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Ela / local story */}
      <section className="overflow-hidden bg-parchment py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 px-5 md:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <Reveal>
              <h2 className="font-display text-3xl font-semibold leading-[0.94] tracking-[-0.05em] text-ink md:text-4xl">
                Ela bakte Enschede{" "}
                <span className="font-semibold text-matcha">verslaafd</span>
              </h2>
              <div className="mt-5 space-y-4 text-base leading-relaxed text-ink-soft md:text-lg">
                <p>
                  Kleine batches. Elke cookie met de hand afgewerkt. Dat is
                  waarom de doos eruitziet alsof hij voor de camera is gemaakt,
                  en waarom locals terugkomen voor de volgende drop.
                </p>
                <p>
                  Bestellen gaat via Instagram DM naar {SITE.handle}. Je kiest
                  smaken en aantallen, Ela bevestigt, jij haalt af. Zaterdag kun
                  je ook walk-in binnenlopen, zolang de batch er is.
                </p>
                <p>
                  Zin in iets kouds erbij? Pak een{" "}
                  <Link
                    href="/matcha-enschede"
                    className="font-semibold text-matcha-deep underline decoration-matcha/40 underline-offset-4 transition-colors hover:text-matcha"
                  >
                    iced of strawberry matcha in Enschede
                  </Link>
                  . Cookie + matcha is de Lá Sweet-combo.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={SITE.tubantiaArticle}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-full bg-ink px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.12em] text-cream transition-colors hover:bg-matcha-deep"
                >
                  Lees Tubantia
                </a>
                <Link
                  href="/contact"
                  className="inline-flex rounded-full border border-ink/20 px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.12em] text-ink transition-colors hover:border-matcha hover:text-matcha-deep"
                >
                  Contact &amp; adres
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.08}>
            <TiltedPhoto
              src={elaBoxes}
              alt="Ela met cookie boxes van Lá Sweet by Ela in Enschede"
              tilt="right"
              sizes="(max-width: 1023px) 340px, 420px"
            />
          </Reveal>
        </div>
      </section>

      <VisitPanel
        title="Cookies ophalen in Enschede"
        body="Haaksbergerstraat 302, 7513 EH Enschede. Walk-in op zaterdag van 14:00 tot 20:00. Pre-order via DM als je jouw smaken zeker wilt hebben."
        crossLink={{ href: "/matcha-enschede", label: "Naar matcha" }}
      />

      <SeoFaq
        title="Vragen over koekjes & cookies in Enschede"
        intro="Alles over boxes, walk-in en waarom iedereen crumble cookies googelt."
        faqs={COOKIES_FAQS}
      />

      {/* Closing CTA: extra bottom pad for sticky bar on mobile */}
      <section className="bg-matcha-deep py-16 pb-28 text-cream sm:pb-16 lg:py-20">
        <div className="mx-auto max-w-[800px] px-5 text-center md:px-10">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold leading-[0.94] tracking-[-0.05em] md:text-4xl">
              Jouw cookie box staat bijna klaar
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-cream/75">
              Kies smaken, stuur een DM, haal af in Enschede. Lá Sweet by Ela
              bakt, jij geniet.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/bestellen"
                className="inline-flex rounded-full bg-cream px-8 py-4 text-[13px] font-bold uppercase tracking-[0.12em] text-matcha-deep transition-all duration-300 hover:bg-parchment active:scale-[0.98]"
              >
                Bestel jouw box
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
