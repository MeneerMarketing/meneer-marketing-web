import Image from "next/image";
import { FIGMA_HOME_PORTRAIT } from "@/data/figma-home-images";
import { publicCopy } from "@/lib/copy-flags";

type FigmaPillarHeroMediaProps = {
  src: string;
  alt: string;
  badge?: string;
};

function resolveImage(src: string, alt: string) {
  const isPlaceholder = src.startsWith("/dev/") || src.endsWith(".svg");
  if (isPlaceholder) {
    return {
      src: FIGMA_HOME_PORTRAIT.src,
      alt: publicCopy(alt) || FIGMA_HOME_PORTRAIT.alt,
    };
  }
  return { src, alt: publicCopy(alt) };
}

/** Hero-beeld pillar — zelfde taal als homepage (sage + hero-radius). */
export default function FigmaPillarHeroMedia({
  src,
  alt,
  badge = "Meten vóór behandelen",
}: FigmaPillarHeroMediaProps) {
  const image = resolveImage(src, alt);

  return (
    <div className="relative min-h-[400px] overflow-hidden rounded-bl-[6rem] bg-[#cbe5bf] sm:min-h-[440px] lg:min-h-[480px] lg:rounded-bl-[10rem]">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority
        sizes="(min-width: 1024px) 46vw, 100vw"
        className="object-cover object-center"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-[var(--foto-scrim)]/32 via-transparent to-transparent"
      />
      <span className="absolute left-6 top-6 rounded-full bg-white/90 px-4 py-2 text-[10px] font-medium uppercase tracking-[.12em] text-[#397449] sm:left-7 sm:top-7">
        {badge}
      </span>
    </div>
  );
}
