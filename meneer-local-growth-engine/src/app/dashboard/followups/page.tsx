import { DemoBanner, SectionTitle } from "@/components/dashboard/ui";
import { FollowUpWorkbench } from "@/components/dashboard/FollowUpWorkbench";
import {
  listFollowupCandidates,
  listFollowupMessages,
} from "@/services/followup/followupCandidates";

interface Props {
  searchParams: Promise<{ tab?: string }>;
}

export default async function FollowupsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const tab =
    sp.tab === "list" || sp.tab === "drafts" ? sp.tab : "candidates";

  const [candidates, queue] = await Promise.all([
    listFollowupCandidates(),
    listFollowupMessages("all"),
  ]);

  return (
    <div>
      <SectionTitle
        eyebrow="Follow-up"
        title="Follow-up werkplek"
        description="Selecteer leads, kies een sjabloon, bekijk de preview en verstuur wanneer jij wilt. Geen volautomatische sequences."
      />
      <DemoBanner />
      <FollowUpWorkbench candidates={candidates} queue={queue} initialTab={tab} />
    </div>
  );
}
