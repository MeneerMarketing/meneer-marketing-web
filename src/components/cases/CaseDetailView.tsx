import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";

import { Reveal } from "@/components/effects/Reveal";
import { CaseLivePreview } from "@/components/cases/CaseLivePreview";
import type { CaseDetail } from "@/data/cases-detail";
import { getCaseSeo } from "@/lib/seo/case-seo";
import { EeatCaseCredit } from "@/components/seo/EeatCaseCredit";
import { siteCtas } from "@/lib/cta";

interface CaseDetailViewProps {
  caseData: CaseDetail;
}

export function CaseDetailView({ caseData }: CaseDetailViewProps) {
  const { story, palette } = caseData;

  return (
    <>
      <header
        className="relative overflow-hidden border-b border-slate-800 bg-slate-950"
        style={{ background: `linear-gradient(135deg, ${palette.deep} 0%, #0f172a 55%)` }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          aria-hidden
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20 lg:px-8">
          <nav className="text-sm font-semibold text-slate-500" aria-label="Broodkruimel">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/cases" className="hover:text-white">
                  Cases
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-slate-300">{caseData.client}</li>
            </ol>
          </nav>

          <Reveal>
            <p
              className="mt-6 text-[11px] font-bold uppercase tracking-[0.22em]"
              style={{ color: palette.accent === "#45382C" ? "#F3C65B" : palette.accent }}
            >
              {caseData.eyebrow}
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              {caseData.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-400">
              {story.hook}
            </p>
            <p className="mt-4 max-w-2xl text-base font-semibold italic text-slate-300">
              &ldquo;{story.meneerLine}&rdquo;
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {caseData.website ? (
                <a
                  href={caseData.website.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
                >
                  Bekijk live site
                  <ExternalLink className="size-4" aria-hidden />
                </a>
              ) : null}
              <Link
                href={siteCtas.startIntake.href}
                className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-white shadow-lg"
                style={{ backgroundColor: palette.accent === "#45382C" ? "#FF5722" : palette.accent }}
              >
                {siteCtas.startIntake.label}
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </div>
          </Reveal>
        </div>
      </header>

      <section className="border-b border-slate-200 bg-white py-14 lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-start lg:px-8">
          <Reveal>
            <CaseLivePreview caseItem={caseData} />
          </Reveal>
          <div className="space-y-6">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Wat ik bouwde
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {caseData.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </Reveal>
            {story.beats.map((beat, i) => (
              <Reveal key={beat.label} delay={0.06 * (i + 1)}>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#FF5722]">
                    {beat.label}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">{beat.text}</p>
                </div>
              </Reveal>
            ))}
            <Reveal delay={0.3}>
              <p className="rounded-2xl border-2 border-[#FF5722]/30 bg-orange-50 px-5 py-4 text-sm font-bold text-slate-900">
                {story.punch}
              </p>
            </Reveal>
            <Reveal delay={0.35}>
              <EeatCaseCredit
                client={caseData.client}
                metric={caseData.metric}
                metricHint={caseData.metricHint}
                publishedAt={getCaseSeo(caseData.id)?.publishedAt ?? "2025-01-01"}
                websiteUrl={caseData.website?.url}
              />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-extrabold text-slate-900">Diensten in dit traject</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {caseData.services.map((s) => (
              <li
                key={s.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <p className="text-sm font-extrabold text-slate-900">{s.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">{s.blurb}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-slate-950 py-14 text-center">
        <div className="mx-auto max-w-xl px-4">
          <h2 className="text-2xl font-extrabold text-white">Jouw case hier?</h2>
          <p className="mt-3 text-slate-400">
            Geen nep-successen. Wel trajecten waar je trots op bent.
          </p>
          <Link
            href={siteCtas.startIntake.href}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#FF5722] px-7 py-4 text-sm font-bold text-white"
          >
            {siteCtas.startIntake.label}
            <ArrowUpRight className="size-4" aria-hidden />
          </Link>
          <Link
            href="/cases"
            className="mt-6 flex items-center justify-center gap-2 text-sm font-bold text-slate-400 hover:text-white"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Alle cases
          </Link>
        </div>
      </section>
    </>
  );
}
