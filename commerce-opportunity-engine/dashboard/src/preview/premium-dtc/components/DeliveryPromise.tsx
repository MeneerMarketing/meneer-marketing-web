"use client";

import { useEffect, useState } from "react";
import {
  getDeliveryPromiseMessage,
  type DeliveryPromiseMessage,
} from "../deliveryPromise";

type Props = {
  inStock: boolean;
  shippingNote?: string | null;
  cutoffHour?: number;
  cutoffMinute?: number;
  variant?: "panel" | "inline";
};

function IconTruck() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 7h11v8H3z" />
      <path d="M14 10h4l3 3v2h-7" />
      <circle cx="7" cy="17" r="1.6" />
      <circle cx="17" cy="17" r="1.6" />
    </svg>
  );
}

export function DeliveryPromise({
  inStock,
  shippingNote,
  cutoffHour = 23,
  cutoffMinute = 0,
  variant = "panel",
}: Props) {
  const [message, setMessage] = useState<DeliveryPromiseMessage>(() =>
    getDeliveryPromiseMessage(cutoffHour, cutoffMinute, shippingNote)
  );

  useEffect(() => {
    const refresh = () =>
      setMessage(getDeliveryPromiseMessage(cutoffHour, cutoffMinute, shippingNote));

    refresh();
    const timer = window.setInterval(refresh, 60_000);
    return () => window.clearInterval(timer);
  }, [cutoffHour, cutoffMinute, shippingNote]);

  if (!inStock) return null;

  const className =
    variant === "inline"
      ? "pdtc-delivery-promise pdtc-delivery-promise--inline"
      : "pdtc-delivery-promise";

  return (
    <div className={className}>
      <span className="pdtc-delivery-promise-ico" aria-hidden="true">
        <IconTruck />
      </span>
      <div className="pdtc-delivery-promise-copy">
        <p className="pdtc-delivery-promise-head">
          <span className="pdtc-delivery-promise-dot" aria-hidden="true" />
          <strong>{message.primary}</strong>
        </p>
        {message.secondary ? (
          <p className="pdtc-delivery-promise-sub">{message.secondary}</p>
        ) : null}
      </div>
    </div>
  );
}
