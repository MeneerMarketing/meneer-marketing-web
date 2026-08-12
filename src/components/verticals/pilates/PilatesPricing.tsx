"use client";

import { useEffect, useRef } from "react";

import { Reveal } from "@/components/effects/Reveal";
import { PILATES_VERTICAL } from "@/data/verticals/pilates";
import { trackPilatesEvent } from "@/lib/verticals/analytics";
import {
  formatMonthlyWithSetup,
  getActiveLaunchPromo,
} from "@/lib/verticals/format-price";

const { packages, termDisclaimer, minTermMonths, launchPromo } =
  PILATES_VERTICAL.pricing;
const promo = getActiveLaunchPromo(PILATES_VERTICAL.pricing);

export function PilatesPricing() {
  const viewed = useRef(false);

  useEffect(() => {
    const el = document.getElementById("pakketten");
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !viewed.current) {
          viewed.current = true;
          trackPilatesEvent("pilates_package_view");
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="pakketten"
      className="border-b border-slate-200 bg-[#f3f7fb]"
      aria-labelledby="pilates-pricing-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <Reveal>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
              Pakketten
            </p>
            {promo ? (
              <span className="rounded-full bg-[#FF5722] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                {promo.badge}
              </span>
            ) : null}
          </div>
          <h2
            id="pilates-pricing-heading"
            className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.6rem] lg:leading-[1.08]"
          >
            Website.
            <span className="text-slate-400"> Dan vindbaarheid.</span>
            <span className="block text-[#FF5722]"> Dan complete groei.</span>
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Drie treden. Zelfde partner. Jij kiest hoe ver je digitaal wilt
            gaan. De meeste studio&apos;s landen op Local Growth.
          </p>
          {promo ? (
            <p className="mt-3 text-sm font-semibold text-slate-800">
              {promo.note}{" "}
              <span className="font-medium text-slate-500">
                ({termDisclaimer} {minTermMonths} maanden.)
              </span>
            </p>
          ) : (
            <p className="mt-3 text-sm font-medium text-slate-500">
              {termDisclaimer} ({minTermMonths} maanden).
            </p>
          )}
        </Reveal>

        <div className="mt-8 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          {packages.map((p, i) => (
            <span key={p.id} className="inline-flex items-center gap-2">
              <span
                className={
                  p.recommended
                    ? "rounded-full bg-slate-900 px-3 py-1 text-white"
                    : "rounded-full border border-slate-200 bg-white px-3 py-1"
                }
              >
                {p.ladderLabel}
              </span>
              {i < packages.length - 1 ? (
                <span className="text-slate-300" aria-hidden>
                  →
                </span>
              ) : null}
            </span>
          ))}
        </div>

        <div className="mt-10 grid gap-4 lg:mt-12 lg:grid-cols-3 lg:items-stretch lg:gap-5">
          {packages.map((pkg, i) => {
            const prices = formatMonthlyWithSetup(
              pkg.monthly,
              pkg.setup,
              launchPromo,
            );
            const recommended = Boolean(pkg.recommended);

            return (
              <Reveal key={pkg.id} delay={i * 0.06} className="h-full">
                <article
                  className={
                    recommended
                      ? "relative flex h-full flex-col bg-slate-900 p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.25)] sm:p-7"
                      : "flex h-full flex-col border border-slate-200 bg-white p-6 sm:p-7"
                  }
                >
                  {recommended ? (
                    <span className="absolute -top-3 left-6 bg-[#FF5722] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                      Meest gekozen
                    </span>
                  ) : null}

                  <p
                    className={
                      recommended
                        ? "text-[11px] font-bold uppercase tracking-[0.18em] text-orange-300"
                        : "text-[11px] font-bold uppercase tracking-[0.18em] text-[#FF5722]"
                    }
                  >
                    {pkg.eyebrow}
                  </p>
                  <h3 className="mt-2 text-2xl font-extrabold tracking-tight">
                    {pkg.name}
                  </h3>
                  <p
                    className={
                      recommended
                        ? "mt-2 text-sm font-medium text-slate-300"
                        : "mt-2 text-sm font-medium text-slate-600"
                    }
                  >
                    {pkg.tagline}
                  </p>

                  <div
                    className={
                      recommended
                        ? "mt-6 border-y border-white/10 py-5"
                        : "mt-6 border-y border-slate-100 py-5"
                    }
                  >
                    <p className="text-3xl font-extrabold tracking-tight">
                      {prices.monthly.replace(" per maand", "")}
                      <span
                        className={
                          recommended
                            ? "ml-1 text-sm font-semibold text-slate-400"
                            : "ml-1 text-sm font-semibold text-slate-500"
                        }
                      >
                        / maand
                      </span>
                    </p>
                    <p
                      className={
                        recommended
                          ? "mt-2 text-sm text-slate-300"
                          : "mt-2 text-sm text-slate-600"
                      }
                    >
                      {prices.setupWas ? (
                        <>
                          Launch{" "}
                          <span className="text-slate-400 line-through">
                            {prices.setupWas.replace(" launch", "")}
                          </span>{" "}
                          <span
                            className={
                              recommended
                                ? "font-bold text-orange-300"
                                : "font-bold text-[#FF5722]"
                            }
                          >
                            €0
                          </span>
                          <span className="ml-1 text-xs font-semibold uppercase tracking-wide text-emerald-400">
                            tijdelijk
                          </span>
                        </>
                      ) : (
                        <>+ {prices.setup}</>
                      )}
                    </p>
                  </div>

                  <ul
                    className={
                      recommended
                        ? "mt-5 flex-1 space-y-2 text-sm leading-snug text-slate-300"
                        : "mt-5 flex-1 space-y-2 text-sm leading-snug text-slate-600"
                    }
                  >
                    {pkg.inclusions.slice(0, 6).map((item) => (
                      <li key={item} className="flex gap-2">
                        <span
                          className="mt-1.5 size-1 shrink-0 rounded-full bg-[#FF5722]"
                          aria-hidden
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                    {pkg.inclusions.length > 6 ? (
                      <li className="pt-1 text-xs font-semibold text-slate-400">
                        + {pkg.inclusions.length - 6} onderdelen inbegrepen
                      </li>
                    ) : null}
                  </ul>

                  <a
                    href="#aanvraag"
                    onClick={() =>
                      trackPilatesEvent("pilates_package_select", {
                        package: pkg.id,
                      })
                    }
                    className={
                      recommended
                        ? "mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-[#FF5722] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#e64a19]"
                        : "mt-8 inline-flex w-full items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-bold text-slate-900 transition hover:border-[#FF5722] hover:text-[#FF5722]"
                    }
                  >
                    {pkg.ctaLabel}
                  </a>
                </article>
              </Reveal>
            );
          })}
        </div>

        <details className="mt-8 border border-slate-200 bg-white p-5 text-sm text-slate-600">
          <summary className="cursor-pointer font-bold text-slate-900">
            Alles wat erin zit, per pakket
          </summary>
          <div className="mt-4 grid gap-6 sm:grid-cols-3">
            {packages.map((pkg) => (
              <div key={`full-${pkg.id}`}>
                <p className="font-extrabold text-slate-900">{pkg.name}</p>
                <ul className="mt-2 space-y-1.5 text-xs leading-relaxed">
                  {pkg.inclusions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </details>
      </div>
    </section>
  );
}
