import type { SupabaseClient } from "@supabase/supabase-js";
import type { DiscoveredContact } from "./contactDiscovery.js";
export declare function isEmailOrDomainSuppressed(client: SupabaseClient, email: string | null, domain: string): Promise<boolean>;
export declare function upsertDiscoveredContacts(client: SupabaseClient, brandId: string, contacts: DiscoveredContact[], preferredEmail: string | null): Promise<{
    ids: string[];
    preferredId: string | null;
}>;
export declare function findingIdFromTitle(title: string, index: number): string;
export declare function countSupportedFindings(leaks: unknown, validations: unknown): number;
//# sourceMappingURL=outreachRepository.d.ts.map