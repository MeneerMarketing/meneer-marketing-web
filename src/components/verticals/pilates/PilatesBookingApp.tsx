"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Smartphone } from "lucide-react";
import { useRef, useState } from "react";

import { Reveal } from "@/components/effects/Reveal";
import { PILATES_VERTICAL } from "@/data/verticals/pilates";
import type { LgeBookingOptionKey } from "@/lib/lge/types";
import { trackCampaignEvent } from "@/lib/lge/track-client";
import { trackPilatesEvent } from "@/lib/verticals/analytics";

const routes = PILATES_VERTICAL.bookingRoutes;

const ROUTE_LABELS: Record<string, string> = {
  existing: "Route A",
  "branded-app": "Route B",
  custom: "Route C",
};

const ROUTE_TO_LGE: Record<string, LgeBookingOptionKey> = {
  existing: "EXISTING_BOOKING",
  "branded-app": "BRANDED_APP",
  custom: "CUSTOM_FUNNEL",
};

const PHONE_BY_ROUTE: Record<
  string,
  {
    badge: string;
    title: string;
    slots: { t: string; n: string; status: string }[];
    cta: string;
  }
> = {
  existing: {
    badge: "Gekoppeld",
    title: "Jouw huidige systeem",
    slots: [
      { t: "09:30", n: "Reformer", status: "Open" },
      { t: "11:00", n: "Mat", status: "Open" },
      { t: "18:30", n: "Private", status: "1 plek" },
    ],
    cta: "Boek via je systeem",
  },
  "branded-app": {
    badge: "Jouw app",
    title: "Vandaag op het rooster",
    slots: [
      { t: "09:30", n: "Reformer", status: "Open" },
      { t: "11:00", n: "Mat", status: "Open" },
      { t: "18:30", n: "Private", status: "Open" },
    ],
    cta: "Boek je les",
  },
  custom: {
    badge: "Maatwerk",
    title: "Proefles aanvragen",
    slots: [
      { t: "Stap 1", n: "Kies lesvorm", status: "✓" },
      { t: "Stap 2", n: "Kies moment", status: "Nu" },
      { t: "Stap 3", n: "Bevestig", status: "…" },
    ],
    cta: "Vraag proefles aan",
  },
};

const EASE = [0.22, 1, 0.36, 1] as const;

interface PilatesBookingAppProps {
  campaignRef?: string | null;
}

