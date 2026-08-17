"use client";

import { useEffect, useState } from "react";

interface PaymentSummary {
  id: string;
  status: string;
  packageName: string | null;
}

interface LgeCheckoutThankYouProps {
  paymentId: string;
}

export function LgeCheckoutThankYou({ paymentId }: LgeCheckoutThankYouProps) {
  const [payment, setPayment] = useState<PaymentSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void fetch(`/api/mollie/payment?id=${encodeURIComponent(paymentId)}`)
      .then(async (response) => {
        const payload = (await response.json()) as PaymentSummary & {
          error?: string;
        };
        if (!response.ok) {
          throw new Error(payload.error ?? "Betaling kon niet worden geladen.");
        }
        return payload;
      })
      .then((payload) => {
        if (!cancelled) {
          setPayment(payload);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Betaling kon niet worden geladen.",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [paymentId]);

  const status = payment?.status ?? null;
  const loading = status === null && !error;
  const paid = status === "paid";
  const pending =
    status === "open" || status === "pending" || status === "authorized";
  const failed =
    status === "failed" ||
    status === "canceled" ||
    status === "expired";

  return (
    <div
      className={
        paid
          ? "border-b border-emerald-200 bg-emerald-50 text-emerald-950"
          : pending
            ? "border-b border-amber-200 bg-amber-50 text-amber-950"
            : "border-b border-rose-200 bg-rose-50 text-rose-950"
      }
      role="status"
    >
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
        {error ? (
          <p className="text-sm font-semibold">{error}</p>
        ) : paid ? (
          <>
            <p className="text-sm font-extrabold">Betaling ontvangen. Top.</p>
            <p className="mt-1 text-sm leading-relaxed">
              {payment?.packageName
                ? `${payment.packageName} staat klaar om op te pakken.`
                : "Je pakket staat klaar om op te pakken."}{" "}
              Ik neem snel contact op over je start.
            </p>
          </>
        ) : pending ? (
          <>
            <p className="text-sm font-extrabold">Betaling wordt verwerkt.</p>
            <p className="mt-1 text-sm leading-relaxed">
              Soms duurt iDEAL een paar seconden. Vernieuw deze pagina als het nog
              open staat.
            </p>
          </>
        ) : failed ? (
          <>
            <p className="text-sm font-extrabold">Betaling niet afgerond.</p>
            <p className="mt-1 text-sm leading-relaxed">
              Geen stress. Scroll naar beneden en probeer opnieuw, of stuur je
              aanvraag via het formulier.
            </p>
          </>
        ) : (
          <p className="text-sm font-semibold">Betaling ophalen…</p>
        )}
      </div>
    </div>
  );
}
