"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import {
  supabase,
  sendMagicLink,
  signOut,
  fetchOrders,
  fetchOrderEvents,
  Order,
  OrderEvent,
} from "@/lib/supabase";
import { STAGES, stageIndex, needsAttention, statusLabel, statusBlurb } from "@/lib/stages";
import Reveal from "@/components/Reveal";

function StageTimeline({ order }: { order: Order }) {
  const idx = stageIndex(order.status);
  const attention = needsAttention(order.status);
  return (
    <div className="flex items-start" aria-label={`Order progress: ${statusLabel(order.status)}`}>
      {STAGES.map((label, i) => {
        const done = i < idx || order.status === "shipped";
        const current = i === idx && order.status !== "shipped";
        return (
          <div key={label} className="flex-1 flex flex-col items-center relative">
            {/* connector */}
            {i > 0 && (
              <div
                className={`absolute top-[13px] right-1/2 w-full h-[2px] ${
                  i <= idx ? "bg-ember" : "bg-ink/10"
                }`}
              />
            )}
            <div
              className={`relative z-10 w-[27px] h-[27px] rounded-full flex items-center justify-center text-[13px] font-bold border-2 ${
                done
                  ? "bg-ember border-ember text-white"
                  : current
                    ? attention
                      ? "bg-gold border-gold text-white"
                      : "bg-white border-ember text-ember"
                    : "bg-white border-ink/15 text-ink/25"
              }`}
            >
              {done ? "✓" : current && attention ? "!" : i + 1}
            </div>
            <span
              className={`mt-2 text-[10px] sm:text-[12px] font-semibold text-center leading-tight px-0.5 ${
                done || current ? "text-ink" : "text-ink/35"
              }`}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ order, events }: { order: Order; events: OrderEvent[] }) {
  const attention = needsAttention(order.status);
  const placed = new Date(order.created_at).toLocaleDateString(undefined, {
    month: "short", day: "numeric", year: "numeric",
  });
  return (
    <div className="bg-white rounded-2.5xl border border-ink/10 p-6 md:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 mb-6">
        <div>
          <h2 className="font-serif font-bold text-xl md:text-2xl text-ink">{order.product_name}</h2>
          <p className="text-sm text-ink-soft mt-1">
            {order.quantity.toLocaleString()} bags · placed {placed}
          </p>
        </div>
        <p className="font-serif font-black text-2xl md:text-3xl text-ink">
          ${Number(order.total_price).toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </p>
      </div>

      <StageTimeline order={order} />

      <div className={`mt-6 rounded-2xl px-5 py-4 ${attention ? "bg-gold-tint" : "bg-smoke"}`}>
        <p className="text-[15px] text-ink leading-relaxed">
          <span className="font-bold">{statusLabel(order.status)}.</span>{" "}
          {statusBlurb(order.status)}
        </p>
      </div>

      <div className="mt-5 text-[13px] text-ink-soft flex flex-wrap gap-x-6 gap-y-1">
        <span>
          Ships to: {order.ship_name}, {order.ship_city}, {order.ship_state}
        </span>
        <span>{order.company}</span>
      </div>

      {events.length > 0 && (
        <details className="mt-4 group">
          <summary className="text-[13px] font-semibold text-ember cursor-pointer hover:underline list-none">
            Order history ({events.length})
          </summary>
          <ul className="mt-3 space-y-2 border-l-2 border-ink/10 pl-4">
            {events.map((e) => (
              <li key={e.id} className="text-[13px] text-ink-soft">
                <span className="text-ink font-semibold">
                  {e.status ? statusLabel(e.status) : e.event.replace(/_/g, " ")}
                </span>{" "}
                — {new Date(e.created_at).toLocaleString(undefined, {
                  month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
                })}
                {e.note && <span className="block text-ink-soft/80">{e.note}</span>}
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}

function AccountInner() {
  const params = useSearchParams();
  const justPlaced = params.get("placed") === "1";

  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [events, setEvents] = useState<OrderEvent[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [linkSent, setLinkSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);

  useEffect(() => {
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

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setEvents([]);
      return;
    }
    fetchOrders().then(async (res) => {
      if (!res.ok) {
        setLoadError(res.error ?? "Couldn't load your orders.");
        return;
      }
      setLoadError(null);
      setOrders(res.orders);
      setEvents(await fetchOrderEvents(res.orders.map((o) => o.id)));
    });
  }, [user]);

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

  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-5 py-16 md:py-24">
        <Reveal>
          <p className="section-label mb-4">Your Account</p>
          {linkSent ? (
            <>
              <h1 className="font-serif font-black text-4xl md:text-5xl text-ink leading-[1.05] mb-5">
                Check your email.
              </h1>
              <p className="text-ink-soft text-lg leading-relaxed">
                We sent a sign-in link to <span className="font-semibold text-ink">{email}</span>.
                Click it and your orders will be right here.
              </p>
            </>
          ) : (
            <>
              <h1 className="font-serif font-black text-4xl md:text-5xl text-ink leading-[1.05] mb-5">
                Sign in to your orders.
              </h1>
              <p className="text-ink-soft text-lg leading-relaxed mb-7">
                No password — we email you a one-click sign-in link.
              </p>
              <input
                type="email" placeholder="Work email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl px-4 py-3.5 mb-3 bg-smoke text-ink placeholder:text-ink-soft/60 border border-transparent focus:border-ember focus:outline-none"
              />
              <button onClick={handleSendLink} disabled={!email || sending} className="w-full btn-ember !py-4">
                {sending ? "Sending…" : "Email Me a Sign-In Link"}
              </button>
              {signInError && <p className="text-xs text-red-500 mt-3 text-center">{signInError}</p>}
              <p className="text-sm text-ink-soft mt-6 text-center">
                No orders yet?{" "}
                <Link href="/design" className="text-ember font-semibold hover:underline">
                  Price your bag in the studio
                </Link>
              </p>
            </>
          )}
        </Reveal>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-14 md:py-20">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4 mb-3">
          <div>
            <p className="section-label mb-3">Your Account</p>
            <h1 className="font-serif font-black text-4xl md:text-5xl text-ink leading-[1.05]">
              Your orders.
            </h1>
          </div>
          <button onClick={() => signOut()} className="text-sm font-semibold text-ink-soft hover:text-ink underline underline-offset-4">
            Sign out
          </button>
        </div>
        <p className="text-ink-soft mb-8">{user.email}</p>

        {justPlaced && (
          <div className="bg-ember-tint rounded-2.5xl p-6 mb-8">
            <p className="text-ink leading-relaxed">
              <span className="font-bold">Order placed.</span> Your artwork is headed into
              review. We&apos;ll email you at every step — and this page always shows exactly
              where your order stands.
            </p>
          </div>
        )}

        {loadError && (
          <div className="bg-smoke rounded-2.5xl p-6 mb-8">
            <p className="text-ink-soft text-sm">
              We couldn&apos;t load your orders just now. Refresh to try again, or email{" "}
              <a href="mailto:hello@kingbags.com" className="font-semibold underline">hello@kingbags.com</a>.
            </p>
          </div>
        )}

        {orders.length === 0 && !loadError ? (
          <div className="bg-white rounded-2.5xl border border-ink/10 p-10 text-center">
            <h2 className="font-serif font-bold text-2xl text-ink mb-3">No orders yet.</h2>
            <p className="text-ink-soft mb-7">
              Price your bag in the studio — it takes about two minutes.
            </p>
            <Link href="/design" className="btn-ember !px-8 !py-4">Open the Studio →</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((o) => (
              <OrderCard key={o.id} order={o} events={events.filter((e) => e.order_id === o.id)} />
            ))}
          </div>
        )}
      </Reveal>
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
