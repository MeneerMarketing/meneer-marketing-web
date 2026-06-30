"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BadgeEuro,
  Building2,
  Check,
  Clock,
  Code2,
  Coffee,
  Cpu,
  Gauge,
  Globe,
  Handshake,
  Infinity as InfinityIcon,
  Layers,
  Link2,
  Mail,
  MessageCircle,
  Palette,
  Phone,
  Rocket,
  Send,
  Shapes,
  ShoppingBag,
  Sparkles,
  Target,
  TrendingUp,
  User,
  Users,
  Zap,
} from "lucide-react";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { businessEmail } from "@/lib/contact";
import { submitContactForm } from "@/lib/contact-submission";
import { readPlaygroundSummary } from "@/lib/groeiscan-playground";

// ─── TYPES ────────────────────────────────────────────────────────────────

export type ConversionFormVariant =
  | "samenwerken"
  | "project-starten"
  | "intake"
  | "groeiscan"
  | "schaal-op";

type LucideIconComponent = React.ComponentType<React.SVGProps<SVGSVGElement> & {
  size?: string | number;
  strokeWidth?: string | number;
}>;

interface TileOption {
  readonly value: string;
  readonly label: string;
  readonly description: string;
  readonly Icon: LucideIconComponent;
}

interface TileGroup {
  readonly key: TileFieldKey;
  readonly title: string;
  readonly subtitle: string;
  readonly columns?: 2 | 3;
  readonly options: readonly TileOption[];
}

type TileFieldKey =
  | "samenwerkingsvorm"
  | "projectType"
  | "budgetIndicatie"
  | "gewensteStart"
  | "urgentie"
  | "schaalFocus";

interface VariantConfig {
  readonly subject: string;
  readonly bodyTag: string;
  readonly intro: string;
  readonly tiles: readonly TileGroup[];
  readonly extras: readonly ExtraField[];
  readonly messagePlaceholder: string;
  readonly submitLabel: string;
}

type ExtraField = "websiteUrl" | "huidigeStack";

interface FormState {
  naam: string;
  bedrijf: string;
  email: string;
  telefoon: string;
  websiteUrl: string;
  huidigeStack: string;
  bericht: string;
  samenwerkingsvorm: string;
  projectType: string;
  budgetIndicatie: string;
  gewensteStart: string;
  urgentie: string;
  schaalFocus: string;
}

const INITIAL_STATE: FormState = {
  naam: "",
  bedrijf: "",
  email: "",
  telefoon: "",
  websiteUrl: "",
  huidigeStack: "",
  bericht: "",
  samenwerkingsvorm: "",
  projectType: "",
  budgetIndicatie: "",
  gewensteStart: "",
  urgentie: "",
  schaalFocus: "",
};

// ─── OPTION LIBRARIES ─────────────────────────────────────────────────────

const SAMENWERKING_OPTIONS: readonly TileOption[] = [
  {
    value: "retainer",
    label: "Retainer",
    description: "Langdurig partnerschap. Wij zijn je groei-team.",
    Icon: InfinityIcon,
  },
  {
    value: "project",
    label: "Project",
    description: "Afgebakende scope, vaste planning en budget.",
    Icon: Rocket,
  },
  {
    value: "embedded",
    label: "Embedded",
    description: "Flexibele uren, ingebed in jouw team & tools.",
    Icon: Users,
  },
  {
    value: "sparren",
    label: "Sparren",
    description: "Eerst context opbouwen. Vorm bepalen we samen.",
    Icon: Coffee,
  },
];

const PROJECT_TYPE_OPTIONS: readonly TileOption[] = [
  {
    value: "webshop",
    label: "Webshop",
    description: "Shopify, enterprise e-commerce, checkout & CRO.",
    Icon: ShoppingBag,
  },
  {
    value: "website",
    label: "Website",
    description: "Corporate, leadgen of content. WP of headless.",
    Icon: Globe,
  },
  {
    value: "webapp",
    label: "Webapp",
    description: "Maatwerk in Next.js, dashboards, portals.",
    Icon: Code2,
  },
  {
    value: "marketing",
    label: "Marketing",
    description: "SEO, content, paid & lifecycle. Meetbaar.",
    Icon: TrendingUp,
  },
  {
    value: "automatisering",
    label: "Automatisering",
    description: "n8n, Make, koppelingen, AI-workflows.",
    Icon: Zap,
  },
  {
    value: "design",
    label: "Design",
    description: "Branding, UX, visuele taal. Systeem eerst.",
    Icon: Palette,
  },
  {
    value: "mix",
    label: "Mix",
    description: "Combinatie van bovenstaande. Begeleid traject.",
    Icon: Shapes,
  },
];

