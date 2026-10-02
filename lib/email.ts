// Transactional email via Resend's REST API (server-side only).
// No-ops with a clear error until RESEND_API_KEY is configured.

import type { OrderStatus } from "./stages";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kingbags.co";

export async function sendEmail(opts: { to: string; subject: string; html: string }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: "RESEND_API_KEY not set" };
  const from = process.env.EMAIL_FROM || "KINGBAGS <orders@kingbags.co>";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [opts.to], subject: opts.subject, html: opts.html }),
  });
  if (!res.ok) return { ok: false, error: `Resend ${res.status}: ${await res.text()}` };
  return { ok: true };
}

// Shared shell so every email looks like the site: serif headline, green
// accent, order card, one CTA to the account dashboard.
function shell(headline: string, body: string, order: OrderLike) {
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#F3F5F2;font-family:Georgia,serif;">
  <div style="max-width:560px;margin:0 auto;padding:32px 20px;">
    <p style="font-family:Arial,sans-serif;font-weight:800;font-size:20px;letter-spacing:0.04em;margin:0 0 28px;">
      <span style="color:#10140F;">KING</span><span style="color:#14532D;">BAGS</span>
    </p>
    <div style="background:#FFFFFF;border-radius:16px;padding:36px 32px;">
      <h1 style="font-size:28px;line-height:1.15;color:#10140F;margin:0 0 16px;">${headline}</h1>
      <div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#5C635B;">${body}</div>
      <div style="background:#F3F5F2;border-radius:12px;padding:16px 20px;margin:24px 0;font-family:Arial,sans-serif;">
        <p style="margin:0;font-size:14px;color:#10140F;font-weight:bold;">${order.product_name}</p>
        <p style="margin:4px 0 0;font-size:13px;color:#5C635B;">${order.quantity.toLocaleString()} bags · $${Number(order.total_price).toLocaleString()}</p>
      </div>
      <a href="${SITE_URL}/account" style="display:inline-block;background:#14532D;color:#FFFFFF;font-family:Arial,sans-serif;font-weight:bold;font-size:15px;padding:14px 28px;border-radius:999px;text-decoration:none;">Track your order</a>
    </div>
    <p style="font-family:Arial,sans-serif;font-size:12px;color:#5C635B;text-align:center;margin:24px 0 0;">
      KINGBAGS · A King Universal Inc. Company · Raleigh, NC<br/>
      Questions? Just reply to this email.
    </p>
  </div>
</body></html>`;
}

type OrderLike = {
  product_name: string;
  quantity: number;
  total_price: number | string;
  id?: string;
  email?: string;
  company?: string;
  phone?: string | null;
  review_status?: string;
  payment_status?: string;
  tracking_carrier?: string | null;
  tracking_url?: string | null;
};

// Booking nudge for orders that don't have a proof review on the calendar.
function reviewNudge(order: OrderLike): string {
  if (!order.review_status || order.review_status === "booked" || order.review_status === "done") return "";
  const url = `${SITE_URL}/talk?order=${order.id ?? ""}&email=${encodeURIComponent(order.email ?? "")}&name=${encodeURIComponent(order.company ?? "")}&q=${encodeURIComponent(`${order.product_name} · ${order.quantity.toLocaleString()} bags`)}`;
  return `<p style="margin:16px 0 0;padding:14px 16px;background:#E9F2EC;border-radius:12px;"><b>Your order isn't final yet.</b>
    Book your fifteen-minute proof review and approve it live:
    <a href="${url}" style="color:#14532D;font-weight:bold;">pick a time</a>.</p>`;
}

// Sent the moment a quote is locked in the studio. The ask is one thing:
// book the proof review.
export function quoteLockedEmail(q: OrderLike & { quoteMode?: boolean; bookUrl: string }): { subject: string; html: string } {
  const body = `<p>${q.quoteMode
    ? "Your design is in and a specialist is pricing it now."
    : "Your price is locked and your proof is being built."}
    Your order isn't final until a fifteen-minute proof review with a specialist. Two steps, both quick:</p>
    <ol style="padding-left:20px;margin:12px 0;">
      <li style="margin-bottom:6px;"><b>Reserve your production slot.</b> Shipping details and a payment method on file. Nothing is charged until you approve your proof.</li>
      <li><b>Book your proof review.</b> Proof on screen, sizes and colors confirmed, approved live.</li>
    </ol>
    <p style="margin:20px 0 0;"><a href="${SITE_URL}/order/continue" style="display:inline-block;background:#14532D;color:#FFFFFF;font-family:Arial,sans-serif;font-weight:bold;font-size:15px;padding:14px 28px;border-radius:999px;text-decoration:none;">Reserve my slot</a>
    &nbsp; <a href="${q.bookUrl}" style="display:inline-block;color:#14532D;font-family:Arial,sans-serif;font-weight:bold;font-size:15px;padding:14px 8px;text-decoration:underline;">Book the review first</a></p>`;
  return {
    subject: q.quoteMode ? "Your quote request is in. Reserve your slot." : "Your quote is locked. Reserve your slot.",
    html: shell("Two steps to a final order.", body, q),
  };
}

// Internal heads-up so a new quote never sits unseen.
export function newQuoteAlertEmail(q: OrderLike & { email: string; company?: string; phone?: string; quoteMode?: boolean }): { subject: string; html: string } {
  return {
    subject: `New ${q.quoteMode ? "quote request" : "locked quote"}: ${q.company || q.email} · ${q.quantity.toLocaleString()} bags`,
    html: `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#10140F;">
      <p><b>${q.company || "No company"}</b> · ${q.email}${q.phone ? ` · ${q.phone}` : ""}</p>
      <p>${q.product_name}<br/>${q.quantity.toLocaleString()} bags · $${Number(q.total_price).toLocaleString()}${q.quoteMode ? " (custom quote)" : ""}</p>
      <p><a href="${SITE_URL}/admin">Open the ops panel</a></p>
    </div>`,
  };
}

// Sent right after the order row is created (card may or may not be on
// file yet). One job: get the review on the calendar.
export function orderReservedEmail(order: OrderLike): { subject: string; html: string } {
  const card = order.payment_status === "method_saved";
  return {
    subject: card ? "Reserved. Book your proof review." : "Order saved. Two steps to make it final.",
    html: shell(
      card ? "Your slot is reserved." : "Your order is saved.",
      `<p>${card
        ? "Your payment method is on file and nothing is charged until you approve your proof."
        : `A payment method on file holds your production slot; <a href="${SITE_URL}/order/payment?order=${order.id ?? ""}" style="color:#14532D;font-weight:bold;">add one here</a>. Nothing is charged until you approve your proof.`}
       Your order becomes final on a fifteen-minute proof review with a specialist.</p>${reviewNudge(order)}`,
      order
    ),
  };
}

// Internal alert so a new order never sits unseen.
export function newOrderAlertEmail(order: OrderLike): { subject: string; html: string } {
  return {
    subject: `New order: ${order.company || order.email} · ${order.quantity.toLocaleString()} bags · $${Number(order.total_price).toLocaleString()}`,
    html: `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#10140F;">
      <p><b>${order.company || "No company"}</b> · ${order.email}${order.phone ? ` · ${order.phone}` : ""}</p>
      <p>${order.product_name}<br/>${order.quantity.toLocaleString()} bags · $${Number(order.total_price).toLocaleString()}</p>
      <p>Card: ${order.payment_status === "method_saved" ? "on file" : "not yet"} · Review: ${order.review_status ?? "needed"}</p>
      <p><a href="${SITE_URL}/admin?order=${order.id ?? ""}">Open in the ops panel</a></p>
    </div>`,
  };
}

// Sent when the team uploads the photoreal proof.
export function proofReadyEmail(order: OrderLike): { subject: string; html: string } {
  const booked = order.review_status === "booked" || order.review_status === "done";
  return {
    subject: "Your proof is ready",
    html: shell(
      "Your proof is ready.",
      `<p>Your photoreal proof is in your account. ${booked
        ? "We'll walk through it together on your review call and you approve it live."
        : "Book your fifteen-minute review and we'll walk through it together; you approve it live on the call."}
       Nothing is made or charged until you approve.</p>${reviewNudge(order)}`,
      order
    ),
  };
}

// Sent when the saved payment method is charged after proof approval.
export function paymentCapturedEmail(order: OrderLike): { subject: string; html: string } {
  return {
    subject: "Payment received — your bags are going into production",
    html: shell(
      "Paid, and moving.",
      `<p>Your payment went through and your order is headed to the factory floor.
       A receipt from Stripe is on its way separately. Next stop: cutting, printing,
       and sewing — we'll email tracking the moment your bags ship.</p>`,
      order
    ),
  };
}

