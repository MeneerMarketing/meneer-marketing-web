export function one(value) {
    if (!value)
        return null;
    return Array.isArray(value) ? value[0] ?? null : value;
}
//# sourceMappingURL=one.js.map