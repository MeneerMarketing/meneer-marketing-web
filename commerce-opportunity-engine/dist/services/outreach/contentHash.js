import { createHash } from "node:crypto";
/** Stable hash of approved subject+body for change detection. */
export function outreachContentHash(subject, body) {
    const normalized = `${subject.trim()}\n---\n${body.trim()}`.replace(/\r\n/g, "\n");
    return createHash("sha256").update(normalized, "utf8").digest("hex");
}
export function countWords(text) {
    return text
        .trim()
        .split(/\s+/)
        .filter(Boolean).length;
}
//# sourceMappingURL=contentHash.js.map