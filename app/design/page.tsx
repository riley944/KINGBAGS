"use client";
import { useState, useRef, useEffect, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { PRODUCTS, priceFor, Product, MIN_ORDER } from "@/lib/products";
import { DIELINES, templateSize } from "@/lib/dieline";
import { drawDieline, ArtState } from "@/components/DielineEditor";
import { saveQuote, uploadArt } from "@/lib/supabase";

const QTY_PRESETS = [2000, 2500, 5000, 10000, 25000, 50000];

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
    const img = new Image();
    img.onload = () => setArt((a) => ({ ...a, img }));
    img.src = URL.createObjectURL(file);
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
    const res = await saveQuote({
      email,
      company: company || undefined,
      product_slug: product.slug,
      product_name: `${product.name} — ${size.label} (${size.dims})`,
      quantity: qty,
      unit_price: unit,
      total_price: Math.round(total * 100) / 100,
      art_filename: artFilename,
      notes: `phone: ${phone} | sourcing: CN`,
    });
    setSubmitting(false);
    if (res.ok) {
      setSubmitted(true);
    } else {
      // Never show the confirmation for a quote we did not actually store.
      setSubmitError(res.error || "Something went wrong saving your quote.");
    }
  };

  const { width: tw, height: th } = templateSize(dieline);

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 md:py-20">
      <div className="max-w-2xl mb-14">
        <p className="section-label mb-4">The Studio</p>
        <h1 className="font-serif font-black text-4xl md:text-6xl text-ink leading-[1.05] mb-5">
          Design your bag.
        </h1>
        <p className="text-ink-soft text-lg leading-relaxed">
          Every KINGBAGS bag prints from a real production template — the same file our factories cut and sew from. Place your art here, and what you see is what gets made.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-12">
        <div className="space-y-14">
          {/* 01 */}
          <div>
            <div className="flex items-baseline gap-4 mb-6">
              <span className="font-serif font-black text-5xl text-ember/25">01</span>
              <h2 className="font-serif font-bold text-2xl text-ink">Choose your bag</h2>
            </div>
            <div className="flex flex-wrap gap-2.5 mb-4">
              {PRODUCTS.map((p) => (
                <button key={p.slug} onClick={() => setProduct(p)}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${product.slug === p.slug ? "bg-ink text-paper" : "bg-white text-ink-soft shadow-soft hover:text-ink"}`}>
                  {p.shortName}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2.5">
              {product.sizes.map((s) => (
                <button key={s.code} onClick={() => setSizeCode(s.code)}
                  className={`rounded-xl px-4 py-2.5 text-sm transition-all ${sizeCode === s.code ? "bg-ember-tint text-ember font-semibold ring-1 ring-ember/30" : "bg-white text-ink-soft shadow-soft hover:text-ink"}`}>
                  <span className="font-semibold">{s.label}</span>
                  <span className="ml-2 opacity-70">{s.dims}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 02 */}
          <div>
            <div className="flex items-baseline gap-4 mb-6">
              <span className="font-serif font-black text-5xl text-ember/25">02</span>
              <h2 className="font-serif font-bold text-2xl text-ink">Get the template</h2>
            </div>
            <div className="bg-white rounded-2.5xl shadow-soft p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div>
                <p className="font-semibold text-ink mb-1">
                  {product.name} · {size.label} production template
                </p>
                <p className="text-sm text-ink-soft">
                  {Math.round(tw)}mm × {Math.round(th)}mm flat dieline — front, back, sides, and base, exactly as it prints. Build your art to this file in any design tool.
                </p>
              </div>
              <button onClick={downloadTemplate} className="btn-outline shrink-0 !py-3 !px-6 !text-sm">
                Download template
              </button>
            </div>
          </div>

          {/* 03 */}
          <div>
            <div className="flex items-baseline gap-4 mb-6">
              <span className="font-serif font-black text-5xl text-ember/25">03</span>
              <h2 className="font-serif font-bold text-2xl text-ink">Place your art</h2>
            </div>
            {!art.img && (
              <label className="block bg-white rounded-2.5xl p-10 shadow-soft text-center cursor-pointer hover:shadow-lift transition-all border border-dashed border-ink/15 hover:border-ember/40 mb-5">
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
                <span className="font-semibold text-ink block mb-1.5 text-lg">Upload your artwork</span>
                <span className="text-sm text-ink-soft">Formatted to the template, or full-bleed art we'll position together. PNG or JPG, high resolution.</span>
              </label>
            )}
            <canvas
              ref={previewRef}
              className="w-full h-auto rounded-2.5xl bg-white shadow-soft touch-none select-none"
              style={{ cursor: art.img ? "grab" : "default", maxHeight: 460, objectFit: "contain" }}
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
            {art.img && (
              <div className="flex items-center gap-6 mt-4">
                <div className="flex-1 bg-white rounded-2xl px-5 py-4 shadow-soft">
                  <label className="text-[11px] font-bold tracking-[0.18em] uppercase text-ink-soft block mb-2">Art size</label>
                  <input type="range" min={0.3} max={3} step={0.01} value={art.scale}
                    onChange={(e) => setArt((a) => ({ ...a, scale: Number(e.target.value) }))}
                    className="w-full accent-ember" />
                </div>
                <label className="text-sm font-semibold text-ember cursor-pointer hover:underline shrink-0">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
                  Replace art
                </label>
              </div>
            )}
            <p className="text-sm text-ink-soft mt-5 leading-relaxed">
              This flat proof is how your bag prints. After you submit, our design team builds a photoreal rendering of the finished bag and sends it with your sample — you approve the real thing, not a guess.
            </p>
          </div>
        </div>

        {/* SIDE RAIL */}
        <div className="lg:sticky lg:top-24 h-fit space-y-5">
          <div className="bg-white rounded-2.5xl shadow-soft p-7">
            <label className="text-[11px] font-bold tracking-[0.18em] uppercase text-ink-soft block mb-4">Quantity</label>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {QTY_PRESETS.map((q) => (
                <button key={q} onClick={() => { setQty(q); setCustomQty(""); }}
                  className={`rounded-xl px-2 py-2.5 text-sm font-semibold transition-all ${qty === q && isPreset ? "bg-ember text-white" : "bg-smoke text-ink-soft hover:text-ink"}`}>
                  {q.toLocaleString()}
                </button>
              ))}
            </div>
            <input
              type="text" inputMode="numeric" placeholder="Custom quantity"
              value={customQty ? Number(customQty).toLocaleString() : ""}
              onChange={(e) => handleCustomQty(e.target.value)}
              className={`w-full rounded-xl px-4 py-3 text-base font-semibold text-ink bg-smoke border placeholder:font-normal placeholder:text-ink-soft/60 focus:outline-none ${qtyValid || customQty === "" ? "border-transparent focus:border-ember" : "border-red-400"}`}
            />
            {!qtyValid && customQty !== "" && (
              <p className="text-xs text-red-500 mt-2">Minimum run is {MIN_ORDER.toLocaleString()} bags.</p>
            )}
            <div className="border-t border-ink/10 pt-5 mt-5">
              <div className="text-sm text-ink-soft mb-1">{qty.toLocaleString()} × ${unit.toFixed(2)}</div>
              <div className="font-serif font-black text-[40px] text-ink leading-none mb-2">
                ${total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div className="text-xs text-ink-soft">{size.label} · {size.dims} · {product.leadTime}</div>
            </div>
          </div>

          {submitted ? (
            <div className="bg-ember-tint rounded-2.5xl p-8 text-center">
              <h3 className="font-serif font-bold text-2xl text-ink mb-2">You're in.</h3>
              <p className="text-ink-soft text-sm leading-relaxed">Our team reviews your art and calls within one business day — photoreal rendering, final specs, and your sample plan.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2.5xl shadow-soft p-7">
              <label className="text-[11px] font-bold tracking-[0.18em] uppercase text-ink-soft block mb-4">Get your bags</label>
              <input type="email" placeholder="Work email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl px-4 py-3.5 mb-3 bg-smoke text-ink placeholder:text-ink-soft/60 border border-transparent focus:border-ember focus:outline-none" />
              <input type="tel" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl px-4 py-3.5 mb-3 bg-smoke text-ink placeholder:text-ink-soft/60 border border-transparent focus:border-ember focus:outline-none" />
              <input type="text" placeholder="Company (optional)" value={company} onChange={(e) => setCompany(e.target.value)}
                className="w-full rounded-xl px-4 py-3.5 mb-5 bg-smoke text-ink placeholder:text-ink-soft/60 border border-transparent focus:border-ember focus:outline-none" />
              <button onClick={handleSubmit} disabled={!email || !phone || !qtyValid || submitting}
                className="w-full btn-ember !py-4">
                {submitting ? "Saving…" : "Get My Bags"}
              </button>
              {submitError && (
                <p className="text-xs text-red-500 mt-3 text-center leading-relaxed">
                  We couldn&apos;t save your quote. Please try again, or email{" "}
                  <a href="mailto:hello@kingbags.com" className="font-semibold underline">hello@kingbags.com</a>.
                </p>
              )}
              <p className="text-[11px] text-ink-soft mt-3 text-center">A real person reviews every design. No spam, ever.</p>
            </div>
          )}
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
