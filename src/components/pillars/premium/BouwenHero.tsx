"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useState } from "react";
import type { MouseEvent as ReactMouseEvent, ReactNode } from "react";

/** De vier lagen van een build, van fundament tot live. */
const LAYERS = [
  { id: "fundament", label: "Fundament", dot: "#0F172A" },
  { id: "structuur", label: "Structuur", dot: "#94A3B8" },
  { id: "design", label: "Design", dot: "#38BDF8" },
  { id: "live", label: "Live", dot: "#FF5722" },
] as const;

type LayerId = (typeof LAYERS)[number]["id"];

const LAYER_GAP = 40;

function FundamentFace() {
  return (
    <div className="size-full rounded-2xl border-2 border-dashed border-slate-400/70 bg-[linear-gradient(to_right,rgba(51,65,85,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(51,65,85,0.12)_1px,transparent_1px)] bg-[size:22px_22px]">
      <span className="absolute left-2 top-2 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
        v1.0
      </span>
      <span className="absolute bottom-2 right-2 font-mono text-[9px] text-slate-400">
        {"<html>"}
      </span>
    </div>
  );
}

function StructuurFace() {
  return (
    <div className="size-full rounded-2xl border border-slate-300 bg-white/85 p-3">
      <div className="flex gap-2">
        <span className="h-2.5 w-10 rounded-full bg-slate-300" aria-hidden />
        <span className="ml-auto h-2.5 w-7 rounded-full bg-slate-200" aria-hidden />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <span className="col-span-2 h-9 rounded-lg border-2 border-dashed border-slate-300" aria-hidden />
        <span className="h-9 rounded-lg border-2 border-dashed border-slate-300" aria-hidden />
        <span className="h-7 rounded-lg border-2 border-dashed border-slate-200" aria-hidden />
        <span className="col-span-2 h-7 rounded-lg border-2 border-dashed border-slate-200" aria-hidden />
      </div>
    </div>
  );
}

function DesignFace() {
  return (
    <div className="size-full rounded-2xl border border-sky-200 bg-white p-3">
      <div className="flex items-center gap-1.5">
        {["#FF5722", "#38BDF8", "#0F172A", "#F1F5F9"].map((c) => (
          <span
            key={c}
            className="size-3.5 rounded-full border border-white shadow-sm"
            style={{ backgroundColor: c }}
            aria-hidden
          />
        ))}
        <span className="ml-auto rounded-md bg-sky-50 px-1.5 py-0.5 font-mono text-[8px] font-bold text-sky-600">
          Aa
        </span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <span className="col-span-2 h-9 rounded-lg bg-gradient-to-br from-sky-100 to-sky-50" aria-hidden />
        <span className="h-9 rounded-lg bg-[#FF5722]/15" aria-hidden />
        <span className="h-7 rounded-lg bg-slate-100" aria-hidden />
        <span className="col-span-2 h-7 rounded-lg bg-slate-100" aria-hidden />
      </div>
    </div>
  );
}

function LiveFace() {
  return (
    <div className="size-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-1.5 border-b border-slate-100 px-3 py-2">
        <span className="size-2 rounded-full bg-[#FF5722]/80" aria-hidden />
        <span className="size-2 rounded-full bg-amber-300" aria-hidden />
        <span className="size-2 rounded-full bg-emerald-400" aria-hidden />
        <span className="ml-2 h-2 flex-1 rounded-full bg-slate-100" aria-hidden />
      </div>
      <div className="p-3">
        <span className="block h-2.5 w-3/4 rounded-full bg-slate-900" aria-hidden />
        <span className="mt-1.5 block h-2 w-1/2 rounded-full bg-slate-300" aria-hidden />
        <span className="mt-2 inline-block h-5 w-16 rounded-full bg-[#FF5722]" aria-hidden />
        <div className="mt-2.5 grid grid-cols-3 gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-8 rounded-md bg-slate-100" aria-hidden />
          ))}
        </div>
      </div>
    </div>
  );
}

const FACES: Record<LayerId, () => ReactNode> = {
  fundament: FundamentFace,
  structuur: StructuurFace,
  design: DesignFace,
  live: LiveFace,
};

