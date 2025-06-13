import { toast } from "sonner";
import {
  AppError,
  ErrorType,
  ErrorSeverity,
  ErrorHandlerOptions,
  ErrorContext,
} from "./types";

// Re-export types for convenience
export { ErrorType, ErrorSeverity } from "./types";

/**
 * Simple error handler that allows users to decide whether to log, report, or toast
 */
export function handleError(
  error: unknown,
  options: ErrorHandlerOptions = {}
): AppError {
  const appError = normalizeError(error, options.context);

  const {
    showToast = true,
    logError = true,
    reportError = appError.reportable ??
      (appError.severity === ErrorSeverity.HIGH ||
        appError.severity === ErrorSeverity.CRITICAL),
    fallbackMessage = "An unexpected error occurred. Please try again.",
  } = options;

  // Log error for debugging
  if (logError) {
    logErrorToConsole(appError);
  }

  // Report to error tracking service (e.g., Sentry)
  if (reportError && typeof window !== "undefined") {
    reportErrorToService(appError);
  }

  // Show user-friendly toast notification
  if (showToast) {
    showToastMessage(appError, fallbackMessage);
  }

  return appError;
}

/**
 * Convert any error to our standardized AppError format
 */
function normalizeError(
  error: unknown,
  context?: Partial<ErrorContext>
): AppError {
  // Handle our custom AppError
  if (isAppError(error)) {
    return {
      ...error,
      context: { ...error.context, ...context },
    };
  }

  // Handle HTTP Response errors
  if (error instanceof Response) {
    return handleResponseError(error, context);
  }

  // Handle Fetch/Network errors
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return {
      type: ErrorType.NETWORK_ERROR,
      severity: ErrorSeverity.MEDIUM,
      message: "Network connection failed",
      userMessage: "Please check your internet connection and try again.",
      context: { ...context, originalError: error.message },
      retryable: true,
      reportable: false,
    };
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return handleStandardError(error, context);
  }

  // Handle string errors
  if (typeof error === "string") {
    return {
      type: ErrorType.UNKNOWN_ERROR,
      severity: ErrorSeverity.LOW,
      message: error,
      userMessage: error,
      context,
      retryable: false,
      reportable: false,
    };
  }

  // Handle completely unknown errors
  return {
    type: ErrorType.UNKNOWN_ERROR,
    severity: ErrorSeverity.MEDIUM,
    message: "An unknown error occurred",
    userMessage: "Something went wrong. Please try again.",
    context: { ...context, originalError: JSON.stringify(error) },
    retryable: true,
    reportable: true,
  };
}

function handleResponseError(
  response: Response,
  context?: Partial<ErrorContext>
): AppError {
  const baseError = {
    context: {
      ...context,
      statusCode: response.status,
      url: response.url,
    },
    retryable: response.status >= 500 || response.status === 429,
    reportable: response.status >= 500,
  };

  switch (response.status) {
    case 400:
      return {
        ...baseError,
        type: ErrorType.VALIDATION_ERROR,
        severity: ErrorSeverity.LOW,
        message: "Invalid request",
        userMessage: "Please check your input and try again.",
      };
    case 401:
      return {
        ...baseError,
        type: ErrorType.UNAUTHORIZED_ERROR,
        severity: ErrorSeverity.MEDIUM,
        message: "Authentication required",
        userMessage: "Please sign in to continue.",
      };
    case 403:
      return {
        ...baseError,
        type: ErrorType.FORBIDDEN_ERROR,
        severity: ErrorSeverity.MEDIUM,
        message: "Access denied",
        userMessage: "You do not have permission to perform this action.",
      };
    case 404:
      return {
        ...baseError,
        type: ErrorType.API_ERROR,
        severity: ErrorSeverity.LOW,
        message: "Resource not found",
        userMessage: "The requested resource was not found.",
      };
    case 429:
      return {
        ...baseError,
        type: ErrorType.RATE_LIMIT_ERROR,
        severity: ErrorSeverity.MEDIUM,
        message: "Too many requests",
        userMessage: "Please wait a moment before trying again.",
      };
    case 500:
    case 502:
    case 503:
    case 504:
      return {
        ...baseError,
        type: ErrorType.SERVER_ERROR,
        severity: ErrorSeverity.HIGH,
        message: "Server error",
        userMessage: "Server is experiencing issues. Please try again later.",
      };
    default:
      return {
        ...baseError,
        type: ErrorType.API_ERROR,
        severity: ErrorSeverity.MEDIUM,
        message: `HTTP ${response.status}`,
        userMessage: "An error occurred. Please try again.",
      };
  }
}

