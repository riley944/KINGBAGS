import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = url && anonKey
  ? createClient(url, anonKey, { db: { schema: "kingbags" } })
  : null;

export async function saveQuote(q: {
  email: string;
  company?: string;
  product_slug: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  art_filename?: string;
  notes?: string;
}) {
  if (!supabase) return { ok: false, error: "Supabase not configured" };
  const { error } = await supabase.from("quotes").insert(q);
  return { ok: !error, error: error?.message };
}

export async function uploadArt(file: File): Promise<string | null> {
  if (!supabase) return null;
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
  const { error } = await supabase.storage.from("kingbags-art").upload(filename, file);
  return error ? null : filename;
}
