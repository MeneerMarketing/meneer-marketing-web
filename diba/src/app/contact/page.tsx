import type { Metadata } from "next";
import ContactTemplate from "@/components/templates/ContactTemplate";
import { PAGE_DEFAULTS } from "@/lib/page-defaults";
import { NOG_IN_AANBOUW } from "@/lib/pagina-af";

export const metadata: Metadata = {
  title: "Contact en route",
  ...NOG_IN_AANBOUW,
};

export default function ContactPage() {
  return <ContactTemplate {...PAGE_DEFAULTS} />;
}
