"use client";

import Link from "next/link";
import { useState } from "react";
import FigmaHeading from "@/components/figma/FigmaHeading";
import DeLijn from "@/components/ui/DeLijn";
import { TextField } from "@/components/ui/FormField";
import { INTAKE_OPENING } from "@/components/templates/IsHetNodigTemplate";
import { figmaBtnMint, figmaBtnPrimary } from "@/lib/figma-home-layout";
import {
  figmaBody,
  figmaInnerContainer,
  figmaLabel,
  figmaSection,
} from "@/lib/figma-inner-layout";

const CONCERNS = [
  { label: "Acne", href: "/huidproblemen/acne" },
  { label: "Pigmentvlekken", href: "/huidproblemen/pigmentvlekken" },
  { label: "Roodheid of rosacea", href: "/huidproblemen/rosacea" },
  { label: "Laserontharing", href: "/laserontharing" },
  { label: "Iets anders", href: "/huidproblemen/symptoomzoeker" },
] as const;

const TOTAL_STEPS = 3;

const choiceBtn =
  "flex min-h-[56px] w-full items-center justify-between rounded-[1.5rem] border border-[#dce8d9] bg-white px-5 text-left text-[15px] font-medium text-[#17372a] shadow-[0_8px_32px_rgba(15,45,28,.04)] transition hover:-translate-y-0.5 hover:border-[#95c592] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#286943] motion-reduce:transition-none motion-reduce:hover:translate-y-0";

export type IntakeTemplateProps = {
  whatsappHref: string;
  bookingHref?: string;
};

function progressDot(step: number): number {
  if (step <= 0) return 0;
  return Math.round((step / TOTAL_STEPS) * 100);
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function IntakeTemplate({ whatsappHref, bookingHref }: IntakeTemplateProps) {
  const [step, setStep] = useState(0);
  const [concern, setConcern] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>();

  function submitEmail() {
    if (!isValidEmail(email)) {
      setEmailError("Dit e-mailadres mist een @ of een domein.");
      return;
    }
    setEmailError(undefined);
    setStep(3);
  }

  return (
    <main className="pb-20">
      <div className={`${figmaInnerContainer} ${figmaSection} mx-auto max-w-xl`}>
        {step === 0 ? (
          <div data-reveal>
            <p className={figmaLabel}>Behandeling Nul</p>
            <FigmaHeading as="h1" size="hero" text="Is het *nodig*?" className="mt-4" />
            <p className="mt-7 text-lg leading-relaxed text-[#17372a] [font-family:var(--font-accent)] italic font-light md:text-xl">
              {INTAKE_OPENING}
            </p>
            <p className={`mt-5 ${figmaBody}`}>
              Duurt ongeveer 4 minuten. Gratis. Zonder verplichting om te boeken.
            </p>
            <div className="mt-8">
              <DeLijn length="full" dot={progressDot(1)} />
            </div>
            <div className="mt-8">
              <button type="button" onClick={() => setStep(1)} className={figmaBtnPrimary}>
                Start de intake ↗
              </button>
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div data-reveal>
            <p className={figmaLabel}>Behandeling Nul · je concern</p>
            <FigmaHeading as="h2" size="section" text="Wat speelt er bij *jouw* huid?" className="mt-4" />
            <p className={`mt-5 ${figmaBody}`}>
              Kies wat het dichtst in de buurt komt. U kunt het later aanpassen.
            </p>
            <div className="mt-6">
              <DeLijn length="full" dot={progressDot(2)} />
            </div>
            <ul className="mt-8 flex flex-col gap-3">
              {CONCERNS.map((c) => (
                <li key={c.label}>
                  <button
                    type="button"
                    onClick={() => {
                      setConcern(c.label);
                      setStep(2);
                    }}
                    className={choiceBtn}
                  >
                    {c.label}
                    <span className="text-[#286943]" aria-hidden="true">
                      →
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-[14px] font-medium text-[#286943] underline-offset-4 hover:underline"
              >
                Weet ik nog niet, ga verder
              </button>
            </p>
            <div className="mt-6">
              <button type="button" onClick={() => setStep(0)} className={figmaBtnMint}>
                Terug
              </button>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div data-reveal>
            <p className={figmaLabel}>Behandeling Nul · contact</p>
            <FigmaHeading as="h2" size="section" text="Waar mogen we u *bereiken*?" className="mt-4" />
            {concern ? (
              <p className={`mt-4 ${figmaBody}`}>Je keuze: {concern}</p>
            ) : null}
            <div className="mt-6">
              <DeLijn length="full" dot={progressDot(3)} />
            </div>
            <div className="mt-8 flex flex-col gap-6">
              <TextField
                id="intake-email"
                label="E-mailadres"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError(undefined);
                }}
                placeholder="naam@voorbeeld.nl"
                hint="Zodat we je uitkomst kunnen sturen."
                error={emailError}
              />
              <div className="flex flex-col gap-3">
                <button type="button" onClick={submitEmail} className={figmaBtnPrimary}>
                  Bekijk mijn uitkomst ↗
                </button>
                <button type="button" onClick={() => setStep(1)} className={figmaBtnMint}>
                  Terug
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div data-reveal>
            <FigmaHeading as="h2" size="section" text="Je *uitkomst* komt eraan" />
            <p className={`mt-6 ${figmaBody}`}>
              Bedankt. De volledige intake met foto-upload en Salonized-koppeling volgt in fase 2.
              Tot die tijd: lees meer over je onderwerp of stel je vraag via WhatsApp.
            </p>
            <div className="mt-6">
              <DeLijn length="full" dot={100} />
            </div>
            <div className="mt-8 flex flex-col items-start gap-3">
              {bookingHref ? (
                <Link
                  href={bookingHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={figmaBtnPrimary}
                >
                  Plan je startmoment ↗
                </Link>
              ) : null}
              {concern ? (
                <Link
                  href={CONCERNS.find((c) => c.label === concern)?.href ?? "/huidproblemen"}
                  className={figmaBtnMint}
                >
                  Lees meer over {concern.toLowerCase()} ↗
                </Link>
              ) : null}
              <Link
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14px] font-medium text-[#286943] underline-offset-4 hover:underline"
              >
                Stel je vraag via WhatsApp
              </Link>
              <Link
                href="/"
                className="text-[14px] font-medium text-[#5f7765] underline-offset-4 hover:underline"
              >
                Terug naar home
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
