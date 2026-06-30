"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
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

const initial: FormState = {
  naam: "",
  bedrijf: "",
  email: "",
  telefoon: "",
  onderwerp: "",
  bericht: "",
};

export function ContactForm() {
  const [form, setForm] = useState<FormState>(initial);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

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
      <div className="rounded-3xl border border-mm-border bg-mm-sky-subtle/40 p-8 text-center shadow-sm">
        <h3 className="text-xl font-extrabold text-mm-text">Bedankt voor je bericht</h3>
        <p className="mt-3 text-sm leading-relaxed text-mm-muted">
          We hebben je aanvraag ontvangen en reageren binnen één à twee werkdagen op{" "}
          <strong className="text-mm-text">{form.email.trim()}</strong>.
        </p>
        <button
          type="button"
          onClick={() => {
            setSent(false);
            setForm(initial);
          }}
          className="mt-6 text-sm font-semibold text-mm-sky-deep underline-offset-4 hover:underline"
        >
          Nog een bericht sturen
        </button>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-2xl border border-mm-border bg-mm-surface-elevated px-4 py-3.5 text-sm text-mm-text placeholder:text-mm-muted/70 focus:border-mm-sky focus:outline-none focus:ring-2 focus:ring-mm-sky/25";

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-naam" className="mb-2 block text-xs font-bold uppercase tracking-wider text-mm-muted">
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
          <label htmlFor="contact-bedrijf" className="mb-2 block text-xs font-bold uppercase tracking-wider text-mm-muted">
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
          <label htmlFor="contact-email" className="mb-2 block text-xs font-bold uppercase tracking-wider text-mm-muted">
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
          <label htmlFor="contact-tel" className="mb-2 block text-xs font-bold uppercase tracking-wider text-mm-muted">
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
        <label htmlFor="contact-onderwerp" className="mb-2 block text-xs font-bold uppercase tracking-wider text-mm-muted">
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
      <div>
        <label htmlFor="contact-bericht" className="mb-2 block text-xs font-bold uppercase tracking-wider text-mm-muted">
          Bericht *
        </label>
        <textarea
          id="contact-bericht"
          name="bericht"
          required
          rows={6}
          value={form.bericht}
          onChange={set("bericht")}
          className={inputCls + " resize-none"}
          placeholder="Waar loop je tegenaan? Wat wil je bereiken? Links naar je site helpen."
        />
      </div>
      {error ? (
        <p className="text-sm font-medium text-red-600" role="alert">
          {error}
        </p>
      ) : null}
      <p className="text-xs text-mm-muted">
        Je gegevens gaan direct naar ons team op info@meneermarketing.nl. We
        reageren binnen één à twee werkdagen.
      </p>
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-mm-accent px-6 py-4 text-sm font-bold text-white shadow-md hover:bg-mm-accent-hover disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        <Send className="size-4" aria-hidden />
        {submitting ? "Versturen…" : "Verstuur bericht"}
      </button>
    </form>
  );
}
