"use client";

import Link from "next/link";
import { Magnetic } from "@/components/effects/Magnetic";

interface LiquidCTAProps {
  href: string;
  label: string;
  className?: string;
}

export function LiquidCTA({ href, label, className }: LiquidCTAProps) {
  return (
    <Magnetic radius={180} strength={12}>
      <Link
        href={href}
        className={`group relative inline-flex items-center gap-2.5 rounded-2xl rounded-bl-sm bg-[#FF5722] px-8 py-4 text-base font-bold tracking-tight text-white shadow-[0_12px_28px_-10px_rgba(255,87,34,0.6)] ring-1 ring-[#FF5722]/30 transition hover:bg-orange-600 hover:shadow-[0_18px_44px_-12px_rgba(255,87,34,0.55)] ${className ?? ""}`}
      >
        <span className="relative z-10 transition-transform duration-300 group-hover:-translate-y-px">
          {label}
        </span>
        <svg
          className="relative z-10 size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          aria-hidden
        >
          <path
            d="M7 17 L17 7 M9 7 H17 V15"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span
          aria-hidden
          className="absolute -bottom-[6px] left-7 size-3 rotate-45 bg-[#FF5722] ring-1 ring-[#FF5722]/30 transition-colors group-hover:bg-orange-600 group-hover:ring-orange-600/40"
        />
      </Link>
    </Magnetic>
  );
}
