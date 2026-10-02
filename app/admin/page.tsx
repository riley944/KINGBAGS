"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Order, OrderEvent } from "@/lib/supabase";
import { adminFetch, money, nextAction, hasCard, type Quote, type Lead } from "@/components/admin/shared";
import Queues from "@/components/admin/Queues";
import OrderDetail from "@/components/admin/OrderDetail";
import { OrdersTable, QuotesTable, LeadsTable } from "@/components/admin/Tables";

// KINGBAGS Ops v3. Key-gated server-side on every call. Views: Today
// (work queues), Orders, Quotes, Samples; an order opens as a full page.

type View = "today" | "orders" | "quotes" | "leads";
const NAV: { key: View; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "orders", label: "Orders" },
  { key: "quotes", label: "Quotes" },
  { key: "leads", label: "Samples" },
];

function readUrl(): { view: View; order: string | null } {
  if (typeof window === "undefined") return { view: "today", order: null };
  const sp = new URLSearchParams(window.location.search);
  const v = sp.get("view") as View | null;
  return { view: v && NAV.some((n) => n.key === v) ? v : "today", order: sp.get("order") };
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
  const [notice, setNotice] = useState<{ msg: string; err: boolean } | null>(null);
  const [view, setView] = useState<View>("today");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const load = useCallback(async (k: string) => {
    setLoading(true);
    setError(null);
    const r = await adminFetch(k, "/api/admin/orders");
    setLoading(false);
    if (!r.ok) {
      setError(r.body.error || `Error ${r.status}`);
      if (r.status === 401) { setKey(""); try { localStorage.removeItem("kb_admin_key"); } catch { /* ignore */ } }
      return;
    }
    setOrders(r.body.orders);
    setEvents(r.body.events);
    setQuotes(r.body.quotes ?? []);
    setLeads(r.body.leads ?? []);
  }, []);

  useEffect(() => {
    const { view: v, order } = readUrl();
    setView(v);
    setSelectedId(order);
    let stored: string | null = null;
    try { stored = localStorage.getItem("kb_admin_key"); } catch { /* ignore */ }
    if (stored) { setKey(stored); load(stored); }
  }, [load]);

  // Keep the URL in sync so orders can be deep-linked from alert emails.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams();
    if (view !== "today") sp.set("view", view);
    if (selectedId) sp.set("order", selectedId);
    const qs = sp.toString();
    window.history.replaceState(null, "", qs ? `/admin?${qs}` : "/admin");
  }, [view, selectedId]);

  // Auto-refresh every two minutes while the tab is visible.
  useEffect(() => {
    if (!key) return;
    const t = setInterval(() => { if (document.visibilityState === "visible") load(key); }, 120_000);
    return () => clearInterval(t);
  }, [key, load]);

  const notify = useCallback((msg: string, err = false) => {
    setNotice({ msg, err });
    setTimeout(() => setNotice(null), 6000);
  }, []);

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

  const selected = useMemo(() => orders.find((o) => o.id === selectedId) ?? null, [orders, selectedId]);
  const stats = useMemo(() => {
    const open = orders.filter((o) => o.status !== "shipped");
    const pipeline = open.reduce((s, o) => s + Number(o.total_price), 0);
    const readyToCharge = orders.filter((o) => nextAction(o).key === "charge");
    const chargeable = readyToCharge.reduce((s, o) => s + Number(o.total_price), 0);
    const month = new Date(); month.setDate(1); month.setHours(0, 0, 0, 0);
    const charged = orders.filter((o) => o.payment_status === "charged" && o.paid_at && new Date(o.paid_at) >= month).reduce((s, o) => s + Number(o.total_price), 0);
    const yourMove = orders.filter((o) => ["proof", "review", "approve", "charge", "track"].includes(nextAction(o).key) && (o.status !== "shipped" || !o.tracking_url)).length;
    const noCard = open.filter((o) => !hasCard(o) && !["in_production"].includes(o.status)).length;
    const newQuotes = quotes.filter((q) => (q.status ?? "new") === "new").length;
    return { open: open.length, pipeline, chargeable, charged, yourMove, noCard, newQuotes };
  }, [orders, quotes]);

  if (!key) {
    return (
      <div className="min-h-screen bg-smoke flex items-center justify-center px-5">
        <div className="w-full max-w-sm bg-white rounded-2xl border border-ink/10 shadow-soft p-8">
          <p className="font-grotesk font-extrabold text-[22px] mb-1"><span className="text-ink">KING</span><span className="text-ember">BAGS</span> <span className="text-[12px] text-ink-soft tracking-[0.2em] ml-1">OPS</span></p>
          <p className="text-[14px] text-ink-soft mb-6">Enter the admin key to open the back office.</p>
          <input type="password" value={keyInput} onChange={(e) => setKeyInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && unlock()} placeholder="Admin key"
            className="w-full rounded-xl px-4 py-3.5 bg-smoke text-ink border border-transparent focus:border-ember focus:bg-white focus:outline-none mb-3" />
          <button onClick={unlock} disabled={!keyInput} className="w-full btn-ember !py-3.5">Unlock</button>
          {error && <p className="text-xs text-red-500 mt-3">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-smoke text-ink">
      {/* top bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-ink/10">
        <div className="mx-auto max-w-[1400px] px-5 h-14 flex items-center gap-4">
          <button onClick={() => { setSelectedId(null); setView("today"); }} className="font-grotesk font-extrabold text-[18px] shrink-0">
            <span className="text-ink">KING</span><span className="text-ember">BAGS</span> <span className="text-[11px] text-ink-soft tracking-[0.2em] ml-1">OPS</span>
          </button>
          <nav className="hidden md:flex items-center gap-1 ml-4">
            {NAV.map((n) => {
              const count = n.key === "today" ? stats.yourMove : n.key === "quotes" ? stats.newQuotes : 0;
              return (
                <button key={n.key} onClick={() => { setSelectedId(null); setView(n.key); }}
                  className={`text-[14px] font-semibold px-3.5 py-2 rounded-lg transition-colors ${view === n.key && !selectedId ? "bg-ink text-white" : "text-ink-soft hover:text-ink hover:bg-smoke"}`}>
                  {n.label}{count > 0 && <span className={`ml-1.5 text-[11px] font-bold px-1.5 py-0.5 rounded-full ${view === n.key && !selectedId ? "bg-white/20" : "bg-amber-100 text-amber-800"}`}>{count}</span>}
                </button>
              );
            })}
          </nav>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search company, email, product…"
            className="ml-auto w-full max-w-xs rounded-lg px-3.5 py-2 bg-smoke text-[14px] text-ink placeholder:text-ink-soft/60 border border-transparent focus:border-ember focus:bg-white focus:outline-none" />
          <button onClick={() => load(key)} disabled={loading} className="text-[13px] font-semibold text-ink-soft hover:text-ink disabled:opacity-50 shrink-0">{loading ? "…" : "Refresh"}</button>
          <button onClick={lock} className="text-[13px] font-semibold text-ink-soft hover:text-ink shrink-0">Lock</button>
        </div>
        <nav className="md:hidden flex gap-1 px-5 pb-2 overflow-x-auto">
          {NAV.map((n) => (
            <button key={n.key} onClick={() => { setSelectedId(null); setView(n.key); }}
              className={`text-[13px] font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap ${view === n.key && !selectedId ? "bg-ink text-white" : "text-ink-soft"}`}>{n.label}</button>
          ))}
        </nav>
      </header>

      {/* toasts */}
      {(notice || error) && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 max-w-lg w-[calc(100%-2rem)]">
          <div className={`rounded-xl px-5 py-3.5 shadow-lift text-[14px] ${notice?.err || error ? "bg-red-600 text-white" : "bg-ink text-white"}`}>
            {notice?.msg ?? error}
            {error && <button onClick={() => setError(null)} className="ml-3 underline">dismiss</button>}
          </div>
        </div>
      )}

      <main className="mx-auto max-w-[1400px] px-5 py-6">
        {selected ? (
          <OrderDetail order={selected} events={events.filter((e) => e.order_id === selected.id)} adminKey={key} onBack={() => setSelectedId(null)} onChanged={() => load(key)} notify={notify} />
        ) : (
          <>
            {view === "today" && (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                  <Stat label="Open orders" value={String(stats.open)} sub={`${money(stats.pipeline)} in pipeline`} />
                  <Stat label="Your move" value={String(stats.yourMove)} sub="proofs, calls, approvals, charges" accent={stats.yourMove > 0} />
                  <Stat label="Ready to charge" value={money(stats.chargeable)} sub="approved on a call" accent={stats.chargeable > 0} />
                  <Stat label="Charged this month" value={money(stats.charged)} sub={`${stats.noCard} order${stats.noCard === 1 ? "" : "s"} still need a card`} />
                </div>
                <Queues orders={orders} onOpen={setSelectedId} />
              </>
            )}
            {view === "orders" && <OrdersTable orders={orders} onOpen={setSelectedId} query={query} />}
            {view === "quotes" && <QuotesTable quotes={quotes} orders={orders} adminKey={key} query={query} onChanged={() => load(key)} notify={notify} />}
            {view === "leads" && <LeadsTable leads={leads} query={query} />}
          </>
        )}
      </main>
    </div>
  );
}

function Stat({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className="bg-white rounded-xl border border-ink/10 px-5 py-4">
      <p className="text-[12px] font-semibold text-ink-soft mb-1">{label}</p>
      <p className={`font-serif font-black text-2xl leading-none ${accent ? "text-ember" : "text-ink"}`}>{value}</p>
      {sub && <p className="text-[12px] text-ink-soft mt-1.5">{sub}</p>}
    </div>
  );
}
