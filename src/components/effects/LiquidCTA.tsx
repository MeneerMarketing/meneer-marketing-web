"use client";

import Link from "next/link";
import {
  useCallback,
  useId,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { Magnetic } from "@/components/effects/Magnetic";

interface LiquidCTAProps {
  href: string;
  label: string;
  className?: string;
}

const CODE_TOKENS = "  [n8n]  \u00b7  [API]  \u00b7  [Logic]  \u00b7  [n8n]  \u00b7  [API]  \u00b7  [Logic]  \u00b7  ";

export function LiquidCTA({ href, label, className }: LiquidCTAProps) {
  const [hover, setHover] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false });
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const pathId = useId();

  const onMouseMove = useCallback((event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (!anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    setCursor({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      visible: true,
    });
  }, []);

  const onMouseEnter = useCallback(() => setHover(true), []);
  const onMouseLeave = useCallback(() => {
    setHover(false);
    setCursor((c) => ({ ...c, visible: false }));
  }, []);

  return (
    <Magnetic radius={180} strength={12}>
      <Link
        ref={anchorRef}
        href={href}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
        className={`group relative isolate inline-flex cursor-none items-center gap-2.5 overflow-hidden rounded-full bg-[#FF5722] px-8 py-4 text-base font-bold tracking-tight text-white shadow-[0_12px_28px_-10px_rgba(255,87,34,0.6)] ring-1 ring-[#FF5722]/30 transition-[box-shadow] duration-300 hover:shadow-[0_18px_44px_-12px_rgba(15,23,42,0.55)] ${className ?? ""}`}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 origin-bottom"
          style={{
            transform: hover ? "translateY(0%)" : "translateY(101%)",
            transition:
              "transform 620ms cubic-bezier(0.77, 0, 0.175, 1), border-radius 620ms cubic-bezier(0.77, 0, 0.175, 1)",
            background: "#0F172A",
            borderTopLeftRadius: hover ? "0%" : "50% 18px",
            borderTopRightRadius: hover ? "0%" : "50% 18px",
          }}
        />

        <span className="relative z-10 transition-transform duration-300 group-hover:-translate-y-px">
          {label}
        </span>
        <svg
          className="relative z-10 size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          aria-hidden
        >
          <path
            d="M7 17 L17 7 M9 7 H17 V15"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 h-full w-full"
          viewBox="0 0 240 60"
          preserveAspectRatio="none"
        >
          <defs>
            <path
              id={pathId}
              d="M 30 6 L 210 6 A 24 24 0 0 1 210 54 L 30 54 A 24 24 0 0 1 30 6 Z"
              fill="none"
            />
          </defs>
          <text
            fontFamily="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
            fontSize="8"
            letterSpacing="0.5"
            fill="rgba(255,255,255,0.42)"
          >
            <textPath href={`#${pathId}`} startOffset="0%">
              {CODE_TOKENS.repeat(3)}
              <animate
                attributeName="startOffset"
                from="0%"
                to="100%"
                dur="22s"
                repeatCount="indefinite"
              />
            </textPath>
          </text>
        </svg>

        {cursor.visible ? (
          <span
            aria-hidden
            className="pointer-events-none absolute z-20"
            style={{
              left: cursor.x - 16,
              top: cursor.y - 16,
              transition: "transform 120ms ease-out",
            }}
          >
            <MagnifyCursor />
          </span>
        ) : null}
      </Link>
    </Magnetic>
  );
}

function MagnifyCursor() {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 34 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-[0_2px_6px_rgba(15,23,42,0.35)]"
    >
      <circle cx="14" cy="14" r="8.5" stroke="#FFFFFF" strokeWidth="2.4" />
      <circle cx="14" cy="14" r="8.5" stroke="#FF5722" strokeWidth="1.4" />
      <line
        x1="20.5"
        y1="20.5"
        x2="29"
        y2="29"
        stroke="#FF5722"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <line
        x1="20.5"
        y1="20.5"
        x2="29"
        y2="29"
        stroke="#FFFFFF"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M11 13.5 H13 M15 13.5 H17"
        stroke="#FF5722"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
