import Image from "next/image";
import { PlayIcon, TiktokLogoIcon } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/reveal";

interface TasteClip {
  id: string;
  handle: string;
  href: string;
  thumb: string;
  caption: string;
  rotate: string;
}

const CLIPS: readonly TasteClip[] = [
  {
    id: "shauny-hotspot",
    handle: "@shaunytanke",
    href: "https://www.tiktok.com/@shaunytanke/video/7655976736156306710",
    thumb: "/tiktok/shauny-hotspot.jpg",
    caption: "Koekjes hotspot in Enschede.",
    rotate: "rotate-2",
  },
  {
    id: "shauny-taste",
    handle: "@shaunytanke",
    href: "https://www.tiktok.com/@shaunytanke/video/7617393467521568033",
    thumb: "/tiktok/shauny-tastetest.jpg",
    caption: "Matcha + cookies taste test.",
    rotate: "-rotate-2",
  },
  {
    id: "jessica",
    handle: "@jessicamsolli",
    href: "https://www.tiktok.com/@jessicamsolli/video/7511053558205140246",
    thumb: "/tiktok/jessica.jpg",
    caption: "Eerste hap. Direct op camera.",
    rotate: "rotate-3",
  },
  {
    id: "ela",
    handle: "@la.sweetbyela",
    href: "https://www.tiktok.com/@la.sweetbyela/video/7583366905906433313",
    thumb: "/tiktok/la-sweet.jpg",
    caption: "Zaterdag open. Kom binnen.",
    rotate: "-rotate-1",
  },
];

const STICKERS = [
  { label: "First bite", tilt: "-rotate-2", tone: "cream" },
  { label: "Enschede cookies", tilt: "rotate-3", tone: "berry" },
  { label: "Strawberry matcha", tilt: "-rotate-1", tone: "parchment" },
  { label: "Crumble cookies", tilt: "rotate-2", tone: "cream" },
  { label: "@la.sweetbyela", tilt: "-rotate-3", tone: "matcha" },
  { label: "Taste test", tilt: "rotate-1", tone: "parchment" },
] as const;

const TIKTOK_PROFILE = "https://www.tiktok.com/@la.sweetbyela";

function stickerClass(tone: (typeof STICKERS)[number]["tone"]): string {
  switch (tone) {
    case "berry":
      return "bg-beige text-ink";
    case "matcha":
      return "bg-matcha text-cream";
    case "parchment":
      return "bg-parchment text-ink";
    default:
      return "bg-cream text-matcha-deep";
  }
}

export function TikTokTaste() {
  return (
    <section className="relative overflow-hidden bg-matcha-deep py-20 lg:py-28">
      <div className="relative mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-cream/25 bg-cream/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-cream/85">
                <TiktokLogoIcon size={14} weight="fill" />
                Taste tests
              </span>
              <h2 className="mt-5 font-display text-4xl font-semibold leading-[0.94] tracking-[-0.05em] text-cream md:text-5xl">
                Zij gingen al{" "}
                <span className="font-semibold text-parchment">proeven</span>.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-cream/75">
                Creators, locals en Ela zelf. Swipe de telefoontjes en kijk hoe
                de first bite eruitziet op TikTok.
              </p>
            </div>

            <a
              href={TIKTOK_PROFILE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-cream px-5 py-3 text-[12px] font-bold uppercase tracking-[0.14em] text-matcha-deep transition-all duration-300 hover:bg-parchment active:scale-[0.98]"
            >
              <TiktokLogoIcon size={16} weight="fill" />
              @la.sweetbyela
            </a>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.08}>
        <div className="relative mt-12">
          {/* w-max + mx-auto: gecentreerd op desktop, swipebaar als het krapper is */}
          <div className="overflow-x-auto px-5 pb-6 pt-4 [scrollbar-width:none] md:px-10 [&::-webkit-scrollbar]:hidden">
            <div className="mx-auto flex w-max snap-x snap-mandatory gap-5 md:gap-7">
            {CLIPS.map((clip, index) => (
              <a
                key={clip.id}
                href={clip.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative w-[210px] shrink-0 snap-center sm:w-[220px] xl:w-[230px] ${clip.rotate} transition-transform duration-500 hover:z-20 hover:rotate-0 hover:-translate-y-2`}
                style={{ zIndex: index + 1 }}
              >
                <div className="relative rounded-[2rem] border-[5px] border-ink bg-ink p-2 shadow-[0_30px_70px_-28px_rgba(0,0,0,0.55)] transition-shadow duration-500 group-hover:shadow-[0_40px_90px_-24px_rgba(0,0,0,0.6)]">
                  <div className="relative overflow-hidden rounded-[1.55rem] bg-parchment">
                    <div className="relative aspect-[9/16]">
                      <Image
                        src={clip.thumb}
                        alt={`TikTok van ${clip.handle}: ${clip.caption}`}
                        fill
                        quality={85}
                        sizes="230px"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-ink/10"
                      />

                      <div
                        aria-hidden="true"
                        className="absolute left-1/2 top-2.5 h-5 w-20 -translate-x-1/2 rounded-full bg-ink"
                      />

                      <span className="absolute left-1/2 top-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-cream/95 text-ink shadow-lg transition-transform duration-300 group-hover:scale-110">
                        <PlayIcon size={26} weight="fill" className="ml-0.5" />
                      </span>

                      <div className="absolute inset-x-0 bottom-0 p-3.5">
                        <p className="font-display text-sm font-bold leading-snug text-cream">
                          {clip.caption}
                        </p>
                        <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.12em] text-cream/75">
                          {clip.handle}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <span
                  className={`absolute -right-2 top-8 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-cream shadow-md ${
                    index % 2 === 0 ? "bg-beige text-ink" : "bg-matcha text-cream"
                  }`}
                >
                  TikTok
                </span>
              </a>
            ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* Full-bleed sticker-loop: twee identieke helften (elk 2× stickers) voor brede desktops */}
      <div className="relative mt-6 overflow-hidden py-2">
        <div className="marquee-track flex w-max items-center">
          {[0, 1].map((half) => (
            <div
              key={half}
              className="flex shrink-0 items-center gap-3 pr-3"
              aria-hidden={half === 1 ? true : undefined}
            >
              {[0, 1].flatMap((dup) =>
                STICKERS.map((sticker) => (
                  <span
                    key={`${half}-${dup}-${sticker.label}`}
                    className={`inline-block rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] shadow-[0_8px_20px_-12px_rgba(0,0,0,0.35)] ${sticker.tilt} ${stickerClass(sticker.tone)}`}
                  >
                    {sticker.label}
                  </span>
                )),
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
