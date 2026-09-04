"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  CheckIcon,
  CopyIcon,
  PaperPlaneRightIcon,
} from "@phosphor-icons/react";

const AMOUNTS = ["4", "8", "12", "meer dan 12"] as const;
const INSTAGRAM_DM_URL = "https://ig.me/m/la.sweetbyela";

interface OrderDetails {
  name: string;
  date: string;
  amount: string;
  wishes: string;
}

function buildMessage({ name, date, amount, wishes }: OrderDetails): string {
  const wishLine = wishes.trim() ? ` Wensen: ${wishes.trim()}.` : "";
  return `Hoi Ela! Ik wil graag een box bestellen: ${amount} cookies, op te halen rond ${date}.${wishLine} Groetjes, ${name}`;
}

export function OrderForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const reduceMotion = useReducedMotion();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setMessage(
      buildMessage({
        name: String(data.get("name") ?? ""),
        date: String(data.get("date") ?? ""),
        amount: String(data.get("amount") ?? ""),
        wishes: String(data.get("wishes") ?? ""),
      }),
    );
    setCopied(false);
  }

  async function handleCopy() {
    if (!message) return;
    await navigator.clipboard.writeText(message);
    setCopied(true);
  }

  return (
    <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-[0_32px_80px_-40px_rgba(68,57,43,0.35)] md:p-8">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="order-name"
            className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink"
          >
            Je naam
          </label>
          <input
            id="order-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Bijv. Sanne"
            className="rounded-xl border border-ink/15 bg-cream/60 px-4 py-3 text-sm text-ink placeholder:text-ink-soft/70 focus:border-matcha focus:outline-none focus:ring-2 focus:ring-matcha/30"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="order-date"
            className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink"
          >
            Wanneer nodig
          </label>
          <input
            id="order-date"
            name="date"
            type="date"
            required
            className="rounded-xl border border-ink/15 bg-cream/60 px-4 py-3 text-sm text-ink focus:border-matcha focus:outline-none focus:ring-2 focus:ring-matcha/30"
          />
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink">
            Hoeveel cookies
          </span>
          <div className="flex flex-wrap gap-2">
            {AMOUNTS.map((amount, index) => (
              <label key={amount} className="cursor-pointer">
                <input
                  type="radio"
                  name="amount"
                  value={amount}
                  defaultChecked={index === 0}
                  className="peer sr-only"
                />
                <span className="inline-block rounded-full border border-ink/15 px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.12em] text-ink transition-all duration-200 peer-checked:border-matcha peer-checked:bg-matcha peer-checked:text-cream peer-focus-visible:ring-2 peer-focus-visible:ring-matcha/40">
                  {amount}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <label
            htmlFor="order-wishes"
            className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink"
          >
            Smaken of gelegenheid
          </label>
          <textarea
            id="order-wishes"
            name="wishes"
            rows={3}
            placeholder="Bijv. verjaardag, het liefst red velvet en kinder bueno"
            className="resize-none rounded-xl border border-ink/15 bg-cream/60 px-4 py-3 text-sm text-ink placeholder:text-ink-soft/70 focus:border-matcha focus:outline-none focus:ring-2 focus:ring-matcha/30"
          />
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            className="group flex w-full items-center justify-center gap-2 rounded-full bg-matcha px-7 py-4 text-[13px] font-bold uppercase tracking-[0.12em] text-cream transition-all duration-300 hover:bg-matcha-deep active:scale-[0.98]"
          >
            Maak mijn aanvraag
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-300 group-hover:translate-x-1"
            >
              &rarr;
            </span>
          </button>
        </div>
      </form>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 rounded-2xl bg-matcha-mist p-5"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-matcha-deep">
              Jouw bericht staat klaar
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink">{message}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-2 rounded-full border border-matcha px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.12em] text-matcha-deep transition-all duration-200 hover:bg-matcha hover:text-cream active:scale-[0.98]"
              >
                {copied ? <CheckIcon size={15} weight="bold" /> : <CopyIcon size={15} weight="bold" />}
                {copied ? "Gekopieerd" : "Kopieer bericht"}
              </button>
              <a
                href={INSTAGRAM_DM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full bg-matcha-deep px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.12em] text-cream transition-all duration-200 hover:bg-ink active:scale-[0.98]"
              >
                <PaperPlaneRightIcon size={15} weight="bold" />
                Stuur via Instagram
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
