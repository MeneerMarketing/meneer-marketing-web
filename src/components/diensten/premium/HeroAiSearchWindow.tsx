"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useHeroTilt } from "@/components/diensten/premium/useHeroTilt";

const EASE = [0.22, 1, 0.36, 1] as const;

const USER_Q = "Welk bedrijf raad je aan voor [jouw dienst] in Nederland?";
const AI_PARTS = [
  "Op basis van reviews, expertise en bereikbaarheid valt ",
  "jouw bedrijf",
  " op als betrouwbare keuze. Ze scoren sterk op service en hebben duidelijke informatie online.",
] as const;

const MODELS = ["ChatGPT", "Gemini"] as const;

/**
 * AI-chat die jouw merk citeert. Typ-effect + model-chips.
 */
export function HeroAiSearchWindow() {
  const reduce = useReducedMotion() ?? false;
  const { rotateX, rotateY, onMove, onLeave } = useHeroTilt(0.75);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [phase, setPhase] = useState<"idle" | "typing" | "done">(reduce ? "done" : "idle");
  const [chars, setChars] = useState(reduce ? AI_PARTS.join("") : "");

  useEffect(() => {
    if (!isInView || reduce) return;
    const start = window.setTimeout(() => setPhase("typing"), 600);
    return () => window.clearTimeout(start);
  }, [isInView, reduce]);

  useEffect(() => {
    if (phase !== "typing" || reduce) return;
    const full = AI_PARTS.join("");
    let i = 0;
    const tick = window.setInterval(() => {
      i += 2;
      setChars(full.slice(0, i));
      if (i >= full.length) {
        window.clearInterval(tick);
        setPhase("done");
      }
    }, 28);
    return () => window.clearInterval(tick);
  }, [phase, reduce]);

  return (
    <div
      ref={ref}
      className="relative mx-auto h-[420px] w-full max-w-[440px] [perspective:1400px]"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div
        className="pointer-events-none absolute -left-6 top-16 size-48 rounded-full bg-violet-200/25 blur-3xl"
        aria-hidden
      />

      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative flex h-full flex-col items-center justify-center gap-4 px-3"
      >
        {/* Model pills */}
        <div
          className="flex gap-2"
          style={{ transform: "translateZ(40px)" }}
        >
          {MODELS.map((m, i) => (
            <motion.span
              key={m}
              initial={reduce ? undefined : { opacity: 0, y: -8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.08, ease: EASE }}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-bold text-slate-600 shadow-sm"
            >
              <Sparkles className="size-3 text-violet-500" aria-hidden />
              {m}
            </motion.span>
          ))}
        </div>

        {/* Chat card */}
        <motion.div
          initial={reduce ? undefined : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: EASE }}
          className="w-full max-w-[340px] rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_24px_48px_-28px_rgba(15,23,42,0.25)]"
          style={{ transform: "translateZ(35px)" }}
        >
          <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="size-2 rounded-full bg-emerald-400" aria-hidden />
            <span className="font-mono text-[10px] font-semibold text-slate-400">
              ai-antwoord.live
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-end">
              <span className="max-w-[85%] rounded-2xl rounded-br-sm bg-slate-900 px-3 py-2 text-[11px] font-medium leading-snug text-white">
                {USER_Q}
              </span>
            </div>

            <div className="flex gap-2">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-sky-500 text-[10px] font-black text-white">
                AI
              </span>
              <div className="min-w-0 flex-1 rounded-2xl rounded-bl-sm border border-slate-100 bg-slate-50 px-3 py-2.5">
                <p className="text-[11px] font-medium leading-relaxed text-slate-700">
                  {chars.slice(0, AI_PARTS[0].length)}
                  <AnimatePresence>
                    {chars.length > AI_PARTS[0].length ? (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="font-extrabold text-[#FF5722]"
                      >
                        {chars.slice(
                          AI_PARTS[0].length,
                          AI_PARTS[0].length + AI_PARTS[1].length,
                        )}
                      </motion.span>
                    ) : null}
                  </AnimatePresence>
                  {chars.slice(AI_PARTS[0].length + AI_PARTS[1].length)}
                  {phase === "typing" ? (
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="ml-0.5 inline-block h-3 w-0.5 bg-slate-400 align-middle"
                      aria-hidden
                    />
                  ) : null}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Cited badge */}
        <AnimatePresence>
          {phase === "done" ? (
            <motion.div
              initial={reduce ? undefined : { opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="rounded-2xl border border-[#FF5722]/30 bg-[#FF5722]/5 px-4 py-2 text-center shadow-md"
              style={{ transform: "translateZ(50px)" }}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#FF5722]">
                Jij staat in het antwoord
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
