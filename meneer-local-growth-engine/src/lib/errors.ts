/** Leesbare fouttekst uit Error, PostgrestError of API-json. */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (error && typeof error === "object") {
    const record = error as Record<string, unknown>;
    const parts: string[] = [];
    if (typeof record.message === "string" && record.message.trim()) {
      parts.push(record.message.trim());
    }
    if (typeof record.details === "string" && record.details.trim()) {
      parts.push(record.details.trim());
    }
    if (typeof record.hint === "string" && record.hint.trim()) {
      parts.push(record.hint.trim());
    }
    if (typeof record.code === "string" && record.code.trim()) {
      parts.push(`[${record.code}]`);
    }
    if (parts.length > 0) return parts.join(" ");
    try {
      return JSON.stringify(error);
    } catch {
      return "Onbekende fout";
    }
  }
  return "Onbekende fout";
}
