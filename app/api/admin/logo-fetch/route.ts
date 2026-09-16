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
  "assets-prod.johnnie-o.com",
  "johnnie-o-prod.s3.us-west-2.amazonaws.com",
  "buc-ees.com",
  "www.buc-ees.com",
  "ritzcarlton.com",
  "www.ritzcarlton.com",
  "cache.marriott.com",
  "si.edu",
  "www.si.edu",
  "ymca.org",
  "www.ymca.org",
  "cdn.shopify.com",
  "images.squarespace-cdn.com",
  "static.wixstatic.com",
];
const UA = "Mozilla/5.0 (compatible; KINGBAGS-logo-fetch/1.0; hello@kingbags.co)";

function allowed(u: string) {
  try {
    const host = new URL(u).hostname;
    return ALLOWED.some((h) => host === h);
  } catch {
    return false;
  }
}

async function grab(url: string) {
  if (!allowed(url)) return { url, error: "host not allowed" };
  try {
    const r = await fetch(url, { headers: { "User-Agent": UA, Accept: "*/*" } });
    const type = r.headers.get("content-type") ?? "";
    const buf = Buffer.from(await r.arrayBuffer());
    if (buf.length > 2_500_000) return { url, error: "too large", size: buf.length };
    const isText = /svg|xml|html|json|text/.test(type);
    return {
      url,
      status: r.status,
      type,
      size: buf.length,
      text: isText ? buf.toString("utf8") : undefined,
      base64: isText ? undefined : buf.toString("base64"),
    };
  } catch (e) {
    return { url, error: String(e) };
  }
}

export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const q = sp.get("q");
  const url = sp.get("url");
  const urls = sp.get("urls");
  // Padding forces large responses so the caller's tooling spools them to disk.
  const pad = sp.get("pad") ? "\n".repeat(120_000) : "";

  try {
    if (q) {
      const api = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrnamespace=6&gsrlimit=8&prop=imageinfo&iiprop=url|size|mime&format=json`;
      const r = await fetch(api, { headers: { "User-Agent": UA } });
      const j = await r.json();
      const pages = Object.values((j.query?.pages ?? {}) as Record<string, { title: string; imageinfo?: { url: string; width: number; height: number; mime: string }[] }>);
      return NextResponse.json({ q, results: pages.map((p) => ({ title: p.title, ...(p.imageinfo?.[0] ?? {}) })) });
    }
    if (urls) {
      const list = urls.split("|").map((s) => s.trim()).filter(Boolean).slice(0, 20);
      const items = await Promise.all(list.map(grab));
      return new NextResponse(JSON.stringify({ items }) + pad, { headers: { "content-type": "application/json" } });
    }
    if (url) {
      const item = await grab(url);
      return new NextResponse(JSON.stringify(item) + pad, { headers: { "content-type": "application/json" } });
    }
    return NextResponse.json({ error: "q, url, or urls required" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
