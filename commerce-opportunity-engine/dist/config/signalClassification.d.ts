import type { SignalClassification } from "../types/signals.js";
export declare function classifySerpSignal(input: {
    serpItemType: string;
    rawItem: Record<string, unknown>;
}): SignalClassification;
export declare function classifyFromStoredOccurrence(row: {
    serp_item_type?: string | null;
    raw_payload?: Record<string, unknown> | null;
}): SignalClassification;
//# sourceMappingURL=signalClassification.d.ts.map