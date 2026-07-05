"use client";

import type { ReactNode } from "react";

interface TrajectoryBrowserFrameProps {
  tag: string;
  children: ReactNode;
  className?: string;
}

export function TrajectoryBrowserFrame({
  tag,
  children,
  className = "",
}: TrajectoryBrowserFrameProps) {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_48px_-24px_rgba(15,23,42,0.18)] ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
        <span className="size-2.5 rounded-full bg-[#FF5722]/80" aria-hidden />
        <span className="size-2.5 rounded-full bg-amber-300" aria-hidden />
        <span className="size-2.5 rounded-full bg-emerald-400" aria-hidden />
        <span className="ml-3 flex-1 truncate rounded-full bg-slate-100 px-3 py-1 font-mono text-[10px] font-semibold text-slate-400">
          traject.meneermarketing.nl
        </span>
        <span className="shrink-0 rounded-full bg-slate-900 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-white">
          {tag}
        </span>
      </div>
      {children}
    </div>
  );
}
