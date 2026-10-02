import { NextResponse } from "next/server";
import { serviceClient, isAdminRequest } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

const VALID = ["new", "contacted", "won", "lost"] as const;

// Quote pipeline: mark a quote contacted / won / lost.
export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = serviceClient();
  if (!db) return NextResponse.json({ error: "Server not configured" }, { status: 503 });
  const { id } = await ctx.params;
  let status: (typeof VALID)[number];
  try {
    status = (await req.json()).status;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!VALID.includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  const { data, error } = await db.from("quotes").update({ status }).eq("id", id).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ quote: data });
}
