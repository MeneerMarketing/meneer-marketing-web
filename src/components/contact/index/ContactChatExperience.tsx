"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowUpRight,
  Building2,
  Clock4,
  Mail,
  Send,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import {
  businessEmailDisplay,
  businessKvk,
  mailtoHref,
} from "@/lib/contact";
import { submitContactForm } from "@/lib/contact-submission";
import {
  CONTACT_CHAT_OPENERS,
  CONTACT_CHAT_PROMPTS,
  CONTACT_QUICK_REPLIES,
  type ContactFocusOption,
  type ContactQuickReply,
} from "@/data/contact-index";
import { siteCtas } from "@/lib/cta";

type ChatPhase = "intro" | "topic" | "focus" | "message" | "contact" | "sent";

interface ContactChatExperienceProps {
  variant?: "page" | "teaser";
  sectionId?: string;
  heading?: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
}

interface ChatMessage {
  id: string;
  from: "meneer" | "jij";
  text: string;
}

interface FormState {
  naam: string;
  bedrijf: string;
  email: string;
  telefoon: string;
  onderwerp: string;
  focus: string;
  bericht: string;
}

const ONDERWERP_LABELS: Record<string, string> = {
  intake: "Intake / kennismaking",
  strategie: "Strategie & prioriteit",
  "web-shop": "Website of webshop",
  marketing: "SEO, ads of groei",
  automatisering: "Automatisering & koppelingen",
  design: "Branding / design",
  anders: "Iets anders",
};

const initialForm: FormState = {
  naam: "",
  bedrijf: "",
  email: "",
  telefoon: "",
  onderwerp: "anders",
  focus: "",
  bericht: "",
};

