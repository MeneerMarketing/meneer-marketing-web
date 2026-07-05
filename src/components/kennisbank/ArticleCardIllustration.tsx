import type { ReactNode } from "react";
import type { PillarSlug } from "@/lib/navigation";

interface ArticleCardIllustrationProps {
  slug: string;
  category: PillarSlug;
  className?: string;
}

const CATEGORY_ACCENTS: Record<PillarSlug, string> = {
  strategie: "#FF5722",
  bouwen: "#45382C",
  vindbaarheid: "#0284C7",
  campagnes: "#0081FB",
  behoud: "#00BCD4",
};

const SLUG_SCENES: Record<string, (props: { accent: string }) => ReactNode> = {
  "ai-zoek-vindbaarheid-chatgpt": AiZoekScene,
  "seo-eerst-dan-ads": SeoFirstScene,
  "b2b-verkopen-via-shopify": B2bPortalScene,
  "shopify-performance-roas": PerformanceScene,
  "semantische-seo-2026": SemanticSeoScene,
  "n8n-eerste-workflow": WorkflowScene,
  "cro-checkout-vertrouwen": CheckoutScene,
  "wordpress-blokken-team": WordPressScene,
  "branding-die-verkoopt-b2b": BrandingScene,
};

export function ArticleCardIllustration({
  slug,
  category,
  className = "",
}: ArticleCardIllustrationProps) {
  const accent = CATEGORY_ACCENTS[category];
  const Scene = SLUG_SCENES[slug];

  return (
    <div
      className={`relative aspect-[5/2] min-h-[168px] overflow-hidden bg-[#F8FAFC] ${className}`}
      aria-hidden
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.035)_1px,transparent_1px)] bg-[size:22px_22px]" />
      <div
        className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full opacity-20 blur-2xl"
        style={{ backgroundColor: accent }}
      />
      <div className="relative flex h-full items-center justify-center p-4 sm:p-5">
        {Scene ? (
          <Scene accent={accent} />
        ) : (
          <CategoryFallbackScene accent={accent} category={category} />
        )}
      </div>
    </div>
  );
}

function SceneLabel({ children }: { children: ReactNode }) {
  return (
    <p className="h-4 shrink-0 text-center font-mono text-[9px] font-semibold uppercase leading-4 tracking-[0.16em] text-slate-400">
      {children}
    </p>
  );
}

/** Vast frame: label bovenaan, wit venster altijd op dezelfde plek en hoogte. */
function IllustrationFrame({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="w-full max-w-[280px]">
      <SceneLabel>{label}</SceneLabel>
      <div className="mt-2">
        <MiniWindow>{children}</MiniWindow>
      </div>
    </div>
  );
}

function MiniWindow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex h-[100px] w-full flex-col justify-center overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_16px_40px_-24px_rgba(15,23,42,0.28)] ${className}`}
    >
      {children}
    </div>
  );
}

function WindowChrome({
  label,
  dot = "#22C55E",
}: {
  label: string;
  dot?: string;
}) {
  return (
    <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2">
      <span
        className="size-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: dot }}
      />
      <span className="font-mono text-[9px] font-semibold text-slate-400">
        {label}
      </span>
    </div>
  );
}

function AiZoekScene({ accent }: { accent: string }) {
  return (
    <IllustrationFrame label="ai-antwoord.live">
      <WindowChrome label="chat · live" dot="#8B5CF6" />
      <div className="space-y-1.5 p-2.5">
        <div className="flex gap-2">
          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-sky-500 text-[7px] font-black text-white">
            AI
          </span>
          <div className="min-w-0 flex-1 rounded-xl rounded-bl-sm border border-slate-100 bg-slate-50 px-2 py-1.5">
            <p className="text-[9px] font-medium leading-snug text-slate-600">
              …valt{" "}
              <span className="font-extrabold" style={{ color: accent }}>
                jouw merk
              </span>{" "}
              op als betrouwbare keuze.
            </p>
          </div>
        </div>
        <div className="flex justify-center gap-1.5">
          {["ChatGPT", "Gemini"].map((model) => (
            <span
              key={model}
              className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[7px] font-bold text-slate-500"
            >
              {model}
            </span>
          ))}
        </div>
      </div>
    </IllustrationFrame>
  );
}

function SeoFirstScene({ accent }: { accent: string }) {
  const steps = [
    { label: "SEO", on: true, color: "#22C55E" },
    { label: "Mail", on: true, color: accent },
    { label: "Ads", on: false, color: "#CBD5E1" },
  ];

  return (
    <IllustrationFrame label="volgorde.die.werkt">
      <div className="flex h-full flex-col justify-center px-3 py-2">
        <div className="relative flex items-start justify-between gap-1">
          <div className="absolute left-[10%] right-[10%] top-[14px] h-px bg-slate-100" />
          <div
            className="absolute left-[10%] top-[14px] h-px bg-[#22C55E]"
            style={{ width: "42%" }}
          />
          {steps.map((step) => (
            <div
              key={step.label}
              className="relative z-10 flex flex-1 flex-col items-center gap-1.5"
            >
              <span
                className={`flex size-7 items-center justify-center rounded-full border-2 text-[8px] font-black ${
                  step.on
                    ? "border-transparent text-white"
                    : "border-slate-200 bg-white text-slate-400"
                }`}
                style={
                  step.on
                    ? { backgroundColor: step.color, borderColor: step.color }
                    : undefined
                }
              >
                {step.on ? "✓" : "○"}
              </span>
              <span
                className={`text-[9px] font-bold ${
                  step.on ? "text-slate-800" : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-2 rounded-lg bg-[#FF5722]/5 px-2 py-1 text-center text-[8px] font-bold uppercase tracking-wider text-[#FF5722]">
          Pas daarna ads
        </p>
      </div>
    </IllustrationFrame>
  );
}

