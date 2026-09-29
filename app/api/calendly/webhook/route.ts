import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { serviceClient } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

// Calendly webhook (invitee.created / invitee.canceled). Marks the most
// recent unbooked order for the invitee's email as booked, so a call booked
// straight from calendly.com still shows up in the account and ops panel.
// Requires CALENDLY_WEBHOOK_SIGNING_KEY (from the webhook subscription).
export async function POST(req: Request) {
  const key = process.env.CALENDLY_WEBHOOK_SIGNING_KEY;
  if (!key) return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });

  const raw = await req.text();
  const sig = req.headers.get("calendly-webhook-signature") ?? "";
  const t = /t=(\d+)/.exec(sig)?.[1];
  const v1 = /v1=([a-f0-9]+)/.exec(sig)?.[1];
  if (!t || !v1) return NextResponse.json({ error: "Bad signature" }, { status: 401 });
  const expected = createHmac("sha256", key).update(`${t}.${raw}`).digest("hex");
  if (expected.length !== v1.length || !timingSafeEqual(Buffer.from(expected), Buffer.from(v1))) {
    return NextResponse.json({ error: "Bad signature" }, { status: 401 });
  }

  let body: { event?: string; payload?: { email?: string; scheduled_event?: { start_time?: string } } };
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const email = body.payload?.email?.toLowerCase();
  if (!email) return NextResponse.json({ ok: true, skipped: "no email" });

  const db = serviceClient();
  if (!db) return NextResponse.json({ error: "Server not configured" }, { status: 503 });

  if (body.event === "invitee.created") {
    const { data: order } = await db
      .from("orders")
      .select("id")
      .ilike("email", email)
      .in("review_status", ["needed", "requested"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!order) return NextResponse.json({ ok: true, skipped: "no open order" });
    await db.from("orders").update({ review_status: "booked", review_booked_at: body.payload?.scheduled_event?.start_time ?? new Date().toISOString() }).eq("id", order.id);
    await db.from("order_events").insert({ order_id: order.id, event: "review_booked", note: "Proof review booked via Calendly", actor: "system" }).then(() => null, () => null);
    return NextResponse.json({ ok: true, order: order.id });
  }
  if (body.event === "invitee.canceled") {
    const { data: order } = await db
      .from("orders")
      .select("id")
      .ilike("email", email)
      .eq("review_status", "booked")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (order) {
      await db.from("orders").update({ review_status: "needed", review_booked_at: null }).eq("id", order.id);
      await db.from("order_events").insert({ order_id: order.id, event: "review_needed", note: "Proof review canceled via Calendly", actor: "system" }).then(() => null, () => null);
    }
    return NextResponse.json({ ok: true, order: order?.id ?? null });
  }
  return NextResponse.json({ ok: true, skipped: body.event });
}
