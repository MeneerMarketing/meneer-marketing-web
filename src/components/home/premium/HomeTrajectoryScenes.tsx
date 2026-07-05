"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, ChevronRight, Rocket } from "lucide-react";
import { useCallback, useState } from "react";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { TrajectoryBrowserFrame } from "@/components/home/premium/TrajectoryBrowserFrame";
import type { HomeTrajectoryStage } from "@/data/home-premium";

interface HomeTrajectoryScenesProps {
  stage: HomeTrajectoryStage;
  /** Browser-tag rechtsboven, bijv. Snappen of Bouwen */
  tag?: string;
}

export function HomeTrajectoryScenes({ stage, tag }: HomeTrajectoryScenesProps) {
  const reduce = useReducedMotion();
  const label = tag ?? stage.short;

  return (
    <TrajectoryBrowserFrame tag={label}>
      <AnimatePresence mode="wait">
        <motion.div
          key={stage.id}
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="flex min-h-[260px] flex-1 flex-col justify-center p-5 sm:p-6"
        >
          {stage.scene === "discover" && <DiscoverChat reduce={!!reduce} />}
          {stage.scene === "route" && <RoutePicker reduce={!!reduce} />}
          {stage.scene === "build" && <BuildDeploy reduce={!!reduce} />}
          {stage.scene === "scale" && <ScaleDial reduce={!!reduce} />}
        </motion.div>
      </AnimatePresence>
    </TrajectoryBrowserFrame>
  );
}

/* ------------------------------------------------------------------ */
/* Snappen: klik door het intake-gesprek                              */
/* ------------------------------------------------------------------ */

const CHAT = [
  { from: "meneer", text: "Waar wil je over een jaar staan?" },
  { from: "jij", text: "Meer omzet online, zonder losse eindjes." },
  { from: "meneer", text: "Welke kanalen draaien nu al?" },
  { from: "jij", text: "Site staat. Ads lukken matig. SEO? Geen idee." },
  { from: "meneer", text: "Dan weten we waar we beginnen." },
] as const;

