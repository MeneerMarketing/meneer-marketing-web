import type { Metadata } from "next";
import TeamTemplate from "@/components/templates/TeamTemplate";
import { TEAM } from "@/data/team";
import { PAGE_DEFAULTS } from "@/lib/page-defaults";

export const metadata: Metadata = {
  title: "Team",
  description: "[COPY-NODIG]",
};

export default function TeamPage() {
  return <TeamTemplate leden={TEAM} {...PAGE_DEFAULTS} />;
}
