export interface MeterAxisScore {
  label: string;
  value: number;
  hint: string;
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
