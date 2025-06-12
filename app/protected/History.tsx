"use client";
import React from "react";
import { UserProfile } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HistoryContent({
  userProfile,
}: {
  userProfile: UserProfile;
}) {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold gradient-text">Activity History</h1>
        <p className="text-muted-foreground mt-2">
          View your recent activity and usage statistics for {userProfile.email}
        </p>
      </div>

      <Card className="gradient-card modern-shadow">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-semibold flex items-center gap-3">
            <div className="w-2 h-8 bg-primary rounded-full"></div>
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-foreground/80 mb-2">
              No Activity Yet
            </h3>
            <p className="text-muted-foreground">
              Your activity history will appear here once you start using our
              services.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
