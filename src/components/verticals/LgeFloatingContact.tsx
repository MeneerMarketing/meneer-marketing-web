"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Mail, MessageCircle, Phone, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { WhatsAppMark } from "@/components/icons/WhatsAppMark";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import {
  businessEmailDisplay,
  getContactChannels,
  mailtoHref,
  telHref,
  whatsappHref,
  type ContactChannel,
} from "@/lib/contact";
import {
  trackHuidkliniekEvent,
  trackPilatesEvent,
} from "@/lib/verticals/analytics";

const EASE = [0.22, 1, 0.36, 1] as const;

const CHANNEL_ICONS = {
  email: Mail,
  whatsapp: MessageCircle,
  phone: Phone,
} as const;

export type LgeFloatingContactVertical = "pilates-studios" | "huidklinieken";

interface LgeFloatingContactProps {
  vertical: LgeFloatingContactVertical;
}

interface VerticalCopy {
  whatsappMessage: string;
  mailSubject: string;
  mailBody: string;
  hints: Record<ContactChannel["id"], string>;
  userReplies: Record<ContactChannel["id"], string>;
  pillEyebrow: string;
  pillTitle: string;
  pillSubtitle: string;
}

const COPY: Record<LgeFloatingContactVertical, VerticalCopy> = {
  "pilates-studios": {
    whatsappMessage:
      "Hoi Meneer Marketing! Ik heb een Pilates studio en wil even sparren.",
    mailSubject: "Pilates studio · even sparren",
    mailBody:
      "Hoi!\n\nIk heb een Pilates studio en wil eerst even contact voordat ik start.\n\n",
    hints: {
      whatsapp:
        "Mijn favoriet. Snel, informeel, ik reageer alsof we al samenwerken.",
      phone: "Liever bellen? Plan een moment of bel direct als het uitkomt.",
      email: "Uitgebreide vraag? Mail werkt. Ik lees alles zelf.",
    },
    userReplies: {
      whatsapp: "WhatsApp me even over mijn studio",
      phone: "Zullen we bellen?",
      email: "Ik mail je even mijn situatie",
    },
    pillEyebrow: "Direct bereikbaar",
    pillTitle: "Even sparren?",
    pillSubtitle: "Over je studio",
  },
  huidklinieken: {
    whatsappMessage:
      "Hoi Meneer Marketing! Ik heb een huidkliniek en wil even sparren.",
    mailSubject: "Huidkliniek · even sparren",
    mailBody:
      "Hoi!\n\nIk heb een huidkliniek en wil eerst even contact voordat ik start.\n\n",
    hints: {
      whatsapp:
        "Mijn favoriet. Snel en direct, ook tussen behandelingen door.",
      phone: "Liever bellen? Plan een moment of bel direct als het uitkomt.",
      email: "Uitgebreide vraag? Mail werkt. Ik lees alles zelf.",
    },
    userReplies: {
      whatsapp: "WhatsApp me even over mijn kliniek",
      phone: "Zullen we bellen?",
      email: "Ik mail je even mijn situatie",
    },
    pillEyebrow: "Direct bereikbaar",
    pillTitle: "Even sparren?",
    pillSubtitle: "Over je kliniek",
  },
};

function trackChannel(
  vertical: LgeFloatingContactVertical,
  channel: ContactChannel["id"],
): void {
  const payload = { location: "floating_contact", channel };
  if (vertical === "pilates-studios") {
    trackPilatesEvent("pilates_demo_click", payload);
    return;
  }
  trackHuidkliniekEvent("huidkliniek_demo_click", payload);
}

function channelHref(
  vertical: LgeFloatingContactVertical,
  channel: ContactChannel,
): string {
  const copy = COPY[vertical];

  if (channel.id === "whatsapp") {
    return whatsappHref(copy.whatsappMessage) ?? channel.href;
  }
  if (channel.id === "email") {
    return mailtoHref({
      subject: copy.mailSubject,
      body: copy.mailBody,
    });
  }
  return telHref() ?? channel.href;
}

function ctaLabel(channel: ContactChannel["id"]): string {
  if (channel === "whatsapp") return "Open WhatsApp";
  if (channel === "phone") return "Bel of plan een moment";
  return `Mail ${businessEmailDisplay}`;
}

