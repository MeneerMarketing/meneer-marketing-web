"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  useMotionValue,
  animate,
  type MotionValue,
} from "framer-motion";
import {
  ArrowUpRight,
  Compass,
  Flag,
  Hammer,
  Heart,
  Megaphone,
  Pause,
  Play,
  Search,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import { siteCtas } from "@/lib/cta";

const TOUR_DURATION_S = 20;
const ROUTE_PATH =
  "M 32 58 C 120 22, 168 78, 256 58 S 392 22, 480 58 S 616 78, 704 58 S 792 22, 856 58";

const VIEW_W = 888;
const VIEW_H = 96;
const VIEW_PAD = 52;
const VIEW_BOX_W = VIEW_W + VIEW_PAD * 2;

function stopLeftPct(x: number): number {
  return ((x + VIEW_PAD) / VIEW_BOX_W) * 100;
}

interface RouteStop {
  id: string;
  pillar: string;
  chipLabel: string;
  journeyLabel: string;
  href: string;
  hook: string;
  meneer: string;
  icon: LucideIcon;
  accent: string;
  at: number;
}

const IDEAL_ROUTE: RouteStop[] = [
  {
    id: "strategie",
    pillar: "Strategie",
    chipLabel: "Denken vóór pixels",
    journeyLabel: "Eerst weten waar je winst zit en wat je als eerste aanpakt.",
    href: "/strategie",
    hook: "Groeiplan, kanalen en budget in één routekaart. Drie keuzes die renderen, niet twintig dingen tegelijk.",
    meneer: "Zonder plan is elke euro een gok. Behalve aan koffie. Die mag.",
    icon: Compass,
    accent: "#FF5722",
    at: 0,
  },
  {
    id: "bouwen",
    pillar: "Bouwen",
    chipLabel: "Bouwen zonder drama",
    journeyLabel: "Website of shop from scratch. Snel, strak, klaar om te verkopen.",
    href: "/bouwen",
    hook: "Custom code, snelle laadtijd, alles meetbaar vanaf dag één. Code die meeschaaft, geen page builder die je later remt.",
    meneer: "Ads op een rommelige site is geld verbranden. Site en SEO eerst, dan pas volume.",
    icon: Hammer,
    accent: "#45382C",
    at: 0.22,
  },
  {
    id: "vindbaarheid",
    pillar: "Vindbaarheid",
    chipLabel: "Google én AI kent je",
    journeyLabel: "Google én vindbaar in ChatGPT en Gemini.",
    href: "/vindbaarheid",
    hook: "SEO, content en techniek die elke week autoriteit opbouwen. Organisch eerst, ads als het fundament staat.",
    meneer: "15% van alle zoekopdrachten is gloednieuw. Daar pik je winst zonder te bieden.",
    icon: Search,
    accent: "#0284C7",
    at: 0.44,
  },
  {
    id: "campagnes",
    pillar: "Campagnes",
    chipLabel: "Ads met hersens",
    journeyLabel: "Google Ads en Meta Ads op pagina's die al converteren.",
    href: "/campagnes",
    hook: "Klein testen, scherp meten, opschalen wat winst oplevert. Landings, targeting en budget op één lijn.",
    meneer: "Gas geven mag. Pas als meten klopt. Anders betaal je voor stress.",
    icon: Megaphone,
    accent: "#0081FB",
    at: 0.66,
  },
  {
    id: "behoud",
    pillar: "Behoud",
    chipLabel: "Klant blijft, jij slaapt",
    journeyLabel: "E-mail, retentie en koppelingen die omzet vasthouden.",
    href: "/behoud",
    hook: "Herhaalaankopen, minder handwerk in je team, systemen die na de verkoop doorlopen.",
    meneer: "Een nieuwe klant kost vijf keer meer dan iemand die terugkomt. Reken maar na.",
    icon: Heart,
    accent: "#0D9488",
    at: 0.86,
  },
];

const SUCCESS = {
  chipLabel: "Eindstation: succes",
  label: "Groei die blijft hangen",
  hook: "Vaste klanten, meetbare omzet, cijfers die je durft te delen. Zo ziet het eindpunt eruit.",
  meneer: "Zo liepen mijn trajecten. Site en SEO eerst, ads toen het verkocht.",
  href: siteCtas.startIntake.href,
  cta: "Teken jouw route",
  at: 1,
};

function progressToStopIndex(progress: number): number {
  if (progress >= 0.94) return IDEAL_ROUTE.length;
  let idx = 0;
  for (let i = 0; i < IDEAL_ROUTE.length; i++) {
    if (progress >= IDEAL_ROUTE[i]!.at - 0.02) idx = i;
  }
  return idx;
}

export function HomeWorkStagesScroll() {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);
  const progressMv = useMotionValue(0);

  const [active, setActive] = useState(0);
  const [touring, setTouring] = useState(false);
  const [atSuccess, setAtSuccess] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const tourAnimRef = useRef<ReturnType<typeof animate> | null>(null);

  const isSuccessView = atSuccess || active >= IDEAL_ROUTE.length;
  const stop = isSuccessView ? null : (IDEAL_ROUTE[active] ?? IDEAL_ROUTE[0]!);

  const stopTour = useCallback(() => {
    tourAnimRef.current?.stop();
    tourAnimRef.current = null;
    setTouring(false);
  }, []);

  const goToProgress = useCallback(
    (target: number, duration = 1) => {
      stopTour();
      setHasMoved(true);
      tourAnimRef.current = animate(progressMv, target, {
        duration: reduce ? 0 : duration,
        ease: [0.42, 0, 0.22, 1],
        onUpdate: (v) => {
          if (target >= 0.94) {
            setAtSuccess(v >= 0.94);
            if (v >= 0.94) setActive(IDEAL_ROUTE.length);
          } else {
            setAtSuccess(false);
          }
        },
        onComplete: () => {
          tourAnimRef.current = null;
          if (target >= 0.94) {
            setAtSuccess(true);
            setActive(IDEAL_ROUTE.length);
          }
        },
      });
    },
    [progressMv, reduce, stopTour],
  );

  const startTour = useCallback(() => {
    stopTour();
    setTouring(true);
    setAtSuccess(false);
    setActive(0);
    setHasMoved(true);
    progressMv.set(0);

    tourAnimRef.current = animate(progressMv, 1, {
      duration: reduce ? 0.5 : TOUR_DURATION_S,
      ease: "linear",
      onUpdate: (v) => {
        const next = progressToStopIndex(v);
        setActive((prev) => (prev === next ? prev : next));
        setAtSuccess(v >= 0.94);
      },
      onComplete: () => {
        setTouring(false);
        setAtSuccess(true);
        setActive(IDEAL_ROUTE.length);
        tourAnimRef.current = null;
      },
    });
  }, [progressMv, reduce, stopTour]);

  useEffect(() => () => stopTour(), [stopTour]);

  function selectStop(index: number) {
    stopTour();

    if (index >= IDEAL_ROUTE.length) {
      setActive(IDEAL_ROUTE.length);
      setAtSuccess(true);
      goToProgress(1, 1.2);
      return;
    }

    setActive(index);
    setAtSuccess(false);
    goToProgress(IDEAL_ROUTE[index]!.at, 1);
  }

  return (
    <section
      ref={ref}
      className="relative overflow-x-clip border-b border-slate-200 bg-gradient-to-b from-slate-100 via-white to-white"
      aria-labelledby="home-ideal-route-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.04) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-slate-900/10 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FF5722]/25 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#FF5722]/20 bg-[#FF5722]/5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[#FF5722]">
            De ideale route
          </p>
          <h2
            id="home-ideal-route-heading"
            className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl"
          >
            Ik loop dit pad voor je uit.
            <span className="mt-1 block text-slate-600">Jij kiest waar we starten.</span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            Vijf stops: strategie, bouwen, vindbaarheid, campagnes, behoud. Klik een stop of
            druk op play en je ziet in welke volgorde online groei het best werkt. Eén lijn die
            blijft, geen losse projecten.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={touring ? stopTour : startTour}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition sm:text-sm ${
                touring
                  ? "border-[#FF5722] bg-[#FF5722] text-white shadow-md shadow-[#FF5722]/20"
                  : "border-slate-200 bg-white text-slate-900 shadow-sm hover:border-slate-300"
              }`}
            >
              {touring ? (
                <Pause className="size-3.5" aria-hidden />
              ) : (
                <Play className="size-3.5" aria-hidden />
              )}
              {touring ? "Pauzeer" : "Laat Meneer lopen"}
            </button>
            <Link
              href={IDEAL_ROUTE[0]!.href}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-800 shadow-sm transition hover:border-[#FF5722]/30 hover:text-[#FF5722] sm:text-sm"
            >
              Start bij strategie
              <ArrowUpRight className="size-3.5" aria-hidden />
            </Link>
          </div>
        </div>

        <JourneyRouteTrack
          progress={progressMv}
          reduce={reduce}
          active={active}
          atSuccess={atSuccess}
          touring={touring}
          hasMoved={hasMoved}
          onSelect={selectStop}
        />

        <AnimatePresence mode="wait">
          {isSuccessView ? (
            <motion.article
              key="success"
              initial={reduce ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="mt-8 overflow-hidden rounded-2xl border border-[#FF5722]/15 bg-white shadow-[0_16px_40px_-20px_rgba(15,23,42,0.15)]"
            >
              <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/80 px-5 py-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-[#FF5722] text-white">
                  <Flag className="size-5" strokeWidth={2.2} aria-hidden />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#FF5722]">
                    Eindpunt
                  </p>
                  <h3 className="text-lg font-extrabold text-slate-900">{SUCCESS.label}</h3>
                </div>
                <Sparkles className="ml-auto size-5 text-[#FF5722]" aria-hidden />
              </div>
              <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div className="min-w-0">
                  <p className="text-sm leading-relaxed text-slate-600">{SUCCESS.hook}</p>
                  <div className="mt-3 flex items-start gap-3 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200/80">
                    <InteractiveLogo className="size-9 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Meneer zegt
                      </p>
                      <p className="mt-0.5 text-sm font-bold leading-snug text-slate-800">
                        {SUCCESS.meneer}
                      </p>
                    </div>
                  </div>
                </div>
                <Link
                  href={SUCCESS.href}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#FF5722] px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#E64A19]"
                >
                  {SUCCESS.cta}
                  <ArrowUpRight className="size-4" aria-hidden />
                </Link>
              </div>
            </motion.article>
          ) : stop ? (
            <motion.article
              key={stop.id}
              initial={reduce ? undefined : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
              className="mt-8 overflow-hidden rounded-2xl bg-white"
              style={{
                boxShadow: `inset 0 3px 0 0 ${stop.accent}, 0 0 0 1px rgba(226,232,240,0.95), 0 20px 50px -24px rgba(15,23,42,0.16)`,
              }}
            >
              <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div className="flex min-w-0 items-start gap-4">
                  <span
                    className="flex size-12 shrink-0 items-center justify-center rounded-xl text-white"
                    style={{ backgroundColor: stop.accent }}
                  >
                    <stop.icon className="size-5" strokeWidth={2.2} aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                      {stop.pillar}
                    </p>
                    <h3 className="mt-1 text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
                      {stop.journeyLabel}
                    </h3>
                    <p className="mt-1.5 text-sm text-slate-600">{stop.hook}</p>
                    <div className="mt-3 flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                      <InteractiveLogo className="size-9 shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Meneer zegt
                        </p>
                        <p className="mt-0.5 text-sm font-bold leading-snug text-slate-800">
                          {stop.meneer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <Link
                  href={stop.href}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                  Naar {stop.pillar.toLowerCase()}
                  <ArrowUpRight className="size-4" aria-hidden />
                </Link>
              </div>
            </motion.article>
          ) : null}
        </AnimatePresence>

        {!hasMoved && !touring ? (
          <p className="mt-6 text-center text-xs font-semibold text-slate-500">
            Hover een sticker voor het verhaal. Klik om naar dat hoofdblok te gaan. Of druk op
            play en laat Meneer lopen.
          </p>
        ) : null}

        <div className="mt-8 flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-5 py-4 sm:flex-row sm:px-6">
          <p className="text-center text-sm font-bold text-slate-900 sm:text-left">
            Klaar om dit pad voor jouw bedrijf te tekenen?
          </p>
          <Link
            href={siteCtas.startIntake.href}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#FF5722] px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-[#E64A19]"
          >
            {siteCtas.startIntake.label}
            <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}

function JourneyRouteTrack({
  progress,
  reduce,
  active,
  atSuccess,
  touring,
  hasMoved,
  onSelect,
}: {
  progress: MotionValue<number>;
  reduce: boolean;
  active: number;
  atSuccess: boolean;
  touring: boolean;
  hasMoved: boolean;
  onSelect: (index: number) => void;
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const [stopPoints, setStopPoints] = useState<{ x: number; y: number }[]>([]);
  const [endPoint, setEndPoint] = useState({ x: 856, y: 58 });
  const [walkerPx, setWalkerPx] = useState({ left: 0, top: 0 });

  const dashOffset = useTransform(progress, (v) => {
    if (pathLength === 0) return pathLength;
    return pathLength * (1 - v);
  });

  useEffect(() => {
    const path = pathRef.current;
    const track = trackRef.current;
    if (!path || !track) return;

    const length = path.getTotalLength();
    setPathLength(length);

    setStopPoints(
      IDEAL_ROUTE.map((stop) => {
        const point = path.getPointAtLength(stop.at * length);
        return { x: point.x, y: point.y };
      }),
    );

    const end = path.getPointAtLength(length);
    setEndPoint({ x: end.x, y: end.y });

    const pt = path.getPointAtLength(0);
    const svg = track.querySelector("svg");
    if (svg) {
      const svgRect = svg.getBoundingClientRect();
      const scaleX = svgRect.width / VIEW_BOX_W;
      const scaleY = svgRect.height / VIEW_H;
      setWalkerPx({ left: (pt.x + VIEW_PAD) * scaleX, top: pt.y * scaleY });
    }
  }, []);

  useMotionValueEvent(progress, "change", (v) => {
    const path = pathRef.current;
    const track = trackRef.current;
    if (!path || !track || pathLength === 0) return;

    const pt = path.getPointAtLength(v * pathLength);
    const rect = track.getBoundingClientRect();
    const svg = track.querySelector("svg");
    if (!svg) return;

    const svgRect = svg.getBoundingClientRect();
    const scaleX = svgRect.width / VIEW_BOX_W;
    const scaleY = svgRect.height / VIEW_H;

    setWalkerPx({
      left: (pt.x + VIEW_PAD) * scaleX,
      top: pt.y * scaleY,
    });
  });

  return (
    <nav aria-label="Ideale groeiroute" className="relative mt-10 overflow-x-clip pb-4 lg:mt-12">
      <div className="relative w-full min-w-0">
          <div ref={trackRef} className="relative h-[128px] sm:h-[112px]">
            <svg
              viewBox={`${-VIEW_PAD} 0 ${VIEW_BOX_W} ${VIEW_H}`}
              className="absolute inset-0 size-full overflow-visible"
              aria-hidden
            >
              <defs>
                <linearGradient id="route-fill-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FF5722" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#FF5722" stopOpacity="1" />
                </linearGradient>
              </defs>

              <path
                d={ROUTE_PATH}
                stroke="#E2E8F0"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
              />

              <path
                ref={pathRef}
                d={ROUTE_PATH}
                stroke="#CBD5E1"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
              />

              {pathLength > 0 && hasMoved ? (
                <motion.path
                  d={ROUTE_PATH}
                  stroke="url(#route-fill-grad)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={pathLength}
                  style={{ strokeDashoffset: dashOffset }}
                />
              ) : null}

              {stopPoints.map((point, index) => {
                const stop = IDEAL_ROUTE[index]!;
                const isOn = active === index && !atSuccess;
                const isPast = active > index || atSuccess;

                return (
                  <g key={stop.id}>
                    {isOn && !reduce ? (
                      <motion.circle
                        cx={point.x}
                        cy={point.y}
                        r="20"
                        fill={stop.accent}
                        opacity={0.25}
                        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      />
                    ) : null}
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={isOn ? 13 : 11}
                      fill={isPast || isOn ? "white" : "#F8FAFC"}
                      stroke={isOn ? stop.accent : isPast ? stop.accent : "#CBD5E1"}
                      strokeWidth={isOn ? 3 : 2}
                    />
                    {isPast && !isOn ? (
                      <polyline
                        points={`${point.x - 3.5},${point.y + 0.5} ${point.x - 1},${point.y + 3} ${point.x + 4.5},${point.y - 3.5}`}
                        fill="none"
                        stroke={stop.accent}
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    ) : null}
                  </g>
                );
              })}

              <g transform={`translate(${endPoint.x}, ${endPoint.y})`}>
                {atSuccess && !reduce ? (
                  <motion.circle
                    r="26"
                    fill="#FF5722"
                    opacity={0.15}
                    animate={{ scale: [1, 1.25, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                ) : null}
                <line
                  x1="0"
                  y1="-12"
                  x2="0"
                  y2="12"
                  stroke={atSuccess ? "#FF5722" : "#94A3B8"}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 0 -12 L 14 -7 L 0 -2 Z"
                  fill={atSuccess ? "#FF5722" : "#E2E8F0"}
                  stroke={atSuccess ? "#E64A19" : "#CBD5E1"}
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </g>
            </svg>

            {!reduce && pathLength > 0 ? (
              <motion.div
                className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full"
                style={{ left: walkerPx.left, top: walkerPx.top }}
                animate={touring ? { y: [0, -4, 0] } : { y: 0 }}
                transition={
                  touring
                    ? { duration: 0.45, repeat: Infinity, ease: "easeInOut" }
                    : { duration: 0.3 }
                }
              >
                <div className="flex flex-col items-center pb-1">
                  <InteractiveLogo className="size-11 drop-shadow-[0_6px_16px_rgba(0,0,0,0.45)] sm:size-12" />
                </div>
              </motion.div>
            ) : null}
          </div>

          <div className="relative mt-2 min-h-[5.75rem] overflow-x-clip pb-4 sm:min-h-[5.25rem]">
            {stopPoints.map((point, index) => {
              const item = IDEAL_ROUTE[index]!;
              const isOn = active === index && !atSuccess;
              const isPast = active > index || atSuccess;
              const leftPct = stopLeftPct(point.x);

              return (
                <RouteSignpost
                  key={item.id}
                  leftPct={leftPct}
                  pillar={item.pillar}
                  tag={item.chipLabel}
                  href={item.href}
                  accent={item.accent}
                  isOn={isOn}
                  isPast={isPast}
                  index={index}
                  reduce={reduce}
                  onPreview={() => onSelect(index)}
                />
              );
            })}

            <RouteSignpost
              leftPct={stopLeftPct(endPoint.x)}
              pillar="Eind"
              tag={SUCCESS.chipLabel}
              href={SUCCESS.href}
              accent="#FF5722"
              isOn={atSuccess}
              isPast={false}
              isFinish
              index={IDEAL_ROUTE.length}
              reduce={reduce}
              onPreview={() => onSelect(IDEAL_ROUTE.length)}
            />
          </div>
        </div>
    </nav>
  );
}

function RouteSignpost({
  leftPct,
  pillar,
  tag,
  href,
  accent,
  isOn,
  isPast,
  isFinish = false,
  index,
  onPreview,
  reduce,
}: {
  leftPct: number;
  pillar: string;
  tag: string;
  href: string;
  accent: string;
  isOn: boolean;
  isPast: boolean;
  isFinish?: boolean;
  index: number;
  onPreview: () => void;
  reduce: boolean;
}) {
  const tilt = index % 2 === 0 ? -2 : 2;

  const cloudSurface =
    isOn
      ? "bg-white text-slate-900"
      : isPast
        ? "bg-slate-50/95 text-slate-700"
        : isFinish
          ? "bg-[#FFF7F4] text-[#FF5722]"
          : "bg-white/90 text-slate-600";

  const cloudShadow = isOn
    ? `0 0 0 2px ${accent}33, 0 10px 28px -10px ${accent}55, 0 4px 14px -6px rgba(15,23,42,0.12)`
    : isPast
      ? "0 4px 16px -8px rgba(15,23,42,0.1), 0 0 0 1px rgba(148,163,184,0.35)"
      : isFinish
        ? "0 4px 18px -8px rgba(255,87,34,0.2), 0 0 0 1px rgba(255,87,34,0.22)"
        : "0 4px 16px -8px rgba(15,23,42,0.08), 0 0 0 1px rgba(226,232,240,0.95)";

  const tailColor = isOn
    ? "#ffffff"
    : isPast
      ? "#F8FAFC"
      : isFinish
        ? "#FFF7F4"
        : "#FFFFFF";

  return (
    <motion.div
      style={{ left: `${leftPct}%` }}
      className="absolute top-0 z-[1] -translate-x-1/2"
      initial={reduce ? false : { opacity: 0, y: 14, rotate: tilt * 1.5 }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt }}
      viewport={{ once: true, margin: "-12px" }}
      transition={{
        type: "spring",
        stiffness: 280,
        damping: 22,
        delay: 0.05 * index,
      }}
    >
      <Link
        href={href}
        onMouseEnter={onPreview}
        onFocus={onPreview}
        aria-current={isOn ? "step" : undefined}
        className="group block outline-none"
      >
        <motion.span
          whileHover={reduce ? undefined : { scale: 1.05, y: -4, rotate: 0 }}
          whileTap={reduce ? undefined : { scale: 0.98 }}
          transition={{ type: "spring", stiffness: 420, damping: 22 }}
          className={`relative inline-flex min-w-[5.75rem] max-w-[9.25rem] flex-col items-center gap-0.5 rounded-[1.35rem] px-2.5 py-2 text-center backdrop-blur-[2px] transition-[box-shadow,background-color] duration-300 sm:min-w-[6.25rem] sm:px-3 sm:py-2.5 ${cloudSurface}`}
          style={{ boxShadow: cloudShadow }}
        >
          <span
            className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[5px]"
            aria-hidden
          >
            <svg width="13" height="7" viewBox="0 0 13 7" className="block overflow-visible">
              <path
                d="M6.5 0 L1 6.5 L12 6.5 Z"
                fill={tailColor}
              />
            </svg>
          </span>

          <span
            className={`relative flex items-center gap-1 text-[8px] font-bold uppercase tracking-[0.12em] sm:text-[9px] ${
              isOn ? "text-slate-500" : isFinish ? "text-[#FF5722]/80" : "text-slate-400"
            }`}
          >
            {isPast && !isOn ? (
              <span className="text-emerald-600" aria-hidden>
                ✓
              </span>
            ) : isOn ? (
              <motion.span
                className="size-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: accent }}
                animate={{ scale: [1, 1.35, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden
              />
            ) : null}
            {pillar}
          </span>

          <span className="relative text-[9px] font-extrabold leading-snug tracking-tight sm:text-[10px]">
            {tag}
          </span>

          <ArrowUpRight
            className={`relative size-3 transition-all duration-300 ${
              isOn
                ? "translate-x-0 translate-y-0 opacity-100"
                : "translate-y-0.5 opacity-0 group-hover:translate-x-0 group-hover:-translate-y-0 group-hover:opacity-100"
            }`}
            style={{ color: isOn || isFinish ? accent : "#FF5722" }}
            aria-hidden
          />
        </motion.span>
      </Link>
    </motion.div>
  );
}
