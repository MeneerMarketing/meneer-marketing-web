import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

/**
 * DIBA Button — referentie batch 1 (DIBA-RULES.md §8)
 * Drie types: primair (olijf, max één per scherm) · secundair (linnen + salierand) · ghost (twijfel-route).
 * 48px hoog = touch-target §13. Labels zeggen exact wat er gebeurt (bepaalt de aanroeper).
 * Geen nieuwe dependencies nodig.
 */

type Variant = "primair" | "secundair" | "ghost";

const base =
  "inline-flex h-12 items-center justify-center gap-2 rounded-[var(--radius-md)] px-6 " +
  "text-[15px] font-medium leading-none no-underline select-none " +
  "[font-family:var(--font-body)] " +
  "transition-colors duration-[var(--dur-micro)] [transition-timing-function:var(--ease-diba)] " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "focus-visible:outline-[var(--diba-green-700)] " +
  "disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none";

const variants: Record<Variant, string> = {
  primair:
    "bg-[var(--diba-green-700)] text-[var(--white)] hover:bg-[var(--diba-green-900)]",
  secundair:
    "bg-[var(--diba-cream-100)] text-[var(--diba-green-700)] " +
    "border border-[var(--diba-green-200)] hover:border-[var(--diba-green-500)]",
  ghost:
    "bg-transparent px-2 text-[var(--diba-green-700)] underline-offset-4 hover:underline",
};

/** Pijl voor de ghost/twijfel-route. Inline SVG — geen icon-library nodig. */
function ArrowRight() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 8h11M9.5 4l4 4-4 4" />
    </svg>
  );
}

type CommonProps = {
  variant?: Variant;
  children: ReactNode;
  className?: string;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps & {
  href: string;
  target?: string;
  rel?: string;
  "aria-label"?: string;
};

export type DibaButtonProps = ButtonAsButton | ButtonAsLink;

export default function Button(props: DibaButtonProps) {
  const { variant = "primair", children, className = "" } = props;
  const cls = `${base} ${variants[variant]} ${className}`.trim();
  const inner = (
    <>
      {children}
      {variant === "ghost" ? <ArrowRight /> : null}
    </>
  );

  if ("href" in props && props.href) {
    const { href, target, rel } = props;
    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        aria-label={props["aria-label"]}
        className={cls}
      >
        {inner}
      </Link>
    );
  }

  // Opus-referentie: rest-props zonder variant/children/className doorgeven
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- referentie batch 1
  const { variant: _v, children: _c, className: _cn, ...rest } =
    props as ButtonAsButton;
  return (
    <button type={rest.type ?? "button"} {...rest} className={cls}>
      {inner}
    </button>
  );
}
