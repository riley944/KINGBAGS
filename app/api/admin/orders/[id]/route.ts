import { NextResponse } from "next/server";
import { serviceClient, isAdminRequest } from "@/lib/supabase-admin";
import { sendEmail, statusEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

// Ops panel edits that aren't status changes: internal notes and tracking.
// Setting a tracking URL on a shipped order emails the customer the link.
export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = serviceClient();
  if (!db) return NextResponse.json({ error: "Server not configured" }, { status: 503 });

  const { id } = await ctx.params;
  let body: { internal_notes?: string; tracking_carrier?: string; tracking_url?: string; notify?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const patch: Record<string, string | null> = {};
  if (typeof body.internal_notes === "string") patch.internal_notes = body.internal_notes.slice(0, 5000);
  if (typeof body.tracking_carrier === "string") patch.tracking_carrier = body.tracking_carrier.slice(0, 80) || null;
  if (typeof body.tracking_url === "string") patch.tracking_url = body.tracking_url.slice(0, 500) || null;
  if (Object.keys(patch).length === 0) return NextResponse.json({ error: "Nothing to update" }, { status: 400 });

  const { data: order, error } = await db.from("orders").update(patch).eq("id", id).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let email: { ok: boolean; error?: string } | null = null;
  if (body.notify && patch.tracking_url && order.status === "shipped") {
    const tpl = statusEmail("shipped", order);
    if (tpl) email = await sendEmail({ to: order.email, ...tpl });
    await db.from("order_events").insert({ order_id: id, event: "tracking_sent", note: `${order.tracking_carrier ?? "Carrier"}: ${order.tracking_url}`, actor: "team" }).then(() => null, () => null);
  }
  return NextResponse.json({ order, email });
}
