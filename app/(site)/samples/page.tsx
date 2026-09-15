"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { track } from "@/lib/track";
import Reveal from "@/components/Reveal";

// Live Stripe payment link (KING BAGS account). Checkout collects payment,
// shipping address, phone, and bag preference.
const KIT = {
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
  url: "https://buy.stripe.com/eVq9AUaJxcb61ur5E763K00",
};

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
            Nobody should order 1,500 bags they&apos;ve never touched. The sample is fully
            credited toward your order — so if you were going to order anyway, it costs you nothing.
          </p>
        </Reveal>
      </div>

      {paid ? (
        <Reveal>
          <div className="max-w-xl mx-auto bg-ember-tint rounded-2.5xl p-10 text-center">
            <h2 className="font-serif text-2xl text-ink mb-3">Order received. 🎉</h2>
            <p className="text-ink-soft leading-relaxed">
              Your Quality Kit is confirmed — a receipt from Stripe is in your email. We&apos;ll
              follow up within one business day with your ship date, and the $35 is credited in
              full when you place your bag order.
            </p>
          </div>
        </Reveal>
      ) : (
        <Reveal>
          <div className="max-w-xl mx-auto">
            <div className="bg-white rounded-2.5xl border border-ink/10 shadow-soft p-8 md:p-10">
              <div className="flex items-baseline justify-between mb-2">
                <h2 className="font-serif text-3xl text-ink">{KIT.name}</h2>
                <span className="font-serif text-3xl text-ember">${KIT.price}</span>
              </div>
              <p className="text-ember font-semibold text-[15px] mb-6">{KIT.tagline}</p>
              <ul className="space-y-3 mb-7">
                {KIT.includes.map((line) => (
                  <li key={line} className="flex gap-2.5 text-[15px] text-ink-soft leading-snug">
                    <span className="text-ember font-bold shrink-0">✓</span> {line}
                  </li>
                ))}
              </ul>
              <p className="text-[13px] text-ink-soft border-t border-ink/10 pt-4 mb-6">{KIT.note}</p>
              <a
                href={KIT.url}
                onClick={() => track("sample_checkout", { kit: KIT.id, value: KIT.price })}
                className="btn-ember w-full !py-4 text-center"
              >
                {KIT.cta}
              </a>
            </div>
            <p className="text-[14px] text-ink-soft text-center mt-6 leading-relaxed">
              Secure checkout by Stripe — card, Apple Pay, or bank payment.<br />
              Need a pre-production sample of your exact bag?{" "}
              <a href="mailto:hello@kingbags.co" className="text-ember font-semibold hover:underline">
                Email us
              </a>{" "}
              and we&apos;ll scope it with you.
            </p>
          </div>
        </Reveal>
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
