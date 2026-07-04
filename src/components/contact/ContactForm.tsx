"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { submitContactForm } from "@/lib/contact-submission";

interface FormState {
  naam: string;
  bedrijf: string;
  email: string;
  telefoon: string;
  onderwerp: string;
  bericht: string;
}

const ONDERWERPEN = [
  { value: "", label: "Kies een onderwerp" },
  { value: "intake", label: "Intake / kennismaking" },
  { value: "groeiscan", label: "Groeiscan" },
  { value: "web-shop", label: "Website of webshop" },
  { value: "marketing", label: "SEO, ads of groei" },
  { value: "automatisering", label: "Automatisering & koppelingen" },
  { value: "design", label: "Branding / design" },
  { value: "anders", label: "Iets anders" },
] as const;

const COACH_BY_ONDERWERP: Record<string, string> = {
  "": "Vertel het gewoon. Geen salespitch nodig. Ik lees alles zelf.",
  intake: "Kennismaken? Top. Hoe concreter je bent, hoe sneller we schakelen.",
  groeiscan: "Groeiscan kan. Maar dit formulier werkt ook. Jij kiest.",
  "web-shop": "Website, Shopify of portaal? Stuur je URL mee als je die hebt.",
  marketing: "SEO, Google Ads, Meta Ads? Vertel waar je nu zit en wat je mist.",
  automatisering: "Welke systemen moeten met elkaar praten? Scheelt mij een detective-ronde.",
  design: "Branding of UX? Foto's, voorbeelden of links helpen enorm.",
  anders: "Iets anders is ook prima. Verras me maar.",
};

const PLACEHOLDER_LINES = [
  "Waar loop je tegenaan? Wat wil je bereiken?",
  "Bijv.: site traag, ads draaien niet, Shopify shop voelt als template…",
  "Links naar je site helpen. Screenshot mag ook. Ik ben niet kieskeurig.",
] as const;

const initial: FormState = {
  naam: "",
  bedrijf: "",
  email: "",
  telefoon: "",
  onderwerp: "",
  bericht: "",
};

