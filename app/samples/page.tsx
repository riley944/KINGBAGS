"use client";
import { useState } from "react";
import { PRODUCTS } from "@/lib/products";
import { saveLead } from "@/lib/supabase";
import Reveal from "@/components/Reveal";

const KITS = [
  {
    id: "quality-kit",
    name: "The Quality Kit",
    price: 35,
    tagline: "Feel the construction before you commit.",
    includes: [
      "A finished bag from a past program — the exact construction, stitching, and materials your run gets",
      "Material and print swatches for all three bag styles",
      "A printed photoreal rendering of your design on your bag",
      "Spec sheet with dimensions, materials, and print process",
    ],
    note: "Ships in 3–5 business days. Fully credited toward your order.",
    cta: "Request the Quality Kit",
  },
  {
    id: "exact-sample",
    name: "The Exact Sample",
    price: 150,
    tagline: "Your bag, your art, in your hands — before the full run.",
    includes: [
      "One pre-production sample of your actual bag, cut and sewn with your artwork",
      "Made at the same factory that produces your full order",
      "Photo documentation of the sample in production",
      "Everything in the Quality Kit, included",
    ],
    note: "Ships in 2–3 weeks. Fully credited toward your order — serious buyers pay nothing extra.",
    cta: "Request the Exact Sample",
  },
];

export default function SamplesPage() {
  const [kit, setKit] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [style, setStyle] = useState(PRODUCTS[0].slug);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email || !kit || submitting) return;
    setSubmitting(true);
    setError(null);
    const res = await saveLead({
      email,
      company: company || undefined,
      product_slug: style,
      message: `sample kit request: ${kit}`,
    });
    setSubmitting(false);
    if (res.ok) setSubmitted(true);
    else setError(res.error || "Something went wrong.");
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <div className="max-w-2xl mx-auto text-center mb-16">
        <Reveal>
          <p className="section-label mb-5">Samples</p>
          <h1 className="font-serif font-black text-4xl md:text-6xl text-ink leading-[1.05] mb-6">
            Hold it before you order it.
          </h1>
          <p className="text-lg text-ink-soft leading-relaxed">
            Nobody should order 1,500 bags they&apos;ve never touched. Every sample is fully
            credited toward your order — so if you were going to order anyway, it costs you nothing.
          </p>
        </Reveal>
      </div>

      {submitted ? (
        <Reveal>
          <div className="max-w-xl mx-auto bg-ember-tint rounded-2.5xl p-10 text-center">
            <h2 className="font-serif font-bold text-2xl text-ink mb-3">Request received.</h2>
            <p className="text-ink-soft leading-relaxed">
              A real person on our team will email you within one business day with payment
              details and a ship date. Your sample cost is credited in full when you place your order.
            </p>
          </div>
        </Reveal>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-14">
            {KITS.map((k, i) => (
              <Reveal key={k.id} delay={i * 120}>
                <button
                  onClick={() => setKit(k.id)}
                  className={`text-left bg-white rounded-2.5xl p-8 h-full w-full transition-all ${
                    kit === k.id ? "ring-2 ring-ember shadow-lift" : "shadow-soft hover:shadow-lift"
                  }`}
                >
                  <div className="flex items-baseline justify-between mb-2">
                    <h2 className="font-serif font-bold text-2xl text-ink">{k.name}</h2>
                    <span className="font-serif font-black text-3xl text-ember">${k.price}</span>
                  </div>
                  <p className="text-ember font-semibold text-[15px] mb-5">{k.tagline}</p>
                  <ul className="space-y-2.5 mb-6">
                    {k.includes.map((line) => (
                      <li key={line} className="flex gap-2.5 text-[15px] text-ink-soft leading-snug">
                        <span className="text-ember font-bold shrink-0">✓</span> {line}
                      </li>
                    ))}
                  </ul>
                  <p className="text-[13px] text-ink-soft border-t border-ink/10 pt-4">{k.note}</p>
                </button>
              </Reveal>
            ))}
          </div>

          <div className="max-w-xl mx-auto bg-white rounded-2.5xl shadow-soft p-8">
            <label className="text-[11px] font-bold tracking-[0.18em] uppercase text-ink-soft block mb-4">
              {kit ? `Request ${KITS.find((k) => k.id === kit)?.name}` : "Pick a kit above, then tell us where to reach you"}
            </label>
            <input
              type="email" placeholder="Work email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl px-4 py-3.5 mb-3 bg-smoke text-ink placeholder:text-ink-soft/60 border border-transparent focus:border-ember focus:outline-none"
            />
            <input
              type="text" placeholder="Company (optional)" value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full rounded-xl px-4 py-3.5 mb-3 bg-smoke text-ink placeholder:text-ink-soft/60 border border-transparent focus:border-ember focus:outline-none"
            />
            <div className="flex flex-wrap gap-2 mb-5">
              {PRODUCTS.map((p) => (
                <button
                  key={p.slug}
                  onClick={() => setStyle(p.slug)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                    style === p.slug ? "bg-ink text-paper" : "bg-smoke text-ink-soft hover:text-ink"
                  }`}
                >
                  {p.shortName}
                </button>
              ))}
            </div>
            <button
              onClick={handleSubmit}
              disabled={!email || !kit || submitting}
              className="w-full btn-ember !py-4"
            >
              {submitting ? "Sending…" : "Request My Sample"}
            </button>
            {error && (
              <p className="text-xs text-red-500 mt-3 text-center">
                We couldn&apos;t send that. Please try again, or email{" "}
                <a href="mailto:hello@kingbags.com" className="font-semibold underline">hello@kingbags.com</a>.
              </p>
            )}
            <p className="text-[11px] text-ink-soft mt-3 text-center">
              No payment now — we&apos;ll email you an invoice and ship date first.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
