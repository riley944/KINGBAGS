import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Browser-side failures land here so they show up in the server logs.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const where = String(body.where ?? "unknown").slice(0, 80);
    const message = String(body.message ?? "").slice(0, 1000);
    const extra = JSON.stringify(body.extra ?? {}).slice(0, 2000);
    const ua = req.headers.get("user-agent") ?? "";
    console.error(`[client-error] ${where}: ${message} | ${extra} | ${ua}`);
  } catch {
    /* ignore */
  }
  return NextResponse.json({ ok: true });
}
