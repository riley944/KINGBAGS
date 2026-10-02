"use client";
import type { Order } from "@/lib/supabase";
import { statusLabel, type OrderStatus } from "@/lib/stages";

// Shared bits for the ops panel: formatting, badges, and the one function
// that decides what the next action on an order is.

export type Quote = {
  id: string; created_at: string; email: string; company: string | null;
  product_slug: string; product_name: string; quantity: number;
  unit_price: number; total_price: number; art_filename: string | null; notes: string | null;
  status: "new" | "contacted" | "won" | "lost";
};
export type Lead = {
  id: string; created_at: string; email: string; company: string | null;
  message: string | null; product_slug: string | null;
};

export const FLOW: OrderStatus[] = [
  "submitted", "art_review", "needs_changes", "art_approved",
  "awaiting_payment", "in_production", "shipped",
];

export function nextStatuses(s: OrderStatus): OrderStatus[] {
  switch (s) {
    case "submitted": return ["art_review"];
    case "art_review": return ["art_approved", "needs_changes"];
    case "needs_changes": return ["art_review"];
    case "art_approved": return ["awaiting_payment"];
    case "awaiting_payment": return ["in_production"];
    case "in_production": return ["shipped"];
    case "shipped": return [];
  }
}

export const BADGE: Record<OrderStatus, string> = {
  submitted: "bg-slate-100 text-slate-700",
  art_review: "bg-blue-50 text-blue-700",
  needs_changes: "bg-amber-100 text-amber-800",
  art_approved: "bg-emerald-50 text-emerald-700",
  awaiting_payment: "bg-violet-50 text-violet-700",
  in_production: "bg-ember-tint text-ember",
  shipped: "bg-ink text-white",
};

export const money = (n: number | string) =>
  "$" + Number(n).toLocaleString(undefined, { maximumFractionDigits: 0 });
export const dateShort = (s: string) =>
  new Date(s).toLocaleDateString(undefined, { month: "short", day: "numeric" });
export const dateTime = (s: string) =>
  new Date(s).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
export function ago(s: string): string {
  const h = Math.max(0, (Date.now() - new Date(s).getTime()) / 36e5);
  if (h < 1) return "just now";
  if (h < 24) return `${Math.round(h)}h`;
  const d = Math.round(h / 24);
  return d === 1 ? "1 day" : `${d} days`;
}

export function Badge({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-semibold whitespace-nowrap ${BADGE[status]}`}>
      {statusLabel(status)}
    </span>
  );
}

export function Chip({ tone, children }: { tone: "amber" | "green" | "ink" | "grey" | "red"; children: React.ReactNode }) {
  const cls = {
    amber: "bg-amber-100 text-amber-800",
    green: "bg-ember-tint text-ember",
    ink: "bg-ink text-white",
    grey: "bg-smoke text-ink-soft",
    red: "bg-red-50 text-red-700",
  }[tone];
  return <span className={`inline-block text-[10px] font-bold uppercase tracking-[0.08em] px-1.5 py-0.5 rounded ${cls}`}>{children}</span>;
}

export const isOpen = (o: Order) => !["in_production", "shipped"].includes(o.status);
export const hasCard = (o: Order) => o.payment_status === "method_saved" || o.payment_status === "charged";

// The single next thing to do on this order, in the order the work happens.
export type NextAction = {
  key: "card" | "call" | "proof" | "review" | "approve" | "charge" | "ship" | "track" | "done" | "changes";
  label: string;        // short, for lists
  detail: string;       // one sentence, for the detail header
  who: "customer" | "team";
};
export function nextAction(o: Order): NextAction {
  if (o.status === "shipped") {
    return o.tracking_url
      ? { key: "done", label: "Shipped", detail: "Delivered or in transit. Nothing to do.", who: "team" }
      : { key: "track", label: "Add tracking", detail: "Shipped without a tracking link. Add one so the customer can follow it.", who: "team" };
  }
  if (o.status === "in_production") return { key: "ship", label: "In production", detail: "At the factory. Mark shipped and add tracking when it leaves.", who: "team" };
  if (o.status === "needs_changes") return { key: "changes", label: "Waiting on art", detail: "Customer was asked for new artwork. Chase if it's been more than two days.", who: "customer" };
  if (!hasCard(o)) return { key: "card", label: "No card", detail: "No payment method on file. The slot isn't reserved until there is.", who: "customer" };
  if (o.review_status === "needed" || o.review_status === "requested") {
    return { key: "call", label: o.review_status === "requested" ? "Confirm call" : "Book call", detail: o.review_status === "requested" ? "They asked for a time by email. Confirm one and mark it booked." : "Card is on file but no review is booked. Get it on the calendar.", who: o.review_status === "requested" ? "team" : "customer" };
  }
  if (!o.proof_filename) return { key: "proof", label: "Upload proof", detail: "Review is booked. Build the photoreal proof and upload it before the call.", who: "team" };
  if (o.review_status === "booked") return { key: "review", label: "Run review", detail: "Proof is ready. Hold the call, then mark the review done.", who: "team" };
  if (o.status !== "art_approved" && o.status !== "awaiting_payment") return { key: "approve", label: "Mark approved", detail: "Review done. Move the order to Art approved.", who: "team" };
  if (o.payment_status !== "charged") return { key: "charge", label: "Charge", detail: "Approved on the call. Charge the card on file and it goes to production.", who: "team" };
  return { key: "ship", label: "Send to production", detail: "Paid. Move to In production.", who: "team" };
}

export const ACTION_TONE: Record<NextAction["key"], "amber" | "green" | "ink" | "grey" | "red"> = {
  card: "amber", call: "amber", changes: "amber", proof: "green", review: "green", approve: "green", charge: "ink", ship: "grey", track: "red", done: "grey",
};

export async function adminFetch(key: string, path: string, init?: RequestInit) {
  const headers: Record<string, string> = { "x-admin-key": key, ...(init?.headers as Record<string, string> | undefined) };
  const res = await fetch(path, { ...init, headers });
  const body = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, body };
}
