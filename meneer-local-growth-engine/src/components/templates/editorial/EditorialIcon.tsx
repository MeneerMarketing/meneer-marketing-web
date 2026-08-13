import type { ReactNode } from "react";

/**
 * Alleen de twee tekens die als UI-glyph werken: de pijl in knoppen en links,
 * en het vinkje in opsommingen. Illustratief werk gaat via de Pilates-set in
 * EditorialPose, want getekende pictogrammen op 16px houden geen stand.
 */
export type EditorialIconName = "arrow" | "check" | "phone" | "instagram";

const PATHS: Record<EditorialIconName, ReactNode> = {
  arrow: (
    <>
      <path d="M4 12h15.5" />
      <path d="M13.4 6.2 19.6 12l-6.2 5.8" />
    </>
  ),
  check: <path d="M4.5 12.8 9.3 17.5 19.5 6.8" />,
  phone: (
    <path d="M8.2 4.8h2.1l1.1 2.8-1.4 1.2a11.2 11.2 0 0 0 5.2 5.2l1.2-1.4 2.8 1.1v2.1a1.6 1.6 0 0 1-1.7 1.6C10.4 17.2 6.8 13.6 6.6 6.5A1.6 1.6 0 0 1 8.2 4.8Z" />
  ),
  instagram: (
    <>
      <rect x="4.5" y="4.5" width="15" height="15" rx="4.2" />
      <circle cx="12" cy="12" r="3.4" />
      <circle cx="16.6" cy="7.4" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
};

interface Props {
  name: EditorialIconName;
  className?: string;
  strokeWidth?: number;
}

export function EditorialIcon({
  name,
  className = "h-4 w-4",
  strokeWidth = 1.3,
}: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      className={className}
    >
      {PATHS[name]}
    </svg>
  );
}