/**
 * Hero-illustratie voor het blok Bouwen: vier isometrische lagen (fundament,
 * structuur, design, live) die op elkaar stapelen. De muis kantelt de stack,
 * de chips eronder tillen een laag op. Reduced motion: statische stack.
 */
const BASE_X = 55;
const BASE_Z = -40;

export function BouwenHero() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<LayerId | null>(null);

  const mx = useMotionValue(BASE_X);
  const my = useMotionValue(BASE_Z);
  const tiltX = useSpring(mx, { stiffness: 110, damping: 17 });
  const tiltZ = useSpring(my, { stiffness: 110, damping: 17 });

  function onMove(e: ReactMouseEvent<HTMLDivElement>) {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(BASE_X + py * -8);
    my.set(BASE_Z + px * 10);
  }

  function onLeave() {
    mx.set(BASE_X);
    my.set(BASE_Z);
  }

  return (
    <div
      className="relative mx-auto w-full max-w-[460px] select-none"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div
        className="pointer-events-none absolute -left-8 -top-8 size-44 rounded-full bg-sky-300/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-6 -right-6 size-40 rounded-full bg-[#FF5722]/15 blur-3xl"
        aria-hidden
      />

      {/* De 3D-stack */}
      <div className="relative h-[340px] [perspective:1300px]">
        <motion.div
          style={{
            rotateX: reduce ? BASE_X : tiltX,
            rotateZ: reduce ? BASE_Z : tiltZ,
            transformStyle: "preserve-3d",
          }}
          className="absolute left-1/2 top-[58%] h-[220px] w-[290px] -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d]"
        >
          {LAYERS.map((layer, i) => {
            const Face = FACES[layer.id];
            const lifted = active === layer.id;
            return (
              <motion.div
                key={layer.id}
                initial={
                  reduce ? false : { opacity: 0, z: i * LAYER_GAP + 130 }
                }
                animate={{
                  opacity: 1,
                  z: lifted ? i * LAYER_GAP + 26 : i * LAYER_GAP,
                }}
                transition={{
                  type: "spring",
                  stiffness: 190,
                  damping: 20,
                }}
                className={`absolute inset-0 rounded-2xl transition-shadow duration-300 ${
                  lifted
                    ? "shadow-[0_30px_50px_-20px_rgba(255,87,34,0.4)] ring-2 ring-[#FF5722]/60"
                    : "shadow-[0_22px_44px_-26px_rgba(15,23,42,0.4)]"
                }`}
                style={{ transformStyle: "preserve-3d" }}
              >
                <Face />
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Laag-selector */}
      <div className="relative -mt-2 flex flex-wrap items-center justify-center gap-2">
        {LAYERS.map((layer) => (
          <button
            key={layer.id}
            type="button"
            onMouseEnter={() => setActive(layer.id)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(layer.id)}
            onBlur={() => setActive(null)}
            onClick={() =>
              setActive((prev) => (prev === layer.id ? null : layer.id))
            }
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${
              active === layer.id
                ? "border-[#FF5722]/50 bg-[#FF5722]/5 text-[#FF5722]"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            }`}
          >
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: layer.dot }}
              aria-hidden
            />
            {layer.label}
          </button>
        ))}
      </div>

      {/* Zwevende resultaat-badges */}
      <motion.div
        animate={reduce ? undefined : { y: [-5, 5] }}
        transition={
          reduce
            ? undefined
            : { duration: 2.7, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
        }
        className="absolute right-0 top-8 rounded-xl border border-emerald-200 bg-white px-3 py-2 shadow-lg"
      >
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Laadtijd
        </p>
        <p className="text-sm font-extrabold text-emerald-500">0,8 sec</p>
      </motion.div>

      <motion.div
        animate={reduce ? undefined : { y: [6, -6] }}
        transition={
          reduce
            ? undefined
            : { duration: 3.2, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
        }
        className="absolute left-0 top-24 rounded-xl border border-slate-200 bg-slate-900 px-3 py-2 shadow-lg"
      >
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Templates
        </p>
        <p className="text-sm font-extrabold text-white">Nul</p>
      </motion.div>
    </div>
  );
}
