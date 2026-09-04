"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const NAV: { href: string; label: string; exact?: boolean }[] = [
  { href: "/dashboard", label: "Overzicht", exact: true },
  { href: "/dashboard/leads", label: "Leads" },
  { href: "/dashboard/pipeline", label: "Pipeline" },
  { href: "/dashboard/verticals/new", label: "Vertical launcher" },
  { href: "/dashboard/klanten", label: "Klanten" },
  { href: "/dashboard/discovery", label: "Discovery" },
  { href: "/dashboard/previews", label: "Previews" },
  { href: "/dashboard/seo", label: "SEO Opportunities" },
  { href: "/dashboard/outreach", label: "Outreach" },
  { href: "/dashboard/followups", label: "Follow-ups" },
  { href: "/dashboard/deliverability", label: "Deliverability" },
  { href: "/dashboard/campaigns", label: "Campaigns" },
  { href: "/dashboard/exclusivity", label: "Exclusiviteit" },
  { href: "/dashboard/templates", label: "Templates" },
  { href: "/dashboard/analytics", label: "Analytics" },
  { href: "/dashboard/settings", label: "Instellingen" },
];

export function DashboardShell({
  children,
  userEmail,
  bypass,
}: {
  children: ReactNode;
  userEmail?: string | null;
  bypass?: boolean;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen mm-grid-bg bg-mm-bg text-mm-text">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-mm-border bg-white/85 px-4 py-6 backdrop-blur lg:flex">
          <div className="mb-8 px-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#FF5722]">
              Meneer Marketing
            </p>
            <h1 className="mt-1 text-lg font-extrabold tracking-tight text-slate-900">
              Local Growth Engine
            </h1>
          </div>

          <nav className="flex flex-1 flex-col gap-0.5">
            {NAV.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2.5 text-sm font-semibold transition ${
                    active
                      ? "bg-[#FF5722]/10 text-[#C2410C]"
                      : "text-slate-600 hover:bg-mm-surface hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 space-y-2 border-t border-mm-border px-2 pt-4 text-[11px] text-slate-400">
            <p>Live Supabase · Discovery &amp; previews actief</p>
            {bypass ? <p className="font-semibold text-amber-700">DEV auth bypass actief</p> : null}
            {userEmail ? <p className="truncate text-slate-500">{userEmail}</p> : null}
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-mm-border bg-white/90 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="lg:hidden">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF5722]">
                  Meneer Marketing
                </p>
                <p className="text-sm font-extrabold tracking-tight">Local Growth</p>
              </div>
              <div className="hidden text-sm text-slate-500 lg:block">
                Interne acquisitie-app · Pilates &amp; huidklinieken
              </div>
              <div className="bg-[#FFEDD5] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#C2410C]">
                Intern
              </div>
            </div>
            <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {NAV.map((item) => {
                const active = item.exact
                  ? pathname === item.href
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`shrink-0 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] ${
                      active ? "bg-[#FF5722] text-white" : "bg-mm-surface text-slate-600"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
