import { db } from "@/db";
import { eq } from "drizzle-orm";
import { profile } from "@/db/schema";
import { User as SupabaseUser } from "@supabase/supabase-js";

export const updateUserProfile = async (user: SupabaseUser) => {
  if (!user.email) {
    throw new Error("User email is required to update a profile.");
  }
  try {
    await db
      .update(profile)
      .set({
        avatar_url: user.user_metadata?.avatar_url || null,
      })
      .where(eq(profile.email, user.email));
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user profile.");
  }
};
