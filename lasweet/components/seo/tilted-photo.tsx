import Image, { type StaticImageData } from "next/image";

interface TiltedPhotoProps {
  src: StaticImageData;
  alt: string;
  priority?: boolean;
  tilt?: "left" | "right";
  className?: string;
  sizes?: string;
  aspectClass?: string;
}

export function TiltedPhoto({
  src,
  alt,
  priority = false,
  tilt = "right",
  className = "",
  sizes = "(max-width: 640px) 340px, 420px",
  aspectClass = "aspect-[4/5]",
}: TiltedPhotoProps) {
  const rotate = tilt === "left" ? "-rotate-2" : "rotate-2";
  const shadowRotate = tilt === "left" ? "rotate-3" : "-rotate-6";

  return (
    <div className={`relative mx-auto w-full max-w-[340px] sm:max-w-[420px] ${className}`}>
      <div
        aria-hidden="true"
        className={`absolute inset-3 translate-x-2 translate-y-3 rounded-[2rem] bg-parchment ${shadowRotate}`}
      />
      <div
        className={`relative overflow-hidden rounded-[2.5rem] shadow-[0_40px_90px_-30px_rgba(68,57,43,0.45)] transition-transform duration-500 hover:-translate-y-1 hover:rotate-0 ${rotate}`}
      >
        <div className={`relative ${aspectClass}`}>
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            quality={95}
            sizes={sizes}
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
