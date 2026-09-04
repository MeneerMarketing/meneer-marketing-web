import Link from "next/link";

const NAV = [
  { href: "/", label: "Overzicht" },
  { href: "/opportunities", label: "Opportunities" },
  { href: "/concepts", label: "Concepts" },
  { href: "/preview/premium-dtc", label: "PDP Demo" },
  {
    href: "/preview/concept/latest",
    label: "Concept Preview",
  },
  { href: "/cro-ready", label: "CRO Ready" },
  { href: "/outreach", label: "Outreach" },
  { href: "/keywords", label: "Keyword Intelligence" },
  { href: "/scale", label: "Controlled Scale" },
  { href: "/needs-attention", label: "Needs Attention" },
  { href: "/brands", label: "Brands" },
  { href: "/discovery", label: "Google Discovery (raw)" },
  { href: "/concepts/prospect-quality", label: "Prospect Quality" },
  { href: "/concepts/design-target", label: "Design Target" },
  { href: "/concepts/high-ticket", label: "High-Ticket Brands" },
  { href: "/concepts/brand-first", label: "Brand-First Opportunities" },
  { href: "/runs", label: "Runs" },
  { href: "/api-usage", label: "API Usage" },
  { href: "/settings", label: "Settings" },
] as const;

const LATER = [{ label: "Meta Discovery" }] as const;

export function AppShell({
  children,
  activePath,
}: {
  children: React.ReactNode;
  activePath: string;
}) {
  return (
    <div className="min-h-screen mm-grid-bg bg-mm-bg text-mm-text">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-mm-border bg-white/80 px-4 py-6 backdrop-blur lg:flex">
          <div className="mb-8 px-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#FF5722]">
              Meneer Marketing
            </p>
            <h1 className="mt-1 text-lg font-extrabold tracking-tight text-slate-900">
              Commerce Opportunity Engine
            </h1>
          </div>

          <nav className="flex flex-1 flex-col gap-1">
            {NAV.map((item) => {
              const active =
                item.href === "/"
                  ? activePath === "/"
                  : activePath.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                    active
                      ? "bg-[#FF5722]/10 text-[#C2410C]"
                      : "text-slate-600 hover:bg-mm-surface hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <div className="mt-8 px-2">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Later
              </p>
              {LATER.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl px-3 py-2 text-sm font-medium text-slate-300"
                  title="Nog niet beschikbaar"
                >
                  {item.label}
                </div>
              ))}
            </div>
          </nav>

          <p className="px-2 text-[11px] text-slate-400">
            CRO Intelligence live. Opportunity Score ≠ website quality.
          </p>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-mm-border bg-white/85 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="lg:hidden">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF5722]">
                  Meneer Marketing
                </p>
                <p className="text-sm font-extrabold tracking-tight">COE Dashboard</p>
              </div>
              <div className="hidden text-sm text-slate-500 lg:block">
                Live Supabase data · geen dummy leads
              </div>
              <div className="rounded-full bg-mm-accent-subtle px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-mm-accent">
                Milestone 9
              </div>
            </div>
            <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {NAV.map((item) => {
                const active =
                  item.href === "/"
                    ? activePath === "/"
                    : activePath.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold ${
                      active
                        ? "bg-[#FF5722] text-white"
                        : "bg-mm-surface text-slate-600"
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
