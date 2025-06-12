"use client";
import React from "react";
import { UserProfile } from "@/types/userProflie";

export default function HistoryContent({
  userProfile,
}: {
  userProfile: UserProfile;
}) {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">History</h3>
      <p>View your activity history here.</p>
      {/* Use userProfile.email to fetch essays */}
    </div>
  );
}
