/**
 * Milestone 9.1.1 — prospect brand theme resolver.
 * Primary can stay dark/premium; brandAccent carries warm brand color (e.g. Tensfact orange).
 */
export type ProspectTheme = {
    primary: string;
    secondary: string;
    accent: string;
    /** Warm brand micro-accent (sale, checks, selected). May equal accent. */
    brandAccent: string;
    surface: string;
    surfaceAlt: string;
    cream: string;
    text: string;
    mutedText: string;
    border: string;
    button: string;
    buttonText: string;
    headingFontPreference: string | null;
    bodyFontPreference: string | null;
    usedFallback: boolean;
    fallbackReason: string | null;
    sourceColors: string[];
};
export declare function resolveProspectTheme(input: {
    brandColors?: string[] | null;
    cssColorCandidates?: string[] | null;
    brandAccentCandidates?: string[] | null;
    fontCandidates?: string[] | null;
}): ProspectTheme;
//# sourceMappingURL=prospectThemeResolver.d.ts.map