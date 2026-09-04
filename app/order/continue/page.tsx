"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import {
  supabase,
  sendMagicLink,
  createOrder,
  readPendingOrder,
  clearPendingOrder,
  PendingOrder,
} from "@/lib/supabase";
import { track } from "@/lib/track";
import Reveal from "@/components/Reveal";

const inputCls =
  "w-full rounded-xl px-4 py-3.5 bg-smoke text-ink placeholder:text-ink-soft/60 border border-transparent focus:border-ember focus:outline-none";

function OrderSummary({ p }: { p: PendingOrder }) {
  return (
    <div className="bg-smoke rounded-2xl p-5 mb-6">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <p className="font-semibold text-ink">{p.product_name}</p>
          <p className="text-sm text-ink-soft mt-0.5">
            {p.quantity.toLocaleString()} bags × ${p.unit_price.toFixed(2)}
          </p>
        </div>
        <p className="font-serif font-black text-2xl text-ink">
          ${p.total_price.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </p>
      </div>
      <p className="text-[12px] text-ink-soft mt-3 border-t border-ink/10 pt-3">
        Nothing is charged now. Your art goes to review first, and payment only happens after
        you approve your proof.
      </p>
    </div>
  );
}

export default function ContinueOrderPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [pending, setPending] = useState<PendingOrder | null>(null);

  // sign-in step
  const [email, setEmail] = useState("");
  const [linkSent, setLinkSent] = useState(false);
  const [sending, setSending] = useState(false);

  // details step
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [shipName, setShipName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [postal, setPostal] = useState("");
  const [billingSame, setBillingSame] = useState(true);
  const [billingName, setBillingName] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const p = readPendingOrder();
    setPending(p);
    if (p) {
      setEmail(p.email);
      setCompany(p.company ?? "");
      setPhone(p.phone ?? "");
    }
    if (!supabase) {
      setReady(true);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setReady(true);
    });
    // The magic link can land in this same tab — pick the session up live.
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Signed in with nothing to place → the account page is the destination.
  useEffect(() => {
    if (ready && user && !pending) router.replace("/account");
  }, [ready, user, pending, router]);

  const handleSendLink = async () => {
    if (!email || sending) return;
    setSending(true);
    setError(null);
    const res = await sendMagicLink(email, "/order/continue");
    setSending(false);
    if (res.ok) setLinkSent(true);
    else setError(res.error || "Couldn't send the sign-in link.");
  };

  const detailsValid =
    company.trim() && shipName.trim() && address1.trim() && city.trim() &&
    stateCode.trim() && postal.trim() &&
    (billingSame || (billingName.trim() && billingEmail.trim()));

  const handlePlace = async () => {
    if (!user || !pending || !detailsValid || placing) return;
    setPlacing(true);
    setError(null);
    const res = await createOrder({
      user_id: user.id,
      product_slug: pending.product_slug,
      product_name: pending.product_name,
      quantity: pending.quantity,
      unit_price: pending.unit_price,
      total_price: pending.total_price,
      art_filename: pending.art_filename,
      email: user.email ?? pending.email,
      phone: phone || undefined,
      company: company.trim(),
      ship_name: shipName.trim(),
      ship_address1: address1.trim(),
      ship_address2: address2.trim() || undefined,
      ship_city: city.trim(),
      ship_state: stateCode.trim(),
      ship_postal: postal.trim(),
      billing_name: billingSame ? undefined : billingName.trim(),
      billing_email: billingSame ? undefined : billingEmail.trim(),
    });
    setPlacing(false);
    if (res.ok) {
      track("order_placed", { product: pending.product_slug, quantity: pending.quantity, value: Math.round(pending.total_price) });
      clearPendingOrder();
      router.push("/account?placed=1");
    } else {
      setError(res.error || "Couldn't place the order. Please try again.");
    }
  };

  if (!ready) {
    return <div className="py-32 text-center text-ink-soft">Loading…</div>;
  }

  return (
    <div className="mx-auto max-w-xl px-5 py-16 md:py-24">
      <Reveal>
        <p className="section-label mb-4">Your Order</p>

        {!pending ? (
          <div>
            <h1 className="font-serif font-black text-4xl md:text-5xl text-ink leading-[1.05] mb-5">
              Start with a quote.
            </h1>
            <p className="text-ink-soft text-lg leading-relaxed mb-8">
              Price your bag in the studio first — then continue here to place the order.
            </p>
            <Link href="/design" className="btn-ember !px-8 !py-4">Open the Studio →</Link>
          </div>
        ) : !user ? (
          linkSent ? (
            <div>
              <h1 className="font-serif font-black text-4xl md:text-5xl text-ink leading-[1.05] mb-5">
                Check your email.
              </h1>
              <p className="text-ink-soft text-lg leading-relaxed mb-4">
                We sent a sign-in link to <span className="font-semibold text-ink">{email}</span>.
                Click it and you&apos;ll land right back here to finish your order.
              </p>
              <p className="text-sm text-ink-soft">
                No email after a minute? Check spam, or{" "}
                <button onClick={() => setLinkSent(false)} className="text-ember font-semibold hover:underline">
                  try a different address
                </button>.
              </p>
            </div>
          ) : (
            <div>
              <h1 className="font-serif font-black text-4xl md:text-5xl text-ink leading-[1.05] mb-5">
                Save your order to an account.
              </h1>
              <p className="text-ink-soft text-lg leading-relaxed mb-7">
                One click, no password. We&apos;ll email you a sign-in link — your quote,
                artwork, and order status all live in your account from here on.
              </p>
              <OrderSummary p={pending} />
              <input
                type="email" placeholder="Work email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${inputCls} mb-3`}
              />
              <button onClick={handleSendLink} disabled={!email || sending} className="w-full btn-ember !py-4">
                {sending ? "Sending…" : "Email Me a Sign-In Link"}
              </button>
              {error && <p className="text-xs text-red-500 mt-3 text-center">{error}</p>}
            </div>
          )
        ) : (
          <div>
            <h1 className="font-serif font-black text-4xl md:text-5xl text-ink leading-[1.05] mb-5">
              Where do the bags go?
            </h1>
            <p className="text-ink-soft text-lg leading-relaxed mb-7">
              Last step. We collect everything now so once your art is approved, nothing
              slows the order down.
            </p>
            <OrderSummary p={pending} />

            <div className="space-y-3">
              <input type="text" placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} className={inputCls} />
              <input type="tel" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} />

              <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-ink-soft pt-3">Ship to</p>
              <input type="text" placeholder="Recipient name" value={shipName} onChange={(e) => setShipName(e.target.value)} className={inputCls} />
              <input type="text" placeholder="Street address" value={address1} onChange={(e) => setAddress1(e.target.value)} className={inputCls} />
              <input type="text" placeholder="Suite, unit, dock (optional)" value={address2} onChange={(e) => setAddress2(e.target.value)} className={inputCls} />
              <div className="grid grid-cols-[1fr_80px_110px] gap-3">
                <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className={inputCls} />
                <input type="text" placeholder="State" value={stateCode} onChange={(e) => setStateCode(e.target.value)} className={inputCls} />
                <input type="text" placeholder="ZIP" value={postal} onChange={(e) => setPostal(e.target.value)} className={inputCls} />
              </div>

              <label className="flex items-center gap-2.5 pt-3 text-[15px] text-ink cursor-pointer">
                <input
                  type="checkbox" checked={billingSame}
                  onChange={(e) => setBillingSame(e.target.checked)}
                  className="w-4 h-4 accent-ember"
                />
                Billing contact is the same as me
              </label>
              {!billingSame && (
                <>
                  <input type="text" placeholder="Billing contact name" value={billingName} onChange={(e) => setBillingName(e.target.value)} className={inputCls} />
                  <input type="email" placeholder="Billing email" value={billingEmail} onChange={(e) => setBillingEmail(e.target.value)} className={inputCls} />
                </>
              )}
            </div>

            <button onClick={handlePlace} disabled={!detailsValid || placing} className="w-full btn-ember !py-4 mt-6">
              {placing ? "Placing…" : "Place My Order"}
            </button>
            {error && <p className="text-xs text-red-500 mt-3 text-center">{error}</p>}
            <p className="text-[12px] text-ink-soft mt-4 text-center leading-relaxed">
              Placing your order starts art review — it does not charge you. Payment happens
              only after you approve your proof.
            </p>
          </div>
        )}
      </Reveal>
    </div>
  );
}
