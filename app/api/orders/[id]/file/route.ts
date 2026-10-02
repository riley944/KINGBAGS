import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { serviceClient, userFromRequest } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

// Signed URL for the signed-in customer's own artwork or proof file.
export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await userFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = serviceClient();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!db || !url || !key) return NextResponse.json({ error: "Server not configured" }, { status: 503 });

  const { id } = await ctx.params;
  const kind = new URL(req.url).searchParams.get("kind") === "proof" ? "proof" : "art";
  const { data: order } = await db.from("orders").select("user_id, art_filename, proof_filename").eq("id", id).single();
  if (!order || order.user_id !== user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const file = kind === "proof" ? order.proof_filename : order.art_filename;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 404 });

  const storage = createClient(url, key, { auth: { persistSession: false } });
  const { data, error } = await storage.storage.from("kingbags-art").createSignedUrl(file, 3600);
  if (error || !data) return NextResponse.json({ error: error?.message ?? "Not found" }, { status: 404 });
  return NextResponse.json({ url: data.signedUrl });
}
