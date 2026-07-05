"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { siteCtas } from "@/lib/cta";

/** Vaste conversiebalk onderaan op mobiel, na scroll voorbij hero. */
export function HomeMobileStickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const threshold = Math.min(420, window.innerHeight * 0.55);

    function onScroll() {
      setVisible(window.scrollY > threshold);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-50 lg:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      } transition-transform duration-300 ease-out`}
      aria-hidden={!visible}
    >
      <div className="pointer-events-auto border-t border-slate-200/90 bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_40px_-12px_rgba(15,23,42,0.18)] backdrop-blur-md">
        <Link
          href={siteCtas.startIntake.href}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FF5722] px-5 py-3.5 text-base font-bold text-white shadow-lg shadow-[#FF5722]/25 transition active:scale-[0.98]"
        >
          Plan een gesprek
          <ArrowUpRight className="size-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
