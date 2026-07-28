"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { figmaBtnMint, figmaBtnPrimary } from "@/lib/figma-home-layout";

/**
 * Mobiele sticky balk op behandel- en pillarpagina's.
 * Verschijnt bij scrollen omlaag, verdwijnt bij scrollen omhoog.
 */

export type StickyActionBarProps = {
  whatsappHref: string;
  intakeHref: string;
  questionLabel?: string;
  intakeLabel?: string;
};

export default function StickyActionBar({
  whatsappHref,
  intakeHref,
  questionLabel = "Vraag stellen",
  intakeLabel = "Start uw intake",
}: StickyActionBarProps) {
  const [visible, setVisible] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      if (Math.abs(delta) < 8) return;
      setVisible(delta > 0 && y > 120);
      lastY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      inert={!visible || undefined}
      className={`fixed inset-x-0 bottom-0 z-40 md:hidden
                  border-t border-[#dce8d9] bg-[#fcfdfb]/95 backdrop-blur-sm
                  shadow-[0_-8px_32px_rgba(15,45,28,.08)]
                  pb-[env(safe-area-inset-bottom)]
                  transition-transform duration-300 ease-out
                  motion-reduce:transition-none
                  ${visible ? "translate-y-0" : "translate-y-full"}`}
    >
      <div className="grid grid-cols-2 items-center gap-2 p-3">
        <Link
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className={`${figmaBtnMint} block py-3.5 text-center text-[10px]`}
        >
          {questionLabel}
        </Link>
        <Link href={intakeHref} className={`${figmaBtnPrimary} block py-3.5 text-center text-[10px]`}>
          {intakeLabel}
        </Link>
      </div>
    </div>
  );
}