function DiscoverChat({ reduce }: { reduce: boolean }) {
  const [step, setStep] = useState(0);
  const visible = CHAT.slice(0, step + 1);
  const done = step >= CHAT.length - 1;

  const next = useCallback(() => {
    setStep((s) => Math.min(s + 1, CHAT.length - 1));
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
        Intake · klik door
      </p>

      <div className="max-h-[200px] space-y-2.5 overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {visible.map((msg, i) => (
            <motion.div
              key={i}
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

      <button
        type="button"
        onClick={next}
        disabled={done}
        className={`inline-flex items-center justify-center gap-1.5 self-start rounded-full px-4 py-2 text-xs font-bold transition ${
          done
            ? "cursor-default bg-emerald-50 text-emerald-600"
            : "bg-[#FF5722] text-white hover:bg-orange-600"
        }`}
      >
        {done ? (
          <>
            <Check className="size-3.5" aria-hidden />
            Helder. Plan volgt.
          </>
        ) : (
          <>
            Volgende vraag
            <ChevronRight className="size-3.5" aria-hidden />
          </>
        )}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Volgorde: tik kanalen in jouw volgorde                               */
/* ------------------------------------------------------------------ */

const CHANNELS = [
  { id: "seo", label: "SEO", sub: "Organisch" },
  { id: "ads", label: "Google Ads", sub: "Direct traffic" },
  { id: "shop", label: "Shopify", sub: "Conversie" },
] as const;

function RoutePicker({ reduce }: { reduce: boolean }) {
  const [order, setOrder] = useState<string[]>([]);

  function pick(id: string) {
    setOrder((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  }

  const rank = (id: string) => order.indexOf(id) + 1;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
        Jouw volgorde · tik aan
      </p>
      <div className="grid gap-2 sm:grid-cols-3">
        {CHANNELS.map((ch, i) => {
          const r = rank(ch.id);
          const picked = r > 0;
          return (
            <motion.button
              key={ch.id}
              type="button"
              onClick={() => pick(ch.id)}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              whileTap={reduce ? undefined : { scale: 0.97 }}
              className={`relative rounded-xl border px-3 py-3 text-left transition ${
                picked
                  ? "border-[#FF5722] bg-[#FF5722]/[0.06] shadow-[0_8px_24px_-16px_rgba(255,87,34,0.5)]"
                  : "border-slate-200 bg-slate-50/80 hover:border-slate-300 hover:bg-white"
              }`}
            >
              {picked ? (
                <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-[#FF5722] text-[10px] font-black text-white">
                  {r}
                </span>
              ) : null}
              <p className="text-xs font-extrabold text-slate-900">{ch.label}</p>
              <p className="mt-0.5 text-[10px] font-medium text-slate-500">{ch.sub}</p>
            </motion.button>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={order.join("-") || "empty"}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[11px] font-bold text-slate-600"
        >
          {order.length === 0
            ? "Tik wat eerst moet. Max drie."
            : order.length < 3
              ? `Nog ${3 - order.length} te kiezen.`
              : `Volgorde: ${order.map((id) => CHANNELS.find((c) => c.id === id)?.label).join(" → ")}`}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Live zetten: deploy-knop en buildmeter                               */
/* ------------------------------------------------------------------ */

function BuildDeploy({ reduce }: { reduce: boolean }) {
  const [deployed, setDeployed] = useState(false);
  const [progress, setProgress] = useState(0);

  function deploy() {
    if (deployed) return;
    setProgress(0);
    let p = 0;
    const tick = setInterval(() => {
      p += 8 + Math.random() * 12;
      if (p >= 100) {
        p = 100;
        clearInterval(tick);
        setDeployed(true);
      }
      setProgress(Math.round(p));
    }, reduce ? 0 : 120);
    if (reduce) {
      clearInterval(tick);
      setProgress(100);
      setDeployed(true);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
        Build · tik deploy
      </p>

      <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-md bg-slate-900" aria-hidden />
          <span className="h-2 w-16 rounded-full bg-slate-200" aria-hidden />
          <span className="ml-auto font-mono text-[9px] text-slate-400">jouw-site.nl</span>
        </div>
        <span className="mt-3 block h-2.5 w-3/4 rounded-full bg-slate-900" aria-hidden />
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`h-10 rounded-lg ${deployed ? "bg-gradient-to-br from-sky-100 to-slate-100" : "border-2 border-dashed border-slate-300 bg-white"}`}
              aria-hidden
            />
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between font-mono text-[9px] text-slate-400">
          <span>{deployed ? "live" : "build"}</span>
          <span className={deployed ? "text-emerald-500" : "text-[#FF5722]"}>
            {deployed ? "100%" : `${progress}%`}
          </span>
        </div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <motion.span
            className="block h-full rounded-full bg-gradient-to-r from-orange-300 to-[#FF5722]"
            animate={{ width: `${deployed ? 100 : progress}%` }}
            transition={{ duration: reduce ? 0 : 0.2 }}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={deploy}
        disabled={deployed}
        className={`inline-flex items-center justify-center gap-1.5 self-start rounded-full px-4 py-2 text-xs font-bold transition ${
          deployed
            ? "cursor-default bg-emerald-50 text-emerald-600"
            : "bg-slate-900 text-white hover:bg-[#FF5722]"
        }`}
      >
        {deployed ? (
          <>
            <Check className="size-3.5" aria-hidden />
            Live. Tracking aan.
          </>
        ) : (
          <>
            <Rocket className="size-3.5" aria-hidden />
            Deploy
          </>
        )}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Gas geven: schuif budget naar wat werkt                              */
/* ------------------------------------------------------------------ */

const BUDGET = [
  { id: "win", label: "SEO", pct: 45, tone: "bg-emerald-400" },
  { id: "test", label: "Meta Ads", pct: 30, tone: "bg-sky-400" },
  { id: "cut", label: "Display", pct: 25, tone: "bg-slate-300" },
] as const;

function ScaleDial({ reduce }: { reduce: boolean }) {
  const [boosted, setBoosted] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
        Budget · tik om te schalen
      </p>

      <div className="space-y-2">
        {BUDGET.map((row, i) => {
          const width = boosted && row.id === "win" ? 62 : boosted && row.id === "cut" ? 8 : row.pct;
          return (
            <div key={row.id}>
              <div className="mb-1 flex justify-between text-[10px] font-bold text-slate-600">
                <span>{row.label}</span>
                <span className={boosted && row.id === "win" ? "text-emerald-500" : ""}>
                  {width}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <motion.span
                  className={`block h-full rounded-full ${row.tone}`}
                  animate={{ width: `${width}%` }}
                  transition={
                    reduce ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 18, delay: i * 0.04 }
                  }
                />
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => setBoosted(true)}
        disabled={boosted}
        className={`inline-flex items-center justify-center gap-1.5 self-start rounded-full px-4 py-2 text-xs font-bold transition ${
          boosted
            ? "cursor-default bg-emerald-50 text-emerald-600"
            : "border border-slate-300 bg-white text-slate-900 hover:border-[#FF5722] hover:text-[#FF5722]"
        }`}
      >
        {boosted ? (
          <>
            <Check className="size-3.5" aria-hidden />
            Budget verschoven naar winnaar
          </>
        ) : (
          <>
            Meer budget naar SEO
            <ArrowUpRight className="size-3.5" aria-hidden />
          </>
        )}
      </button>
    </div>
  );
}
