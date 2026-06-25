"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock4, Mail, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { mailtoHref } from "@/lib/contact";

export interface AsideStep {
  readonly title: string;
  readonly body: string;
}

export interface AsideQuickLink {
  readonly label: string;
  readonly href: string;
  readonly description?: string;
  /** Pre-rendered JSX node (bijv. `<Compass className="size-4" />`). */
  readonly icon?: ReactNode;
}

interface ConversionAsideProps {
  readonly processTitle?: string;
  readonly steps: readonly AsideStep[];
  readonly links?: readonly AsideQuickLink[];
  readonly quickMailSubject: string;
  readonly responseLabel?: string;
  readonly trustLabel?: string;
}

export function ConversionAside({
  processTitle = "Wat gebeurt er daarna?",
  steps,
  links,
  quickMailSubject,
  responseLabel = "1 – 2 werkdagen",
  trustLabel = "Geen CRM-automaat. Je praat direct met ons team.",
}: ConversionAsideProps) {
  const mailHref = mailtoHref({
    subject: quickMailSubject,
    body: "Hoi,\n\n",
  });

  return (
    <aside className="space-y-5 lg:sticky lg:top-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-3xl border border-mm-border bg-white p-6 shadow-mm-card"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 -right-16 h-40 w-40 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(14,165,233,0.22), transparent 70%)",
          }}
        />
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-mm-sky-deep">
          {processTitle}
        </p>
        <ol className="mt-4 space-y-4">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-3">
              <span
                aria-hidden
                className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-mm-sky-subtle text-[11px] font-black text-mm-sky-deep"
              >
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-bold text-mm-text">{s.title}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-mm-muted">
                  {s.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </motion.div>

      <motion.a
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        href={mailHref}
        className="group flex items-start gap-4 rounded-3xl border border-mm-border bg-mm-accent-subtle/50 p-6 transition hover:border-mm-accent/40 hover:shadow-mm-card"
      >
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-mm-accent text-white shadow-[0_6px_20px_-6px_rgba(234,88,12,0.6)]">
          <Mail className="size-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-mm-text">Liever direct mailen</p>
          <p className="mt-1 text-[13px] text-mm-muted">
            Eén klik opent een mail met {quickMailSubject.toLowerCase()} als onderwerp.
          </p>
        </div>
        <ArrowUpRight
          className="size-5 shrink-0 text-mm-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-mm-accent"
          aria-hidden
        />
      </motion.a>

      {links && links.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
          className="rounded-3xl border border-mm-border bg-mm-surface-elevated p-6"
        >
          <p className="text-[11px] font-bold uppercase tracking-widest text-mm-muted">
            Ook handig
          </p>
          <ul className="mt-4 space-y-2.5">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="group flex items-start gap-3 rounded-xl p-2 transition hover:bg-mm-bg"
                >
                  {l.icon ? (
                    <span
                      aria-hidden
                      className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-mm-sky-subtle text-mm-sky-deep"
                    >
                      {l.icon}
                    </span>
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-mm-text">{l.label}</p>
                    {l.description ? (
                      <p className="text-[12.5px] text-mm-muted">
                        {l.description}
                      </p>
                    ) : null}
                  </div>
                  <ArrowUpRight
                    className="size-4 shrink-0 text-mm-muted transition group-hover:text-mm-sky-deep"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
      ) : null}

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="grid gap-3 rounded-3xl border border-dashed border-mm-border/80 bg-mm-bg p-5 text-sm text-mm-muted"
      >
        <div className="flex items-start gap-3">
          <Clock4 className="mt-0.5 size-4 shrink-0 text-mm-sky-deep" aria-hidden />
          <p>
            <span className="font-bold text-mm-text">Reactietijd:</span>{" "}
            {responseLabel}.
          </p>
        </div>
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-mm-sky-deep" aria-hidden />
          <p>{trustLabel}</p>
        </div>
      </motion.div>
    </aside>
  );
}
