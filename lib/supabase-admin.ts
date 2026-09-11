// Server-side Supabase access for the admin API routes. The service-role
// key bypasses RLS, so this module must only ever be imported from route
// handlers — never from client components.

import { createClient } from "@supabase/supabase-js";

export function serviceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    db: { schema: "kingbags" },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// Resolves the signed-in customer from a route request's Authorization
// header (Supabase access token). Returns null when absent or invalid.
export async function userFromRequest(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const token = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!url || !anon || !token) return null;
  const client = createClient(url, anon, { auth: { persistSession: false } });
  const { data, error } = await client.auth.getUser(token);
  return error ? null : data.user;
}

// Shared-secret gate for the admin endpoints. Refuses everything until
// ADMIN_SECRET is configured.
export function isAdminRequest(req: Request): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const given = req.headers.get("x-admin-key") ?? "";
  if (given.length !== secret.length) return false;
  let diff = 0;
  for (let i = 0; i < secret.length; i++) diff |= given.charCodeAt(i) ^ secret.charCodeAt(i);
  return diff === 0;
}
