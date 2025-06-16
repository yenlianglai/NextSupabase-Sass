// Product configuration - centralized product data
export const ProductConfig = {
  basic: {
    cost: 4.99,
    currency: "USD",
    priceId: "pri_01jxex2h6wh3kscwdavj21mhvw",
    threshold: 50,
  },
  pro: {
    cost: 9.99,
    currency: "USD",
    priceId: "pri_01jxex45tsw9y44b0b6j12xj7z",
    threshold: 100,
  },
  premium: {
    cost: 14.99,
    currency: "USD",
    priceId: "pri_01jxex69z43bmy5k0a6ycppnj6",
    threshold: 500,
  },
  free: {
    cost: 0,
    currency: "USD",
    priceId: "free-trial",
    threshold: 10,
  },
} as const;

// Legacy Product object for backward compatibility
export const Product = {
  basic: {
    cost: ProductConfig.basic.cost,
    currency: ProductConfig.basic.currency,
    pricdId: ProductConfig.basic.priceId, // Note: keeping the typo for compatibility
  },
  pro: {
    cost: ProductConfig.pro.cost,
    currency: ProductConfig.pro.currency,
    pricdId: ProductConfig.pro.priceId,
  },
  premium: {
    cost: ProductConfig.premium.cost,
    currency: ProductConfig.premium.currency,
    pricdId: ProductConfig.premium.priceId,
  },
};

// Plan configurations using the centralized product config
export const Plans = [
  {
    id: 0,
    name: "free",
    price: `$${ProductConfig.free.cost}`,
    priceUnit: "forever",
    subtitle: "Perfect for getting started and exploring our platform.",
    features: [
      "Limited analytics",
      "Community forum access",
      "Basic dashboard",
      "Up to 5 projects",
    ],
    productId: ProductConfig.free.priceId,
  },
  {
    id: 1,
    name: "basic",
    price: `$${ProductConfig.basic.cost}`,
    priceUnit: "per month",
    subtitle: "Best for small teams and freelancers.",
    features: ["Basic analytics", "Community support"],
    productId: ProductConfig.basic.priceId,
  },
  {
    id: 2,
    name: "pro",
    price: `$${ProductConfig.pro.cost}`,
    priceUnit: "per month",
    subtitle: "Best for growing teams.",
    features: ["Advanced analytics", "Email support", "Custom reports"],
    productId: ProductConfig.pro.priceId,
  },
  {
    id: 3,
    name: "premium",
    price: `$${ProductConfig.premium.cost}`,
    priceUnit: "per month",
    subtitle: "Best for large organizations.",
    features: ["All Pro features", "Dedicated SLA", "Onboarding assistance"],
    productId: ProductConfig.premium.priceId,
  },
];

// Derived configurations from ProductConfig
interface PlanThresholds {
  [key: string]: number;
}

export const PLAN_THRESHOLDS: PlanThresholds = Object.entries(
  ProductConfig
).reduce(
  (acc, [key, config]) => ({
    ...acc,
    [key]: config.threshold,
  }),
  {}
);

interface PRODUCTID_TIER {
  [key: string]: string;
}

export const PRODUCTID_TIER: PRODUCTID_TIER = Object.entries(
  ProductConfig
).reduce(
  (acc, [key, config]) => ({
    ...acc,
    [config.priceId]: key,
  }),
  {}
);
