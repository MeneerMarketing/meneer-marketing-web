interface AutomationFlowMarkProps {
  className?: string;
  title?: string;
}

/** Kleurrijk flow-icoon voor n8n/Klaviyo/koppelingen. */
export function AutomationFlowMark({
  className,
  title = "Automatisering",
}: AutomationFlowMarkProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} role="img" aria-label={title}>
      <title>{title}</title>
      <path
        d="M12 10.5v3"
        stroke="#FF5722"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M8.5 8.5 10.2 10M15.5 8.5 13.8 10M12 13.5v2.2M9.2 16.8 10.6 15.4M14.8 16.8 13.4 15.4"
        stroke="#94A3B8"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="3.2" fill="#FF5722" />
      <circle cx="6.5" cy="7" r="2.6" fill="#95BF47" />
      <circle cx="17.5" cy="7" r="2.6" fill="#4285F4" />
      <circle cx="7" cy="18" r="2.6" fill="#E1306C" />
      <circle cx="17" cy="18" r="2.6" fill="#00BCD4" />
      <path
        d="M9.4 9.6 10.4 10.8M14.6 9.6 13.6 10.8M10.2 14.8 8.8 16.4M13.8 14.8 15.2 16.4"
        stroke="white"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}
