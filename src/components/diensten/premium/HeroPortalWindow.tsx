"use client";

import {
  ArrowLeftRight,
  Calendar,
  LayoutDashboard,
  Mail,
  ShoppingBag,
  Smartphone,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import { useHeroTilt } from "@/components/diensten/premium/useHeroTilt";

const EASE = [0.22, 1, 0.36, 1] as const;

const ROLES = ["Klant", "Team", "Admin"] as const;

const INTEGRATIONS = [
  { label: "Shopify", icon: ShoppingBag, color: "#96bf48" },
  { label: "CRM", icon: User, color: "#6366f1" },
  { label: "Agenda", icon: Calendar, color: "#8b5cf6" },
  { label: "E-mail", icon: Mail, color: "#FF5722" },
] as const;

const STACK_CHIPS = ["Next.js", "Auth", "API", "Live sync"] as const;

/**
 * Dual-product artboard: portaal als basis, app als laag erop.
 * Eén frame, geen hub-spoke of klantbadges.
 */
export function HeroPortalWindow() {
  const { reduce, rotateX, rotateY, onMove, onLeave } = useHeroTilt(0.65);

  return (
    <div
      className="relative mx-auto h-[420px] w-full max-w-[440px] [perspective:1500px]"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div
        className="pointer-events-none absolute inset-4 rounded-[1.5rem] bg-violet-400/10 blur-3xl"
        aria-hidden
      />

      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative h-full"
      >
        <motion.div
          initial={reduce ? undefined : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-slate-200 bg-[#FAFAF9] shadow-[0_32px_64px_-24px_rgba(15,23,42,0.22)]"
          style={{ transform: "translateZ(24px)" }}
        >
          {/* Toolbar */}
          <div className="flex items-center justify-between border-b border-slate-200/80 bg-white px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-violet-500" aria-hidden />
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Custom product
              </span>
            </div>
            <span className="rounded-md bg-violet-500/10 px-2 py-0.5 text-[9px] font-bold text-violet-700">
              Portaal · App
            </span>
          </div>

          {/* Hoofdlaag: portaal + app */}
          <div className="relative flex-1 p-4">
            {/* Portaal (breed scherm) */}
            <motion.div
              initial={reduce ? undefined : { opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, ease: EASE }}
              className="flex h-full flex-col rounded-xl border border-violet-200/80 bg-gradient-to-br from-violet-50/80 to-white p-3 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <LayoutDashboard className="size-3.5 text-violet-600" aria-hidden />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-violet-700">
                    Portaal
                  </span>
                </div>
                <div className="flex gap-1">
                  {ROLES.map((role, i) => (
                    <span
                      key={role}
                      className={`rounded-full px-2 py-0.5 text-[8px] font-bold ${
                        i === 0
                          ? "bg-violet-600 text-white"
                          : "bg-white text-slate-500 ring-1 ring-slate-200"
                      }`}
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-3 space-y-1.5">
                {[0, 1, 2].map((row) => (
                  <div
                    key={row}
                    className="flex items-center gap-2 rounded-lg border border-slate-100 bg-white/80 px-2.5 py-2"
                  >
                    <span
                      className="size-2 shrink-0 rounded-full bg-emerald-400"
                      aria-hidden
                    />
                    <span
                      className="h-1.5 flex-1 rounded-full bg-slate-200"
                      aria-hidden
                    />
                    <span
                      className="h-1.5 w-8 rounded-full bg-slate-100"
                      aria-hidden
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* App (telefoonlaag) */}
            <motion.div
              initial={reduce ? undefined : { opacity: 0, x: 12, y: 12 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25, ease: EASE }}
              className="absolute bottom-3 right-3 w-[42%] overflow-hidden rounded-[1.1rem] border-[3px] border-slate-800 bg-slate-900 p-2 shadow-[0_20px_40px_-12px_rgba(15,23,42,0.55)]"
              style={{ transform: "translateZ(18px)" }}
            >
              <div className="mb-2 flex items-center justify-center">
                <span className="h-1 w-8 rounded-full bg-slate-700" aria-hidden />
              </div>
              <div className="flex items-center gap-1.5 px-0.5">
                <Smartphone className="size-3 text-[#FF5722]" aria-hidden />
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-white">
                  App
                </span>
              </div>
              <div className="mt-2 space-y-1.5">
                {[0, 1].map((slot) => (
                  <div
                    key={slot}
                    className="flex items-center gap-2 rounded-lg bg-slate-800 px-2 py-1.5"
                  >
                    <Calendar className="size-3 shrink-0 text-violet-400" aria-hidden />
                    <span
                      className="h-1.5 flex-1 rounded-full bg-slate-600"
                      aria-hidden
                    />
                    <span className="size-3 rounded-md bg-[#FF5722]/80" aria-hidden />
                  </div>
                ))}
              </div>
              <span
                className="mt-2 block h-6 rounded-lg bg-[#FF5722] text-center text-[8px] font-bold leading-6 text-white"
                aria-hidden
              >
                Boek · Bestel
              </span>
            </motion.div>

            {/* Sync-puls tussen portaal en app */}
            <motion.div
              initial={reduce ? undefined : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, ease: EASE }}
              className="absolute bottom-[38%] left-1/2 flex items-center gap-1.5 rounded-full border border-[#FF5722]/25 bg-white px-2.5 py-1 shadow-md"
              style={{ transform: "translateZ(28px) translateX(-50%)" }}
            >
              <ArrowLeftRight className="size-3 text-[#FF5722]" aria-hidden />
              <span className="text-[9px] font-bold text-slate-700">Live sync</span>
              {!reduce ? (
                <motion.span
                  animate={{ scale: [1, 1.35, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  className="size-1.5 rounded-full bg-emerald-400"
                  aria-hidden
                />
              ) : (
                <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden />
              )}
            </motion.div>
          </div>

          {/* Koppelingen: één rij, uitgelijnd */}
          <div className="border-t border-slate-200/80 bg-white px-4 py-2.5">
            <div className="flex items-center justify-between gap-1">
              {INTEGRATIONS.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    initial={reduce ? undefined : { opacity: 0, y: 4 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.45 + i * 0.05, ease: EASE }}
                    className="flex flex-1 flex-col items-center gap-0.5"
                  >
                    <span
                      className="flex size-7 items-center justify-center rounded-lg border border-slate-100 bg-slate-50"
                      style={{ color: item.color }}
                    >
                      <Icon className="size-3.5" aria-hidden />
                    </span>
                    <span className="text-[8px] font-semibold text-slate-500">
                      {item.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Stack footer */}
          <div className="border-t border-slate-200/80 bg-slate-50/80 px-4 py-2.5">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {STACK_CHIPS.map((chip, i) => (
                <motion.span
                  key={chip}
                  initial={reduce ? undefined : { opacity: 0, y: 4 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.55 + i * 0.04, ease: EASE }}
                  className="rounded-full border border-violet-200 bg-white px-3 py-1 text-[10px] font-semibold text-violet-700"
                >
                  {chip}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
