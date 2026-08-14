"use client";
import { useState, useRef, useEffect, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { PRODUCTS, priceFor, Product, MIN_ORDER } from "@/lib/products";
import { DIELINES } from "@/lib/dieline";
import DielineEditor, { ArtState, drawDieline } from "@/components/DielineEditor";
import { saveQuote, uploadArt } from "@/lib/supabase";

const Bag3D = dynamic(() => import("@/components/Bag3D"), { ssr: false });

function Configurator() {
  const params = useSearchParams();
  const initialSlug = params.get("style") || "grocery-tote";
  const [product, setProduct] = useState<Product>(PRODUCTS.find((p) => p.slug === initialSlug) || PRODUCTS[0]);
  const [sizeCode, setSizeCode] = useState(product.sizes[0].code);
  const [art, setArt] = useState<ArtState>({ img: null, x: 0.5, y: 0.5, scale: 1 });
  const [artFile, setArtFile] = useState<File | null>(null);
  const [qty, setQty] = useState(MIN_ORDER);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [texVersion, setTexVersion] = useState(0);

  const editorCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const textureCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const dieline = DIELINES[product.slug]?.[sizeCode] || DIELINES["grocery-tote"].L;

  // Keep an offscreen guide-free canvas in sync for the 3D texture
  const syncTexture = useCallback(() => {
    if (!textureCanvasRef.current) textureCanvasRef.current = document.createElement("canvas");
    drawDieline(textureCanvasRef.current, dieline, art, 1.4, false);
    setTexVersion((v) => v + 1);
  }, [dieline, art]);

  useEffect(() => { syncTexture(); }, [syncTexture]);

  useEffect(() => {
    if (!product.sizes.find((s) => s.code === sizeCode)) setSizeCode(product.sizes[0].code);
  }, [product, sizeCode]);

  const unit = priceFor(product, qty);
  const total = unit * qty;
  const size = product.sizes.find((s) => s.code === sizeCode) || product.sizes[0];

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setArtFile(file);
    const img = new Image();
    img.onload = () => setArt((a) => ({ ...a, img }));
    img.src = URL.createObjectURL(file);
  };

  const handleQtyInput = (v: string) => {
    const n = parseInt(v.replace(/[^0-9]/g, ""), 10);
    if (!isNaN(n)) setQty(n);
  };
  const qtyValid = qty >= MIN_ORDER;

  const handleSubmit = async () => {
    if (!email || !phone || !qtyValid || submitting) return;
    setSubmitting(true);
    let artFilename: string | undefined;
    if (artFile) {
      const up = await uploadArt(artFile);
      if (up) artFilename = up;
    }
    await saveQuote({
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
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 md:py-14">
      <p className="section-label mb-2">The Configurator</p>
      <h1 className="font-serif font-black text-4xl md:text-5xl text-ink mb-2">Design your bag.</h1>
      <p className="text-ink-soft mb-8 max-w-xl">
        Your art goes edge to edge — every panel, every side. Place it on the production template and watch your bag come to life.
      </p>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* LEFT column: template editor */}
        <div className="space-y-6">
          <div>
            <label className="text-[11px] font-bold tracking-[0.2em] uppercase text-ink-soft block mb-3">1 · Your bag</label>
            <div className="flex flex-wrap gap-2">
              {PRODUCTS.map((p) => (
                <button key={p.slug} onClick={() => setProduct(p)}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${product.slug === p.slug ? "bg-forest text-bone" : "bg-white text-ink-soft shadow-soft hover:text-ink"}`}>
                  {p.shortName}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {product.sizes.map((s) => (
                <button key={s.code} onClick={() => setSizeCode(s.code)}
                  className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${sizeCode === s.code ? "bg-ink text-bone" : "bg-sand text-ink-soft hover:text-ink"}`}>
                  {s.label} · {s.dims}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold tracking-[0.2em] uppercase text-ink-soft block mb-3">2 · Your art on the template</label>
            {!art.img && (
              <label className="block bg-white rounded-2.5xl p-8 shadow-soft text-center cursor-pointer hover:shadow-lift transition-all border-2 border-dashed border-ink/10 hover:border-forest/40 mb-4">
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
                <span className="font-semibold text-ink block mb-1">Drop your artwork</span>
                <span className="text-xs text-ink-soft">Full-bleed art works best — it covers the entire template. PNG or JPG, high res.</span>
              </label>
            )}
            <DielineEditor dieline={dieline} art={art} onArtChange={setArt} editorCanvasRef={editorCanvasRef} />
            {art.img && (
              <label className="inline-block mt-3 text-sm font-semibold text-forest cursor-pointer hover:underline">
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
                Replace artwork
              </label>
            )}
          </div>
        </div>

        {/* RIGHT column: 3D + pricing + submit */}
        <div className="space-y-6">
          <div className="aspect-square bg-sand rounded-4xl shadow-soft overflow-hidden">
            <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-ink/20">Loading 3D…</div>}>
              <Bag3D dieline={dieline} textureCanvas={textureCanvasRef.current} version={texVersion} />
            </Suspense>
          </div>
          <p className="text-xs text-ink-soft/60 text-center -mt-3">
            Approximate rendering — final printed product may differ. Drag to rotate.
          </p>

          {/* Quantity: input + slider */}
          <div className="bg-white rounded-2.5xl p-6 shadow-soft">
            <label className="text-[11px] font-bold tracking-[0.2em] uppercase text-ink-soft block mb-4">3 · Quantity</label>
            <div className="flex items-center gap-4 mb-4">
              <input
                type="text" inputMode="numeric" value={qty.toLocaleString()}
                onChange={(e) => handleQtyInput(e.target.value)}
                className={`w-36 rounded-xl px-4 py-3 text-xl font-bold text-ink bg-sand border-2 focus:outline-none ${qtyValid ? "border-transparent focus:border-forest" : "border-red-400"}`}
              />
              <span className="text-sm text-ink-soft">bags</span>
            </div>
            <input
              type="range" min={MIN_ORDER} max={50000} step={500} value={Math.min(Math.max(qty, MIN_ORDER), 50000)}
              onChange={(e) => setQty(Number(e.target.value))}
              className="w-full accent-forest"
            />
            <div className="flex justify-between text-[11px] text-ink-soft/60 mt-1">
              <span>{MIN_ORDER.toLocaleString()} min</span><span>50,000+</span>
            </div>
            {!qtyValid && (
              <p className="text-xs text-red-500 mt-2">Our minimum run is {MIN_ORDER.toLocaleString()} bags — that's what keeps this quality at this price.</p>
            )}
            <div className="flex items-end justify-between border-t border-ink/5 pt-5 mt-5">
              <div>
                <div className="text-sm text-ink-soft">{qty.toLocaleString()} × ${unit.toFixed(2)}</div>
                <div className="font-serif font-black text-4xl text-ink">${total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              </div>
              <div className="text-right text-xs text-ink-soft">
                <div>{size.label} · {size.dims}</div>
                <div>Lead time: {product.leadTime}</div>
              </div>
            </div>
          </div>

          {/* Get My Bags */}
          {submitted ? (
            <div className="bg-forest-tint rounded-2.5xl p-8 text-center">
              <h3 className="font-serif font-bold text-2xl text-ink mb-2">You're in.</h3>
              <p className="text-ink-soft text-sm">Our team reviews your design and calls you within one business day to lock specs, confirm pricing, and get your sample moving.</p>
            </div>
          ) : (
            <div className="bg-ink rounded-2.5xl p-6">
              <label className="text-[11px] font-bold tracking-[0.2em] uppercase text-bone/50 block mb-3">4 · Get your bags</label>
              <input type="email" placeholder="Work email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl px-4 py-3.5 mb-3 bg-bone/10 text-bone placeholder:text-bone/40 border border-bone/10 focus:border-forest-light focus:outline-none" />
              <input type="tel" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl px-4 py-3.5 mb-3 bg-bone/10 text-bone placeholder:text-bone/40 border border-bone/10 focus:border-forest-light focus:outline-none" />
              <input type="text" placeholder="Company (optional)" value={company} onChange={(e) => setCompany(e.target.value)}
                className="w-full rounded-xl px-4 py-3.5 mb-4 bg-bone/10 text-bone placeholder:text-bone/40 border border-bone/10 focus:border-forest-light focus:outline-none" />
              <button onClick={handleSubmit} disabled={!email || !phone || !qtyValid || submitting}
                className="w-full btn-primary !py-4 disabled:opacity-40 disabled:cursor-not-allowed">
                {submitting ? "Saving…" : "Get My Bags"}
              </button>
              <p className="text-[11px] text-bone/40 mt-3 text-center">A real person reviews every design and calls within one business day.</p>
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
