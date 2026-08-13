"use client";
import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PRODUCTS, priceFor, Product } from "@/lib/products";
import { saveQuote, uploadArt } from "@/lib/supabase";

// Print area per style: where art sits on the bag mockup (fractions of canvas)
const PRINT_AREA: Record<string, { x: number; y: number; w: number; h: number }> = {
  "grocery-tote":    { x: 0.22, y: 0.34, w: 0.56, h: 0.44 },
  "insulated-cooler":{ x: 0.20, y: 0.36, w: 0.60, h: 0.40 },
  "canvas-tote":     { x: 0.26, y: 0.36, w: 0.48, h: 0.42 },
  "drawstring":      { x: 0.24, y: 0.26, w: 0.52, h: 0.50 },
  "wine-bag":        { x: 0.30, y: 0.30, w: 0.40, h: 0.44 },
  "produce-bag":     { x: 0.24, y: 0.34, w: 0.52, h: 0.40 },
};

const BAG_COLORS = ["#EDE6D8", "#2E2A26", "#39434B", "#5C3A2E", "#7A2F26", "#3E4A3D"];

function Configurator() {
  const params = useSearchParams();
  const initialSlug = params.get("style") || "grocery-tote";
  const [product, setProduct] = useState<Product>(
    PRODUCTS.find((p) => p.slug === initialSlug) || PRODUCTS[0]
  );
  const [bagColor, setBagColor] = useState(BAG_COLORS[0]);
  const [artImg, setArtImg] = useState<HTMLImageElement | null>(null);
  const [artFile, setArtFile] = useState<File | null>(null);
  const [artScale, setArtScale] = useState(0.8);
  const [artX, setArtX] = useState(0.5);
  const [artY, setArtY] = useState(0.5);
  const [qty, setQty] = useState(1000);
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragRef = useRef<{ active: boolean; startX: number; startY: number; origX: number; origY: number }>({
    active: false, startX: 0, startY: 0, origX: 0.5, origY: 0.5,
  });

  const unit = priceFor(product, qty);
  const total = unit * qty;

  // Draw the mockup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const W = rect.width, H = rect.height;
    ctx.clearRect(0, 0, W, H);

    // === Bag illustration (simple, clean vector bag) ===
    const bx = W * 0.14, by = H * 0.22, bw = W * 0.72, bh = H * 0.68;
    // handles
    ctx.strokeStyle = bagColor;
    ctx.lineWidth = Math.max(8, W * 0.02);
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(W * 0.36, by + 4, W * 0.09, Math.PI, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(W * 0.64, by + 4, W * 0.09, Math.PI, 0);
    ctx.stroke();
    // body
    ctx.fillStyle = bagColor;
    const r = 18;
    ctx.beginPath();
    ctx.moveTo(bx + r, by);
    ctx.lineTo(bx + bw - r, by);
    ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + r);
    ctx.lineTo(bx + bw - bw * 0.04, by + bh - r);
    ctx.quadraticCurveTo(bx + bw - bw * 0.04, by + bh, bx + bw - bw * 0.04 - r, by + bh);
    ctx.lineTo(bx + bw * 0.04 + r, by + bh);
    ctx.quadraticCurveTo(bx + bw * 0.04, by + bh, bx + bw * 0.04, by + bh - r);
    ctx.lineTo(bx, by + r);
    ctx.quadraticCurveTo(bx, by, bx + r, by);
    ctx.closePath();
    ctx.fill();
    // subtle shading for depth
    const grad = ctx.createLinearGradient(bx, 0, bx + bw, 0);
    grad.addColorStop(0, "rgba(0,0,0,0.10)");
    grad.addColorStop(0.15, "rgba(0,0,0,0)");
    grad.addColorStop(0.85, "rgba(0,0,0,0)");
    grad.addColorStop(1, "rgba(0,0,0,0.12)");
    ctx.fillStyle = grad;
    ctx.fill();

    // === Art in print area ===
    if (artImg) {
      const pa = PRINT_AREA[product.slug] || PRINT_AREA["grocery-tote"];
      const paX = W * pa.x, paY = H * pa.y, paW = W * pa.w, paH = H * pa.h;
      ctx.save();
      ctx.beginPath();
      ctx.rect(paX, paY, paW, paH);
      ctx.clip();
      const s = Math.min(paW / artImg.width, paH / artImg.height) * artScale;
      const w = artImg.width * s, h = artImg.height * s;
      const cx = paX + paW * artX - w / 2;
      const cy = paY + paH * artY - h / 2;
      ctx.globalAlpha = 0.96;
      ctx.drawImage(artImg, cx, cy, w, h);
      // fabric texture pickup
      ctx.globalCompositeOperation = "multiply";
      ctx.globalAlpha = 0.08;
      ctx.fillStyle = bagColor;
      ctx.fillRect(paX, paY, paW, paH);
      ctx.restore();
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
    } else {
      const pa = PRINT_AREA[product.slug] || PRINT_AREA["grocery-tote"];
      ctx.setLineDash([8, 8]);
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 2;
      ctx.strokeRect(W * pa.x, H * pa.y, W * pa.w, H * pa.h);
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.font = "13px DM Sans, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Your art here", W * 0.5, H * (pa.y + pa.h / 2));
    }
  }, [product, bagColor, artImg, artScale, artX, artY]);

  // Drag to reposition art
  const onPointerDown = (e: React.PointerEvent) => {
    if (!artImg) return;
    dragRef.current = { active: true, startX: e.clientX, startY: e.clientY, origX: artX, origY: artY };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const pa = PRINT_AREA[product.slug] || PRINT_AREA["grocery-tote"];
    const dx = (e.clientX - dragRef.current.startX) / (rect.width * pa.w);
    const dy = (e.clientY - dragRef.current.startY) / (rect.height * pa.h);
    setArtX(Math.max(0, Math.min(1, dragRef.current.origX + dx)));
    setArtY(Math.max(0, Math.min(1, dragRef.current.origY + dy)));
  };
  const onPointerUp = () => { dragRef.current.active = false; };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setArtFile(file);
    const img = new Image();
    img.onload = () => setArtImg(img);
    img.src = URL.createObjectURL(file);
  };

  const handleSubmit = async () => {
    if (!email || submitting) return;
    setSubmitting(true);
    let artFilename: string | undefined;
    if (artFile) {
      const uploaded = await uploadArt(artFile);
      if (uploaded) artFilename = uploaded;
    }
    await saveQuote({
      email,
      company: company || undefined,
      product_slug: product.slug,
      product_name: product.name,
      quantity: qty,
      unit_price: unit,
      total_price: Math.round(total * 100) / 100,
      art_filename: artFilename,
    });
    setSubmitting(false);
    setSubmitted(true);
  };

  const qtySteps = product.tiers.map((t) => t.minQty).concat([25000, 50000]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">
      <p className="section-label mb-2">The Configurator</p>
      <h1 className="font-serif font-black text-4xl md:text-5xl text-ink mb-8">Design your bag.</h1>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* LEFT: Mockup */}
        <div>
          <div
            className="aspect-square bg-sand rounded-4xl shadow-soft overflow-hidden touch-none select-none"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          >
            <canvas ref={canvasRef} className="w-full h-full" style={{ cursor: artImg ? "grab" : "default" }} />
          </div>
          <p className="text-xs text-ink-soft/60 mt-3 text-center">
            Approximate rendering — final printed product may differ. {artImg && "Drag to reposition your art."}
          </p>
          {artImg && (
            <div className="mt-4 bg-white rounded-2.5xl p-5 shadow-soft">
              <label className="text-xs font-bold tracking-[0.15em] uppercase text-ink-soft block mb-2">Art Size</label>
              <input
                type="range" min={0.2} max={1.5} step={0.01} value={artScale}
                onChange={(e) => setArtScale(Number(e.target.value))}
                className="w-full accent-clay"
              />
            </div>
          )}
        </div>

        {/* RIGHT: Controls */}
        <div className="space-y-6">
          {/* Style */}
          <div>
            <label className="text-xs font-bold tracking-[0.15em] uppercase text-ink-soft block mb-3">1 · Pick your format</label>
            <div className="grid grid-cols-3 gap-2">
              {PRODUCTS.map((p) => (
                <button
                  key={p.slug}
                  onClick={() => setProduct(p)}
                  className={`rounded-2xl px-3 py-3.5 text-sm font-semibold transition-all ${
                    product.slug === p.slug ? "bg-ink text-bone" : "bg-white text-ink-soft shadow-soft hover:text-ink"
                  }`}
                >
                  {p.shortName}
                </button>
              ))}
            </div>
          </div>

          {/* Bag color */}
          <div>
            <label className="text-xs font-bold tracking-[0.15em] uppercase text-ink-soft block mb-3">2 · Bag color</label>
            <div className="flex gap-3">
              {BAG_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setBagColor(c)}
                  className={`w-10 h-10 rounded-full transition-all ${bagColor === c ? "ring-2 ring-clay ring-offset-2 ring-offset-bone scale-110" : "hover:scale-105"}`}
                  style={{ background: c }}
                  aria-label={`Bag color ${c}`}
                />
              ))}
            </div>
            <p className="text-xs text-ink-soft/60 mt-2">Full-color edge-to-edge printing? Any color is possible — pick the closest base for the preview.</p>
          </div>

          {/* Art upload */}
          <div>
            <label className="text-xs font-bold tracking-[0.15em] uppercase text-ink-soft block mb-3">3 · Upload your art</label>
            <label className="block bg-white rounded-2.5xl p-6 shadow-soft text-center cursor-pointer hover:shadow-lift transition-all border-2 border-dashed border-ink/10 hover:border-clay/40">
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
              <span className="text-2xl block mb-1.5">🎨</span>
              <span className="font-semibold text-ink block">{artFile ? artFile.name : "Drop your logo or artwork"}</span>
              <span className="text-xs text-ink-soft">PNG, JPG, or PDF export · higher res = better preview</span>
            </label>
          </div>

          {/* Quantity + live pricing */}
          <div className="bg-white rounded-2.5xl p-6 shadow-soft">
            <label className="text-xs font-bold tracking-[0.15em] uppercase text-ink-soft block mb-3">4 · Quantity</label>
            <div className="flex flex-wrap gap-2 mb-5">
              {qtySteps.map((q) => (
                <button
                  key={q}
                  onClick={() => setQty(q)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                    qty === q ? "bg-clay text-white" : "bg-sand text-ink-soft hover:text-ink"
                  }`}
                >
                  {q.toLocaleString()}
                </button>
              ))}
            </div>
            <div className="flex items-end justify-between border-t border-ink/5 pt-5">
              <div>
                <div className="text-sm text-ink-soft">{qty.toLocaleString()} bags × ${unit.toFixed(2)}</div>
                <div className="font-serif font-black text-4xl text-ink">${total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              </div>
              <div className="text-right text-xs text-ink-soft">
                <div>Lead time: {product.leadTime}</div>
                <div>Free art check included</div>
              </div>
            </div>
          </div>

          {/* Email capture + submit */}
          {submitted ? (
            <div className="bg-clay-tint rounded-2.5xl p-8 text-center">
              <span className="text-3xl block mb-2">✓</span>
              <h3 className="font-serif font-bold text-2xl text-ink mb-2">Quote locked in.</h3>
              <p className="text-ink-soft text-sm">Our team will review your design and confirm everything within 24 hours. Check your inbox.</p>
            </div>
          ) : (
            <div className="bg-ink rounded-2.5xl p-6">
              <label className="text-xs font-bold tracking-[0.15em] uppercase text-bone/50 block mb-3">5 · Lock in your quote</label>
              <input
                type="email" placeholder="Work email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl px-4 py-3.5 mb-3 bg-bone/10 text-bone placeholder:text-bone/40 border border-bone/10 focus:border-clay focus:outline-none"
              />
              <input
                type="text" placeholder="Company (optional)" value={company} onChange={(e) => setCompany(e.target.value)}
                className="w-full rounded-xl px-4 py-3.5 mb-4 bg-bone/10 text-bone placeholder:text-bone/40 border border-bone/10 focus:border-clay focus:outline-none"
              />
              <button
                onClick={handleSubmit}
                disabled={!email || submitting}
                className="w-full btn-clay !py-4 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? "Saving…" : `Get My Quote — $${total.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
              </button>
              <p className="text-[11px] text-bone/40 mt-3 text-center">A real human reviews every design within 24 hours. No spam, ever.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DesignPage() {
  return (
    <Suspense fallback={<div className="py-32 text-center text-ink-soft">Loading configurator…</div>}>
      <Configurator />
    </Suspense>
  );
}
