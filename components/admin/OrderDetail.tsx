"use client";
import { useEffect, useRef, useState } from "react";
import type { Order, OrderEvent } from "@/lib/supabase";
import { statusLabel, type OrderStatus } from "@/lib/stages";
import { Badge, Chip, FLOW, nextStatuses, nextAction, ACTION_TONE, money, dateShort, dateTime, hasCard, adminFetch } from "./shared";

type Props = {
  order: Order;
  events: OrderEvent[];
  adminKey: string;
  onBack: () => void;
  onChanged: () => void;
  notify: (msg: string, isError?: boolean) => void;
};

function Section({ title, children, right }: { title: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <section className="bg-white rounded-xl border border-ink/10 p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft">{title}</p>
        {right}
      </div>
      {children}
    </section>
  );
}

function FilePreview({ adminKey, file, label }: { adminKey: string; file: string | null; label: string }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    setUrl(null);
    if (!file) return;
    adminFetch(adminKey, `/api/admin/art?file=${encodeURIComponent(file)}`).then((r) => r.ok && setUrl(r.body.url));
  }, [adminKey, file]);
  if (!file) return <p className="text-[13px] text-amber-700">No {label.toLowerCase()} yet.</p>;
  const isPdf = file.toLowerCase().endsWith(".pdf");
  return (
    <a href={url ?? "#"} target="_blank" rel="noreferrer" className="block group">
      <div className="aspect-[4/3] rounded-lg bg-smoke overflow-hidden border border-ink/10 flex items-center justify-center">
        {url && !isPdf ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt={label} className="w-full h-full object-contain" />
        ) : (
          <span className="text-[12px] text-ink-soft">{isPdf ? "PDF" : "Loading…"}</span>
        )}
      </div>
      <p className="text-[12px] text-ember font-semibold mt-1.5 group-hover:underline">Open {label.toLowerCase()} ↗</p>
    </a>
  );
}

