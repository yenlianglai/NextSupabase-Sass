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
    console.log("[Webhook] Event type:", type);

    // 6. Handle subscription events
    if (
      type === "subscription.created" ||
      type === "subscription.updated" ||
      type === "subscription.canceled"
    ) {
      const customerId = payload.data?.customer_id;
      const subscription_id = payload.data?.id;
      const item = payload.data?.items?.[0];
      const tier = item?.price?.name?.toLowerCase() ?? "";
      const next_billed_at = item?.next_billed_at;

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
          : tier === "enterprise"
          ? 500
          : 0;

      // 7. Initialize Supabase with service role
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

      // 8. Update user_quota row
      console.log("[Webhook] Updating user_quota for customer:", customerId);
      const { data, error } = await supabase
        .from("user_quota")
        .update({
          tier,
          subscription_id,
          next_billed_at,
          num_usages: 0, // reset usage
          threshold,
        })
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
          message: `Profile updated successfully for customer ${customerId} with tier ${tier}`,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 9. Other event types: ignore
    return new Response(
      JSON.stringify({ message: `No action for event type ${type}` }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    // 10. Catch-all
    console.error("[Webhook] Uncaught error:", err);
    return new Response("Internal server error", { status: 500 });
  }
});
