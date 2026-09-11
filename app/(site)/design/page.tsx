"use client";
import { useState, useRef, useEffect, Suspense, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PRODUCTS, priceFor, Product, MIN_ORDER } from "@/lib/products";
import { DIELINES, templateSize } from "@/lib/dieline";
import { drawDieline, ArtState } from "@/components/DielineEditor";
import { saveQuote, uploadArt, stashPendingOrder } from "@/lib/supabase";
import { runPreflight, PreflightCheck } from "@/lib/preflight";
import { getAttribution } from "@/lib/attribution";
import { track } from "@/lib/track";
import Field, { inputCls } from "@/components/Field";
import BagArt from "@/components/BagArt";

const CHECK_STYLE: Record<PreflightCheck["level"], { icon: string; cls: string }> = {
  pass: { icon: "✓", cls: "text-ember" },
  warn: { icon: "!", cls: "text-gold-deep" },
  fail: { icon: "✕", cls: "text-red-500" },
};

const QTY_PRESETS = [1500, 2500, 5000, 10000, 25000, 50000];


function Configurator() {
  const params = useSearchParams();
  const initialSlug = params.get("style") || "grocery-tote";
  const [product, setProduct] = useState<Product>(PRODUCTS.find((p) => p.slug === initialSlug) || PRODUCTS[0]);
  const [sizeCode, setSizeCode] = useState(product.sizes[0].code);
  const [art, setArt] = useState<ArtState>({ img: null, x: 0.5, y: 0.5, scale: 1 });
  const [artFile, setArtFile] = useState<File | null>(null);
  const [qty, setQty] = useState(MIN_ORDER);
  const [customQty, setCustomQty] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [demo, setDemo] = useState(false);
  const previewRef = useRef<HTMLCanvasElement | null>(null);
  const drag = useRef({ on: false, sx: 0, sy: 0, ox: 0.5, oy: 0.5 });

  const dieline = DIELINES[product.slug]?.[sizeCode] || DIELINES["grocery-tote"].L;
  const size = product.sizes.find((s) => s.code === sizeCode) || product.sizes[0];
  const unit = priceFor(product, qty);
  const total = unit * qty;
  const qtyValid = qty >= MIN_ORDER;
  const isPreset = QTY_PRESETS.includes(qty) && customQty === "";

  const redraw = useCallback(() => {
    if (previewRef.current) drawDieline(previewRef.current, dieline, art, 1.1, true);
  }, [dieline, art]);
  useEffect(() => { redraw(); }, [redraw]);
  useEffect(() => {
    if (!product.sizes.find((s) => s.code === sizeCode)) setSizeCode(product.sizes[0].code);
  }, [product, sizeCode]);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setArtFile(file);
    setDemo(false);
    const img = new Image();
    img.onload = () => setArt((a) => ({ ...a, img }));
    img.src = URL.createObjectURL(file);
  };

  // Paints a full-bleed demo artwork so first-time visitors see what a
  // proper edge-to-edge layout looks like on the real template.
  const showExample = () => {
    // Match the live template's aspect so the example genuinely bleeds
    // edge to edge across every panel of the dieline.
    const { width: dw, height: dh } = templateSize(dieline);
    const c = document.createElement("canvas");
    c.width = 1100;
    c.height = Math.round((1100 * dh) / dw);
    const x = c.getContext("2d");
    if (!x) return;
    x.fillStyle = "#14532D";
    x.fillRect(0, 0, c.width, c.height);
    // scattered leaf-dot pattern
    x.fillStyle = "rgba(250, 248, 240, 0.16)";
    for (let i = 0; i < 160; i++) {
      const px = (i * 197) % c.width, py = (i * 331) % c.height;
      x.beginPath();
      x.ellipse(px, py, 26, 11, (i % 6) * 0.5, 0, Math.PI * 2);
      x.fill();
    }
    // wordmark band across the front panel zone
    const bandH = c.height * 0.14;
    const bandY = c.height * 0.30;
    x.fillStyle = "#FAF8F0";
    x.fillRect(0, bandY, c.width, bandH);
    x.fillStyle = "#14532D";
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.font = `italic 900 ${Math.round(bandH * 0.5)}px Georgia, serif`;
    x.fillText("Your Brand", c.width / 2, bandY + bandH * 0.42);
    x.font = `700 ${Math.round(bandH * 0.16)}px Georgia, serif`;
    x.fillText("E S T .  2 0 2 6", c.width / 2, bandY + bandH * 0.8);
    const img = new Image();
    img.onload = () => {
      setArtFile(null);
      setDemo(true);
      setArt({ img, x: 0.5, y: 0.5, scale: 1.0 });
    };
    img.src = c.toDataURL("image/png");
  };

  const downloadTemplate = () => {
    const c = document.createElement("canvas");
    drawDieline(c, dieline, { img: null, x: 0.5, y: 0.5, scale: 1 }, 3, true);
    const a = document.createElement("a");
    a.download = `KINGBAGS-template-${product.slug}-${sizeCode}.png`;
    a.href = c.toDataURL("image/png");
    a.click();
  };

  const handleCustomQty = (v: string) => {
    const digits = v.replace(/[^0-9]/g, "");
    setCustomQty(digits);
    const n = parseInt(digits, 10);
    if (!isNaN(n)) setQty(n);
  };

  const handleSubmit = async () => {
    if (!email || !phone || !qtyValid || submitting) return;
    setSubmitting(true);
    let artFilename: string | undefined;
    if (artFile) {
      const up = await uploadArt(artFile);
      if (up) artFilename = up;
    }
    const productName = `${product.name} — ${size.label} (${size.dims})`;
    const totalRounded = Math.round(total * 100) / 100;
    const res = await saveQuote({
      email,
      company: company || undefined,
      product_slug: product.slug,
      product_name: productName,
      quantity: qty,
      unit_price: unit,
      total_price: totalRounded,
      art_filename: artFilename,
      notes: `phone: ${phone} | sourcing: CN${getAttribution() ? ` | src: ${getAttribution()}` : ""}`,
    });
    setSubmitting(false);
    if (res.ok) {
      track("quote_submitted", { product: product.slug, quantity: qty, value: Math.round(total) });
      // Hand the locked quote to the continue-flow so the customer can turn
      // it into a tracked order without retyping anything.
      stashPendingOrder({
        product_slug: product.slug,
        product_name: productName,
        quantity: qty,
        unit_price: unit,
        total_price: totalRounded,
        art_filename: artFilename,
        email,
        phone,
        company: company || undefined,
      });
      setSubmitted(true);
    } else {
      // Never show the confirmation for a quote we did not actually store.
      setSubmitError(res.error || "Something went wrong saving your quote.");
    }
  };

  const { width: tw, height: th } = templateSize(dieline);
  // Instant pre-flight: pure geometry against the live dieline, recomputed
  // as the art moves or scales. Nothing leaves the browser.
  const preflight =
    art.img && !demo
      ? runPreflight({ img: art.img, fileType: artFile?.type ?? null, dieline, x: art.x, y: art.y, scale: art.scale })
      : [];

  const fileInput = (
    <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
  );

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-10 md:py-14">
      {/* header */}
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-3 mb-8">
        <div>
          <p className="section-label mb-3">The Studio</p>
          <h1 className="font-serif text-4xl md:text-[52px] text-ink leading-[1.02]">Design your bag.</h1>
        </div>
        <p className="text-ink-soft text-[15px] leading-relaxed max-w-sm lg:text-right">
          Real production template. Instant price. Free proof before anything is made.
        </p>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_400px] gap-6 items-start">
        {/* ---------- WORKBENCH ---------- */}
        <div>
          <div
            className="relative bg-smoke rounded-2.5xl border border-ink/10 overflow-hidden"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files?.[0];
              if (f) handleFile(f);
            }}
          >
            <div className="flex items-center justify-between px-5 pt-4">
              <span className="font-grotesk font-bold text-[11px] tracking-[0.18em] uppercase text-ink-soft">
                Live proof · {product.shortName} · {size.label}
              </span>
              <span className="text-[11px] text-ink-soft tabular-nums">
                {Math.round(tw)} × {Math.round(th)} mm
              </span>
            </div>
            <div className="h-[540px] md:h-[640px] flex items-center justify-center p-4 md:p-6">
              <canvas
                ref={previewRef}
                className="block max-h-full max-w-full w-auto h-auto rounded-xl bg-white shadow-soft touch-none select-none"
                style={{ cursor: art.img ? "grab" : "default" }}
                onPointerDown={(e) => {
                  if (!art.img) return;
                  drag.current = { on: true, sx: e.clientX, sy: e.clientY, ox: art.x, oy: art.y };
                }}
                onPointerMove={(e) => {
                  if (!drag.current.on) return;
                  const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
                  setArt((a) => ({
                    ...a,
                    x: Math.max(0, Math.min(1, drag.current.ox + (e.clientX - drag.current.sx) / rect.width)),
                    y: Math.max(0, Math.min(1, drag.current.oy + (e.clientY - drag.current.sy) / rect.height)),
                  }));
                }}
                onPointerUp={() => (drag.current.on = false)}
                onPointerLeave={() => (drag.current.on = false)}
              />
            </div>
            {!art.img && (
              <div className="absolute inset-x-0 bottom-5 flex justify-center px-4 pointer-events-none">
                <div className="pointer-events-auto bg-white/95 backdrop-blur rounded-2xl border border-ink/10 shadow-lift px-5 py-4 flex flex-wrap items-center gap-x-5 gap-y-3 max-w-full">
                  <span className="w-10 h-10 rounded-full bg-ember-tint text-ember flex items-center justify-center shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 16V4" /><path d="m6 10 6-6 6 6" /><path d="M4 20h16" />
                    </svg>
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-ink text-[15px] leading-tight">Drop your artwork on the template</p>
                    <p className="text-[12px] text-ink-soft mt-0.5">PNG, JPG, or WebP · high resolution · full-bleed</p>
                  </div>
                  <label className="btn-ember !py-2.5 !px-5 !text-[13px] cursor-pointer shrink-0">
                    {fileInput}
                    Choose file
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* toolbar */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-4 px-1">
            {art.img ? (
              <>
                <div className="flex items-center gap-3 flex-1 min-w-[220px]">
                  <span className="text-[11px] font-grotesk font-bold tracking-[0.14em] uppercase text-ink-soft shrink-0">Art size</span>
                  <input type="range" min={0.3} max={3} step={0.01} value={art.scale}
                    onChange={(e) => setArt((a) => ({ ...a, scale: Number(e.target.value) }))}
                    className="flex-1 accent-ember" />
                </div>
                <label className="text-[13px] font-semibold text-ember cursor-pointer hover:underline">
                  {fileInput}
                  Replace art
                </label>
                {demo && (
                  <button
                    onClick={() => { setDemo(false); setArt({ img: null, x: 0.5, y: 0.5, scale: 1 }); }}
                    className="text-[13px] font-semibold text-ink-soft hover:text-ink"
                  >
                    Clear example
                  </button>
                )}
              </>
            ) : (
              <p className="text-[13px] text-ink-soft">
                Not sure what &ldquo;edge to edge&rdquo; means?{" "}
                <button onClick={showExample} className="text-ember font-semibold hover:underline">
                  See an example layout
                </button>
              </p>
            )}
            <button onClick={downloadTemplate} className="ml-auto text-[13px] font-semibold text-ink hover:text-ember underline underline-offset-4">
              Download blank template
            </button>
          </div>

          {demo && (
            <div className="bg-ember-tint rounded-2xl px-5 py-4 mt-4">
              <p className="text-sm text-ink leading-relaxed">
                <span className="font-semibold">Example layout.</span> The art runs across the front, back, sides, and base — the whole template prints, then gets cut and sewn. Upload your own art to replace it.
              </p>
            </div>
          )}

          {preflight.length > 0 && (
            <div className="bg-white rounded-2.5xl border border-ink/10 p-5 mt-4">
              <div className="flex items-baseline justify-between gap-4 mb-3">
                <span className="text-[11px] font-grotesk font-bold tracking-[0.18em] uppercase text-ink-soft">Instant art check</span>
                <span className="text-[11px] text-ink-soft">Checked in your browser</span>
              </div>
              <ul className="space-y-3">
                {preflight.map((c) => (
                  <li key={c.id} className="flex gap-3">
                    <span className={`font-bold shrink-0 ${CHECK_STYLE[c.level].cls}`}>{CHECK_STYLE[c.level].icon}</span>
                    <div>
                      <p className="text-[14px] font-semibold text-ink leading-snug">{c.title}</p>
                      <p className="text-[13px] text-ink-soft leading-relaxed mt-0.5">{c.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-[13px] text-ink-soft mt-5 leading-relaxed max-w-2xl">
            This flat proof is how your bag prints — the same template our factories cut and sew from. After you lock in a quote, our design team builds a photoreal rendering of the finished bag and you approve the real thing, not a guess.
          </p>
        </div>

        {/* ---------- CONFIGURATOR RAIL ---------- */}
        <div className="lg:sticky lg:top-24 bg-white rounded-2.5xl border border-ink/10 shadow-soft divide-y divide-ink/10">
          <section className="p-6">
            <p className="text-[11px] font-grotesk font-bold tracking-[0.18em] uppercase text-ink-soft mb-3">Bag</p>
            <div className="grid grid-cols-3 gap-2 mb-5">
              {PRODUCTS.map((p) => (
                <button key={p.slug} onClick={() => setProduct(p)}
                  className={`rounded-xl border p-3 text-left transition-all ${product.slug === p.slug ? "border-ember bg-ember-tint" : "border-ink/10 hover:border-ink/30"}`}>
                  <BagArt variant={p.slug} className={`w-9 h-9 mb-2 ${product.slug === p.slug ? "text-ember" : "text-ink/50"}`} />
                  <span className="block text-[13px] font-semibold text-ink leading-tight">{p.shortName}</span>
                </button>
              ))}
            </div>
            <p className="text-[11px] font-grotesk font-bold tracking-[0.18em] uppercase text-ink-soft mb-3">Size</p>
            <div className="grid grid-cols-2 gap-1 bg-smoke rounded-2xl p-1.5">
              {product.sizes.map((s) => (
                <button key={s.code} onClick={() => setSizeCode(s.code)}
                  className={`rounded-xl px-3 py-2.5 text-[13px] text-left transition-all ${sizeCode === s.code ? "bg-white text-ink shadow-soft font-semibold" : "text-ink-soft hover:text-ink"}`}>
                  {s.label}
                  <span className="block text-[11px] opacity-60">{s.dims}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="p-6">
            <p className="text-[11px] font-grotesk font-bold tracking-[0.18em] uppercase text-ink-soft mb-3">Quantity</p>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {QTY_PRESETS.map((q) => (
                <button key={q} onClick={() => { setQty(q); setCustomQty(""); }}
                  className={`font-grotesk font-bold rounded-xl px-2 py-2.5 text-sm transition-all ${qty === q && isPreset ? "bg-ember text-white" : "bg-smoke text-ink-soft hover:text-ink"}`}>
                  {q.toLocaleString()}
                </button>
              ))}
            </div>
            <input
              type="text" inputMode="numeric" placeholder="Custom quantity"
              value={customQty ? Number(customQty).toLocaleString() : ""}
              onChange={(e) => handleCustomQty(e.target.value)}
              className={`w-full rounded-xl px-4 py-3 text-base font-semibold text-ink bg-smoke border placeholder:font-normal placeholder:text-ink-soft/50 focus:outline-none ${qtyValid || customQty === "" ? "border-transparent focus:border-ember" : "border-red-400"}`}
            />
            {!qtyValid && customQty !== "" && (
              <p className="text-xs text-red-500 mt-2">Minimum run is {MIN_ORDER.toLocaleString()} bags.</p>
            )}
          </section>

          <section className="p-6 bg-smoke/60">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="text-[13px] text-ink-soft mb-1">{qty.toLocaleString()} bags × ${unit.toFixed(2)}</div>
                <div className="font-serif text-[48px] text-ink leading-none tabular-nums">
                  ${total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
              </div>
              <div className="text-right text-[12px] text-ink-soft leading-relaxed pb-1">
                {product.shortName} · {size.label}<br />{product.leadTime}
              </div>
            </div>
          </section>

          <section className="p-6">
            {submitted ? (
              <div className="text-center">
                <h3 className="font-serif text-2xl text-ink mb-2">Your quote is locked.</h3>
                <p className="text-ink-soft text-sm leading-relaxed">
                  Within one business day, a designer on our team will send your photoreal proof, final specs, and a sample plan. Nothing goes to production until you approve it.
                </p>
                <Link href="/order/continue" className="btn-ember w-full !py-4 mt-5 text-center">
                  Continue Your Order →
                </Link>
                <p className="text-[12px] text-ink-soft mt-3 leading-relaxed">
                  Add shipping details and track every step in your account. Still nothing to pay until you approve your proof.
                </p>
              </div>
            ) : (
              <>
                <Field label="Work email">
                  <input type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
                </Field>
                <Field label="Phone">
                  <input type="tel" placeholder="(919) 555-0100" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} />
                </Field>
                <Field label="Company" hint="optional">
                  <input type="text" placeholder="Your brand" value={company} onChange={(e) => setCompany(e.target.value)} className={inputCls} />
                </Field>
                <button onClick={handleSubmit} disabled={!email || !phone || !qtyValid || submitting}
                  className="w-full btn-ember !py-4 mt-2">
                  {submitting ? "Saving…" : "Lock In My Quote"}
                </button>
                {submitError && (
                  <p className="text-xs text-red-500 mt-3 text-center leading-relaxed">
                    We couldn&apos;t save your quote. Please try again, or email{" "}
                    <a href="mailto:hello@kingbags.co" className="font-semibold underline">hello@kingbags.co</a>.
                  </p>
                )}
                <ul className="mt-4 space-y-1.5 text-[13px] text-ink-soft">
                  <li className="flex gap-2.5"><span className="text-ember font-bold">✓</span> Free proof of your exact bag first</li>
                  <li className="flex gap-2.5"><span className="text-ember font-bold">✓</span> Unlimited proof revisions</li>
                  <li className="flex gap-2.5"><span className="text-ember font-bold">✓</span> No payment until you approve it</li>
                </ul>
                <a href="/samples" className="btn-outline w-full !py-3 !text-[14px] mt-4 text-center">
                  Hold it first — Sample Kit from $35
                </a>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default function DesignPage() {
  return (
    <Suspense fallback={<div className="py-32 text-center text-ink-soft">Loading…</div>}>
      <Configurator />
    </Suspense>
  );
}
