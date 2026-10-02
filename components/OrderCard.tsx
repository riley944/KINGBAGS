"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Order, OrderEvent, uploadArt, updateOrderArt, orderFileUrl } from "@/lib/supabase";
import { STAGES, stageIndex, statusLabel, OrderStatus } from "@/lib/stages";
import { CONTACT_EMAIL } from "@/lib/site";

// Customer-facing order card. One big "what happens next" box, a progress
// rail, a three-item checklist (card · review · proof), the proof itself
// once it exists, and details/history tucked away.

const BADGE: Record<OrderStatus, string> = {
  submitted: "bg-slate-100 text-slate-700",
  art_review: "bg-blue-50 text-blue-700",
  needs_changes: "bg-amber-100 text-amber-800",
  art_approved: "bg-emerald-50 text-emerald-700",
  awaiting_payment: "bg-violet-50 text-violet-700",
  in_production: "bg-ember-tint text-ember",
  shipped: "bg-ink text-white",
};

const longDate = (s: string) => new Date(s).toLocaleDateString(undefined, { month: "long", day: "numeric" });
const dateTime = (s: string) => new Date(s).toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
const money = (n: number | string) => "$" + Number(n).toLocaleString(undefined, { maximumFractionDigits: 0 });

function eventLabel(e: OrderEvent): string {
  switch (e.event) {
    case "order_placed": return "Order received";
    case "artwork_updated": return "New artwork uploaded";
    case "payment_method_saved": return "Payment method added · slot reserved";
    case "payment_captured": return "Payment received";
    case "payment_failed": return "Payment didn't go through";
    case "payment_needs_action": return "Bank needs you to confirm the payment";
    case "proof_uploaded": return "Proof ready";
    case "review_booked": return "Proof review booked";
    case "review_requested": return "Proof review requested";
    case "review_done": return "Proof review held";
    case "review_needed": return "Proof review to be rebooked";
    case "tracking_sent": return "Tracking sent";
  }
  if (e.status) return statusLabel(e.status as OrderStatus);
  return e.event.replace(/_/g, " ");
}

// Whose move it is and what they should do. Mirrors the ops-side nextAction
// but written for the buyer.
type Step = {
  tone: "ember" | "gold" | "ink" | "smoke";
  title: string;
  body: string;
  cta?: { label: string; href: string; external?: boolean };
  upload?: boolean;
};
function customerStep(o: Order): Step {
  const hasCard = o.payment_status === "method_saved" || o.payment_status === "charged";
  const talk = `/talk?order=${o.id}&email=${encodeURIComponent(o.email)}&name=${encodeURIComponent(o.company)}&q=${encodeURIComponent(`${o.product_name} · ${o.quantity.toLocaleString()} bags`)}`;
  if (o.status === "shipped") {
    return o.tracking_url
      ? { tone: "ink", title: "Your bags are on the way.", body: `Shipped${o.tracking_carrier ? ` via ${o.tracking_carrier}` : ""}. Follow the package with the link below.`, cta: { label: "Track shipment ↗", href: o.tracking_url, external: true } }
      : { tone: "ink", title: "Your bags are on the way.", body: "Shipped. Tracking details are in your email." };
  }
  if (o.status === "in_production") return { tone: "ink", title: "In production.", body: "Your bags are being cut and sewn. We'll email tracking the moment they ship." };
  if (o.status === "needs_changes") return { tone: "gold", title: "We need a new artwork file.", body: "Something in your art won't print cleanly. Check your email for exactly what to change, then upload the new file here.", upload: true };
  if (o.payment_status === "failed") return { tone: "gold", title: "Your payment didn't go through.", body: "Your bank declined the charge. Add a different card or bank account and we'll re-run it the same day.", cta: { label: "Update payment method", href: `/order/payment?order=${o.id}` } };
  if (!hasCard) return { tone: "gold", title: "Add a payment method to reserve your slot.", body: "Your order isn't holding a production slot yet. Nothing is charged until you approve your proof on the call.", cta: { label: "Add payment method", href: `/order/payment?order=${o.id}` } };
  if (o.review_status === "needed") return { tone: "ember", title: "Book your proof review.", body: "This order isn't final until we walk through your proof together. Fifteen minutes, on video or phone, your pick of time.", cta: { label: "Book Your Proof Review", href: talk } };
  if (o.review_status === "requested") return { tone: "smoke", title: "We're confirming your review time.", body: "You asked for a time by email. Expect a confirmation within one business day, or grab a slot on the calendar now.", cta: { label: "Pick a time instead", href: talk } };
  if (o.review_status === "booked") {
    const when = o.review_booked_at ? ` for ${dateTime(o.review_booked_at)}` : "";
    return o.proof_filename
      ? { tone: "ember", title: "Your proof is ready.", body: `Take a look below before your review call${when}. You approve it on the call, and only then does your card get charged.` }
      : { tone: "smoke", title: `Proof review booked${when}.`, body: "We're building your photoreal proof now. It'll be here, and in your inbox, before the call." };
  }
  // review done
  if (o.payment_status !== "charged") return { tone: "ember", title: "Approved on your call.", body: "We're charging the payment method on file today and moving your order into production. You'll get a receipt by email." };
  return { tone: "ink", title: "Paid. Heading to production.", body: `Charged${o.paid_at ? ` on ${longDate(o.paid_at)}` : ""}. We'll email tracking when your bags ship.` };
}

