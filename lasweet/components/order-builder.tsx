"use client";

import { useMemo, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  CheckIcon,
  CopyIcon,
  MinusIcon,
  PlusIcon,
  PaperPlaneRightIcon,
} from "@phosphor-icons/react";

const INSTAGRAM_DM_URL = "https://ig.me/m/la.sweetbyela";
const MIN_COOKIES = 4;
const SATURDAY_OPTIONS = 12;

const COOKIE_FLAVOURS = [
  "Red velvet aardbei",
  "Tiramisu",
  "Brownie Kinder Bueno",
  "Witte Kinder Bueno",
  "Appel crumble",
  "Lotus",
  "Matcha",
] as const;

type QtyMap = Record<string, number>;

function emptyQty(keys: readonly string[]): QtyMap {
  return Object.fromEntries(keys.map((key) => [key, 0]));
}

function linesFromQty(qty: QtyMap): string[] {
  return Object.entries(qty)
    .filter(([, n]) => n > 0)
    .map(([name, n]) => `${n}× ${name}`);
}

function totalQty(qty: QtyMap): number {
  return Object.values(qty).reduce((sum, n) => sum + n, 0);
}

/** Komende zaterdagen als YYYY-MM-DD (alleen openingsdag). */
function upcomingSaturdays(count = SATURDAY_OPTIONS): string[] {
  const dates: string[] = [];
  const cursor = new Date();
  cursor.setHours(12, 0, 0, 0);
  const day = cursor.getDay();
  const daysUntilSaturday = day === 6 ? 0 : (6 - day + 7) % 7;
  cursor.setDate(cursor.getDate() + daysUntilSaturday);

  for (let i = 0; i < count; i += 1) {
    const year = cursor.getFullYear();
    const month = String(cursor.getMonth() + 1).padStart(2, "0");
    const dayNum = String(cursor.getDate()).padStart(2, "0");
    dates.push(`${year}-${month}-${dayNum}`);
    cursor.setDate(cursor.getDate() + 7);
  }

  return dates;
}

function formatSaturdayLabel(isoDate: string): string {
  const date = new Date(`${isoDate}T12:00:00`);
  return date.toLocaleDateString("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function QtyStepper({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (next: number) => void;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label={`Minder ${label}`}
        disabled={value <= 0}
        onClick={() => onChange(Math.max(0, value - 1))}
        className="flex size-9 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:border-matcha hover:text-matcha-deep disabled:cursor-not-allowed disabled:opacity-35"
      >
        <MinusIcon size={14} weight="bold" />
      </button>
      <span className="w-7 text-center font-display text-lg font-bold text-ink tabular-nums">
        {value}
      </span>
      <button
        type="button"
        aria-label={`Meer ${label}`}
        onClick={() => onChange(value + 1)}
        className="flex size-9 items-center justify-center rounded-full border border-ink/15 bg-matcha-mist text-matcha-deep transition-colors hover:bg-matcha hover:text-cream"
      >
        <PlusIcon size={14} weight="bold" />
      </button>
    </div>
  );
}

