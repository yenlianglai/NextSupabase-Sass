"use client";
import React, { useState } from "react";
import { PricingHeader, PricingCard, FeatureTable } from "./components";
import { PricingProvider, usePricingContext } from "./context/PricingContext";

function PricingContent() {
  const [isMonthly, setIsMonthly] = useState(true);
  const { plans } = usePricingContext();

  return (
    <div className="h-full pricing-hero">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <PricingHeader isMonthly={isMonthly} onToggle={setIsMonthly} />

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {plans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* Features Comparison Table */}
        <FeatureTable plans={plans} />
      </div>
    </div>
  );
}

export default function SubscriptionPage() {
  return (
    <PricingProvider>
      <PricingContent />
    </PricingProvider>
  );
}
