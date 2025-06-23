import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserQuota } from "@/types";
import { handleError } from "@/lib/errors";

interface CancelSubscriptionData {
  subscriptionId: string;
  effectiveFrom?: string;
}

interface UpdateSubscriptionData {
  subscriptionId: string | null;
  priceId: string;
  quantity: number;
  prorationBillingMode: string;
  currentUsage: number;
  newTier?: string; // Add this to help with optimistic updates
}

interface PlanThresholds {
  [key: string]: number;
}

const PLAN_THRESHOLDS: PlanThresholds = {
  basic: 50,
  pro: 100,
  premium: 500,
  free: 10,
};

export function useSubscriptionMutation() {
  const queryClient = useQueryClient();

  const cancelSubscriptionMutation = useMutation({
    mutationFn: async (data: CancelSubscriptionData) => {
      try {
        const response = await fetch("/api/subscription/cancel", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subscriptionId: data.subscriptionId,
            effectiveFrom: data.effectiveFrom || "next_billing_period",
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw handleError(
            new Error(error.error || "Failed to cancel subscription"),
            {
              context: {
                subscriptionId: data.subscriptionId,
                statusCode: response.status,
              },
              showToast: false, // We'll handle toast in onError
            }
          );
        }

        return response.json();
      } catch (error) {
        // Re-throw to let mutation handle it
        throw error;
      }
    },
    onMutate: () => {
      const loadingToastId = toast.loading("Cancelling subscription...");
      return { loadingToastId };
    },
    onSuccess: (data, variables, context) => {
      toast.success(
        "Subscription cancelled successfully! Changes will take effect at the end of your current billing period.",
        {
          id: context?.loadingToastId,
        }
      );

      // Immediately update cache optimistically
      queryClient.setQueryData(
        ["userQuota"],
        (oldData: UserQuota | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            tier: "free",
            subscription_id: null,
            threshold: 10,
          };
        }
      );

      // Then invalidate to fetch fresh data from server after delay
      setTimeout(async () => {
        await queryClient.invalidateQueries({
          queryKey: ["userQuota"],
          refetchType: "active",
        });
      }, 3000); // Wait 3 seconds for webhook to process
    },
    onError: (error, variables, context) => {
      handleError(error, {
        context: {
          subscriptionId: variables.subscriptionId || undefined,
          operation: "cancel_subscription",
        },
        showToast: true,
        fallbackMessage: "Failed to cancel subscription. Please try again.",
      });

      // Update the loading toast
      if (context?.loadingToastId) {
        toast.dismiss(context.loadingToastId);
      }
    },
  });

  const updateSubscriptionMutation = useMutation({
    mutationFn: async (data: UpdateSubscriptionData) => {
      if (!data.subscriptionId) {
        throw handleError(new Error("No subscription ID available"), {
          context: { operation: "update_subscription" },
          showToast: false,
        });
      }

      try {
        const response = await fetch("/api/subscription/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subscriptionId: data.subscriptionId,
            priceId: data.priceId,
            quantity: data.quantity,
            prorationBillingMode: data.prorationBillingMode,
            currentUsage: data.currentUsage,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw handleError(
            new Error(error.error || "Failed to update subscription"),
            {
              context: {
                subscriptionId: data.subscriptionId || undefined,
                operation: "update_subscription",
                statusCode: response.status,
              },
              showToast: false,
            }
          );
        }

        return response.json();
      } catch (error) {
        throw error;
      }
    },
    onMutate: (variables) => {
      const loadingToastId = toast.loading("Updating subscription...");
      return { loadingToastId, variables };
    },
    onSuccess: (data, variables, context) => {
      toast.success("Subscription updated successfully!", {
        id: context?.loadingToastId,
      });

      // Get new tier from variables or fallback
      const newTier = variables.newTier || "pro";
      const newThreshold = PLAN_THRESHOLDS[newTier] || 10;

      // Immediately update cache optimistically
      queryClient.setQueryData(
        ["userQuota"],
        (oldData: UserQuota | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            tier: newTier,
            threshold: newThreshold,
            num_usages: 0, // Reset usage on upgrade
          };
        }
      );

      // Then invalidate to fetch fresh data from server after delay
      setTimeout(async () => {
        await queryClient.invalidateQueries({
          queryKey: ["userQuota"],
          refetchType: "active",
        });
      }, 3000); // Wait 3 seconds for webhook to process
    },
    onError: (error, variables, context) => {
      handleError(error, {
        context: {
          subscriptionId: variables.subscriptionId || undefined,
          operation: "update_subscription",
          payload: {
            priceId: variables.priceId,
            quantity: variables.quantity,
          },
        },
        showToast: true,
        fallbackMessage: "Failed to update subscription. Please try again.",
      });

      if (context?.loadingToastId) {
        toast.dismiss(context.loadingToastId);
      }
    },
  });

  return {
    cancelSubscription: cancelSubscriptionMutation.mutate,
    updateSubscription: updateSubscriptionMutation.mutate,
    isCancelling: cancelSubscriptionMutation.isPending,
    isUpdating: updateSubscriptionMutation.isPending,
    cancelError: cancelSubscriptionMutation.error,
    updateError: updateSubscriptionMutation.error,
  };
}