export function OrderBuilder() {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [occasion, setOccasion] = useState("");
  const [notes, setNotes] = useState("");
  const [cookies, setCookies] = useState<QtyMap>(() =>
    emptyQty(COOKIE_FLAVOURS),
  );
  const [message, setMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  const cookieTotal = useMemo(() => totalQty(cookies), [cookies]);
  const cookieLines = useMemo(() => linesFromQty(cookies), [cookies]);
  const saturdayOptions = useMemo(() => upcomingSaturdays(), []);

  function setCookieQty(flavour: string, next: number) {
    setCookies((prev) => ({ ...prev, [flavour]: next }));
    setMessage(null);
  }

  function buildMessage(): string {
    const pickupLabel = date ? formatSaturdayLabel(date) : date;
    const parts: string[] = [
      `Hoi Ela! Ik wil graag een cookie box bestellen bij Lá Sweet.`,
      `Naam: ${name.trim()}`,
      `Afhalen op zaterdag: ${pickupLabel} (${date})`,
    ];

    if (occasion.trim()) {
      parts.push(`Gelegenheid: ${occasion.trim()}`);
    }

    parts.push(`Cookies (${cookieTotal}): ${cookieLines.join(", ")}`);

    if (notes.trim()) {
      parts.push(`Extra: ${notes.trim()}`);
    }

    parts.push("Groetjes!");
    return parts.join("\n");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (cookieTotal === 0) {
      setError("Kies minstens één cookie-smaak.");
      return;
    }

    if (cookieTotal < MIN_COOKIES) {
      setError(
        `Cookies vanaf ${MIN_COOKIES} stuks per box. Je zit nu op ${cookieTotal}.`,
      );
      return;
    }

    setMessage(buildMessage());
    setCopied(false);
  }

  async function handleCopy() {
    if (!message) return;
    await navigator.clipboard.writeText(message);
    setCopied(true);
  }

  return (
    <div className="rounded-[2rem] border border-ink/10 bg-white p-5 shadow-[0_32px_80px_-40px_rgba(68,57,43,0.35)] sm:p-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-10">
        <fieldset>
          <legend className="font-display text-2xl font-semibold tracking-[-0.04em] text-ink">
            Cookies
          </legend>
          <p className="mt-1 text-sm text-ink-soft">
            Vanaf {MIN_COOKIES} per box. Mix de smaken zoals jij wilt.
          </p>
          <ul className="mt-5 divide-y divide-ink/10 rounded-2xl border border-ink/10">
            {COOKIE_FLAVOURS.map((flavour) => {
              const active = cookies[flavour] > 0;
              return (
                <li
                  key={flavour}
                  className={`flex items-center justify-between gap-3 px-4 py-3.5 transition-colors ${
                    active ? "bg-matcha-mist/50" : "bg-cream/40"
                  }`}
                >
                  <span
                    className={`font-display text-base font-bold tracking-tight ${
                      active ? "text-matcha-deep" : "text-ink"
                    }`}
                  >
                    {flavour}
                  </span>
                  <QtyStepper
                    value={cookies[flavour]}
                    label={flavour}
                    onChange={(next) => setCookieQty(flavour, next)}
                  />
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-sm text-ink-soft">
            Gekozen:{" "}
            <span className="font-semibold text-ink">
              {cookieTotal} cookie{cookieTotal === 1 ? "" : "s"}
            </span>
            {cookieTotal > 0 && cookieTotal < MIN_COOKIES && (
              <span className="text-beige-deep">
                {" "}
                (nog {MIN_COOKIES - cookieTotal} tot een box)
              </span>
            )}
          </p>
        </fieldset>

        <p className="rounded-2xl bg-beige-mist px-5 py-4 text-sm leading-relaxed text-beige-deep">
          Matcha drink je op locatie. Walk-in op zaterdag van 14:00 tot 20:00
          aan de Haaksbergerstraat 302.
        </p>

        <fieldset className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <legend className="mb-4 font-display text-2xl font-semibold tracking-[-0.04em] text-ink sm:col-span-2">
            Afhalen &amp; gegevens
          </legend>

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
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Bijv. Sanne"
              className="rounded-xl border border-ink/15 bg-cream/60 px-4 py-3 text-sm text-ink placeholder:text-ink-soft/70 focus:border-matcha focus:outline-none focus:ring-2 focus:ring-matcha/30"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="order-date"
              className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink"
            >
              Afhalen op zaterdag
            </label>
            <select
              id="order-date"
              name="date"
              required
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setMessage(null);
              }}
              className="rounded-xl border border-ink/15 bg-cream/60 px-4 py-3 text-sm text-ink focus:border-matcha focus:outline-none focus:ring-2 focus:ring-matcha/30"
            >
              <option value="" disabled>
                Kies een zaterdag
              </option>
              {saturdayOptions.map((iso) => (
                <option key={iso} value={iso}>
                  {formatSaturdayLabel(iso)}
                </option>
              ))}
            </select>
            <p className="text-xs text-ink-soft">
              Alleen zaterdag open, van 14:00 tot 20:00.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:col-span-2">
            <label
              htmlFor="order-occasion"
              className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink"
            >
              Gelegenheid{" "}
              <span className="font-medium normal-case tracking-normal text-ink-soft">
                (optioneel)
              </span>
            </label>
            <input
              id="order-occasion"
              name="occasion"
              type="text"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              placeholder="Verjaardag, bruiloft, babyshower, gewoon omdat het kan"
              className="rounded-xl border border-ink/15 bg-cream/60 px-4 py-3 text-sm text-ink placeholder:text-ink-soft/70 focus:border-matcha focus:outline-none focus:ring-2 focus:ring-matcha/30"
            />
          </div>

          <div className="flex flex-col gap-2 sm:col-span-2">
            <label
              htmlFor="order-notes"
              className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink"
            >
              Extra wensen{" "}
              <span className="font-medium normal-case tracking-normal text-ink-soft">
                (optioneel)
              </span>
            </label>
            <textarea
              id="order-notes"
              name="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Allergieën, kaartje erbij, ophaaltijd, iets leuks"
              className="resize-none rounded-xl border border-ink/15 bg-cream/60 px-4 py-3 text-sm text-ink placeholder:text-ink-soft/70 focus:border-matcha focus:outline-none focus:ring-2 focus:ring-matcha/30"
            />
          </div>
        </fieldset>

        <div className="rounded-2xl bg-parchment/80 p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft">
            Jouw bestelling
          </p>
          {cookieTotal === 0 ? (
            <p className="mt-2 text-sm text-ink-soft">
              Nog niks gekozen. Tik de + bij een smaak.
            </p>
          ) : (
            <ul className="mt-3 space-y-1.5 text-sm text-ink">
              {cookieLines.map((line) => (
                <li key={line} className="font-medium">
                  {line}
                </li>
              ))}
            </ul>
          )}
        </div>

        {error && (
          <p
            className="rounded-xl bg-matcha-mist px-4 py-3 text-sm font-medium text-matcha-deep"
            role="alert"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          className="group flex w-full items-center justify-center gap-2 rounded-full bg-matcha px-7 py-4 text-[13px] font-bold uppercase tracking-[0.12em] text-cream transition-all duration-300 hover:bg-matcha-deep active:scale-[0.98]"
        >
          Bestellen en betalen
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-300 group-hover:translate-x-1"
          >
            &rarr;
          </span>
        </button>
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
            <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-relaxed text-ink">
              {message}
            </pre>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-2 rounded-full border border-matcha px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.12em] text-matcha-deep transition-all duration-200 hover:bg-matcha hover:text-cream active:scale-[0.98]"
              >
                {copied ? (
                  <CheckIcon size={15} weight="bold" />
                ) : (
                  <CopyIcon size={15} weight="bold" />
                )}
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
            <p className="mt-3 text-xs leading-relaxed text-ink-soft">
              Plak het bericht in de DM. Ela bevestigt beschikbaarheid en prijs.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
