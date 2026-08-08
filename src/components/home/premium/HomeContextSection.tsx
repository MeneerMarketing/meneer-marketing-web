"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LayoutTemplate, Megaphone, Users } from "lucide-react";
import { useState } from "react";
import { HOME_CONTEXT } from "@/data/home-premium";

const PAIN_POINTS = [
  {
    id: "team",
    icon: Users,
    label: "Wisselend team",
    title: "Iedere maand iemand anders aan de lijn",
    paragraphs: [
      "Je website bij bureau A, ads bij bureau B, SEO bij freelancer C. Niemand kent het geheel en jij bent de projectmanager. In WhatsApp-groepen, niet achter je eigen werk.",
      "Iedere partij optimaliseert z'n eigen stukje. Ads wijzen naar landingspagina's die traag zijn. SEO schrijft teksten die sales niet herkent. Content past niet bij wat Meta Ads belooft. Jij regelt wie wat doet, terwijl je bedrijf doorloopt.",
      "Dat patroon zie ik steeds opnieuw: pas als één iemand strategie, bouw en campagnes bewaakt, gaat het echt vooruit. Eén plan waar alles aan hangt, geen losse eilanden.",
    ],
    visual: "team" as const,
  },
  {
    id: "template",
    icon: LayoutTemplate,
    label: "Templates",
    title: "Mooi demo, straks vastgelopen",
    paragraphs: [
      "Templates en page builders lijken goedkoop. Tot je groeit. Dan botsen plugins, wordt alles traag en moet je alsnog opnieuw beginnen. Met de rekening van alles wat je al betaald had.",
      "Custom checkout? B2B-prijzen? Koppeling met je CRM of voorraad? Half gebeurt het met workarounds, half niet. Je zit vast in code die drie freelancers voor je hebben gestapeld. Niemand durft meer te raken.",
      "Ik bouw websites en shops from scratch. Custom code zonder template-plafond. Wel een fundament dat meegroeit als je ads opschaalt, je assortiment verdubbelt of je een B2B-portaal nodig hebt.",
    ],
    visual: "template" as const,
  },
  {
    id: "ads",
    icon: Megaphone,
    label: "Ads zonder plan",
    title: "Budget erin, omzet er niet uit",
    paragraphs: [
      "Ads aanzetten op een site die niet converteert is geld verbranden. Zonder meetplan en volgorde betaal je voor klikken zonder waarde. Duur leretje, elke maand opnieuw.",
      "Google Ads en Meta Ads werken pas als landingspagina, tracking en aanbod op één lijn zitten. Veel bureaus schalen budget op terwijl je checkout traag is, je pixel verkeerd staat of je PDP niemand overtuigt. Dan kocht je verkeer, geen klanten.",
      "De slimme volgorde is simpel: eerst SEO, site en mail. Daarna pas ads. Elke euro komt binnen op iets dat al verkocht. Dat is geen geluk. Dat is volgorde. En die bewaak ik voor jou ook.",
    ],
    visual: "ads" as const,
  },
] as const;

type PainId = (typeof PAIN_POINTS)[number]["id"];