export function LgeFloatingContact({ vertical }: LgeFloatingContactProps) {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [channelId, setChannelId] =
    useState<ContactChannel["id"]>("whatsapp");

  const copy = COPY[vertical];
  const channels = getContactChannels();
  const activeChannel =
    channels.find((c) => c.id === channelId) ?? channels[1]!;

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }

    function onPointerDown(event: MouseEvent | TouchEvent) {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (!rootRef.current?.contains(target)) close();
    }

    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [close, open]);

  function toggleOpen() {
    setOpen((value) => !value);
    if (!open) {
      const payload = { location: "floating_contact" };
      if (vertical === "pilates-studios") {
        trackPilatesEvent("pilates_demo_click", payload);
      } else {
        trackHuidkliniekEvent("huidkliniek_demo_click", payload);
      }
    }
  }

  function pickChannel(id: ContactChannel["id"]) {
    setChannelId(id);
    trackChannel(vertical, id);
  }

  function onCtaClick() {
    trackChannel(vertical, channelId);
  }

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed bottom-[max(0.85rem,env(safe-area-inset-bottom))] right-3 z-[85] lg:hidden"
      aria-live="polite"
    >
      <AnimatePresence>
        {open ? (
          <motion.div
            key="panel"
            id="lge-floating-contact-panel"
            role="dialog"
            aria-label="Contact met Meneer Marketing"
            initial={reduce ? false : { opacity: 0, y: 20, rotate: 1.5, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, rotate: 0.5, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: 14, scale: 0.96 }}
            transition={{ duration: 0.28, ease: EASE }}
            className="pointer-events-auto mb-3 w-[min(calc(100vw-1.5rem),20.5rem)] origin-bottom-right overflow-hidden rounded-[1.35rem] border border-slate-200/90 bg-[#fffef9] shadow-[0_28px_70px_-32px_rgba(15,23,42,0.38)] ring-1 ring-slate-900/[0.04]"
          >
            <div className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-br from-[#FF5722]/10 via-white to-white px-4 pb-4 pt-4">
              <div
                className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full bg-[#FF5722]/10 blur-2xl"
                aria-hidden
              />
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <InteractiveLogo className="size-10 shrink-0" interactive={false} />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#FF5722]">
                      Meneer Marketing
                    </p>
                    <p className="mt-0.5 text-base font-extrabold tracking-tight text-slate-900">
                      Hoe bereik je me?
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={close}
                  className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-slate-200/90 bg-white/90 text-slate-500 shadow-sm"
                  aria-label="Chat sluiten"
                >
                  <X className="size-4" aria-hidden />
                </button>
              </div>
            </div>

            <div className="p-4">
              <div
                className="flex flex-wrap gap-2"
                role="tablist"
                aria-label="Contactvoorkeur"
              >
                {channels.map((channel) => {
                  const selected = channelId === channel.id;
                  const Icon = CHANNEL_ICONS[channel.id];
                  return (
                    <button
                      key={channel.id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => pickChannel(channel.id)}
                      className={
                        selected
                          ? channel.id === "whatsapp"
                            ? "inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-3 py-1.5 text-[12px] font-bold text-white shadow-[0_8px_18px_-8px_rgba(37,211,102,0.8)]"
                            : "inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1.5 text-[12px] font-bold text-white shadow-md"
                          : "inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-bold text-slate-700"
                      }
                    >
                      <Icon className="size-3.5" aria-hidden />
                      {channel.label}
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 flex min-h-[7.25rem] flex-col rounded-2xl border border-slate-100 bg-[#f7f8fa] p-3">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={channelId}
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: -6 }}
                    transition={{ duration: 0.2, ease: EASE }}
                    className="flex flex-1 flex-col"
                  >
                    <div className="flex items-start gap-2.5">
                      <InteractiveLogo
                        className="size-8 shrink-0"
                        interactive={false}
                      />
                      <div className="max-w-[88%] rounded-2xl rounded-tl-md bg-white px-3 py-2.5 shadow-sm ring-1 ring-slate-200/80">
                        <p className="text-[13px] leading-relaxed text-slate-700">
                          {copy.hints[channelId]}
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto flex justify-end pt-3">
                      <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-[#FF5722] px-3 py-2 text-[12px] font-semibold text-white shadow-sm">
                        {copy.userReplies[channelId]}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {activeChannel.external ? (
                <a
                  href={channelHref(vertical, activeChannel)}
                  target={channelId === "whatsapp" ? "_blank" : undefined}
                  rel={
                    channelId === "whatsapp" ? "noopener noreferrer" : undefined
                  }
                  onClick={onCtaClick}
                  className={
                    channelId === "whatsapp"
                      ? "mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-4 py-3.5 text-[13px] font-bold text-white shadow-[0_12px_28px_-10px_rgba(37,211,102,0.75)]"
                      : "mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-[13px] font-bold text-slate-900"
                  }
                >
                  {channelId === "whatsapp" ? (
                    <WhatsAppMark className="size-4" />
                  ) : null}
                  {ctaLabel(channelId)}
                  <ArrowUpRight className="size-4" aria-hidden />
                </a>
              ) : (
                <Link
                  href="/contact"
                  onClick={onCtaClick}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-[13px] font-bold text-slate-900"
                >
                  Naar contact
                  <ArrowUpRight className="size-4" aria-hidden />
                </Link>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24, rotate: -1.8 }}
        animate={{ opacity: 1, y: 0, rotate: -0.9 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="pointer-events-auto origin-bottom-right"
      >
        <button
          type="button"
          onClick={toggleOpen}
          aria-expanded={open}
          aria-controls="lge-floating-contact-panel"
          className="relative flex min-w-[13rem] items-center gap-2.5 overflow-hidden rounded-[1.2rem] border border-white/90 bg-white/95 py-2 pl-2.5 pr-2.5 shadow-[0_20px_55px_-24px_rgba(15,23,42,0.4)] ring-1 ring-slate-900/[0.05] backdrop-blur-md transition active:scale-[0.98]"
        >
            <span
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FF5722]/35 to-transparent"
              aria-hidden
            />

            {open ? (
              <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
                <X className="size-5" aria-hidden />
              </span>
            ) : (
              <InteractiveLogo
                className="size-10 shrink-0"
                interactive={false}
              />
            )}

            <span className="min-w-0 flex-1 text-left">
              <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-[#FF5722]">
                {open ? "Sluiten" : copy.pillEyebrow}
              </span>
              <span className="block text-sm font-extrabold leading-tight tracking-tight text-slate-900">
                {open ? "Terug naar pagina" : copy.pillTitle}
              </span>
              {!open ? (
                <span className="mt-0.5 block text-[11px] font-semibold text-slate-500">
                  {copy.pillSubtitle}
                </span>
              ) : null}
            </span>

            {!open ? (
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_20px_-8px_rgba(37,211,102,0.75)] ring-2 ring-white">
                <WhatsAppMark className="size-5" />
              </span>
            ) : null}
        </button>

        <p
          className="pointer-events-none absolute -bottom-2 left-[10%] h-3 w-[80%] rounded-[100%] bg-slate-900/[0.08] blur-md"
          aria-hidden
        />
      </motion.div>
    </div>
  );
}
