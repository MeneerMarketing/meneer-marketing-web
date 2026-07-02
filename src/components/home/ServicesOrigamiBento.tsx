"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  useCallback,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import {
  ArrowUpRight,
  LayoutTemplate,
  Mail,
  Megaphone,
  Palette,
  Search,
  Share2,
  ShoppingBag,
  Sparkles,
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
  cta?: false;
}

interface CtaTile {
  title: string;
  text: string;
  href: string;
  cta: true;
}

type GridTile = ServiceTile | CtaTile;

const SERVICES: GridTile[] = [
  {
    title: "Websites from scratch",
    text: "High-end sites, custom gebouwd. Snel, veilig en ingericht volgens Google.",
    href: "/diensten/webdevelopment",
    Icon: LayoutTemplate,
    accent: "#0F172A",
  },
  {
    title: "Shopify webshops",
    text: "Shopify-expert. Webshops die verkopen, snel laden en meegroeien.",
    href: "/diensten/shopify-enterprise",
    Icon: ShoppingBag,
    accent: "#FF5722",
  },
  {
    title: "Groeistrategie",
    text: "Welke kanalen, welke boodschap en wat je eerst aanpakt voor meer omzet.",
    href: "/strategie",
    Icon: TrendingUp,
    accent: "#FF5722",
  },
  {
    title: "SEO",
    text: "Gevonden worden in Google via content, structuur en techniek.",
    href: "/diensten/seo",
    Icon: Search,
    accent: "#00BCD4",
  },
  {
    title: "Google Ads & Meta Ads",
    text: "Campagnes meten, bijsturen en opschalen wat echt werkt.",
    href: "/diensten/google-ads",
    Icon: Megaphone,
    accent: "#0F172A",
  },
  {
    title: "Social media",
    text: "Content en campagnes op social, afgestemd op je merk.",
    href: "/diensten/social-media",
    Icon: Share2,
    accent: "#00BCD4",
  },
  {
    title: "E-mailmarketing",
    text: "Nieuwsbrieven en flows die klanten binden en verkopen helpen.",
    href: "/diensten/email",
    Icon: Mail,
    accent: "#FF5722",
  },
  {
    title: "Branding & design",
    text: "Een merkidentiteit die direct laat zien dat jij de expert bent.",
    href: "/diensten/branding",
    Icon: Palette,
    accent: "#0F172A",
  },
  {
    title: "Bekijk alle diensten",
    text: "AI-zoek, UGC, influencers, automatisering en meer. Alles op één plek.",
    href: "/diensten",
    cta: true,
  },
];

const FOLD_PRESETS = [
  { rx: -88, ry: 12, ox: "center bottom" },
  { rx: 18, ry: 88, ox: "right center" },
  { rx: -18, ry: -88, ox: "left center" },
  { rx: 88, ry: -12, ox: "center top" },
  { rx: -55, ry: 55, ox: "center bottom" },
  { rx: 55, ry: -55, ox: "right center" },
  { rx: -12, ry: 72, ox: "left center" },
  { rx: 72, ry: 12, ox: "center top" },
  { rx: -40, ry: -40, ox: "center center" },
] as const;

function isCtaTile(tile: GridTile): tile is CtaTile {
  return "cta" in tile && tile.cta === true;
}

