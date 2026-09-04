"use client";

import { useState } from "react";
import type { ClinicalAtelierModel } from "@/components/templates/clinical-atelier/clinicalAtelierModel";

interface Props {
  open: boolean;
  onClose: () => void;
  model: ClinicalAtelierModel;
}

const STEP1 = [
  { id: "acne", label: "Acne & onzuiverheden", icon: "⚡" },
  { id: "pigment", label: "Pigmentvlekken", icon: "☀️" },
  { id: "aging", label: "Rimpels & veroudering", icon: "🕰" },
  { id: "droog", label: "Droge of doffe huid", icon: "💧" },
  { id: "littekens", label: "Littekens & poriën", icon: "🔬" },
  { id: "glow", label: "Gewoon stralender", icon: "✨" },
];

const STEP2 = [
  { id: "snel", label: "Snel zichtbaar resultaat", sub: "Binnen 2–4 weken" },
  { id: "langdurig", label: "Langdurige verbetering", sub: "Traject van 3–6 maanden" },
  { id: "preventie", label: "Preventie & onderhoud", sub: "Mijn huid gezond houden" },
];

export function AtelierQuizModal({ open, onClose, model }: Props) {
  const [step, setStep] = useState(0);

  const reset = () => {
    setStep(0);
  };

  const close = () => {
    reset();
    onClose();
  };

  if (!open) return null;

  const featured = model.treatments[0];
  const expert = model.experts[0];

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={close} aria-hidden="true" />

      <div className="relative w-full overflow-hidden rounded-t-[28px] bg-warm-white shadow-2xl sm:max-w-[520px] sm:rounded-[28px]">
        <div className="h-1 bg-light-grey">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: step < 2 ? `${((step + 1) / 3) * 100}%` : "100%" }}
          />
        </div>

        <div className="px-8 pt-7 pb-8">
          <button
            type="button"
            onClick={close}
            className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full text-muted-text transition-colors hover:bg-light-grey"
            aria-label="Sluiten"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M2 2l10 10M12 2L2 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {step === 0 && (
            <>
              <p className="mb-2 text-[10px] font-semibold tracking-[0.16em] text-muted-text uppercase">
                Vraag 1 van 2
              </p>
              <h2 className="mb-1 text-[22px] leading-tight font-extrabold text-soft-black">
                Wat is je voornaamste huidzorg?
              </h2>
              <p className="mb-6 text-[13px] text-muted-text">
                Kies wat het beste past. Daarna sturen we je door naar contact.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {STEP1.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-3 rounded-[14px] border-2 border-border-subtle p-4 text-left transition-all hover:border-primary hover:bg-primary/[0.03]"
                  >
                    <span className="text-[20px] leading-none">{opt.icon}</span>
                    <span className="text-[12.5px] leading-tight font-semibold text-soft-black">
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <p className="mb-2 text-[10px] font-semibold tracking-[0.16em] text-muted-text uppercase">
                Vraag 2 van 2
              </p>
              <h2 className="mb-1 text-[22px] leading-tight font-extrabold text-soft-black">
                Wat is je behandeldoel?
              </h2>
              <p className="mb-6 text-[13px] text-muted-text">
                Zo weten we welke aanpak en intensiteit logisch is voor jouw huid.
              </p>
              <div className="flex flex-col gap-2">
                {STEP2.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setStep(2)}
                    className="group flex items-center justify-between rounded-[14px] border-2 border-border-subtle p-4 text-left transition-all hover:border-primary hover:bg-primary/[0.03]"
                  >
                    <div>
                      <p className="text-[13.5px] font-semibold text-soft-black">{opt.label}</p>
                      <p className="text-[11.5px] text-muted-text">{opt.sub}</p>
                    </div>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      className="shrink-0 text-muted-text transition-colors group-hover:text-primary"
                      aria-hidden="true"
                    >
                      <path
                        d="M2 7h10M8 3l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="mb-5 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                  <svg width="12" height="12" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                    <path
                      d="M2 5l2 2 4-4"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="text-[12px] font-semibold text-primary">Je eerste richting staat klaar</p>
              </div>

              <h2 className="mb-1 text-[20px] leading-tight font-extrabold text-soft-black">
                Waarschijnlijk passend bij jou
              </h2>
              <p className="mb-5 text-[22px] font-extrabold text-primary">
                {featured?.name ?? "Huidconsult"}
              </p>

              <p className="mb-5 text-[13px] leading-[1.65] text-muted-text">
                {featured?.description ??
                  `Plan een intake bij ${model.studioName}. We kijken naar je huid en stellen een plan op dat past bij je doel.`}
              </p>

              {expert ? (
                <div className="mb-6 flex items-center gap-3 rounded-[14px] bg-[#F4F4F2] p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[13px] font-extrabold text-primary">
                    {expert.name
                      .split(" ")
                      .slice(1, 3)
                      .map((p) => p[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-soft-black">{expert.name}</p>
                    <p className="text-[11px] text-muted-text">
                      {expert.role}
                      {model.city ? ` · ${model.city}` : ""}
                    </p>
                  </div>
                  {featured?.from ? (
                    <div className="ml-auto text-right">
                      <p className="text-[11px] text-muted-text">Vanaf</p>
                      <p className="text-[15px] font-extrabold text-primary">{featured.from}</p>
                    </div>
                  ) : null}
                </div>
              ) : null}

              <div className="flex gap-3">
                <a
                  href="#contact"
                  onClick={close}
                  className="flex h-[44px] flex-1 items-center justify-center gap-2 rounded-full bg-primary text-[13px] font-semibold text-white transition-colors hover:bg-primary-dark"
                >
                  Plan een afspraak
                </a>
                <button
                  type="button"
                  onClick={reset}
                  className="flex h-[44px] items-center justify-center rounded-full border border-border-subtle px-4 text-[12px] font-semibold text-muted-text transition-colors hover:text-charcoal"
                >
                  Opnieuw
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
