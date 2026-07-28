import type { Metadata } from "next";
import IntakeTemplate from "@/components/templates/IntakeTemplate";
import { DIBA_SALONIZED_BOOKING_URL, DIBA_WHATSAPP_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Behandeling Nul",
  description: "[COPY-NODIG]",
  robots: { index: true, follow: true },
};

export default function IntakePage() {
  return (
    <IntakeTemplate
      whatsappHref={DIBA_WHATSAPP_URL}
      bookingHref={DIBA_SALONIZED_BOOKING_URL || undefined}
    />
  );
}
