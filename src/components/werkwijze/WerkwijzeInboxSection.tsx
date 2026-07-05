"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Mail,
  MessageCircle,
  Phone,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { WERKWIJZE_INBOX } from "@/data/werkwijze-index";
import { getContactChannels, type ContactChannel } from "@/lib/contact";

const CHANNEL_ICONS = {
  email: Mail,
  whatsapp: MessageCircle,
  phone: Phone,
} as const;

const CHANNEL_COLORS = {
  email: "#FF5722",
  whatsapp: "#22C55E",
  phone: "#0284c7",
} as const;

function ChannelCard({ channel }: { channel: ContactChannel }) {
  const Icon = CHANNEL_ICONS[channel.id];
  const color = CHANNEL_COLORS[channel.id];
  const className =
    "group flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-[0_16px_40px_-28px_rgba(15,23,42,0.25)]";

  const inner = (
    <>
      <span
        className="flex size-10 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${color}14`, color }}
      >
        <Icon className="size-4" strokeWidth={2} aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="text-sm font-extrabold text-slate-900">{channel.label}</span>
          <ArrowUpRight
            className="size-3.5 text-slate-300 transition group-hover:text-[#FF5722]"
            aria-hidden
          />
        </span>
        <span className="mt-0.5 block text-sm font-semibold text-slate-700">
          {channel.action}
        </span>
        <span className="mt-1 block text-xs leading-relaxed text-slate-500">
          {channel.hint}
        </span>
      </span>
    </>
  );

  if (channel.external) {
    return (
      <a href={channel.href} className={className}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={channel.href} className={className}>
      {inner}
    </Link>
  );
}

export function WerkwijzeInboxSection() {
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<"meneer" | "corporate">("meneer");
  const mail = mode === "meneer" ? WERKWIJZE_INBOX.meneer : WERKWIJZE_INBOX.corporate;
  const channels = getContactChannels();

  return (
    <section
      className="border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white"
      aria-labelledby="werkwijze-inbox-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF5722]">
          Communicatie
        </p>
        <h2
          id="werkwijze-inbox-heading"
          className="mt-3 max-w-2xl text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
        >
          {WERKWIJZE_INBOX.title}
        </h2>
        <p className="mt-3 max-w-xl text-slate-600">{WERKWIJZE_INBOX.subtitle}</p>

        <div className="mt-8 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode("meneer")}
            aria-pressed={mode === "meneer"}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold transition ${
              mode === "meneer"
                ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            }`}
          >
            <ThumbsUp className="size-4" aria-hidden />
            {WERKWIJZE_INBOX.meneer.label}
          </button>
          <button
            type="button"
            onClick={() => setMode("corporate")}
            aria-pressed={mode === "corporate"}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold transition ${
              mode === "corporate"
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            }`}
          >
            <ThumbsDown className="size-4" aria-hidden />
            {WERKWIJZE_INBOX.corporate.label}
          </button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:items-stretch lg:gap-8">
          <motion.div
            layout
            className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_48px_-24px_rgba(15,23,42,0.15)]"
          >
            <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
              <Mail className="size-4 text-slate-400" aria-hidden />
              <span className="text-xs font-bold text-slate-500">Voorbeeld van een mail</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="flex flex-1 flex-col p-5 sm:p-6"
              >
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Onderwerp
                </p>
                <p
                  className={`mt-1 text-base font-extrabold sm:text-lg ${
                    mode === "meneer"
                      ? "text-slate-900"
                      : "text-slate-500 line-through decoration-red-300"
                  }`}
                >
                  {mail.subject}
                </p>
                <p className="mt-5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Bericht
                </p>
                <p
                  className={`mt-2 flex-1 text-sm leading-relaxed sm:text-[15px] ${
                    mode === "meneer" ? "text-slate-700" : "text-slate-400 italic"
                  }`}
                >
                  {mail.body}
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <aside className="flex flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start gap-3">
              <InteractiveLogo className="size-10 shrink-0" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Bereik me zo
                </p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  {WERKWIJZE_INBOX.channelsIntro}
                </p>
              </div>
            </div>

            <ul className="mt-5 flex flex-1 flex-col gap-3">
              {channels.map((channel) => (
                <li key={channel.id}>
                  <ChannelCard channel={channel} />
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
