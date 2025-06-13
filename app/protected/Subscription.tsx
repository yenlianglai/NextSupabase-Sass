"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Row } from "@/components/ui/row";
import { useUserQuota } from "@/hooks/users/useUserQuota";
import Link from "next/link";

export default function SubscriptionContent() {
  const { isLoading: isUQLoading, data: userQuota } = useUserQuota();

  console.log(userQuota);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold gradient-text">Subscription</h1>
        <p className="text-muted-foreground mt-2">
          Manage your subscription and billing information
        </p>
      </div>

      {/* Subscription Card */}
      <Card className="gradient-card modern-shadow">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-semibold flex items-center gap-3">
            <div className="w-2 h-8 bg-primary rounded-full"></div>
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="glass-effect p-4 rounded-lg border border-border/50">
            <p className="text-sm text-muted-foreground">
              Your subscription will be automatically renewed unless you cancel
              it at least 24 hours before the end of the current period.
            </p>
          </div>

          <Row
            label={
              <div className="flex flex-col gap-2">
                <span>Plan Status</span>
                <Link
                  href="/pricing"
                  className="text-sm bg-gradient-to-r from-slate-500 via-slate-100 to-slate-500 bg-[length:300%_100%] bg-clip-text text-transparent animate-gradient cursor-pointer hover:from-slate-600 hover:via-slate-200 hover:to-slate-600 transition-all"
                >
                  Upgrade your plan to access more features →
                </Link>
              </div>
            }
          >
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-primary/10 text-primary border border-primary/20">
              {userQuota?.tier || "Free"}
            </span>
          </Row>

          <Row label="Usage">
            <div className="flex flex-col items-end gap-1">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-accent/50 text-foreground/80">
                {isUQLoading ? "Loading..." : userQuota?.num_usages || 0} /{" "}
                {userQuota?.threshold || "∞"}
              </span>
              <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{
                    width: userQuota?.threshold
                      ? `${Math.min(
                          (userQuota.num_usages! / userQuota.threshold) * 100,
                          100
                        )}%`
                      : "0%",
                  }}
                />
              </div>
            </div>
          </Row>

          <Row label="Billing Cycle">
            {userQuota?.next_billed_at ? (
              <span className="text-foreground/80 font-medium">
                {new Date(userQuota.next_billed_at).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </span>
            ) : (
              <span className="text-muted-foreground">No upcoming renewal</span>
            )}
          </Row>
        </CardContent>
      </Card>
    </div>
  );
}
