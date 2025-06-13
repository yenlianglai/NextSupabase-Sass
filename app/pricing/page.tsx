"use client";
import React, { useState, useEffect } from "react";
import { initializePaddle, Paddle } from "@paddle/paddle-js";
import { Plans } from "./constant";
import { useUserQuota } from "@/hooks/users/useUserQuota";
import { useUserQuotaMutation } from "@/hooks/users/useUserQuotaMutation";
import { toast } from "sonner";
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

export default function SubscriptionContent() {
  const [paddle, setPaddle] = useState<Paddle | undefined>(undefined);
  const { data: userQuota } = useUserQuota();
  const { cancelSubscription, updateSubscription, isCancelling, isUpdating } =
    useUserQuotaMutation();

  useEffect(() => {
    initializePaddle({
      environment: "sandbox",
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
    }).then((instance) => setPaddle(instance));
  }, []);

  const handleCancelSubscription = async (subscriptionId?: string) => {
    if (!subscriptionId && !userQuota?.subscription_id) {
      toast.error("No subscription ID available");
      return;
    }

    const subId = subscriptionId || userQuota?.subscription_id;

    cancelSubscription({
      subscriptionId: subId!,
      effectiveFrom: "immediately",
    });
  };

  const handleSubscribe = async (planProductId: string) => {
    if (userQuota?.tier === "free") {
      handleCheckout(planProductId);
      return;
    } else {
      // Update existing subscription
      if (!userQuota?.subscription_id) {
        toast.error("No subscription ID available for update");
        return;
      }

      const newPlan = Plans.find((p) => p.productId === planProductId);
      const newTier = newPlan?.name?.toLowerCase() || userQuota.tier!;

      updateSubscription({
        subscriptionId: userQuota.subscription_id,
        priceId: planProductId,
        quantity: 1,
        prorationBillingMode: "prorated_next_billing_period",
        currentUsage: userQuota.num_usages || 0,
        newTier: newTier, // Pass the new tier for optimistic updates
      });
    }
  };

  const handleCheckout = (planProductId: string) => {
    if (!paddle || !userQuota) {
      toast.error("Payment system not initialized. Please try again.");
      return;
    }

    toast.info("Opening checkout...");

    paddle.Checkout.open({
      customer: {
        id: userQuota!.customer_id!,
      },
      settings: {
        displayMode: "overlay",
        theme: "light",
        locale: "en",
        successUrl: `${window.location.origin}/pricing/`,
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
                Monthly pricing
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground hover:bg-accent btn-modern"
              >
                Annual pricing
              </Button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {Plans.map((plan) => {
            const isCurrent = plan.name
              .toLowerCase()
              .includes(userQuota?.tier?.toLowerCase() || "");
            return (
              <Card
                key={plan.id}
                className={`gradient-card interactive-hover relative ${
                  isCurrent ? "border-primary ring-1 ring-primary/20" : ""
                }`}
              >
                {/* Current Plan Badge */}
                {isCurrent && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <div className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                      Current Plan
                    </div>
                  </div>
                )}
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
                {plan.productId !== "free-trial" && (
                  <CardFooter className="pt-6 h-1/4">
                    {isCurrent ? (
                      <Button
                        variant="destructive"
                        className="w-full btn-modern light:bg-red-500 text-white hover:bg-red-600"
                        onClick={() => handleCancelSubscription()}
                        disabled={!paddle || isCancelling}
                      >
                        {isCancelling ? "Cancelling..." : "Cancel subscription"}
                      </Button>
                    ) : (
                      <Button
                        disabled={!paddle || isUpdating}
                        onClick={() => {
                          handleSubscribe(plan.productId);
                        }}
                        className={`w-full btn-modern ${"bg-primary text-primary-foreground hover:bg-green-600/90"}`}
                        variant="default"
                      >
                        {isUpdating ? "Updating..." : "Get started"}
                      </Button>
                    )}
                  </CardFooter>
                )}
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
                    {Plans.map((plan) => {
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

                  {/* Action Buttons Row */}
                  <TableRow className="border-border hover:bg-transparent">
                    <TableCell className="font-medium text-muted-foreground py-6 border-t border-border">
                      Get Started
                    </TableCell>
                    {Plans.map((plan) => {
                      const isCurrent = plan.name
                        .toLowerCase()
                        .includes(userQuota?.tier?.toLowerCase() || "");
                      return plan.productId !== "free-trial" ? (
                        <TableCell
                          key={plan.id}
                          className="text-center py-6 border-t border-border"
                        >
                          {isCurrent ? (
                            <Button
                              variant="destructive"
                              className="min-w-32 btn-modern light:bg-red-500 text-white hover:bg-red-600"
                              onClick={() => handleCancelSubscription()}
                              disabled={isCancelling}
                            >
                              {isCancelling ? "Cancelling..." : "Cancel"}
                            </Button>
                          ) : (
                            <Button
                              disabled={!paddle || isUpdating}
                              onClick={() => {
                                handleSubscribe(plan.productId);
                              }}
                              className={`btn-modern min-w-32 ${"bg-primary text-primary-foreground hover:bg-green-600/90"}`}
                              variant="default"
                            >
                              {isUpdating ? "Updating..." : "Get started"}
                            </Button>
                          )}
                        </TableCell>
                      ) : (
                        <TableCell key={plan.id} />
                      );
                    })}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
