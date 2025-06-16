"use client";
import React, { createContext, useContext, useCallback } from "react";
import { Plans } from "../constant";
import { useUserQuota } from "@/hooks/users/useUserQuota";
import { PricingContextValue } from "../types";

// Import both development and production hooks
import { useSubscriptionMutation as prodUseSubscriptionMutation } from "@/hooks/users/useSubscriptionMutation";
import { useSubscriptionMutation as mockUseSubscriptionMutation } from "../mock/useSubscriptionMutation";
import { usePaddle as prodUsePaddle } from "../hooks/usePaddle";
import { usePaddle as mockUsePaddle } from "../mock/usePaddle";

const useConditionalPaddle = () => {
  if (process.env.NODE_ENV === "development") {
    return mockUsePaddle();
  }
  return prodUsePaddle();
};

const useConditionalSubscriptionMutation = () => {
  if (process.env.NODE_ENV === "development") {
    return mockUseSubscriptionMutation();
  }
  return prodUseSubscriptionMutation();
};

const PricingContext = createContext<PricingContextValue | null>(null);

export const usePricingContext = () => {
  const context = useContext(PricingContext);
  if (!context) {
    throw new Error("usePricingContext must be used within a PricingProvider");
  }
  return context;
};

interface PricingProviderProps {
  children: React.ReactNode;
}

export const PricingProvider: React.FC<PricingProviderProps> = ({
  children,
}) => {
  const { data: userQuota } = useUserQuota();
  const { cancelSubscription, updateSubscription, isCancelling, isUpdating } =
    useConditionalSubscriptionMutation();
  const { isReady: paddleReady, createSubscription } = useConditionalPaddle();

  const isCurrentPlan = useCallback(
    (planName: string) => {
      if (!userQuota?.tier) return false;
      return planName.toLowerCase().includes(userQuota.tier.toLowerCase());
    },
    [userQuota?.tier]
  );

  const handleSubscribe = useCallback(
    async (planProductId: string, planName: string) => {
      if (!userQuota) return;

      if (userQuota.tier === "free") {
        createSubscription(planProductId, userQuota.customer_id!);
      } else {
        updateSubscription({
          subscriptionId: userQuota.subscription_id!,
          priceId: planProductId,
          quantity: 1,
          prorationBillingMode: "prorated_next_billing_period",
          currentUsage: userQuota.num_usages || 0,
          newTier: planName.toLowerCase(),
        });
      }
    },
    [userQuota, createSubscription, updateSubscription]
  );

  const handleCancel = useCallback(async () => {
    if (!userQuota?.subscription_id) return;

    cancelSubscription({
      subscriptionId: userQuota.subscription_id,
      effectiveFrom: "immediately",
    });
  }, [userQuota?.subscription_id, cancelSubscription]);

  const contextValue: PricingContextValue = {
    plans: Plans,
    currentTier: userQuota?.tier,
    subscriptionId: userQuota?.subscription_id,
    customerId: userQuota?.customer_id,
    numUsages: userQuota?.num_usages ?? undefined,
    isLoading: isCancelling || isUpdating,
    paddleReady,
    isCurrentPlan,
    onSubscribe: handleSubscribe,
    onCancel: handleCancel,
  };

  return (
    <PricingContext.Provider value={contextValue}>
      {children}
    </PricingContext.Provider>
  );
};
