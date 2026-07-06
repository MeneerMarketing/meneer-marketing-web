"use client";

import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { CartoonMagnifierMark } from "@/components/icons/CartoonMagnifierMark";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import type { MobileBillboard } from "@/data/home-mobile-editorial";

const EASE = [0.22, 1, 0.36, 1] as const;

interface HomeMobileBillboardProps {
  data: MobileBillboard;
}

/** Full-bleed typografisch statement, links uitgelijnd met Meneer-stamp. */
export function HomeMobileBillboard({ data }: HomeMobileBillboardProps) {
  const reduce = useReducedMotion();
  const isOrange = data.variant === "orange";

  return (
    <section
      aria-label={data.lines.map((l) => l.segments.map((s) => s.text).join("")).join(" ")}
      className={`relative overflow-x-clip py-[clamp(2.75rem,12vw,4rem)] ${
        isOrange ? "bg-[#FF5722]" : "bg-slate-950"
      }`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative mx-auto w-full min-w-0 max-w-6xl px-4">
        <div className="flex flex-col gap-[0.32em]">
          {data.lines.map((line, i) => (
            <motion.p
              key={`${data.id}-line-${i}`}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: EASE }}
              className="hyphens-none text-pretty font-extrabold uppercase leading-none tracking-[-0.035em] text-white"
              style={{ fontSize: "clamp(1.55rem, 7.2vw, 2.25rem)" }}
            >
              {line.segments.map((seg, j) => {
                const accentOnDark = !isOrange && seg.accent;
                const accentOnOrange = isOrange && seg.accent;
                return (
                  <span
                    key={`${i}-${j}`}
                    className={
                      accentOnDark
                        ? "text-[#FF5722]"
                        : accentOnOrange
                          ? "mt-0.5 inline-block rounded-lg bg-white/20 px-2 py-0.5 text-white ring-1 ring-white/25"
                          : undefined
                    }
                  >
                    {seg.text}
                  </span>
                );
              })}
            </motion.p>
          ))}
        </div>

        {/* Meneer-stamp i.p.v. losse streep */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.28, duration: 0.45, ease: EASE }}
          className="mt-5 inline-flex max-w-full items-center gap-2 rounded-xl border px-2.5 py-2 shadow-sm backdrop-blur-sm"
          style={{
            borderColor: isOrange ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.12)",
            backgroundColor: isOrange ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.06)",
          }}
        >
          {data.stampIcon === "magnifier" ? (
            <motion.span
              animate={
                reduce
                  ? undefined
                  : {
                      x: [0, 2.5, -1.5, 0],
                      y: [0, -1.5, 1, 0],
                      rotate: [0, -10, 8, 0],
                    }
              }
              transition={{
                duration: 2.4,
                repeat: Infinity,
                repeatDelay: 1.2,
                ease: "easeInOut",
              }}
              className="shrink-0 text-[#FF5722]"
            >
              <CartoonMagnifierMark className="size-5" />
            </motion.span>
          ) : (
            <InteractiveLogo className="size-7 shrink-0" interactive={false} />
          )}
          <span
            className={`min-w-0 text-[10px] font-extrabold uppercase leading-tight tracking-[0.12em] ${
              isOrange ? "text-white" : "text-white/90"
            }`}
          >
            {data.stamp}
          </span>
          <span
            className={`flex size-6 shrink-0 items-center justify-center rounded-full ${
              isOrange ? "bg-white text-[#FF5722]" : "bg-[#FF5722] text-white"
            }`}
            aria-hidden
          >
            <ArrowUpRight className="size-3.5" strokeWidth={2.5} />
          </span>
        </motion.div>
      </div>
    </section>
  );
}
