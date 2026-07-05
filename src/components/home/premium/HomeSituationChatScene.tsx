"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";

type ChatLine = { from: "meneer" | "jij"; text: string };

const CHAT_BY_SITUATION: Record<string, readonly ChatLine[]> = {
  start: [
    { from: "meneer", text: "Waar wil je over een jaar staan?" },
    { from: "jij", text: "Meer klanten. Maar ik weet niet waar ik begin." },
    { from: "meneer", text: "Site, vindbaarheid of ads als eerste?" },
    { from: "jij", text: "Alles tegelijk lijkt me het snelst." },
    { from: "meneer", text: "Eén route eerst. Strategie. Dan pas gas." },
  ],
  site: [
    { from: "meneer", text: "Wat houdt je site of shop tegen?" },
    { from: "jij", text: "Traag, gedateerd en converteert niet." },
    { from: "meneer", text: "Template of echt maatwerk?" },
    { from: "jij", text: "Theme. Ads worden alleen duurder." },
    { from: "meneer", text: "From scratch is vaak goedkoper op lange termijn." },
  ],
  find: [
    { from: "meneer", text: "Waar zoeken klanten naar jou?" },
    { from: "jij", text: "Google. We staan pagina twee." },
    { from: "meneer", text: "En in ChatGPT als iemand vraagt wie ze moeten kiezen?" },
    { from: "jij", text: "Geen idee of we daar bestaan." },
    { from: "meneer", text: "SEO én AI-antwoorden. Dat is je goedkoopste traffic." },
  ],
  ads: [
    { from: "meneer", text: "Wat kost een klant je nu echt?" },
    { from: "jij", text: "Geen idee. ROAS schommelt elke week." },
    { from: "meneer", text: "Kloppen je landings met je ads?" },
    { from: "jij", text: "Snel live gegaan. Waarschijnlijk niet." },
    { from: "meneer", text: "Meting eerst. Dan pas opschalen." },
  ],
  retain: [
    { from: "meneer", text: "Hoeveel kopers komen terug?" },
    { from: "jij", text: "Geen clue. Af en toe een nieuwsbrief." },
    { from: "meneer", text: "Mail na aankoop? Win-back?" },
    { from: "jij", text: "Nee. Te druk met nieuwe klanten werven." },
    { from: "meneer", text: "Retentie is je goedkoopste omzet. Start daar." },
  ],
};

interface HomeSituationChatSceneProps {
  situationId: string;
  situationLabel: string;
}

export function HomeSituationChatScene({
  situationId,
  situationLabel,
}: HomeSituationChatSceneProps) {
  const reduce = useReducedMotion() ?? false;
  const chat = CHAT_BY_SITUATION[situationId] ?? CHAT_BY_SITUATION.start!;
  const [step, setStep] = useState(0);

  useEffect(() => {
    setStep(0);
  }, [situationId]);

  const visible = chat.slice(0, step + 1);
  const done = step >= chat.length - 1;

  const next = useCallback(() => {
    setStep((s) => Math.min(s + 1, chat.length - 1));
  }, [chat.length]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={situationId}
        initial={reduce ? undefined : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduce ? undefined : { opacity: 0, y: -6 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="flex min-h-[280px] flex-1 flex-col justify-between p-5 sm:p-6"
      >
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Jouw situatie · {situationLabel}
          </p>
          <p className="mt-1 text-xs font-semibold text-slate-500">
            Klik door. Zo voelt een intake-gesprek.
          </p>

          <div className="mt-4 max-h-[220px] space-y-2.5 overflow-y-auto pr-1">
            <AnimatePresence initial={false}>
              {visible.map((msg, i) => (
                <motion.div
                  key={`${situationId}-${i}`}
                  initial={reduce ? false : { opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 340, damping: 24 }}
                  className={`flex items-end gap-2 ${msg.from === "jij" ? "flex-row-reverse" : ""}`}
                >
                  {msg.from === "meneer" ? (
                    <InteractiveLogo className="size-7 shrink-0" />
                  ) : (
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] font-black text-slate-500">
                      J
                    </span>
                  )}
                  <span
                    className={`max-w-[78%] rounded-2xl px-3 py-2 text-[11px] font-bold leading-snug ${
                      msg.from === "meneer"
                        ? "rounded-bl-sm bg-slate-900 text-white"
                        : "rounded-br-sm border border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    {msg.text}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <button
          type="button"
          onClick={next}
          disabled={done}
          className={`mt-4 inline-flex items-center justify-center gap-1.5 self-start rounded-full px-4 py-2 text-xs font-bold transition ${
            done
              ? "cursor-default bg-emerald-50 text-emerald-600"
              : "bg-[#FF5722] text-white hover:bg-orange-600"
          }`}
        >
          {done ? (
            <>
              <Check className="size-3.5" aria-hidden />
              Helder. Route links klopt.
            </>
          ) : (
            <>
              Volgende vraag
              <ChevronRight className="size-3.5" aria-hidden />
            </>
          )}
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
