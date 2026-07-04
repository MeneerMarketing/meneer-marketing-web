"use client";

import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useHeroTilt } from "@/components/diensten/premium/useHeroTilt";

const EASE = [0.22, 1, 0.36, 1] as const;

const ORBIT_PRODUCTS = [
  { angle: -30, price: "€149", tag: null, delay: 0.15 },
  { angle: 35, price: "€89", tag: "Bundle", delay: 0.28 },
  { angle: 145, price: "€249", tag: null, delay: 0.4 },
  { angle: 210, price: "€59", tag: "Nieuw", delay: 0.52 },
] as const;

/**
 * Productkaarten in een orbit rond het Shopify-icoon. Geen storefront-venster.
 */
export function HeroShopifyWindow() {
  const { reduce, rotateX, rotateY, onMove, onLeave } = useHeroTilt(0.85);

  return (
    <div
      className="relative mx-auto h-[400px] w-full max-w-[440px] [perspective:1400px]"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-full bg-[#96bf48]/12 blur-3xl"
        aria-hidden
      />

      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative flex h-full items-center justify-center"
      >
        {/* Orbit ring */}
        <motion.span
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
          className="absolute size-56 rounded-full border border-dashed border-[#96bf48]/30"
          aria-hidden
        />
        <motion.span
          animate={reduce ? undefined : { rotate: -360 }}
          transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
          className="absolute size-72 rounded-full border border-slate-200/60"
          aria-hidden
        />

        {/* Centrum */}
        <motion.div
          initial={reduce ? undefined : { scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative z-10 flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-[#96bf48] to-[#5a7a2e] shadow-[0_20px_40px_-12px_rgba(90,122,46,0.5)]"
          style={{ transform: "translateZ(50px)" }}
        >
          <ShoppingBag className="size-9 text-white" aria-hidden />
          <span className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-[#FF5722] text-[10px] font-bold text-white">
            3
          </span>
        </motion.div>

        {/* Productkaarten op orbit */}
        {ORBIT_PRODUCTS.map((product) => {
          const rad = (product.angle * Math.PI) / 180;
          const x = Math.cos(rad) * 118;
          const y = Math.sin(rad) * 118;

          return (
            <motion.div
              key={product.angle}
              initial={reduce ? undefined : { opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: product.delay, duration: 0.5, ease: EASE }}
              animate={
                reduce
                  ? undefined
                  : { y: [0, product.angle % 2 === 0 ? -6 : 6, 0] }
              }
              style={{
                x,
                y,
                rotate: product.angle * 0.12,
                transform: "translateZ(35px)",
              }}
              className="absolute w-24 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg"
            >
              <span className="block aspect-square rounded-xl bg-gradient-to-br from-slate-100 to-slate-50" aria-hidden />
              <span className="mt-1.5 block h-1.5 w-3/4 rounded-full bg-slate-200" aria-hidden />
              <p className="mt-1 text-[10px] font-extrabold text-slate-900">{product.price}</p>
              {product.tag ? (
                <span className="mt-0.5 inline-block rounded-full bg-[#96bf48]/20 px-1.5 py-0.5 text-[7px] font-bold text-[#5a7a2e]">
                  {product.tag}
                </span>
              ) : null}
            </motion.div>
          );
        })}

        <motion.div
          animate={reduce ? undefined : { y: [-5, 5] }}
          transition={{ duration: 2.5, repeat: Infinity, repeatType: "mirror" }}
          className="absolute right-0 top-4 rounded-2xl border border-emerald-200 bg-white px-3 py-2 shadow-lg"
          style={{ transform: "translateZ(45px)" }}
        >
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Theme</p>
          <p className="text-sm font-extrabold text-[#5a7a2e]">From scratch</p>
        </motion.div>

        <motion.div
          animate={reduce ? undefined : { y: [4, -4] }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "mirror" }}
          className="absolute bottom-6 left-0 rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2 shadow-xl"
          style={{ transform: "translateZ(40px) rotate(3deg)" }}
        >
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">SKU&apos;s</p>
          <p className="text-sm font-extrabold text-white">2.400+</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
