interface CartoonMagnifierMarkProps {
  className?: string;
  title?: string;
}

/** Minimalist vergrootglas voor SEO-billboard stamp. */
export function CartoonMagnifierMark({
  className,
  title = "SEO zoeken",
}: CartoonMagnifierMarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={title}
      fill="none"
    >
      <title>{title}</title>
      <circle cx="10.5" cy="10.5" r="6.25" stroke="currentColor" strokeWidth="2" />
      <path
        d="M15 15l5.5 5.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
