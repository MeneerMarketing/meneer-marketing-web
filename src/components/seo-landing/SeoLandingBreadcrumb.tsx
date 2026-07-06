import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { seoLandingPath } from "@/lib/seo-landings";

interface SeoLandingBreadcrumbProps {
  keyword: string;
  city?: string;
}

export function SeoLandingBreadcrumb({ keyword, city }: SeoLandingBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="border-b border-slate-100 bg-slate-50/80">
      <ol className="mx-auto flex max-w-6xl flex-wrap items-center gap-1 px-4 py-3 text-sm text-slate-500 lg:px-8">
        <li>
          <Link href="/" className="font-medium transition hover:text-[#FF5722]">
            Home
          </Link>
        </li>
        <li className="flex items-center gap-1" aria-hidden>
          <ChevronRight className="size-3.5" />
        </li>
        <li>
          <Link href="/zoeken" className="font-medium transition hover:text-[#FF5722]">
            Zoeken
          </Link>
        </li>
        {city ? (
          <>
            <li className="flex items-center gap-1" aria-hidden>
              <ChevronRight className="size-3.5" />
            </li>
            <li>
              <Link
                href={`/zoeken?stad=${encodeURIComponent(city.toLowerCase())}`}
                className="font-medium transition hover:text-[#FF5722]"
              >
                {city}
              </Link>
            </li>
          </>
        ) : null}
        <li className="flex items-center gap-1" aria-hidden>
          <ChevronRight className="size-3.5" />
        </li>
        <li>
          <span className="font-semibold text-slate-800" aria-current="page">
            {keyword}
          </span>
        </li>
      </ol>
    </nav>
  );
}
