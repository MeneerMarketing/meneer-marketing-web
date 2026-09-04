type LogLevel = "info" | "warn" | "error" | "debug";

interface LogPayload {
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  timestamp: string;
}

function serialize(payload: LogPayload): string {
  return JSON.stringify(payload);
}

export const logger = {
  info(message: string, context?: Record<string, unknown>): void {
    console.log(serialize({ level: "info", message, context, timestamp: new Date().toISOString() }));
  },
  warn(message: string, context?: Record<string, unknown>): void {
    console.warn(serialize({ level: "warn", message, context, timestamp: new Date().toISOString() }));
  },
  error(message: string, context?: Record<string, unknown>): void {
    console.error(serialize({ level: "error", message, context, timestamp: new Date().toISOString() }));
  },
  debug(message: string, context?: Record<string, unknown>): void {
    if (process.env.LOG_LEVEL === "debug") {
      console.debug(serialize({ level: "debug", message, context, timestamp: new Date().toISOString() }));
    }
  },
};
