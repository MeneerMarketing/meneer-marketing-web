"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { MouseEvent as ReactMouseEvent } from "react";
import { megaMenuIconForHref } from "@/lib/mega-menu-icons";

export interface PillarServiceItem {
  name: string;
  description: string;
  href: string;
}

function ServiceCard({
  item,
  index,
}: {
  item: PillarServiceItem;
  index: number;
}) {
  const reduce = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 200, damping: 18 });
  const rotateY = useSpring(ry, { stiffness: 200, damping: 18 });
  const Icon = megaMenuIconForHref(item.href);

  function onMove(e: ReactMouseEvent<HTMLAnchorElement>) {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rx.set(py * -6);
    ry.set(px * 8);
  }

  function onLeave() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: 0.05 * index }}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="[perspective:800px]"
      >
        <Link
          href={item.href}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-[#FF5722]/35 hover:shadow-[0_20px_40px_-24px_rgba(255,87,34,0.35)]"
        >
          <span
            className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-colors group-hover:bg-[#FF5722]/10 group-hover:text-[#FF5722]"
            aria-hidden
          >
            <Icon className="size-5" strokeWidth={1.8} />
          </span>
          <span className="mt-4 block font-extrabold tracking-tight text-slate-900 transition-colors group-hover:text-[#FF5722]">
            {item.name}
          </span>
          <span className="mt-1.5 block flex-1 text-sm leading-relaxed text-slate-600">
            {item.description}
          </span>
          <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-slate-400 transition-colors group-hover:text-[#FF5722]">
            Bekijk dienst
            <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </Link>
      </motion.div>
    </motion.li>
  );
}

interface PillarServiceDeckProps {
  intro: string;
  items: PillarServiceItem[];
}

export function PillarServiceDeck({ intro, items }: PillarServiceDeckProps) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-[#FF5722]">
        Diensten in dit blok
      </p>
      <p className="mt-2 text-sm text-slate-600">{intro}</p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {items.map((item, index) => (
          <ServiceCard key={item.href} item={item} index={index} />
        ))}
      </ul>
    </div>
  );
}
