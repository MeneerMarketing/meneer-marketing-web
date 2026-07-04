"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Building2, Clock4, Mail, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { ContactForm } from "@/components/contact/ContactForm";
import {
  businessEmailDisplay,
  businessKvk,
  mailtoHref,
} from "@/lib/contact";
import { CONTACT_QUOTES } from "@/data/contact-index";
import { siteCtas } from "@/lib/cta";

function ContactAsidePanel() {
  const reduce = useReducedMotion();
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const timer = window.setInterval(() => {
      setQuoteIndex((i) => (i + 1) % CONTACT_QUOTES.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [reduce]);

  const mailQuick = mailtoHref({
    subject: "Vraag aan Meneer Marketing",
    body: "Hoi,\n\nIk wil graag even sparren over:\n\n",
  });

  return (
    <aside className="flex h-full min-h-0 flex-col gap-4 lg:sticky lg:top-24">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white shadow-lg">
        <AnimatePresence mode="wait">
          <motion.p
            key={quoteIndex}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="text-sm font-bold leading-snug text-slate-200"
          >
            {CONTACT_QUOTES[quoteIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      <a
        href={mailQuick}
        className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-[#FF5722]/5 p-5 transition hover:border-[#FF5722]/40 hover:shadow-md"
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#FF5722] text-white">
          <Mail className="size-5" aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-extrabold text-slate-900">Direct mailen</span>
          <span className="mt-1 block break-all text-sm text-slate-600">
            {businessEmailDisplay}
          </span>
        </span>
        <ArrowUpRight
          className="size-5 shrink-0 text-slate-400 transition group-hover:text-[#FF5722]"
          aria-hidden
        />
      </a>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#FF5722]">
          Liever meteen bellen?
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Plan een intake. Je vult alvast je onderwerp en prioriteit in. Scheelt
          een mail heen en weer.
        </p>
        <Link
          href={siteCtas.startIntake.href}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#FF5722] hover:underline"
        >
          Plan een gesprek
          <ArrowUpRight className="size-4" aria-hidden />
        </Link>
      </div>

      <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-slate-500">
          <Building2 className="size-5" aria-hidden />
          <p className="text-[10px] font-bold uppercase tracking-wider">
            Zakelijke gegevens
          </p>
        </div>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Bedrijfsnaam</dt>
            <dd className="font-bold text-slate-900">Meneer Marketing</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">KvK</dt>
            <dd className="font-bold text-slate-900">{businessKvk}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Gevestigd in</dt>
            <dd className="font-bold text-slate-900">Nederland</dd>
          </div>
        </dl>
      </div>

      <div className="mt-auto grid gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm">
        <div className="flex items-start gap-3 text-slate-600">
          <Clock4 className="mt-0.5 size-4 shrink-0 text-[#FF5722]" aria-hidden />
          <p>
            <span className="font-bold text-slate-900">Reactietijd:</span> één à
            twee werkdagen. Urgent? Zet het in je onderwerp.
          </p>
        </div>
        <div className="flex items-start gap-3 text-slate-600">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#FF5722]" aria-hidden />
          <p>Geen CRM-automaat. Je praat direct met mij.</p>
        </div>
      </div>
    </aside>
  );
}

export function ContactFormSection() {
  return (
    <section
      id="formulier"
      className="scroll-mt-24 border-b border-slate-200 bg-white"
      aria-labelledby="contact-form-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF5722]">
          Bericht sturen
        </p>
        <h2
          id="contact-form-heading"
          className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
        >
          Vertel waar je tegenaan loopt
        </h2>
        <p className="mt-2 max-w-xl text-slate-600">
          Vul het formulier in. Je bericht komt direct bij mij op{" "}
          <span className="font-bold text-slate-900">{businessEmailDisplay}</span>.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-stretch">
          <div className="flex min-h-[640px] flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_24px_56px_-32px_rgba(15,23,42,0.12)] sm:p-8">
            <ContactForm />
          </div>
          <ContactAsidePanel />
        </div>
      </div>
    </section>
  );
}
