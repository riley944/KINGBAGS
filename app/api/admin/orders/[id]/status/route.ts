import { NextResponse } from "next/server";
import { serviceClient, isAdminRequest } from "@/lib/supabase-admin";
import { sendEmail, statusEmail } from "@/lib/email";
import type { OrderStatus } from "@/lib/stages";

export const dynamic = "force-dynamic";

const VALID: OrderStatus[] = [
  "submitted", "art_review", "needs_changes", "art_approved",
  "awaiting_payment", "in_production", "shipped",
];

// Advances an order's status. The DB trigger logs the timeline event; this
// route additionally emails the customer for customer-meaningful changes.
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const db = serviceClient();
  if (!db) {
    return NextResponse.json(
      { error: "Server not configured: SUPABASE_SERVICE_ROLE_KEY missing" },
      { status: 503 }
    );
  }

  const { id } = await ctx.params;
  let status: OrderStatus;
  try {
    const body = await req.json();
    status = body.status;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!VALID.includes(status)) {
    return NextResponse.json({ error: `Invalid status: ${status}` }, { status: 400 });
  }

  const { data: order, error } = await db
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select("*")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Email is best-effort: the status change stands even if sending fails.
  let email: { ok: boolean; error?: string } | null = null;
  const tpl = statusEmail(status, order);
  if (tpl) email = await sendEmail({ to: order.email, ...tpl });

  return NextResponse.json({ order, email });
}
