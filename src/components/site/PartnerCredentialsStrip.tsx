import Image from "next/image";

type PartnerBadge = {
  name: string;
  href: string;
  src: string;
  width: number;
  height: number;
};

const PARTNERS: readonly PartnerBadge[] = [
  {
    name: "Shopify Partner",
    href: "https://www.shopify.com/partners",
    src: "/partners/shopify-partner.png",
    width: 196,
    height: 44,
  },
  {
    name: "Meta Business Partner",
    href: "https://www.facebook.com/business/marketing-partners",
    src: "/partners/meta-business-partner.png",
    width: 148,
    height: 52,
  },
] as const;

interface PartnerCredentialsStripProps {
  className?: string;
  /** Footer = donkere achtergrond met witte logo-kaarten */
  variant?: "on-dark" | "on-light";
  showCaption?: boolean;
}

function partnerCardClass(isDark: boolean): string {
  return `group flex w-full max-w-[280px] items-center justify-center rounded-2xl border px-4 py-3 transition duration-300 sm:max-w-none sm:px-5 sm:py-3.5 ${
    isDark
      ? "border-white/10 bg-white shadow-[0_12px_40px_-20px_rgba(0,0,0,0.55)] hover:-translate-y-0.5 hover:border-white/20 hover:shadow-[0_16px_44px_-18px_rgba(255,255,255,0.12)]"
      : "border-slate-200/90 bg-white shadow-sm hover:border-slate-300 hover:shadow-md"
  }`;
}

/**
 * Shopify & Meta partner-badges.
 */
export function PartnerCredentialsStrip({
  className = "",
  variant = "on-dark",
  showCaption = true,
}: PartnerCredentialsStripProps) {
  const isDark = variant === "on-dark";

  return (
    <div className={className} aria-label="Partnercertificeringen">
      <p
        className={`text-center text-[10px] font-bold uppercase tracking-[0.2em] sm:text-[11px] ${
          isDark ? "text-slate-400" : "text-slate-500"
        }`}
      >
        Partners
      </p>

      <ul className="mt-4 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-stretch sm:justify-center sm:gap-4">
        {PARTNERS.map((partner) => (
          <li key={partner.name} className="flex justify-center sm:max-w-[248px]">
            <a
              href={partner.href}
              target="_blank"
              rel="noopener noreferrer"
              className={partnerCardClass(isDark)}
              aria-label={`${partner.name} (opent in nieuw tabblad)`}
            >
              <Image
                src={partner.src}
                alt={partner.name}
                width={partner.width}
                height={partner.height}
                className="h-9 w-auto max-w-full object-contain object-center opacity-95 transition group-hover:opacity-100 sm:h-10"
                loading="lazy"
              />
            </a>
          </li>
        ))}
      </ul>

      {showCaption ? (
        <p
          className={`mx-auto mt-4 max-w-md text-center text-xs leading-relaxed sm:text-sm ${
            isDark ? "text-slate-400" : "text-slate-600"
          }`}
        >
          Gecertificeerde Shopify &amp; Meta partner.
        </p>
      ) : null}
    </div>
  );
}
