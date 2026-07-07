import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { EeatAuthorByline } from "@/components/seo/EeatAuthorByline";
import { BRAND_DISPLAY } from "@/lib/seo/e-e-a-t";

interface EeatCaseCreditProps {
  client: string;
  metric: string;
  metricHint: string;
  publishedAt: string;
  websiteUrl?: string;
}

export function EeatCaseCredit({
  client,
  metric,
  metricHint,
  publishedAt,
  websiteUrl,
}: EeatCaseCreditProps) {
  return (
    <aside className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6 lg:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#FF5722]">
        Case uitgevoerd door {BRAND_DISPLAY}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        Echte klant ({client}), echte stack, echte cijfers waar we ze kunnen delen. Geen stockfoto,
        geen vage &ldquo;we hielpen een merk groeien&rdquo;-praat.
      </p>
      <div className="mt-5 flex flex-wrap items-baseline gap-2">
        <span className="text-3xl font-extrabold tracking-tight text-slate-900">{metric}</span>
        <span className="text-sm font-medium text-slate-600">{metricHint}</span>
      </div>
      <div className="mt-6">
        <EeatAuthorByline publishedAt={publishedAt} variant="light" showTrust />
      </div>
      {websiteUrl ? (
        <a
          href={websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-slate-900 hover:text-[#FF5722]"
        >
          Live site {client}
          <ArrowUpRight className="size-3.5" aria-hidden />
        </a>
      ) : null}
      <Link
        href="/over"
        className="mt-3 block text-sm font-bold text-slate-500 hover:text-[#FF5722]"
      >
        Meer over wie dit bouwde
      </Link>
    </aside>
  );
}
