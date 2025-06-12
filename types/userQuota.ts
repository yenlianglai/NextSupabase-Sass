export type UserQuota = {
  id: string;
  customer_id: string;
  subscription_id: string;
  tier: "basic" | "pro" | "premium" | "enterprise";
  num_usages: number;
  threshold: number;
  next_billed_at: Date | null;
};