function B2bPortalScene({ accent }: { accent: string }) {
  return (
    <IllustrationFrame label="shopify · b2b">
      <div className="flex h-full flex-col justify-center overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 bg-[#FAFAF9] px-3 py-1.5">
          <span className="text-[8px] font-extrabold uppercase tracking-wider text-violet-700">
            Portaal
          </span>
          <span className="rounded-md bg-violet-500/10 px-1.5 py-0.5 text-[7px] font-bold text-violet-700">
            Salon login
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 p-2">
          <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-1.5">
            <p className="text-[7px] font-bold uppercase tracking-wide text-slate-400">
              Consument
            </p>
            <div className="mt-2 space-y-1">
              <div className="h-1.5 w-full rounded-full bg-slate-200" />
              <div className="h-1.5 w-2/3 rounded-full bg-slate-200" />
            </div>
          </div>
          <div
            className="rounded-lg border p-1.5"
            style={{ borderColor: `${accent}55`, backgroundColor: `${accent}0A` }}
          >
            <p
              className="text-[7px] font-bold uppercase tracking-wide"
              style={{ color: accent }}
            >
              B2B
            </p>
            <div className="mt-2 space-y-1">
              <div className="h-1.5 w-full rounded-full bg-slate-200" />
              <div
                className="mt-1.5 rounded-md px-1.5 py-1 text-center text-[7px] font-bold text-white"
                style={{ backgroundColor: accent }}
              >
                Bestellen
              </div>
            </div>
          </div>
        </div>
      </div>
    </IllustrationFrame>
  );
}