export function PilatesBookingApp({
  campaignRef = null,
}: PilatesBookingAppProps) {
  const seen = useRef<Set<string>>(new Set());
  const reduce = useReducedMotion();
  const defaultId =
    routes.find((r) => r.id === "branded-app")?.id ?? routes[0]!.id;
  const [activeId, setActiveId] = useState<(typeof routes)[number]["id"]>(
    defaultId,
  );
  const phone = PHONE_BY_ROUTE[activeId] ?? PHONE_BY_ROUTE["branded-app"]!;
  const activeRoute = routes.find((r) => r.id === activeId) ?? routes[0]!;

  function selectRoute(routeId: (typeof routes)[number]["id"]) {
    setActiveId(routeId);
    trackPilatesEvent("pilates_booking_app_click", {
      route: routeId,
      interaction: "select",
    });
    const key = ROUTE_TO_LGE[routeId];
    if (!campaignRef || !key || seen.current.has(key)) return;
    seen.current.add(key);
    void trackCampaignEvent(campaignRef, "BOOKING_OPTION_VIEWED", {
      booking_option: key,
      section: "booking-app",
    });
  }

  return (
    <section
      id="booking-app"
      className="relative overflow-hidden border-b border-slate-200 bg-white"
      aria-labelledby="pilates-booking-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,87,34,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,87,34,0.04) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch lg:gap-10">
          <Reveal className="h-full">
            <div className="flex h-full flex-col rounded-3xl border border-slate-200/90 bg-slate-50 p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
                Booking & app
              </p>
              <h2
                id="pilates-booking-heading"
                className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.5rem] lg:leading-[1.08]"
              >
                Van website naar boeken.
                <span className="mt-1 block text-slate-500">In één pad.</span>
              </h2>
              <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
                Tik een route. De telefoon laat zien hoe boeken eruitziet. Ik
                kies met jou wat budget en processen echt vragen.
              </p>

              <div className="relative mx-auto mt-8 w-full max-w-[230px] flex-1">
                <div
                  className="absolute -inset-6 rounded-full bg-orange-100/70 blur-2xl"
                  aria-hidden
                />
                <div className="relative rounded-[2rem] border-[6px] border-slate-900 bg-slate-900 p-2 shadow-2xl">
                  <div className="aspect-[9/16] overflow-hidden rounded-[1.4rem] bg-gradient-to-b from-orange-50 to-white">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeId}
                        initial={reduce ? false : { opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? undefined : { opacity: 0, y: -8 }}
                        transition={{ duration: 0.25, ease: EASE }}
                        className="h-full"
                      >
                        <div className="flex items-center justify-between px-4 pt-6">
                          <Smartphone
                            className="size-4 text-[#FF5722]"
                            aria-hidden
                          />
                          <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                            {phone.badge}
                          </span>
                        </div>
                        <div className="mt-5 px-4">
                          <p className="text-sm font-extrabold text-slate-900">
                            {phone.title}
                          </p>
                          <div className="mt-3 space-y-2">
                            {phone.slots.map((slot) => (
                              <div
                                key={`${slot.t}-${slot.n}`}
                                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm"
                              >
                                <span className="text-xs font-bold text-slate-500">
                                  {slot.t}
                                </span>
                                <span className="text-xs font-semibold text-slate-800">
                                  {slot.n}
                                </span>
                                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                                  {slot.status}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 rounded-xl bg-[#FF5722] py-2.5 text-center text-xs font-bold text-white shadow-[0_8px_20px_rgba(255,87,34,0.35)]">
                            {phone.cta}
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              <p className="mt-6 text-center text-xs font-semibold text-slate-400 lg:text-left">
                Actief: {activeRoute.title}
              </p>
            </div>
          </Reveal>

          <div className="flex h-full flex-col gap-3">
            {routes.map((route, i) => {
              const selected = activeId === route.id;
              return (
                <Reveal key={route.id} delay={i * 0.06} className="flex-1">
                  <button
                    type="button"
                    onClick={() => selectRoute(route.id)}
                    className={
                      selected
                        ? "flex h-full w-full flex-col rounded-3xl border-2 border-slate-900 bg-white p-6 text-left shadow-[0_20px_44px_-24px_rgba(15,23,42,0.35)] transition sm:p-7"
                        : "flex h-full w-full flex-col rounded-3xl border border-slate-200 bg-slate-50/80 p-6 text-left transition hover:border-slate-300 hover:bg-white sm:p-7"
                    }
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#FF5722]">
                        {ROUTE_LABELS[route.id]}
                      </span>
                      {route.providerExample ? (
                        <span className="text-xs font-semibold text-slate-400">
                          bv. {route.providerExample}
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mt-2 text-xl font-extrabold tracking-tight text-slate-900">
                      {route.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600 sm:text-base">
                      {route.lead}
                    </p>
                    <ul className="mt-4 space-y-1.5 text-sm text-slate-700">
                      {route.bullets.map((b) => (
                        <li key={b} className="flex gap-2">
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#FF5722]" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    {route.priceNote ? (
                      <p className="mt-4 text-xs leading-relaxed text-slate-500">
                        {route.priceNote}
                      </p>
                    ) : null}
                  </button>
                </Reveal>
              );
            })}
            <p className="px-1 pt-1 text-sm leading-relaxed text-slate-500">
              {PILATES_VERTICAL.bookingProviderNote}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