export default function OrderDetail({ order, events, adminKey, onBack, onChanged, notify }: Props) {
  const [busy, setBusy] = useState(false);
  const [notes, setNotes] = useState(order.internal_notes ?? "");
  const [notesSaved, setNotesSaved] = useState(true);
  const [carrier, setCarrier] = useState(order.tracking_carrier ?? "");
  const [tracking, setTracking] = useState(order.tracking_url ?? "");
  const proofInput = useRef<HTMLInputElement>(null);
  const action = nextAction(order);

  useEffect(() => { setNotes(order.internal_notes ?? ""); setNotesSaved(true); }, [order.id, order.internal_notes]);
  useEffect(() => { setCarrier(order.tracking_carrier ?? ""); setTracking(order.tracking_url ?? ""); }, [order.id, order.tracking_carrier, order.tracking_url]);

  // Autosave notes a second after typing stops.
  useEffect(() => {
    if (notesSaved) return;
    const t = setTimeout(async () => {
      const r = await adminFetch(adminKey, `/api/admin/orders/${order.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ internal_notes: notes }) });
      if (r.ok) setNotesSaved(true); else notify(r.body.error || "Couldn't save notes", true);
    }, 900);
    return () => clearTimeout(t);
  }, [notes, notesSaved, adminKey, order.id, notify]);

  const run = async (label: string, fn: () => Promise<{ ok: boolean; body: { error?: string; email?: { ok: boolean; error?: string } | null } }>) => {
    if (busy) return;
    setBusy(true);
    const r = await fn();
    setBusy(false);
    if (!r.ok) { notify(r.body.error || `${label} failed`, true); return; }
    const e = r.body.email ? (r.body.email.ok ? " · customer emailed" : ` · email failed: ${r.body.email.error}`) : "";
    notify(`${order.company} · ${label}${e}`);
    onChanged();
  };

  const setStatus = (s: OrderStatus) => run(`moved to ${statusLabel(s)}`, () =>
    adminFetch(adminKey, `/api/admin/orders/${order.id}/status`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: s }) }));
  const setReview = (review_status: Order["review_status"]) => run(`review ${review_status}`, () =>
    adminFetch(adminKey, `/api/admin/orders/${order.id}/review`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ review_status }) }));
  const charge = () => {
    if (!window.confirm(`Charge ${money(order.total_price)} to ${order.company}'s saved payment method now?`)) return;
    run(`charged ${money(order.total_price)}`, () => adminFetch(adminKey, `/api/admin/orders/${order.id}/charge`, { method: "POST" }));
  };
  const uploadProof = (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("notify", "1");
    run("proof uploaded", () => adminFetch(adminKey, `/api/admin/orders/${order.id}/proof`, { method: "POST", body: fd }));
  };
  const saveTracking = () => run("tracking saved", () =>
    adminFetch(adminKey, `/api/admin/orders/${order.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tracking_carrier: carrier, tracking_url: tracking, notify: true }) }));

  const canCharge = hasCard(order) && order.payment_status !== "charged" && order.review_status === "done" && ["art_approved", "awaiting_payment"].includes(order.status) && !!order.stripe_payment_method_id;
  const bookUrl = `/talk?order=${order.id}&email=${encodeURIComponent(order.email)}&name=${encodeURIComponent(order.company)}&q=${encodeURIComponent(`${order.product_name} · ${order.quantity.toLocaleString()} bags`)}`;
  const mailto = (subject: string, body: string) => `mailto:${order.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <div>
      <button onClick={onBack} className="text-[13px] font-semibold text-ink-soft hover:text-ink mb-4">← All orders</button>

      {/* header */}
      <div className="bg-white rounded-xl border border-ink/10 p-5 md:p-6 mb-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h1 className="font-serif font-bold text-2xl text-ink leading-tight">{order.company}</h1>
              <Badge status={order.status} />
            </div>
            <p className="text-[14px] text-ink-soft">{order.product_name}</p>
            <p className="text-[13px] text-ink-soft mt-0.5">
              {order.quantity.toLocaleString()} bags × ${Number(order.unit_price).toFixed(2)} · placed {dateShort(order.created_at)} ·{" "}
              <a href={`mailto:${order.email}`} className="text-ember hover:underline">{order.email}</a>
              {order.phone && <> · <a href={`tel:${order.phone}`} className="text-ember hover:underline">{order.phone}</a></>}
            </p>
          </div>
          <p className="font-serif font-black text-3xl text-ink">{money(order.total_price)}</p>
        </div>

        {/* next action */}
        <div className={`mt-5 rounded-xl px-5 py-4 flex flex-wrap items-center justify-between gap-4 ${action.who === "customer" ? "bg-amber-50 border border-amber-200" : "bg-ember-tint border border-ember/20"}`}>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft mb-1">Next · {action.who === "customer" ? "waiting on customer" : "your move"}</p>
            <p className="text-[15px] font-semibold text-ink">{action.detail}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {action.key === "card" && (
              <a href={mailto("Reserve your KINGBAGS production slot", `Hi,\n\nYour order is saved. Add a payment method here to reserve your production slot (nothing is charged until you approve your proof):\n${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/order/payment?order=${order.id}\n\nThanks,\nKINGBAGS`)} className="btn-ink !py-2.5 !px-4 !text-[13px]">Email card link</a>
            )}
            {action.key === "call" && (
              <>
                <a href={mailto("Book your KINGBAGS proof review", `Hi,\n\nPick a fifteen-minute slot and we'll put your proof on screen:\n${process.env.NEXT_PUBLIC_SITE_URL ?? ""}${bookUrl}\n\nThanks,\nKINGBAGS`)} className="btn-outline !py-2.5 !px-4 !text-[13px]">Email booking link</a>
                <button onClick={() => setReview("booked")} disabled={busy} className="btn-ink !py-2.5 !px-4 !text-[13px]">Mark booked</button>
              </>
            )}
            {action.key === "proof" && (
              <button onClick={() => proofInput.current?.click()} disabled={busy} className="btn-ink !py-2.5 !px-4 !text-[13px]">Upload proof</button>
            )}
            {action.key === "review" && (
              <button onClick={() => setReview("done")} disabled={busy} className="btn-ink !py-2.5 !px-4 !text-[13px]">Review done</button>
            )}
            {action.key === "approve" && (
              <button onClick={() => setStatus("art_approved")} disabled={busy} className="btn-ink !py-2.5 !px-4 !text-[13px]">Mark Art approved</button>
            )}
            {action.key === "charge" && (
              <button onClick={charge} disabled={busy || !canCharge} className="btn-ember !py-2.5 !px-4 !text-[13px]">Charge {money(order.total_price)}</button>
            )}
            {action.key === "ship" && order.status === "in_production" && (
              <button onClick={() => setStatus("shipped")} disabled={busy} className="btn-ink !py-2.5 !px-4 !text-[13px]">Mark shipped</button>
            )}
            {action.key === "ship" && order.status !== "in_production" && (
              <button onClick={() => setStatus("in_production")} disabled={busy} className="btn-ink !py-2.5 !px-4 !text-[13px]">Move to production</button>
            )}
            {action.key === "changes" && (
              <a href={mailto("Your KINGBAGS artwork", `Hi,\n\nChecking in on the artwork change we asked for. Upload the new file from your account and we'll re-review it right away:\n${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/account\n\nThanks,\nKINGBAGS`)} className="btn-ink !py-2.5 !px-4 !text-[13px]">Chase artwork</a>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.25fr_1fr] gap-4">
        {/* left column */}
        <div className="space-y-4">
          <Section title="Status">
            <div className="flex flex-wrap gap-2">
              {nextStatuses(order.status).map((s) => (
                <button key={s} onClick={() => setStatus(s)} disabled={busy}
                  className={`text-[13px] font-semibold px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50 ${s === "needs_changes" ? "bg-amber-100 text-amber-800 hover:bg-amber-200" : "bg-ember text-white hover:bg-ember-dark"}`}>
                  Move to {statusLabel(s)}
                </button>
              ))}
              <select value="" onChange={(e) => e.target.value && setStatus(e.target.value as OrderStatus)}
                className="text-[13px] font-semibold rounded-lg px-3 py-2.5 bg-smoke text-ink-soft border-none focus:outline-none">
                <option value="">Set any status…</option>
                {FLOW.filter((s) => s !== order.status).map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
              </select>
            </div>
            <p className="text-[12px] text-ink-soft mt-2">Status changes email the customer.</p>
          </Section>

          <Section title="Proof review" right={<Chip tone={order.review_status === "done" ? "green" : order.review_status === "booked" ? "green" : "amber"}>{order.review_status}</Chip>}>
            <p className="text-[14px] text-ink mb-3">
              {{
                needed: "Not booked. The order isn't final until the review happens.",
                requested: "Requested by email. Confirm a time and mark it booked.",
                booked: `Booked${order.review_booked_at ? ` for ${dateTime(order.review_booked_at)}` : ""}.`,
                done: "Done. Approved on the call.",
              }[order.review_status ?? "needed"]}
            </p>
            <div className="flex flex-wrap gap-2">
              {order.review_status !== "booked" && order.review_status !== "done" && (
                <button onClick={() => setReview("booked")} disabled={busy} className="text-[13px] font-semibold px-4 py-2.5 rounded-lg bg-smoke text-ink hover:bg-ink/10 disabled:opacity-50">Mark booked</button>
              )}
              {order.review_status !== "done" && (
                <button onClick={() => setReview("done")} disabled={busy} className="text-[13px] font-semibold px-4 py-2.5 rounded-lg bg-ember text-white hover:bg-ember-dark disabled:opacity-50">Review done</button>
              )}
              {order.review_status === "done" && (
                <button onClick={() => setReview("booked")} disabled={busy} className="text-[13px] font-semibold px-3 py-2 rounded-lg text-ink-soft hover:text-ink">Undo</button>
              )}
            </div>
          </Section>

          <Section title="Payment" right={<Chip tone={order.payment_status === "charged" ? "ink" : hasCard(order) ? "green" : order.payment_status === "failed" ? "red" : "amber"}>{order.payment_status === "method_saved" ? "card on file" : order.payment_status.replace("_", " ")}</Chip>}>
            <p className="text-[14px] text-ink mb-3">
              {{
                none: "No payment method on file.",
                method_saved: "Payment method saved. Charged only after the review is done and the order is Art approved.",
                charged: `Paid${order.paid_at ? ` on ${dateShort(order.paid_at)}` : ""}.`,
                failed: "Last charge attempt failed. See the timeline.",
              }[order.payment_status] ?? "Unknown"}
            </p>
            {canCharge ? (
              <button onClick={charge} disabled={busy} className="text-[14px] font-bold px-5 py-3 rounded-lg bg-ink text-white hover:bg-charcoal disabled:opacity-50">
                Charge {money(order.total_price)} now
              </button>
            ) : hasCard(order) && order.payment_status !== "charged" ? (
              <p className="text-[12px] text-ink-soft">Charge unlocks once the review is done and the order is Art approved.</p>
            ) : null}
          </Section>

          {(order.status === "in_production" || order.status === "shipped") && (
            <Section title="Shipping">
              <div className="grid sm:grid-cols-[140px_1fr_auto] gap-2">
                <input value={carrier} onChange={(e) => setCarrier(e.target.value)} placeholder="Carrier" className="rounded-lg px-3 py-2.5 bg-smoke text-[14px] text-ink border border-transparent focus:border-ember focus:bg-white focus:outline-none" />
                <input value={tracking} onChange={(e) => setTracking(e.target.value)} placeholder="Tracking URL" className="rounded-lg px-3 py-2.5 bg-smoke text-[14px] text-ink border border-transparent focus:border-ember focus:bg-white focus:outline-none" />
                <button onClick={saveTracking} disabled={busy || !tracking} className="text-[13px] font-semibold px-4 py-2.5 rounded-lg bg-ember text-white hover:bg-ember-dark disabled:opacity-50">Save & email</button>
              </div>
              <p className="text-[12px] text-ink-soft mt-2">Saving a tracking link on a shipped order emails it to the customer.</p>
            </Section>
          )}

          <Section title="Timeline">
            {events.length === 0 ? <p className="text-[13px] text-ink-soft">No events yet.</p> : (
              <ol className="relative border-l border-ink/10 ml-1.5 space-y-3">
                {[...events].reverse().map((e) => (
                  <li key={e.id} className="pl-4">
                    <span className="absolute -left-[5px] mt-1.5 w-2.5 h-2.5 rounded-full bg-ember/70" />
                    <p className="text-[13px] text-ink">
                      <span className="font-semibold">{e.status ? statusLabel(e.status as OrderStatus) : e.event.replace(/_/g, " ")}</span>
                      {e.note && <span className="text-ink-soft"> · {e.note}</span>}
                    </p>
                    <p className="text-[11px] text-ink-soft">{dateTime(e.created_at)} · {e.actor}</p>
                  </li>
                ))}
              </ol>
            )}
          </Section>
        </div>

        {/* right column */}
        <div className="space-y-4">
          <Section title="Proof" right={
            <>
              <input ref={proofInput} type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => e.target.files?.[0] && uploadProof(e.target.files[0])} />
              <button onClick={() => proofInput.current?.click()} disabled={busy} className="text-[12px] font-semibold text-ember hover:underline disabled:opacity-50">{order.proof_filename ? "Replace" : "Upload"}</button>
            </>
          }>
            <FilePreview adminKey={adminKey} file={order.proof_filename} label="Proof" />
            {order.proof_uploaded_at && <p className="text-[11px] text-ink-soft mt-1">Uploaded {dateTime(order.proof_uploaded_at)}. Upload emails the customer.</p>}
          </Section>

          <Section title="Customer artwork">
            <FilePreview adminKey={adminKey} file={order.art_filename} label="Artwork" />
          </Section>

          <Section title="Internal notes" right={<span className="text-[11px] text-ink-soft">{notesSaved ? "Saved" : "Saving…"}</span>}>
            <textarea value={notes} onChange={(e) => { setNotes(e.target.value); setNotesSaved(false); }} rows={5} placeholder="Call notes, Pantones, factory PO number, anything the customer shouldn't see."
              className="w-full rounded-lg px-3 py-2.5 bg-smoke text-[14px] text-ink border border-transparent focus:border-ember focus:bg-white focus:outline-none resize-y" />
          </Section>

          <Section title="Ship to">
            <p className="text-[14px] text-ink leading-relaxed">
              {order.ship_name}<br />{order.ship_address1}{order.ship_address2 ? <><br />{order.ship_address2}</> : null}<br />
              {order.ship_city}, {order.ship_state} {order.ship_postal}
            </p>
            {order.billing_email && <p className="text-[13px] text-ink-soft mt-2">Billing: {order.billing_name} · {order.billing_email}</p>}
          </Section>
        </div>
      </div>
    </div>
  );
}
