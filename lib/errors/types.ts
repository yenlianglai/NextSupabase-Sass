/**
 * Unified Error Types for the Application
 */

export enum ErrorType {
  // API Errors
  API_ERROR = "API_ERROR",
  NETWORK_ERROR = "NETWORK_ERROR",
  TIMEOUT_ERROR = "TIMEOUT_ERROR",
  RATE_LIMIT_ERROR = "RATE_LIMIT_ERROR",

  // Authentication Errors
  AUTH_ERROR = "AUTH_ERROR",
  UNAUTHORIZED_ERROR = "UNAUTHORIZED_ERROR",
  FORBIDDEN_ERROR = "FORBIDDEN_ERROR",

  // Database Errors
  DATABASE_ERROR = "DATABASE_ERROR",
  CONSTRAINT_ERROR = "CONSTRAINT_ERROR",

  // Subscription Errors
  SUBSCRIPTION_ERROR = "SUBSCRIPTION_ERROR",
  PAYMENT_ERROR = "PAYMENT_ERROR",
  PADDLE_ERROR = "PADDLE_ERROR",

  // Validation Errors
  VALIDATION_ERROR = "VALIDATION_ERROR",
  FORM_ERROR = "FORM_ERROR",

  // Unknown/Generic Errors
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
  SERVER_ERROR = "SERVER_ERROR",
}

export enum ErrorSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export interface ErrorContext {
  userId?: string;
  subscriptionId?: string;
  requestId?: string;
  timestamp?: string;
  userAgent?: string;
  url?: string;
  method?: string;
  payload?: Record<string, unknown>;
  stackTrace?: string;
  statusCode?: number;
  originalError?: unknown;
  endpoint?: string;
  operation?: string;
  attempts?: number;
  componentStack?: string;
  errorBoundary?: boolean;
  mutationVariables?: unknown;
  mutationContext?: unknown;
  mutationType?: string;
  variables?: unknown;
}

export interface AppError {
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  userMessage?: string; // User-friendly message for display
  code?: string | number;
  context?: ErrorContext;
  originalError?: unknown;
  retryable?: boolean;
  reportable?: boolean; // Whether to report to error tracking service
}

export interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  reportError?: boolean;
  fallbackMessage?: string;
  context?: Partial<ErrorContext>;
}
