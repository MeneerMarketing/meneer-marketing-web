import React from "react";

export interface EyeLook {
  x: number;
  y: number;
}

interface MeneerHeadProps {
  /** Pupilverschuiving in viewBox-eenheden, geklemd op ±2.2 */
  look?: EyeLook;
  bandColor?: string;
  size?: number;
  className?: string;
}

/**
 * Mascotte van Meneer Marketing. De pupillen staan los zodat het koppie
 * kan meekijken met wat er in de post gebeurt.
 */
export function MeneerHead({
  look = { x: 0, y: 0 },
  bandColor = "#FF5722",
  size = 120,
  className,
}: MeneerHeadProps) {
  const px = Math.max(-2.2, Math.min(2.2, look.x));
  const py = Math.max(-2.2, Math.min(2.2, look.y));

  return (
    <svg
      width={size}
      height={size}
      viewBox="11.5 12.4 41 45.2"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <ellipse cx="14.7" cy="42" rx="2.9" ry="3.4" fill="#F6C09A" stroke="#1F2430" strokeWidth="1.3" />
      <ellipse cx="49.3" cy="42" rx="2.9" ry="3.4" fill="#F6C09A" stroke="#1F2430" strokeWidth="1.3" />
      <ellipse cx="32" cy="41" rx="17" ry="16.6" fill="#F8CBA3" stroke="#1F2430" strokeWidth="1.5" />
      <ellipse cx="20.6" cy="47" rx="2.5" ry="1.5" fill="#F2A075" opacity="0.5" />
      <ellipse cx="43.4" cy="47" rx="2.5" ry="1.5" fill="#F2A075" opacity="0.5" />
      <ellipse cx="26.4" cy="36.4" rx="5.8" ry="7.4" fill="#fff" stroke="#1F2430" strokeWidth="1.3" />
      <ellipse cx="37.6" cy="36.4" rx="5.8" ry="7.4" fill="#fff" stroke="#1F2430" strokeWidth="1.3" />
      <circle cx={26.4 + px} cy={36.4 + py} r="2.2" fill="#1F2430" />
      <circle cx={37.6 + px} cy={36.4 + py} r="2.2" fill="#1F2430" />
      <ellipse cx="32" cy="43.6" rx="3.3" ry="2.3" fill="#F2B285" stroke="#1F2430" strokeWidth="1.2" />
      <path
        d="M23.2 48.6C25.4 45.6 29.6 45.9 32 47.9C34.4 45.9 38.6 45.6 40.8 48.6C40 51.3 36.1 52.2 32 50.3C27.9 52.2 24 51.3 23.2 48.6Z"
        fill="#1F2430"
      />
      <path
        d="M28.4 54.2c2.3 1.5 4.9 1.5 7.2 0"
        fill="none"
        stroke="#1F2430"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path d="M19 24.6a13 12.2 0 0 1 26 0v0.9h-26z" fill="#1F2430" />
      <rect x="19.8" y="20.7" width="24.4" height="4" fill={bandColor} />
      <rect x="11.5" y="23.8" width="41" height="4.4" rx="2.2" fill="#1F2430" />
    </svg>
  );
}

/** Vaste blikrichtingen zodat templates niet zelf hoeven te rekenen. */
export const LOOK = {
  camera: { x: 0, y: 0 },
  linksOnder: { x: -1.8, y: 1.6 },
  rechtsOnder: { x: 1.8, y: 1.6 },
  linksBoven: { x: -1.8, y: -1.4 },
  rechtsBoven: { x: 1.8, y: -1.4 },
  weg: { x: 2.1, y: -1.8 },
} as const;
