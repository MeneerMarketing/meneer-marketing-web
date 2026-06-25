"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import { ArrowUpRight, Bot, Palette, ShoppingBag, Workflow } from "lucide-react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface ServiceTile {
  title: string;
  text: string;
  href: string;
  Icon: typeof ShoppingBag;
  accent: string;
}

const SERVICES: ServiceTile[] = [
  {
    title: "Webshops & Sites",
    text: "Snel, mooi en gebouwd om bezoekers in klanten te veranderen.",
    href: "/bouwen",
    Icon: ShoppingBag,
    accent: "#FF5722",
  },
  {
    title: "Automatisering",
    text: "We knopen je systemen aan elkaar zodat jij geen dubbel werk meer doet.",
    href: "/automatiseren",
    Icon: Workflow,
    accent: "#00BCD4",
  },
  {
    title: "AI & Chatbots",
    text: "Slimme assistenten die je klantenservice overnemen, dag en nacht.",
    href: "/diensten/chatbots",
    Icon: Bot,
    accent: "#0F172A",
  },
  {
    title: "Vormgeving",
    text: "Een merkidentiteit die direct laat zien dat jij de expert bent in jouw markt.",
    href: "/vormgeven",
    Icon: Palette,
    accent: "#FF5722",
  },
];

const FOLD_PRESETS = [
  { rx: -95, ry: 10, ox: "center bottom" },
  { rx: 20, ry: 95, ox: "right center" },
  { rx: -20, ry: -95, ox: "left center" },
  { rx: 95, ry: -10, ox: "center top" },
] as const;

export function ServicesOrigamiBento() {
  const rootRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);

  useGSAP(
    () => {
      const cards = cardsRef.current.filter(
        (el): el is HTMLDivElement => el !== null,
      );
      if (cards.length === 0) return;

      cards.forEach((card, i) => {
        const preset = FOLD_PRESETS[i % FOLD_PRESETS.length];
        gsap.set(card, {
          rotateX: preset.rx,
          rotateY: preset.ry,
          transformOrigin: preset.ox,
          opacity: 0,
          y: 40,
        });
      });

      gsap.to(cards, {
        rotateX: 0,
        rotateY: 0,
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.14,
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 78%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: rootRef },
  );

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="relative border-y border-slate-200 bg-white py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
              Diensten
            </p>
            <h2
              id="services-heading"
              className="mt-3 text-4xl font-extrabold tracking-tighter text-slate-900 sm:text-5xl"
            >
              Wat we voor je uit handen nemen.
            </h2>
          </div>
          <Link
            href="/diensten"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold tracking-tight text-slate-900 transition hover:border-slate-900"
          >
            Alle diensten
            <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div
          ref={rootRef}
          className="mt-12 grid gap-5 sm:grid-cols-2"
          style={{ perspective: "1400px" }}
          onMouseLeave={() => setHovered(null)}
        >
          {SERVICES.map((svc, i) => {
            const isDim = hovered !== null && hovered !== i;
            return (
              <div
                key={svc.title}
                ref={(el) => {
                  cardsRef.current[i] = el;
                }}
                className="will-change-transform"
                style={{ transformStyle: "preserve-3d" }}
                onMouseEnter={() => setHovered(i)}
              >
                <Link
                  href={svc.href}
                  className={`group relative flex h-full flex-col gap-5 rounded-3xl border border-slate-200 bg-white p-7 transition-[transform,border-color,box-shadow,opacity,filter] duration-300 sm:p-8 ${
                    isDim
                      ? "opacity-55 blur-[0.3px]"
                      : "opacity-100 hover:-translate-y-1 hover:border-slate-300"
                  }`}
                  style={{
                    boxShadow:
                      hovered === i
                        ? `0 24px 56px -18px ${svc.accent}55, 0 4px 12px -4px rgba(15,23,42,0.08)`
                        : "0 1px 2px rgba(15,23,42,0.04), 0 8px 22px -8px rgba(15,23,42,0.08)",
                  }}
                >
                  <div className="flex items-start justify-between">
                    <span
                      className="flex size-14 items-center justify-center rounded-2xl text-white"
                      style={{ backgroundColor: svc.accent }}
                      aria-hidden
                    >
                      <svc.Icon className="size-7" strokeWidth={2} />
                    </span>
                    <ArrowUpRight
                      className="size-5 text-slate-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-slate-900"
                      aria-hidden
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold tracking-tighter text-slate-900">
                      {svc.title}
                    </h3>
                    <p className="mt-2 text-base leading-relaxed text-slate-600">
                      {svc.text}
                    </p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
