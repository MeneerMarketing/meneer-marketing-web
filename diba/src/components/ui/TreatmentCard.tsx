import Image from "next/image";
import Link from "next/link";

/**
 * DIBA TreatmentCard (Behandelkaart) — referentie batch 2 (DIBA-RULES.md §8)
 * Echt beeld + naam + "voor wie" in één regel + vanaf-prijs + pijl.
 * Hover: ALLEEN subtiele lift (2px) + randverdieping. Geen andere gimmicks.
 * Server component. Beeld altijd echt (§ fotografie): geen stock, geen AI-mensen.
 */

export type TreatmentCardProps = {
  href: string;
  image: { src: string; alt: string };
  name: string;
  /** Eén regel, klanttaal. Bv. "Voor acne, littekens en grove poriën" */
  forWho: string;
  /** Vanaf-prijs in euro's. Prijzen altijd zichtbaar (§3). */
  priceFrom: number;
  /** next/image sizes; default past bij 1–3 kaarten per rij */
  sizes?: string;
};

const euro = new Intl.NumberFormat("nl-NL", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function Arrow() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 8h11M9.5 4l4 4-4 4" />
    </svg>
  );
}

export default function TreatmentCard({
  href,
  image,
  name,
  forWho,
  priceFrom,
  sizes = "(min-width: 1024px) 384px, (min-width: 768px) 50vw, 100vw",
}: TreatmentCardProps) {
  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-[1.5rem] border border-[#dce8d9] bg-white
                 shadow-[0_8px_32px_rgba(15,45,28,.04)] transition
                 hover:-translate-y-1 hover:border-[#95c592] hover:shadow-[0_14px_35px_rgba(35,100,62,.12)]
                 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                 focus-visible:outline-[#286943] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#cbe5bf]">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          className="object-cover mix-blend-multiply opacity-85"
        />
      </div>

      <div className="p-5 sm:p-6">
        <h3 className="text-lg font-medium tracking-[-.03em] text-[#17372a]">{name}</h3>
        <p className="mt-1 truncate text-[13px] leading-relaxed text-[#5f7765]">{forWho}</p>
        <p className="mt-4 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[.1em] text-[#286943]">
          <span className="tabular-nums">
            {priceFrom > 0 ? `vanaf ${euro.format(priceFrom)}` : "Prijs op aanvraag"}
          </span>
          <Arrow />
        </p>
      </div>
    </Link>
  );
}
