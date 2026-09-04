import Image from "next/image";
import { InstagramLogoIcon } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/reveal";
import elaBoxes from "@/public/photos/ela-boxes.png";
import elaSofa from "@/public/photos/ela-sofa.png";
import handsTower from "@/public/photos/hands-tower.png";

const INSTAGRAM_URL = "https://www.instagram.com/la.sweetbyela";

export function FollowGrid() {
  return (
    <section className="bg-beige py-20 lg:py-24">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-display text-4xl font-semibold leading-[0.94] tracking-[-0.05em] text-ink md:text-5xl">
              Volg de bakkerij.
            </h2>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-matcha px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.14em] text-cream transition-all duration-300 hover:bg-matcha-deep active:scale-[0.98]"
            >
              <InstagramLogoIcon size={16} weight="fill" />
              @la.sweetbyela
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-[1.15fr_1fr_1fr] lg:grid-rows-2 lg:auto-rows-[230px]">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative col-span-2 h-56 overflow-hidden rounded-3xl sm:h-72 lg:col-span-1 lg:row-span-2 lg:h-auto"
            >
              <Image
                src={elaBoxes}
                alt="Ela met Lá Sweet-boxen vol crumble cookies"
                fill
                quality={90}
                sizes="(max-width: 1023px) 100vw, 38vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </a>

            <div className="flex aspect-square items-center justify-center rounded-3xl bg-beige-deep p-6 sm:p-8 lg:aspect-auto lg:h-full lg:p-10">
              <p className="text-center font-display text-xl font-bold leading-snug tracking-tight text-cream sm:text-2xl lg:text-3xl">
                Elke week een nieuwe smaak.
              </p>
            </div>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-3xl lg:aspect-auto lg:h-full"
            >
              <Image
                src={elaSofa}
                alt="Ela op de bank met Lá Sweet matcha en cookies"
                fill
                quality={90}
                sizes="(max-width: 1023px) 50vw, 31vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </a>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-3xl lg:aspect-auto lg:h-full"
            >
              <Image
                src={handsTower}
                alt="Gestapelde handen met Lá Sweet crumble cookies"
                fill
                quality={90}
                sizes="(max-width: 1023px) 50vw, 31vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </a>

            <div className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-3xl bg-cream p-5 text-center sm:p-8 lg:aspect-auto lg:h-full lg:p-10">
              <p className="font-display text-xl font-bold leading-snug tracking-tight text-ink sm:text-2xl lg:text-3xl">
                Walk-in cookies Enschede.
              </p>
              <p className="text-xs text-ink-soft sm:text-sm">
                Haaksbergerstraat 302 · zaterdag
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
