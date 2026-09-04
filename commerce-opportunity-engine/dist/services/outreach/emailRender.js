/**
 * Minimal personal-business HTML for cold outreach.
 * No tracking pixels, no newsletter layout, no shorteners.
 */
function escapeHtml(value) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}
/** Convert plain-text body paragraphs to simple HTML. */
export function renderOutreachHtml(input) {
    const paragraphs = input.bodyText
        .replace(/\r\n/g, "\n")
        .trim()
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean);
    const bodyHtml = paragraphs
        .map((p) => {
        const withBreaks = escapeHtml(p).replace(/\n/g, "<br>\n");
        return `<p style="margin:0 0 1em 0;font-size:15px;line-height:1.55;color:#1e293b;">${withBreaks}</p>`;
    })
        .join("\n");
    const kvk = input.kvkNumber && input.kvkNumber.trim()
        ? `<br>KVK ${escapeHtml(input.kvkNumber.trim())}`
        : "";
    const footer = `<p style="margin:1.5em 0 0 0;font-size:12px;line-height:1.5;color:#64748b;">
${escapeHtml(input.fromName)}<br>
<a href="${escapeHtml(input.websiteUrl)}" style="color:#C2410C;text-decoration:none;">${escapeHtml(input.websiteLabel)}</a>${kvk}
</p>`;
    return `<!DOCTYPE html>
<html lang="nl">
<head><meta charset="utf-8"><title>Bericht</title></head>
<body style="margin:0;padding:24px;background:#ffffff;font-family:Georgia,'Times New Roman',serif;">
<div style="max-width:560px;">
${bodyHtml}
${footer}
</div>
</body>
</html>`;
}
export function appendTextSignature(body, input) {
    const trimmed = body.trim();
    if (/meneermarketing\.nl/i.test(trimmed))
        return trimmed;
    const kvk = input.kvkNumber && input.kvkNumber.trim()
        ? `\nKVK ${input.kvkNumber.trim()}`
        : "";
    // If signature already ends with Meneer Marketing, only add site/kvk
    if (/Groet,?\s*\n\s*Meneer Marketing\s*$/i.test(trimmed)) {
        return `${trimmed}\n${input.websiteLabel}${kvk}`;
    }
    return `${trimmed}\n\nGroet,\n\n${input.fromName}\n${input.websiteLabel}${kvk}`;
}
export const MM_COMPANY = {
    legalName: "Meneer Marketing",
    fromDisplayName: "Meneer Marketing",
    websiteUrl: "https://meneermarketing.nl",
    websiteLabel: "meneermarketing.nl",
    kvkNumber: "42095913",
    yearsActive: 12,
};
//# sourceMappingURL=emailRender.js.map