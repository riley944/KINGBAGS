"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { track } from "@/lib/track";
import Reveal from "@/components/Reveal";

// Quality Kit checks out through a live Stripe payment link. The Exact
// Sample is arranged by email until its $300 payment link is created.
const KITS = [
  {
    id: "quality-kit",
    name: "The Quality Kit",
    price: 35,
    tagline: "Feel the construction before you commit.",
    includes: [
      "A finished bag from a past program — the exact construction, stitching, and materials your run gets",
      "A printed photoreal rendering of your design on your bag",
      "Spec sheet with dimensions, materials, and print process",
    ],
    note: "Ships in 3–5 business days. Fully credited toward your order.",
    cta: "Order the Quality Kit — $35",
    href: "https://buy.stripe.com/eVq9AUaJxcb61ur5E763K00",
    external: true,
  },
  {
    id: "exact-sample",
    name: "The Exact Sample",
    price: 300,
    tagline: "A pre-production copy of your actual bag, before the full run.",
    includes: [
      "One pre-production sample of your actual bag, cut and sewn with your artwork",
      "Made at the same factory that produces your full order, with your print plates",
      "Photo documentation of the sample in production",
      "Everything in the Quality Kit, included",
    ],
    note: "Ships in 2–3 weeks. Fully credited toward your order — serious buyers pay nothing extra.",
    cta: "Request the Exact Sample — $300",
    href: "mailto:hello@kingbags.co?subject=Exact%20Sample%20request&body=Hi%20KINGBAGS%20%E2%80%94%20I%27d%20like%20an%20Exact%20Sample.%20My%20bag%2C%20size%2C%20and%20quantity%3A%20",
    external: false,
  },
];

function SamplesInner() {
  const params = useSearchParams();
  const paid = params.get("paid") === "1";

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <div className="max-w-2xl mx-auto text-center mb-14">
        <Reveal>
          <p className="section-label mb-5">Samples</p>
          <h1 className="font-serif text-4xl md:text-6xl text-ink leading-[1.05] mb-6">
            Hold it before you order it.
          </h1>
          <p className="text-lg text-ink-soft leading-relaxed">
            Nobody should order 1,500 bags they&apos;ve never touched. Every sample is fully
            credited toward your order — so if you were going to order anyway, it costs you nothing.
          </p>
        </Reveal>
      </div>

      {paid ? (
        <Reveal>
          <div className="max-w-xl mx-auto bg-ember-tint rounded-2.5xl p-10 text-center">
            <h2 className="font-serif text-2xl text-ink mb-3">Order received. 🎉</h2>
            <p className="text-ink-soft leading-relaxed">
              Your sample is confirmed — a receipt from Stripe is in your email. We&apos;ll
              follow up within one business day with your ship date, and the sample cost is
              credited in full when you place your bag order.
            </p>
          </div>
        </Reveal>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10">
            {KITS.map((k, i) => (
              <Reveal key={k.id} delay={i * 120}>
                <div className="flex flex-col bg-white rounded-2.5xl border border-ink/10 hover:border-ember/40 hover:shadow-lift transition-all p-8 h-full">
                  <div className="flex items-baseline justify-between mb-2">
                    <h2 className="font-serif text-2xl text-ink">{k.name}</h2>
                    <span className="font-serif text-3xl text-ember">${k.price}</span>
                  </div>
                  <p className="text-ember font-semibold text-[15px] mb-5">{k.tagline}</p>
                  <ul className="space-y-2.5 mb-6">
                    {k.includes.map((line) => (
                      <li key={line} className="flex gap-2.5 text-[15px] text-ink-soft leading-snug">
                        <span className="text-ember font-bold shrink-0">✓</span> {line}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto">
                    <p className="text-[13px] text-ink-soft border-t border-ink/10 pt-4 mb-5">{k.note}</p>
                    <a
                      href={k.href}
                      onClick={() => track("sample_checkout", { kit: k.id, value: k.price })}
                      className={`${k.external ? "btn-ember" : "btn-ink"} w-full !py-4 text-center`}
                    >
                      {k.cta}
                    </a>
                    {!k.external && (
                      <p className="text-[12px] text-ink-soft mt-2.5 text-center">
                        We scope it with you by email, then send a secure Stripe link to pay.
                      </p>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="text-[14px] text-ink-soft text-center max-w-xl mx-auto">
            Secure checkout by Stripe — card, Apple Pay, or bank payment. Not sure which fits?{" "}
            <a href="mailto:hello@kingbags.co" className="text-ember font-semibold hover:underline">
              Email us
            </a>{" "}
            and a real person will point you right.
          </p>
        </>
      )}
    </div>
  );
}

export default function SamplesPage() {
  return (
    <Suspense fallback={<div className="py-32 text-center text-ink-soft">Loading…</div>}>
      <SamplesInner />
    </Suspense>
  );
}
