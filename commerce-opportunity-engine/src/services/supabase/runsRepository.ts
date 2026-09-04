import type { SupabaseClient } from "@supabase/supabase-js";

export interface RunRecord {
  id: string;
  run_type: string;
  status: string;
  metadata: Record<string, unknown>;
}

export async function createRun(
  client: SupabaseClient,
  runType: string,
  metadata: Record<string, unknown> = {}
): Promise<RunRecord> {
  const startedAt = new Date().toISOString();
  const { data, error } = await client
    .from("runs")
    .insert({
      run_type: runType,
      status: "running",
      started_at: startedAt,
      metadata,
    })
    .select("id, run_type, status, metadata")
    .single();

  if (error) {
    throw new Error(`Failed to create run: ${error.message}`);
  }

  return data as RunRecord;
}

export async function completeRun(
  client: SupabaseClient,
  runId: string,
  status: "completed" | "failed",
  metadata: Record<string, unknown>
): Promise<void> {
  const completedAt = new Date().toISOString();

  // Merge rather than replace: the metadata written at creation describes what
  // the run was asked to do, and a replay needs it long after completion.
  const { data: existing } = await client
    .from("runs")
    .select("metadata")
    .eq("id", runId)
    .maybeSingle();

  const { error } = await client
    .from("runs")
    .update({
      status,
      completed_at: completedAt,
      metadata: { ...((existing?.metadata ?? {}) as Record<string, unknown>), ...metadata },
      updated_at: completedAt,
    })
    .eq("id", runId);

  if (error) {
    throw new Error(`Failed to complete run: ${error.message}`);
  }
}
