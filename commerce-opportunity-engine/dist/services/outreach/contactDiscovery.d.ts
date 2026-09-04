import { type ContactStatus, type EmailType } from "../../config/outreach.js";
export type DiscoveredContact = {
    fullName: string | null;
    firstName: string | null;
    lastName: string | null;
    jobTitle: string | null;
    email: string;
    emailNormalized: string;
    emailType: EmailType;
    emailConfidence: number;
    contactConfidence: number;
    phone: string | null;
    linkedinUrl: string | null;
    instagramUrl: string | null;
    sourceUrl: string;
    sourceType: string;
    sourceEvidence: string[];
    isUsableForOutreach: boolean;
};
export type ContactDiscoveryResult = {
    contacts: DiscoveredContact[];
    preferred: DiscoveredContact | null;
    preferredReason: string | null;
    contactStatus: ContactStatus;
    pagesChecked: number;
    evidence: Record<string, unknown>;
};
/**
 * Free website contact discovery — public pages only, no login, no guessing.
 */
export declare function discoverBrandContacts(input: {
    domain: string;
    timeoutMs?: number;
    maxPages?: number;
}): Promise<ContactDiscoveryResult>;
export declare function selectPreferredContact(contacts: DiscoveredContact[]): {
    contact: DiscoveredContact | null;
    reason: string | null;
};
//# sourceMappingURL=contactDiscovery.d.ts.map