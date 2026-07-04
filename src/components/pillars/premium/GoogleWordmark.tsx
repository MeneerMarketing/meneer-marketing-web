/** Transparante Google-wordmark voor decoratieve zoekmockups. Geen PNG met zwarte achtergrond. */
export function GoogleWordmark({ className = "text-[1.65rem] leading-none" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-baseline font-medium tracking-tight ${className}`}
      aria-hidden
    >
      <span className="text-[#4285F4]">G</span>
      <span className="text-[#EA4335]">o</span>
      <span className="text-[#FBBC05]">o</span>
      <span className="text-[#4285F4]">g</span>
      <span className="text-[#34A853]">l</span>
      <span className="text-[#EA4335]">e</span>
    </span>
  );
}