// One email per customer-meaningful status change. Returns null for
// statuses that shouldn't email (e.g. 'submitted' — the customer was
// looking at the confirmation screen seconds ago).
export function statusEmail(status: OrderStatus, order: OrderLike): { subject: string; html: string } | null {
  switch (status) {
    case "art_review":
      return {
        subject: "Your artwork is in review",
        html: shell(
          "Your artwork is in review.",
          `<p>Our team is checking your art against the production template — print resolution,
           bleed, seams, the works. Your photoreal proof goes on screen at your review call, and nothing
           goes to production until you approve it.</p>${reviewNudge(order)}`,
          order
        ),
      };
    case "needs_changes":
      return {
        subject: "Your artwork needs one change",
        html: shell(
          "One change before it can print.",
          `<p>Something in your artwork won't print the way you'd want it to. The specifics
           are in your account — fix it or reply to this email and our team will help you
           sort it out. Your order is on hold until then, nothing is lost.</p>`,
          order
        ),
      };
    case "art_approved":
      return {
        subject: "Proof approved — your order is moving",
        html: shell(
          "Approved. Now it gets real.",
          `<p>Your proof is locked. Next step is payment — details are in your account —
           and the moment it clears, your order goes to the factory floor.</p>`,
          order
        ),
      };
    case "awaiting_payment":
      return {
        subject: "Payment is the last step",
        html: shell(
          "One step from production.",
          `<p>Your approved order is ready for the factory — payment is the only thing
           in front of it. Head to your account to finish up.</p>`,
          order
        ),
      };
    case "in_production":
      return {
        subject: "Your bags are in production",
        html: shell(
          "Cutting and sewing has started.",
          `<p>Your order is on the factory floor being cut, printed, and sewn. We'll email
           you tracking the moment your bags ship.</p>`,
          order
        ),
      };
    case "shipped":
      return {
        subject: "Your bags are on the way",
        html: shell(
          "Shipped.",
          `<p>Your bags left the factory and are in the air. ${order.tracking_url
            ? `Track them here: <a href="${order.tracking_url}" style="color:#14532D;font-weight:bold;">${order.tracking_carrier ?? "Tracking"} →</a>`
            : "Tracking details follow shortly."}
           Most deliveries clear customs and land within 7–10 days of shipping.</p>`,
          order
        ),
      };
    case "submitted":
      return null;
  }
}
