import { NextResponse } from "next/server";
import { serviceClient } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

// Supabase's free tier pauses a project after a week without traffic,
// which took the site down once. Vercel Cron hits this daily (vercel.json)
// so the database always sees a query. Also a cheap health check.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const db = serviceClient();
  if (!db) return NextResponse.json({ ok: false, error: "Server not configured" }, { status: 503 });
  const { count, error } = await db.from("orders").select("id", { count: "exact", head: true });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, orders: count, at: new Date().toISOString() });
}
