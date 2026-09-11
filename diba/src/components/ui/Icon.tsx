/**
 * De icoonset (DIBA-RULES §8).
 *
 * De Figma-export gebruikte losse Unicode-tekens (↗ ✦ ⌁ + ×) als icoon. Die vallen
 * per besturingssysteem anders uit, schalen niet mee met het font en zijn voor een
 * screenreader betekenisloos ruis. Dit zijn echte SVG's: één lijndikte, currentColor,
 * en standaard verborgen voor hulpsoftware.
 *
 * Formaat volgt de tekstgrootte (1em), tenzij je `size` meegeeft.
 */

type IconProps = {
  className?: string;
  /** Pixelmaat. Laat leeg om mee te schalen met de tekst. */
  size?: number;
  /** Zet een label als het icoon op zichzelf betekenis draagt (los icoon als link). */
  label?: string;
};

function svgProps({ className, size, label }: IconProps) {
  return {
    className,
    width: size ?? "1em",
    height: size ?? "1em",
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...(label
      ? { role: "img" as const, "aria-label": label }
      : { "aria-hidden": true as const, focusable: false as const }),
  };
}

/** De pijl die overal "hier ga je heen" betekent. Vervangt ↗. */
export function ArrowUpRight(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <path d="M7 17 17 7" />
      <path d="M8.5 7H17v8.5" />
    </svg>
  );
}

/** Pijl naar rechts, voor "lees verder" binnen een tekstregel. */
export function ArrowRight(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <path d="M4 12h15" />
      <path d="M13 6.5 18.5 12 13 17.5" />
    </svg>
  );
}

/** Het merkteken bij een belofte of kwaliteit. Vervangt ✦. */
export function Sparkle(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <path d="M12 3.5c.6 4.3 2.2 6 6.5 6.5-4.3.6-5.9 2.2-6.5 6.5-.6-4.3-2.2-5.9-6.5-6.5 4.3-.5 5.9-2.2 6.5-6.5Z" />
      <path d="M18 16.5c.3 1.9 1 2.6 2.9 2.9-1.9.3-2.6 1-2.9 2.9-.3-1.9-1-2.6-2.9-2.9 1.9-.3 2.6-1 2.9-2.9Z" />
    </svg>
  );
}

/** De meetlijn: rust en beweging. Vervangt ⌁. */
export function Pulse(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <path d="M2.5 12h4l2.5-6 4 12 2.5-6h6" />
    </svg>
  );
}

/** Plus/min voor de FAQ. Draait naar een min bij `open`. */
export function PlusMinus({
  open = false,
  ...props
}: IconProps & { open?: boolean }) {
  return (
    <svg {...svgProps(props)}>
      <path d="M4.5 12h15" />
      {!open ? <path d="M12 4.5v15" /> : null}
    </svg>
  );
}

/** Sluiten. Vervangt ×. */
export function Close(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

/** Een vinkje. Voor "dit is afgesproken", niet voor "dit is gelukt". */
export function Vinkje(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <path d="M4.5 12.5 9.5 17.5 19.5 6.5" />
    </svg>
  );
}

/**
 * Het merkteken van WhatsApp.
 *
 * Gevuld en niet in lijnen, want dit is een merk en geen pictogram uit onze eigen set: in
 * lijnen wordt het een tekstballon met een streepje en herkent niemand het. Het staat naast
 * het woord en niet in plaats daarvan.
 */
export function Whatsapp({ className = "", size }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size ?? "1em"}
      height={size ?? "1em"}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.82c2.16 0 4.19.84 5.72 2.37a8.05 8.05 0 0 1 2.37 5.72c0 4.46-3.63 8.09-8.09 8.09a8.1 8.1 0 0 1-4.12-1.13l-.3-.18-3.06.8.82-2.99-.19-.31a8.05 8.05 0 0 1-1.24-4.28c0-4.46 3.63-8.09 8.09-8.09Zm-4.05 4.3c-.19 0-.5.07-.76.36-.26.29-1 .98-1 2.39 0 1.41 1.02 2.77 1.17 2.96.14.19 1.98 3.03 4.8 4.24.67.29 1.19.46 1.6.59.67.21 1.28.18 1.77.11.54-.08 1.66-.68 1.9-1.34.23-.66.23-1.22.16-1.34-.07-.11-.26-.18-.54-.32-.29-.14-1.67-.83-1.93-.92-.26-.09-.45-.14-.64.15-.19.28-.73.92-.9 1.11-.16.19-.33.21-.62.07-.29-.14-1.19-.44-2.27-1.4a8.5 8.5 0 0 1-1.57-1.95c-.16-.29-.02-.44.13-.58.13-.13.29-.34.43-.51.14-.17.19-.29.28-.48.1-.19.05-.36-.02-.5-.07-.14-.63-1.52-.87-2.08-.23-.55-.46-.47-.63-.48h-.54Z" />
    </svg>
  );
}
