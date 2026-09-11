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
};

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
           bleed, seams, the works. You'll get your photoreal proof by email, and nothing
           goes to production until you approve it.</p>`,
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
          "They're coming.",
          `<p>Your order has shipped. Tracking details follow separately — and when the
           boxes land, we'd love to see what you do with them.</p>`,
          order
        ),
      };
    case "submitted":
      return null;
  }
}
