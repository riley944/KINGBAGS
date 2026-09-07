"use client";
import { useCallback, useEffect, useState } from "react";
import type { Order, OrderEvent } from "@/lib/supabase";
import { STAGES, stageIndex, statusLabel, needsAttention, OrderStatus } from "@/lib/stages";

// Internal ops panel. Not linked from anywhere; useless without the
// ADMIN_SECRET, which gates every API call server-side.

const FLOW: OrderStatus[] = [
  "submitted", "art_review", "needs_changes", "art_approved",
  "awaiting_payment", "in_production", "shipped",
];

function nextStatuses(s: OrderStatus): OrderStatus[] {
  // Sensible forward moves per status; needs_changes is a side-step
  // available during review.
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

export default function AdminPage() {
  const [key, setKey] = useState("");
  const [keyInput, setKeyInput] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [events, setEvents] = useState<OrderEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async (k: string) => {
    setError(null);
    const res = await fetch("/api/admin/orders", { headers: { "x-admin-key": k } });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || `Error ${res.status}`);
      if (res.status === 401) {
        setKey("");
        try { localStorage.removeItem("kb_admin_key"); } catch { /* ignore */ }
      }
      return;
    }
    const body = await res.json();
    setOrders(body.orders);
    setEvents(body.events);
  }, []);

  useEffect(() => {
    let stored: string | null = null;
    try { stored = localStorage.getItem("kb_admin_key"); } catch { /* ignore */ }
    if (stored) {
      setKey(stored);
      load(stored);
    }
  }, [load]);

  const unlock = () => {
    if (!keyInput) return;
    setKey(keyInput);
    try { localStorage.setItem("kb_admin_key", keyInput); } catch { /* ignore */ }
    load(keyInput);
  };

  const advance = async (order: Order, status: OrderStatus) => {
    if (busy) return;
    setBusy(order.id);
    setNotice(null);
    const res = await fetch(`/api/admin/orders/${order.id}/status`, {
      method: "POST",
      headers: { "x-admin-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const body = await res.json().catch(() => ({}));
    setBusy(null);
    if (!res.ok) {
      setError(body.error || `Error ${res.status}`);
      return;
    }
    const emailNote = body.email
      ? body.email.ok
        ? "customer emailed"
        : `email failed: ${body.email.error}`
      : "no email for this status";
    setNotice(`${order.company || order.email} → ${statusLabel(status)} (${emailNote})`);
    load(key);
  };

  if (!key) {
    return (
      <div className="mx-auto max-w-sm px-5 py-24">
        <h1 className="font-serif font-black text-3xl text-ink mb-6">Ops panel</h1>
        <input
          type="password" placeholder="Admin key" value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && unlock()}
          className="w-full rounded-xl px-4 py-3.5 mb-3 bg-smoke text-ink border border-transparent focus:border-ember focus:outline-none"
        />
        <button onClick={unlock} disabled={!keyInput} className="w-full btn-ember !py-3.5">Unlock</button>
        {error && <p className="text-xs text-red-500 mt-3">{error}</p>}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <div className="flex items-baseline justify-between mb-8">
        <h1 className="font-serif font-black text-3xl text-ink">
          Orders <span className="text-ink-soft text-xl font-normal">({orders.length})</span>
        </h1>
        <button onClick={() => load(key)} className="text-sm font-semibold text-ember hover:underline">
          Refresh
        </button>
      </div>

      {notice && (
        <div className="bg-ember-tint rounded-xl px-5 py-3 mb-6 text-sm text-ink">{notice}</div>
      )}
      {error && (
        <div className="bg-red-50 rounded-xl px-5 py-3 mb-6 text-sm text-red-600">{error}</div>
      )}

      {orders.length === 0 && !error ? (
        <p className="text-ink-soft">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => {
            const oEvents = events.filter((e) => e.order_id === o.id);
            return (
              <div key={o.id} className="bg-white rounded-2xl border border-ink/10 p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 mb-2">
                  <div>
                    <span className="font-bold text-ink">{o.company}</span>{" "}
                    <span className="text-ink-soft text-sm">· {o.email}{o.phone ? ` · ${o.phone}` : ""}</span>
                  </div>
                  <span className="font-serif font-black text-xl text-ink">
                    ${Number(o.total_price).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <p className="text-sm text-ink-soft mb-1">
                  {o.product_name} · {o.quantity.toLocaleString()} bags
                  {o.art_filename ? ` · art: ${o.art_filename}` : " · no art file"}
                </p>
                <p className="text-sm text-ink-soft mb-3">
                  Ship: {o.ship_name}, {o.ship_address1}{o.ship_address2 ? `, ${o.ship_address2}` : ""},{" "}
                  {o.ship_city}, {o.ship_state} {o.ship_postal}
                  {o.billing_email ? ` · Billing: ${o.billing_name} <${o.billing_email}>` : ""}
                </p>

                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className={`text-[12px] font-bold px-3 py-1 rounded-full ${
                    needsAttention(o.status) ? "bg-gold-tint text-gold-deep" : "bg-ember-tint text-ember"
                  }`}>
                    {statusLabel(o.status)}
                  </span>
                  <span className="text-[12px] text-ink-soft">
                    stage {stageIndex(o.status) + 1}/{STAGES.length} · placed{" "}
                    {new Date(o.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {nextStatuses(o.status).map((s) => (
                    <button
                      key={s}
                      onClick={() => advance(o, s)}
                      disabled={busy === o.id}
                      className={`text-[13px] font-semibold px-4 py-2 rounded-full transition-colors ${
                        s === "needs_changes"
                          ? "bg-gold-tint text-gold-deep hover:bg-gold/30"
                          : "bg-ember text-white hover:bg-ember-dark"
                      } disabled:opacity-50`}
                    >
                      {busy === o.id ? "…" : `→ ${statusLabel(s)}`}
                    </button>
                  ))}
                  <select
                    className="text-[13px] rounded-full px-3 py-2 bg-smoke text-ink-soft border-none"
                    value=""
                    onChange={(e) => e.target.value && advance(o, e.target.value as OrderStatus)}
                  >
                    <option value="">set any status…</option>
                    {FLOW.filter((s) => s !== o.status).map((s) => (
                      <option key={s} value={s}>{statusLabel(s)}</option>
                    ))}
                  </select>
                </div>

                {oEvents.length > 0 && (
                  <p className="text-[12px] text-ink-soft mt-3 border-t border-ink/10 pt-2">
                    {oEvents.map((e) =>
                      `${new Date(e.created_at).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })} ${e.status ? statusLabel(e.status as OrderStatus) : e.event}`
                    ).join("  →  ")}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