const STEP_STYLE: Record<Step["tone"], string> = {
  ember: "bg-ember text-white",
  gold: "bg-gold-tint border border-gold-deep/25 text-ink",
  ink: "bg-ink text-white",
  smoke: "bg-smoke text-ink",
};

function ProgressRail({ order }: { order: Order }) {
  const idx = stageIndex(order.status);
  const attention = order.status === "needs_changes";
  const done = order.status === "shipped";
  const fill = done ? 100 : (idx / (STAGES.length - 1)) * 100;
  return (
    <div>
      <div className="relative h-[3px] bg-ink/10 rounded-full mx-3.5 mb-[-14px]">
        <div className="absolute inset-y-0 left-0 bg-ember rounded-full transition-all duration-700" style={{ width: `${fill}%` }} />
      </div>
      <div className="relative flex justify-between">
        {STAGES.map((label, i) => {
          const isDone = i < idx || done;
          const isCurrent = i === idx && !done;
          return (
            <div key={label} className="flex flex-col items-center w-14 sm:w-20">
              <div className={`w-[26px] h-[26px] rounded-full flex items-center justify-center text-[12px] font-bold border-2 bg-white ${isDone ? "!bg-ember border-ember text-white" : isCurrent ? (attention ? "border-gold-deep text-gold-deep" : "border-ember text-ember") : "border-ink/15 text-ink/30"}`}>
                {isDone ? "✓" : isCurrent && attention ? "!" : i + 1}
              </div>
              <span className={`mt-2 text-[10px] sm:text-[12px] font-semibold text-center leading-tight ${isDone || isCurrent ? "text-ink" : "text-ink/35"}`}>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Check({ on, label, sub }: { on: boolean; label: string; sub: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${on ? "bg-ember text-white" : "border border-ink/20 text-ink/30"}`}>{on ? "✓" : ""}</span>
      <div className="min-w-0">
        <p className={`text-[13px] font-semibold leading-tight ${on ? "text-ink" : "text-ink-soft"}`}>{label}</p>
        <p className="text-[12px] text-ink-soft leading-snug mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

function FileThumb({ orderId, kind, file, label }: { orderId: string; kind: "art" | "proof"; file: string | null; label: string }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    setUrl(null);
    if (!file) return;
    orderFileUrl(orderId, kind).then(setUrl);
  }, [orderId, kind, file]);
  if (!file) return null;
  const isPdf = file.toLowerCase().endsWith(".pdf");
  return (
    <a href={url ?? "#"} target="_blank" rel="noreferrer" className="block group">
      <div className="aspect-video rounded-xl bg-smoke overflow-hidden border border-ink/10 flex items-center justify-center">
        {url && !isPdf ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt={label} className="w-full h-full object-contain" />
        ) : (
          <span className="text-[12px] text-ink-soft">{isPdf ? "PDF" : "Loading…"}</span>
        )}
      </div>
      <p className="text-[12px] font-semibold text-ink mt-2">{label} <span className="text-ember group-hover:underline">· open ↗</span></p>
    </a>
  );
}

export default function OrderCard({ order, events, onChanged }: { order: Order; events: OrderEvent[]; onChanged?: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const hasCard = order.payment_status === "method_saved" || order.payment_status === "charged";
  const closed = order.status === "in_production" || order.status === "shipped";
  const step = uploadDone
    ? { tone: "smoke", title: "New artwork received.", body: "Our team will re-check it and email you. Nothing else needed from you right now." } satisfies Step
    : customerStep(order);
  const light = step.tone === "ember" || step.tone === "ink";

  const handleRevisedArt = async (file: File) => {
    if (uploading) return;
    setUploading(true);
    setUploadError(null);
    const filename = await uploadArt(file);
    if (!filename) { setUploading(false); setUploadError("Upload failed. Try again, or email us the file."); return; }
    const res = await updateOrderArt(order.id, filename);
    setUploading(false);
    if (res.ok) { setUploadDone(true); onChanged?.(); } else setUploadError(res.error || "Couldn't attach the file to your order.");
  };

  return (
    <article className="bg-white rounded-2.5xl border border-ink/10 shadow-soft overflow-hidden">
      {/* header */}
      <div className="px-6 md:px-8 pt-6 pb-5 flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
        <div className="min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="font-serif font-bold text-xl md:text-[22px] text-ink leading-tight">{order.product_name.split(" — ")[0]}</h2>
            <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold whitespace-nowrap ${BADGE[order.status]}`}>{statusLabel(order.status)}</span>
          </div>
          <p className="text-[13px] text-ink-soft mt-1.5">
            {order.quantity.toLocaleString()} bags · ${Number(order.unit_price).toFixed(2)} each · placed {longDate(order.created_at)}
          </p>
        </div>
        <div className="text-right">
          <p className="font-serif font-black text-2xl md:text-[28px] text-ink leading-none">{money(order.total_price)}</p>
          <p className="text-[11px] text-ink-soft mt-1">all-in, delivered</p>
        </div>
      </div>

      {/* next step */}
      <div className="px-6 md:px-8 pb-6">
        <div className={`rounded-2xl px-5 py-5 md:px-6 ${STEP_STYLE[step.tone]}`}>
          <p className={`text-[11px] font-bold uppercase tracking-[0.14em] mb-1.5 ${light ? "text-white/70" : "text-ink-soft"}`}>
            {step.tone === "ink" ? "Status" : step.tone === "smoke" ? "Our move" : "Your next step"}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-x-6 gap-y-4">
            <div className="min-w-0 sm:flex-1">
              <p className="font-serif font-bold text-[20px] leading-tight">{step.title}</p>
              <p className={`text-[14px] leading-relaxed mt-1.5 ${light ? "text-white/85" : "text-ink-soft"}`}>{step.body}</p>
            </div>
            {step.cta && (step.cta.external ? (
              <a href={step.cta.href} target="_blank" rel="noreferrer" className={`sm:shrink-0 ${light ? "btn-light" : "btn-ember"} !py-3 !px-6 !text-[14px]`}>{step.cta.label}</a>
            ) : (
              <Link href={step.cta.href} className={`sm:shrink-0 ${light ? "btn-light" : "btn-ember"} !py-3 !px-6 !text-[14px]`}>{step.cta.label}</Link>
            ))}
            {step.upload && (
              <div className="sm:shrink-0 flex">
                <input ref={fileRef} type="file" accept="image/*,.pdf,.ai,.eps,.svg" className="hidden" onChange={(e) => e.target.files?.[0] && handleRevisedArt(e.target.files[0])} />
                <button onClick={() => fileRef.current?.click()} disabled={uploading} className="btn-ember !py-3 !px-6 !text-[14px] w-full sm:w-auto">{uploading ? "Uploading…" : "Upload new artwork"}</button>
              </div>
            )}
          </div>
          {uploadError && <p className="text-[12px] text-red-600 mt-3">{uploadError}</p>}
        </div>
      </div>

      {/* progress */}
      <div className="px-6 md:px-8 pb-6">
        <ProgressRail order={order} />
      </div>

      {/* checklist */}
      {!closed && (
        <div className="px-6 md:px-8 pb-6 grid sm:grid-cols-3 gap-4 border-t border-ink/5 pt-5">
          <Check on={hasCard} label={hasCard ? "Slot reserved" : "Payment method"} sub={hasCard ? "Card on file. Charged only after you approve." : "Add one to hold your production slot."} />
          <Check on={order.review_status === "booked" || order.review_status === "done"} label={order.review_status === "done" ? "Proof review held" : order.review_status === "booked" ? "Proof review booked" : "Proof review"} sub={order.review_status === "done" ? "Approved on the call." : order.review_status === "booked" && order.review_booked_at ? dateTime(order.review_booked_at) : order.review_status === "requested" ? "Time requested by email." : "Fifteen minutes. Required before anything prints."} />
          <Check on={Boolean(order.proof_filename)} label={order.proof_filename ? "Proof ready" : "Proof"} sub={order.proof_filename && order.proof_uploaded_at ? `Posted ${longDate(order.proof_uploaded_at)}.` : "Photoreal, built from your file before the call."} />
        </div>
      )}

      {/* files */}
      {(order.proof_filename || order.art_filename) && (
        <div className="px-6 md:px-8 pb-6 grid grid-cols-2 gap-4 border-t border-ink/5 pt-5">
          <FileThumb orderId={order.id} kind="proof" file={order.proof_filename} label="Your proof" />
          <FileThumb orderId={order.id} kind="art" file={order.art_filename} label="Your artwork" />
        </div>
      )}

      {/* details + history */}
      <details className="group border-t border-ink/5">
        <summary className="px-6 md:px-8 py-3.5 text-[13px] font-semibold text-ink-soft hover:text-ink cursor-pointer list-none flex items-center justify-between">
          Order details &amp; history
          <span className="transition-transform group-open:rotate-180 text-[11px]">▼</span>
        </summary>
        <div className="px-6 md:px-8 pb-6 grid sm:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft mb-1.5">Ships to</p>
              <p className="text-[14px] text-ink leading-relaxed">
                {order.ship_name}<br />
                {order.ship_address1}{order.ship_address2 ? <><br />{order.ship_address2}</> : null}<br />
                {order.ship_city}, {order.ship_state} {order.ship_postal}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft mb-1.5">Pricing</p>
              <p className="text-[14px] text-ink">{order.quantity.toLocaleString()} × ${Number(order.unit_price).toFixed(2)} per bag · {money(order.total_price)} all-in</p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft mb-1.5">Payment</p>
              <p className="text-[14px] text-ink">
                {order.payment_status === "charged" ? `Paid${order.paid_at ? ` on ${longDate(order.paid_at)}` : ""}. Receipt in your email.`
                  : order.payment_status === "method_saved" ? "Payment method on file. Charged only after you approve your proof."
                  : order.payment_status === "failed" ? "Last charge was declined."
                  : "No payment method on file yet."}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft mb-1.5">Order</p>
              <p className="text-[12px] text-ink-soft font-mono">{order.id}</p>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft mb-2.5">History</p>
            {events.length === 0 ? <p className="text-[13px] text-ink-soft">Order received {longDate(order.created_at)}.</p> : (
              <ul className="space-y-2.5">
                {[...events].reverse().map((e) => (
                  <li key={e.id} className="flex gap-2.5 text-[13px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-ember mt-[7px] shrink-0" />
                    <div>
                      <span className="text-ink font-semibold">{eventLabel(e)}</span>{" "}
                      <span className="text-ink-soft">· {new Date(e.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <p className="text-[12px] text-ink-soft mt-4">
              Need to change something? <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Order ${order.id.slice(0, 8)} · ${order.company}`)}`} className="text-ember font-semibold hover:underline">Email us</a> and quote this order.
            </p>
          </div>
        </div>
      </details>
    </article>
  );
}