const DEFAULT_HEADING = {
  eyebrow: "Het gesprek",
  title: "Typ alsof je me app't",
  subtitle:
    "Geen formulier-gevoel. Wel dezelfde inbox bij mij. Scroll mee, klik een richting of typ gewoon los.",
};

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <InteractiveLogo className="size-8 shrink-0" />
      <span className="inline-flex gap-1 rounded-2xl rounded-bl-sm bg-slate-900 px-4 py-3">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="size-1.5 rounded-full bg-slate-400"
            animate={{ opacity: [0.35, 1, 0.35], y: [0, -3, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </span>
    </div>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isMeneer = message.from === "meneer";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 340, damping: 26 }}
      className={`flex items-end gap-2 ${isMeneer ? "" : "flex-row-reverse"}`}
    >
      {isMeneer ? (
        <InteractiveLogo className="size-8 shrink-0" />
      ) : (
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#FF5722] text-[11px] font-black text-white">
          J
        </span>
      )}
      <p
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm font-semibold leading-snug sm:max-w-[78%] ${
          isMeneer
            ? "rounded-bl-sm bg-slate-900 text-white"
            : "rounded-br-sm border border-slate-200 bg-white text-slate-800 shadow-sm"
        }`}
      >
        {message.text}
      </p>
    </motion.div>
  );
}

function ContactChatAside() {
  const mailQuick = mailtoHref({
    subject: "Vraag aan Meneer Marketing",
    body: "Hoi,\n\nIk wil graag even sparren over:\n\n",
  });

  return (
    <aside className="flex flex-col gap-4 lg:sticky lg:top-24">
      <a
        href={mailQuick}
        className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-[#FF5722]/40 hover:shadow-md"
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#FF5722] text-white">
          <Mail className="size-5" aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-extrabold text-slate-900">Liever mailen?</span>
          <span className="mt-1 block break-all text-sm text-slate-600">
            {businessEmailDisplay}
          </span>
        </span>
        <ArrowUpRight
          className="size-5 shrink-0 text-slate-400 transition group-hover:text-[#FF5722]"
          aria-hidden
        />
      </a>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#FF5722]">
          Liever met structuur?
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          De intake duurt twee minuten. Handig als je al weet dat je wilt starten.
        </p>
        <Link
          href={siteCtas.startIntake.href}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#FF5722] hover:underline"
        >
          {siteCtas.startIntake.label}
          <ArrowUpRight className="size-4" aria-hidden />
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
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
        </dl>
      </div>

      <div className="grid gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm">
        <div className="flex items-start gap-3 text-slate-600">
          <Clock4 className="mt-0.5 size-4 shrink-0 text-[#FF5722]" aria-hidden />
          <p>
            <span className="font-bold text-slate-900">Reactietijd:</span> één à
            twee werkdagen.
          </p>
        </div>
        <div className="flex items-start gap-3 text-slate-600">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#FF5722]" aria-hidden />
          <p>Direct bij mij. Geen CRM die je later nagaapt.</p>
        </div>
      </div>
    </aside>
  );
}

export function ContactChatExperience({
  variant = "page",
  sectionId = "gesprek",
  heading = DEFAULT_HEADING,
}: ContactChatExperienceProps) {
  const reduce = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<ChatPhase>("intro");
  const [typing, setTyping] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<ContactQuickReply | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [draftMessage, setDraftMessage] = useState("");
  const isTeaser = variant === "teaser";

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [reduce]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing, phase, scrollToBottom]);

  useEffect(() => {
    if (phase !== "intro") return;

    const openers = isTeaser
      ? CONTACT_CHAT_OPENERS.slice(0, 2)
      : CONTACT_CHAT_OPENERS;

    let cancelled = false;
    let index = 0;

    const showNext = () => {
      if (cancelled || index >= openers.length) {
        setTyping(false);
        setPhase("topic");
        return;
      }

      setTyping(true);
      const delay = reduce ? 0 : 900 + index * 400;

      window.setTimeout(() => {
        if (cancelled) return;
        setTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: `intro-${index}`,
            from: "meneer",
            text: openers[index]!,
          },
        ]);
        index += 1;
        window.setTimeout(showNext, reduce ? 0 : 500);
      }, delay);
    };

    showNext();
    return () => {
      cancelled = true;
    };
  }, [phase, reduce, isTeaser]);

  const addUserMessage = (text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, from: "jij", text },
    ]);
  };

  const addMeneerMessage = (text: string, nextPhase?: ChatPhase) => {
    setTyping(true);
    window.setTimeout(
      () => {
        setTyping(false);
        setMessages((prev) => [
          ...prev,
          { id: `meneer-${Date.now()}`, from: "meneer", text },
        ]);
        if (nextPhase) setPhase(nextPhase);
      },
      reduce ? 0 : 700,
    );
  };

  const pickTopic = (reply: ContactQuickReply) => {
    addUserMessage(reply.label);
    setSelectedTopic(reply);
    setForm((prev) => ({ ...prev, onderwerp: reply.onderwerp, focus: "" }));
    addMeneerMessage(reply.meneerReply, "focus");
    window.setTimeout(() => {
      addMeneerMessage(CONTACT_CHAT_PROMPTS.askFocus);
    }, reduce ? 0 : 900);
  };

  const pickFocus = (option: ContactFocusOption) => {
    addUserMessage(option.label);
    setForm((prev) => ({ ...prev, focus: option.label }));

    if (isTeaser) {
      addMeneerMessage(option.meneerReply, "message");
      window.setTimeout(() => {
        addMeneerMessage(CONTACT_CHAT_PROMPTS.teaserContinue);
      }, reduce ? 0 : 900);
      return;
    }

    addMeneerMessage(option.meneerReply, "message");
    window.setTimeout(() => {
      addMeneerMessage(CONTACT_CHAT_PROMPTS.askMessage);
    }, reduce ? 0 : 900);
  };

  const skipToMessage = () => {
    setSelectedTopic(null);
    setPhase("message");
    addMeneerMessage(
      "Prima. Vertel maar. Marketing, site, idee, frustratie. Alles mag.",
    );
  };

  const sendMessage = () => {
    const text = draftMessage.trim();
    if (text.length < 8) {
      setError("Typ iets meer. Een regel is genoeg, maar niet leeg.");
      return;
    }
    setError(null);
    addUserMessage(text);
    setForm((prev) => ({ ...prev, bericht: text }));
    setDraftMessage("");
    addMeneerMessage(CONTACT_CHAT_PROMPTS.askName, "contact");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!form.naam.trim() || !form.email.trim()) {
      setError("Naam en e-mail, dan kan ik terugkoppelen.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError("Check even je e-mailadres.");
      return;
    }
    if (!form.bericht.trim()) {
      setError("Je bericht ontbreekt. Typ eerst wat je wilt bespreken.");
      return;
    }

    const label = ONDERWERP_LABELS[form.onderwerp] ?? form.onderwerp;
    const body = [
      "Bericht via meneermarketing.nl/contact (chat)",
      "",
      `Naam: ${form.naam.trim()}`,
      `Bedrijf: ${form.bedrijf.trim() || "."}`,
      `E-mail: ${form.email.trim()}`,
      `Telefoon: ${form.telefoon.trim() || "."}`,
      `Onderwerp: ${label}`,
      ...(form.focus.trim() ? [`Focus: ${form.focus.trim()}`] : []),
      "",
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

    addUserMessage("Verstuur maar");
    addMeneerMessage(CONTACT_CHAT_PROMPTS.sent, "sent");
  };

  const resetChat = () => {
    setPhase("intro");
    setMessages([]);
    setSelectedTopic(null);
    setForm(initialForm);
    setDraftMessage("");
    setError(null);
    setTyping(true);
  };

  const showComposer = phase === "message" && !isTeaser;

  const inputCls =
    "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#FF5722]/50 focus:outline-none focus:ring-2 focus:ring-[#FF5722]/15";

  return (
    <section
      id={sectionId}
      className="scroll-mt-24 border-b border-slate-200 bg-gradient-to-b from-slate-50/80 to-white"
      aria-labelledby="contact-chat-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF5722]">
          {heading.eyebrow}
        </p>
        <h2
          id="contact-chat-heading"
          className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
        >
          {heading.title}
        </h2>
        <p className="mt-2 max-w-xl text-slate-600">{heading.subtitle}</p>

        <div
          className={`mt-10 grid gap-6 ${isTeaser ? "" : "lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start"}`}
        >
          <div
            className={`relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_32px_64px_-32px_rgba(15,23,42,0.18)] ${
              isTeaser ? "min-h-[min(560px,75vh)]" : "min-h-[min(720px,85vh)]"
            }`}
          >
            <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
              <span className="size-2.5 rounded-full bg-[#FF5722]/80" aria-hidden />
              <span className="size-2.5 rounded-full bg-amber-300" aria-hidden />
              <span className="size-2.5 rounded-full bg-emerald-400" aria-hidden />
              <span className="ml-2 text-xs font-bold text-slate-700">
                Meneer Marketing
              </span>
              <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden />
                Online
              </span>
            </div>

            <div
              ref={scrollRef}
              className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4 sm:p-5"
            >
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <ChatBubble key={msg.id} message={msg} />
                ))}
              </AnimatePresence>
              {typing ? <TypingIndicator /> : null}

              {phase === "topic" && !typing ? (
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 flex flex-wrap gap-2 pl-10"
                >
                  {CONTACT_QUICK_REPLIES.map((reply) => (
                    <button
                      key={reply.id}
                      type="button"
                      onClick={() => pickTopic(reply)}
                      className="rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:border-[#FF5722] hover:text-[#FF5722]"
                    >
                      {reply.label}
                    </button>
                  ))}
                  {!isTeaser ? (
                    <button
                      type="button"
                      onClick={skipToMessage}
                      className="rounded-full border border-dashed border-slate-300 px-3.5 py-2 text-xs font-bold text-slate-500 transition hover:border-slate-400"
                    >
                      Sla over, gewoon typen
                    </button>
                  ) : null}
                </motion.div>
              ) : null}

              {phase === "focus" && !typing && selectedTopic ? (
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 flex flex-wrap gap-2 pl-10"
                >
                  {selectedTopic.focusOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => pickFocus(option)}
                      className="rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:border-[#FF5722] hover:text-[#FF5722]"
                    >
                      {option.label}
                    </button>
                  ))}
                </motion.div>
              ) : null}

              {isTeaser && phase === "message" && !typing ? (
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 rounded-2xl border border-[#FF5722]/25 bg-[#FF5722]/[0.06] p-5 text-center"
                >
                  <p className="text-sm leading-relaxed text-slate-700">
                    {CONTACT_CHAT_PROMPTS.teaserContinue}
                  </p>
                  <Link
                    href="/contact#gesprek"
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#FF5722] px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-orange-600"
                  >
                    Ga verder op contact
                    <ArrowUpRight className="size-4" aria-hidden />
                  </Link>
                </motion.div>
              ) : null}

              {phase === "contact" && !typing ? (
                <motion.form
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleSubmit}
                  className="mt-4 space-y-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {CONTACT_CHAT_PROMPTS.askSend}
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      type="text"
                      autoComplete="name"
                      required
                      value={form.naam}
                      onChange={(e) => {
                        setForm((p) => ({ ...p, naam: e.target.value }));
                        setError(null);
                      }}
                      className={inputCls}
                      placeholder="Je naam *"
                    />
                    <input
                      type="email"
                      autoComplete="email"
                      required
                      value={form.email}
                      onChange={(e) => {
                        setForm((p) => ({ ...p, email: e.target.value }));
                        setError(null);
                      }}
                      className={inputCls}
                      placeholder="jij@bedrijf.nl *"
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      type="text"
                      autoComplete="organization"
                      value={form.bedrijf}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, bedrijf: e.target.value }))
                      }
                      className={inputCls}
                      placeholder="Bedrijf (optioneel)"
                    />
                    <input
                      type="tel"
                      autoComplete="tel"
                      value={form.telefoon}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, telefoon: e.target.value }))
                      }
                      className={inputCls}
                      placeholder="Telefoon (optioneel)"
                    />
                  </div>
                  {error ? (
                    <p className="text-sm font-medium text-red-600" role="alert">
                      {error}
                    </p>
                  ) : null}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#FF5722] px-5 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                  >
                    <Send className="size-4" aria-hidden />
                    {submitting ? "Versturen…" : "Verstuur naar Meneer"}
                  </button>
                </motion.form>
              ) : null}

              {phase === "sent" ? (
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={resetChat}
                    className="text-sm font-bold text-[#FF5722] hover:underline"
                  >
                    Nog een bericht sturen
                  </button>
                </div>
              ) : null}
            </div>

            {showComposer ? (
              <div className="border-t border-slate-100 bg-white p-4">
                <div className="flex gap-2">
                  <textarea
                    value={draftMessage}
                    onChange={(e) => {
                      setDraftMessage(e.target.value);
                      setError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (phase === "message") sendMessage();
                      }
                    }}
                    rows={2}
                    className={`${inputCls} min-h-[52px] flex-1 resize-none`}
                    placeholder="Typ je bericht… marketing, site, idee, of gewoon hoi"
                  />
                  <button
                    type="button"
                    onClick={() => sendMessage()}
                    disabled={!draftMessage.trim()}
                    className="inline-flex shrink-0 items-center justify-center rounded-xl bg-slate-900 px-4 text-white transition hover:bg-[#FF5722] disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Verstuur bericht"
                  >
                    <Send className="size-4" aria-hidden />
                  </button>
                </div>
                {error ? (
                  <p className="mt-2 text-xs font-medium text-red-600" role="alert">
                    {error}
                  </p>
                ) : null}
                <p className="mt-2 text-[10px] text-slate-400">
                  Enter om te versturen. Shift+Enter voor een nieuwe regel.
                </p>
              </div>
            ) : null}

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
          </div>

          {!isTeaser ? <ContactChatAside /> : null}
        </div>
      </div>
    </section>
  );
}
