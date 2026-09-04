"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const NAV = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/content", label: "Content Queue" },
  { href: "/dashboard/calendar", label: "Kalender" },
  { href: "/dashboard/templates", label: "Templates" },
  { href: "/dashboard/launch", label: "Launch Plan" },
  { href: "/dashboard/brand-brain", label: "Brand Brain" },
];

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-64 flex-col border-r border-mm-surface bg-mm-footer text-white">
        <div className="border-b border-white/10 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mm-accent-bold">
            Social Engine
          </p>
          <h1 className="mt-1 text-xl font-bold">Meneer Marketing</h1>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-4">
          {NAV.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-mm-accent text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-4 text-xs text-white/40">
          Poort 3030 · Eindredactie modus
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
