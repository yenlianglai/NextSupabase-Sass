export interface Plan {
  id: number;
  name: string;
  price: string;
  priceUnit: string;
  subtitle: string;
  features: string[];
  productId: string;
}

export interface PricingState {
  currentTier?: string | null;
  subscriptionId?: string | null;
  customerId?: string | null;
  numUsages?: number;
  isLoading: boolean;
}

export interface PricingActions {
  onSubscribe: (planProductId: string) => Promise<void>;
  onCancel: () => Promise<void>;
}

export interface PricingContextValue extends PricingState, PricingActions {
  plans: Plan[];
  paddleReady: boolean;
  isCurrentPlan: (planName: string) => boolean;
}
