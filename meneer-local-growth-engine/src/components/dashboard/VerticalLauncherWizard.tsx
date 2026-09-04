"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Badge, SectionTitle } from "@/components/dashboard/ui";
import { getBlueprintDraft } from "@/lib/verticals/verticalLauncherBlueprint";
import {
  WIZARD_STEPS,
  inboundSourceFromSlug,
  landingPathFromName,
  slugifyVerticalInput,
  type VerticalWizardDraft,
  type WizardStepId,
} from "@/lib/verticals/verticalLauncherWizard.shared";

interface CatalogOption {
  slug: string;
  name: string;
  status: "ACTIVE" | "COMING_SOON";
  landingLive?: boolean;
  isBlueprint?: boolean;
  presetAvailable?: boolean;
}

const NL_REGIONS = [
  "Gelderland",
  "Utrecht",
  "Noord-Holland",
  "Zuid-Holland",
  "Noord-Brabant",
  "Limburg",
  "Overijssel",
  "Friesland",
  "Groningen",
  "Drenthe",
  "Flevoland",
  "Zeeland",
];

function StepIndicator({ current }: { current: WizardStepId }) {
  const index = WIZARD_STEPS.findIndex((s) => s.id === current);
  return (
    <ol className="mb-8 flex flex-wrap gap-2">
      {WIZARD_STEPS.map((step, i) => {
        const active = i === index;
        const done = i < index;
        return (
          <li
            key={step.id}
            className={`flex items-center gap-2 border px-3 py-2 text-[11px] font-bold uppercase tracking-[0.1em] ${
              active
                ? "border-[#FF5722] bg-[#FF5722]/10 text-[#C2410C]"
                : done
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-mm-border bg-white text-slate-400"
            }`}
          >
            <span>{step.label}</span>
          </li>
        );
      })}
    </ol>
  );
}

