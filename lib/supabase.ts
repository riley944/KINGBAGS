import { createClient } from "@supabase/supabase-js";
import type { OrderStatus } from "./stages";

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

export async function saveLead(l: {
  email: string;
  company?: string;
  message?: string;
  product_slug?: string;
}) {
  if (!supabase) return { ok: false, error: "Supabase not configured" };
  const { error } = await supabase.from("leads").insert(l);
  return { ok: !error, error: error?.message };
}

export async function uploadArt(file: File): Promise<string | null> {
  if (!supabase) return null;
  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
  const { error } = await supabase.storage.from("kingbags-art").upload(filename, file);
  return error ? null : filename;
}

// ---------------------------------------------------------------------------
// Auth — passwordless magic links. The session persists in localStorage and
// supabase-js picks it up automatically when the emailed link lands back
// on the site.
// ---------------------------------------------------------------------------

export async function sendMagicLink(email: string, redirectPath: string) {
  if (!supabase) return { ok: false, error: "Supabase not configured" };
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${window.location.origin}${redirectPath}` },
  });
  return { ok: !error, error: error?.message };
}

export async function getUser() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.user ?? null;
}

export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

export type Order = {
  id: string;
  created_at: string;
  status: OrderStatus;
  product_slug: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  art_filename: string | null;
  email: string;
  phone: string | null;
  company: string;
  ship_name: string;
  ship_address1: string;
  ship_address2: string | null;
  ship_city: string;
  ship_state: string;
  ship_postal: string;
  ship_country: string;
  billing_name: string | null;
  billing_email: string | null;
  notes: string | null;
};

export type OrderEvent = {
  id: string;
  order_id: string;
  created_at: string;
  event: string;
  status: OrderStatus | null;
  note: string | null;
  actor: string;
};

export async function createOrder(o: {
  user_id: string;
  product_slug: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  art_filename?: string;
  email: string;
  phone?: string;
  company: string;
  ship_name: string;
  ship_address1: string;
  ship_address2?: string;
  ship_city: string;
  ship_state: string;
  ship_postal: string;
  billing_name?: string;
  billing_email?: string;
  notes?: string;
}) {
  if (!supabase) return { ok: false as const, error: "Supabase not configured" };
  const { error } = await supabase.from("orders").insert(o);
  return { ok: !error, error: error?.message };
}

export async function fetchOrders(): Promise<{ ok: boolean; orders: Order[]; error?: string }> {
  if (!supabase) return { ok: false, orders: [], error: "Supabase not configured" };
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return { ok: false, orders: [], error: error.message };
  return { ok: true, orders: (data ?? []) as Order[] };
}

export async function fetchOrderEvents(orderIds: string[]): Promise<OrderEvent[]> {
  if (!supabase || orderIds.length === 0) return [];
  const { data } = await supabase
    .from("order_events")
    .select("*")
    .in("order_id", orderIds)
    .order("created_at", { ascending: true });
  return (data ?? []) as OrderEvent[];
}

// ---------------------------------------------------------------------------
// Pending order hand-off: the studio stashes the locked quote here, and the
// continue-flow picks it up after sign-in. localStorage (not sessionStorage)
// because the magic link usually opens in a new tab.
// ---------------------------------------------------------------------------

const PENDING_KEY = "kb_pending_order";

export type PendingOrder = {
  product_slug: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  art_filename?: string;
  email: string;
  phone?: string;
  company?: string;
};

export function stashPendingOrder(p: PendingOrder) {
  try {
    localStorage.setItem(PENDING_KEY, JSON.stringify(p));
  } catch {
    // Storage unavailable (private mode) — the continue page handles absence.
  }
}

export function readPendingOrder(): PendingOrder | null {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as PendingOrder;
    if (!p.product_slug || !p.quantity || !p.email) return null;
    return p;
  } catch {
    return null;
  }
}

export function clearPendingOrder() {
  try {
    localStorage.removeItem(PENDING_KEY);
  } catch {
    // ignore
  }
}
