import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { CaseLivePreview } from "@/components/cases/CaseLivePreview";
import type { CaseDetail } from "@/data/cases-detail";
import { HOME_CASES } from "@/data/home-cases";

interface CaseDetailMediaColumnProps {
  caseData: CaseDetail;
}

function accentOnDark(accent: string): string {
  if (accent === "#45382C") return "#F3C65B";
  if (accent === "#8B7355") return "#D4BC96";
  return accent;
}

export function CaseDetailMediaColumn({ caseData }: CaseDetailMediaColumnProps) {
  const { palette, website, services, metric, metricHint, story, id } = caseData;
  const accent = accentOnDark(palette.accent);
  const otherCases = HOME_CASES.filter((c) => c.id !== id).slice(0, 2);

  return (
    <div className="relative flex h-full flex-col gap-4 overflow-hidden rounded-[1.75rem] border border-slate-800 bg-slate-950 p-5 sm:p-6 lg:sticky lg:top-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative">
        <CaseLivePreview caseItem={caseData} />
      </div>

      <div
        className="relative rounded-2xl border border-white/10 p-5"
        style={{ background: `linear-gradient(135deg, ${palette.deep}88 0%, rgba(15,23,42,0.6) 100%)` }}
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
          Wat het opleverde
        </p>
        <p className="mt-2 text-4xl font-black tracking-tight text-white sm:text-[2.75rem]" style={{ color: accent }}>
          {metric}
        </p>
        <p className="mt-1 text-sm font-bold leading-snug text-slate-300">{metricHint}</p>
        <p className="mt-4 border-t border-white/10 pt-4 text-sm font-bold leading-snug text-slate-400">
          {story.punch}
        </p>
      </div>

      <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
          In de mix
        </p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {services.map((service) => (
            <li
              key={service.id}
              className="rounded-xl border border-white/[0.08] bg-black/20 px-3 py-2.5"
            >
              <p className="text-xs font-extrabold text-white">{service.label}</p>
              <p className="mt-0.5 text-[10px] leading-snug text-slate-400">{service.blurb}</p>
            </li>
          ))}
        </ul>
      </div>

      {website ? (
        <a
          href={website.url}
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex items-center justify-between gap-3 rounded-2xl border border-[#FF5722]/30 bg-[#FF5722]/10 px-4 py-3.5 text-sm font-bold text-white transition hover:border-[#FF5722]/50 hover:bg-[#FF5722]/15"
        >
          <span>
            Live site · <span className="text-[#FF5722]">{website.hostname}</span>
          </span>
          <ExternalLink className="size-4 shrink-0 opacity-80" aria-hidden />
        </a>
      ) : null}

      {otherCases.length > 0 ? (
        <div className="relative mt-auto rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Ook bekijken
          </p>
          <ul className="mt-2 space-y-1.5">
            {otherCases.map((other) => (
              <li key={other.id}>
                <Link
                  href={other.href}
                  className="group flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm font-bold text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
                >
                  <span>{other.client}</span>
                  <ArrowUpRight
                    className="size-3.5 shrink-0 opacity-50 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
