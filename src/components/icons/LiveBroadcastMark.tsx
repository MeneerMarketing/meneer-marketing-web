interface LiveBroadcastMarkProps {
  className?: string;
  title?: string;
}

/** Uitzend-icoon: live-dot met signaalbogen. */
export function LiveBroadcastMark({
  className,
  title = "Live",
}: LiveBroadcastMarkProps) {
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
      <circle cx="8.5" cy="12" r="2.25" fill="currentColor" />
      <path
        d="M12.5 9.25a4.25 4.25 0 0 1 0 5.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M14.75 6.75a8.25 8.25 0 0 1 0 10.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M17 4.25a12.25 12.25 0 0 1 0 15.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
