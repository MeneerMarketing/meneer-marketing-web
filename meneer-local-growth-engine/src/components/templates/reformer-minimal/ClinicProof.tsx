import Image from "next/image";
import type { ClinicImage } from "@/components/templates/reformer-minimal/clinicModel";

interface ProofProps {
  rating: string | null;
  reviewCount: number;
  image: ClinicImage | null;
  studioName: string;
  city: string;
}

/** Donkere band #1 (bewijs): full-bleed g-700, geen floating card op wit. */
export function ClinicProof({
  rating,
  reviewCount,
  image,
  studioName,
  city,
}: ProofProps) {
  if (!rating) return null;

  return (
    <section className="fc-plane-dark">
      <div className="mx-auto grid lg:grid-cols-2">
        <div className="flex flex-col justify-center px-5 py-16 sm:px-8 sm:py-20 lg:px-[5vw] lg:py-24">
          <p className="figma-label text-[var(--fc-on-dark-label)]">Waardering</p>
          <p className="figma-display-xl mt-4 text-[var(--fc-on-dark)]">{rating}</p>
          <p className="mt-4 max-w-[34ch] text-[16px] leading-7 text-[var(--fc-on-dark-body)]">
            {reviewCount > 0
              ? `${studioName} wordt beoordeeld met ${rating} op basis van ${reviewCount} reviews in ${city}.`
              : `${studioName} in ${city}, beoordeeld met ${rating}.`}
          </p>
        </div>
        {image ? (
          <div className="relative min-h-[260px] lg:min-h-full">
            <Image
              src={image.url}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="50vw"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}

export { ClinicReviews } from "@/components/templates/reformer-minimal/ClinicReviews";
