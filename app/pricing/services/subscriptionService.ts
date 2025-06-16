import { Plan } from "../types";
import { ProductUtils } from "../utils/productUtils";

export class SubscriptionService {
  static isCurrentPlan(planName: string, userTier?: string | null): boolean {
    if (!userTier) return false;
    return planName.toLowerCase().includes(userTier.toLowerCase());
  }

  static getButtonText(isCurrent: boolean, isLoading: boolean): string {
    if (isLoading) {
      return isCurrent ? "Cancelling..." : "Updating...";
    }
    return isCurrent ? "Cancel subscription" : "Get started";
  }

  static getButtonVariant(isCurrent: boolean): "default" | "destructive" {
    return isCurrent ? "destructive" : "default";
  }

  static shouldShowActionButton(plan: Plan): boolean {
    return !ProductUtils.isFreeTier(plan.name);
  }
}
