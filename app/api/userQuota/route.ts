// app/api/userProfile/route.ts

import { NextResponse } from "next/server";
import { getUserQuota } from "@/queries/users";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const id = user?.id;

  if (!id) {
    return NextResponse.json(
      { error: "Missing required query parameter: id" },
      { status: 400 }
    );
  }

  try {
    const userQuota = await getUserQuota(id);

    if (userQuota === undefined) {
      return NextResponse.json(
        { error: `No user quota found` },
        { status: 404 }
      );
    }

    return NextResponse.json(userQuota);
  } catch (err: unknown) {
    console.error("Error fetching user quota:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
