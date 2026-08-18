"use client";

import { useEffect, useRef, useState } from "react";

import { Reveal } from "@/components/effects/Reveal";
import { HuidkliniekPricingIntro } from "@/components/verticals/huidklinieken/HuidkliniekPricingIntro";
import type { VerticalCampaignPersonalization } from "@/data/verticals/types";
import type { VerticalInterestId } from "@/data/verticals/types";
import { HUIDKLINIEKEN_VERTICAL } from "@/data/verticals/huidklinieken";
import { packageIdToKey, packageKeyToInterest } from "@/lib/lge/package-map";
import { trackCampaignEvent } from "@/lib/lge/track-client";
import { trackHuidkliniekEvent } from "@/lib/verticals/analytics";
import {
  formatMonthlyWithSetup,
  getActiveLaunchPromo,
} from "@/lib/verticals/format-price";
import { PRICE_EXCL_BTW_LABEL } from "@/lib/verticals/vat";

const { packages, termDisclaimer, includedInfraNote, includedCareNote, launchPromo } =
  HUIDKLINIEKEN_VERTICAL.pricing;
const promo = getActiveLaunchPromo(HUIDKLINIEKEN_VERTICAL.pricing);

interface HuidkliniekPricingProps {
  campaignRef?: string | null;
  personalization?: VerticalCampaignPersonalization | null;
  onPackageSelect?: (interest: VerticalInterestId) => void;
}

export function HuidkliniekPricing({
  campaignRef = null,
  personalization = null,
  onPackageSelect,
}: HuidkliniekPricingProps) {
  const viewed = useRef(false);
  const campaignRecommended = personalization?.recommendedPackage ?? null;
  const [activeTier, setActiveTier] = useState<VerticalInterestId>(() => {
    if (campaignRecommended) {
      const mapped = packageKeyToInterest(campaignRecommended);
      if (mapped) return mapped;
    }
    return packages.find((p) => p.recommended)?.id ?? "local-growth";
  });

  useEffect(() => {
    const el = document.getElementById("pakketten");
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !viewed.current) {
          viewed.current = true;
          trackHuidkliniekEvent("huidkliniek_package_view");
          if (campaignRef) {
            void trackCampaignEvent(
              campaignRef,
              "PACKAGE_SECTION_VIEWED",
              { section: "pakketten", path: "/huidklinieken" },
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
      aria-labelledby="Huidkliniek-pricing-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,87,34,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,87,34,0.045) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <Reveal>
          <HuidkliniekPricingIntro
            headingId="Huidkliniek-pricing-heading"
            packages={packages}
            promo={promo ?? null}
            termDisclaimer={termDisclaimer}
            includedInfraNote={includedInfraNote}
            includedCareNote={includedCareNote}
            campaignRecommended={
              campaignRecommended
                ? packageKeyToInterest(campaignRecommended)
                : null
            }
            activeTier={activeTier}
            onActiveTierChange={setActiveTier}
          />
        </Reveal>

        <div className="mt-12 grid gap-5 lg:mt-14 lg:grid-cols-3 lg:items-stretch">
          {packages.map((pkg, i) => {
            const prices = formatMonthlyWithSetup(
              pkg.monthly,
              pkg.setup,
              launchPromo,
            );
            const recommended = campaignRecommended
              ? packageKeyToInterest(campaignRecommended) === pkg.id
              : Boolean(pkg.recommended);
            const focused = activeTier === pkg.id;

            return (
              <Reveal key={pkg.id} delay={i * 0.06} className="h-full">
                <article
                  id={`pakket-${pkg.id}`}
                  className={
                    recommended
                      ? `group relative flex h-full scroll-mt-28 flex-col rounded-3xl bg-slate-900 p-6 text-white shadow-[0_28px_70px_rgba(15,23,42,0.28)] transition duration-300 hover:-translate-y-1 sm:p-7${
                          focused
                            ? " ring-2 ring-[#FF5722] ring-offset-2 ring-offset-slate-50"
                            : ""
                        }`
                      : `group relative flex h-full scroll-mt-28 flex-col rounded-3xl border bg-white p-6 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.2)] transition duration-300 hover:-translate-y-1 sm:p-7${
                          focused
                            ? " border-[#FF5722] shadow-[0_24px_50px_-24px_rgba(255,87,34,0.3)] ring-2 ring-[#FF5722]/40 ring-offset-2 ring-offset-slate-50"
                            : " border-slate-200/90 hover:border-[#FF5722]/35 hover:shadow-[0_24px_50px_-24px_rgba(255,87,34,0.25)]"
                        }`
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
                      trackHuidkliniekEvent("huidkliniek_package_select", {
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