function ServiceCard({
  tile,
  isDim,
  isActive,
  onEnter,
  onLeave,
  onMove,
  cardRef,
}: {
  tile: GridTile;
  isDim: boolean;
  isActive: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onMove: (e: ReactMouseEvent<HTMLDivElement>) => void;
  cardRef: (el: HTMLDivElement | null) => void;
}) {
  const cta = isCtaTile(tile);

  return (
    <div
      ref={cardRef}
      className="will-change-transform"
      style={{ transformStyle: "preserve-3d" }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onMouseMove={onMove}
    >
      <Link
        href={tile.href}
        className={`group relative flex h-full min-h-[220px] flex-col justify-between gap-5 overflow-hidden rounded-3xl border p-6 transition-[transform,border-color,box-shadow,opacity,filter] duration-300 sm:min-h-[240px] sm:p-7 ${
          cta
            ? "border-[#FF5722]/30 bg-gradient-to-br from-[#FF5722] via-[#FF5722] to-[#E64A19] text-white"
            : "border-slate-200 bg-white"
        } ${
          isDim
            ? "opacity-45 blur-[0.4px] saturate-50"
            : "opacity-100 hover:border-slate-300"
        } ${isActive && !cta ? "-translate-y-1" : ""}`}
        style={
          !cta && isActive
            ? {
                boxShadow: `0 28px 60px -20px ${(tile as ServiceTile).accent}66, 0 4px 12px -4px rgba(15,23,42,0.08)`,
              }
            : cta
              ? {
                  boxShadow: isActive
                    ? "0 28px 60px -20px rgba(255,87,34,0.55)"
                    : "0 12px 32px -12px rgba(255,87,34,0.35)",
                }
              : {
                  boxShadow:
                    "0 1px 2px rgba(15,23,42,0.04), 0 8px 22px -8px rgba(15,23,42,0.08)",
                }
        }
      >
        {cta ? (
          <>
            <Sparkles
              className="pointer-events-none absolute -right-4 -top-4 size-28 text-white/10"
              strokeWidth={1}
              aria-hidden
            />
            <div className="relative z-10 flex items-start justify-between">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-sm">
                <ArrowUpRight className="size-7" strokeWidth={2.2} />
              </span>
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-extrabold tracking-tighter">
                {tile.title}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-white/85">
                {tile.text}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white">
                Naar overzicht
                <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
          </>
        ) : (
          <>
            <div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background: `radial-gradient(circle at 50% 0%, ${(tile as ServiceTile).accent}18, transparent 65%)`,
              }}
              aria-hidden
            />
            <div className="relative z-10 flex items-start justify-between">
              <span
                className="flex size-14 items-center justify-center rounded-2xl text-white transition-transform duration-300 group-hover:scale-105"
                style={{ backgroundColor: (tile as ServiceTile).accent }}
                aria-hidden
              >
                <tile.Icon className="size-7" strokeWidth={2} />
              </span>
              <ArrowUpRight
                className="size-5 text-slate-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-slate-900"
                aria-hidden
              />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-extrabold tracking-tighter text-slate-900 sm:text-2xl">
                {tile.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
                {tile.text}
              </p>
            </div>
          </>
        )}
      </Link>
    </div>
  );
}

export function ServicesOrigamiBento() {
  const sectionRef = useRef<HTMLElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);

  const handleSectionMove = useCallback((e: ReactMouseEvent<HTMLElement>) => {
    const el = spotlightRef.current;
    const section = sectionRef.current;
    if (!el || !section) return;
    const rect = section.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.transform = `translate(${x - 200}px, ${y - 200}px)`;
  }, []);

  const handleCardMove = useCallback(
    (index: number, e: ReactMouseEvent<HTMLDivElement>) => {
      const card = cardsRef.current[index];
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) scale3d(1.02, 1.02, 1.02)`;
    },
    [],
  );

  const handleCardLeave = useCallback((index: number) => {
    const card = cardsRef.current[index];
    if (!card) return;
    card.style.transform =
      "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  }, []);

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
          y: 36,
        });
      });

      gsap.to(cards, {
        rotateX: 0,
        rotateY: 0,
        opacity: 1,
        y: 0,
        duration: 0.85,
        stagger: 0.06,
        ease: "power3.out",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 80%",
          once: true,
        },
      });
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={sectionRef}
      id="services"
      aria-labelledby="services-heading"
      className="relative overflow-hidden border-y border-slate-200 bg-slate-50 py-20 sm:py-28"
      onMouseMove={handleSectionMove}
    >
      <div
        ref={spotlightRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 size-[400px] rounded-full bg-gradient-to-br from-[#FF5722]/12 via-[#00BCD4]/10 to-transparent blur-3xl transition-transform duration-300 ease-out will-change-transform"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FF5722]">
            Diensten
          </p>
          <h2
            id="services-heading"
            className="mt-3 text-4xl font-extrabold tracking-tighter text-slate-900 sm:text-5xl"
          >
            Eén Meneer. Een compleet marketingteam.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Strategie, websites, Shopify en alle marketing eromheen. Geen
            doorschuifwerk naar stagiairs, gewoon iemand die het zelf bouwt.
            Hover, kies, klik.
          </p>
        </div>

        <div
          ref={rootRef}
          className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3"
          style={{ perspective: "1400px" }}
          onMouseLeave={() => {
            setHovered(null);
            cardsRef.current.forEach((_, i) => handleCardLeave(i));
          }}
        >
          {SERVICES.map((tile, i) => (
            <ServiceCard
              key={tile.title}
              tile={tile}
              isDim={hovered !== null && hovered !== i}
              isActive={hovered === i}
              onEnter={() => setHovered(i)}
              onLeave={() => handleCardLeave(i)}
              onMove={(e) => handleCardMove(i, e)}
              cardRef={(el) => {
                cardsRef.current[i] = el;
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
