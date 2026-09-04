import { createAdminClient } from "@/lib/supabase/admin";
import type { DiscoveryPipelinePhase } from "@/config/discoveryLauncherModes";

export async function setDiscoveryRunPhase(
  runId: string,
  phase: DiscoveryPipelinePhase
): Promise<void> {
  const client = createAdminClient();
  await client
    .from("discovery_runs")
    .update({
      pipeline_phase: phase,
      updated_at: new Date().toISOString(),
    })
    .eq("id", runId);
}