function PerformanceScene({ accent }: { accent: string }) {
  return (
    <IllustrationFrame label="core.web.vitals">
      <div className="px-4 py-3">
        <div className="flex items-end justify-center gap-4">
          <div className="relative size-[72px]">
            <svg viewBox="0 0 72 44" className="size-full">
              <path
                d="M 8 40 A 28 28 0 0 1 64 40"
                stroke="#E2E8F0"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 8 40 A 28 28 0 0 1 58 18"
                stroke={accent}
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
            <p className="absolute inset-x-0 bottom-0 text-center text-xl font-black text-slate-900">
              94
            </p>
          </div>
          <div className="space-y-1.5 pb-1">
            {[
              { k: "LCP", v: "0,9s" },
              { k: "INP", v: "98ms" },
            ].map((m) => (
              <div
                key={m.k}
                className="flex items-center justify-between gap-3 rounded-md bg-slate-50 px-2 py-1"
              >
                <span className="font-mono text-[8px] font-bold text-slate-400">
                  {m.k}
                </span>
                <span className="text-[9px] font-extrabold text-slate-800">
                  {m.v}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </IllustrationFrame>
  );
}

function SemanticSeoScene() {
  const rows = [
    { rank: "3", title: "Forum · oud advies", dim: true },
    { rank: "1", title: "Jouw pagina · antwoord", dim: false },
  ];

  return (
    <IllustrationFrame label="serp.stack">
      <div className="p-3">
        <div className="mb-2 flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2.5 py-1.5">
          <span className="size-2 rounded-full bg-slate-200" />
          <span className="truncate text-[9px] font-medium text-slate-600">
            beste [jouw dienst] nederland
          </span>
        </div>
        <div className="space-y-1.5">
          {rows.map((row) => (
            <div
              key={row.rank}
              className={`flex items-center gap-2 rounded-xl border px-2.5 py-1.5 ${
                row.dim
                  ? "border-slate-100 bg-slate-50/80 opacity-60"
                  : "border-[#FF5722]/30 bg-white ring-1 ring-[#FF5722]/15"
              }`}
            >
              <span
                className={`flex size-5 shrink-0 items-center justify-center rounded-md text-[8px] font-black ${
                  row.dim
                    ? "bg-slate-100 text-slate-400"
                    : "bg-[#FF5722] text-white"
                }`}
              >
                {row.rank}
              </span>
              <span
                className={`truncate text-[9px] font-bold ${
                  row.dim ? "text-slate-500" : "text-slate-900"
                }`}
              >
                {row.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </IllustrationFrame>
  );
}

function WorkflowScene({ accent }: { accent: string }) {
  const nodes = ["Trigger", "n8n", "Actie"];

  return (
    <IllustrationFrame label="workflow.sync">
      <div className="px-3 py-3">
        <div className="flex items-center justify-between gap-1">
          {nodes.map((node, i) => (
            <div key={node} className="flex flex-1 items-center gap-1">
              <span
                className={`flex flex-1 flex-col items-center rounded-lg border px-1 py-1.5 ${
                  i === 1
                    ? "border-transparent text-white"
                    : "border-slate-200 bg-slate-50 text-slate-600"
                }`}
                style={
                  i === 1
                    ? { backgroundColor: accent, borderColor: accent }
                    : undefined
                }
              >
                <span className="text-[8px] font-extrabold">{node}</span>
              </span>
              {i < nodes.length - 1 ? (
                <span className="text-[8px] font-bold text-slate-300">→</span>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </IllustrationFrame>
  );
}

function CheckoutScene({ accent }: { accent: string }) {
  return (
    <IllustrationFrame label="checkout.trust">
      <div className="p-3">
        <div className="rounded-lg border border-slate-100 bg-slate-50 p-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[9px] font-bold text-slate-700">Totaal</span>
            <span className="text-[9px] font-extrabold text-slate-900">
              € 149
            </span>
          </div>
          <div className="mt-2 h-6 rounded-md bg-slate-200/80" />
        </div>
        <div
          className="mt-2 flex items-center gap-2 rounded-lg border px-2 py-1.5"
          style={{ borderColor: `${accent}40`, backgroundColor: `${accent}0A` }}
        >
          <span
            className="flex size-5 items-center justify-center rounded-full text-[8px] font-black text-white"
            style={{ backgroundColor: accent }}
          >
            ✓
          </span>
          <span className="text-[8px] font-bold text-slate-700">
            Veilig betalen · reviews zichtbaar
          </span>
        </div>
      </div>
    </IllustrationFrame>
  );
}

function WordPressScene({ accent }: { accent: string }) {
  return (
    <IllustrationFrame label="from.scratch">
      <div className="p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="relative rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
            <span className="text-lg font-black text-slate-300">WP</span>
            <span
              className="absolute inset-x-1 top-1/2 h-0.5 -rotate-12"
              style={{ backgroundColor: accent }}
            />
          </div>
          <span className="text-lg font-bold text-slate-300">→</span>
          <div
            className="rounded-lg border px-3 py-2"
            style={{ borderColor: `${accent}50`, backgroundColor: `${accent}0C` }}
          >
            <p
              className="text-[8px] font-bold uppercase tracking-wider"
              style={{ color: accent }}
            >
              Custom
            </p>
            <p className="text-[9px] font-extrabold text-slate-900">
              Jouw stack
            </p>
          </div>
        </div>
      </div>
    </IllustrationFrame>
  );
}

function BrandingScene({ accent }: { accent: string }) {
  return (
    <IllustrationFrame label="merk.die.verkoopt">
      <div className="flex items-center justify-center p-4">
        <div className="relative h-16 w-28">
          <div className="absolute left-0 top-2 size-14 rounded-2xl border-2 border-slate-200 bg-white shadow-sm" />
          <div
            className="absolute right-0 top-0 size-14 rounded-2xl border-2 bg-white shadow-md"
            style={{ borderColor: accent }}
          >
            <div
              className="mx-auto mt-3 h-1.5 w-8 rounded-full"
              style={{ backgroundColor: accent }}
            />
            <div className="mx-auto mt-2 h-1 w-6 rounded-full bg-slate-200" />
          </div>
          <span
            className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-[7px] font-bold text-white"
            style={{ backgroundColor: accent }}
          >
            B2B
          </span>
        </div>
      </div>
    </IllustrationFrame>
  );
}

function CategoryFallbackScene({
  accent,
  category,
}: {
  accent: string;
  category?: PillarSlug;
}) {
  const label = category ?? "kennis";

  return (
    <IllustrationFrame label="meneer.notes">
      <div className="p-3">
        <div
          className="mb-2 h-1 w-10 rounded-full"
          style={{ backgroundColor: accent }}
        />
        <div className="space-y-1.5">
          <div className="h-1.5 w-full rounded-full bg-slate-100" />
          <div className="h-1.5 w-4/5 rounded-full bg-slate-100" />
          <div className="h-1.5 w-3/5 rounded-full bg-slate-100" />
        </div>
        <p className="mt-2 text-[8px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </p>
      </div>
    </IllustrationFrame>
  );
}
