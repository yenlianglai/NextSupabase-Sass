// app/api/userProfile/route.ts

import { NextResponse } from "next/server";
import { getUserQuota } from "@/queries/users";
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
          endpoint: "/api/userQuota",
        },
        showToast: false,
        logError: true,
      });

      return NextResponse.json({ error: error.userMessage }, { status: 401 });
    }

    const userQuota = await getUserQuota(id);

    if (userQuota === undefined) {
      const error = handleError(new Error("User quota not found"), {
        context: {
          endpoint: "/api/userQuota",
          userId: id,
        },
        showToast: false,
        logError: true,
      });

      return NextResponse.json({ error: error.userMessage }, { status: 404 });
    }

    return NextResponse.json(userQuota);
  } catch (err: unknown) {
    const error = handleError(err, {
      context: {
        endpoint: "/api/userQuota",
      },
      showToast: false,
      logError: true,
      reportError: true,
    });

    return NextResponse.json(
      { error: error.userMessage || "Failed to fetch user quota" },
      { status: 500 }
    );
  }
}
