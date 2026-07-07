import Link from "next/link";
import Image from "next/image";
import {
  BRAND_DISPLAY,
  FOUNDER_EXPERIENCE,
  founderImageUrl,
  founderProfileUrl,
  organizationTrustLine,
} from "@/lib/seo/e-e-a-t";

interface EeatAuthorBylineProps {
  publishedAt?: string;
  modifiedAt?: string;
  readMinutes?: number;
  variant?: "light" | "dark";
  showTrust?: boolean;
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export function EeatAuthorByline({
  publishedAt,
  modifiedAt,
  readMinutes,
  variant = "light",
  showTrust = true,
}: EeatAuthorBylineProps) {
  const isDark = variant === "dark";
  const showUpdated =
    modifiedAt && publishedAt && modifiedAt.slice(0, 10) !== publishedAt.slice(0, 10);

  return (
    <div
      className={`flex flex-wrap items-center gap-4 ${
        isDark ? "text-slate-400" : "text-mm-muted"
      }`}
    >
      <Link
        href={founderProfileUrl}
        className={`group flex items-center gap-3 rounded-2xl border px-3 py-2 transition ${
          isDark
            ? "border-white/10 bg-white/5 hover:border-white/20"
            : "border-mm-border bg-white hover:border-[#FF5722]/30"
        }`}
      >
        {founderImageUrl.startsWith("/") ? (
          <Image
            src={founderImageUrl}
            alt=""
            width={40}
            height={40}
            className="size-10 rounded-full border border-slate-200/80 object-cover"
            aria-hidden
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={founderImageUrl}
            alt=""
            width={40}
            height={40}
            className="size-10 rounded-full border border-slate-200/80 object-cover"
            aria-hidden
          />
        )}
        <span className="min-w-0 text-left">
          <span
            className={`block text-sm font-bold ${
              isDark ? "text-white group-hover:text-[#FF5722]" : "text-mm-text group-hover:text-[#FF5722]"
            }`}
          >
            Door {BRAND_DISPLAY}
          </span>
          <span className="block text-xs font-medium">{FOUNDER_EXPERIENCE}</span>
        </span>
      </Link>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        {publishedAt ? (
          <time dateTime={publishedAt}>Gepubliceerd {formatDate(publishedAt)}</time>
        ) : null}
        {showUpdated ? (
          <time dateTime={modifiedAt} className="font-semibold text-[#FF5722]">
            Bijgewerkt {formatDate(modifiedAt!)}
          </time>
        ) : null}
        {readMinutes ? <span>{readMinutes} min lezen</span> : null}
        {showTrust ? (
          <span className={isDark ? "text-slate-500" : "text-mm-muted"}>{organizationTrustLine}</span>
        ) : null}
      </div>
    </div>
  );
}
