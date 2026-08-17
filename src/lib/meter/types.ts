export interface MeterAxisScore {
  label: string;
  value: number;
  hint: string;
}

export type MeterFindingStatus = "pass" | "warn" | "fail" | "info";

export interface MeterTechnicalFinding {
  category:
    | "Transport"
    | "Markup"
    | "Indexering"
    | "Structured data"
    | "Performance stack"
    | "Conversie stack"
    | "CMS & stack";
  status: MeterFindingStatus;
  label: string;
  detail: string;
}

export interface MeterScanResult {
  siteName: string;
  url: string;
  scores: MeterAxisScore[];
  total: number;
  verdict: string;
  oneLiner: string;
  signals: {
    good: string[];
    bad: string[];
  };
  technicalFindings: MeterTechnicalFinding[];
}

export type MeterPhase =
  | "idle"
  | "scanning"
  | "guess"
  | "revealing"
  | "verdict";

export const METER_AXIS_LABELS = [
  "Design",
  "Vindbaarheid",
  "Conversie",
  "Snelheid",
] as const;
