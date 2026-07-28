import type { Metadata } from "next";
import ContentPageTemplate from "@/components/templates/ContentPageTemplate";
import { PAGE_DEFAULTS } from "@/lib/page-defaults";

export const metadata: Metadata = {
  title: "Ons verhaal",
  description: "[COPY-NODIG]",
};

export default function OnsVerhaalPage() {
  return (
    <ContentPageTemplate
      h1="Ons *verhaal*"
      intro="[COPY-NODIG: founder story uit merkdocument §15]"
      breadcrumbLabel="Ons verhaal"
      breadcrumbPath="/ons-verhaal"
      secties={[
        {
          alineas: [
            "[COPY-NODIG: founder story body] [MENSELIJKE-ZIN]",
            "[COPY-NODIG]",
          ],
        },
      ]}
      primaireCta={{ label: "Lees het verbond", href: "/ons-verbond" }}
      {...PAGE_DEFAULTS}
    />
  );
}
