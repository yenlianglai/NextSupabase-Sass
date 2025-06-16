import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserQuota } from "@/types";
import { handleError } from "@/lib/errors";
import { createClient } from "@/lib/supabase/client";

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
      const supabase = createClient();
      if (!data.subscriptionId) {
        throw handleError(new Error("No subscription ID available"), {
          context: { operation: "cancel_subscription" },
        });
      }
      const { error } = await supabase
        .from("user_quota")
        .update({
          subscription_id: null,
          tier: "free",
          num_usages: 0, // Reset usage on cancellation
          threshold: PLAN_THRESHOLDS["free"],
          next_billed_at: null, // Clear next billed date
        })
        .eq("subscription_id", data.subscriptionId);

      if (error) {
        throw handleError(
          new Error(error.message || "Failed to cancel subscription"),
          {
            context: {
              subscriptionId: data.subscriptionId,
              operation: "cancel_subscription",
            },
            showToast: false, // We'll handle toast in onError
          }
        );
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

      queryClient.invalidateQueries({
        queryKey: ["userQuota"],
        refetchType: "active",
      });
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

      const supabase = createClient();
      const { error } = await supabase
        .from("user_quota")
        .update({
          tier: data.newTier,
          num_usages: data.currentUsage, // Keep current usage
          threshold: PLAN_THRESHOLDS[data.newTier!], // Update threshold based on new tier
          next_billed_at: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(), // Mock next billed date as 30 days from now
        })
        .eq("subscription_id", data.subscriptionId);
      if (error) {
        throw handleError(
          new Error(error.message || "Failed to update subscription"),
          {
            context: {
              subscriptionId: data.subscriptionId,
              operation: "update_subscription",
            },
            showToast: false, // We'll handle toast in onError
          }
        );
      }
    },
    onMutate: (variables) => {
      const loadingToastId = toast.loading("Updating subscription...");
      return { loadingToastId, variables };
    },
    onSuccess: async (data, variables, context) => {
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

      queryClient.invalidateQueries({
        queryKey: ["userQuota"],
        refetchType: "active",
      });
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
