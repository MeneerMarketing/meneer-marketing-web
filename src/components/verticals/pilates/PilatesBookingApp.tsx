"use client";

import { Smartphone } from "lucide-react";

import { Reveal } from "@/components/effects/Reveal";
import { PILATES_VERTICAL } from "@/data/verticals/pilates";
import { trackPilatesEvent } from "@/lib/verticals/analytics";

const routes = PILATES_VERTICAL.bookingRoutes;

const ROUTE_LABELS: Record<string, string> = {
  existing: "Route A",
  "branded-app": "Route B",
  custom: "Route C",
};

export function PilatesBookingApp() {
  return (
    <section
      id="booking-app"
      className="border-b border-slate-200 bg-white"
      aria-labelledby="pilates-booking-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-14">
          <Reveal>
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
              Je hebt de oplossing nodig die bij je studio past. Niet de
              duurste omdat het kan. Ik kijk eerst wat budget en processen
              echt vragen.
            </p>

            <div className="relative mt-10 mx-auto max-w-[230px] lg:mx-0">
              <div
                className="absolute -inset-6 rounded-full bg-orange-100/60 blur-2xl"
                aria-hidden
              />
              <div className="relative rounded-[2rem] border-[6px] border-slate-900 bg-slate-900 p-2 shadow-2xl">
                <div className="aspect-[9/16] overflow-hidden rounded-[1.4rem] bg-gradient-to-b from-orange-50 to-white">
                  <div className="flex items-center justify-between px-4 pt-6">
                    <Smartphone className="size-4 text-[#FF5722]" aria-hidden />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Jouw studio
                    </span>
                  </div>
                  <div className="mt-5 px-4">
                    <p className="text-sm font-extrabold text-slate-900">
                      Vandaag op het rooster
                    </p>
                    <div className="mt-3 space-y-2">
                      {[
                        { t: "09:30", n: "Reformer" },
                        { t: "11:00", n: "Mat" },
                        { t: "18:30", n: "Private" },
                      ].map((slot) => (
                        <div
                          key={slot.t}
                          className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm"
                        >
                          <span className="text-xs font-bold text-slate-500">
                            {slot.t}
                          </span>
                          <span className="text-xs font-semibold text-slate-800">
                            {slot.n}
                          </span>
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                            Open
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 rounded-xl bg-[#FF5722] py-2.5 text-center text-xs font-bold text-white shadow-[0_8px_20px_rgba(255,87,34,0.35)]">
                      Boek je les
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="space-y-3">
            {routes.map((route, i) => (
              <Reveal key={route.id} delay={i * 0.06}>
                <article
                  className={
                    route.id === "branded-app"
                      ? "border-2 border-slate-900 bg-white p-6 sm:p-7"
                      : "border border-slate-200 bg-[#f7fafc] p-6 sm:p-7"
                  }
                  onMouseEnter={() => {
                    if (route.id !== "existing") {
                      trackPilatesEvent("pilates_booking_app_click", {
                        route: route.id,
                        interaction: "hover",
                      });
                    }
                  }}
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
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                    {route.lead}
                  </p>
                  <ul className="mt-4 space-y-1.5 text-sm text-slate-700">
                    {route.bullets.map((b) => (
                      <li key={b} className="flex gap-2">
                        <span className="mt-2 size-1 shrink-0 rounded-full bg-[#FF5722]" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  {route.priceNote ? (
                    <p className="mt-4 text-xs leading-relaxed text-slate-500">
                      {route.priceNote}
                    </p>
                  ) : null}
                </article>
              </Reveal>
            ))}
            <p className="px-1 pt-2 text-sm leading-relaxed text-slate-500">
              {PILATES_VERTICAL.bookingProviderNote}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
