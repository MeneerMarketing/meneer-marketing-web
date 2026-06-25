"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  CONSENT_CHANGED_EVENT,
  CONSENT_OPEN_EVENT,
  readConsent,
  writeConsent,
} from "@/components/consent/consent-storage";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const syncVisibility = useCallback(() => {
    const c = readConsent();
    setVisible(!c);
  }, []);

  useEffect(() => {
    setHydrated(true);
    syncVisibility();
  }, [syncVisibility]);

  useEffect(() => {
    const onChanged = () => syncVisibility();
    const onOpen = () => setVisible(true);
    window.addEventListener(CONSENT_CHANGED_EVENT, onChanged);
    window.addEventListener(CONSENT_OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener(CONSENT_CHANGED_EVENT, onChanged);
      window.removeEventListener(CONSENT_OPEN_EVENT, onOpen);
    };
  }, [syncVisibility]);

  function acceptNecessaryOnly() {
    writeConsent(false);
    setVisible(false);
  }

  function acceptWithAnalytics() {
    writeConsent(true);
    setVisible(false);
  }

  if (!hydrated) return null;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-banner-title"
          aria-describedby="cookie-banner-desc"
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="fixed inset-x-0 bottom-0 z-[90] px-4 pb-4 sm:px-6 sm:pb-6"
        >
          <div className="mx-auto max-w-4xl rounded-3xl border border-mm-border bg-white/95 p-6 shadow-mm-float backdrop-blur-md sm:p-8">
            <h2
              id="cookie-banner-title"
              className="text-lg font-extrabold text-mm-text sm:text-xl"
            >
              Cookies &amp; privacy
            </h2>
            <p
              id="cookie-banner-desc"
              className="mt-3 text-sm leading-relaxed text-mm-muted"
            >
              We gebruiken noodzakelijke cookies om de site goed te laten werken.
              Met jouw toestemming mogen we ook anonieme statistiek gebruiken om
              de site te verbeteren.{" "}
              <Link
                href="/cookiebeleid"
                className="font-bold text-mm-sky-deep underline-offset-2 hover:underline"
              >
                Cookiebeleid
              </Link>
              {" · "}
              <Link
                href="/privacybeleid"
                className="font-bold text-mm-sky-deep underline-offset-2 hover:underline"
              >
                Privacy
              </Link>
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={acceptNecessaryOnly}
                className="order-2 rounded-full border-2 border-mm-border px-5 py-3 text-sm font-bold text-mm-text transition hover:bg-mm-surface sm:order-1"
              >
                Alleen noodzakelijk
              </button>
              <button
                type="button"
                onClick={acceptWithAnalytics}
                className="order-1 rounded-full bg-mm-accent px-5 py-3 text-sm font-bold text-white shadow-md shadow-mm-accent/25 transition hover:bg-mm-accent-hover sm:order-2"
              >
                Sta statistiek toe
              </button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
