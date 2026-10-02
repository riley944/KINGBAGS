import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { serviceClient, isAdminRequest } from "@/lib/supabase-admin";
import { sendEmail, proofReadyEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

// Upload (or replace) the photoreal proof for an order. Stored in the
// private art bucket under proofs/, recorded on the order, logged on the
// timeline, and the customer is told it's ready for their review call.
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = serviceClient();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!db || !url || !key) return NextResponse.json({ error: "Server not configured" }, { status: 503 });

  const { id } = await ctx.params;
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  const notify = form?.get("notify") === "1";
  if (!(file instanceof File) || file.size === 0) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (file.size > 25 * 1024 * 1024) return NextResponse.json({ error: "File over 25 MB" }, { status: 413 });
  if (!/^(image\/|application\/pdf)/.test(file.type)) return NextResponse.json({ error: "Image or PDF only" }, { status: 400 });

  const { data: order } = await db.from("orders").select("*").eq("id", id).single();
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const ext = (file.name.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `proofs/${id}-${Date.now()}.${ext}`;
  const storage = createClient(url, key, { auth: { persistSession: false } });
  const { error: upErr } = await storage.storage.from("kingbags-art").upload(path, file, { contentType: file.type, upsert: false });
  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });

  const { data: updated, error } = await db
    .from("orders")
    .update({ proof_filename: path, proof_uploaded_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  await db.from("order_events").insert({ order_id: id, event: "proof_uploaded", note: file.name, actor: "team" }).then(() => null, () => null);

  let email: { ok: boolean; error?: string } | null = null;
  if (notify) email = await sendEmail({ to: order.email, ...proofReadyEmail(updated) });
  return NextResponse.json({ order: updated, email });
}
