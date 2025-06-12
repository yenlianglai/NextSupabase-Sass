"use client";

import React from "react";
import Link from "next/link";
import { useUserProfile } from "@/hooks/users/useUserProfile";
import Image from "next/image";

const UserProfileButton = () => {
  const {
    isLoading,
    isFetching,
    data: userProfile,
    isError,
    error,
  } = useUserProfile();

  if (isLoading || isFetching) {
    return <div></div>;
  }
  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex items-center gap-2">
      {userProfile && (
        <span className="text-sm">{`Hi ${userProfile?.name}`}</span>
      )}
      {userProfile?.avatar_url && (
        <Link href="/protected">
          <Image
            src={userProfile.avatar_url}
            width={40}
            height={40}
            alt="user profile image"
            className="rounded-full cursor-pointer hover:opacity-80 transition-opacity duration-200"
            unoptimized
          ></Image>
        </Link>
      )}
    </div>
  );
};

export default UserProfileButton;
