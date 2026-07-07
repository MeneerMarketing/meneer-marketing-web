"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";

const EASE = [0.22, 1, 0.36, 1] as const;

const FLOWS = [
  {
    id: "cart",
    label: "Abandoned cart",
    subject: "Je mandje wacht nog op je",
    stat: "+18% terug",
  },
  {
    id: "welcome",
    label: "Welcome flow",
    subject: "Welkom. Dit is je protocol.",
    stat: "42% open",
  },
  {
    id: "b2b",
    label: "B2B reorder",
    subject: "Salon #284 kan opnieuw bestellen",
    stat: "24/7 portaal",
  },
] as const;

export function DienstenHubBehoudVisual() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<(typeof FLOWS)[number]["id"]>("cart");
  const flow = FLOWS.find((f) => f.id === active)!;

  return (
    <div className="rounded-3xl border border-[#8D6E63]/20 bg-gradient-to-br from-[#F5F0EA] to-white p-5 shadow-[0_24px_56px_-32px_rgba(44,34,23,0.15)]">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8D6E63]">
        Live flow preview
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {FLOWS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setActive(f.id)}
            className={`rounded-full px-3 py-1.5 text-[10px] font-bold transition ${
              active === f.id
                ? "bg-[#8D6E63] text-white"
                : "border border-[#8D6E63]/25 bg-white text-[#45382C]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ ease: EASE }}
          className="mt-4 rounded-2xl border border-[#8D6E63]/15 bg-white p-4"
        >
          <div className="flex items-start gap-3">
            <InteractiveLogo className="size-9 shrink-0" interactive={false} />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold text-[#8D6E63]">Klaviyo · {flow.label}</p>
              <p className="mt-1 text-sm font-extrabold text-[#2C2217]">{flow.subject}</p>
              <p className="mt-2 inline-flex rounded-full bg-[#F5F0EA] px-2.5 py-0.5 text-[10px] font-bold text-[#45382C]">
                {flow.stat}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
