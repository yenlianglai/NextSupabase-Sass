import { createPaddle } from "@/lib/paddle/utils";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/errors";

type UpgradeRequestBody = {
  subscriptionId: string;
  priceId: string;
  quantity?: number;
  prorationBillingMode?:
    | "prorated_immediately"
    | "prorated_next_billing_period";
  currentUsage: number;
};

export async function POST(request: NextRequest) {
  try {
    const body: UpgradeRequestBody = await request.json();
    const {
      subscriptionId,
      priceId,
      quantity = 1,
      prorationBillingMode = "prorated_next_billing_period",
      currentUsage,
    } = body;

    if (!subscriptionId || !priceId) {
      const error = handleError(
        new Error("Subscription ID and Price ID are required"),
        {
          context: {
            endpoint: "/api/subscription/update",
            payload: body,
          },
          showToast: false,
          logError: true,
        }
      );

      return NextResponse.json({ error: error.userMessage }, { status: 400 });
    }

    const paddle = createPaddle();
    const subscription = await paddle.subscriptions.update(subscriptionId, {
      items: [
        {
          priceId,
          quantity,
        },
      ],
      prorationBillingMode,
      onPaymentFailure: "prevent_change",
      customData: {
        currentUsage: currentUsage,
      },
    });

    return NextResponse.json({
      message: "Subscription updated successfully",
      subscription,
    });
  } catch (err: unknown) {
    const error = handleError(err, {
      context: {
        endpoint: "/api/subscription/update",
        subscriptionId: request.body
          ? JSON.parse(await request.text())?.subscriptionId
          : undefined,
      },
      showToast: false,
      logError: true,
      reportError: true,
    });

    return NextResponse.json(
      { error: error.userMessage || "Failed to update subscription" },
      { status: 500 }
    );
  }
}
