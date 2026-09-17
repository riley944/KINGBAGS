import { NextResponse } from "next/server";
import { sendEmail, quoteLockedEmail, newQuoteAlertEmail } from "@/lib/email";
import { CONTACT_EMAIL, SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

// Called by the studio right after a quote is saved. Sends the customer the
// "book your proof review" email and an internal alert. Best effort: the
// quote is already stored, so failures here never block the customer.
export async function POST(req: Request) {
  let body: {
    email?: string;
    company?: string;
    phone?: string;
    product_name?: string;
    quantity?: number;
    total_price?: number;
    quote_mode?: boolean;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const { email, company, phone, product_name, quantity, total_price, quote_mode } = body;
  if (!email || !product_name || !quantity || typeof total_price !== "number") {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Bad email" }, { status: 400 });
  }

  const q = { product_name, quantity, total_price, quoteMode: !!quote_mode };
  const bookUrl = `${SITE_URL}/talk?email=${encodeURIComponent(email)}${company ? `&name=${encodeURIComponent(company)}` : ""}&q=${encodeURIComponent(`${product_name} · ${quantity.toLocaleString()} bags`)}`;

  const [customer, internal] = await Promise.all([
    sendEmail({ to: email, ...quoteLockedEmail({ ...q, bookUrl }) }),
    sendEmail({ to: CONTACT_EMAIL, ...newQuoteAlertEmail({ ...q, email, company, phone }) }),
  ]);
  return NextResponse.json({ ok: customer.ok, internal: internal.ok });
}
