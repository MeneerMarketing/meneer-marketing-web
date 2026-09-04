import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import type { PremiumPdpModel } from "@/preview/premium-dtc/types";

export type PreviewLifecycle =
  | "INTERNAL_PREVIEW"
  | "VISUAL_REVIEW"
  | "PREVIEW_READY";

export type ConceptPreviewSnapshot = {
  meta: {
    conceptId: string;
    briefId: string;
    brandSlug: string;
    productSlug: string;
    previewSlug: string;
    previewLifecycle: PreviewLifecycle;
    templateFamily: "PREMIUM_DTC";
    templateId: string;
    templateVersion: string;
    domain: string;
    productUrl: string;
    generatedAt: string;
    omittedSections: Array<{ section: string; reason: string }>;
    sectionVariants: Record<string, string>;
    themeReport: {
      usedFallback: boolean;
      fallbackReason: string | null;
      sourceColors: string[];
    };
    crawlPages: string[];
    rationale: Array<{ title: string; body: string }>;
    currentScreenshots: Array<{ url: string; kind: string }>;
  };
  model: PremiumPdpModel;
};

const DATA_DIR = path.join(
  process.cwd(),
  "src/preview/concepts/data"
);

export function loadConceptSnapshot(
  conceptId: string
): ConceptPreviewSnapshot | null {
  const file =
    conceptId === "latest"
      ? path.join(DATA_DIR, "latest.json")
      : path.join(DATA_DIR, `${conceptId}.json`);
  if (!existsSync(file)) return null;
  const raw = readFileSync(file, "utf8");
  return JSON.parse(raw) as ConceptPreviewSnapshot;
}

export function listHydratedConceptIds(): string[] {
  if (!existsSync(DATA_DIR)) return [];
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { readdirSync } = require("node:fs") as typeof import("node:fs");
  return readdirSync(DATA_DIR)
    .filter((f) => f.endsWith(".json") && !f.endsWith(".report.json") && f !== "latest.json")
    .map((f) => f.replace(/\.json$/, ""));
}
