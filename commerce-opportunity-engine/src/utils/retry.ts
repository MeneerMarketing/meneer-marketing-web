export interface RetryOptions {
  maxAttempts: number;
  delayMs: number;
  backoffFactor: number;
  isRetryable?: (error: unknown) => boolean;
}

function defaultIsRetryable(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes("timeout") ||
      message.includes("econnreset") ||
      message.includes("econnaborted") ||
      message.includes("503") ||
      message.includes("502") ||
      message.includes("429")
    );
  }
  return false;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  const isRetryable = options.isRetryable ?? defaultIsRetryable;
  let attempt = 0;
  let delay = options.delayMs;

  while (attempt < options.maxAttempts) {
    try {
      return await fn();
    } catch (error) {
      attempt += 1;
      if (attempt >= options.maxAttempts || !isRetryable(error)) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= options.backoffFactor;
    }
  }

  throw new Error("Retry loop exited unexpectedly");
}
