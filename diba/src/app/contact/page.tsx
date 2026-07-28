import type { Metadata } from "next";
import ContactTemplate from "@/components/templates/ContactTemplate";
import { PAGE_DEFAULTS } from "@/lib/page-defaults";

export const metadata: Metadata = {
  title: "Contact en route",
  description: "[COPY-NODIG]",
};

export default function ContactPage() {
  return <ContactTemplate {...PAGE_DEFAULTS} />;
}
