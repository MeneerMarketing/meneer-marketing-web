import Image from "next/image";
import { DIBA_EVE_M_HUIDSCAN } from "@/data/figma-home-images";

type EveMHuidscanPhotoProps = {
  className?: string;
  badgeClassName?: string;
  sizes?: string;
};

/** Eve-M consultfoto — getrimd, exposure gecorrigeerd, zonder rand. */
export default function EveMHuidscanPhoto({
  className = "",
  badgeClassName = "bg-[#cbeab8] text-[#286943]",
  sizes = "(max-width: 1024px) 100vw, 560px",
}: EveMHuidscanPhotoProps) {
  return (
    <div className={`relative w-full max-w-[560px] ${className}`}>
      <div className="overflow-hidden rounded-[2rem]">
        <Image
          src={DIBA_EVE_M_HUIDSCAN.src}
          alt={DIBA_EVE_M_HUIDSCAN.alt}
          width={DIBA_EVE_M_HUIDSCAN.width}
          height={DIBA_EVE_M_HUIDSCAN.height}
          className="aspect-[3/2] w-full object-cover object-[center_38%]"
          sizes={sizes}
        />
      </div>
      <span
        className={`absolute -bottom-4 -left-3 rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[.13em] shadow-lg ${badgeClassName}`}
      >
        Eve-M · In de kliniek
      </span>
    </div>
  );
}
