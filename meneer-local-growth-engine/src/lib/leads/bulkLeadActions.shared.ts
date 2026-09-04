export const BULK_LEAD_ACTION_MAX = 10;

export type BulkLeadAction = "generate_previews" | "add_wishlist" | "dismiss";

export interface BulkLeadActionItemResult {
  businessId: string;
  studioName: string;
  ok: boolean;
  error?: string;
  detail?: string;
}

export interface BulkLeadActionResult {
  action: BulkLeadAction;
  total: number;
  succeeded: number;
  failed: number;
  results: BulkLeadActionItemResult[];
}
