"use client";

import { motion } from "framer-motion";
import { Calendar, Mail, ShoppingBag, User } from "lucide-react";
import { useHeroTilt } from "@/components/diensten/premium/useHeroTilt";

const EASE = [0.22, 1, 0.36, 1] as const;

const NODES = [
  { id: "shopify", label: "Shopify", icon: ShoppingBag, angle: -70, color: "#96bf48" },
  { id: "crm", label: "CRM", icon: User, angle: 10, color: "#6366f1" },
  { id: "mail", label: "E-mail", icon: Mail, angle: 110, color: "#FF5722" },
  { id: "agenda", label: "Agenda", icon: Calendar, angle: 200, color: "#8b5cf6" },
] as const;

/**
 * Hub-and-spoke netwerk: portaal in het midden, koppelingen als pulserende lijnen.
 */
export function HeroPortalWindow() {
  const { reduce, rotateX, rotateY, onMove, onLeave } = useHeroTilt(0.75);

  return (
    <div
      className="relative mx-auto h-[400px] w-full max-w-[440px] [perspective:1400px]"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-violet-400/10 blur-3xl"
        aria-hidden
      />

      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative flex h-full items-center justify-center"
      >
        <svg
          className="absolute size-72 overflow-visible"
          viewBox="0 0 200 200"
          aria-hidden
        >
          {NODES.map((node) => {
            const rad = (node.angle * Math.PI) / 180;
            const x2 = 100 + Math.cos(rad) * 78;
            const y2 = 100 + Math.sin(rad) * 78;
            return (
              <motion.line
                key={node.id}
                x1="100"
                y1="100"
                x2={x2}
                y2={y2}
                stroke={node.color}
                strokeWidth="2"
                strokeOpacity="0.35"
                strokeDasharray="4 4"
                initial={reduce ? undefined : { pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.8, ease: EASE }}
              />
            );
          })}
        </svg>

        {/* Centraal portaal */}
        <motion.div
          initial={reduce ? undefined : { scale: 0.85, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: EASE }}
          className="relative z-10 flex size-24 flex-col items-center justify-center rounded-3xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-white shadow-xl"
          style={{ transform: "translateZ(45px)" }}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600">
            Portaal
          </span>
          <div className="mt-2 flex gap-1">
            {["S", "A", "K"].map((r) => (
              <span
                key={r}
                className="flex size-5 items-center justify-center rounded-md bg-violet-600 text-[8px] font-bold text-white"
              >
                {r}
              </span>
            ))}
          </div>
          <p className="mt-1.5 text-[8px] font-semibold text-slate-500">Salon · Admin · Klant</p>
        </motion.div>

        {/* Satelliet-nodes */}
        {NODES.map((node, i) => {
          const rad = (node.angle * Math.PI) / 180;
          const x = Math.cos(rad) * 118;
          const y = Math.sin(rad) * 118;
          const Icon = node.icon;

          return (
            <motion.div
              key={node.id}
              initial={reduce ? undefined : { opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.12 + i * 0.1, ease: EASE }}
              style={{ x, y, transform: "translateZ(35px)" }}
              className="absolute flex flex-col items-center gap-1"
            >
              <span
                className="flex size-11 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-md"
                style={{ color: node.color }}
              >
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="rounded-full bg-white px-2 py-0.5 text-[9px] font-bold text-slate-600 shadow-sm">
                {node.label}
              </span>
            </motion.div>
          );
        })}

        <motion.div
          animate={reduce ? undefined : { scale: [1, 1.08, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute size-32 rounded-full border border-violet-300/40"
          aria-hidden
        />

        <motion.span
          {...(reduce ? {} : { animate: { y: [-4, 4] }, transition: { duration: 2.6, repeat: Infinity, repeatType: "mirror" as const } })}
          className="absolute -left-2 top-8 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-bold text-slate-800 shadow-lg"
        >
          SkinComplete B2B
        </motion.span>
        <motion.span
          {...(reduce ? {} : { animate: { y: [4, -4] }, transition: { duration: 3, repeat: Infinity, repeatType: "mirror" as const } })}
          className="absolute -right-1 bottom-16 rounded-xl border border-violet-200 bg-violet-50 px-3 py-1.5 text-[10px] font-bold text-violet-800 shadow-lg"
        >
          Hills · boeken
        </motion.span>
      </motion.div>
    </div>
  );
}
