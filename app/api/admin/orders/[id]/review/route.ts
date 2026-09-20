import { NextResponse } from "next/server";
import { serviceClient, isAdminRequest } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

const VALID = ["needed", "requested", "booked", "done"] as const;
type ReviewStatus = (typeof VALID)[number];

// Ops panel: set an order's proof-review state (booked when a call is on
// the calendar, done once the review happened).
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = serviceClient();
  if (!db) return NextResponse.json({ error: "Server not configured" }, { status: 503 });

  const { id } = await ctx.params;
  let review_status: ReviewStatus;
  try {
    review_status = (await req.json()).review_status;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!VALID.includes(review_status)) {
    return NextResponse.json({ error: `Invalid review status: ${review_status}` }, { status: 400 });
  }
  const patch: { review_status: ReviewStatus; review_booked_at?: string } = { review_status };
  if (review_status === "booked") patch.review_booked_at = new Date().toISOString();

  const { data: order, error } = await db.from("orders").update(patch).eq("id", id).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await db.from("order_events").insert({ order_id: id, event: `review_${review_status}`, note: `Proof review: ${review_status}`, actor: "team" }).then(() => null, () => null);
  return NextResponse.json({ order });
}
