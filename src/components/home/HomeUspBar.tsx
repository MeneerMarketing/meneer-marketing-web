"use client";

import { motion, useReducedMotion } from "framer-motion";
import { HOME_USP_STICKERS } from "@/data/home-usps";

const STICKER_ROTATIONS = [-2.5, 2, -1.5, 2.5, -2, 1.5, -3];

/**
 * Tagline links, stickers rechts op één regel.
 * Wrap uit (dat veroorzaakte de stapel). Op smalle schermen horizontaal swipen.
 */
export function HomeUspBar() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-label="Specialismes"
      className="relative overflow-x-clip border-b border-slate-200/80 bg-slate-50/90"
    >
      <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-3 px-4 py-5 sm:flex-row sm:items-center sm:gap-5 sm:py-7 sm:px-6 lg:px-8">
        <p className="shrink-0 text-left text-xs font-bold tracking-tight text-slate-600 sm:text-sm">
          <span className="text-[#FF5722]">Vijf specialismen.</span> Eén aanspreekpunt.
        </p>

        {/* py-3 = ruimte voor rotatie/schaduw; horizontale scroll alleen als het echt niet past */}
        <div className="min-w-0 w-full overflow-x-auto overscroll-x-contain py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-1">
          <ul className="flex w-max max-w-full flex-nowrap items-center justify-start gap-1.5 sm:ml-auto sm:justify-end sm:gap-2">
            {HOME_USP_STICKERS.map((item, index) => {
              const rotate = STICKER_ROTATIONS[index % STICKER_ROTATIONS.length];
              return (
                <motion.li
                  key={item}
                  initial={
                    reduce ? false : { opacity: 0, y: 14, rotate: rotate * 2.5, scale: 0.85 }
                  }
                  whileInView={{ opacity: 1, y: 0, rotate, scale: 1 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{
                    type: "spring",
                    stiffness: 280,
                    damping: 18,
                    delay: 0.05 * index,
                  }}
                  whileHover={reduce ? undefined : { rotate: 0, scale: 1.06, y: -2 }}
                  className="shrink-0 cursor-default select-none whitespace-nowrap rounded-full border border-slate-900/90 bg-white px-2.5 py-1.5 text-[11px] font-bold tracking-tight text-slate-900 shadow-[2px_3px_0_rgba(15,23,42,0.88)] transition-colors hover:border-[#FF5722] hover:text-[#FF5722] hover:shadow-[2px_3px_0_rgba(255,87,34,0.88)] sm:px-3 sm:py-1.5 sm:text-xs lg:px-3.5 lg:py-2 lg:text-sm"
                >
                  {item}
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
