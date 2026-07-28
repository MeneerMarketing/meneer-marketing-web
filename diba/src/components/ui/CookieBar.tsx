"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { figmaBtnMint } from "@/lib/figma-home-layout";
import { acceptCookieConsent, COOKIE_CONSENT_KEY } from "@/lib/cookie-consent";

export default function CookieBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = (() => {
      try {
        return localStorage.getItem(COOKIE_CONSENT_KEY) !== "1";
      } catch {
        return true;
      }
    })();
    if (!show) return;
    requestAnimationFrame(() => setVisible(true));
  }, []);

  if (!visible) return null;

  function accept() {
    acceptCookieConsent();
    setVisible(false);
  }

  return (
    <div
      role="dialog"
      aria-label="Cookievoorkeuren"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[#dce8d9] bg-[#fcfdfb]/95 px-5 py-4 backdrop-blur-sm pb-[calc(1rem+env(safe-area-inset-bottom))] md:px-9"
    >
      <div className="mx-auto flex max-w-[1800px] flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="max-w-xl text-[14px] leading-relaxed text-[#5f7765]">
          We gebruiken cookies voor een werkende site en anonieme statistieken. Geen
          advertentie-tracking.
        </p>
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <button type="button" onClick={accept} className={figmaBtnMint}>
            Akkoord ↗
          </button>
          <Link
            href="/cookiebeleid"
            className="inline-flex h-12 items-center px-2 text-[13px] font-medium text-[#286943] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#286943]"
          >
            Instellingen
          </Link>
        </div>
      </div>
    </div>
  );
}