export function ContactForm() {
  const reduce = useReducedMotion();
  const [form, setForm] = useState<FormState>(initial);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const coachLine = COACH_BY_ONDERWERP[form.onderwerp] ?? COACH_BY_ONDERWERP[""]!;
  const messageLength = form.bericht.trim().length;
  const clarityHint = useMemo(() => {
    if (messageLength === 0) return "Nog leeg. Geen stress, maar ik kan niks lezen wat er niet staat.";
    if (messageLength < 40) return "Kort. Kan, maar iets meer context helpt mij sneller schakelen.";
    if (messageLength < 140) return "Prima start. URL of cijfer erbij maakt het nóg scherper.";
    return "Dit leest als iemand die weet wat hij wil. Meneer-approved.";
  }, [messageLength]);

  const set =
    (field: keyof FormState) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setError(null);
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!form.naam.trim() || !form.email.trim() || !form.bericht.trim()) {
      setError("Vul minimaal naam, e-mail en bericht in.");
      return;
    }
    if (!form.onderwerp) {
      setError("Kies een onderwerp, dan weten we direct hoe we kunnen helpen.");
      return;
    }
    const label =
      ONDERWERPEN.find((o) => o.value === form.onderwerp)?.label ??
      form.onderwerp;
    const body = [
      `Bericht via meneermarketing.nl/contact`,
      ``,
      `Naam: ${form.naam.trim()}`,
      `Bedrijf: ${form.bedrijf.trim() || ". "}`,
      `E-mail: ${form.email.trim()}`,
      `Telefoon: ${form.telefoon.trim() || ". "}`,
      `Onderwerp: ${label}`,
      ``,
      form.bericht.trim(),
    ].join("\n");

    setSubmitting(true);
    setError(null);

    const result = await submitContactForm({
      source: "contact",
      subject: `[Contact] ${label}. ${form.naam.trim()}`,
      replyToEmail: form.email.trim(),
      replyToName: form.naam.trim(),
      body,
      companyWebsite: "",
    });

    setSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50/80 p-8 text-center">
        <InteractiveLogo className="h-16 w-16" />
        <h3 className="mt-5 text-xl font-extrabold text-slate-900">Bedankt. Ik lees dit zelf.</h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-600">
          Je bericht staat in mijn inbox. Reactie binnen één à twee werkdagen op{" "}
          <strong className="text-slate-900">{form.email.trim()}</strong>.
          Geen automaat die je drie dagen later nagaapt.
        </p>
        <button
          type="button"
          onClick={() => {
            setSent(false);
            setForm(initial);
          }}
          className="mt-6 text-sm font-bold text-[#FF5722] underline-offset-4 hover:underline"
        >
          Nog een bericht sturen
        </button>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#FF5722]/50 focus:outline-none focus:ring-2 focus:ring-[#FF5722]/15";

  return (
    <form onSubmit={handleSubmit} className="flex h-full min-h-0 flex-col gap-4" noValidate>
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

      <div className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <InteractiveLogo className="h-11 w-11 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#FF5722]">
            Meneer leest mee
          </p>
          <AnimatePresence mode="wait">
            <motion.p
              key={coachLine}
              initial={reduce ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="mt-1 text-sm font-bold leading-snug text-slate-800"
            >
              {coachLine}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-naam" className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
            Naam *
          </label>
          <input
            id="contact-naam"
            name="naam"
            type="text"
            autoComplete="name"
            required
            value={form.naam}
            onChange={set("naam")}
            className={inputCls}
            placeholder="Je naam"
          />
        </div>
        <div>
          <label htmlFor="contact-bedrijf" className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
            Bedrijf
          </label>
          <input
            id="contact-bedrijf"
            name="bedrijf"
            type="text"
            autoComplete="organization"
            value={form.bedrijf}
            onChange={set("bedrijf")}
            className={inputCls}
            placeholder="Optioneel"
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-email" className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
            E-mail *
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={set("email")}
            className={inputCls}
            placeholder="jij@bedrijf.nl"
          />
        </div>
        <div>
          <label htmlFor="contact-tel" className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
            Telefoon
          </label>
          <input
            id="contact-tel"
            name="telefoon"
            type="tel"
            autoComplete="tel"
            value={form.telefoon}
            onChange={set("telefoon")}
            className={inputCls}
            placeholder="+31 …"
          />
        </div>
      </div>
      <div>
        <label htmlFor="contact-onderwerp" className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
          Onderwerp *
        </label>
        <select
          id="contact-onderwerp"
          name="onderwerp"
          value={form.onderwerp}
          onChange={set("onderwerp")}
          className={inputCls}
        >
          {ONDERWERPEN.map((o) => (
            <option key={o.value || "empty"} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="mb-2 flex flex-wrap items-end justify-between gap-2">
          <label htmlFor="contact-bericht" className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Bericht *
          </label>
          <button
            type="button"
            onClick={() => setPlaceholderIndex((i) => (i + 1) % PLACEHOLDER_LINES.length)}
            className="text-[11px] font-bold text-slate-400 transition hover:text-[#FF5722]"
          >
            Andere placeholder
          </button>
        </div>
        <textarea
          id="contact-bericht"
          name="bericht"
          required
          value={form.bericht}
          onChange={set("bericht")}
          className={`${inputCls} min-h-[180px] flex-1 resize-none`}
          placeholder={PLACEHOLDER_LINES[placeholderIndex]}
        />
        <p className="mt-2 text-xs font-semibold text-slate-500">{clarityHint}</p>
      </div>

      {error ? (
        <p className="text-sm font-medium text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-auto flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">
          Direct naar info@meneermarketing.nl. Geen CRM die je later stalkt.
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full bg-[#FF5722] px-6 py-4 text-sm font-bold text-white shadow-md shadow-[#FF5722]/25 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
        >
          <Send className="size-4" aria-hidden />
          {submitting ? "Versturen…" : "Verstuur naar Meneer"}
        </button>
      </div>
    </form>
  );
}
