import { NextResponse } from "next/server";
import { serviceClient, isAdminRequest } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
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
  const { data: orders, error } = await db
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const ids = (orders ?? []).map((o) => o.id);
  let events: unknown[] = [];
  if (ids.length > 0) {
    const { data } = await db
      .from("order_events")
      .select("*")
      .in("order_id", ids)
      .order("created_at", { ascending: true });
    events = data ?? [];
  }
  return NextResponse.json({ orders: orders ?? [], events });
}
