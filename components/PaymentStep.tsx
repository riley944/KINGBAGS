"use client";
import { useEffect, useRef, useState } from "react";
import { loadStripe, type Stripe, type StripeElements } from "@stripe/stripe-js";
import { supabase } from "@/lib/supabase";

// Saves a card or US bank account against the order via a Stripe
// SetupIntent. Nothing is charged here — the method is stored for the
// off-session charge that happens only after proof approval.
export default function PaymentStep({
  orderId,
  totalLabel,
  onDone,
}: {
  orderId: string;
  totalLabel: string;
  onDone: (saved: boolean) => void;
}) {
  const [phase, setPhase] = useState<"loading" | "ready" | "saving" | "unavailable">("loading");
  const [error, setError] = useState<string | null>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const stripeRef = useRef<Stripe | null>(null);
  const elementsRef = useRef<StripeElements | null>(null);

  useEffect(() => {
    const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!pk || !supabase) {
      setPhase("unavailable");
      return;
    }
    let cancelled = false;
    (async () => {
      const { data } = await supabase!.auth.getSession();
      const token = data.session?.access_token;
      if (!token) {
        setPhase("unavailable");
        return;
      }
      const res = await fetch("/api/payment/setup", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId }),
      });
      const body = await res.json().catch(() => ({}));
      if (cancelled) return;
      if (!res.ok || !body.client_secret) {
        setError(body.error || "Couldn't start payment setup.");
        setPhase("unavailable");
        return;
      }
      const stripe = await loadStripe(pk);
      if (!stripe || cancelled) {
        setPhase("unavailable");
        return;
      }
      stripeRef.current = stripe;
      const elements = stripe.elements({
        clientSecret: body.client_secret,
        appearance: {
          variables: {
            colorPrimary: "#14532D",
            colorText: "#10140F",
            borderRadius: "12px",
            fontFamily: "system-ui, sans-serif",
          },
        },
      });
      elementsRef.current = elements;
      const pe = elements.create("payment", { layout: "tabs" });
      if (mountRef.current) {
        pe.mount(mountRef.current);
        pe.on("ready", () => setPhase("ready"));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const save = async () => {
    const stripe = stripeRef.current;
    const elements = elementsRef.current;
    if (!stripe || !elements || phase === "saving") return;
    setPhase("saving");
    setError(null);
    const result = await stripe.confirmSetup({
      elements,
      confirmParams: { return_url: `${window.location.origin}/order/continue?order=${orderId}` },
      redirect: "if_required",
    });
    if (result.error) {
      setError(result.error.message ?? "Payment setup failed — try again.");
      setPhase("ready");
      return;
    }
    const si = result.setupIntent;
    if (si && (si.status === "succeeded" || si.status === "processing")) {
      const { data } = await supabase!.auth.getSession();
      const token = data.session?.access_token ?? "";
      await fetch("/api/payment/setup-complete", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId, setup_intent_id: si.id }),
      });
      onDone(true);
    } else {
      setError("Payment setup didn't complete — try again.");
      setPhase("ready");
    }
  };

  if (phase === "unavailable") {
    return (
      <div>
        <p className="text-ink-soft leading-relaxed mb-6">
          {error || "The payment form isn't available right now."} Your order is placed —
          we&apos;ll collect payment details by email instead.
        </p>
        <button onClick={() => onDone(false)} className="btn-ember !px-8 !py-4">
          Go to My Order →
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-smoke rounded-2xl px-5 py-4 mb-6">
        <p className="text-[14px] text-ink leading-relaxed">
          <span className="font-bold">Nothing is charged today.</span> Your payment method is
          saved and charged only after you approve your proof — {totalLabel}. Bank payment
          (ACH) has the lowest fees for orders this size.
        </p>
      </div>
      <div ref={mountRef} className="min-h-[220px]">
        {phase === "loading" && (
          <p className="text-ink-soft text-sm py-16 text-center">Loading secure payment form…</p>
        )}
      </div>
      <button
        onClick={save}
        disabled={phase !== "ready"}
        className="w-full btn-ember !py-4 mt-6"
      >
        {phase === "saving" ? "Saving…" : "Save Payment Method"}
      </button>
      {error && <p className="text-xs text-red-500 mt-3 text-center">{error}</p>}
      <button
        onClick={() => onDone(false)}
        className="block mx-auto mt-4 text-[13px] font-semibold text-ink-soft hover:text-ink underline underline-offset-4"
      >
        Skip for now — we&apos;ll sort payment by email
      </button>
      <p className="text-[11px] text-ink-soft mt-4 text-center">
        Secured by Stripe. Card details never touch our servers.
      </p>
    </div>
  );
}
