"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Order, OrderEvent } from "@/lib/supabase";
import { statusLabel, OrderStatus } from "@/lib/stages";

// KINGBAGS Ops — internal back office. Key-gated server-side on every call.

type Quote = {
  id: string; created_at: string; email: string; company: string | null;
  product_slug: string; product_name: string; quantity: number;
  unit_price: number; total_price: number; art_filename: string | null; notes: string | null;
};
type Lead = {
  id: string; created_at: string; email: string; company: string | null;
  message: string | null; product_slug: string | null;
};

const FLOW: OrderStatus[] = [
  "submitted", "art_review", "needs_changes", "art_approved",
  "awaiting_payment", "in_production", "shipped",
];

function nextStatuses(s: OrderStatus): OrderStatus[] {
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

const BADGE: Record<OrderStatus, string> = {
  submitted: "bg-slate-100 text-slate-700",
  art_review: "bg-blue-50 text-blue-700",
  needs_changes: "bg-amber-100 text-amber-800",
  art_approved: "bg-emerald-50 text-emerald-700",
  awaiting_payment: "bg-violet-50 text-violet-700",
  in_production: "bg-ember-tint text-ember",
  shipped: "bg-ink text-white",
};

const money = (n: number | string) =>
  "$" + Number(n).toLocaleString(undefined, { maximumFractionDigits: 0 });
const dateShort = (s: string) =>
  new Date(s).toLocaleDateString(undefined, { month: "short", day: "numeric" });
const dateTime = (s: string) =>
  new Date(s).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

function Badge({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-semibold whitespace-nowrap ${BADGE[status]}`}>
      {statusLabel(status)}
    </span>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-white rounded-xl border border-ink/10 px-5 py-4">
      <p className="text-[12px] font-semibold text-ink-soft mb-1">{label}</p>
      <p className={`font-serif font-black text-2xl leading-none ${accent ? "text-ember" : "text-ink"}`}>{value}</p>
    </div>
  );
}

export default function AdminPage() {
  const [key, setKey] = useState("");
  const [keyInput, setKeyInput] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [events, setEvents] = useState<OrderEvent[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [tab, setTab] = useState<"orders" | "quotes" | "leads">("orders");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async (k: string) => {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/orders", { headers: { "x-admin-key": k } });
    setLoading(false);
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
    setQuotes(body.quotes ?? []);
    setLeads(body.leads ?? []);
  }, []);

  useEffect(() => {
    let stored: string | null = null;
    try { stored = localStorage.getItem("kb_admin_key"); } catch { /* ignore */ }
    if (stored) { setKey(stored); load(stored); }
  }, [load]);

  const unlock = () => {
    if (!keyInput) return;
    setKey(keyInput);
    try { localStorage.setItem("kb_admin_key", keyInput); } catch { /* ignore */ }
    load(keyInput);
  };
  const lock = () => {
    setKey("");
    try { localStorage.removeItem("kb_admin_key"); } catch { /* ignore */ }
  };

  const advance = async (order: Order, status: OrderStatus) => {
    if (busy) return;
    setBusy(true);
    setNotice(null);
    const res = await fetch(`/api/admin/orders/${order.id}/status`, {
      method: "POST",
      headers: { "x-admin-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const body = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setError(body.error || `Error ${res.status}`); return; }
    const emailNote = body.email
      ? body.email.ok ? " · customer emailed ✓" : ` · email failed: ${body.email.error}`
      : "";
    setNotice(`${order.company} → ${statusLabel(status)}${emailNote}`);
    load(key);
  };

  const viewArt = async (filename: string) => {
    const res = await fetch(`/api/admin/art?file=${encodeURIComponent(filename)}`, {
      headers: { "x-admin-key": key },
    });
    const body = await res.json().catch(() => ({}));
    if (res.ok && body.url) window.open(body.url, "_blank");
    else setError(body.error || "Couldn't open artwork.");
  };

  const q = query.trim().toLowerCase();
  const match = (...fields: (string | null | undefined)[]) =>
    !q || fields.some((f) => f && f.toLowerCase().includes(q));

  const visibleOrders = orders.filter(
    (o) => (statusFilter === "all" || o.status === statusFilter) && match(o.email, o.company, o.product_name)
  );
  const visibleQuotes = quotes.filter((x) => match(x.email, x.company, x.product_name));
  const visibleLeads = leads.filter((x) => match(x.email, x.company, x.message));

  const open = orders.filter((o) => o.status !== "shipped");
  const attention = orders.filter((o) => ["submitted", "art_review", "needs_changes"].includes(o.status));
  const pipeline = open.reduce((s, o) => s + Number(o.total_price), 0);
  const shippedTotal = orders.filter((o) => o.status === "shipped").reduce((s, o) => s + Number(o.total_price), 0);

  const statusCounts = useMemo(() => {
    const c: Partial<Record<OrderStatus, number>> = {};
    for (const o of orders) c[o.status] = (c[o.status] ?? 0) + 1;
    return c;
  }, [orders]);

  const selected = orders.find((o) => o.id === selectedId) ?? null;

  /* ---------- lock screen ---------- */
  if (!key) {
    return (
      <div className="min-h-screen bg-[#F6F7F5] flex items-center justify-center px-5">
        <div className="w-full max-w-sm bg-white rounded-2xl border border-ink/10 shadow-lift p-8">
          <p className="font-hero font-extrabold text-[20px] tracking-[0.04em] mb-1">
            <span className="text-ink">KING</span><span className="text-ember">BAGS</span>
          </p>
          <p className="text-[13px] text-ink-soft mb-6">Operations</p>
          <input
            type="password" placeholder="Admin key" value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && unlock()}
            className="w-full rounded-xl px-4 py-3 mb-3 bg-smoke text-ink border border-transparent focus:border-ember focus:outline-none text-[15px]"
          />
          <button onClick={unlock} disabled={!keyInput} className="w-full btn-ember !py-3 !text-[15px]">
            Unlock
          </button>
          {error && <p className="text-xs text-red-500 mt-3">{error}</p>}
        </div>
      </div>
    );
  }

  /* ---------- app ---------- */
  return (
    <div className="min-h-screen bg-[#F6F7F5]">
      {/* top bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-ink/10">
        <div className="mx-auto max-w-6xl px-5 py-2.5 sm:py-0 sm:h-14 flex flex-wrap sm:flex-nowrap items-center gap-x-4 gap-y-2">
          <p className="font-hero font-extrabold text-[17px] tracking-[0.04em] shrink-0">
            <span className="text-ink">KING</span><span className="text-ember">BAGS</span>
            <span className="ml-2 text-[11px] font-sans font-bold tracking-[0.14em] text-ink-soft align-middle">OPS</span>
          </p>
          <input
            type="search" placeholder="Search email, company…" value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="order-last basis-full sm:order-none sm:basis-auto sm:flex-1 min-w-0 max-w-md rounded-lg px-3.5 py-2 bg-smoke text-[14px] text-ink placeholder:text-ink-soft/60 border border-transparent focus:border-ember focus:outline-none"
          />
          <div className="ml-auto flex items-center gap-2 shrink-0">
            <button onClick={() => load(key)}
              className="text-[13px] font-semibold text-ink-soft hover:text-ink px-3 py-2 rounded-lg hover:bg-smoke transition-colors">
              {loading ? "Loading…" : "Refresh"}
            </button>
            <button onClick={lock}
              className="text-[13px] font-semibold text-ink-soft hover:text-ink px-3 py-2 rounded-lg hover:bg-smoke transition-colors">
              Lock
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-6">
        {/* stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Stat label="Open orders" value={String(open.length)} />
          <Stat label="Needs action" value={String(attention.length)} accent={attention.length > 0} />
          <Stat label="Open pipeline" value={money(pipeline)} />
          <Stat label="Shipped (lifetime)" value={money(shippedTotal)} />
        </div>

        {(notice || error) && (
          <div className={`rounded-xl px-4 py-3 mb-4 text-[14px] ${error ? "bg-red-50 text-red-700" : "bg-ember-tint text-ink"}`}>
            {error || notice}
          </div>
        )}

        {/* tabs */}
        <div className="flex items-center gap-1 border-b border-ink/10 mb-4">
          {([
            ["orders", `Orders (${orders.length})`],
            ["quotes", `Quotes (${quotes.length})`],
            ["leads", `Sample requests (${leads.length})`],
          ] as const).map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`px-4 py-2.5 text-[14px] font-semibold border-b-2 -mb-px transition-colors ${
                tab === id ? "border-ember text-ember" : "border-transparent text-ink-soft hover:text-ink"
              }`}>
              {label}
            </button>
          ))}
        </div>

        {/* status filter */}
        {tab === "orders" && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            <button onClick={() => setStatusFilter("all")}
              className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                statusFilter === "all" ? "bg-ink text-white" : "bg-white border border-ink/10 text-ink-soft hover:text-ink"
              }`}>
              All ({orders.length})
            </button>
            {FLOW.filter((s) => statusCounts[s]).map((s) => (
              <button key={s} onClick={() => setStatusFilter(statusFilter === s ? "all" : s)}
                className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                  statusFilter === s ? "bg-ink text-white" : "bg-white border border-ink/10 text-ink-soft hover:text-ink"
                }`}>
                {statusLabel(s)} ({statusCounts[s]})
              </button>
            ))}
          </div>
        )}

        {/* ORDERS */}
        {tab === "orders" && (
          <div className="bg-white rounded-xl border border-ink/10 overflow-hidden">
            {visibleOrders.length === 0 ? (
              <p className="p-10 text-center text-ink-soft text-[14px]">
                {orders.length === 0 ? "No orders yet. They'll appear here the moment one is placed." : "Nothing matches."}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-ink/10 text-[11px] uppercase tracking-[0.1em] text-ink-soft">
                      <th className="px-4 py-3 font-bold">Customer</th>
                      <th className="px-4 py-3 font-bold hidden md:table-cell">Product</th>
                      <th className="px-4 py-3 font-bold text-right">Total</th>
                      <th className="px-4 py-3 font-bold">Status</th>
                      <th className="px-4 py-3 font-bold hidden sm:table-cell">Placed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleOrders.map((o) => (
                      <tr key={o.id} onClick={() => setSelectedId(o.id)}
                        className="border-b border-ink/5 last:border-0 hover:bg-smoke/60 cursor-pointer transition-colors">
                        <td className="px-4 py-3.5">
                          <p className="font-semibold text-ink text-[14px]">{o.company}</p>
                          <p className="text-[12px] text-ink-soft">{o.email}</p>
                        </td>
                        <td className="px-4 py-3.5 hidden md:table-cell">
                          <p className="text-[13px] text-ink">{o.product_name}</p>
                          <p className="text-[12px] text-ink-soft">{o.quantity.toLocaleString()} bags</p>
                        </td>
                        <td className="px-4 py-3.5 text-right font-semibold text-ink text-[14px] tabular-nums">
                          {money(o.total_price)}
                        </td>
                        <td className="px-4 py-3.5"><Badge status={o.status} /></td>
                        <td className="px-4 py-3.5 hidden sm:table-cell text-[13px] text-ink-soft">
                          {dateShort(o.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* QUOTES */}
        {tab === "quotes" && (
          <div className="bg-white rounded-xl border border-ink/10 overflow-hidden">
            {visibleQuotes.length === 0 ? (
              <p className="p-10 text-center text-ink-soft text-[14px]">No quotes yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-ink/10 text-[11px] uppercase tracking-[0.1em] text-ink-soft">
                      <th className="px-4 py-3 font-bold">Contact</th>
                      <th className="px-4 py-3 font-bold hidden md:table-cell">Product</th>
                      <th className="px-4 py-3 font-bold text-right">Quote</th>
                      <th className="px-4 py-3 font-bold hidden lg:table-cell">Notes</th>
                      <th className="px-4 py-3 font-bold hidden sm:table-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleQuotes.map((x) => (
                      <tr key={x.id} className="border-b border-ink/5 last:border-0">
                        <td className="px-4 py-3.5">
                          <p className="font-semibold text-ink text-[14px]">{x.company || "—"}</p>
                          <p className="text-[12px] text-ink-soft">{x.email}</p>
                        </td>
                        <td className="px-4 py-3.5 hidden md:table-cell">
                          <p className="text-[13px] text-ink">{x.product_name}</p>
                          <p className="text-[12px] text-ink-soft">{x.quantity.toLocaleString()} bags</p>
                        </td>
                        <td className="px-4 py-3.5 text-right font-semibold text-ink text-[14px] tabular-nums">
                          {money(x.total_price)}
                        </td>
                        <td className="px-4 py-3.5 hidden lg:table-cell text-[12px] text-ink-soft max-w-[260px] truncate">
                          {x.notes || "—"}
                        </td>
                        <td className="px-4 py-3.5 hidden sm:table-cell text-[13px] text-ink-soft">
                          {dateShort(x.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* LEADS */}
        {tab === "leads" && (
          <div className="bg-white rounded-xl border border-ink/10 overflow-hidden">
            {visibleLeads.length === 0 ? (
              <p className="p-10 text-center text-ink-soft text-[14px]">No sample requests yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-ink/10 text-[11px] uppercase tracking-[0.1em] text-ink-soft">
                      <th className="px-4 py-3 font-bold">Contact</th>
                      <th className="px-4 py-3 font-bold">Request</th>
                      <th className="px-4 py-3 font-bold hidden sm:table-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleLeads.map((x) => (
                      <tr key={x.id} className="border-b border-ink/5 last:border-0">
                        <td className="px-4 py-3.5">
                          <p className="font-semibold text-ink text-[14px]">{x.company || "—"}</p>
                          <p className="text-[12px] text-ink-soft">{x.email}</p>
                        </td>
                        <td className="px-4 py-3.5 text-[13px] text-ink-soft">{x.message || x.product_slug || "—"}</td>
                        <td className="px-4 py-3.5 hidden sm:table-cell text-[13px] text-ink-soft">
                          {dateShort(x.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* DETAIL DRAWER */}
      {selected && (
        <>
          <div className="fixed inset-0 bg-ink/30 z-40" onClick={() => setSelectedId(null)} />
          <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-lift overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-ink/10 px-6 py-4 flex items-start justify-between gap-4">
              <div>
                <p className="font-serif font-bold text-lg text-ink leading-tight">{selected.company}</p>
                <p className="text-[13px] text-ink-soft">{money(selected.total_price)} · placed {dateShort(selected.created_at)}</p>
              </div>
              <button onClick={() => setSelectedId(null)}
                className="text-ink-soft hover:text-ink text-xl w-9 h-9 rounded-lg hover:bg-smoke flex items-center justify-center shrink-0">
                ✕
              </button>
            </div>

            <div className="px-6 py-5 space-y-6">
              <div>
                <Badge status={selected.status} />
                <div className="flex flex-wrap gap-2 mt-4">
                  {nextStatuses(selected.status).map((s) => (
                    <button key={s} onClick={() => advance(selected, s)} disabled={busy}
                      className={`text-[13px] font-semibold px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50 ${
                        s === "needs_changes"
                          ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                          : "bg-ember text-white hover:bg-ember-dark"
                      }`}>
                      {busy ? "…" : `Move to ${statusLabel(s)}`}
                    </button>
                  ))}
                  <select value=""
                    onChange={(e) => e.target.value && advance(selected, e.target.value as OrderStatus)}
                    className="text-[13px] font-semibold rounded-lg px-3 py-2.5 bg-smoke text-ink-soft border-none focus:outline-none">
                    <option value="">Set any status…</option>
                    {FLOW.filter((s) => s !== selected.status).map((s) => (
                      <option key={s} value={s}>{statusLabel(s)}</option>
                    ))}
                  </select>
                </div>
                <p className="text-[12px] text-ink-soft mt-2">
                  Status changes email the customer automatically.
                </p>
              </div>

              <div className="border-t border-ink/10 pt-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft mb-2.5">Order</p>
                <p className="text-[14px] text-ink font-semibold">{selected.product_name}</p>
                <p className="text-[13px] text-ink-soft">
                  {selected.quantity.toLocaleString()} bags × ${Number(selected.unit_price).toFixed(2)}
                </p>
                {selected.art_filename ? (
                  <button onClick={() => viewArt(selected.art_filename!)}
                    className="mt-2.5 text-[13px] font-semibold text-ember hover:underline">
                    View uploaded artwork ↗
                  </button>
                ) : (
                  <p className="mt-2.5 text-[13px] text-amber-700">No artwork file on this order.</p>
                )}
              </div>

              <div className="border-t border-ink/10 pt-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft mb-2.5">Contact</p>
                <p className="text-[14px] text-ink">{selected.email}</p>
                {selected.phone && <p className="text-[14px] text-ink">{selected.phone}</p>}
                {selected.billing_email && (
                  <p className="text-[13px] text-ink-soft mt-1.5">
                    Billing: {selected.billing_name} · {selected.billing_email}
                  </p>
                )}
              </div>

              <div className="border-t border-ink/10 pt-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft mb-2.5">Ship to</p>
                <p className="text-[14px] text-ink leading-relaxed">
                  {selected.ship_name}<br />
                  {selected.ship_address1}{selected.ship_address2 ? <><br />{selected.ship_address2}</> : null}<br />
                  {selected.ship_city}, {selected.ship_state} {selected.ship_postal}
                </p>
              </div>

              <div className="border-t border-ink/10 pt-5 pb-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft mb-3">History</p>
                <ul className="space-y-3">
                  {events.filter((e) => e.order_id === selected.id).map((e) => (
                    <li key={e.id} className="flex gap-3 text-[13px]">
                      <span className="w-2 h-2 rounded-full bg-ember mt-1.5 shrink-0" />
                      <div>
                        <p className="text-ink font-semibold">
                          {e.status ? statusLabel(e.status) : e.event.replace(/_/g, " ")}
                        </p>
                        <p className="text-ink-soft">{dateTime(e.created_at)}{e.note ? ` — ${e.note}` : ""}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
