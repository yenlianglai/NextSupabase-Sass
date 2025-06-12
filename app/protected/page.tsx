"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useUserProfile } from "@/hooks/users/useUserProfile";
import ProfileContent from "./Profile";
import SubscriptionContent from "./Subscription";
import HistoryContent from "./History";

const menuItems = ["Profile", "Subscription", "History", "Language"];

const sidebarBtn =
  "px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 " +
  "hover:bg-accent/50 border border-transparent hover:border-border/50";

export default function Account() {
  const { isLoading, data: userProfile, isError, error } = useUserProfile();

  const [activeMenu, setActiveMenu] = useState("Profile");
  return (
    <div className="h-full pricing-hero">
      <div className="flex h-full max-w-7xl mx-auto">
        {/* Sidebar */}
        <aside className="w-80 p-6 flex flex-col items-center glass-effect border-r border-border/50">
          <div className="flex flex-col items-center w-full animate-fade-in">
            {isLoading ? (
              <div className="flex h-32 w-32 items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
              </div>
            ) : userProfile && userProfile.avatar_url ? (
              <div className="relative w-24 h-24 mb-4">
                <Image
                  src={userProfile.avatar_url}
                  alt="Avatar"
                  width={96}
                  height={96}
                  className="rounded-full border-4 border-border/50 modern-shadow"
                />
                <div className="absolute bottom-0 right-0 bg-green-500 p-1 rounded-full border-2 border-background">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full gradient-card flex items-center justify-center mb-4 modern-shadow">
                <span className="text-muted-foreground text-sm">No Avatar</span>
              </div>
            )}
            <h2 className="text-xl font-semibold gradient-text text-center">
              {userProfile?.name || "User"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {userProfile?.email}
            </p>
          </div>

          <nav className="w-full mt-8 animate-slide-up">
            <ul className="space-y-3">
              {menuItems.map((item) => {
                const isActive = item === activeMenu;
                return (
                  <li
                    key={item}
                    className={`${sidebarBtn} ${
                      isActive
                        ? "bg-primary/10 border-primary/20 text-primary font-medium"
                        : "text-foreground/80 hover:text-foreground"
                    }`}
                    onClick={() => setActiveMenu(item)}
                  >
                    <span className="transition-colors duration-200">
                      {item}
                    </span>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-4xl">
            {isLoading ? (
              <div className="flex h-96 items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
              </div>
            ) : isError ? (
              <div className="p-8 text-center">
                <div className="gradient-card p-8 rounded-lg">
                  <p className="text-destructive font-medium">
                    Error: {error.message}
                  </p>
                </div>
              </div>
            ) : activeMenu === "Profile" ? (
              <div className="animate-fade-in">
                <ProfileContent userProfile={userProfile!} />
              </div>
            ) : activeMenu === "Subscription" ? (
              <div className="animate-fade-in">
                <SubscriptionContent />
              </div>
            ) : activeMenu === "History" ? (
              <div className="animate-fade-in">
                <HistoryContent userProfile={userProfile!} />
              </div>
            ) : (
              <div className="animate-fade-in">
                <div className="gradient-card p-8 rounded-lg text-center">
                  <h2 className="text-2xl font-bold gradient-text mb-4">
                    {activeMenu}
                  </h2>
                  <p className="text-muted-foreground">
                    This feature is coming soon!
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
