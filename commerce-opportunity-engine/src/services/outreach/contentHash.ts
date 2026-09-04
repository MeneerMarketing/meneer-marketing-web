import { createHash } from "node:crypto";

/** Stable hash of approved subject+body for change detection. */
export function outreachContentHash(subject: string, body: string): string {
  const normalized = `${subject.trim()}\n---\n${body.trim()}`.replace(
    /\r\n/g,
    "\n"
  );
  return createHash("sha256").update(normalized, "utf8").digest("hex");
}

export function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}
