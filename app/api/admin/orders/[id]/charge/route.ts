import { NextResponse } from "next/server";
import Stripe from "stripe";
import { serviceClient, isAdminRequest } from "@/lib/supabase-admin";
import { stripeClient } from "@/lib/stripe-server";
import { sendEmail, paymentCapturedEmail, statusEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

// Charges an order's saved payment method off-session. On success the
// order moves straight to in_production; on failure it parks at
// awaiting_payment with the decline recorded on the timeline.
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const db = serviceClient();
  const stripe = stripeClient();
  if (!db || !stripe) {
    return NextResponse.json({ error: "Payments not configured" }, { status: 503 });
  }

  const { id } = await ctx.params;
  const { data: order } = await db.from("orders").select("*").eq("id", id).single();
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (order.payment_status === "charged") {
    return NextResponse.json({ error: "Order is already paid" }, { status: 400 });
  }
  if (!order.stripe_customer_id || !order.stripe_payment_method_id) {
    return NextResponse.json({ error: "No payment method on file for this order" }, { status: 400 });
  }

  const amount = Math.round(Number(order.total_price) * 100);
  try {
    const pi = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      customer: order.stripe_customer_id,
      payment_method: order.stripe_payment_method_id,
      off_session: true,
      confirm: true,
      description: `KINGBAGS — ${order.product_name} × ${order.quantity.toLocaleString()}`,
      metadata: { order_id: order.id },
    });

    // "processing" is the normal state for ACH debits (settles in days);
    // the charge is in flight, so production proceeds.
    if (pi.status === "succeeded" || pi.status === "processing") {
      await db
        .from("orders")
        .update({
          stripe_payment_intent_id: pi.id,
          payment_status: "charged",
          paid_at: new Date().toISOString(),
          status: "in_production",
        })
        .eq("id", order.id);
      await db.from("order_events").insert({
        order_id: order.id,
        event: "payment_captured",
        status: "in_production",
        note: `$${(amount / 100).toLocaleString()} · ${pi.status}`,
        actor: "team",
      });
      const email = await sendEmail({ to: order.email, ...paymentCapturedEmail(order) });
      return NextResponse.json({ ok: true, payment_status: pi.status, email });
    }

    // Unexpected non-terminal state (e.g. requires_action on a card that
    // demands authentication) — park the order for follow-up.
    await db
      .from("orders")
      .update({ stripe_payment_intent_id: pi.id, payment_status: "failed", status: "awaiting_payment" })
      .eq("id", order.id);
    await db.from("order_events").insert({
      order_id: order.id,
      event: "payment_needs_action",
      status: "awaiting_payment",
      note: `Stripe status: ${pi.status}`,
      actor: "system",
    });
    return NextResponse.json({ ok: false, payment_status: pi.status });
  } catch (err) {
    const message =
      err instanceof Stripe.errors.StripeError
        ? (err.raw as { message?: string })?.message ?? err.message
        : "Charge failed";
    await db
      .from("orders")
      .update({ payment_status: "failed", status: "awaiting_payment" })
      .eq("id", order.id);
    await db.from("order_events").insert({
      order_id: order.id,
      event: "payment_failed",
      status: "awaiting_payment",
      note: message,
      actor: "system",
    });
    const tpl = statusEmail("awaiting_payment", order);
    if (tpl) await sendEmail({ to: order.email, ...tpl });
    return NextResponse.json({ ok: false, error: message }, { status: 402 });
  }
}
