// app/api/create-stripe-customer/route.ts
import { getPaddleInstance } from "@/lib/paddle/utils";
import { createServiceClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("API_ROUTE_SECRET");

  if (secret !== process.env.API_ROUTE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { id, email } = body.record;
  if (!id || !email) {
    return NextResponse.json(
      { error: "Missing id or email in request body" },
      { status: 400 }
    );
  }

  // create a Paddle customer
  const Paddle = getPaddleInstance();

  let customer;
  try {
    customer = await Paddle.customers.create({
      email,
    });
  } catch (err: unknown) {
    console.log("Error creating Paddle customer:", err);

    return NextResponse.json(
      {
        error: `Paddle error: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }

  // update Supabase profile row
  const supabase = await createServiceClient();
  const { error: profileError } = await supabase
    .from("user_quota")
    .update({ customer_id: customer.id })
    .eq("id", id);

  if (profileError) {
    return NextResponse.json(
      { error: `Database error: ${profileError.message}` },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      message: "Stripe customer created successfully",
      customerId: customer.id,
    },
    { status: 200 }
  );
}
