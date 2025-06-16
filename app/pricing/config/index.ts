import { ProductConfig } from "../constant";

export interface PricingConfig {
  products: typeof ProductConfig;
  features: Record<string, string[]>;
  billing: {
    defaultCurrency: string;
    supportedCurrencies: string[];
  };
}

export const pricingConfig: PricingConfig = {
  products: ProductConfig,
  features: {
    free: [
      "Limited analytics",
      "Community forum access",
      "Basic dashboard",
      "Up to 5 projects",
    ],
    basic: ["Basic analytics", "Community support"],
    pro: ["Advanced analytics", "Email support", "Custom reports"],
    premium: ["All Pro features", "Dedicated SLA", "Onboarding assistance"],
  },
  billing: {
    defaultCurrency: "USD",
    supportedCurrencies: ["USD", "EUR", "GBP"],
  },
};

// Configuration validator
export const validatePricingConfig = (config: PricingConfig): boolean => {
  try {
    // Validate that all products have required fields
    Object.values(config.products).forEach((product) => {
      if (
        !product.priceId ||
        typeof product.cost !== "number" ||
        !product.currency
      ) {
        throw new Error("Invalid product configuration");
      }
    });

    // Validate that features exist for all products
    Object.keys(config.products).forEach((tier) => {
      if (!config.features[tier]) {
        throw new Error(`Missing features for tier: ${tier}`);
      }
    });

    return true;
  } catch (error) {
    console.error("Pricing configuration validation failed:", error);
    return false;
  }
};
