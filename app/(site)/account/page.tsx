"use client";
import { useCallback, useEffect, useMemo, useState, Suspense } from "react";
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
import { CONTACT_EMAIL, CTA } from "@/lib/site";

// Customer account. Sign in by magic link; then every order as a card with
// one clear next step, plus a banner for whatever the whole account needs
// most (finish an unfinished order, add a card, book the review).

const hasCard = (o: Order) => o.payment_status === "method_saved" || o.payment_status === "charged";
const isOpen = (o: Order) => o.status !== "in_production" && o.status !== "shipped";

function AccountInner() {
  const params = useSearchParams();
  const justPlaced = params.get("placed") === "1";
  const afterBank = params.get("review") === "1";

  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [events, setEvents] = useState<OrderEvent[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [hasPending, setHasPending] = useState(false);

  const [email, setEmail] = useState("");
  const [linkSent, setLinkSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);

  useEffect(() => {
    setHasPending(Boolean(readPendingOrder()));
    if (!supabase) { setReady(true); return; }
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  const loadOrders = useCallback(() => {
    fetchOrders().then(async (res) => {
      if (!res.ok) { setLoadError(res.error ?? "Couldn't load your orders."); setLoaded(true); return; }
      setLoadError(null);
      setOrders(res.orders);
      setEvents(await fetchOrderEvents(res.orders.map((o) => o.id)));
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!user) { setOrders([]); setEvents([]); setLoaded(false); return; }
    loadOrders();
  }, [user, loadOrders]);

  // Refresh when the tab regains focus (they come back from Calendly or Stripe).
  useEffect(() => {
    if (!user) return;
    const onFocus = () => loadOrders();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
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

  // The one thing the account needs most right now.
  const banner = useMemo(() => {
    const open = orders.filter(isOpen);
    const noCard = open.find((o) => !hasCard(o) && o.payment_status !== "failed");
    const failed = open.find((o) => o.payment_status === "failed");
    const noCall = open.find((o) => hasCard(o) && o.review_status === "needed");
    if (failed) return { tone: "gold" as const, title: "A payment didn't go through.", body: "Your bank declined the charge. Add a different card or bank account and we'll re-run it today.", cta: { label: "Update payment method", href: `/order/payment?order=${failed.id}` } };
    if (noCard) return { tone: "gold" as const, title: "Your slot isn't reserved yet.", body: `Add a payment method to hold production for ${noCard.company}'s ${noCard.quantity.toLocaleString()} bags. Nothing is charged until you approve your proof on the call.`, cta: { label: "Add payment method", href: `/order/payment?order=${noCard.id}` } };
    if (noCall) return { tone: "ember" as const, title: justPlaced ? "Reserved. One step left." : "One step left: book your proof review.", body: `${noCall.company}'s order isn't final until we walk through the proof together. Fifteen minutes, your pick of time.`, cta: { label: CTA.book, href: `/talk?order=${noCall.id}&email=${encodeURIComponent(noCall.email)}&name=${encodeURIComponent(noCall.company)}&q=${encodeURIComponent(`${noCall.product_name} · ${noCall.quantity.toLocaleString()} bags`)}` } };
    if (justPlaced || afterBank) return { tone: "ember" as const, title: "You're all set.", body: "Slot reserved and review booked. We're building your proof now and will email you the moment it's ready. This page always shows where things stand." };
    return null;
  }, [orders, justPlaced, afterBank]);

  const sorted = useMemo(() => {
    // Open orders first, newest first; shipped sinks to the bottom.
    return [...orders].sort((a, b) => Number(isOpen(b)) - Number(isOpen(a)) || new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [orders]);

  if (!ready) return <div className="py-32 text-center text-ink-soft">Loading…</div>;

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
                  <h1 className="font-serif font-black text-3xl text-ink leading-[1.05] mb-4">Check your email.</h1>
                  <p className="text-ink-soft leading-relaxed">
                    We sent a sign-in link to <span className="font-semibold text-ink">{email}</span>. Click it and your orders will be right here.
                  </p>
                  <p className="text-[13px] text-ink-soft mt-5">
                    Nothing after a minute? Check spam, or{" "}
                    <button onClick={() => setLinkSent(false)} className="text-ember font-semibold hover:underline">try again</button>.
                  </p>
                </>
              ) : (
                <>
                  <p className="section-label mb-4">Your Account</p>
                  <h1 className="font-serif font-black text-3xl md:text-4xl text-ink leading-[1.05] mb-3">Sign in to your orders.</h1>
                  <p className="text-ink-soft leading-relaxed mb-7">No password. We email you a one-click sign-in link.</p>
                  <input
                    type="email" placeholder="Work email" value={email} autoComplete="email"
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
              No orders yet? <Link href="/design" className="text-ember font-semibold hover:underline">Price your bag in the studio</Link>
            </p>
          </Reveal>
        </div>
      </div>
    );
  }

  /* ---------- signed in ---------- */
  const openCount = orders.filter(isOpen).length;
  return (
    <div className="bg-smoke min-h-[70vh]">
      <div className="mx-auto max-w-3xl px-5 py-12 md:py-16">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <p className="section-label mb-3">Your Account</p>
              <h1 className="font-serif font-black text-4xl md:text-5xl text-ink leading-[1.05]">
                {orders.length === 0 ? "Your orders." : openCount === 1 ? "One order in motion." : openCount > 1 ? `${openCount} orders in motion.` : "Your orders."}
              </h1>
              <p className="text-ink-soft text-[15px] mt-2">{user.email}</p>
            </div>
            <button onClick={() => signOut()} className="text-[13px] font-semibold text-ink-soft hover:text-ink px-4 py-2 rounded-full border border-ink/15 hover:border-ink/30 transition-colors">
              Sign out
            </button>
          </div>

          {/* With a single order the card's own next-step box says the same thing, so only
              show the account-level banner when there are several orders or it's a celebration. */}
          {banner && (orders.length > 1 || !banner.cta) && (
            <div className={`rounded-2.5xl px-6 py-5 mb-6 shadow-soft flex flex-col sm:flex-row sm:items-center sm:justify-between gap-x-6 gap-y-4 ${banner.tone === "ember" ? "bg-ember text-white" : "bg-gold-tint border border-gold-deep/25 text-ink"}`}>
              <div className="min-w-0 sm:flex-1">
                <p className="font-serif font-bold text-[19px] leading-tight">{banner.title}</p>
                <p className={`text-[14px] leading-relaxed mt-1 ${banner.tone === "ember" ? "text-white/85" : "text-ink-soft"}`}>{banner.body}</p>
              </div>
              {banner.cta && (
                <Link href={banner.cta.href} className={`sm:shrink-0 !py-3 !px-6 !text-[14px] ${banner.tone === "ember" ? "btn-light" : "btn-ember"}`}>{banner.cta.label}</Link>
              )}
            </div>
          )}

          {hasPending && (
            <div className="bg-white border border-ink/10 rounded-2.5xl px-6 py-5 mb-6 flex flex-wrap items-center justify-between gap-4">
              <p className="text-ink text-[15px]">
                <span className="font-bold">You have an unfinished order.</span> Your quote is saved and ready to place.
              </p>
              <Link href="/order/continue" className="btn-ember !py-2.5 !px-5 !text-[14px] shrink-0">Continue your order →</Link>
            </div>
          )}

          {loadError && (
            <div className="bg-white rounded-2.5xl border border-ink/10 p-6 mb-6">
              <p className="text-ink-soft text-sm">
                We couldn&apos;t load your orders just now.{" "}
                <button onClick={loadOrders} className="font-semibold text-ember hover:underline">Try again</button>, or email{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold underline">{CONTACT_EMAIL}</a>.
              </p>
            </div>
          )}

          {!loaded && !loadError ? (
            <div className="space-y-5">
              {[0, 1].map((i) => <div key={i} className="bg-white rounded-2.5xl border border-ink/10 h-56 animate-pulse" />)}
            </div>
          ) : orders.length === 0 && !loadError ? (
            <div className="bg-white rounded-2.5xl border border-ink/10 shadow-soft p-10 md:p-14 text-center">
              <h2 className="font-serif font-bold text-2xl md:text-3xl text-ink mb-3">Nothing here yet.</h2>
              <p className="text-ink-soft leading-relaxed mb-8 max-w-sm mx-auto">
                Price your bag in the studio. It takes about two minutes, and your quote saves right here.
              </p>
              <Link href="/design" className="btn-ember !px-9 !py-4">{CTA.primary} →</Link>
            </div>
          ) : (
            <div className="space-y-5">
              {sorted.map((o) => (
                <OrderCard key={o.id} order={o} events={events.filter((e) => e.order_id === o.id)} onChanged={loadOrders} />
              ))}
            </div>
          )}

          <div className="mt-10 bg-white rounded-2.5xl border border-ink/10 px-6 py-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-ink text-[15px]">Questions about an order?</p>
              <p className="text-[13px] text-ink-soft mt-0.5">A real person answers, usually within the hour on business days.</p>
            </div>
            <div className="flex gap-2.5 flex-wrap">
              <a href={`mailto:${CONTACT_EMAIL}`} className="btn-outline !py-2.5 !px-5 !text-[13px]">Email us</a>
              <Link href={`/talk?email=${encodeURIComponent(user.email ?? "")}`} className="btn-ink !py-2.5 !px-5 !text-[13px]">{CTA.talk}</Link>
            </div>
          </div>
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
