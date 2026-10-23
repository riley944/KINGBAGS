import { NextResponse } from "next/server";
import { serviceClient, isAdminRequest } from "@/lib/supabase-admin";
import { sendEmail, reserveLinkEmail } from "@/lib/email";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

// After the call: mark the quote won and email the customer their reserve
// link. The link seeds /order/continue from the quote, and because the
// quote is "won" the order it creates is treated as already reviewed.
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = serviceClient();
  if (!db) return NextResponse.json({ error: "Server not configured" }, { status: 503 });
  const { id } = await ctx.params;
  const { data: quote, error } = await db.from("quotes").update({ status: "won" }).eq("id", id).select("*").single();
  if (error || !quote) return NextResponse.json({ error: error?.message || "Quote not found" }, { status: 404 });
  const url = `${SITE_URL}/order/continue?quote=${quote.id}`;
  const mail = await sendEmail({ to: quote.email, ...reserveLinkEmail({ ...quote, reserveUrl: url }) });
  return NextResponse.json({ ok: mail.ok, error: mail.error, url });
}
