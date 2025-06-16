import { ProductConfig } from "../constant";

export class ProductUtils {
  static getPriceById(priceId: string): number | null {
    const product = Object.values(ProductConfig).find(
      (p) => p.priceId === priceId
    );
    return product?.cost ?? null;
  }

  static getTierByPriceId(priceId: string): string | null {
    const entry = Object.entries(ProductConfig).find(
      ([, config]) => config.priceId === priceId
    );
    return entry?.[0] ?? null;
  }

  static getThresholdByTier(tier: string): number | null {
    return ProductConfig[tier as keyof typeof ProductConfig]?.threshold ?? null;
  }

  static isFreeTier(tier: string): boolean {
    return tier === "free";
  }

  static formatPrice(amount: number, currency = "USD"): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  }

  static getAllTiers(): string[] {
    return Object.keys(ProductConfig);
  }

  static getUpgradePath(currentTier: string): string[] {
    const tiers = ["free", "basic", "pro", "premium"];
    const currentIndex = tiers.indexOf(currentTier);
    return currentIndex >= 0 ? tiers.slice(currentIndex + 1) : [];
  }

  static canUpgrade(fromTier: string, toTier: string): boolean {
    const upgradePath = this.getUpgradePath(fromTier);
    return upgradePath.includes(toTier);
  }
}
