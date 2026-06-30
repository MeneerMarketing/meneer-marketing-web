"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import {
  ArrowUpRight,
  LayoutTemplate,
  Mail,
  Megaphone,
  Search,
  Share2,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface ServiceTile {
  title: string;
  text: string;
  href: string;
  Icon: typeof TrendingUp;
  accent: string;
  featured?: boolean;
}

const SERVICES: ServiceTile[] = [
  {
    title: "Maatwerk websites",
    text: "High-end sites from scratch: snel, veilig en perfect ingericht volgens Google's richtlijnen — Core Web Vitals, SEO-structuur en conversie.",
    href: "/diensten/webdevelopment",
    Icon: LayoutTemplate,
    accent: "#0F172A",
    featured: true,
  },
  {
    title: "Shopify webshops",
    text: "Shopify-expert: schaalbare webshops en thema's die verkopen, snel laden en klaar zijn voor marketing en groei.",
    href: "/diensten/shopify-enterprise",
    Icon: ShoppingBag,
    accent: "#FF5722",
    featured: true,
  },
  {
    title: "Groeistrategie & marketing",
    text: "Strategieën die het maximale halen: welke kanalen, welke boodschap en wat je eerst aanpakt voor meer klanten en omzet.",
    href: "/groeien",
    Icon: TrendingUp,
    accent: "#FF5722",
  },
  {
    title: "SEO & vindbaarheid",
    text: "Gevonden worden in Google — door content, structuur en techniek die écht helpen.",
    href: "/diensten/seo",
    Icon: Search,
    accent: "#00BCD4",
  },
  {
    title: "Google Ads & SEA",
    text: "Betaalde campagnes in Google en social. Meten, bijsturen en opschalen wat werkt.",
    href: "/diensten/adverteren",
    Icon: Megaphone,
    accent: "#0F172A",
  },
  {
    title: "Social media marketing",
    text: "Content, campagnes en advertenties op social — afgestemd op je merk en doelgroep.",
    href: "/diensten/adverteren",
    Icon: Share2,
    accent: "#00BCD4",
  },
  {
    title: "E-mailmarketing",
    text: "Nieuwsbrieven en automatische mails die klanten binden en verkopen ondersteunen.",
    href: "/diensten/email",
    Icon: Mail,
    accent: "#FF5722",
  },
];

const EXTRA_SERVICES = [
  { label: "Automatisering", href: "/diensten/automatisering" },
  { label: "Branding & design", href: "/diensten/branding" },
  { label: "Tracking & analytics", href: "/diensten/tracking" },
  { label: "CRO & conversie", href: "/diensten/cro" },
  { label: "AI & chatbots", href: "/diensten/chatbots" },
] as const;

const FOLD_PRESETS = [
  { rx: -95, ry: 10, ox: "center bottom" },
  { rx: 20, ry: 95, ox: "right center" },
  { rx: -20, ry: -95, ox: "left center" },
  { rx: 95, ry: -10, ox: "center top" },
  { rx: -70, ry: 45, ox: "center bottom" },
  { rx: 35, ry: -80, ox: "right center" },
  { rx: -15, ry: 70, ox: "left center" },
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
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 82%",
          once: true,
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
              Waar wij in uitblinken
            </p>
            <h2
              id="services-heading"
              className="mt-3 text-4xl font-extrabold tracking-tighter text-slate-900 sm:text-5xl"
            >
              Marketing, websites &amp; Shopify.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600">
              Groeistrategieën, SEO, ads, social en e-mail — plus high-end
              websites en Shopify-webshops die technisch en visueel op topniveau
              zijn. Wij bedenken het plan én voeren het uit.
            </p>
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
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
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
                className={`will-change-transform ${
                  svc.featured ? "sm:col-span-1 lg:col-span-1" : ""
                }`}
                style={{ transformStyle: "preserve-3d" }}
                onMouseEnter={() => setHovered(i)}
              >
                <Link
                  href={svc.href}
                  className={`group relative flex h-full flex-col gap-5 rounded-3xl border bg-white p-7 transition-[transform,border-color,box-shadow,opacity,filter] duration-300 sm:p-8 ${
                    svc.featured
                      ? "border-slate-300 ring-1 ring-slate-200/80"
                      : "border-slate-200"
                  } ${
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
                  {svc.featured ? (
                    <span className="absolute right-6 top-6 rounded-full bg-slate-900 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                      Expert
                    </span>
                  ) : null}
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

        <div className="mt-10 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-5 py-5 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Ook beschikbaar
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {EXTRA_SERVICES.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
              >
                {item.label}
                <ArrowUpRight className="size-3.5 opacity-60" aria-hidden />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
