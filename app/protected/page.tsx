"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useUserProfile } from "@/hooks/users/useUserProfile";
import ProfileContent from "./Profile";
import PricingContent from "./Pricing";
import HistoryContent from "./History";

const menuItems = ["Profile", "Pricing", "History", "Language"];

const sidebarBtn =
  "px-4 py-2 rounded-l-full cursor-pointer " +
  "hover:bg-gray-200 dark:hover:bg-gray-700";

export default function Account() {
  const { isLoading, data: userProfile, isError, error } = useUserProfile();

  const [activeMenu, setActiveMenu] = useState("Profile");
  return (
    <div className="flex h-full bg-white dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 p-6 flex flex-col items-center bg-gray-100 dark:bg-gray-800">
        <div className="flex flex-col items-center w-32 h-32">
          {isLoading ? (
            <div className="flex h-full w-full items-center justify-center"></div>
          ) : userProfile && userProfile.avatar_url ? (
            <div className="relative w-20 h-20">
              <Image
                src={userProfile.avatar_url}
                alt="Avatar"
                width={80}
                height={80}
                className="rounded-full"
              />
              <div className="absolute bottom-0 right-0 bg-yellow-500 p-1 rounded-full border-2 border-white dark:border-gray-800">
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
            <div className="w-20 h-20 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400">
                No Avatar
              </span>
            </div>
          )}
          <h2 className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
            {userProfile?.name}
          </h2>
        </div>

        <nav className="w-full mt-6">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const activeCls =
                item === activeMenu
                  ? "bg-gray-300 dark:bg-gray-700"
                  : "bg-transparent";
              return (
                <li
                  key={item}
                  className={sidebarBtn + " " + activeCls}
                  onClick={() => setActiveMenu(item)}
                >
                  <span className="text-gray-900 dark:text-gray-100">
                    {item}
                  </span>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 space-y-4">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500" />
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-red-600 dark:text-red-500">
            Error: {error.message}
          </div>
        ) : activeMenu === "Profile" ? (
          <ProfileContent
            userProfile={userProfile!}
            setActiveMenu={setActiveMenu}
          />
        ) : activeMenu === "Pricing" ? (
          <PricingContent />
        ) : activeMenu === "History" ? (
          <HistoryContent userProfile={userProfile!} />
        ) : null}
      </main>
    </div>
  );
}