const BUDGET_OPTIONS: readonly TileOption[] = [
  { value: "tot-5k", label: "Tot € 5.000", description: "Kort traject, quick win.", Icon: BadgeEuro },
  { value: "5k-15k", label: "€ 5–15k", description: "Serieus deeltraject.", Icon: BadgeEuro },
  { value: "15k-40k", label: "€ 15–40k", description: "Fundament of lanceringstraject.", Icon: BadgeEuro },
  { value: "40k-plus", label: "€ 40k+", description: "Schaal of meerjarentraject.", Icon: BadgeEuro },
  { value: "weet-niet", label: "Nog geen idee", description: "Graag jouw advies op basis van scope.", Icon: Sparkles },
];

const START_OPTIONS: readonly TileOption[] = [
  { value: "asap", label: "Zo snel mogelijk", description: "Liefst binnen twee weken starten.", Icon: Zap },
  { value: "1m", label: "Binnen 1 maand", description: "Kick-off gepland, voorbereiding loopt.", Icon: Rocket },
  { value: "1-3m", label: "1 – 3 maanden", description: "Planning in volgende kwartaal.", Icon: Clock },
  { value: "3m-plus", label: "3+ maanden", description: "Strategische oriëntatie.", Icon: Layers },
];

const URGENTIE_OPTIONS: readonly TileOption[] = [
  { value: "normaal", label: "Normaal", description: "Reactie binnen een paar werkdagen is prima.", Icon: MessageCircle },
  { value: "dit-kwartaal", label: "Dit kwartaal", description: "Ik wil dit kwartaal starten.", Icon: Target },
  { value: "urgent", label: "Urgent", description: "Graag snel contact. Dit ligt op tafel.", Icon: AlertCircle },
];

const SCHAAL_OPTIONS: readonly TileOption[] = [
  { value: "leads", label: "Meer leads", description: "Gekwalificeerd, schaalbaar, voorspelbaar.", Icon: Target },
  { value: "conversie", label: "Betere conversie", description: "Van verkeer naar klant. CRO scherp.", Icon: Gauge },
  { value: "verkeer", label: "Meer verkeer", description: "Organisch: SEO & content compounding.", Icon: TrendingUp },
  { value: "ads", label: "Paid scherp", description: "Ads efficiënt & meetbaar. ROAS/CAC.", Icon: Rocket },
  { value: "automatisering", label: "Automatisering", description: "Sales & marketing flows op autopilot.", Icon: Cpu },
  { value: "alles", label: "Eerst in kaart", description: "Prioriteit bepalen via Groeiscan.", Icon: Sparkles },
];

// ─── VARIANT CONFIG ───────────────────────────────────────────────────────

