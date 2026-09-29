"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase, fetchOrders, sendMagicLink, type Order } from "@/lib/supabase";
import PaymentStep from "@/components/PaymentStep";
import BookCall from "@/components/BookCall";
import Reveal from "@/components/Reveal";
import { inputCls } from "@/components/Field";

// Add or replace the payment method on an existing order, then book the
// review. Linked from the account page and the "secure link" emails.
function PaymentInner() {
  const router = useRouter();
  const params = useSearchParams();
  const orderId = params.get("order") ?? "";
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [email, setEmail] = useState("");
  const [linkSent, setLinkSent] = useState(false);
  const [cardDone, setCardDone] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setReady(true);
      return;
    }
    const load = async (u: User | null) => {
      setUser(u);
      if (u && orderId) {
        const res = await fetchOrders();
        setOrder(res.orders.find((o) => o.id === orderId) ?? null);
      }
      setReady(true);
    };
    supabase.auth.getSession().then(({ data }) => load(data.session?.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => load(s?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, [orderId]);

  if (!ready) return <div className="py-32 text-center text-ink-soft">Loading…</div>;

  return (
    <div className="mx-auto max-w-xl px-5 py-16 md:py-24">
      <Reveal>
        <p className="section-label mb-4">Your Order</p>
        {!orderId ? (
          <div>
            <h1 className="font-serif font-black text-4xl text-ink mb-5">Which order?</h1>
            <Link href="/account" className="btn-ember !px-8 !py-4">Open my account →</Link>
          </div>
        ) : !user ? (
          linkSent ? (
            <div>
              <h1 className="font-serif font-black text-4xl text-ink mb-5">Check your email.</h1>
              <p className="text-ink-soft text-lg">We sent a sign-in link to <span className="font-semibold text-ink">{email}</span>. It brings you right back here.</p>
            </div>
          ) : (
            <div>
              <h1 className="font-serif font-black text-4xl text-ink mb-5">Sign in to add your payment method.</h1>
              <input type="email" placeholder="Work email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${inputCls} mb-3`} />
              <button
                onClick={async () => { const r = await sendMagicLink(email, `/order/payment?order=${orderId}`); if (r.ok) setLinkSent(true); }}
                disabled={!email}
                className="w-full btn-ember !py-4"
              >
                Email Me a Sign-In Link
              </button>
            </div>
          )
        ) : !order ? (
          <div>
            <h1 className="font-serif font-black text-4xl text-ink mb-5">We couldn&apos;t find that order.</h1>
            <Link href="/account" className="btn-ember !px-8 !py-4">Open my account →</Link>
          </div>
        ) : cardDone || order.payment_status === "method_saved" || order.payment_status === "charged" ? (
          <div>
            <h1 className="font-serif font-black text-4xl md:text-5xl text-ink leading-[1.05] mb-5">
              {order.payment_status === "charged" ? "Paid." : "Reserved."}{" "}
              {order.review_status === "booked" || order.review_status === "done" ? "" : "Last step: your proof review."}
            </h1>
            {order.review_status === "booked" || order.review_status === "done" ? (
              <>
                <p className="text-ink-soft text-lg mb-7">Your payment method is on file and your review is booked. Nothing else is needed from you right now.</p>
                <Link href="/account" className="btn-ember !px-8 !py-4">Open my account →</Link>
              </>
            ) : (
              <>
                <p className="text-ink-soft text-lg leading-relaxed mb-7">
                  Your order isn&apos;t final until a fifteen-minute review with a specialist. Pick a time and we&apos;ll put your proof on screen.
                </p>
                <BookCall
                  email={user.email}
                  name={order.company}
                  summary={`${order.product_name} · ${order.quantity.toLocaleString()} bags`}
                  value={Math.round(Number(order.total_price))}
                  orderId={order.id}
                  onBooked={() => router.push("/account")}
                />
              </>
            )}
          </div>
        ) : (
          <div>
            <h1 className="font-serif font-black text-4xl md:text-5xl text-ink leading-[1.05] mb-5">
              Reserve your production slot.
            </h1>
            <p className="text-ink-soft text-lg leading-relaxed mb-3">
              {order.product_name} · {order.quantity.toLocaleString()} bags
            </p>
            <p className="text-ink-soft leading-relaxed mb-7">
              A payment method on file holds your place in the factory queue. Nothing is charged until you approve your proof on your review call.
            </p>
            <PaymentStep
              orderId={order.id}
              totalLabel={`$${Number(order.total_price).toLocaleString(undefined, { maximumFractionDigits: 0 })} when your proof is approved`}
              onDone={() => setCardDone(true)}
            />
          </div>
        )}
      </Reveal>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="py-32 text-center text-ink-soft">Loading…</div>}>
      <PaymentInner />
    </Suspense>
  );
}
