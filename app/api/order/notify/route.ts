import { NextResponse } from "next/server";
import { serviceClient, userFromRequest } from "@/lib/supabase-admin";
import { sendEmail, orderReservedEmail, newOrderAlertEmail } from "@/lib/email";
import { CONTACT_EMAIL } from "@/lib/site";

export const dynamic = "force-dynamic";

// Called by the client right after an order row is created. Emails the
// customer a "reserved" confirmation and the team a new-order alert.
//
// When the order came from a reserve link the team sent after the call
// (quote_id of a quote marked "won", same email), the review already
// happened: mark it done so the ops queue goes straight to proof/charge.
export async function POST(req: Request) {
  const user = await userFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = serviceClient();
  if (!db) return NextResponse.json({ error: "Server not configured" }, { status: 503 });
  let orderId: string, quoteId: string | undefined;
  try {
    const b = await req.json();
    orderId = b.order_id;
    quoteId = b.quote_id;
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  let { data: order } = await db.from("orders").select("*").eq("id", orderId).single();
  if (!order || order.user_id !== user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (quoteId && /^[0-9a-f-]{36}$/i.test(quoteId)) {
    const { data: quote } = await db.from("quotes").select("id, email, status").eq("id", quoteId).single();
    if (quote && quote.status === "won" && quote.email.toLowerCase() === String(order.email).toLowerCase() && order.review_status !== "done") {
      const { data: updated } = await db
        .from("orders")
        .update({ review_status: "done", review_booked_at: order.review_booked_at ?? new Date().toISOString() })
        .eq("id", order.id)
        .select("*")
        .single();
      if (updated) order = updated;
      await db.from("order_events").insert({ order_id: order.id, event: "review_done", note: "Reviewed on the call before reserving", actor: "system" }).then(() => null, () => null);
    }
  }

  const [customer, internal] = await Promise.all([
    sendEmail({ to: order.email, ...orderReservedEmail(order) }),
    sendEmail({ to: CONTACT_EMAIL, ...newOrderAlertEmail(order) }),
  ]);
  return NextResponse.json({ ok: customer.ok, internal: internal.ok, reviewed: order.review_status === "done" });
}
