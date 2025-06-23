"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useUserProfile } from "@/hooks/users/useUserProfile";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function UserProfileButton() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };

  const {
    isLoading,
    isFetching,
    data: userProfile,
    isError,
    error,
  } = useUserProfile();

  if (isLoading || isFetching) return null;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className="relative z-30" ref={ref}>
      <div
        className="flex items-center gap-2 cursor-pointer"
        onMouseEnter={() => setOpen(true)}
      >
        {userProfile?.avatar_url && (
          <Image
            src={userProfile.avatar_url}
            width={40}
            height={40}
            alt="user profile image"
            className="rounded-full hover:opacity-80 transition-all duration-200 border-2 border-border/50 hover:border-primary/50"
            unoptimized
          />
        )}
      </div>

      {open && userProfile && (
        <div
          className="absolute right-0 mt-2 w-56 glass-effect border border-border/70 dark:border-slate-400 rounded-lg modern-shadow z-10 animate-fade-in dark:shadow-[0_0_15px_rgba(148,163,184,0.4),inset_0_1px_0_rgba(203,213,225,0.4),inset_0_-1px_0_rgba(71,85,105,0.6)]"
          onMouseLeave={() => setOpen(false)}
        >
          <div className="flex flex-col items-center py-6">
            {userProfile.avatar_url && (
              <Image
                src={userProfile.avatar_url}
                width={64}
                height={64}
                alt="user avatar"
                className="rounded-full border-4 border-border/50 modern-shadow"
                unoptimized
              />
            )}
            <span className="mt-3 font-medium gradient-text text-center">
              {userProfile.name}
            </span>
            <span className="text-sm text-muted-foreground mt-1">
              {userProfile.email}
            </span>
          </div>
          <div className="border-t border-border/30" />
          <nav
            className="flex flex-col p-3 space-y-1"
            onClick={() => setOpen(false)}
          >
            <Link
              href="/protected"
              className="flex items-center justify-center px-4 py-3 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent/50 rounded-lg transition-all duration-200 btn-modern"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Dashboard
            </Link>

            <button
              onClick={logout}
              className="flex items-center justify-center px-4 py-3 text-sm font-medium text-destructive dark:text-red-400 hover:text-destructive/80 dark:hover:text-red-300 hover:bg-destructive/10 dark:hover:bg-red-500/20 rounded-lg transition-all duration-200 btn-modern"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sign Out
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
