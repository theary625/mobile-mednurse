/**
 * Supabase connectivity helpers
 * Utilities for detecting connectivity errors and retry logic
 */

/**
 * Detects if an error is related to network connectivity issues
 */
export const isConnectivityError = (error: unknown): boolean => {
  if (!error) return false;
  
  const message = error instanceof Error ? error.message : String(error);
  const lowerMessage = message.toLowerCase();
  
  return (
    lowerMessage.includes('failed to fetch') ||
    lowerMessage.includes('networkerror') ||
    lowerMessage.includes('connection terminated') ||
    lowerMessage.includes('timeout') ||
    lowerMessage.includes('net::err_') ||
    lowerMessage.includes('network request failed') ||
    lowerMessage.includes('load failed') ||
    // Supabase auth specific errors
    ((error as any)?.__isAuthError && (error as any)?.status === 0)
  );
};

/**
 * Retry options for withRetry function
 */
export interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  onRetry?: (attempt: number, error: unknown) => void;
}

/**
 * Wraps an async function with automatic retry logic for connectivity errors
 */
export const withRetry = async <T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> => {
  const {
    maxRetries = 3,
    baseDelay = 2000,
    maxDelay = 30000,
    onRetry,
  } = options;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const isLastAttempt = attempt === maxRetries;
      const isRetryable = isConnectivityError(error);

      if (isLastAttempt || !isRetryable) {
        throw error;
      }

      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
      
      if (onRetry) {
        onRetry(attempt + 1, error);
      }
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new Error('Max retries exceeded');
};

/**
 * Clears potentially stale session data from localStorage
 * Use when session is irrecoverable
 */
export const clearStaleSession = (): void => {
  try {
    // Clear Supabase auth tokens
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('sb-') && key.includes('-auth-token')) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.debug('Failed to clear stale session:', error);
  }
};

/**
 * User-friendly error message for connectivity issues
 */
export const getConnectivityErrorMessage = (error: unknown): string => {
  if (isConnectivityError(error)) {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }
  return error instanceof Error ? error.message : 'An unexpected error occurred.';
};
