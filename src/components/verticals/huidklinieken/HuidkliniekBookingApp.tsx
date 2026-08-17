"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Smartphone } from "lucide-react";
import { useRef, useState } from "react";

import { Reveal } from "@/components/effects/Reveal";
import { HUIDKLINIEKEN_VERTICAL } from "@/data/verticals/huidklinieken";
import type { LgeBookingOptionKey } from "@/lib/lge/types";
import { trackCampaignEvent } from "@/lib/lge/track-client";
import { trackHuidkliniekEvent } from "@/lib/verticals/analytics";

const routes = HUIDKLINIEKEN_VERTICAL.bookingRoutes;

type RouteId = (typeof routes)[number]["id"];

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
    notes: [string, string];
  }
> = {
  existing: {
    badge: "Gekoppeld",
    title: "Jouw huidige systeem",
    slots: [
      { t: "09:30", n: "Intake", status: "Open" },
      { t: "11:00", n: "Consult", status: "Open" },
      { t: "16:30", n: "Nazorg", status: "1 plek" },
    ],
    cta: "Boek via je systeem",
    notes: ["Agenda blijft waar die is", "Patiënten merken geen verhuizing"],
  },
  "branded-app": {
    badge: "Jouw app",
    title: "Vandaag in de agenda",
    slots: [
      { t: "09:30", n: "Intake", status: "Open" },
      { t: "11:00", n: "Consult", status: "Open" },
      { t: "16:30", n: "Herhaal", status: "Open" },
    ],
    cta: "Boek je afspraak",
    notes: ["Jouw logo op het icoon", "Pushmelding als een plek vrijkomt"],
  },
  custom: {
    badge: "Maatwerk",
    title: "Intake aanvragen",
    slots: [
      { t: "Kies", n: "Behandeling", status: "✓" },
      { t: "Kies", n: "Moment", status: "Nu" },
      { t: "Rond af", n: "Bevestig", status: "…" },
    ],
    cta: "Vraag intake aan",
    notes: ["Eigen flow, eigen regels", "Voor bijzondere processen"],
  },
};

const EASE = [0.22, 1, 0.36, 1] as const;

interface HuidkliniekBookingAppProps {
  campaignRef?: string | null;
}

export function HuidkliniekBookingApp({
  campaignRef = null,
}: HuidkliniekBookingAppProps) {
  const seen = useRef<Set<string>>(new Set());
  const reduce = useReducedMotion();
  const defaultId: RouteId =
    routes.find((r) => r.id === "branded-app")?.id ?? routes[0]!.id;
  const [activeId, setActiveId] = useState<RouteId>(defaultId);
  const phone = PHONE_BY_ROUTE[activeId] ?? PHONE_BY_ROUTE["branded-app"]!;

  function selectRoute(routeId: RouteId) {
    setActiveId(routeId);
    trackHuidkliniekEvent("huidkliniek_booking_app_click", {
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
      aria-labelledby="Huidkliniek-booking-heading"
    >
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
              Booking & app
            </p>
            <h2
              id="Huidkliniek-booking-heading"
              className="mt-3 text-3xl font-extrabold tracking-tight text-balance text-slate-900 sm:text-4xl lg:text-[2.6rem] lg:leading-[1.08]"
            >
              Van website naar afspraak.
              <span className="text-slate-400"> In één pad.</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              Kies hieronder een route. De telefoon laat meteen zien hoe boeken
              er dan uitziet voor je patiënten.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="relative mt-12 flex items-center justify-center">
            <div
              className="pointer-events-none absolute inset-x-0 top-1/2 hidden h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-slate-200 to-transparent lg:block"
              aria-hidden
            />

            <AnimatePresence mode="wait">
              <motion.p
                key={`left-${activeId}`}
                initial={reduce ? false : { opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? undefined : { opacity: 0, x: -8 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="absolute right-1/2 mr-[150px] hidden max-w-[190px] -rotate-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-lg lg:block"
              >
                {phone.notes[0]}
              </motion.p>
            </AnimatePresence>

            <div className="relative w-full max-w-[240px]">
              <div
                className="absolute -inset-8 rounded-full bg-orange-100/70 blur-3xl"
                aria-hidden
              />
              <div className="relative rounded-[2.2rem] border-[7px] border-slate-900 bg-slate-900 p-2 shadow-[0_30px_70px_-25px_rgba(15,23,42,0.6)]">
                <div className="aspect-[9/16] overflow-hidden rounded-[1.5rem] bg-gradient-to-b from-orange-50 to-white">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeId}
                      initial={reduce ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduce ? undefined : { opacity: 0, y: -10 }}
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

            <AnimatePresence mode="wait">
              <motion.p
                key={`right-${activeId}`}
                initial={reduce ? false : { opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? undefined : { opacity: 0, x: 8 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="absolute left-1/2 ml-[150px] hidden max-w-[190px] rotate-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-lg lg:block"
              >
                {phone.notes[1]}
              </motion.p>
            </AnimatePresence>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-3 lg:grid-cols-3">
          {routes.map((route, i) => {
            const selected = activeId === route.id;
            return (
              <Reveal key={route.id} delay={i * 0.06} className="h-full">
                <button
                  type="button"
                  onClick={() => selectRoute(route.id)}
                  aria-pressed={selected}
                  className={
                    selected
                      ? "relative flex h-full w-full flex-col rounded-2xl border-2 border-slate-900 bg-white p-5 text-left shadow-[0_20px_44px_-28px_rgba(15,23,42,0.4)] transition sm:p-6"
                      : "relative flex h-full w-full flex-col rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left transition hover:border-slate-300 hover:bg-white sm:p-6"
                  }
                >
                  <span
                    className={
                      selected
                        ? "absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 rounded-sm bg-slate-900"
                        : "hidden"
                    }
                    aria-hidden
                  />
                  <span className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      className={
                        selected
                          ? "rounded-full bg-[#FF5722] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white"
                          : "rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 ring-1 ring-slate-200"
                      }
                    >
                      {selected ? "In beeld" : "Bekijk"}
                    </span>
                    {route.providerExample ? (
                      <span className="text-xs font-semibold text-slate-400">
                        bv. {route.providerExample}
                      </span>
                    ) : null}
                  </span>

                  <span className="mt-3 block text-lg font-extrabold tracking-tight text-slate-900">
                    {route.title}
                  </span>
                  <span className="mt-2 block flex-1 text-sm leading-relaxed text-slate-600">
                    {route.lead}
                  </span>
                  <span className="mt-4 block space-y-1.5">
                    {route.bullets.map((b) => (
                      <span key={b} className="flex gap-2 text-sm text-slate-700">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#FF5722]" />
                        <span>{b}</span>
                      </span>
                    ))}
                  </span>
                  {route.priceNote ? (
                    <span className="mt-4 block text-xs leading-relaxed text-slate-500">
                      {route.priceNote}
                    </span>
                  ) : null}
                </button>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.16}>
          <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-relaxed text-slate-500">
            {HUIDKLINIEKEN_VERTICAL.bookingProviderNote}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
