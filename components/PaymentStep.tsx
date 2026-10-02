"use client";
import { useEffect, useRef, useState } from "react";
import { loadStripe, type Stripe, type StripeElements } from "@stripe/stripe-js";
import { supabase } from "@/lib/supabase";
import { reportClientError } from "@/lib/report";

// Saves a card or US bank account against the order via a Stripe
// SetupIntent. Nothing is charged here — the method is stored for the
// off-session charge that happens only after proof approval.
//
// Every failure path degrades to the "unavailable" screen and reports the
// error to the server log; nothing here is allowed to crash the page.
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
    const fail = (where: string, err: unknown, msg?: string) => {
      if (cancelled) return;
      reportClientError(where, err, { orderId });
      setError(msg ?? (err instanceof Error ? err.message : "Couldn't load the payment form."));
      setPhase("unavailable");
    };

    (async () => {
      try {
        const { data } = await supabase!.auth.getSession();
        const token = data.session?.access_token;
        if (!token) return fail("payment.session", new Error("No session"), "Your sign-in expired. Reload the page and try again.");

        const res = await fetch("/api/payment/setup", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ order_id: orderId }),
        });
        const body = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (!res.ok || !body.client_secret) {
          return fail("payment.setup", new Error(body.error || `HTTP ${res.status}`), body.error || "Couldn't start payment setup.");
        }

        let stripe: Stripe | null = null;
        try {
          stripe = await loadStripe(pk);
        } catch (e) {
          return fail("payment.loadStripe", e, "The secure payment form couldn't load. A content blocker or privacy setting may be blocking js.stripe.com.");
        }
        if (!stripe || cancelled) return fail("payment.loadStripe", new Error("Stripe.js unavailable"), "The secure payment form couldn't load.");
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
        pe.on("loaderror", (ev) => fail("payment.element.loaderror", new Error(ev.error?.message ?? "loaderror"), ev.error?.message));
        pe.on("ready", () => !cancelled && setPhase("ready"));
        if (mountRef.current) pe.mount(mountRef.current);
      } catch (e) {
        fail("payment.init", e);
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
    try {
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
        }).catch((e) => reportClientError("payment.setupComplete", e, { orderId }));
        onDone(true);
      } else {
        setError("Payment setup didn't complete — try again.");
        setPhase("ready");
      }
    } catch (e) {
      reportClientError("payment.confirm", e, { orderId });
      setError(e instanceof Error ? e.message : "Payment setup failed — try again.");
      setPhase("ready");
    }
  };

  if (phase === "unavailable") {
    return (
      <div>
        <div className="rounded-2xl border border-gold-deep/25 bg-gold-tint px-5 py-4 mb-6">
          <p className="text-[15px] text-ink leading-relaxed">
            <span className="font-bold">The payment form didn&apos;t load.</span>{" "}
            {error || "Something blocked it."}
          </p>
        </div>
        <p className="text-ink-soft leading-relaxed mb-6">
          Your order is saved. Try again from a different browser, or continue and we&apos;ll send a
          secure Stripe link by email so a payment method is on file before your proof review.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={() => window.location.reload()} className="btn-outline !px-6 !py-3.5">
            Try again
          </button>
          <button onClick={() => onDone(false)} className="btn-ember !px-8 !py-3.5">
            Continue to book your proof review →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-smoke rounded-2xl px-5 py-4 mb-6">
        <p className="text-[14px] text-ink leading-relaxed">
          <span className="font-bold">Nothing is charged today.</span> A payment method on file
          reserves your production slot. It&apos;s charged only after you approve your proof on
          your review call — {totalLabel}. Bank payment (ACH) has the lowest fees for orders this size.
        </p>
      </div>
      {/* Stripe owns everything inside mountRef. Keep React out of it: a
          sibling shows the loading state, otherwise Safari throws
          NotFoundError when React reconciles around Stripe's iframe. */}
      {phase === "loading" && (
        <p className="text-ink-soft text-sm py-16 text-center">Loading secure payment form…</p>
      )}
      <div ref={mountRef} className={phase === "loading" ? "min-h-0" : "min-h-[220px]"} />
      <button
        onClick={save}
        disabled={phase !== "ready"}
        className="w-full btn-ember !py-4 mt-6"
      >
        {phase === "saving" ? "Saving…" : "Save Payment Method"}
      </button>
      {error && <p className="text-xs text-red-500 mt-3 text-center">{error}</p>}
      <p className="text-[11px] text-ink-soft mt-4 text-center">
        Secured by Stripe. Card details never touch our servers.
      </p>
    </div>
  );
}
