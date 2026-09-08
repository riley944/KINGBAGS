"use client";
import { useCallback, useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import {
  supabase,
  sendMagicLink,
  signOut,
  fetchOrders,
  fetchOrderEvents,
  readPendingOrder,
  Order,
  OrderEvent,
} from "@/lib/supabase";
import OrderCard from "@/components/OrderCard";
import Reveal from "@/components/Reveal";

function AccountInner() {
  const params = useSearchParams();
  const justPlaced = params.get("placed") === "1";

  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [events, setEvents] = useState<OrderEvent[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [hasPending, setHasPending] = useState(false);

  const [email, setEmail] = useState("");
  const [linkSent, setLinkSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);

  useEffect(() => {
    setHasPending(Boolean(readPendingOrder()));
    if (!supabase) {
      setReady(true);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const loadOrders = useCallback(() => {
    fetchOrders().then(async (res) => {
      if (!res.ok) {
        setLoadError(res.error ?? "Couldn't load your orders.");
        return;
      }
      setLoadError(null);
      setOrders(res.orders);
      setEvents(await fetchOrderEvents(res.orders.map((o) => o.id)));
    });
  }, []);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setEvents([]);
      return;
    }
    loadOrders();
  }, [user, loadOrders]);

  const handleSendLink = async () => {
    if (!email || sending) return;
    setSending(true);
    setSignInError(null);
    const res = await sendMagicLink(email, "/account");
    setSending(false);
    if (res.ok) setLinkSent(true);
    else setSignInError(res.error || "Couldn't send the sign-in link.");
  };

  if (!ready) {
    return <div className="py-32 text-center text-ink-soft">Loading…</div>;
  }

  /* ---------- signed out ---------- */
  if (!user) {
    return (
      <div className="bg-smoke min-h-[70vh] py-16 md:py-24">
        <div className="mx-auto max-w-md px-5">
          <Reveal>
            <div className="bg-white rounded-2.5xl border border-ink/10 shadow-soft p-8 md:p-10">
              {linkSent ? (
                <>
                  <div className="w-12 h-12 rounded-full bg-ember-tint flex items-center justify-center text-xl mb-5">✉️</div>
                  <h1 className="font-serif font-black text-3xl text-ink leading-[1.05] mb-4">
                    Check your email.
                  </h1>
                  <p className="text-ink-soft leading-relaxed">
                    We sent a sign-in link to{" "}
                    <span className="font-semibold text-ink">{email}</span>. Click it and your
                    orders will be right here.
                  </p>
                  <p className="text-[13px] text-ink-soft mt-5">
                    Nothing after a minute? Check spam, or{" "}
                    <button onClick={() => setLinkSent(false)} className="text-ember font-semibold hover:underline">
                      try again
                    </button>.
                  </p>
                </>
              ) : (
                <>
                  <p className="section-label mb-4">Your Account</p>
                  <h1 className="font-serif font-black text-3xl md:text-4xl text-ink leading-[1.05] mb-3">
                    Sign in to your orders.
                  </h1>
                  <p className="text-ink-soft leading-relaxed mb-7">
                    No password — we email you a one-click sign-in link.
                  </p>
                  <input
                    type="email" placeholder="Work email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendLink()}
                    className="w-full rounded-xl px-4 py-3.5 mb-3 bg-smoke text-ink placeholder:text-ink-soft/60 border border-transparent focus:border-ember focus:outline-none"
                  />
                  <button onClick={handleSendLink} disabled={!email || sending} className="w-full btn-ember !py-4">
                    {sending ? "Sending…" : "Email Me a Sign-In Link"}
                  </button>
                  {signInError && <p className="text-xs text-red-500 mt-3">{signInError}</p>}
                </>
              )}
            </div>
            <p className="text-sm text-ink-soft mt-6 text-center">
              No orders yet?{" "}
              <Link href="/design" className="text-ember font-semibold hover:underline">
                Price your bag in the studio
              </Link>
            </p>
          </Reveal>
        </div>
      </div>
    );
  }

  /* ---------- signed in ---------- */
  return (
    <div className="bg-smoke min-h-[70vh]">
      <div className="mx-auto max-w-3xl px-5 py-12 md:py-16">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4 mb-2">
            <div>
              <p className="section-label mb-3">Your Account</p>
              <h1 className="font-serif font-black text-4xl md:text-5xl text-ink leading-[1.05]">
                Your orders.
              </h1>
            </div>
            <button
              onClick={() => signOut()}
              className="text-[13px] font-semibold text-ink-soft hover:text-ink px-4 py-2 rounded-full border border-ink/15 hover:border-ink/30 transition-colors"
            >
              Sign out
            </button>
          </div>
          <p className="text-ink-soft text-[15px] mb-8">{user.email}</p>

          {justPlaced && (
            <div className="bg-ember text-white rounded-2.5xl px-6 py-5 mb-6 shadow-soft">
              <p className="leading-relaxed">
                <span className="font-bold">Order placed. 🎉</span> Your artwork is headed into
                review — we&apos;ll email you at every step, and this page always shows exactly
                where things stand.
              </p>
            </div>
          )}

          {hasPending && !justPlaced && (
            <div className="bg-gold-tint border border-gold-deep/25 rounded-2.5xl px-6 py-5 mb-6 flex flex-wrap items-center justify-between gap-4">
              <p className="text-ink text-[15px]">
                <span className="font-bold">You have an unfinished order.</span> Your quote is
                saved and ready to place.
              </p>
              <Link href="/order/continue" className="btn-ember !py-2.5 !px-5 !text-[14px] shrink-0">
                Continue your order →
              </Link>
            </div>
          )}

          {loadError && (
            <div className="bg-white rounded-2.5xl border border-ink/10 p-6 mb-6">
              <p className="text-ink-soft text-sm">
                We couldn&apos;t load your orders just now. Refresh to try again, or email{" "}
                <a href="mailto:hello@kingbags.co" className="font-semibold underline">hello@kingbags.co</a>.
              </p>
            </div>
          )}

          {orders.length === 0 && !loadError ? (
            <div className="bg-white rounded-2.5xl border border-ink/10 shadow-soft p-10 md:p-14 text-center">
              <h2 className="font-serif font-bold text-2xl md:text-3xl text-ink mb-3">
                Nothing here yet.
              </h2>
              <p className="text-ink-soft leading-relaxed mb-8 max-w-sm mx-auto">
                Price your bag in the studio — takes about two minutes, and your quote saves
                right here.
              </p>
              <Link href="/design" className="btn-ember !px-9 !py-4">Open the Studio →</Link>
            </div>
          ) : (
            <div className="space-y-5">
              {orders.map((o) => (
                <OrderCard
                  key={o.id}
                  order={o}
                  events={events.filter((e) => e.order_id === o.id)}
                  onChanged={loadOrders}
                />
              ))}
            </div>
          )}

          <p className="text-[13px] text-ink-soft text-center mt-10">
            Questions about an order? Email{" "}
            <a href="mailto:hello@kingbags.co" className="text-ember font-semibold hover:underline">
              hello@kingbags.co
            </a>{" "}
            — a real person answers.
          </p>
        </Reveal>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="py-32 text-center text-ink-soft">Loading…</div>}>
      <AccountInner />
    </Suspense>
  );
}
