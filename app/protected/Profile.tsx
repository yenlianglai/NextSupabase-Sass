"use client";

import React, { useState } from "react";
import { UserProfile } from "@/types";
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

export default function ProfileContent({
  userProfile,
}: {
  userProfile: UserProfile;
}) {
  const [userName, setUserName] = useState(userProfile.name!);
  const { udpateUserProfile, isUpdating } = useUserProfileMutation();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    udpateUserProfile({
      userName,
      userProfile,
    });
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold gradient-text">Profile Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account information and preferences
        </p>
      </div>

      {/* Profile Card */}
      <form onSubmit={async (e) => await handleSave(e)} className="w-full">
        <Card className="gradient-card modern-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-semibold flex items-center gap-3">
              <div className="w-2 h-8 bg-primary rounded-full"></div>
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Row label="Email Address">
              <span className="text-foreground/80 font-medium">
                {userProfile?.email}
              </span>
            </Row>
            <Row label="User Role">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
                {userProfile?.role}
              </span>
            </Row>
            <Row label="Display Name">
              <Input
                id="name"
                type="text"
                placeholder={userProfile.name!}
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="glass-effect border-border/50 focus:border-primary/50"
              />
            </Row>
          </CardContent>
          <CardFooter className="pt-6 flex justify-end">
            <Button
              type="submit"
              className="btn-modern bg-primary text-primary-foreground hover:bg-primary/90 px-8"
              disabled={userName === userProfile.name}
            >
              {isUpdating ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Saving...
                </div>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
