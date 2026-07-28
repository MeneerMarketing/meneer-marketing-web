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
export function PlusMinus({ open = false, ...props }: IconProps & { open?: boolean }) {
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
