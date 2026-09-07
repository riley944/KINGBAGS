import { NextResponse } from "next/server";
import { serviceClient, isAdminRequest } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

// One payload for the whole ops panel: orders + their events, plus the
// quotes and sample-kit leads pipelines.
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

  const [ordersRes, quotesRes, leadsRes] = await Promise.all([
    db.from("orders").select("*").order("created_at", { ascending: false }).limit(200),
    db.from("quotes").select("*").order("created_at", { ascending: false }).limit(200),
    db.from("leads").select("*").order("created_at", { ascending: false }).limit(200),
  ]);
  if (ordersRes.error) return NextResponse.json({ error: ordersRes.error.message }, { status: 500 });

  const ids = (ordersRes.data ?? []).map((o) => o.id);
  let events: unknown[] = [];
  if (ids.length > 0) {
    const { data } = await db
      .from("order_events")
      .select("*")
      .in("order_id", ids)
      .order("created_at", { ascending: true });
    events = data ?? [];
  }

  return NextResponse.json({
    orders: ordersRes.data ?? [],
    events,
    quotes: quotesRes.data ?? [],
    leads: leadsRes.data ?? [],
  });
}
