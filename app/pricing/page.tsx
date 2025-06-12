"use client";
import React, { useState, useEffect } from "react";
import { initializePaddle, Paddle } from "@paddle/paddle-js";
import { Product } from "@/constant/paddle";
import { useUserQuota } from "@/hooks/users/useUserQuota";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const plans = [
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

export default function SubscriptionContent() {
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
    <div className="h-full pricing-hero">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4 gradient-text">
            Choose a plan that&apos;s right for you
          </h1>
          <p className="text-xl text-muted-foreground mb-8 animate-slide-up">
            Try our basic plan risk free for 30 days. Switch plans or cancel any
            time.
          </p>

          {/* Pricing Toggle */}
          <div className="flex items-center justify-center mb-12 animate-slide-up">
            <div className="glass-effect rounded-lg p-1 flex">
              <Button
                variant="default"
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 btn-modern"
              >
                Annual pricing
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground hover:bg-accent btn-modern"
              >
                Monthly pricing
              </Button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {plans.map((plan) => {
            const isCurrent = plan.name
              .toLowerCase()
              .includes(userQuota?.tier?.toLowerCase() || "");
            return (
              <Card
                key={plan.id}
                className={`gradient-card interactive-hover ${
                  isCurrent ? "border-primary ring-1 ring-primary/20" : ""
                }`}
              >
                <CardHeader className="pb-2 h-1/4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl font-semibold capitalize mb-1 flex items-center justify-between">
                        {plan.name}
                        <div className="w-8 h-8 rounded-full border-2 border-border flex items-center justify-center flex-shrink-0">
                          {isCurrent && (
                            <div className="w-4 h-4 bg-primary rounded-full"></div>
                          )}
                        </div>
                      </CardTitle>
                      <CardDescription className="text-muted-foreground text-sm">
                        {plan.subtitle}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="py-4 h-2/4">
                  <div className="mb-6">
                    <div className="flex items-baseline mb-2">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground ml-2 text-sm">
                        {plan.priceUnit}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <svg
                          className="w-4 h-4 text-green-500 mr-2 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="pt-6 h-1/4">
                  <Button
                    disabled={isCurrent || !paddle}
                    onClick={() => {
                      if (!isCurrent && paddle) {
                        if (plan.productId === "free-trial") {
                          console.log("Free plan selected");
                        } else {
                          handleCheckout(plan.productId);
                        }
                      }
                    }}
                    className={`w-full btn-modern ${
                      isCurrent
                        ? "bg-muted text-muted-foreground cursor-not-allowed hover:bg-muted"
                        : plan.productId === "free-trial"
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                    variant={isCurrent ? "secondary" : "default"}
                  >
                    {isCurrent
                      ? "Current Plan"
                      : plan.productId === "free-trial"
                      ? "Start free trial"
                      : "Get started"}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Features Comparison Table */}
        <Card className="gradient-card">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="w-1/5 text-muted-foreground min-w-[120px]"></TableHead>
                    {plans.map((plan) => {
                      const isCurrent = plan.name
                        .toLowerCase()
                        .includes(userQuota?.tier?.toLowerCase() || "");
                      return (
                        <TableHead key={plan.id} className="text-center">
                          <div className="flex flex-col items-center space-y-2">
                            <div className="flex gap-2">
                              <h4
                                className={`font-semibold text-lg capitalize ${
                                  isCurrent ? "text-primary" : ""
                                }`}
                              >
                                {plan.name}
                              </h4>
                            </div>

                            <div className="text-sm text-muted-foreground">
                              <span className="font-medium">{plan.price}</span>
                              <br />
                              <span className="text-xs">{plan.priceUnit}</span>
                            </div>
                          </div>
                        </TableHead>
                      );
                    })}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Basic Features Section Header */}
                  <TableRow className="border-border hover:bg-accent/50">
                    <TableCell
                      colSpan={5}
                      className="text-lg font-semibold text-foreground/80 py-4 border-t border-border"
                    >
                      Basic features
                    </TableCell>
                  </TableRow>

                  {/* Users Row */}
                  <TableRow className="border-border/50 hover:bg-accent/30">
                    <TableCell className="font-medium text-muted-foreground py-4">
                      Users
                    </TableCell>
                    <TableCell className="text-center py-4">5</TableCell>
                    <TableCell className="text-center py-4">10</TableCell>
                    <TableCell className="text-center py-4">20</TableCell>
                    <TableCell className="text-center py-4">
                      <span className="text-primary font-semibold">
                        Unlimited
                      </span>
                    </TableCell>
                  </TableRow>

                  {/* Individual Data Row */}
                  <TableRow className="border-border/50 hover:bg-accent/30">
                    <TableCell className="font-medium text-muted-foreground py-4">
                      Individual data
                    </TableCell>
                    <TableCell className="text-center py-4">1GB</TableCell>
                    <TableCell className="text-center py-4">20GB</TableCell>
                    <TableCell className="text-center py-4">40GB</TableCell>
                    <TableCell className="text-center py-4">
                      <span className="text-primary font-semibold">
                        Unlimited
                      </span>
                    </TableCell>
                  </TableRow>

                  {/* Support Row */}
                  <TableRow className="border-border/50 hover:bg-accent/30">
                    <TableCell className="font-medium text-muted-foreground py-4">
                      Support
                    </TableCell>
                    <TableCell className="text-center py-4">
                      <div className="flex justify-center">
                        <div className="w-5 h-5 rounded-full border border-border flex items-center justify-center">
                          <div className="w-2 h-2 bg-muted rounded-full"></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center py-4">
                      <div className="flex justify-center">
                        <div className="w-5 h-5 rounded-full border border-border flex items-center justify-center">
                          <div className="w-2 h-2 bg-muted rounded-full"></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center py-4">
                      <div className="flex justify-center">
                        <div className="w-5 h-5 rounded-full border border-primary flex items-center justify-center">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center py-4">
                      <div className="flex justify-center">
                        <div className="w-5 h-5 rounded-full border border-primary flex items-center justify-center">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Reporting and Analytics Section Header */}
                  <TableRow className="border-border hover:bg-accent/50">
                    <TableCell
                      colSpan={5}
                      className="text-lg font-semibold text-foreground/80 py-4 border-t border-border"
                    >
                      Reporting and analytics
                    </TableCell>
                  </TableRow>

                  {/* Analytics Row */}
                  <TableRow className="border-border/50 hover:bg-accent/30">
                    <TableCell className="font-medium text-muted-foreground py-4">
                      Analytics
                    </TableCell>
                    <TableCell className="text-center py-4 text-muted-foreground">
                      Limited
                    </TableCell>
                    <TableCell className="text-center py-4 text-muted-foreground">
                      Basic
                    </TableCell>
                    <TableCell className="text-center py-4">Advanced</TableCell>
                    <TableCell className="text-center py-4">Advanced</TableCell>
                  </TableRow>

                  {/* Export Reports Row */}
                  <TableRow className="border-border/50 hover:bg-accent/30">
                    <TableCell className="font-medium text-muted-foreground py-4">
                      Export reports
                    </TableCell>
                    <TableCell className="text-center py-4">
                      <div className="flex justify-center">
                        <div className="w-5 h-5 rounded-full border border-border flex items-center justify-center">
                          <div className="w-2 h-2 bg-muted rounded-full"></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center py-4">
                      <div className="flex justify-center">
                        <div className="w-5 h-5 rounded-full border border-border flex items-center justify-center">
                          <div className="w-2 h-2 bg-muted rounded-full"></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center py-4">
                      <div className="flex justify-center">
                        <div className="w-5 h-5 rounded-full border border-primary flex items-center justify-center">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center py-4">
                      <div className="flex justify-center">
                        <div className="w-5 h-5 rounded-full border border-primary flex items-center justify-center">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Action buttons at bottom */}
            <div className="grid grid-cols-4 gap-6 mt-8 pt-6 border-t border-border">
              {plans.map((plan) => {
                const isCurrent = plan.name
                  .toLowerCase()
                  .includes(userQuota?.tier?.toLowerCase() || "");
                return (
                  <Button
                    key={plan.id}
                    disabled={isCurrent || !paddle}
                    onClick={() => {
                      if (!isCurrent && paddle) {
                        if (plan.productId === "free-trial") {
                          console.log("Free plan selected");
                        } else {
                          handleCheckout(plan.productId);
                        }
                      }
                    }}
                    className={`btn-modern ${
                      isCurrent
                        ? "bg-muted text-muted-foreground cursor-not-allowed hover:bg-muted"
                        : plan.productId === "free-trial"
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                    variant={isCurrent ? "secondary" : "default"}
                  >
                    {isCurrent
                      ? "Current Plan"
                      : plan.productId === "free-trial"
                      ? "Start free trial"
                      : "Get started"}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
