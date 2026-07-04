interface GoogleLogoMarkProps {
  className?: string;
  title?: string;
}

/** Officieel Google G-mark (vier kleuren). */
export function GoogleLogoMark({ className, title = "Google" }: GoogleLogoMarkProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} role="img" aria-label={title}>
      <title>{title}</title>
      <path
        fill="#4285F4"
        d="M21.6 12.2c0-.7-.1-1.3-.2-1.9H12v3.6h5.4a4.6 4.6 0 0 1-2 3v2.5h3.3c1.9-1.8 3-4.4 3-7.2Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 5-.9 6.7-2.5l-3.3-2.5c-.9.6-2.1 1-3.4 1a5.9 5.9 0 0 1-5.6-4.1H2.9v2.6A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.4 13.9a6 6 0 0 1 0-3.8V7.5H2.9a10 10 0 0 0 0 9L6.4 14Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.1c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 12 2 10 10 0 0 0 2.9 7.5L6.4 10a6 6 0 0 1 5.6-3.9Z"
      />
    </svg>
  );
}
