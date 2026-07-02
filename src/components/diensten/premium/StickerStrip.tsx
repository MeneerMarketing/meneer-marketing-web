"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Sticker-strip: labels die als stickers licht gedraaid geplakt zijn en
 * één voor één op hun plek springen. Hover zet ze recht.
 */
export function StickerStrip({ items }: { items: string[] }) {
  const reduce = useReducedMotion();
  const rotations = [-2.5, 2, -1.5, 2.5, -2, 1.5, -3];

  return (
    <div className="border-b border-slate-200 bg-slate-50/70">
      <ul className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-3 px-4 py-7 sm:px-6 lg:px-8">
        {items.map((item, index) => {
          const rotate = rotations[index % rotations.length];
          return (
            <motion.li
              key={item}
              initial={
                reduce ? false : { opacity: 0, y: 18, rotate: rotate * 3, scale: 0.8 }
              }
              whileInView={{ opacity: 1, y: 0, rotate, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 17,
                delay: 0.07 * index,
              }}
              whileHover={
                reduce ? undefined : { rotate: 0, scale: 1.07, y: -2 }
              }
              className="cursor-default select-none rounded-full border border-slate-900/90 bg-white px-4 py-2 text-sm font-bold tracking-tight text-slate-900 shadow-[2px_3px_0_rgba(15,23,42,0.9)] transition-colors hover:border-[#FF5722] hover:text-[#FF5722] hover:shadow-[2px_3px_0_rgba(255,87,34,0.9)]"
            >
              {item}
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
