"use client";

import React, { useState } from "react";
import { UserProfile } from "@/types/userProflie";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Row } from "@/components/ui/row";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUserProfileMutation } from "@/hooks/users/useUserProfileMutation";
import { useUserQuota } from "@/hooks/users/useUserQuota";

export default function ProfileContent({
  userProfile,
  setActiveMenu,
}: {
  userProfile: UserProfile;
  setActiveMenu: (menu: string) => void;
}) {
  const formattedDate = new Date(userProfile.created_at).toLocaleDateString();
  const [userName, setUserName] = useState(userProfile.name);
  const { udpateUserProfile, isUpdating } = useUserProfileMutation();
  const { isLoading: isUQLoading, data: userQuota } = useUserQuota();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    udpateUserProfile({
      userName,
      userProfile,
    });
  };

  return (
    <React.Fragment>
      {/* Profile Card */}
      <form
        onSubmit={async (e) => await handleSave(e)}
        className="w-full mx-auto"
      >
        <Card className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
          <CardHeader className="flex-row justify-between items-center mb-4 p-0">
            <CardTitle className="text-2xl font-semibold text-yellow-500">
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Row label="Email">
              <span className="text-gray-600 dark:text-gray-400">
                {userProfile?.email}
              </span>
            </Row>
            <Row label="Username">
              <Input
                id="name"
                type="text"
                placeholder={userProfile?.name}
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              ></Input>
            </Row>
          </CardContent>
          <CardFooter className="p-0 pt-6 justify-end">
            <Button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded"
              disabled={userName === userProfile.name}
            >
              {isUpdating ? "Saving..." : "Save"}
            </Button>
          </CardFooter>
        </Card>
      </form>

      {/* Subscription Card */}
      <Card className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow mt-6">
        <CardHeader className="flex-row justify-between items-center mb-4 p-0">
          <CardTitle className="text-2xl font-semibold text-yellow-500">
            Subscription
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Your subscription will be automatically renewed unless you cancel it
            at least 24 hours before the end of the current period.
          </p>

          <Row
            label={
              <div className="flex gap-5 items-center">
                {"Current Plan"}
                <p
                  onClick={() => setActiveMenu("Pricing")}
                  className="text-yellow-500 hover:text-yellow-600 text-sm cursor-pointer"
                >
                  Upgrade your plan to access more features.
                </p>
              </div>
            }
          >
            <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
              {userProfile.tier?.toLowerCase()}
            </span>
          </Row>
          <Row label="Role">
            <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
              {userProfile.role}
            </span>
          </Row>
          <Row label="Used Quota">
            <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
              {isUQLoading ? "Loading..." : userQuota?.num_usages} /{" "}
              {userQuota?.threshold}
            </span>
          </Row>
          <Row label="Renewal Date">{formattedDate}</Row>
        </CardContent>
      </Card>
    </React.Fragment>
  );
}