function handleStandardError(
  error: Error,
  context?: Partial<ErrorContext>
): AppError {
  // Handle specific error types by name or message
  if (error.name === "AbortError") {
    return {
      type: ErrorType.API_ERROR,
      severity: ErrorSeverity.LOW,
      message: "Request was cancelled",
      userMessage: "Request was cancelled.",
      context,
      retryable: true,
      reportable: false,
    };
  }

  if (error.message.includes("subscription")) {
    return {
      type: ErrorType.SUBSCRIPTION_ERROR,
      severity: ErrorSeverity.MEDIUM,
      message: error.message,
      userMessage:
        "There was an issue with your subscription. Please try again.",
      context: { ...context, stackTrace: error.stack },
      retryable: true,
      reportable: true,
    };
  }

  if (error.message.includes("payment") || error.message.includes("paddle")) {
    return {
      type: ErrorType.PAYMENT_ERROR,
      severity: ErrorSeverity.HIGH,
      message: error.message,
      userMessage:
        "Payment processing failed. Please try again or contact support.",
      context: { ...context, stackTrace: error.stack },
      retryable: true,
      reportable: true,
    };
  }

  // Generic Error handling
  return {
    type: ErrorType.UNKNOWN_ERROR,
    severity: ErrorSeverity.MEDIUM,
    message: error.message,
    userMessage: "An unexpected error occurred. Please try again.",
    context: { ...context, stackTrace: error.stack },
    retryable: true,
    reportable: true,
  };
}

function isAppError(error: unknown): error is AppError {
  return (
    typeof error === "object" &&
    error !== null &&
    "type" in error &&
    "severity" in error &&
    "message" in error
  );
}

function logErrorToConsole(error: AppError): void {
  const logMethod = getLogMethod(error.severity);
  logMethod("[ErrorHandler]", {
    type: error.type,
    severity: error.severity,
    message: error.message,
    context: error.context,
    timestamp: new Date().toISOString(),
  });
}

function getLogMethod(severity: ErrorSeverity) {
  switch (severity) {
    case ErrorSeverity.LOW:
      return console.info;
    case ErrorSeverity.MEDIUM:
      return console.warn;
    case ErrorSeverity.HIGH:
    case ErrorSeverity.CRITICAL:
      return console.error;
    default:
      return console.log;
  }
}

function reportErrorToService(error: AppError): void {
  // Here you would integrate with your error reporting service
  // Examples: Sentry, LogRocket, Bugsnag, etc.

  // For now, we'll just log to console in development
  if (process.env.NODE_ENV === "development") {
    console.error("[Error Reporting]", error);
  }

  // Example Sentry integration:
  // import * as Sentry from '@sentry/nextjs';
  // Sentry.captureException(error.originalError || new Error(error.message), {
  //   tags: {
  //     errorType: error.type,
  //     severity: error.severity,
  //   },
  //   extra: error.context,
  // });
}

function showToastMessage(error: AppError, fallbackMessage: string): void {
  const message = error.userMessage || fallbackMessage;

  switch (error.severity) {
    case ErrorSeverity.LOW:
      toast.info(message);
      break;
    case ErrorSeverity.MEDIUM:
      toast.warning(message);
      break;
    case ErrorSeverity.HIGH:
    case ErrorSeverity.CRITICAL:
      toast.error(message);
      break;
    default:
      toast.error(message);
  }
}

/**
 * Create a custom error with proper typing
 */
export function createError(
  type: ErrorType,
  message: string,
  options: Partial<
    Pick<
      AppError,
      "severity" | "userMessage" | "context" | "retryable" | "reportable"
    >
  > = {}
): AppError {
  return {
    type,
    severity: options.severity || ErrorSeverity.MEDIUM,
    message,
    userMessage: options.userMessage || message,
    context: options.context,
    retryable: options.retryable ?? false,
    reportable: options.reportable ?? true,
  };
}
