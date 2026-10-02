import { NextResponse } from "next/server";
import { serviceClient, userFromRequest } from "@/lib/supabase-admin";
import { sendEmail, orderReservedEmail, newOrderAlertEmail } from "@/lib/email";
import { CONTACT_EMAIL } from "@/lib/site";

export const dynamic = "force-dynamic";

// Called by the client right after an order row is created. Emails the
// customer a "reserved" confirmation and the team a new-order alert.
export async function POST(req: Request) {
  const user = await userFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = serviceClient();
  if (!db) return NextResponse.json({ error: "Server not configured" }, { status: 503 });
  let orderId: string;
  try {
    orderId = (await req.json()).order_id;
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const { data: order } = await db.from("orders").select("*").eq("id", orderId).single();
  if (!order || order.user_id !== user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const [customer, internal] = await Promise.all([
    sendEmail({ to: order.email, ...orderReservedEmail(order) }),
    sendEmail({ to: CONTACT_EMAIL, ...newOrderAlertEmail(order) }),
  ]);
  return NextResponse.json({ ok: customer.ok, internal: internal.ok });
}
