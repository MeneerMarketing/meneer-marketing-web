import type { Metadata } from "next";
import ContentPageTemplate from "@/components/templates/ContentPageTemplate";
import { PAGE_DEFAULTS } from "@/lib/page-defaults";
import { NOG_IN_AANBOUW } from "@/lib/pagina-af";

export const metadata: Metadata = {
  title: "PCOS en huid",
  ...NOG_IN_AANBOUW,
};

export default function PcosPage() {
  return (
    <ContentPageTemplate
      h1="PCOS en *jouw* huid"
      intro="[COPY-NODIG: PCOS-intro] [MEDISCHE-CHECK-ROJDA]"
      breadcrumbLabel="PCOS"
      breadcrumbPath="/pcos"
      secties={[
        {
          alineas: [
            "[COPY-NODIG: PCOS body copy]",
            "[COPY-NODIG: behandelpad en eerlijkheid] [MEDISCHE-CHECK-ROJDA]",
          ],
        },
      ]}
      primaireCta={{ label: "Start je intake (4 min)", href: "/intake" }}
      {...PAGE_DEFAULTS}
    />
  );
}
