# Simplified Error Handling System

## Overview

The simplified error handling system provides a single, straightforward function (`handleError`) that allows developers to choose whether to log, report, or show toast notifications for errors. This system removes complexity while maintaining flexibility.

## System Components

1. **Simple Error Handler** - Single function for all error processing
2. **Error Type System** - Standardized error classification
3. **Centralized Logging, Reporting & Toast** - User controls what happens

## Core Function

The main `handleError` function takes an error and options, then lets you decide what to do:

```typescript
import { handleError } from "@/lib/errors";

// Basic usage - shows toast, logs, and reports critical errors automatically
try {
  await someAsyncOperation();
} catch (error) {
  handleError(error);
}

// Advanced usage - full control over behavior
try {
  await updateSubscription(subscriptionId);
} catch (error) {
  handleError(error, {
    context: {
      subscriptionId,
      operation: "update_subscription",
    },
    showToast: true, // Show user-friendly toast
    logError: true, // Log to console
    reportError: false, // Don't report to external service
    fallbackMessage: "Failed to update subscription. Please try again.",
  });
}
```

## Error Handler Options

```typescript
interface ErrorHandlerOptions {
  showToast?: boolean; // Default: true - Show toast notification
  logError?: boolean; // Default: true - Log to console
  reportError?: boolean; // Default: auto (based on severity)
  fallbackMessage?: string; // Default: "An unexpected error occurred. Please try again."
  context?: Partial<ErrorContext>; // Additional context for debugging
}
```

## Usage Patterns

### 1. API Routes

```typescript
import { handleError } from "@/lib/errors";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.requiredField) {
      const error = handleError(new Error("Required field is missing"), {
        context: {
          endpoint: "/api/example",
          payload: body,
        },
        showToast: false, // Don't show toast in API routes
      });

      return NextResponse.json({ error: error.userMessage }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const error = handleError(err, {
      context: { endpoint: "/api/example" },
      showToast: false,
      logError: true,
      reportError: true,
    });

    return NextResponse.json(
      { error: error.userMessage || "Operation failed" },
      { status: 500 }
    );
  }
}
```

### 2. React Query Hooks

```typescript
import { handleError } from "@/lib/errors";

export function useUserData() {
  return useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      const response = await fetch(`/api/user`);

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      return response.json();
    },
    onError: (error) => {
      handleError(error, {
        context: { operation: "fetch_user_data" },
        showToast: true,
      });
    },
  });
}
```

### 3. Mutation Error Handling

```typescript
const mutation = useMutation({
  mutationFn: async (data) => {
    const response = await fetch("/api/update", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Update failed");
    }

    return response.json();
  },
  onError: (error, variables, context) => {
    handleError(error, {
      context: {
        operation: "update_data",
        payload: variables,
      },
      showToast: true,
      fallbackMessage: "Update failed. Please try again.",
    });
  },
});
```

### 4. Component Error Handling

```typescript
// In a React component
const handleSubmit = async (formData) => {
  try {
    await submitData(formData);
    toast.success("Data submitted successfully!");
  } catch (error) {
    handleError(error, {
      context: {
        operation: "form_submission",
        payload: formData,
      },
      showToast: true,
      fallbackMessage: "Failed to submit form. Please try again.",
    });
  }
};
```

## Control What Happens

### Just Log (No Toast, No Reporting)

```typescript
handleError(error, {
  showToast: false,
  logError: true,
  reportError: false,
});
```

### Just Show Toast (No Logging, No Reporting)

```typescript
handleError(error, {
  showToast: true,
  logError: false,
  reportError: false,
});
```

### Just Report (No Toast, No Logging)

```typescript
handleError(error, {
  showToast: false,
  logError: false,
  reportError: true,
});
```

### All Three (Default for High/Critical Errors)

```typescript
handleError(error, {
  showToast: true,
  logError: true,
  reportError: true,
});
```

## Error Types and Auto-Behavior

The system automatically categorizes errors and applies different behaviors:

- **Network Errors**: Medium severity, user-friendly messages, retryable
- **Auth Errors**: Medium severity, redirect suggestions
- **Validation Errors**: Low severity, specific field guidance
- **Server Errors**: High severity, automatic reporting
- **Payment Errors**: High severity, contact support messages

## Context for Better Debugging

Always provide context to help with debugging:

```typescript
handleError(error, {
  context: {
    userId: user.id,
    subscriptionId: subscription.id,
    operation: "cancel_subscription",
    endpoint: "/api/subscription/cancel",
    payload: { reason: "user_requested" },
  },
});
```

## Migration from Complex System

### Before (Complex)

```typescript
// Multiple imports needed
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { apiRequest } from "@/lib/errors/api";

// Complex usage
const { handleMutationError } = useErrorHandler();
const result = await apiRequest("/api/data", {
  context: { operation: "fetch" },
  retries: 3,
  timeout: 5000,
});
```

### After (Simple)

```typescript
// Single import
import { handleError } from "@/lib/errors";

// Simple usage
try {
  const response = await fetch("/api/data");
  if (!response.ok) throw new Error("Failed to fetch");
  const result = await response.json();
} catch (error) {
  handleError(error, {
    context: { operation: "fetch" },
    showToast: true,
  });
}
```

## Benefits of Simplified System

1. **Fewer Imports**: Just import `handleError` from `@/lib/errors`
2. **More Control**: You decide exactly what happens (toast, log, report)
3. **Less Abstraction**: Direct control over fetch calls and error handling
4. **Easier to Understand**: Simple function with clear options
5. **Flexible**: Use with any async operation, not just API calls

## Best Practices

1. **Always provide context** for better debugging
2. **Use appropriate fallback messages** for better UX
3. **Don't show toasts in API routes** (set `showToast: false`)
4. **Log errors in development** for debugging
5. **Report critical errors in production** for monitoring

This simplified system gives you full control while maintaining consistency across your application.
