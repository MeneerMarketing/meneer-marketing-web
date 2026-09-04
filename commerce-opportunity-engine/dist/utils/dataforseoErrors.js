import axios from "axios";
export function classifyDataForSeoError(err) {
    let httpStatus = null;
    let message = err instanceof Error ? err.message : String(err);
    if (axios.isAxiosError(err)) {
        httpStatus = err.response?.status ?? null;
        const apiMessage = err.response?.data?.status_message;
        if (apiMessage)
            message = String(apiMessage);
        else if (err.message)
            message = err.message;
    }
    const lower = message.toLowerCase();
    if (httpStatus === 402 ||
        lower.includes("payment required") ||
        lower.includes("not enough funds") ||
        lower.includes("insufficient funds") ||
        lower.includes("balance")) {
        return {
            apiStatus: "PAYMENT_REQUIRED",
            message,
            httpStatus: httpStatus ?? 402,
            isTechnicalFailure: true,
        };
    }
    if (httpStatus === 429 || lower.includes("rate limit") || lower.includes("too many requests")) {
        return {
            apiStatus: "RATE_LIMITED",
            message,
            httpStatus: httpStatus ?? 429,
            isTechnicalFailure: true,
        };
    }
    return {
        apiStatus: "ERROR",
        message,
        httpStatus,
        isTechnicalFailure: true,
    };
}
//# sourceMappingURL=dataforseoErrors.js.map