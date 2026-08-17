"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { siteCtas } from "@/lib/cta";

interface CheckItem {
  id: string;
  label: string;
  fix: string;
}

type TierId = "mens" | "linkedin" | "folder" | "gemeente";

interface Tier {
  id: TierId;
  min: number;
  max: number;
  label: string;
  quip: string;
}

const CHECKS: readonly CheckItem[] = [
  {
    id: "specialist",
    label: 'Hero zegt "dé specialist" of "sinds [jaar]" zonder wat je verkoopt',
    fix: "Zet in de H1 voor wie het is én welk resultaat je levert. Jaartal mag later.",
  },
  {
    id: "cta",
    label: 'CTA is "Neem contact op" of "Meer info" in plaats van een concrete belofte',
    fix: "Maak van de knop een uitkomst: plan scan, bekijk voorraad, vraag offerte met scope.",
  },
  {
    id: "innovatie",
    label: 'Zin met "innovatieve oplossingen" of "klaar voor de toekomst"',
    fix: "Vervang de slogan door één feit: wat er verandert na de klik of na oplevering.",
  },
  {
    id: "partnerships",
    label: '"Wij denken in partnerships" of vergelijkbaar bureau-Nederlands',
    fix: "Schrijf wat de samenwerking concreet inhoudt: vaste scope, vaste updates, vaste metriek.",
  },
  {
    id: "adjectieven",
    label: 'Voordelen als "hoogwaardig", "duurzaam", "flexibel" zonder bewijs',
    fix: "Koppel elk bijvoeglijk naamwoord aan een getal, termijn of harde belofte.",
  },
  {
    id: "over-ons",
    label: "Over-ons begint met het oprichtingsjaar in plaats van het probleem van de klant",
    fix: "Open met het probleem dat je oplost. Geschiedenis komt daarna, korter.",
  },
  {
    id: "features",
    label: "Dienstenpagina somt features op, niet uitkomsten",
    fix: "Per dienst: probleem → resultaat → volgende stap. Features als steun, niet als kop.",
  },
  {
    id: "formulier",
    label: 'Formulier vraagt meer dan nodig vóór waarde (telefoon verplicht "voor de zekerheid")',
    fix: "Vraag eerst alleen wat je nodig hebt om te helpen. Telefoon optioneel tot de belofte duidelijk is.",
  },
  {
    id: "logos",
    label: 'Trust is een logo-rij zonder context ("zij vertrouwen op ons")',
    fix: "Zet bij één logo een korte uitkomst of branche. Context wint van een zwijgende strip.",
  },
  {
    id: "uitwisselbaar",
    label: "Elke alinea kan op elke concurrent-site staan zonder edit",
    fix: "Noem product, regio, proces of prijsrange. Specifiek maakt jouw tekst van jou.",
  },
  {
    id: "message-match",
    label: 'Ads beloven X, landingskop praat over "welkom bij"',
    fix: "Herhaal het aanbod uit je sterkste ad in de landings-H1. Message match eerst, merktoon daarna.",
  },
  {
    id: "faq",
    label: "FAQ ontwijkt prijs, doorlooptijd of wat er wél of niet bij zit",
    fix: "Beantwoord de ongemakkelijke vragen kort en eerlijk. Twijfel verdwijnt sneller dan je denkt.",
  },
] as const;

const TIERS: readonly Tier[] = [
  {
    id: "mens",
    min: 0,
    max: 24,
    label: "Mens aan tafel",
    quip: "Je klinkt als iemand die iets verkoopt. Goed zo.",
  },
  {
    id: "linkedin",
    min: 25,
    max: 49,
    label: "LinkedIn-light",
    quip: "Nog net menselijk, met een vleugje congresfolder.",
  },
  {
    id: "folder",
    min: 50,
    max: 74,
    label: "Verzekeringsfolder",
    quip: "Mooie woorden. Weinig reden om te klikken.",
  },
  {
    id: "gemeente",
    min: 75,
    max: 100,
    label: "Gemeenteportaal 2009",
    quip: "Je site informeert. Verkopen doet hij alsof dat vies is.",
  },
] as const;

const STORAGE_KEY = "mm-brochure-ometer";

function scoreFromCount(count: number): number {
  return Math.round((count / CHECKS.length) * 100);
}

function tierForScore(score: number): Tier {
  return (
    TIERS.find((t) => score >= t.min && score <= t.max) ?? TIERS[TIERS.length - 1]!
  );
}

function pushAnalytics(score: number, tier: string): void {
  if (typeof window === "undefined") return;
  const w = window as Window & {
    dataLayer?: Array<Record<string, unknown>>;
  };
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push({
    event: "brochure_ometer_complete",
    score,
    tier,
  });
}

interface BrochureOmeterProps {
  siteUrl?: string | null;
  sharePath?: string;
}

