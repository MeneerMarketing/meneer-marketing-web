import type { Metadata } from "next";
import TeamTemplate from "@/components/templates/TeamTemplate";
import { TEAM } from "@/data/team";
import { PAGE_DEFAULTS } from "@/lib/page-defaults";
import { NOG_IN_AANBOUW } from "@/lib/pagina-af";

export const metadata: Metadata = {
  title: "Team",
  ...NOG_IN_AANBOUW,
};

export default function TeamPage() {
  return <TeamTemplate leden={TEAM} {...PAGE_DEFAULTS} />;
}
