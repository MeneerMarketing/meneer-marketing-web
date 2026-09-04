"use client";

import type { ClinicModel } from "@/components/templates/reformer-minimal/clinicModel";

interface Props {
  rating: string | null;
  reviewCount: number;
  usps: string[];
  phone: string | null;
  instagram: string | null;
}

export function ClinicTopBar({
  rating,
  reviewCount,
  usps,
  phone,
  instagram,
}: Props) {
  return (
    <div className="border-b border-[var(--fc-line)] bg-[var(--fc-paper)]">
      <div className="mx-auto grid h-11 max-w-[1400px] grid-cols-[1fr_auto] items-center gap-4 px-5 sm:px-8 lg:grid-cols-[1fr_minmax(10rem,26rem)_1fr] lg:px-[5vw]">
        <div className="min-w-0">
          {rating ? (
            <p className="truncate text-[12px] text-[var(--fc-ink-soft)]">
              <span className="font-semibold text-[var(--fc-ink)]">{rating}</span>
              {reviewCount > 0 ? (
                <span>
                  {" "}
                  uit {reviewCount} beoordelingen
                </span>
              ) : null}
            </p>
          ) : (
            <span className="figma-label text-[var(--fc-ink-mute)]">Studio</span>
          )}
        </div>

        {usps.length > 0 ? (
          <div className="figma-usp-track hidden lg:block" aria-live="polite">
            {usps.slice(0, 3).map((usp) => (
              <span
                key={usp}
                className="figma-usp-item figma-label text-[var(--fc-ink-mute)]"
              >
                {usp}
              </span>
            ))}
          </div>
        ) : (
          <span className="hidden lg:block" />
        )}

        <div className="flex items-center justify-end gap-1">
          {instagram ? (
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-8 w-8 items-center justify-center text-[var(--fc-ink-soft)] transition-colors hover:text-[var(--fc-ink)]"
            >
              <ClinicIcon name="instagram" />
            </a>
          ) : null}
          {phone ? (
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              aria-label={`Bel ${phone}`}
              className="flex h-8 w-8 items-center justify-center text-[var(--fc-ink-soft)] transition-colors hover:text-[var(--fc-ink)]"
            >
              <ClinicIcon name="phone" />
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ClinicIcon({ name }: { name: "phone" | "instagram" }) {
  if (name === "instagram") {
    return (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
        <rect
          x="4.5"
          y="4.5"
          width="15"
          height="15"
          rx="4.2"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="16.6" cy="7.4" r="0.9" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
      <path
        d="M8.2 4.8h2.1l1.1 2.8-1.4 1.2a11.2 11.2 0 0 0 5.2 5.2l1.2-1.4 2.8 1.1v2.1a1.6 1.6 0 0 1-1.7 1.6C10.4 17.2 6.8 13.6 6.6 6.5A1.6 1.6 0 0 1 8.2 4.8Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export type ClinicTopBarModel = Pick<
  ClinicModel,
  "ratingDisplay" | "reviewCount" | "usps" | "contact"
>;
