import { NextResponse } from "next/server";
import { serviceClient } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

// Public read of one quote by its UUID. Used by the reserve link the team
// sends after a call (/order/continue?quote=<id>). The id is unguessable
// and the response carries only what the order form needs.
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const db = serviceClient();
  if (!db) return NextResponse.json({ error: "Server not configured" }, { status: 503 });
  const { id } = await ctx.params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const { data } = await db
    .from("quotes")
    .select("id, email, company, product_slug, product_name, quantity, unit_price, total_price, art_filename, notes, status")
    .eq("id", id)
    .single();
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const phone = /phone:\s*([^|]+)/.exec(data.notes ?? "")?.[1]?.trim();
  return NextResponse.json({
    quote: {
      id: data.id, email: data.email, company: data.company, phone: phone || null,
      product_slug: data.product_slug, product_name: data.product_name, quantity: data.quantity,
      unit_price: Number(data.unit_price), total_price: Number(data.total_price),
      art_filename: data.art_filename, reviewed: data.status === "won",
    },
  });
}
