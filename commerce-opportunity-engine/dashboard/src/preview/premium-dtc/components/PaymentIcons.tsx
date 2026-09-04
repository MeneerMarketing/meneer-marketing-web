import type { PaymentMethodId } from "../types";
import type { ReactNode } from "react";

export type { PaymentMethodId };

const KLARNA_BADGE_SRC = "/premium-dtc/klarna-badge.png";
const IDEAL_BADGE_SRC = "/premium-dtc/ideal-wero-badge.png";

type Props = {
  methods: PaymentMethodId[];
  label?: string;
};

function KlarnaMark({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={KLARNA_BADGE_SRC}
      alt="Klarna"
      className={className || "pdtc-klarna-badge"}
    />
  );
}

function IdealMark({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={IDEAL_BADGE_SRC}
      alt="iDEAL en Wero"
      className={className || "pdtc-ideal-badge"}
    />
  );
}

function VisaMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 24" role="img" aria-label="Visa">
      <rect width="48" height="24" rx="3" fill="#1A1F71" />
      <text
        x="24"
        y="15.5"
        textAnchor="middle"
        fill="#fff"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="10"
        fontWeight="700"
        fontStyle="italic"
      >
        VISA
      </text>
    </svg>
  );
}

function MastercardMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 24" role="img" aria-label="Mastercard">
      <rect width="48" height="24" rx="3" fill="#fff" stroke="rgba(22,24,29,0.12)" />
      <circle cx="20" cy="12" r="6.5" fill="#EB001B" />
      <circle cx="28" cy="12" r="6.5" fill="#F79E1B" />
      <path
        d="M24 7.2a6.5 6.5 0 0 1 0 9.6 6.5 6.5 0 0 1 0-9.6z"
        fill="#FF5F00"
      />
    </svg>
  );
}

function ApplePayMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 24" role="img" aria-label="Apple Pay">
      <rect width="48" height="24" rx="3" fill="#000" />
      <text
        x="24"
        y="15.5"
        textAnchor="middle"
        fill="#fff"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="8"
        fontWeight="600"
      >
        Pay
      </text>
    </svg>
  );
}

function PaypalMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 24" role="img" aria-label="PayPal">
      <rect width="48" height="24" rx="3" fill="#fff" stroke="rgba(22,24,29,0.12)" />
      <text
        x="24"
        y="15.5"
        textAnchor="middle"
        fill="#003087"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="8"
        fontWeight="700"
      >
        PayPal
      </text>
    </svg>
  );
}

const ICONS: Record<PaymentMethodId, (p: { className?: string }) => ReactNode> = {
  ideal: IdealMark,
  visa: VisaMark,
  mastercard: MastercardMark,
  klarna: KlarnaMark,
  apple_pay: ApplePayMark,
  paypal: PaypalMark,
};

export function KlarnaInline({ className }: { className?: string }) {
  return <KlarnaMark className={className || "pdtc-klarna-badge"} />;
}

export function PaymentIcons({ methods, label = "Betaal met" }: Props) {
  if (!methods.length) return null;
  return (
    <div className="pdtc-pay">
      <span className="pdtc-pay-label">{label}</span>
      <div className="pdtc-pay-icons" aria-label="Betaalmethoden">
        {methods.map((id) => {
          const Icon = ICONS[id];
          const wrapClass =
            id === "klarna"
              ? "pdtc-pay-icon-wrap pdtc-pay-icon-wrap--klarna"
              : id === "ideal"
                ? "pdtc-pay-icon-wrap pdtc-pay-icon-wrap--ideal"
                : "pdtc-pay-icon-wrap";
          const iconClass =
            id === "klarna"
              ? "pdtc-klarna-badge pdtc-klarna-badge--pay"
              : id === "ideal"
                ? "pdtc-ideal-badge pdtc-ideal-badge--pay"
                : "pdtc-pay-icon";
          return (
            <span key={id} className={wrapClass}>
              <Icon className={iconClass} />
            </span>
          );
        })}
      </div>
    </div>
  );
}
