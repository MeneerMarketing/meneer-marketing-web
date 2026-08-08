"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/effects/Reveal";
import { siteCtas } from "@/lib/cta";

interface SeoLandingInlineCtaProps {
  readonly title: string;
  readonly body: string;
  readonly variant?: "light" | "dark";
}

/**
 * Mid-page conversieband op SEO-landings. Tussen lange tekstblokken.
 */
export function SeoLandingInlineCta({
  title,
  body,
  variant = "light",
}: SeoLandingInlineCtaProps) {
  const isDark = variant === "dark";

  return (
    <section
      className={
        isDark
          ? "border-b border-slate-800 bg-slate-950 py-12 lg:py-14"
          : "border-b border-slate-200 bg-gradient-to-br from-orange-50/70 via-white to-white py-12 lg:py-14"
      }
      aria-label="Plan een gesprek"
    >
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <Reveal>
          <div
            className={
              isDark
                ? "rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-center lg:p-8"
                : "rounded-3xl border border-[#FF5722]/15 bg-white p-6 text-center shadow-[0_20px_50px_-30px_rgba(255,87,34,0.35)] lg:p-8"
            }
          >
            <h2
              className={`text-pretty text-xl font-extrabold tracking-tight sm:text-2xl ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              {title}
            </h2>
            <p
              className={`mx-auto mt-3 max-w-xl text-pretty text-sm leading-relaxed sm:text-base ${
                isDark ? "text-white/75" : "text-slate-600"
              }`}
            >
              {body}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={siteCtas.startIntake.href}
                className="inline-flex items-center gap-2 rounded-full bg-[#FF5722] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600"
              >
                {siteCtas.startIntake.label}
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
              <Link
                href={siteCtas.contact.href}
                className={`inline-flex items-center gap-2 rounded-full border-2 px-6 py-3.5 text-sm font-bold transition ${
                  isDark
                    ? "border-white/25 text-white hover:bg-white hover:text-slate-900"
                    : "border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white"
                }`}
              >
                {siteCtas.contact.label}
              </Link>
            </div>
            <p
              className={`mt-4 text-xs font-medium ${
                isDark ? "text-white/45" : "text-slate-500"
              }`}
            >
              Vrijblijvend · Reactie binnen 1 à 2 werkdagen · Je praat met mij
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
