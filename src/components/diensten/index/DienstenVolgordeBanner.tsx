import Link from "next/link";
import { ArrowUpRight, TrendingUp } from "lucide-react";

import { Reveal } from "@/components/effects/Reveal";
import { DIENSTEN_VOLGORDE } from "@/data/diensten-index";

export function DienstenVolgordeBanner() {
  return (
    <section
      className="border-b border-slate-200 bg-white"
      aria-labelledby="diensten-volgorde-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-orange-50 via-white to-sky-50 shadow-[0_24px_60px_-32px_rgba(255,87,34,0.25)]">
          <div className="grid lg:grid-cols-2 lg:items-stretch">
            <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
              <Reveal>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
                  {DIENSTEN_VOLGORDE.eyebrow}
                </p>
                <h2
                  id="diensten-volgorde-heading"
                  className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
                >
                  {DIENSTEN_VOLGORDE.title}{" "}
                  <span className="text-[#FF5722]">{DIENSTEN_VOLGORDE.titleAccent}</span>
                </h2>
                <p className="mt-4 text-base leading-relaxed text-slate-600">
                  {DIENSTEN_VOLGORDE.body}
                </p>
                <ul className="mt-6 space-y-3">
                  {DIENSTEN_VOLGORDE.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex gap-3 text-sm font-semibold leading-snug text-slate-700"
                    >
                      <TrendingUp
                        className="mt-0.5 size-4 shrink-0 text-[#FF5722]"
                        aria-hidden
                      />
                      {b}
                    </li>
                  ))}
                </ul>
                <Link
                  href={DIENSTEN_VOLGORDE.cta.href}
                  className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-slate-900 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                  {DIENSTEN_VOLGORDE.cta.label}
                  <ArrowUpRight className="size-4" aria-hidden />
                </Link>
              </Reveal>
            </div>

            <div
              className="relative flex min-h-[240px] items-center justify-center bg-slate-900 p-8 lg:min-h-0"
              aria-hidden
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />
              <div className="relative w-full max-w-xs space-y-3">
                {["Site & shop", "SEO & mail", "Google Ads & Meta"].map((step, i) => (
                  <div
                    key={step}
                    className={`rounded-xl border px-4 py-3 text-center text-sm font-bold ${
                      i === 2
                        ? "border-[#FF5722]/50 bg-[#FF5722]/20 text-[#FF5722]"
                        : "border-white/15 bg-white/5 text-white"
                    }`}
                  >
                    {step}
                    {i < 2 ? (
                      <span className="mt-2 block text-[10px] font-semibold text-slate-400">
                        eerst dit
                      </span>
                    ) : (
                      <span className="mt-2 block text-[10px] font-semibold text-orange-300">
                        pas als het fundament staat
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
