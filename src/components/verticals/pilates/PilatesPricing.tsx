"use client";

import { useEffect, useRef } from "react";

import { Reveal } from "@/components/effects/Reveal";
import type { VerticalCampaignPersonalization } from "@/data/verticals/types";
import type { VerticalInterestId } from "@/data/verticals/types";
import { PILATES_VERTICAL } from "@/data/verticals/pilates";
import { packageIdToKey, packageKeyToInterest } from "@/lib/lge/package-map";
import { trackCampaignEvent } from "@/lib/lge/track-client";
import { trackPilatesEvent } from "@/lib/verticals/analytics";
import {
  formatMonthlyWithSetup,
  getActiveLaunchPromo,
} from "@/lib/verticals/format-price";
import { PRICE_EXCL_BTW_LABEL } from "@/lib/verticals/vat";

const { packages, termDisclaimer, includedInfraNote, includedCareNote, minTermMonths, launchPromo } =
  PILATES_VERTICAL.pricing;
const promo = getActiveLaunchPromo(PILATES_VERTICAL.pricing);

interface PilatesPricingProps {
  campaignRef?: string | null;
  personalization?: VerticalCampaignPersonalization | null;
  onPackageSelect?: (interest: VerticalInterestId) => void;
}

export function PilatesPricing({
  campaignRef = null,
  personalization = null,
  onPackageSelect,
}: PilatesPricingProps) {
  const viewed = useRef(false);
  const campaignRecommended = personalization?.recommendedPackage ?? null;

  useEffect(() => {
    const el = document.getElementById("pakketten");
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !viewed.current) {
          viewed.current = true;
          trackPilatesEvent("pilates_package_view");
          if (campaignRef) {
            void trackCampaignEvent(
              campaignRef,
              "PACKAGE_SECTION_VIEWED",
              { section: "pakketten", path: "/pilates-studios" },
              `PACKAGE_SECTION_VIEWED:${campaignRef}`,
            );
          }
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [campaignRef]);

  return (
    <section
      id="pakketten"
      className="relative overflow-hidden border-b border-slate-200 bg-slate-50"
      aria-labelledby="pilates-pricing-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-45"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,87,34,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,87,34,0.045) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
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
            gaan.
            {campaignRecommended
              ? " Op basis van jullie website en lokale groeikansen ligt één pakket het dichtst bij."
              : " De meeste studio's landen op Local Growth."}
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
          <p className="mt-2 text-sm font-semibold text-slate-700">
            {includedInfraNote}
          </p>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-600">
            {includedCareNote}
          </p>
        </Reveal>

        <div className="mt-8 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          {packages.map((p, i) => (
            <span key={p.id} className="inline-flex items-center gap-2">
              <span
                className={
                  (campaignRecommended
                    ? packageKeyToInterest(campaignRecommended) === p.id
                    : p.recommended)
                    ? "rounded-full bg-slate-900 px-3 py-1 text-white shadow-md"
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

        <div className="mt-10 grid gap-5 lg:mt-12 lg:grid-cols-3 lg:items-stretch">
          {packages.map((pkg, i) => {
            const prices = formatMonthlyWithSetup(
              pkg.monthly,
              pkg.setup,
              launchPromo,
            );
            const recommended = campaignRecommended
              ? packageKeyToInterest(campaignRecommended) === pkg.id
              : Boolean(pkg.recommended);

            return (
              <Reveal key={pkg.id} delay={i * 0.06} className="h-full">
                <article
                  className={
                    recommended
                      ? "group relative flex h-full flex-col rounded-3xl bg-slate-900 p-6 text-white shadow-[0_28px_70px_rgba(15,23,42,0.28)] transition duration-300 hover:-translate-y-1 sm:p-7"
                      : "group relative flex h-full flex-col rounded-3xl border border-slate-200/90 bg-white p-6 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.2)] transition duration-300 hover:-translate-y-1 hover:border-[#FF5722]/35 hover:shadow-[0_24px_50px_-24px_rgba(255,87,34,0.25)] sm:p-7"
                  }
                >
                  {recommended ? (
                    <span className="absolute -top-3 left-6 rounded-full bg-[#FF5722] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white shadow-lg">
                      {campaignRecommended
                        ? "Aanbevolen voor jullie"
                        : "Meest gekozen"}
                    </span>
                  ) : pkg.id === "studio-edition" ? (
                    <span className="absolute -top-3 left-6 rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white shadow-lg">
                      Live in 5 werkdagen
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
                        ? "mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-5"
                        : "mt-6 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-5"
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
                          ? "mt-1 text-xs font-semibold uppercase tracking-wide text-slate-400"
                          : "mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500"
                      }
                    >
                      {PRICE_EXCL_BTW_LABEL}
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
                          className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#FF5722]"
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
                    onClick={() => {
                      trackPilatesEvent("pilates_package_select", {
                        package: pkg.id,
                      });
                      onPackageSelect?.(pkg.id);
                      const key = packageIdToKey(pkg.id);
                      if (campaignRef && key) {
                        void trackCampaignEvent(campaignRef, "PACKAGE_SELECTED", {
                          package: key,
                        });
                      }
                    }}
                    className={
                      recommended
                        ? "mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-[#FF5722] px-5 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_rgba(255,87,34,0.35)] transition hover:bg-[#e64a19]"
                        : "mt-8 inline-flex w-full items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-bold text-slate-900 transition group-hover:border-[#FF5722] group-hover:text-[#FF5722]"
                    }
                  >
                    {pkg.ctaLabel}
                  </a>
                </article>
              </Reveal>
            );
          })}
        </div>

        <details className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
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
