import {
  UpdateSubscriptionRequestBody,
  Subscription,
} from "@paddle/paddle-node-sdk";

import { createPaddle } from "@/lib/paddle/utils";
import { NextRequest, NextResponse } from "next/server";
import { handleError, ErrorType, ErrorSeverity } from "@/lib/errors";

type cancelRequestBodyType = {
  scheduledChange: {
    action: "cancel";
    effectiveAt: "immediately" | "next_billing_period";
  };
};

type upgradeRequestBodyType = {
  items: [
    {
      priceId: string; // The new plan ID
      quantity: number; // The quantity of the plan
    }
  ];
  scheduledChange: null;
  prorationBillingMode: "prorated_immediately" | "prorated_next_billing_period";
  onPaymentFailure: "prevent_change";
};

async function updateSubscription(
  subscriptionId: string,
  requestBody: UpdateSubscriptionRequestBody
): Promise<Subscription | undefined> {
  try {
    const paddle = createPaddle();
    const subscription = await paddle.subscriptions.update(
      subscriptionId,
      requestBody
    );
    return subscription;
  } catch (e) {
    throw handleError(e, {
      context: {
        subscriptionId,
        operation: "update_subscription",
      },
      showToast: false,
      logError: true,
      reportError: true,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subscriptionId, action, priceId } = body;

    if (!subscriptionId || !action) {
      const error = handleError(
        new Error("Subscription ID and action are required"),
        {
          context: {
            endpoint: "/api/subscription",
            payload: body,
          },
          showToast: false,
          logError: true,
        }
      );

      return NextResponse.json({ error: error.userMessage }, { status: 400 });
    }

    switch (action as string) {
      case "cancel": {
        const cancelBody: cancelRequestBodyType = {
          scheduledChange: {
            action: "cancel",
            effectiveAt: "immediately",
          },
        };
        await updateSubscription(subscriptionId, cancelBody);
        break;
      }
      case "upgrade": {
        if (!priceId) {
          const error = handleError(
            new Error("Price ID is required for upgrade action"),
            {
              context: {
                endpoint: "/api/subscription",
                operation: "upgrade",
                subscriptionId,
              },
              showToast: false,
              logError: true,
            }
          );

          return NextResponse.json(
            { error: error.userMessage },
            { status: 400 }
          );
        }

        const upgradeBody: upgradeRequestBodyType = {
          items: [
            {
              priceId: priceId as string,
              quantity: 1,
            },
          ],
          scheduledChange: null,
          prorationBillingMode: "prorated_next_billing_period",
          onPaymentFailure: "prevent_change", // We want to prevent changes on payment failure
        };
        await updateSubscription(subscriptionId, upgradeBody);
        break;
      }
      default: {
        const error = handleError(new Error(`Invalid action: ${action}`), {
          context: {
            endpoint: "/api/subscription",
            operation: action,
            subscriptionId,
          },
          showToast: false,
          logError: true,
        });

        return NextResponse.json({ error: error.userMessage }, { status: 400 });
      }
    }

    return NextResponse.json({
      message: "Subscription updated successfully",
    });
  } catch (err: unknown) {
    const error = handleError(err, {
      context: {
        endpoint: "/api/subscription",
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
