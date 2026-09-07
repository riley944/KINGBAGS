import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isAdminRequest } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

// Returns a short-lived signed URL for an uploaded artwork file, so the
// ops panel can preview art from the private bucket.
export async function GET(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: "Server not configured" }, { status: 503 });
  }
  const filename = new URL(req.url).searchParams.get("file");
  if (!filename || filename.includes("/") || filename.includes("..")) {
    return NextResponse.json({ error: "Invalid file" }, { status: 400 });
  }
  const storage = createClient(url, key, { auth: { persistSession: false } });
  const { data, error } = await storage.storage
    .from("kingbags-art")
    .createSignedUrl(filename, 3600);
  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Not found" }, { status: 404 });
  }
  return NextResponse.json({ url: data.signedUrl });
}