export function BrochureOmeter({
  siteUrl = null,
  sharePath = "/meter",
}: BrochureOmeterProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, boolean>;
        setChecked(parsed);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
    } catch {
      /* ignore */
    }
  }, [checked, hydrated]);

  const count = useMemo(
    () => CHECKS.filter((c) => checked[c.id]).length,
    [checked],
  );
  const score = scoreFromCount(count);
  const tier = tierForScore(score);
  const topFixes = useMemo(
    () => CHECKS.filter((c) => checked[c.id]).slice(0, 3),
    [checked],
  );

  function toggle(id: string): void {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
    setCopied(false);
  }

  function reset(): void {
    setChecked({});
    setCopied(false);
  }

  async function copyScore(): Promise<void> {
    const shareBase =
      typeof window !== "undefined"
        ? `${window.location.origin}${sharePath}`
        : `https://meneermarketing.nl${sharePath}`;
    const lines = [
      siteUrl ? `Site: ${siteUrl}` : null,
      `Meneer Meter score: ${score}/100`,
      `Label: ${tier.label}`,
      tier.quip,
      `Test jouw site: ${shareBase}`,
    ].filter((line): line is string => Boolean(line));
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      pushAnalytics(score, tier.id);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section
      className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_50px_-32px_rgba(15,23,42,0.35)]"
      aria-labelledby="brochure-ometer-heading"
    >
      <div className="border-b border-slate-200 bg-slate-950 px-5 py-5 text-white sm:px-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FF5722]">
          Interactieve test
        </p>
        <h3
          id="brochure-ometer-heading"
          className="mt-2 text-2xl font-extrabold tracking-tight"
        >
          Brochure-o-meter
        </h3>
        <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-slate-300">
          Vink aan wat je herkent op jouw site. Hoe hoger de score, hoe meer
          folder en hoe minder reden om te klikken.
        </p>
        {siteUrl ? (
          <p className="mt-3 text-xs font-semibold text-slate-400">
            Nu voor: <span className="text-white">{siteUrl}</span>
          </p>
        ) : null}
      </div>

      <div className="grid gap-0 lg:grid-cols-[1.35fr_0.85fr]">
        <ul className="divide-y divide-slate-100 p-2 sm:p-3">
          {CHECKS.map((item) => {
            const on = Boolean(checked[item.id]);
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  aria-pressed={on}
                  className={`flex w-full items-start gap-3 rounded-2xl px-3 py-3.5 text-left transition ${
                    on
                      ? "bg-orange-50/80"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md border-2 text-xs font-extrabold transition ${
                      on
                        ? "border-[#FF5722] bg-[#FF5722] text-white"
                        : "border-slate-300 bg-white text-transparent"
                    }`}
                    aria-hidden
                  >
                    ✓
                  </span>
                  <span className="min-w-0 text-sm font-semibold leading-snug text-slate-800 sm:text-[15px]">
                    {item.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <aside className="border-t border-slate-200 bg-slate-50 p-5 sm:p-6 lg:border-l lg:border-t-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Jouw score
          </p>
          <div className="mt-3 flex items-end gap-2">
            <span
              className="text-5xl font-extrabold tracking-tight text-slate-900 motion-safe:transition-transform"
              style={{ transform: count > 0 ? "scale(1)" : "scale(0.96)" }}
            >
              {score}
            </span>
            <span className="mb-2 text-sm font-bold text-slate-500">/ 100</span>
          </div>
          <div
            className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200"
            role="meter"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={score}
            aria-label="Brochure-score"
          >
            <div
              className="h-full rounded-full bg-[#FF5722] transition-[width] duration-300 ease-out motion-reduce:transition-none"
              style={{ width: `${score}%` }}
            />
          </div>
          <p className="mt-4 text-lg font-extrabold text-slate-900">{tier.label}</p>
          <p className="mt-1 text-sm font-medium leading-relaxed text-slate-600">
            {tier.quip}
          </p>

          {topFixes.length > 0 ? (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#FF5722]">
                Eerst dit herschrijven
              </p>
              <ol className="mt-3 space-y-3">
                {topFixes.map((item) => (
                  <li key={item.id} className="text-sm leading-relaxed text-slate-700">
                    <span className="font-bold text-slate-900">{item.fix}</span>
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <p className="mt-5 text-sm font-medium text-slate-500">
              Vink één of meer patronen aan voor gerichte fixes.
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={reset}
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800 transition hover:border-slate-900"
            >
              Opnieuw
            </button>
            <button
              type="button"
              onClick={() => void copyScore()}
              className="rounded-full border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-[#FF5722] hover:border-[#FF5722]"
            >
              {copied ? "Gekopieerd" : "Kopieer mijn score"}
            </button>
          </div>

          <div className="mt-5 flex flex-col gap-2">
            <Link
              href="/diensten/cro"
              className="inline-flex items-center justify-center rounded-full border-2 border-slate-900 bg-white px-4 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-slate-900 hover:text-white"
            >
              Conversie-optimalisatie
            </Link>
            <Link
              href={siteCtas.startIntake.href}
              className="inline-flex items-center justify-center rounded-full bg-[#FF5722] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#e64a19]"
            >
              {siteCtas.startIntake.label}
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
