"use client";
import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { track } from "@/lib/track";
import Reveal from "@/components/Reveal";
import { CTA } from "@/lib/site";

// Quality Kit checks out through a live Stripe Payment Link. The Exact
// Sample goes through hosted Stripe Checkout created by our own API route,
// which also asks which bag and how many they plan to order.
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
    cta: "Order the Exact Sample — $300",
    href: "/api/samples/checkout?kit=exact-sample",
  },
];

function Kits() {
  return (
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
                  onClick={() => track("purchase", { kb_action: "sample_checkout", kit: k.id, value: k.price, currency: "USD" })}
                  className="btn-ember w-full !py-4 text-center"
                >
                  {k.cta}
                </a>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <p className="text-[14px] text-ink-soft text-center max-w-xl mx-auto">
        Secure checkout by Stripe — card, Apple Pay, or bank payment. Not sure which fits?{" "}
        <Link href="/talk" className="text-ember font-semibold hover:underline">{CTA.talk}</Link>{" "}
        and a real person will point you right.
      </p>
    </>
  );
}

function SamplesInner() {
  const params = useSearchParams();
  const paid = params.get("paid") === "1";
  const error = params.get("error");

  if (paid) {
    return (
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
    );
  }

  return (
    <>
      {error && (
        <div className="max-w-2xl mx-auto mb-8 rounded-2.5xl border border-gold/60 bg-gold-tint px-5 py-4 text-[15px] text-ink">
          {error}
        </div>
      )}
      <Kits />
    </>
  );
}

export default function SamplesPage() {
  // The kit cards render on the server; only the paid/error state waits
  // for the URL.
  return (
    <Suspense fallback={<Kits />}>
      <SamplesInner />
    </Suspense>
  );
}
