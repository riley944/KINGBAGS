import { NextResponse } from "next/server";
import { serviceClient, userFromRequest } from "@/lib/supabase-admin";
import { stripeClient } from "@/lib/stripe-server";

export const dynamic = "force-dynamic";

// Creates (or refreshes) a SetupIntent for the signed-in customer's own
// order. The card/bank details are saved for off-session use — nothing is
// charged until the proof is approved.
export async function POST(req: Request) {
  const user = await userFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = serviceClient();
  const stripe = stripeClient();
  if (!db || !stripe) {
    return NextResponse.json({ error: "Payments not configured" }, { status: 503 });
  }

  let orderId: string;
  try {
    orderId = (await req.json()).order_id;
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { data: order } = await db.from("orders").select("*").eq("id", orderId).single();
  if (!order || order.user_id !== user.id) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (order.payment_status === "charged") {
    return NextResponse.json({ error: "Order is already paid" }, { status: 400 });
  }

  let customerId: string = order.stripe_customer_id;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: order.email,
      name: order.company,
      phone: order.phone ?? undefined,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;
  }

  const si = await stripe.setupIntents.create({
    customer: customerId,
    usage: "off_session",
    payment_method_types: ["card", "us_bank_account"],
    metadata: { order_id: order.id },
  });

  await db
    .from("orders")
    .update({ stripe_customer_id: customerId, stripe_setup_intent_id: si.id })
    .eq("id", order.id);

  return NextResponse.json({ client_secret: si.client_secret });
}