const VARIANTS: Record<ConversionFormVariant, VariantConfig> = {
  samenwerken: {
    subject: "[Samenwerken]",
    bodyTag: "Aanvraag via meneermarketing.nl/samenwerken",
    intro: "Vertel hoe je wilt samenwerken. Wij mappen scope, ritme en rollen. En reageren met een helder voorstel.",
    tiles: [
      {
        key: "samenwerkingsvorm",
        title: "Welke samenwerkingsvorm past?",
        subtitle: "Kies de vorm die het dichtst bij jouw behoefte zit. We verfijnen later.",
        columns: 2,
        options: SAMENWERKING_OPTIONS,
      },
    ],
    extras: ["huidigeStack"],
    messagePlaceholder:
      "Context: wat loopt goed, waar wringt het? Deadlines of momenten die ertoe doen?",
    submitLabel: "Stuur aanvraag",
  },
  "project-starten": {
    subject: "[Project starten]",
    bodyTag: "Aanvraag via meneermarketing.nl/project-starten",
    intro: "Een scherp brief geeft scherpe antwoorden. Kies het type, indicatie en timing.",
    tiles: [
      {
        key: "projectType",
        title: "Welk type project?",
        subtitle: "Kies het dichtstbijzijnde. Combinaties kunnen later.",
        columns: 3,
        options: PROJECT_TYPE_OPTIONS,
      },
      {
        key: "budgetIndicatie",
        title: "Budgetindicatie",
        subtitle: "Geen offerte-trigger. Het helpt ons scope realistisch voorstellen.",
        columns: 3,
        options: BUDGET_OPTIONS,
      },
      {
        key: "gewensteStart",
        title: "Gewenste start",
        subtitle: "Tempo bepaalt volgorde. Is vaak bij te sturen.",
        columns: 2,
        options: START_OPTIONS,
      },
    ],
    extras: ["websiteUrl"],
    messagePlaceholder:
      "Wat wil je bouwen of verbeteren? Links naar referenties / de huidige site helpen enorm.",
    submitLabel: "Start mijn project",
  },
  intake: {
    subject: "[Start intake]",
    bodyTag: "Aanvraag via meneermarketing.nl/intake",
    intro: "Je antwoorden voeden het gesprek voor. Technisch én commercieel, zonder jargon.",
    tiles: [
      {
        key: "projectType",
        title: "Waar moet de intake over gaan?",
        subtitle: "Eén hoofdonderwerp helpt ons de juiste expert meebrengen.",
        columns: 3,
        options: PROJECT_TYPE_OPTIONS,
      },
      {
        key: "urgentie",
        title: "Prioriteit",
        subtitle: "Eerlijk is beter. Dan plannen we realistisch.",
        columns: 3,
        options: URGENTIE_OPTIONS,
      },
    ],
    extras: ["websiteUrl"],
    messagePlaceholder:
      "Schrijf kort: situatie, doel, wat je al geprobeerd hebt, en wat er nu moet gebeuren.",
    submitLabel: "Plan mijn intake",
  },
  groeiscan: {
    subject: "[Groeiscan. Follow-up]",
    bodyTag: "Aanvraag via meneermarketing.nl/groeiscan",
    intro: "De playground is een model. Wij maken er een strategie van. Kies wanneer en we nemen het over.",
    tiles: [
      {
        key: "gewensteStart",
        title: "Wanneer wil je vervolgen?",
        subtitle: "Call, echte Groeiscan of rapport. We bepalen samen.",
        columns: 2,
        options: START_OPTIONS,
      },
    ],
    extras: [],
    messagePlaceholder:
      "Wat viel je op in de playground? Welke knoppen wil je in het echt omzetten?",
    submitLabel: "Plan Groeiscan-vervolg",
  },
  "schaal-op": {
    subject: "[Schaal op]",
    bodyTag: "Aanvraag via meneermarketing.nl/schaal-op",
    intro: "Meer volume lost niet alles op. We willen weten waar je grootste hefboom zit.",
    tiles: [
      {
        key: "schaalFocus",
        title: "Waar wil je vooral op schalen?",
        subtitle: "Eén hoofdfocus. We bouwen eromheen.",
        columns: 3,
        options: SCHAAL_OPTIONS,
      },
      {
        key: "budgetIndicatie",
        title: "Budgetindicatie",
        subtitle: "Hulp bij realistisch voorstel. Nog geen offerte.",
        columns: 3,
        options: BUDGET_OPTIONS,
      },
    ],
    extras: ["websiteUrl"],
    messagePlaceholder:
      "Wat groeit al? Waar hapert het? Getallen (verkeer / conversie / CAC) helpen enorm.",
    submitLabel: "Laat ons schalen",
  },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────

function findLabel(
  options: readonly TileOption[],
  value: string,
): string | null {
  return options.find((o) => o.value === value)?.label ?? null;
}

function buildSubmissionBody(
  state: FormState,
  variant: ConversionFormVariant,
): string {
  let body = buildBody(state, variant);
  if (variant === "groeiscan") {
    const playground = readPlaygroundSummary();
    if (playground) {
      body += `\n\n${playground}`;
    }
  }
  return body;
}

function buildBody(state: FormState, variant: ConversionFormVariant): string {
  const cfg = VARIANTS[variant];
  const out: string[] = [cfg.bodyTag, "", `Naam: ${state.naam.trim()}`];
  if (state.bedrijf.trim()) out.push(`Bedrijf: ${state.bedrijf.trim()}`);
  out.push(`E-mail: ${state.email.trim()}`);
  if (state.telefoon.trim()) out.push(`Telefoon: ${state.telefoon.trim()}`);
  if (state.websiteUrl.trim()) out.push(`Website / URL: ${state.websiteUrl.trim()}`);

  for (const group of cfg.tiles) {
    const val = state[group.key];
    const label = findLabel(group.options, val);
    if (label) out.push(`${group.title.replace(/\?$/, "")}: ${label}`);
  }

  if (cfg.extras.includes("huidigeStack") && state.huidigeStack.trim()) {
    out.push(`Huidige stack: ${state.huidigeStack.trim()}`);
  }

  out.push("", state.bericht.trim() || "(geen extra bericht)");
  return out.join("\n");
}

// ─── UI PRIMITIVES ────────────────────────────────────────────────────────

const stepVariants: Variants = {
  enter: { opacity: 0, y: 12 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

interface TileProps {
  readonly option: TileOption;
  readonly selected: boolean;
  readonly onSelect: () => void;
}

function Tile({ option, selected, onSelect }: TileProps) {
  const { Icon, label, description } = option;
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      aria-pressed={selected}
      className={[
        "group relative flex h-full flex-col items-start gap-2 overflow-hidden rounded-2xl border p-4 text-left transition-colors",
        "sm:p-5",
        selected
          ? "border-mm-sky-deep bg-mm-sky-subtle/70 shadow-[0_10px_30px_-10px_rgba(2,132,199,0.45)]"
          : "border-mm-border bg-white hover:border-mm-sky/40 hover:shadow-mm-card",
      ].join(" ")}
    >
      <span
        className={[
          "inline-flex size-10 items-center justify-center rounded-xl transition-colors",
          selected
            ? "bg-mm-sky-deep text-white"
            : "bg-mm-sky-subtle text-mm-sky-deep group-hover:bg-mm-sky/15",
        ].join(" ")}
        aria-hidden
      >
        <Icon className="size-5" />
      </span>
      <span className="text-sm font-bold text-mm-text sm:text-base">
        {label}
      </span>
      <span className="text-xs leading-relaxed text-mm-muted sm:text-[13px]">
        {description}
      </span>
      <span
        aria-hidden
        className={[
          "absolute right-3 top-3 inline-flex size-6 items-center justify-center rounded-full border transition-all",
          selected
            ? "scale-100 border-mm-sky-deep bg-mm-sky-deep text-white opacity-100"
            : "scale-90 border-mm-border bg-white/80 text-transparent opacity-0",
        ].join(" ")}
      >
        <Check className="size-3.5" strokeWidth={3} />
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-mm-sky/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
    </motion.button>
  );
}

interface FieldProps {
  readonly id: string;
  readonly label: string;
  readonly icon: LucideIconComponent;
  readonly required?: boolean;
  readonly children: ReactNode;
  readonly hint?: string;
}

function Field({ id, label, icon: Icon, required, children, hint }: FieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-mm-muted"
      >
        <Icon className="size-3.5 text-mm-sky-deep" aria-hidden />
        <span>
          {label}
          {required ? <span className="ml-0.5 text-mm-accent">*</span> : null}
        </span>
      </label>
      {children}
      {hint ? <p className="mt-1.5 text-xs text-mm-muted">{hint}</p> : null}
    </div>
  );
}

const inputCls =
  "w-full rounded-2xl border border-mm-border bg-white/70 px-4 py-3.5 text-sm text-mm-text placeholder:text-mm-muted/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-sm transition focus:border-mm-sky focus:bg-white focus:outline-none focus:ring-4 focus:ring-mm-sky/15";

// ─── STEP INDICATOR ───────────────────────────────────────────────────────

interface StepIndicatorProps {
  readonly step: number;
  readonly total: number;
  readonly labels: readonly string[];
}

function StepIndicator({ step, total, labels }: StepIndicatorProps) {
  const pct = ((step + 1) / total) * 100;
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-mm-muted">
          Stap {step + 1} · {labels[step]}
        </p>
        <p className="text-[11px] font-bold text-mm-sky-deep">
          {step + 1}/{total}
        </p>
      </div>
      <div className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-mm-border/60">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, var(--mm-sky), var(--mm-sky-deep) 60%, var(--mm-accent))",
          }}
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <div className="mt-3 flex justify-between text-[10px] font-semibold uppercase tracking-widest text-mm-muted">
        {labels.map((l, i) => (
          <span
            key={l}
            className={
              i <= step ? "text-mm-sky-deep" : "text-mm-muted opacity-60"
            }
          >
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── SUCCESS STATE ────────────────────────────────────────────────────────

interface SuccessStateProps {
  readonly onReset: () => void;
  readonly replyToEmail: string;
}

function SuccessState({ onReset, replyToEmail }: SuccessStateProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl border border-mm-border bg-white p-8 text-center shadow-mm-card sm:p-10"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(380px circle at 50% 0%, rgba(14,165,233,0.18), transparent 65%)",
        }}
      />

      {!reduce && (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {Array.from({ length: 14 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute top-1/2 left-1/2 size-1.5 rounded-full"
              style={{
                background:
                  i % 3 === 0
                    ? "var(--mm-accent)"
                    : i % 3 === 1
                      ? "var(--mm-sky-deep)"
                      : "var(--mm-sky)",
              }}
              initial={{ x: 0, y: 0, opacity: 0 }}
              animate={{
                x: Math.cos((i / 14) * Math.PI * 2) * 120,
                y: Math.sin((i / 14) * Math.PI * 2) * 120 - 40,
                opacity: [0, 1, 0],
                scale: [0.6, 1, 0.4],
              }}
              transition={{ duration: 1.6, delay: 0.2 + i * 0.02 }}
            />
          ))}
        </div>
      )}

      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="relative mx-auto flex size-16 items-center justify-center rounded-full bg-mm-sky-deep text-white shadow-[0_12px_30px_-6px_rgba(2,132,199,0.6)]"
      >
        <Check className="size-7" strokeWidth={3} />
      </motion.div>

      <h3 className="relative mt-6 text-2xl font-extrabold text-mm-text sm:text-3xl">
        Bedankt — we hebben je aanvraag ontvangen.
      </h3>
      <p className="relative mx-auto mt-3 max-w-md text-sm leading-relaxed text-mm-muted">
        We reageren binnen één à twee werkdagen op{" "}
        <strong className="text-mm-text">{replyToEmail}</strong>. Komt er niets
        binnen? Check je spam of mail ons op{" "}
        <a
          href={`mailto:${businessEmail}`}
          className="font-semibold text-mm-sky-deep underline-offset-4 hover:underline"
        >
          {businessEmail}
        </a>
        .
      </p>

      <div className="relative mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-full bg-mm-accent px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-mm-accent-hover"
        >
          Nieuwe aanvraag starten
        </button>
      </div>
    </motion.div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────

export interface ConversionFormProps {
  readonly variant: ConversionFormVariant;
  /** Unieke prefix bij meerdere formulieren op één pagina */
  readonly idPrefix?: string;
}

export function ConversionForm({
  variant,
  idPrefix = "mm",
}: ConversionFormProps) {
  const cfg = VARIANTS[variant];
  const pid = (n: string) => `${idPrefix}-${variant}-${n}`;

  const [state, setState] = useState<FormState>(INITIAL_STATE);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(0);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const STEP_LABELS = ["Context", "Contact", "Bericht"] as const;

  const mailBody = useMemo(
    () => buildSubmissionBody(state, variant),
    [state, variant],
  );
  const mailSubject = useMemo(
    () =>
      `${cfg.subject} ${state.naam.trim() || "…"}${
        state.bedrijf.trim() ? " · " + state.bedrijf.trim() : ""
      }`,
    [cfg.subject, state.naam, state.bedrijf],
  );

  const patch = (partial: Partial<FormState>) => {
    setState((prev) => ({ ...prev, ...partial }));
    setError(null);
  };

  const validateStep = (s: number): string | null => {
    if (s === 0) {
      for (const group of cfg.tiles) {
        if (!state[group.key]) {
          return `Kies: ${group.title.replace(/\?$/, "")}.`;
        }
      }
      return null;
    }
    if (s === 1) {
      if (!state.naam.trim()) return "Je naam mag niet ontbreken.";
      if (!state.email.trim()) return "E-mail is nodig. Zo kunnen we terugkoppelen.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email.trim())) {
        return "Check even het e-mailadres.";
      }
      return null;
    }
    if (s === 2) {
      if (state.bericht.trim().length < 10) {
        return "Een paar zinnen context helpt enorm. Minimaal 10 tekens.";
      }
      return null;
    }
    return null;
  };

  const next = () => {
    const err = validateStep(step);
    if (err) {
      setError(err);
      setShake((s) => s + 1);
      return;
    }
    setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1));
  };

  const prev = () => {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const err = validateStep(2);
    if (err) {
      setError(err);
      setShake((s) => s + 1);
      return;
    }

    setSubmitting(true);
    setError(null);

    const result = await submitContactForm({
      source: variant,
      subject: mailSubject,
      replyToEmail: state.email.trim(),
      replyToName: state.naam.trim(),
      body: mailBody,
      companyWebsite: "",
    });

    setSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      setShake((s) => s + 1);
      return;
    }

    setSent(true);
  };

  const reset = () => {
    setSent(false);
    setStep(0);
    setState(INITIAL_STATE);
    setError(null);
  };

  if (sent) {
    return (
      <SuccessState
        replyToEmail={state.email.trim()}
        onReset={reset}
      />
    );
  }

  return (
    <form
      id="formulier"
      onSubmit={submit}
      noValidate
      className="relative overflow-hidden rounded-3xl border border-mm-border bg-white/90 p-5 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.25)] backdrop-blur-md sm:p-8"
    >
      <input
        type="text"
        name="companyWebsite"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
        value=""
        readOnly
      />
      {/* subtle decorative glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-32 h-72 w-72 rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(14,165,233,0.22), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-32 h-80 w-80 rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(234,88,12,0.18), transparent 70%)" }}
      />

      <div className="relative">
        <StepIndicator step={step} total={STEP_LABELS.length} labels={STEP_LABELS} />

        <motion.div
          key={shake}
          animate={{ x: shake ? [0, -6, 6, -4, 4, -2, 0] : 0 }}
          transition={{ duration: 0.45 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {step === 0 ? (
              <motion.div
                key="step-0"
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-8"
              >
                <div>
                  <h3 className="text-lg font-extrabold tracking-tight text-mm-text sm:text-xl">
                    Beetje context.
                  </h3>
                  <p className="mt-1 text-sm text-mm-muted">{cfg.intro}</p>
                </div>

                {cfg.tiles.map((group) => {
                  const selected = state[group.key];
                  const cols =
                    group.columns === 2
                      ? "sm:grid-cols-2"
                      : group.columns === 3
                        ? "sm:grid-cols-2 lg:grid-cols-3"
                        : "sm:grid-cols-2";
                  return (
                    <div key={group.key}>
                      <div className="mb-3">
                        <p className="text-sm font-bold text-mm-text">
                          {group.title}
                        </p>
                        <p className="text-xs text-mm-muted">{group.subtitle}</p>
                      </div>
                      <div className={`grid grid-cols-1 gap-3 ${cols}`}>
                        {group.options.map((opt) => (
                          <Tile
                            key={opt.value}
                            option={opt}
                            selected={selected === opt.value}
                            onSelect={() =>
                              patch({ [group.key]: opt.value } as Partial<FormState>)
                            }
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}

                {cfg.extras.includes("huidigeStack") ? (
                  <Field
                    id={pid("huidigeStack")}
                    label="Huidige stack (optioneel)"
                    icon={Layers}
                    hint="Bijv. Shopify + Klaviyo, maatwerk website + HubSpot, Next.js + Vercel."
                  >
                    <input
                      id={pid("huidigeStack")}
                      type="text"
                      value={state.huidigeStack}
                      onChange={(e) => patch({ huidigeStack: e.target.value })}
                      className={inputCls}
                      placeholder="CMS, shop, CRM, automatisering…"
                    />
                  </Field>
                ) : null}
              </motion.div>
            ) : null}

            {step === 1 ? (
              <motion.div
                key="step-1"
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-5"
              >
                <div>
                  <h3 className="text-lg font-extrabold tracking-tight text-mm-text sm:text-xl">
                    Wie ben je?
                  </h3>
                  <p className="mt-1 text-sm text-mm-muted">
                    Zodat we gericht kunnen terugkoppelen. We bellen of mailen in jouw voorkeurskanaal.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field id={pid("naam")} label="Naam" icon={User} required>
                    <input
                      id={pid("naam")}
                      name="naam"
                      type="text"
                      autoComplete="name"
                      required
                      value={state.naam}
                      onChange={(e) => patch({ naam: e.target.value })}
                      className={inputCls}
                      placeholder="Voor- en achternaam"
                    />
                  </Field>
                  <Field id={pid("bedrijf")} label="Bedrijf" icon={Building2}>
                    <input
                      id={pid("bedrijf")}
                      name="bedrijf"
                      type="text"
                      autoComplete="organization"
                      value={state.bedrijf}
                      onChange={(e) => patch({ bedrijf: e.target.value })}
                      className={inputCls}
                      placeholder="Optioneel"
                    />
                  </Field>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field id={pid("email")} label="E-mail" icon={Mail} required>
                    <input
                      id={pid("email")}
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={state.email}
                      onChange={(e) => patch({ email: e.target.value })}
                      className={inputCls}
                      placeholder="jij@bedrijf.nl"
                    />
                  </Field>
                  <Field id={pid("telefoon")} label="Telefoon" icon={Phone}>
                    <input
                      id={pid("telefoon")}
                      name="telefoon"
                      type="tel"
                      autoComplete="tel"
                      value={state.telefoon}
                      onChange={(e) => patch({ telefoon: e.target.value })}
                      className={inputCls}
                      placeholder="+31 …"
                    />
                  </Field>
                </div>

                {cfg.extras.includes("websiteUrl") ? (
                  <Field
                    id={pid("websiteUrl")}
                    label="Website of shop-URL"
                    icon={Link2}
                    hint="Scheelt ons flink voorwerk. Check ook subpagina’s."
                  >
                    <input
                      id={pid("websiteUrl")}
                      name="url"
                      type="url"
                      inputMode="url"
                      value={state.websiteUrl}
                      onChange={(e) => patch({ websiteUrl: e.target.value })}
                      className={inputCls}
                      placeholder="https://…"
                    />
                  </Field>
                ) : null}

                <SummaryPreview state={state} variant={variant} compact />
              </motion.div>
            ) : null}

            {step === 2 ? (
              <motion.div
                key="step-2"
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-5"
              >
                <div>
                  <h3 className="text-lg font-extrabold tracking-tight text-mm-text sm:text-xl">
                    Vertel je verhaal.
                  </h3>
                  <p className="mt-1 text-sm text-mm-muted">
                    Hoe concreter, hoe beter we kunnen voorbereiden.
                  </p>
                </div>

                <Field
                  id={pid("bericht")}
                  label="Jouw bericht"
                  icon={MessageCircle}
                  required
                >
                  <textarea
                    id={pid("bericht")}
                    name="bericht"
                    rows={8}
                    required
                    value={state.bericht}
                    onChange={(e) => patch({ bericht: e.target.value })}
                    className={inputCls + " resize-none"}
                    placeholder={cfg.messagePlaceholder}
                  />
                </Field>

                <LiveMailPreview
                  to={businessEmail}
                  subject={mailSubject}
                  body={mailBody}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {error ? (
            <motion.div
              key="err"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mt-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50/80 px-3 py-2.5 text-sm font-medium text-red-700"
              role="alert"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
              <span>{error}</span>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={prev}
            disabled={step === 0}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-bold text-mm-text transition hover:bg-mm-border/40 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Terug
          </button>

          {step < 2 ? (
            <button
              type="button"
              onClick={next}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-mm-text px-6 py-3.5 text-sm font-bold text-white shadow-[0_12px_40px_-8px_rgba(15,23,42,0.5)] transition hover:bg-mm-sky-deep"
            >
              <span className="relative z-[1]">Volgende</span>
              <ArrowRight className="relative z-[1] size-4 transition-transform duration-300 group-hover:translate-x-1" />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 -left-[30%] w-[40%] -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-all duration-700 group-hover:left-[110%] group-hover:opacity-100"
              />
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-7 py-4 text-sm font-extrabold text-white shadow-[0_18px_48px_-10px_rgba(234,88,12,0.55)] transition disabled:cursor-not-allowed disabled:opacity-70"
              style={{
                background:
                  "linear-gradient(120deg, var(--mm-accent) 0%, #f97316 45%, var(--mm-sky-deep) 100%)",
                backgroundSize: "200% 100%",
              }}
            >
              <span className="relative z-[1] inline-flex items-center gap-2">
                <Send className="size-4" aria-hidden />
                {submitting ? "Versturen…" : cfg.submitLabel}
              </span>
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 -left-[30%] w-[40%] -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition-all duration-700 group-hover:left-[110%] group-hover:opacity-100"
              />
            </button>
          )}
        </div>

        <p className="mt-5 flex items-center justify-center gap-2 text-center text-[11px] text-mm-muted">
          <Handshake className="size-3.5" aria-hidden />
          Je aanvraag gaat direct naar {businessEmail}. Geen mailapp nodig.
        </p>
      </div>
    </form>
  );
}

// ─── LIVE PREVIEW COMPONENTS ──────────────────────────────────────────────

interface LiveMailPreviewProps {
  readonly to: string;
  readonly subject: string;
  readonly body: string;
}

function LiveMailPreview({ to, subject, body }: LiveMailPreviewProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-mm-border bg-gradient-to-b from-white to-mm-bg">
      <div className="flex items-center gap-2 border-b border-mm-border/80 bg-mm-surface px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-red-400/70" aria-hidden />
        <span className="size-2.5 rounded-full bg-amber-400/70" aria-hidden />
        <span className="size-2.5 rounded-full bg-emerald-400/70" aria-hidden />
        <p className="ml-2 text-[11px] font-semibold uppercase tracking-widest text-mm-muted">
          Live mailpreview
        </p>
      </div>
      <div className="space-y-2 px-4 py-3 text-[12.5px]">
        <p>
          <span className="font-bold text-mm-muted">Aan: </span>
          <span className="text-mm-text">{to}</span>
        </p>
        <p>
          <span className="font-bold text-mm-muted">Onderwerp: </span>
          <span className="text-mm-text">{subject}</span>
        </p>
        <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap rounded-lg bg-white/70 p-3 font-sans text-[12.5px] leading-relaxed text-mm-text">
          {body}
        </pre>
      </div>
    </div>
  );
}

interface SummaryPreviewProps {
  readonly state: FormState;
  readonly variant: ConversionFormVariant;
  readonly compact?: boolean;
}

function SummaryPreview({ state, variant, compact }: SummaryPreviewProps) {
  const cfg = VARIANTS[variant];
  const items: { label: string; value: string }[] = [];
  for (const group of cfg.tiles) {
    const v = state[group.key];
    const label = findLabel(group.options, v);
    if (label) items.push({ label: group.title.replace(/\?$/, ""), value: label });
  }
  if (items.length === 0) return null;

  return (
    <div
      className={[
        "flex flex-wrap gap-2 rounded-2xl border border-dashed border-mm-border bg-mm-bg/70 p-3",
        compact ? "" : "sm:p-4",
      ].join(" ")}
    >
      <span className="text-[11px] font-bold uppercase tracking-widest text-mm-muted">
        Gekozen:
      </span>
      {items.map((i) => (
        <span
          key={i.label}
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11.5px] font-semibold text-mm-text shadow-[0_1px_0_rgba(15,23,42,0.05)]"
        >
          <span className="text-mm-muted">{i.label}:</span>
          <span>{i.value}</span>
        </span>
      ))}
    </div>
  );
}
