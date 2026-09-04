const KLARNA_BADGE_SRC = "/premium-dtc/klarna-badge.png";

export type TrustServiceIconKind = "heart" | "truck" | "klarna" | "return" | "check";

export function trustServiceIconKind(label: string): TrustServiceIconKind {
  if (/klarna/i.test(label)) return "klarna";
  if (/verzending/i.test(label)) return "truck";
  if (/bedenktijd|retour/i.test(label)) return "return";
  if (/tevreden|klanten|reviews?/i.test(label)) return "heart";
  return "check";
}

export function TrustServiceIcon({
  kind,
  className = "",
}: {
  kind: TrustServiceIconKind;
  className?: string;
}) {
  if (kind === "klarna") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={KLARNA_BADGE_SRC}
        alt=""
        className={`pdtc-svc-ico-klarna${className ? ` ${className}` : ""}`}
      />
    );
  }

  const svgProps = {
    viewBox: "0 0 20 20",
    width: 18,
    height: 18,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    "aria-hidden": true as const,
  };

  if (kind === "heart") {
    return (
      <svg {...svgProps}>
        <path
          d="M10 17s-5.8-3.8-5.8-7.6a3.2 3.2 0 0 1 5.6-2.2A3.2 3.2 0 0 1 15.8 9.4C15.8 13.2 10 17 10 17z"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (kind === "truck") {
    return (
      <svg {...svgProps}>
        <path d="M2.5 5h8.5v7.5H2.5z" strokeLinejoin="round" />
        <path d="M11 7.5h2.5l2 2.5V12H11" strokeLinejoin="round" />
        <circle cx="5.5" cy="14.5" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="13.5" cy="14.5" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (kind === "return") {
    return (
      <svg {...svgProps}>
        <path d="M4 10a6 6 0 1 0 1.8-4.2" strokeLinecap="round" />
        <path d="M4 5.5V10h4.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg {...svgProps}>
      <path d="M5.5 10.2 8.2 13.8l6.3-6.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
