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
