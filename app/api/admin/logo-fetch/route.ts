import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// TEMPORARY, read-only. Pulls public brand logos from an allowlist of hosts
// so they can be normalized into public/clients. Removed after use.
const ALLOWED = [
  "commons.wikimedia.org",
  "upload.wikimedia.org",
  "eatsomos.com",
  "www.eatsomos.com",
  "johnnie-o.com",
  "www.johnnie-o.com",
  "cdn.shopify.com",
  "images.squarespace-cdn.com",
  "static.wixstatic.com",
];
const UA = "KINGBAGS-logo-fetch/1.0 (hello@kingbags.co)";

function allowed(u: string) {
  try {
    const host = new URL(u).hostname;
    return ALLOWED.some((h) => host === h);
  } catch {
    return false;
  }
}

export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const q = sp.get("q");
  const url = sp.get("url");

  try {
    if (q) {
      const api = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrnamespace=6&gsrlimit=8&prop=imageinfo&iiprop=url|size|mime&format=json`;
      const r = await fetch(api, { headers: { "User-Agent": UA } });
      const j = await r.json();
      const pages = Object.values((j.query?.pages ?? {}) as Record<string, { title: string; imageinfo?: { url: string; width: number; height: number; mime: string }[] }>);
      return NextResponse.json({
        q,
        results: pages.map((p) => ({ title: p.title, ...(p.imageinfo?.[0] ?? {}) })),
      });
    }
    if (url) {
      if (!allowed(url)) return NextResponse.json({ error: "host not allowed" }, { status: 400 });
      const r = await fetch(url, { headers: { "User-Agent": UA } });
      const type = r.headers.get("content-type") ?? "";
      const buf = Buffer.from(await r.arrayBuffer());
      if (buf.length > 2_500_000) return NextResponse.json({ error: "too large", size: buf.length }, { status: 413 });
      const isText = /svg|xml|html|json|text/.test(type);
      return NextResponse.json({
        url,
        status: r.status,
        type,
        size: buf.length,
        text: isText ? buf.toString("utf8") : undefined,
        base64: isText ? undefined : buf.toString("base64"),
      });
    }
    return NextResponse.json({ error: "q or url required" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
