"use client";

import { motion } from "framer-motion";
import { Code2, ShoppingBag } from "lucide-react";
import { useHeroTilt } from "@/components/diensten/premium/useHeroTilt";

const EASE = [0.22, 1, 0.36, 1] as const;

const PRODUCTS = [
  { price: "€149", tag: null },
  { price: "€89", tag: "Bundle" },
] as const;

const STACK_CHIPS = ["Liquid", "OS 2.0", "GraphQL", "Checkout"] as const;

/**
 * Eén theme-artboard: grid, geen losse orbit-elementen. Alles in één frame.
 */
export function HeroShopifyWindow() {
  const { reduce, rotateX, rotateY, onMove, onLeave } = useHeroTilt(0.65);

  return (
    <div
      className="relative mx-auto h-[420px] w-full max-w-[440px] [perspective:1500px]"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div
        className="pointer-events-none absolute inset-4 rounded-[1.5rem] bg-[#96bf48]/10 blur-3xl"
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
              <span className="size-2 rounded-full bg-[#96bf48]" aria-hidden />
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Custom theme
              </span>
            </div>
            <span className="rounded-md bg-[#96bf48]/15 px-2 py-0.5 text-[9px] font-bold text-[#5a7a2e]">
              From scratch
            </span>
          </div>

          {/* Hoofdgrid */}
          <div className="grid flex-1 grid-cols-[1fr_1.05fr] gap-3 p-4">
            {/* Links: producten + liquid */}
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-2">
                {PRODUCTS.map((product, i) => (
                  <motion.div
                    key={product.price}
                    initial={reduce ? undefined : { opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.08, ease: EASE }}
                    className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm"
                  >
                    <span
                      className="block aspect-square rounded-lg bg-gradient-to-br from-slate-100 to-slate-50"
                      aria-hidden
                    />
                    <p className="mt-1.5 text-[10px] font-extrabold text-slate-900">
                      {product.price}
                    </p>
                    {product.tag ? (
                      <span className="mt-0.5 inline-block rounded-full bg-[#96bf48]/20 px-1.5 py-0.5 text-[7px] font-bold text-[#5a7a2e]">
                        {product.tag}
                      </span>
                    ) : null}
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={reduce ? undefined : { opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25, ease: EASE }}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-900 p-3"
              >
                <div className="flex items-center gap-1.5">
                  <Code2 className="size-3 text-slate-500" aria-hidden />
                  <span className="font-mono text-[9px] text-slate-500">
                    sections/pdp.liquid
                  </span>
                </div>
                <p className="mt-2 font-mono text-[10px] leading-relaxed text-emerald-400">
                  {"{% section 'product' %}"}
                </p>
                <p className="font-mono text-[10px] leading-relaxed text-sky-400">
                  {"{% render 'variants' %}"}
                </p>
              </motion.div>
            </div>

            {/* Rechts: storefront kern */}
            <div className="flex flex-col gap-3">
              <motion.div
                initial={reduce ? undefined : { opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15, ease: EASE }}
                className="flex flex-1 flex-col items-center justify-center rounded-xl border border-[#96bf48]/25 bg-gradient-to-br from-[#96bf48]/10 to-white p-4"
              >
                <div className="relative flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-[#96bf48] to-[#5a7a2e] shadow-[0_16px_32px_-12px_rgba(90,122,46,0.45)]">
                  <ShoppingBag className="size-7 text-white" aria-hidden />
                  <span className="absolute -bottom-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-[#FF5722] text-[9px] font-bold text-white">
                    3
                  </span>
                </div>
                <p className="mt-3 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Storefront
                </p>
              </motion.div>

              <div className="grid grid-cols-2 gap-2">
                <motion.div
                  initial={reduce ? undefined : { opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, ease: EASE }}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-center shadow-sm"
                >
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    SKU&apos;s
                  </p>
                  <p className="mt-0.5 text-sm font-extrabold text-slate-900">2.400+</p>
                </motion.div>
                <motion.div
                  initial={reduce ? undefined : { opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.38, ease: EASE }}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-center shadow-sm"
                >
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    CWV
                  </p>
                  <p className="mt-0.5 text-sm font-extrabold text-emerald-600">Groen</p>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Footer: stack chips, één lijn */}
          <div className="border-t border-slate-200/80 bg-white px-4 py-3">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {STACK_CHIPS.map((chip, i) => (
                <motion.span
                  key={chip}
                  initial={reduce ? undefined : { opacity: 0, y: 4 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.45 + i * 0.05, ease: EASE }}
                  className="rounded-full border border-[#96bf48]/25 bg-[#96bf48]/[0.06] px-3 py-1 text-[10px] font-semibold text-[#5a7a2e]"
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
