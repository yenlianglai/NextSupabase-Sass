import { createPaddle } from "@/lib/paddle/utils";
import { NextRequest, NextResponse } from "next/server";
import { handleError, ErrorType, ErrorSeverity } from "@/lib/errors";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subscriptionId, effectiveFrom } = body;

    if (!subscriptionId) {
      const error = handleError(new Error("Subscription ID is required"), {
        context: {
          endpoint: "/api/subscription/cancel",
          payload: body,
        },
        showToast: false,
        logError: true,
      });

      return NextResponse.json({ error: error.userMessage }, { status: 400 });
    }

    const paddle = createPaddle();
    const subscription = await paddle.subscriptions.cancel(subscriptionId, {
      effectiveFrom,
    });

    return NextResponse.json({
      message: "Subscription cancelled successfully",
      subscription,
    });
  } catch (err: unknown) {
    const error = handleError(err, {
      context: {
        endpoint: "/api/subscription/cancel",
        subscriptionId: request.body
          ? JSON.parse(await request.text())?.subscriptionId
          : undefined,
      },
      showToast: false,
      logError: true,
      reportError: true,
    });

    return NextResponse.json(
      { error: error.userMessage || "Failed to cancel subscription" },
      { status: 500 }
    );
  }
}
