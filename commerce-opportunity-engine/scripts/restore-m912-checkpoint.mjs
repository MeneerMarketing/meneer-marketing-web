import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const transcript =
  "C:/Users/Flexdesigns/.cursor/projects/c-Users-Flexdesigns-agentroom-meneer-marketing-web/agent-transcripts/edf83dad-3a70-4bd4-9ea4-b10309a84786/edf83dad-3a70-4bd4-9ea4-b10309a84786.jsonl";
const repoRoot = path.resolve(__dirname, "..");

const lines = fs.readFileSync(transcript, "utf8").split("\n");
const fileContents = new Map();

for (const line of lines) {
  if (line.includes("MILESTONE 9.1.3")) break;
  if (!line.trim()) continue;
  try {
    const j = JSON.parse(line);
    const parts = j.message?.content ?? [];
    for (const p of parts) {
      if (p.type !== "tool_use") continue;
      const inp = p.input ?? {};
      const filePath = inp.path ?? inp.target_notebook;
      if (!filePath) continue;

      const norm = filePath.replace(/\\/g, "/").toLowerCase();
      const relevant =
        norm.includes("premium-dtc") ||
        norm.includes("premiumdtcmodelloader") ||
        norm.includes("42cc76e8-9e57-48e9-ac27-7533bc09a2a0.json");

      if (!relevant) continue;

      if (p.name === "Write" && inp.contents) {
        fileContents.set(filePath, inp.contents);
      } else if (p.name === "StrReplace" && inp.old_string && inp.new_string) {
        const current = fileContents.get(filePath);
        if (!current) continue;
        if (!current.includes(inp.old_string)) {
          console.warn("StrReplace miss:", filePath.split(/[/\\]/).pop());
          continue;
        }
        fileContents.set(
          filePath,
          current.replace(inp.old_string, inp.new_string)
        );
      }
    }
  } catch {
    /* skip bad lines */
  }
}

let written = 0;
for (const [filePath, contents] of fileContents) {
  const rel = filePath.replace(/\\/g, "/");
  let outPath;
  if (rel.includes("commerce-opportunity-engine/")) {
    outPath = rel.split("commerce-opportunity-engine/")[1];
  } else {
    continue;
  }
  const full = path.join(repoRoot, outPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, contents, "utf8");
  console.log("restored", outPath);
  written++;
}

console.log(`Done: ${written} files`);
