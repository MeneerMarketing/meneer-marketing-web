/**
 * Milestone 9.1.1 — prospect brand theme resolver.
 * Primary can stay dark/premium; brandAccent carries warm brand color (e.g. Tensfact orange).
 */
const NEUTRAL = {
    primary: "#111111",
    secondary: "#3f3f46",
    accent: "#111111",
    brandAccent: "#e85d04",
    surface: "#f7f6f4",
    surfaceAlt: "#f1f0ee",
    cream: "#fafaf9",
    text: "#111111",
    mutedText: "#57534e",
    border: "rgba(17, 17, 17, 0.12)",
    button: "#111111",
    buttonText: "#fafaf9",
};
function hexToRgb(hex) {
    const h = hex.replace("#", "").trim();
    if (h.length === 3) {
        return {
            r: parseInt(h[0] + h[0], 16),
            g: parseInt(h[1] + h[1], 16),
            b: parseInt(h[2] + h[2], 16),
        };
    }
    if (h.length !== 6)
        return null;
    return {
        r: parseInt(h.slice(0, 2), 16),
        g: parseInt(h.slice(2, 4), 16),
        b: parseInt(h.slice(4, 6), 16),
    };
}
function relativeLuminance(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb)
        return null;
    const lin = [rgb.r, rgb.g, rgb.b].map((c) => {
        const s = c / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}
function contrastRatio(a, b) {
    const la = relativeLuminance(a);
    const lb = relativeLuminance(b);
    if (la == null || lb == null)
        return null;
    const lighter = Math.max(la, lb);
    const darker = Math.min(la, lb);
    return (lighter + 0.05) / (darker + 0.05);
}
function isUglyFramework(hex) {
    const h = hex.toLowerCase();
    if (["#28a745", "#198754", "#22c55e", "#16a34a", "#4ade80", "#0d6efd", "#0dcaf0"].includes(h)) {
        return true;
    }
    const rgb = hexToRgb(hex);
    if (!rgb)
        return true;
    const max = Math.max(rgb.r, rgb.g, rgb.b);
    const min = Math.min(rgb.r, rgb.g, rgb.b);
    const sat = max === 0 ? 0 : (max - min) / max;
    // success greens
    if (rgb.g > rgb.r + 40 && rgb.g > rgb.b + 40 && sat > 0.45 && max > 140)
        return true;
    return false;
}
function pickDarkPrimary(colors) {
    const scored = colors
        .filter((c) => /^#([0-9a-f]{6})$/i.test(c))
        .filter((c) => !isUglyFramework(c))
        .map((c) => {
        const l = relativeLuminance(c) ?? 1;
        const contrast = contrastRatio(c, "#fafaf9") ?? 0;
        return { c, score: (l < 0.2 ? 20 : 0) + contrast * 4 };
    })
        .filter((x) => (contrastRatio(x.c, "#fafaf9") ?? 0) >= 7)
        .sort((a, b) => b.score - a.score);
    return scored[0]?.c ?? "#111111";
}
function pickBrandAccent(preferred, colors) {
    const pool = [...(preferred ?? []), ...colors].filter((c) => /^#([0-9a-f]{6})$/i.test(c));
    for (const hex of pool) {
        if (isUglyFramework(hex))
            continue;
        const rgb = hexToRgb(hex);
        if (!rgb)
            continue;
        if (rgb.r > 180 && rgb.g > 60 && rgb.g < 170 && rgb.b < 110 && rgb.r > rgb.g) {
            return hex.toLowerCase();
        }
    }
    return NEUTRAL.brandAccent;
}
export function resolveProspectTheme(input) {
    const sourceColors = [
        ...(input.brandColors ?? []),
        ...(input.cssColorCandidates ?? []),
    ].filter((c) => /^#/.test(c));
    const primary = pickDarkPrimary(sourceColors);
    const brandAccent = pickBrandAccent(input.brandAccentCandidates ?? undefined, sourceColors);
    const fonts = (input.fontCandidates ?? []).filter((f) => !/arial|helvetica|sans-serif|system-ui|inherit/i.test(f));
    const usedFallback = primary === "#111111" && sourceColors.length < 2;
    return {
        primary,
        secondary: "#3f3f46",
        accent: primary,
        brandAccent,
        surface: "#f7f6f4",
        surfaceAlt: "#f1f0ee",
        cream: "#fafaf9",
        text: "#111111",
        mutedText: "#57534e",
        border: "rgba(17, 17, 17, 0.12)",
        button: primary,
        buttonText: "#fafaf9",
        headingFontPreference: fonts[0] ?? null,
        bodyFontPreference: fonts[1] ?? fonts[0] ?? null,
        usedFallback,
        fallbackReason: usedFallback
            ? "Limited reliable brand hex; dark primary + warm accent"
            : null,
        sourceColors: sourceColors.slice(0, 12),
    };
}
//# sourceMappingURL=prospectThemeResolver.js.map