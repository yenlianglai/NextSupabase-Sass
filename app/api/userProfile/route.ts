// app/api/userProfile/route.ts

import { NextResponse } from "next/server";
import { getUserProfile } from "@/queries/users";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const id = user?.id;

  if (!id) {
    return NextResponse.json(
      { error: "Missing required query parameter: email" },
      { status: 400 }
    );
  }

  try {
    const userProfile = await getUserProfile(id);

    if (userProfile === undefined) {
      return NextResponse.json(
        { error: `No user found for id: ${id}` },
        { status: 404 }
      );
    }

    return NextResponse.json(userProfile);
  } catch (err: unknown) {
    console.error("Error fetching user profile:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
