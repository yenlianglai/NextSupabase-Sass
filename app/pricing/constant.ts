export const Product = {
  basic: {
    cost: 4.99,
    currency: "USD",
    pricdId: "pri_01jxex2h6wh3kscwdavj21mhvw",
  },
  pro: {
    cost: 9.99,
    currency: "USD",
    pricdId: "pri_01jxex45tsw9y44b0b6j12xj7z",
  },
  premium: {
    cost: 14.99,
    currency: "USD",
    pricdId: "pri_01jxex69z43bmy5k0a6ycppnj6",
  },
};

export const Plans = [
  {
    id: 0,
    name: "free",
    price: "$0",
    priceUnit: "forever",
    subtitle: "Perfect for getting started and exploring our platform.",
    features: [
      "Limited analytics",
      "Community forum access",
      "Basic dashboard",
      "Up to 5 projects",
    ],
    productId: "free-trial",
  },
  {
    id: 1,
    name: "basic",
    price: `$${Product.basic.cost}`,
    priceUnit: "per month",
    subtitle: "Best for small teams and freelancers.",
    features: ["Basic analytics", "Community support"],
    productId: Product.basic.pricdId,
  },
  {
    id: 2,
    name: "pro",
    price: `$${Product.pro.cost}`,
    priceUnit: "per month",
    subtitle: "Best for growing teams.",
    features: ["Advanced analytics", "Email support", "Custom reports"],
    productId: Product.pro.pricdId,
  },
  {
    id: 3,
    name: "premium",
    price: `$${Product.premium.cost}`,
    priceUnit: "per month",
    subtitle: "Best for large organizations.",
    features: ["All Pro features", "Dedicated SLA", "Onboarding assistance"],
    productId: Product.premium.pricdId,
  },
];
