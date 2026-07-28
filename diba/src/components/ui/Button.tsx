import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowUpRight } from "@/components/ui/Icon";

/**
 * DIBA Button (DIBA-RULES.md §8)
 *
 * Vier types. Op elk scherm staat maximaal één primaire knop — dat is de Green Touch
 * van die pagina (Addendum A3). Gebruik `primair-op-donker` binnen een --g-700-vlak;
 * de gewone primaire knop is daar onzichtbaar.
 *
 * 48px hoog = touch-target (§13). Labels zeggen exact wat er gebeurt en worden door
 * de aanroeper bepaald: "Start je intake (4 min)", nooit "Verstuur" of "Ontdek".
 */

type Variant =
  | "primair"
  | "primair-op-donker"
  | "secundair"
  | "secundair-op-donker"
  | "ghost";

const base =
  "inline-flex h-12 items-center justify-center gap-2 rounded-[var(--r-pill)] px-6 " +
  "text-[11px] font-semibold uppercase leading-none tracking-[0.13em] no-underline select-none " +
  "transition-[background-color,border-color,color,transform] duration-[var(--dur-micro)] " +
  "[transition-timing-function:var(--ease-diba)] " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none";

const variants: Record<Variant, string> = {
  primair:
    "bg-[var(--g-700)] text-white hover:bg-[var(--g-800)] hover:-translate-y-0.5 " +
    "focus-visible:outline-[var(--g-700)]",
  "primair-op-donker":
    "bg-[var(--on-dark-btn)] text-[var(--on-dark-btn-text)] hover:bg-white " +
    "hover:-translate-y-0.5 focus-visible:outline-[var(--on-dark-btn)]",
  secundair:
    "border border-[var(--g-300)] text-[var(--g-700)] hover:border-[var(--g-700)] " +
    "focus-visible:outline-[var(--g-700)]",
  // Op een --g-700-vlak zijn 'secundair' en 'ghost' onleesbaar: die rekenen op donkere
  // tekst. Deze variant vult dat gat, zodat een donkere sectie ook een tweede keuze
  // kan tonen zonder een tweede primaire knop (§2: één primair per schermdeel).
  "secundair-op-donker":
    "border border-white/45 text-white hover:border-white hover:bg-white/10 " +
    "focus-visible:outline-[var(--on-dark-btn)]",
  ghost:
    "px-2 text-[var(--g-700)] underline decoration-[var(--g-300)] underline-offset-4 " +
    "hover:decoration-[var(--g-700)] focus-visible:outline-[var(--g-700)]",
};

type CommonProps = {
  variant?: Variant;
  children: ReactNode;
  className?: string;
  /** Toont de pijl. Standaard aan, behalve op ghost (die heeft al een onderstreping). */
  arrow?: boolean;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps & {
  href: string;
  target?: string;
  rel?: string;
  "aria-label"?: string;
  /** Bijv. een dialoog sluiten terwijl je doornavigeert. */
  onClick?: () => void;
};

export type DibaButtonProps = ButtonAsButton | ButtonAsLink;

export default function Button(props: DibaButtonProps) {
  const { variant = "primair", children, className = "" } = props;
  const showArrow = props.arrow ?? variant !== "ghost";
  const cls = `${base} ${variants[variant]} ${className}`.trim();
  const inner = (
    <>
      {children}
      {showArrow ? <ArrowUpRight size={14} /> : null}
    </>
  );

  if ("href" in props && props.href) {
    const { href, target, rel, onClick } = props;
    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        aria-label={props["aria-label"]}
        className={cls}
      >
        {inner}
      </Link>
    );
  }

  const {
    variant: _v,
    children: _c,
    className: _cn,
    arrow: _a,
    ...rest
  } = props as ButtonAsButton;
  void _v;
  void _c;
  void _cn;
  void _a;

  return (
    <button type={rest.type ?? "button"} {...rest} className={cls}>
      {inner}
    </button>
  );
}
