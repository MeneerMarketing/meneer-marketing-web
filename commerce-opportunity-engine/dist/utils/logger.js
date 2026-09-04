function serialize(payload) {
    return JSON.stringify(payload);
}
export const logger = {
    info(message, context) {
        console.log(serialize({ level: "info", message, context, timestamp: new Date().toISOString() }));
    },
    warn(message, context) {
        console.warn(serialize({ level: "warn", message, context, timestamp: new Date().toISOString() }));
    },
    error(message, context) {
        console.error(serialize({ level: "error", message, context, timestamp: new Date().toISOString() }));
    },
    debug(message, context) {
        if (process.env.LOG_LEVEL === "debug") {
            console.debug(serialize({ level: "debug", message, context, timestamp: new Date().toISOString() }));
        }
    },
};
//# sourceMappingURL=logger.js.map