// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { validateSignature } from "https://raw.githubusercontent.com/boardshape/deno_paddle_verify/main/mod.ts";

Deno.serve(async (req) => {
  try {
    // 1. Load & verify secret
    const secretKey = Deno.env.get("PADDLE_WEBHOOK_SECRET_KEY") ?? "";
    if (!secretKey) {
      console.error("[Webhook] Missing PADDLE_WEBHOOK_SECRET_KEY env var");
      return new Response("Server misconfiguration", { status: 500 });
    }

    // 2. Fetch & validate signature header
    const signature = req.headers.get("Paddle-Signature");
    if (!signature) {
      console.warn("[Webhook] Missing Paddle-Signature header");
      return new Response("Missing paddle signature", { status: 400 });
    }

    // 3. Read raw body
    const bodyText = await req.text();

    // 4. Validate HMAC signature
    let isValid = false;
    try {
      isValid = await validateSignature(signature, bodyText, secretKey);
    } catch (err) {
      console.error("[Webhook] Error during signature validation:", err);
    }
    if (!isValid) {
      console.warn("[Webhook] Signature validation failed");
      return new Response("Invalid signature", { status: 400 });
    }

    // 5. Parse JSON payload
    const payload = JSON.parse(bodyText);
    const type = payload.event_type;
    const status = payload.data.status;

    console.log("[Webhook] Received event:", type, "with status:", status);

    // 6. Only handle subscription events
    if (
      type === "subscription.created" ||
      (type === "subscription.updated" && status !== "canceled") || // ignore canceled updates
      type === "subscription.canceled"
    ) {
      const customerId = payload.data?.customer_id;
      const subscription_id = payload.data?.id;
      const item = payload.data?.items?.[0];
      const tier = item?.price?.name?.toLowerCase() ?? "";
      const next_billed_at = item?.next_billed_at;
      const currentUsage = payload?.custom_data?.currentUsage;

      if (!customerId || !subscription_id || !tier) {
        console.warn(
          "[Webhook] Missing required fields in payload:",
          payload.data
        );
        return new Response("Missing required fields", { status: 400 });
      }

      // Determine threshold by tier
      const threshold =
        tier === "basic"
          ? 50
          : tier === "pro"
          ? 100
          : tier === "premium"
          ? 500
          : 10; // default to 10 for free trial

      // 7. Initialize Supabase client
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
        {
          global: {
            headers: {
              Authorization: `Bearer ${Deno.env.get(
                "SUPABASE_SERVICE_ROLE_KEY"
              )}`,
            },
          },
        }
      );

      // 8. Build update payload
      const updateData: {
        tier: string;
        subscription_id: string | null;
        next_billed_at: string;
        threshold: number;
        num_usages?: number;
      } = {
        tier,
        subscription_id,
        next_billed_at,
        threshold,
      };

      if (type === "subscription.canceled") {
        // reset to free tier
        updateData.tier = "free";
        updateData.subscription_id = null;
        updateData.threshold = 10;
        updateData.num_usages = 0;
      } else {
        // for created/updated
        updateData.num_usages = currentUsage ?? 0;
      }

      // 9. Perform the update
      const { data, error } = await supabase
        .from("user_quota")
        .update(updateData)
        .eq("customer_id", customerId)
        .select();

      if (error) {
        console.error("[Webhook] Supabase update error:", error);
        return new Response(
          JSON.stringify({ error: "Failed to update profile", details: error }),
          { status: 500 }
        );
      }

      console.log("[Webhook] Supabase update success:", data);
      return new Response(
        JSON.stringify({
          message: `Profile updated successfully for customer ${customerId} with tier ${updateData.tier}`,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 10. Ignore other events
    return new Response(
      JSON.stringify({ message: `No action for event type ${type}` }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[Webhook] Uncaught error:", err);
    return new Response("Internal server error", { status: 500 });
  }
});

//supabase functions deploy paddle_webhook --project-ref lwwmvwssdpezpnmzuotm --no-verify-jwt
