"use client";
import React, { useState, useEffect } from "react";
import { initializePaddle, Paddle } from "@paddle/paddle-js";
import { Product } from "@/constant/paddle";
import { useUserQuota } from "@/hooks/users/useUserQuota";

const plans = [
  {
    id: 1,
    name: "Basic",
    price: `${Product.basic.cost}/mo`,
    features: ["Basic analytics", "Community support"],
    productId: Product.basic.pricdId,
  },
  {
    id: 2,
    name: "Pro",
    price: `${Product.pro.cost}/mo`,
    features: ["Advanced analytics", "Email support", "Custom reports"],
    productId: Product.pro.pricdId,
  },
  {
    id: 3,
    name: "Premium",
    price: `${Product.premium.cost}/mo`,
    features: ["All Pro features", "Dedicated SLA", "Onboarding assistance"],
    productId: Product.premium.pricdId,
  },
];

export default function PricingContent() {
  const [paddle, setPaddle] = useState<Paddle | undefined>(undefined);
  const { data: userQuota } = useUserQuota();

  useEffect(() => {
    initializePaddle({
      environment: "sandbox",
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
    }).then((instance) => setPaddle(instance));
  }, []);

  const handleCheckout = (planProductId: string) => {
    if (!paddle) {
      console.error("Paddle not initialized");
      return;
    }
    paddle.Checkout.open({
      customer: {
        id: userQuota!.customer_id,
      },
      settings: {
        displayMode: "overlay",
        theme: "light",
        locale: "en",
        successUrl: `${window.location.origin}/protected/`,
      },
      items: [
        {
          priceId: planProductId,
          quantity: 1,
        },
      ],
    });
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold">Pricing Plans</h1>
        <p className="mt-2 text-gray-600">
          Current plan:{" "}
          <span className="font-semibold text-indigo-600">
            {userQuota?.tier}
          </span>
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const isCurrent =
            plan.name.toLowerCase() === userQuota?.tier?.toLowerCase();
          return (
            <div
              key={plan.id}
              className={`border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow ${
                isCurrent ? "border-indigo-600 bg-indigo-50" : "border-gray-200"
              }`}
            >
              <div className="flex gap-2 items-center mb-4">
                <h2 className="text-2xl font-semibold ">{plan.name}</h2>
                {isCurrent && userQuota.next_billed_at && (
                  <span className="text-gray-500 ">
                    {`Next Pay Day: ${new Date(
                      userQuota.next_billed_at
                    ).toLocaleDateString()}`}
                  </span>
                )}
              </div>
              <p className="text-3xl font-bold mb-6">{plan.price}</p>

              <ul className="mb-6 space-y-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                disabled={isCurrent || !paddle}
                onClick={() =>
                  !isCurrent && paddle && handleCheckout(plan.productId)
                }
                className={`w-full py-3 font-medium rounded-lg transition focus:outline-none ${
                  isCurrent
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                {isCurrent ? "Current Plan" : "Select"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