function TermsEditor({
  terms,
  onChange,
}: {
  terms: string[];
  onChange: (terms: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  const addTerm = () => {
    const value = draft.trim();
    if (!value || terms.includes(value)) return;
    onChange([...terms, value]);
    setDraft("");
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {terms.map((term) => (
          <button
            key={term}
            type="button"
            onClick={() => onChange(terms.filter((t) => t !== term))}
            className="group inline-flex items-center gap-2 border border-mm-border bg-mm-surface px-3 py-1.5 text-sm text-slate-700 hover:border-rose-200 hover:bg-rose-50"
            title="Klik om te verwijderen"
          >
            {term}
            <span className="text-xs text-slate-400 group-hover:text-rose-600">×</span>
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTerm();
            }
          }}
          placeholder="Nieuwe zoekterm…"
          className="flex-1 border border-mm-border px-3 py-2 text-sm outline-none focus:border-[#FF5722]"
        />
        <button
          type="button"
          onClick={addTerm}
          className="bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800"
        >
          Toevoegen
        </button>
      </div>
      <p className="text-xs text-slate-500">
        Minimaal 3 terms. Skin-clinics blueprint gebruikt title-intents per term in discovery.
      </p>
    </div>
  );
}

export function VerticalLauncherWizard({
  catalog,
  blockedSlugs,
}: {
  catalog: CatalogOption[];
  blockedSlugs: string[];
}) {
  const router = useRouter();
  const [step, setStep] = useState<WizardStepId>("branche");
  const [draft, setDraft] = useState<VerticalWizardDraft>(() => getBlueprintDraft("dentists"));
  const [customMode, setCustomMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [launchDiscovery, setLaunchDiscovery] = useState(true);
  const [discoveryMode, setDiscoveryMode] = useState<"QUICK" | "STANDARD" | "DEEP">("STANDARD");
  const [result, setResult] = useState<{
    slug: string;
    citySlug: string;
    discoveryRunId?: string;
    checklist: string[];
    migrationSnippet: string;
  } | null>(null);

  const stepMeta = WIZARD_STEPS.find((s) => s.id === step)!;

  const slugBlocked = blockedSlugs.includes(draft.slug);

  const canContinue = useMemo(() => {
    switch (step) {
      case "branche":
        return draft.name.trim().length >= 2 && draft.slug.length >= 2 && !slugBlocked;
      case "discovery":
        return draft.discoveryTerms.length >= 3;
      case "landing":
        return (
          /^\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(draft.landingPath) &&
          /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(draft.inboundSource)
        );
      case "templates":
        return draft.templateVariants.length >= 1;
      case "pilot":
        return (
          draft.pilotCity.name.trim().length >= 2 && draft.pilotCity.region.trim().length >= 2
        );
      default:
        return false;
    }
  }, [step, draft, slugBlocked]);

  const selectCatalog = (slug: string) => {
    if (slug === "skin-clinics") {
      setDraft(getBlueprintDraft("skin-clinics"));
      setCustomMode(false);
      return;
    }
    if (slug === "custom") {
      setCustomMode(true);
      setDraft({
        ...getBlueprintDraft("dentists"),
        catalogSlug: undefined,
        slug: "",
        name: "",
        description: "",
      });
      return;
    }
    setCustomMode(false);
    setDraft(getBlueprintDraft(slug));
  };

  const goNext = () => {
    const idx = WIZARD_STEPS.findIndex((s) => s.id === step);
    if (idx < WIZARD_STEPS.length - 1) {
      setStep(WIZARD_STEPS[idx + 1]!.id);
    }
  };

  const goBack = () => {
    const idx = WIZARD_STEPS.findIndex((s) => s.id === step);
    if (idx > 0) setStep(WIZARD_STEPS[idx - 1]!.id);
  };

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/verticals/wizard/provision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          catalogSlug: draft.catalogSlug,
          slug: draft.slug,
          name: draft.name,
          description: draft.description,
          blueprintSlug: draft.blueprintSlug,
          discoveryTerms: draft.discoveryTerms,
          categoryHints: draft.categoryHints,
          negativeNamePatterns: draft.negativeNamePatterns,
          landingPath: draft.landingPath,
          inboundSource: draft.inboundSource,
          landingLive: draft.landingLive,
          templateVariants: draft.templateVariants,
          pilotCity: draft.pilotCity,
          businessLabel: draft.businessLabel,
          businessNoun: draft.businessNoun,
          editionLabel: draft.editionLabel,
          launchDiscovery,
          discoveryMode,
        }),
      });
      const json = (await response.json()) as {
        ok: boolean;
        error?: string;
        result?: {
          slug: string;
          citySlug: string;
          discoveryRunId?: string;
          scaffold: { checklist: string[]; migrationSnippet: string };
        };
      };
      if (!json.ok || !json.result) {
        throw new Error(json.error ?? "Provision mislukt");
      }
      setResult({
        slug: json.result.slug,
        citySlug: json.result.citySlug,
        discoveryRunId: json.result.discoveryRunId,
        checklist: json.result.scaffold.checklist,
        migrationSnippet: json.result.scaffold.migrationSnippet,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Provision mislukt");
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div>
        <SectionTitle
          eyebrow="Vertical Launcher"
          title="Vertical staat klaar"
          description={`${result.slug} is provisioned. Discovery draait${result.discoveryRunId ? "" : " nog niet"}.`}
        />
        <div className="space-y-4 border border-emerald-200 bg-emerald-50/60 p-6">
          <p className="text-sm font-semibold text-emerald-900">
            Pilotstad: {draft.pilotCity.name} · slug {result.citySlug}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/dashboard/discovery/new?vertical=${result.slug}&city=${encodeURIComponent(draft.pilotCity.name)}`}
              className="bg-[#FF5722] px-4 py-2 text-sm font-bold text-white hover:bg-[#E64A19]"
            >
              Discovery launcher
            </Link>
            <Link
              href="/dashboard/pipeline"
              className="border border-mm-border bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-mm-surface"
            >
              Pipeline kanban
            </Link>
            <Link
              href="/dashboard/leads"
              className="border border-mm-border bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-mm-surface"
            >
              Leads
            </Link>
          </div>
        </div>

        <section className="mt-6 border border-mm-border bg-white p-5 shadow-mm-card">
          <h2 className="text-sm font-extrabold text-slate-900">Nog even handmatig</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
            {result.checklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mt-4 border border-mm-border bg-white p-5 shadow-mm-card">
          <h2 className="text-sm font-extrabold text-slate-900">Optionele SQL seed</h2>
          <pre className="mt-3 overflow-x-auto bg-slate-950 p-4 text-xs text-emerald-100">
            {result.migrationSnippet}
          </pre>
        </section>

        <button
          type="button"
          onClick={() => router.refresh()}
          className="mt-6 text-sm font-semibold text-[#C2410C] hover:underline"
        >
          Nog een vertical starten
        </button>
      </div>
    );
  }

  return (
    <div>
      <SectionTitle
        eyebrow="Vertical Launcher"
        title="Nieuwe branche opzetten"
        description="Stap voor stap van branche tot pilotstad. Skin-clinics pack is het blueprint voor discovery, templates en outreach."
      />

      <StepIndicator current={step} />

      <div className="border border-mm-border bg-white p-6 shadow-mm-card">
        <h2 className="text-lg font-extrabold tracking-tight text-slate-900">{stepMeta.title}</h2>

        {step === "branche" ? (
          <div className="mt-6 space-y-6">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {catalog.map((entry) => {
                const selected = !customMode && draft.catalogSlug === entry.slug;
                const isBlueprintOnly = entry.slug === "skin-clinics";
                const disabled = entry.status === "ACTIVE";
                return (
                  <button
                    key={entry.slug}
                    type="button"
                    disabled={disabled && !isBlueprintOnly}
                    onClick={() => {
                      if (isBlueprintOnly) {
                        const blueprint = getBlueprintDraft("skin-clinics");
                        setDraft((prev) => ({
                          ...prev,
                          blueprintSlug: "skin-clinics",
                          discoveryTerms: blueprint.discoveryTerms,
                          categoryHints: blueprint.categoryHints,
                          negativeNamePatterns: blueprint.negativeNamePatterns,
                          templateVariants: blueprint.templateVariants,
                          businessLabel: prev.businessLabel || blueprint.businessLabel,
                          editionLabel: prev.editionLabel || blueprint.editionLabel,
                        }));
                        return;
                      }
                      selectCatalog(entry.slug);
                    }}
                    className={`border p-4 text-left transition ${
                      selected
                        ? "border-[#FF5722] bg-[#FF5722]/5"
                        : "border-mm-border hover:border-slate-300"
                    } ${disabled && !isBlueprintOnly ? "cursor-not-allowed opacity-50" : ""}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-slate-900">{entry.name}</p>
                      <Badge tone={entry.status === "ACTIVE" ? "success" : "neutral"}>
                        {entry.status === "ACTIVE" ? "Live" : "Binnenkort"}
                      </Badge>
                    </div>
                    {entry.isBlueprint ? (
                      <p className="mt-2 text-xs text-[#C2410C]">
                        Blueprint defaults toepassen op huidige branche
                      </p>
                    ) : null}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => selectCatalog("custom")}
                className={`border p-4 text-left transition ${
                  customMode
                    ? "border-[#FF5722] bg-[#FF5722]/5"
                    : "border-mm-border hover:border-slate-300"
                }`}
              >
                <p className="font-bold text-slate-900">Nieuwe branche</p>
                <p className="mt-2 text-xs text-slate-500">Eigen slug en naam, zelfde blueprint</p>
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Naam
                </span>
                <input
                  value={draft.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setDraft((prev) => ({
                      ...prev,
                      name,
                      slug: customMode ? slugifyVerticalInput(name) : prev.slug,
                      landingPath: customMode ? landingPathFromName(name) : prev.landingPath,
                      inboundSource: customMode
                        ? inboundSourceFromSlug(slugifyVerticalInput(name))
                        : prev.inboundSource,
                    }));
                  }}
                  className="border border-mm-border px-3 py-2 text-sm outline-none focus:border-[#FF5722]"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Slug
                </span>
                <input
                  value={draft.slug}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      slug: slugifyVerticalInput(e.target.value),
                      inboundSource: inboundSourceFromSlug(slugifyVerticalInput(e.target.value)),
                    }))
                  }
                  disabled={!customMode}
                  className="border border-mm-border px-3 py-2 text-sm outline-none focus:border-[#FF5722] disabled:bg-mm-surface"
                />
                {slugBlocked ? (
                  <span className="text-xs text-rose-600">
                    Deze slug bestaat al als live code pack. Kies een andere slug.
                  </span>
                ) : null}
              </label>
            </div>

            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Omschrijving
              </span>
              <textarea
                value={draft.description}
                onChange={(e) => setDraft((prev) => ({ ...prev, description: e.target.value }))}
                rows={2}
                className="border border-mm-border px-3 py-2 text-sm outline-none focus:border-[#FF5722]"
              />
            </label>

            <p className="text-xs text-slate-500">
              Blueprint: <strong>{draft.blueprintSlug}</strong> (qualify, scoring, acquisition fit)
            </p>
          </div>
        ) : null}

        {step === "discovery" ? (
          <div className="mt-6 space-y-4">
            <TermsEditor
              terms={draft.discoveryTerms}
              onChange={(discoveryTerms) => setDraft((prev) => ({ ...prev, discoveryTerms }))}
            />
          </div>
        ) : null}

        {step === "landing" ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 sm:col-span-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Landing path (meneermarketing.nl)
              </span>
              <input
                value={draft.landingPath}
                onChange={(e) => setDraft((prev) => ({ ...prev, landingPath: e.target.value }))}
                className="border border-mm-border px-3 py-2 text-sm outline-none focus:border-[#FF5722]"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Inbound source
              </span>
              <input
                value={draft.inboundSource}
                onChange={(e) => setDraft((prev) => ({ ...prev, inboundSource: e.target.value }))}
                className="border border-mm-border px-3 py-2 text-sm outline-none focus:border-[#FF5722]"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Business label
              </span>
              <input
                value={draft.businessLabel}
                onChange={(e) => setDraft((prev) => ({ ...prev, businessLabel: e.target.value }))}
                className="border border-mm-border px-3 py-2 text-sm outline-none focus:border-[#FF5722]"
              />
            </label>
            <label className="flex items-center gap-2 sm:col-span-2">
              <input
                type="checkbox"
                checked={draft.landingLive}
                onChange={(e) => setDraft((prev) => ({ ...prev, landingLive: e.target.checked }))}
                className="accent-[#FF5722]"
              />
              <span className="text-sm text-slate-600">Landing live op meneermarketing.nl</span>
            </label>
          </div>
        ) : null}

        {step === "templates" ? (
          <div className="mt-6 space-y-3">
            {draft.templateVariants.map((row, index) => (
              <div
                key={row.variant}
                className="grid gap-3 border border-mm-border bg-mm-surface/40 p-4 sm:grid-cols-3"
              >
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    Variant
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-800">{row.variant}</p>
                </div>
                <label className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    Naam
                  </span>
                  <input
                    value={row.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setDraft((prev) => ({
                        ...prev,
                        templateVariants: prev.templateVariants.map((t, i) =>
                          i === index ? { ...t, name } : t
                        ),
                      }));
                    }}
                    className="border border-mm-border bg-white px-3 py-2 text-sm outline-none focus:border-[#FF5722]"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    Omschrijving
                  </span>
                  <input
                    value={row.description ?? ""}
                    onChange={(e) => {
                      const description = e.target.value;
                      setDraft((prev) => ({
                        ...prev,
                        templateVariants: prev.templateVariants.map((t, i) =>
                          i === index ? { ...t, description } : t
                        ),
                      }));
                    }}
                    className="border border-mm-border bg-white px-3 py-2 text-sm outline-none focus:border-[#FF5722]"
                  />
                </label>
              </div>
            ))}
          </div>
        ) : null}

        {step === "pilot" ? (
          <div className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Stad
                </span>
                <input
                  value={draft.pilotCity.name}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      pilotCity: { ...prev.pilotCity, name: e.target.value },
                    }))
                  }
                  className="border border-mm-border px-3 py-2 text-sm outline-none focus:border-[#FF5722]"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Land
                </span>
                <select
                  value={draft.pilotCity.countryCode}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      pilotCity: {
                        ...prev.pilotCity,
                        countryCode: e.target.value as "NL" | "BE",
                      },
                    }))
                  }
                  className="border border-mm-border bg-white px-3 py-2 text-sm outline-none focus:border-[#FF5722]"
                >
                  <option value="NL">Nederland</option>
                  <option value="BE">België</option>
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Regio
                </span>
                <select
                  value={draft.pilotCity.region}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      pilotCity: { ...prev.pilotCity, region: e.target.value },
                    }))
                  }
                  className="border border-mm-border bg-white px-3 py-2 text-sm outline-none focus:border-[#FF5722]"
                >
                  {NL_REGIONS.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Radius (km)
                </span>
                <input
                  type="number"
                  min={5}
                  max={30}
                  value={draft.pilotCity.radiusKm}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      pilotCity: {
                        ...prev.pilotCity,
                        radiusKm: Number(e.target.value) || 12,
                      },
                    }))
                  }
                  className="border border-mm-border px-3 py-2 text-sm outline-none focus:border-[#FF5722]"
                />
              </label>
            </div>

            <div className="border border-mm-border bg-mm-surface/50 p-4 text-sm text-slate-600">
              <p className="font-bold text-slate-900">Samenvatting</p>
              <ul className="mt-2 space-y-1">
                <li>
                  <strong>{draft.name}</strong> ({draft.slug})
                </li>
                <li>{draft.discoveryTerms.length} discovery terms</li>
                <li>
                  Landing {draft.landingPath} · inbound {draft.inboundSource}
                </li>
                <li>{draft.templateVariants.length} templates</li>
                <li>
                  Pilot {draft.pilotCity.name}, {draft.pilotCity.region}
                </li>
              </ul>
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={launchDiscovery}
                onChange={(e) => setLaunchDiscovery(e.target.checked)}
                className="accent-[#FF5722]"
              />
              <span className="text-sm text-slate-700">Direct eerste discovery starten</span>
            </label>

            {launchDiscovery ? (
              <label className="flex flex-col gap-1 max-w-xs">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Discovery mode
                </span>
                <select
                  value={discoveryMode}
                  onChange={(e) =>
                    setDiscoveryMode(e.target.value as "QUICK" | "STANDARD" | "DEEP")
                  }
                  className="border border-mm-border bg-white px-3 py-2 text-sm outline-none focus:border-[#FF5722]"
                >
                  <option value="QUICK">Quick</option>
                  <option value="STANDARD">Standard</option>
                  <option value="DEEP">Deep</option>
                </select>
              </label>
            ) : null}
          </div>
        ) : null}

        {error ? <p className="mt-4 text-sm font-semibold text-rose-700">{error}</p> : null}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-mm-border pt-5">
          <button
            type="button"
            onClick={goBack}
            disabled={step === "branche"}
            className="border border-mm-border px-4 py-2 text-sm font-bold text-slate-600 disabled:opacity-40"
          >
            Terug
          </button>

          {step === "pilot" ? (
            <button
              type="button"
              onClick={() => void submit()}
              disabled={!canContinue || loading}
              className="bg-[#FF5722] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#E64A19] disabled:opacity-50"
            >
              {loading ? "Bezig…" : "Vertical lanceren"}
            </button>
          ) : (
            <button
              type="button"
              onClick={goNext}
              disabled={!canContinue}
              className="bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-50"
            >
              Volgende
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
