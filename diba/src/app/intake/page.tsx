import type { Metadata } from "next";
import IntakeTemplate from "@/components/templates/IntakeTemplate";
import { DIBA_SALONIZED_BOOKING_URL, DIBA_WHATSAPP_URL } from "@/lib/site";
import { NOG_IN_AANBOUW } from "@/lib/pagina-af";

export const metadata: Metadata = {
  title: "Behandeling Nul",
  ...NOG_IN_AANBOUW,
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
