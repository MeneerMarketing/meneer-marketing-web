"use client";

import { useEffect, useState } from "react";

import { businessEmail, mailtoHref, whatsappHref } from "@/lib/contact";

type LgeVertical = "pilates-studios" | "huidklinieken";

interface LgeFloatingContactProps {
  vertical: LgeVertical;
}

const WA_MESSAGE: Record<LgeVertical, string> = {
  "pilates-studios":
    "Hoi! Ik heb een vraag over de studio-aanpak op meneermarketing.nl.",
  huidklinieken:
    "Hoi! Ik heb een vraag over de kliniek-aanpak op meneermarketing.nl.",
};

export function LgeFloatingContact({ vertical }: LgeFloatingContactProps) {
  const [expanded, setExpanded] = useState(false);
  const wa = whatsappHref(WA_MESSAGE[vertical]);

  useEffect(() => {
    function onScroll(): void {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      if (max <= 0) return;
      setExpanded(doc.scrollTop / max >= 0.5);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6"
      aria-label="Snel contact"
    >
      {expanded && wa ? (
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-bold text-white shadow-lg transition hover:brightness-110"
        >
          App me op WhatsApp
        </a>
      ) : null}

      <div className="flex gap-2">
        <a
          href={mailtoHref({
            subject:
              vertical === "pilates-studios"
                ? "Vraag over Pilates studio"
                : "Vraag over huidkliniek",
          })}
          className="inline-flex size-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-lg transition hover:border-[#FF5722] hover:text-[#FF5722]"
          aria-label={`Mail ${businessEmail}`}
        >
          <span className="text-lg" aria-hidden>
            ✉
          </span>
        </a>

        {wa ? (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex size-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:brightness-110"
            aria-label="WhatsApp"
          >
            <span className="text-lg font-bold" aria-hidden>
              WA
            </span>
          </a>
        ) : null}
      </div>
    </div>
  );
}
