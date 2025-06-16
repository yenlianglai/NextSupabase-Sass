// app/api/userProfile/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { handleError } from "@/lib/errors";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const id = user?.id;

    if (!id) {
      const error = handleError(new Error("User not authenticated"), {
        context: {
          endpoint: "/api/userProfile",
        },
        showToast: false,
        logError: true,
      });

      return NextResponse.json({ error: error.userMessage }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .eq("id", id)
      .single();

    if (!data) {
      const error = handleError(new Error("User profile not found"), {
        context: {
          endpoint: "/api/userProfile",
          userId: id,
        },
        showToast: false,
        logError: true,
      });

      return NextResponse.json({ error: error.userMessage }, { status: 404 });
    } else if (error) {
      const e = handleError(error, {
        context: {
          endpoint: "/api/userProfile",
          userId: id,
        },
        showToast: false,
        logError: true,
      });

      return NextResponse.json(
        { error: e.userMessage || "Failed to fetch user profile" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err: unknown) {
    const error = handleError(err, {
      context: {
        endpoint: "/api/userProfile",
      },
      showToast: false,
      logError: true,
      reportError: true,
    });

    return NextResponse.json(
      { error: error.userMessage || "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}
