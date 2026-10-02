"use client";
import { useState } from "react";
import type { Order } from "@/lib/supabase";
import { Badge, Chip, nextAction, ACTION_TONE, money, dateShort, ago, hasCard, adminFetch, type Quote, type Lead } from "./shared";

const ORDER_FILTERS: { key: string; label: string; test: (o: Order) => boolean }[] = [
  { key: "open", label: "Open", test: (o) => !["shipped"].includes(o.status) },
  { key: "nocard", label: "No card", test: (o) => !hasCard(o) && !["in_production", "shipped"].includes(o.status) },
  { key: "nocall", label: "No call", test: (o) => (o.review_status === "needed" || o.review_status === "requested") && !["in_production", "shipped"].includes(o.status) },
  { key: "charge", label: "Ready to charge", test: (o) => nextAction(o).key === "charge" },
  { key: "production", label: "In production", test: (o) => o.status === "in_production" },
  { key: "shipped", label: "Shipped", test: (o) => o.status === "shipped" },
  { key: "all", label: "All", test: () => true },
];

export function OrdersTable({ orders, onOpen, query }: { orders: Order[]; onOpen: (id: string) => void; query: string }) {
  const [filter, setFilter] = useState("open");
  const q = query.trim().toLowerCase();
  const f = ORDER_FILTERS.find((x) => x.key === filter)!;
  const rows = orders.filter(f.test).filter((o) => !q || [o.company, o.email, o.product_name].some((s) => s?.toLowerCase().includes(q)));
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {ORDER_FILTERS.map((x) => {
          const n = orders.filter(x.test).length;
          return (
            <button key={x.key} onClick={() => setFilter(x.key)}
              className={`text-[13px] font-semibold px-3.5 py-2 rounded-full transition-colors ${filter === x.key ? "bg-ink text-white" : "bg-white border border-ink/10 text-ink-soft hover:text-ink"}`}>
              {x.label} <span className="opacity-60">{n}</span>
            </button>
          );
        })}
      </div>
      <div className="bg-white rounded-xl border border-ink/10 overflow-hidden">
        {rows.length === 0 ? <p className="p-10 text-center text-ink-soft text-[14px]">Nothing here.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-ink/10 text-[11px] uppercase tracking-[0.1em] text-ink-soft">
                  <th className="px-4 py-3 font-bold">Customer</th>
                  <th className="px-4 py-3 font-bold hidden md:table-cell">Product</th>
                  <th className="px-4 py-3 font-bold text-right">Total</th>
                  <th className="px-4 py-3 font-bold">Stage</th>
                  <th className="px-4 py-3 font-bold hidden lg:table-cell">Next</th>
                  <th className="px-4 py-3 font-bold hidden sm:table-cell">Card</th>
                  <th className="px-4 py-3 font-bold hidden sm:table-cell">Call</th>
                  <th className="px-4 py-3 font-bold hidden sm:table-cell text-right">Age</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((o) => {
                  const a = nextAction(o);
                  return (
                    <tr key={o.id} onClick={() => onOpen(o.id)} className="border-b border-ink/5 last:border-0 hover:bg-smoke/60 cursor-pointer">
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-ink text-[14px]">{o.company}</p>
                        <p className="text-[12px] text-ink-soft">{o.email}</p>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <p className="text-[13px] text-ink">{o.product_name.split(" — ")[0]}</p>
                        <p className="text-[12px] text-ink-soft">{o.quantity.toLocaleString()} bags</p>
                      </td>
                      <td className="px-4 py-3.5 text-right font-semibold text-ink text-[14px] tabular-nums">{money(o.total_price)}</td>
                      <td className="px-4 py-3.5"><Badge status={o.status} /></td>
                      <td className="px-4 py-3.5 hidden lg:table-cell"><Chip tone={ACTION_TONE[a.key]}>{a.label}</Chip></td>
                      <td className="px-4 py-3.5 hidden sm:table-cell">{o.payment_status === "charged" ? <Chip tone="ink">paid</Chip> : hasCard(o) ? <Chip tone="green">on file</Chip> : <Chip tone="amber">none</Chip>}</td>
                      <td className="px-4 py-3.5 hidden sm:table-cell">{o.review_status === "done" ? <Chip tone="ink">done</Chip> : o.review_status === "booked" ? <Chip tone="green">booked</Chip> : <Chip tone="amber">{o.review_status === "requested" ? "requested" : "none"}</Chip>}</td>
                      <td className="px-4 py-3.5 hidden sm:table-cell text-right text-[13px] text-ink-soft">{ago(o.created_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const QUOTE_TONE: Record<Quote["status"], "amber" | "green" | "ink" | "grey"> = { new: "amber", contacted: "green", won: "ink", lost: "grey" };

export function QuotesTable({ quotes, orders, adminKey, query, onChanged, notify }: { quotes: Quote[]; orders: Order[]; adminKey: string; query: string; onChanged: () => void; notify: (m: string, e?: boolean) => void }) {
  const [filter, setFilter] = useState<"active" | "all">("active");
  const q = query.trim().toLowerCase();
  const orderEmails = new Set(orders.map((o) => o.email.toLowerCase()));
  const rows = quotes
    .filter((x) => filter === "all" || (x.status !== "won" && x.status !== "lost"))
    .filter((x) => !q || [x.company, x.email, x.product_name].some((s) => s?.toLowerCase().includes(q)));
  const setStatus = async (x: Quote, status: Quote["status"]) => {
    const r = await adminFetch(adminKey, `/api/admin/quotes/${x.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    if (r.ok) { notify(`${x.company || x.email} · ${status}`); onChanged(); } else notify(r.body.error || "Couldn't update quote", true);
  };
  const followUp = (x: Quote) => `mailto:${x.email}?subject=${encodeURIComponent(`Your KINGBAGS quote · ${x.quantity.toLocaleString()} bags`)}&body=${encodeURIComponent(`Hi${x.company ? ` ${x.company}` : ""},\n\nYour quote is saved: ${x.product_name}, ${x.quantity.toLocaleString()} bags at $${Number(x.total_price).toLocaleString()} all-in. Two steps to make it an order:\n\n1. Reserve your slot: ${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/order/continue\n2. Book your fifteen-minute proof review: ${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/talk?email=${encodeURIComponent(x.email)}\n\nHappy to answer anything first.\n\nKINGBAGS`)}`;
  return (
    <div>
      <div className="flex gap-2 mb-4">
        {(["active", "all"] as const).map((k) => (
          <button key={k} onClick={() => setFilter(k)} className={`text-[13px] font-semibold px-3.5 py-2 rounded-full ${filter === k ? "bg-ink text-white" : "bg-white border border-ink/10 text-ink-soft"}`}>{k === "active" ? "Active" : "All"}</button>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-ink/10 overflow-hidden">
        {rows.length === 0 ? <p className="p-10 text-center text-ink-soft text-[14px]">No quotes here.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-ink/10 text-[11px] uppercase tracking-[0.1em] text-ink-soft">
                  <th className="px-4 py-3 font-bold">Contact</th>
                  <th className="px-4 py-3 font-bold hidden md:table-cell">Quote</th>
                  <th className="px-4 py-3 font-bold text-right">Total</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                  <th className="px-4 py-3 font-bold hidden sm:table-cell">Date</th>
                  <th className="px-4 py-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((x) => {
                  const phone = /phone:\s*([^|]+)/.exec(x.notes ?? "")?.[1]?.trim();
                  const hasOrder = orderEmails.has(x.email.toLowerCase());
                  return (
                    <tr key={x.id} className="border-b border-ink/5 last:border-0">
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-ink text-[14px]">{x.company || "—"} {hasOrder && <Chip tone="ink">has order</Chip>}</p>
                        <p className="text-[12px] text-ink-soft">{x.email}{phone ? ` · ${phone}` : ""}</p>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <p className="text-[13px] text-ink">{x.product_name.split(" — ")[0]}</p>
                        <p className="text-[12px] text-ink-soft">{x.quantity.toLocaleString()} bags{x.art_filename ? " · art attached" : ""}</p>
                      </td>
                      <td className="px-4 py-3.5 text-right font-semibold text-ink text-[14px] tabular-nums">{money(x.total_price)}</td>
                      <td className="px-4 py-3.5"><Chip tone={QUOTE_TONE[x.status ?? "new"]}>{x.status ?? "new"}</Chip></td>
                      <td className="px-4 py-3.5 hidden sm:table-cell text-[13px] text-ink-soft">{dateShort(x.created_at)}</td>
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <a href={followUp(x)} onClick={() => x.status === "new" && setStatus(x, "contacted")} className="text-[12px] font-semibold text-ember hover:underline mr-3">Follow up</a>
                        <select value="" onChange={(e) => e.target.value && setStatus(x, e.target.value as Quote["status"])} className="text-[12px] font-semibold rounded-md px-2 py-1 bg-smoke text-ink-soft border-none">
                          <option value="">Mark…</option>
                          {(["new", "contacted", "won", "lost"] as const).filter((s) => s !== x.status).map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export function LeadsTable({ leads, query }: { leads: Lead[]; query: string }) {
  const q = query.trim().toLowerCase();
  const rows = leads.filter((x) => !q || [x.company, x.email, x.message].some((s) => s?.toLowerCase().includes(q)));
  return (
    <div className="bg-white rounded-xl border border-ink/10 overflow-hidden">
      {rows.length === 0 ? <p className="p-10 text-center text-ink-soft text-[14px]">No sample requests yet.</p> : (
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-ink/10 text-[11px] uppercase tracking-[0.1em] text-ink-soft">
              <th className="px-4 py-3 font-bold">Contact</th>
              <th className="px-4 py-3 font-bold">Request</th>
              <th className="px-4 py-3 font-bold hidden sm:table-cell">Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((x) => (
              <tr key={x.id} className="border-b border-ink/5 last:border-0">
                <td className="px-4 py-3.5"><p className="font-semibold text-ink text-[14px]">{x.company || "—"}</p><p className="text-[12px] text-ink-soft">{x.email}</p></td>
                <td className="px-4 py-3.5 text-[13px] text-ink-soft">{x.message || x.product_slug || "—"}</td>
                <td className="px-4 py-3.5 hidden sm:table-cell text-[13px] text-ink-soft">{dateShort(x.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