function PainVisual({ type }: { type: "team" | "template" | "ads" }) {
  if (type === "team") {
    return (
      <div className="space-y-2 p-5">
        {["Website-bureau", "Ads-specialist", "SEO-freelancer"].map((label, i) => (
          <div
            key={label}
            className="flex items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2"
          >
            <span className="size-7 rounded-full bg-slate-200 text-center text-[10px] font-bold leading-7 text-slate-500">
              ?
            </span>
            <span className="text-xs font-bold text-slate-600">{label}</span>
            {i < 2 ? (
              <span className="ml-auto text-[10px] text-red-400">geen lijn</span>
            ) : null}
          </div>
        ))}
      </div>
    );
  }
  if (type === "template") {
    return (
      <div className="p-5">
        <div className="rounded-xl border-2 border-dashed border-amber-300 bg-amber-50/50 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Template</p>
          <div className="mt-2 space-y-1.5">
            <span className="block h-3 w-full rounded bg-amber-200/80" />
            <span className="block h-8 w-2/3 rounded bg-amber-200/60" />
          </div>
          <p className="mt-3 text-[10px] font-bold text-red-500">+ 12 plugins = traag</p>
        </div>
      </div>
    );
  }
  return (
    <div className="p-5">
      <div className="flex items-end justify-between gap-2">
        {["Budget", "Klikken", "Omzet"].map((l, i) => (
          <div key={l} className="flex flex-1 flex-col items-center gap-1">
            <div
              className={`w-full rounded-t-lg ${i === 2 ? "bg-emerald-400" : "bg-red-400"}`}
              style={{ height: i === 0 ? 64 : i === 1 ? 48 : 20 }}
            />
            <span className="text-[9px] font-bold text-slate-500">{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HomeContextSection() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<PainId>("team");
  const pain = PAIN_POINTS.find((p) => p.id === active)!;

  return (
    <section
      className="relative overflow-hidden border-b border-slate-200 bg-white"
      aria-labelledby="home-context-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.028)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.028)_1px,transparent_1px)] bg-[size:40px_40px]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
          Waarom anders
        </p>
        <h2
          id="home-context-heading"
          className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
        >
          {HOME_CONTEXT.angleTitle}
        </h2>
        <p className="mt-2 max-w-2xl text-lg text-slate-600">{HOME_CONTEXT.angleBody}</p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_minmax(0,380px)] lg:items-stretch lg:gap-12">
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#FF5722] via-[#FF5722] to-[#E65100] p-4 shadow-[0_32px_64px_-28px_rgba(255,87,34,0.45)] ring-1 ring-[#FF5722]/40 sm:p-5">
            <div
              className="pointer-events-none absolute -left-8 -bottom-8 size-40 rounded-full bg-white/15 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:32px_32px]"
              aria-hidden
            />

            <div className="relative grid gap-2 sm:grid-cols-3">
              {PAIN_POINTS.map((p) => {
                const Icon = p.icon;
                const isActive = active === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setActive(p.id)}
                    className={`rounded-2xl border px-4 py-4 text-left transition-all duration-300 ${
                      isActive
                        ? "border-white bg-white text-[#FF5722] shadow-[0_12px_32px_-10px_rgba(0,0,0,0.18)]"
                        : "border-white/30 bg-white/15 text-white hover:border-white/50 hover:bg-white/25"
                    }`}
                  >
                    <Icon
                      className={`size-5 ${isActive ? "text-[#FF5722]" : "text-white"}`}
                      strokeWidth={1.8}
                    />
                    <p
                      className={`mt-2 text-xs font-bold uppercase tracking-wider ${
                        isActive ? "text-[#FF5722]" : "text-white"
                      }`}
                    >
                      {p.label}
                    </p>
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="relative mt-4 flex flex-1 flex-col rounded-2xl border border-white/25 bg-white/10 p-5 backdrop-blur-sm sm:p-6"
              >
                <span className="inline-flex w-fit rounded-full border border-white/40 bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                  {pain.label}
                </span>
                <h3 className="mt-3 text-lg font-extrabold text-white sm:text-xl">{pain.title}</h3>
                <div className="mt-4 flex flex-1 flex-col gap-3">
                  {pain.paragraphs.map((paragraph, index) => (
                    <p
                      key={paragraph.slice(0, 32)}
                      className={`text-sm leading-relaxed ${
                        index === 0 ? "font-semibold text-white" : "text-white/85"
                      }`}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="relative mt-4 overflow-hidden rounded-2xl border border-white/25 bg-white lg:hidden">
              <PainVisual type={pain.visual} />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_16px_40px_-24px_rgba(15,23,42,0.15)] lg:block">
              <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
                <span className="size-2 rounded-full bg-[#FF5722]/80" />
                <span className="size-2 rounded-full bg-amber-400/80" />
                <span className="size-2 rounded-full bg-emerald-400/80" />
                <span className="ml-2 font-mono text-[10px] text-slate-400">bureau-vs-partner</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <PainVisual type={pain.visual} />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-[#FF5722]/20 bg-gradient-to-br from-[#FF5722]/[0.06] to-white p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FF5722]">
                Wist je dit?
              </p>
              <p
                className="pointer-events-none absolute -right-2 top-2 select-none text-7xl font-black tracking-tighter text-[#FF5722]/[0.07]"
                aria-hidden
              >
                {HOME_CONTEXT.funFactStat}
              </p>
              <p className="relative mt-3 text-base font-extrabold leading-snug text-slate-900">
                {HOME_CONTEXT.funFact}
              </p>
              <p className="relative mt-3 text-xs font-bold uppercase tracking-[0.14em] text-[#FF5722]">
                {HOME_CONTEXT.funFactSource}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
