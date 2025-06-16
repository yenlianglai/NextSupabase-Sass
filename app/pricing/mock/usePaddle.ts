import { toast } from "sonner";
import { PLAN_THRESHOLDS, PRODUCTID_TIER } from "../constant";
import { createClient } from "@/lib/supabase/client";
import { handleError } from "@/lib/errors";
import { useQueryClient } from "@tanstack/react-query";

interface UsePaddleReturn {
  isReady: boolean;
  createSubscription: (planProductId: string, customerId: string) => void;
}

export function usePaddle(): UsePaddleReturn {
  const isReady = true; // Mocking as always ready
  const queryClient = useQueryClient();

  const createSubscription = async (
    planProductId: string,
    customerId: string
  ) => {
    const subscription_id = "mock_subscription_id"; // Mocking a subscription ID
    const tier = PRODUCTID_TIER[planProductId];
    const next_billed_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Mocking next billed date as 30 days from now
    const currentUsage = 0; // Mocking current usage as 0
    const threshold = PLAN_THRESHOLDS[tier as string];

    // Mocking a database update
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error } = await supabase.from("user_quota").upsert({
      id: user!.id,
      customer_id: customerId,
      subscription_id,
      tier,
      num_usages: currentUsage,
      threshold,
      next_billed_at: next_billed_at.toISOString(),
    });

    if (error) {
      handleError(error, {
        context: {
          operation: "create_subscription",
        },
        showToast: true,
        fallbackMessage: "Failed to create subscription. Please try again.",
      });
      return;
    }

    // Mocking a successful subscription creation
    toast.success("Mock: Subscription created successfully!");
    queryClient.invalidateQueries({
      queryKey: ["userQuota"],
    }); // Invalidate user quota cache
  };

  return {
    isReady,
    createSubscription,
  };
}
