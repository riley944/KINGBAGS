import { NextResponse } from "next/server";
import { serviceClient, userFromRequest } from "@/lib/supabase-admin";
import { stripeClient } from "@/lib/stripe-server";

export const dynamic = "force-dynamic";

// Verifies a completed SetupIntent against Stripe and records the saved
// payment method on the order. Trusts Stripe, not the client.
export async function POST(req: Request) {
  const user = await userFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = serviceClient();
  const stripe = stripeClient();
  if (!db || !stripe) {
    return NextResponse.json({ error: "Payments not configured" }, { status: 503 });
  }

  let body: { order_id?: string; setup_intent_id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const { order_id, setup_intent_id } = body;
  if (!order_id || !setup_intent_id) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { data: order } = await db.from("orders").select("*").eq("id", order_id).single();
  if (!order || order.user_id !== user.id) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (order.stripe_setup_intent_id !== setup_intent_id) {
    return NextResponse.json({ error: "Setup intent mismatch" }, { status: 400 });
  }

  const si = await stripe.setupIntents.retrieve(setup_intent_id);
  // "processing" covers bank-account verification still settling — the
  // payment method is attached and usable once it clears.
  if ((si.status !== "succeeded" && si.status !== "processing") || !si.payment_method) {
    return NextResponse.json({ ok: false, status: si.status });
  }

  const pm = typeof si.payment_method === "string" ? si.payment_method : si.payment_method.id;
  await db
    .from("orders")
    .update({ stripe_payment_method_id: pm, payment_status: "method_saved" })
    .eq("id", order.id);
  await db.from("order_events").insert({
    order_id: order.id,
    event: "payment_method_saved",
    status: order.status,
    actor: "customer",
  });

  return NextResponse.json({ ok: true, status: si.status });
}
