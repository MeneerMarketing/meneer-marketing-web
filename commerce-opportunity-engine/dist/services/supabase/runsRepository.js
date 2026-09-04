export async function createRun(client, runType, metadata = {}) {
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
    return data;
}
export async function completeRun(client, runId, status, metadata) {
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
        metadata: { ...(existing?.metadata ?? {}), ...metadata },
        updated_at: completedAt,
    })
        .eq("id", runId);
    if (error) {
        throw new Error(`Failed to complete run: ${error.message}`);
    }
}
//# sourceMappingURL=runsRepository.js.map