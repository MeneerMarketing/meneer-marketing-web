import Link from "next/link";
import { WEEKLY_RHYTHM, getFormatById } from "@/data/formats";
import { LAUNCH_CONTENT_PLAN } from "@/data/launch-content-plan";
import { MeneerHead, LOOK } from "@/components/brand/MeneerHead";

export default function DashboardOverviewPage() {
  const pinned = LAUNCH_CONTENT_PLAN.filter((p) => p.pinned).length;

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <header className="flex items-center gap-5">
        <MeneerHead look={LOOK.rechtsOnder} size={72} />
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Overview</h1>
          <p className="mt-1 text-mm-muted">
            Jij bent eindredacteur. Een kwartier per week is genoeg.
          </p>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Posts klaar"
          value={String(LAUNCH_CONTENT_PLAN.length)}
          hint="Captions af, dertig dagen"
        />
        <StatCard label="Vastgezet" value={String(pinned)} hint="Bovenaan je profiel" />
        <StatCard label="Per week" value="3" hint="Plus één wisselaar" />
      </section>

      <section className="rounded-2xl border border-mm-surface bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold">Het vaste ritme</h2>
        <ul className="mt-4 space-y-3">
          {WEEKLY_RHYTHM.map((item) => {
            const format = getFormatById(item.formatId);
            return (
              <li
                key={item.day}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-mm-bg px-4 py-3"
              >
                <span className="font-semibold">{item.day}</span>
                <span className="text-sm text-mm-muted">{format.job}</span>
                <span className="rounded-full bg-mm-accent px-3 py-1 text-xs font-bold text-white">
                  {format.name}
                </span>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-sm text-mm-muted">
          Om de week komt daar een wisselaar bij: Meneer Meter, Meneer Ontleedt, De
          Offerte of Zestig Minuten.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <ActionCard
          title="Launch Plan"
          description="Dertig dagen content met complete captions."
          href="/dashboard/launch"
        />
        <ActionCard
          title="Templates"
          description="Alle formats per slide, zoals ze op Instagram landen."
          href="/dashboard/templates"
        />
        <ActionCard
          title="Content Queue"
          description="Wat er klaarstaat om goed te keuren."
          href="/dashboard/content"
        />
        <ActionCard
          title="Brand Brain"
          description="De regels waar Claude zich aan houdt."
          href="/dashboard/brand-brain"
        />
      </section>

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <h2 className="font-bold text-amber-900">Nog nodig van jou</h2>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-amber-900/85">
          <li>Avatar kiezen en instellen op Instagram</li>
          <li>Naam en bio omzetten</li>
          <li>Before/after screenshots van één afgerond project</li>
          <li>Twintig bedrijven waar je klant van wilt worden</li>
          <li>Supabase- en Anthropic-sleutels in .env.local</li>
        </ul>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-mm-surface bg-white p-5 shadow-sm">
      <p className="text-sm text-mm-muted">{label}</p>
      <p className="mt-1 text-3xl font-extrabold">{value}</p>
      <p className="mt-1 text-xs text-mm-muted">{hint}</p>
    </div>
  );
}

function ActionCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border border-mm-surface bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <h3 className="font-bold">{title}</h3>
      <p className="mt-2 text-sm text-mm-muted">{description}</p>
    </Link>
  );
}
