import Image from "next/image";
import { InstagramLogoIcon, NewspaperIcon, TiktokLogoIcon } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/reveal";
import cupsStackSmile from "@/public/photos/cups-stack-smile.png";
import cookieBoxOpen from "@/public/photos/cookie-box-open.png";

export function PressCards() {
  return (
    <section className="overflow-hidden bg-cream py-20 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal>
          <h2 className="font-display text-4xl font-semibold leading-[0.94] tracking-[-0.05em] text-ink md:text-5xl">
            Je kent ons misschien al.
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-ink-soft">
            Eerst gingen de laagjes viral op TikTok, toen stonden de cookies van
            Ela in Tubantia. Zo zag dat eruit.
          </p>
        </Reveal>

        {/* Drie kaarten als uitgewaaierde stickers op tafel */}
        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {/* TikTok */}
          <Reveal delay={0.05}>
            <a
              href="https://www.tiktok.com/@la.sweetbyela"
              target="_blank"
              rel="noopener noreferrer"
              className="group block -rotate-3 rounded-[1.75rem] border border-ink/10 bg-white p-3 pb-5 shadow-[0_24px_60px_-30px_rgba(68,57,43,0.4)] transition-all duration-500 hover:rotate-0 hover:-translate-y-2 hover:shadow-[0_36px_80px_-30px_rgba(68,57,43,0.5)]"
            >
              <div className="overflow-hidden rounded-[1.25rem]">
                  <Image
                  src={cupsStackSmile}
                  alt="Iced matcha bekers met een lach erop van Lá Sweet"
                  quality={90}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="mt-4 flex items-center gap-3 px-2">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ink text-cream">
                  <TiktokLogoIcon size={18} weight="fill" />
                </span>
                <div>
                  <p className="font-display text-lg font-bold leading-tight text-ink">
                    De laagjes gingen viral
                  </p>
                  <p className="text-sm text-ink-soft">@la.sweetbyela op TikTok</p>
                </div>
              </div>
            </a>
          </Reveal>

          {/* Tubantia */}
          <Reveal delay={0.12}>
            <a
              href="https://www.tubantia.nl/enschede/ze-zijn-bijna-te-mooi-om-op-te-eten-de-crumble-cookies-van-ela-19-zijn-een-hit-in-enschede~a2b62938/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full rotate-2 flex-col justify-between rounded-[1.75rem] bg-matcha-deep p-8 text-cream shadow-[0_24px_60px_-30px_rgba(111,3,19,0.55)] transition-all duration-500 hover:rotate-0 hover:-translate-y-2 lg:mt-10"
            >
              <p className="font-display text-3xl font-semibold leading-[0.94] tracking-[-0.05em]">
                &ldquo;Elke koek moet perfect zijn.&rdquo;
              </p>
              <div className="mt-8 flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-cream text-matcha-deep">
                  <NewspaperIcon size={18} weight="fill" />
                </span>
                <div>
                  <p className="font-display text-lg font-bold leading-tight">
                    Tubantia over Ela&apos;s cookies
                  </p>
                  <p className="text-sm text-cream/70">
                    Lees het artikel
                    <span
                      aria-hidden="true"
                      className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-1"
                    >
                      &rarr;
                    </span>
                  </p>
                </div>
              </div>
            </a>
          </Reveal>

          {/* Instagram */}
          <Reveal delay={0.19}>
            <a
              href="https://www.instagram.com/la.sweetbyela"
              target="_blank"
              rel="noopener noreferrer"
              className="group block rotate-3 rounded-[1.75rem] border border-ink/10 bg-white p-3 pb-5 shadow-[0_24px_60px_-30px_rgba(68,57,43,0.4)] transition-all duration-500 hover:rotate-0 hover:-translate-y-2 hover:shadow-[0_36px_80px_-30px_rgba(68,57,43,0.5)]"
            >
              <div className="overflow-hidden rounded-[1.25rem]">
                  <Image
                  src={cookieBoxOpen}
                  alt="Open Lá Sweet-box met vier crumble cookies"
                  quality={90}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="mt-4 flex items-center gap-3 px-2">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-matcha text-cream">
                  <InstagramLogoIcon size={18} weight="fill" />
                </span>
                <div>
                  <p className="font-display text-lg font-bold leading-tight text-ink">
                    Elke drop eerst op Insta
                  </p>
                  <p className="text-sm text-ink-soft">@la.sweetbyela op Instagram</p>
                </div>
              </div>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
