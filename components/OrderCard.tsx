"use client";
import { useRef, useState } from "react";
import { Order, OrderEvent, uploadArt, updateOrderArt } from "@/lib/supabase";
import { STAGES, stageIndex, needsAttention, statusLabel, statusBlurb, OrderStatus } from "@/lib/stages";

// Customer-facing order card: progress rail, plain-English status, revised-art
// upload when the order is kicked back, and collapsible details + history.

const BADGE: Record<OrderStatus, string> = {
  submitted: "bg-slate-100 text-slate-700",
  art_review: "bg-blue-50 text-blue-700",
  needs_changes: "bg-amber-100 text-amber-800",
  art_approved: "bg-emerald-50 text-emerald-700",
  awaiting_payment: "bg-violet-50 text-violet-700",
  in_production: "bg-ember-tint text-ember",
  shipped: "bg-ink text-white",
};

function eventLabel(e: OrderEvent): string {
  if (e.event === "order_placed") return "Order received";
  if (e.event === "artwork_updated") return "New artwork uploaded";
  if (e.status) return statusLabel(e.status as OrderStatus);
  return e.event.replace(/_/g, " ");
}

function ProgressRail({ order }: { order: Order }) {
  const idx = stageIndex(order.status);
  const attention = needsAttention(order.status);
  const done = order.status === "shipped";
  const fill = done ? 100 : (idx / (STAGES.length - 1)) * 100;
  return (
    <div>
      <div className="relative h-[3px] bg-ink/10 rounded-full mx-3.5 mb-[-14px]">
        <div
          className="absolute inset-y-0 left-0 bg-ember rounded-full transition-all duration-700"
          style={{ width: `${fill}%` }}
        />
      </div>
      <div className="relative flex justify-between">
        {STAGES.map((label, i) => {
          const isDone = i < idx || done;
          const isCurrent = i === idx && !done;
          return (
            <div key={label} className="flex flex-col items-center w-14 sm:w-20">
              <div
                className={`w-[26px] h-[26px] rounded-full flex items-center justify-center text-[12px] font-bold border-2 bg-white ${
                  isDone
                    ? "!bg-ember border-ember text-white"
                    : isCurrent
                      ? attention
                        ? "border-gold-deep text-gold-deep"
                        : "border-ember text-ember"
                      : "border-ink/15 text-ink/30"
                }`}
              >
                {isDone ? "✓" : isCurrent && attention ? "!" : i + 1}
              </div>
              <span
                className={`mt-2 text-[10px] sm:text-[12px] font-semibold text-center leading-tight ${
                  isDone || isCurrent ? "text-ink" : "text-ink/35"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function OrderCard({
  order,
  events,
  onChanged,
}: {
  order: Order;
  events: OrderEvent[];
  onChanged?: () => void;
}) {
  const attention = needsAttention(order.status);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const placed = new Date(order.created_at).toLocaleDateString(undefined, {
    month: "long", day: "numeric",
  });

  const handleRevisedArt = async (file: File) => {
    if (uploading) return;
    setUploading(true);
    setUploadError(null);
    const filename = await uploadArt(file);
    if (!filename) {
      setUploading(false);
      setUploadError("Upload failed — please try again, or email us the file.");
      return;
    }
    const res = await updateOrderArt(order.id, filename);
    setUploading(false);
    if (res.ok) {
      setUploadDone(true);
      onChanged?.();
    } else {
      setUploadError(res.error || "Couldn't attach the file to your order.");
    }
  };

  return (
    <div className="bg-white rounded-2.5xl border border-ink/10 shadow-soft overflow-hidden">
      {/* header */}
      <div className="px-6 md:px-8 pt-6 pb-5 flex flex-wrap items-start justify-between gap-x-6 gap-y-2 border-b border-ink/5">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="font-serif font-bold text-xl md:text-[22px] text-ink leading-tight">
              {order.product_name}
            </h2>
            <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold whitespace-nowrap ${BADGE[order.status]}`}>
              {statusLabel(order.status)}
            </span>
          </div>
          <p className="text-[13px] text-ink-soft mt-1.5">
            {order.quantity.toLocaleString()} bags · placed {placed}
          </p>
        </div>
        <p className="font-serif font-black text-2xl md:text-[28px] text-ink">
          ${Number(order.total_price).toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </p>
      </div>

      {/* progress */}
      <div className="px-6 md:px-8 py-6">
        <ProgressRail order={order} />
      </div>

      {/* status message / action */}
      <div className="px-6 md:px-8 pb-6">
        {attention && !uploadDone ? (
          <div className="rounded-2xl border border-gold-deep/25 bg-gold-tint px-5 py-4">
            <p className="text-[15px] text-ink leading-relaxed mb-3">
              <span className="font-bold">Action needed:</span> {statusBlurb(order.status)}
            </p>
            <input
              ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => e.target.files?.[0] && handleRevisedArt(e.target.files[0])}
            />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="btn-ember !py-2.5 !px-5 !text-[14px]"
            >
              {uploading ? "Uploading…" : "Upload revised artwork"}
            </button>
            {uploadError && <p className="text-[12px] text-red-600 mt-2.5">{uploadError}</p>}
          </div>
        ) : (
          <div className="rounded-2xl bg-smoke px-5 py-4">
            <p className="text-[15px] text-ink leading-relaxed">
              {uploadDone ? (
                <>
                  <span className="font-bold">New artwork received.</span> Our team will
                  re-review it and email you — nothing else needed from you right now.
                </>
              ) : (
                statusBlurb(order.status)
              )}
            </p>
          </div>
        )}
      </div>

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
              <p className="text-[14px] text-ink">
                {order.quantity.toLocaleString()} × ${Number(order.unit_price).toFixed(2)} per bag
              </p>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft mb-2.5">History</p>
            <ul className="space-y-2.5">
              {events.map((e) => (
                <li key={e.id} className="flex gap-2.5 text-[13px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-ember mt-[7px] shrink-0" />
                  <div>
                    <span className="text-ink font-semibold">{eventLabel(e)}</span>{" "}
                    <span className="text-ink-soft">
                      — {new Date(e.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </details>
    </div>
  );
}
