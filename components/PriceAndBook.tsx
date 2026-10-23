"use client";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PRODUCTS, unitPrice, setupFee, dims, MIN_ORDER, DEFAULT_COLORS, type Product } from "@/lib/products";
import { saveQuote } from "@/lib/supabase";
import { getAttribution } from "@/lib/attribution";
import { track, identify } from "@/lib/track";
import BookCall from "@/components/BookCall";
import { inputCls } from "@/components/Field";

// The money widget: three inputs to a delivered price, four fields to a
// booked call. Saves the quote, emails the price, fires `generate_lead`,
// then shows the calendar prefilled with everything we just learned.

const QTY = [1500, 2500, 5000, 10000, 25000];
const TIMELINES = ["Within 6 weeks", "2–3 months", "3–6 months", "Just pricing"];
const money = (n: number) => "$" + n.toLocaleString(undefined, { maximumFractionDigits: 0 });

export default function PriceAndBook() {
  const params = useSearchParams();
  const product: Product = PRODUCTS.find((p) => p.slug === params.get("bag")) ?? PRODUCTS[0];
  const wanted = params.get("size")?.toUpperCase();
  const [sizeCode, setSizeCode] = useState(product.sizes.some((s) => s.code === wanted) ? wanted! : product.sizes[Math.min(2, product.sizes.length - 1)].code);
  const [qty, setQty] = useState(2500);
  const [customQty, setCustomQty] = useState("");

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [timeline, setTimeline] = useState(TIMELINES[0]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<{ summary: string; value: number } | null>(null);

  const size = product.sizes.find((s) => s.code === sizeCode) ?? product.sizes[0];
  const unit = unitPrice(product, size.code, qty);
  const setup = setupFee(DEFAULT_COLORS);
  const total = unit != null ? unit * qty + setup : null;
  const quoteMode = unit == null;

  const applyCustom = () => {
    const n = parseInt(customQty.replace(/[^\d]/g, ""), 10);
    if (!Number.isNaN(n)) setQty(Math.max(MIN_ORDER, Math.min(50000, n)));
  };

  const valid = name.trim() && email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && company.trim();
  const summary = useMemo(
    () => `${product.shortName} · ${size.label} · ${qty.toLocaleString()} bags · ${total != null ? money(total) : "custom quote"} · needs ${timeline.toLowerCase()}`,
    [product, size, qty, total, timeline]
  );

  const submit = async () => {
    if (!valid || submitting) return;
    setSubmitting(true);
    setError(null);
    const productName = `${product.name} — ${size.label} ${dims(size, "landscape")} · ${DEFAULT_COLORS}-color`;
    const totalRounded = total != null ? Math.round(total * 100) / 100 : 0;
    const res = await saveQuote({
      email: email.trim(),
      company: company.trim(),
      product_slug: product.slug,
      product_name: productName,
      quantity: qty,
      unit_price: unit ?? 0,
      total_price: totalRounded,
      notes: `phone: ${phone.trim()} | contact: ${name.trim()} | timeline: ${timeline} | colors: ${DEFAULT_COLORS} | setup: ${setup} | pricing: ${quoteMode ? "quote" : "modeled"} | flow: call${getAttribution() ? ` | src: ${getAttribution()}` : ""}`,
    });
    setSubmitting(false);
    if (!res.ok) { setError(res.error || "Something went wrong. Email hello@kingbags.co and we'll price it by hand."); return; }
    identify(email);
    track("generate_lead", { kb_action: "price_requested", product: product.slug, quantity: qty, value: Math.round(totalRounded), currency: "USD" });
    fetch("/api/quote/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), company: company.trim(), phone: phone.trim(), product_name: productName, quantity: qty, total_price: totalRounded, unit_price: unit ?? undefined, quote_mode: quoteMode, flow: "call", timeline }),
    }).catch(() => {});
    setBooking({ summary, value: Math.round(totalRounded) });
  };

  if (booking) {
    return (
      <div>
        <div className="bg-ember text-white rounded-2.5xl px-6 py-5 mb-4 shadow-soft">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/70 mb-1">Your price is saved and on its way to {email}</p>
          <p className="font-serif text-[22px] leading-tight">{total != null ? `${money(total)} delivered` : "Custom quote in progress"}</p>
          <p className="text-[14px] text-white/85 mt-1">Last step: pick fifteen minutes. We bring your proof to the call.</p>
        </div>
        <BookCall email={email.trim()} name={company.trim() || name.trim()} summary={booking.summary} value={booking.value} compact />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2.5xl border border-ink/10 shadow-soft p-6 md:p-8">
      {/* size */}
      <p className="text-[11px] font-grotesk font-bold tracking-[0.18em] uppercase text-ink-soft mb-2.5">{product.name} · size</p>
      <div className="flex flex-wrap gap-2 mb-5">
        {product.sizes.map((s) => (
          <button key={s.code} onClick={() => setSizeCode(s.code)}
            className={`rounded-full px-3.5 py-2 text-[13px] font-semibold border transition-colors ${sizeCode === s.code ? "bg-ink text-white border-ink" : "border-ink/15 text-ink hover:border-ink/40"}`}>
            {s.label} <span className="font-normal opacity-70">{dims(s, "landscape")}</span>
          </button>
        ))}
      </div>

      {/* quantity */}
      <p className="text-[11px] font-grotesk font-bold tracking-[0.18em] uppercase text-ink-soft mb-2.5">Quantity</p>
      <div className="flex flex-wrap gap-2 mb-2">
        {QTY.map((q) => (
          <button key={q} onClick={() => { setQty(q); setCustomQty(""); }}
            className={`rounded-full px-3.5 py-2 text-[13px] font-semibold border transition-colors ${qty === q && !customQty ? "bg-ink text-white border-ink" : "border-ink/15 text-ink hover:border-ink/40"}`}>
            {q.toLocaleString()}
          </button>
        ))}
        <input value={customQty} onChange={(e) => setCustomQty(e.target.value)} onBlur={applyCustom} onKeyDown={(e) => e.key === "Enter" && applyCustom()}
          placeholder="Other" inputMode="numeric" className="w-24 rounded-full px-3.5 py-2 text-[13px] font-semibold border border-ink/15 focus:border-ember focus:outline-none" />
      </div>
      <p className="text-[12px] text-ink-soft mb-5">Minimum {MIN_ORDER.toLocaleString()}. Over 50,000, we price by hand.</p>

      {/* price */}
      <div className="rounded-2xl bg-smoke px-5 py-4 mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-grotesk font-bold tracking-[0.18em] uppercase text-ink-soft mb-1">Delivered price</p>
          {total != null ? (
            <>
              <p className="font-serif font-black text-[34px] text-ink leading-none">{money(total)}</p>
              <p className="text-[13px] text-ink-soft mt-1.5">${unit!.toFixed(2)} per bag · includes freight, duties, and ${setup} print setup</p>
            </>
          ) : (
            <>
              <p className="font-serif font-black text-[26px] text-ink leading-none">Priced on the call</p>
              <p className="text-[13px] text-ink-soft mt-1.5">A specialist brings the number.</p>
            </>
          )}
        </div>
      </div>

      {/* contact */}
      <p className="text-[11px] font-grotesk font-bold tracking-[0.18em] uppercase text-ink-soft mb-2.5">Lock it in and pick a time</p>
      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" className={inputCls} />
        <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company" autoComplete="organization" className={inputCls} />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Work email" autoComplete="email" className={inputCls} />
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone (optional)" autoComplete="tel" className={inputCls} />
      </div>
      <select value={timeline} onChange={(e) => setTimeline(e.target.value)} className={`${inputCls} mb-4`}>
        {TIMELINES.map((t) => <option key={t} value={t}>Need them: {t}</option>)}
      </select>
      <button onClick={submit} disabled={!valid || submitting} className="w-full btn-ember !py-4">
        {submitting ? "Saving…" : "Book My 15-Minute Call →"}
      </button>
      {error && <p className="text-[12px] text-red-600 mt-3">{error}</p>}
      <p className="text-[12px] text-ink-soft mt-3 text-center">We email your price, then you pick a time. No account, no card, no commitment.</p>
    </div>
  );
}
