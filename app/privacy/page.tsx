import type { Metadata } from "next";
import "../legal.css";

export const metadata: Metadata = {
  title: "Privacy Policy | KINGBAGS",
  description: "How KINGBAGS collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16 md:py-24 legal">
      <p className="section-label mb-4">Legal</p>
      <h1 className="font-serif font-black text-4xl md:text-5xl text-ink leading-[1.05] mb-3">
        Privacy Policy
      </h1>
      <p className="!text-ink-soft text-sm mb-2">Last updated: September 7, 2026</p>
      <p>
        KINGBAGS is a brand of King Universal Inc. (&quot;we,&quot; &quot;us&quot;). This policy
        explains what information we collect when you use kingbags.co, and what we do with it.
        The short version: we collect what we need to price, produce, and deliver your bags —
        and nothing gets sold to anyone.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Contact and company details</strong> — name, work email, phone, company name,
          and shipping/billing addresses you provide when requesting a quote, ordering, or
          requesting samples.
        </li>
        <li>
          <strong>Order details</strong> — the products, quantities, sizes, and pricing you
          configure, and the artwork files you upload for production.
        </li>
        <li>
          <strong>Payment information</strong> — handled by Stripe, our payment processor. Card
          and bank details go directly to Stripe; we never see or store full card numbers on
          our systems.
        </li>
        <li>
          <strong>Usage data</strong> — standard analytics (pages visited, approximate location,
          device type) via Google Analytics, used to understand how the site performs.
        </li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To prepare quotes, proofs, and samples you request</li>
        <li>To produce and ship your order, and keep you updated on its status</li>
        <li>To charge payment you have authorized, after you approve your proof</li>
        <li>To respond when you contact us</li>
        <li>To improve the site and our marketing</li>
      </ul>

      <h2>Who we share it with</h2>
      <p>
        Only the service providers it takes to run the business: our hosting and database
        providers (Vercel, Supabase), payment processor (Stripe), email provider, analytics
        (Google), and — for orders in production — the manufacturing partners who need your
        artwork and shipping details to make and deliver your bags. Each receives only what it
        needs. We do not sell or rent your information to anyone.
      </p>

      <h2>Retention and security</h2>
      <p>
        We keep order records as long as needed for business and legal purposes. Artwork and
        quote data for orders that never proceed may be deleted periodically. Data is stored
        with providers using industry-standard encryption in transit and at rest.
      </p>

      <h2>Your choices</h2>
      <p>
        You can ask us to access, correct, or delete the personal information we hold about you
        by emailing <a href="mailto:hello@kingbags.co">hello@kingbags.co</a>. We&apos;ll act on
        legitimate requests within a reasonable time, subject to records we must keep (e.g.
        completed transactions).
      </p>

      <h2>Cookies</h2>
      <p>
        We use minimal cookies and browser storage: what&apos;s needed for signing in to your
        account, remembering an in-progress order, and analytics. We don&apos;t run third-party
        advertising cookies on the site.
      </p>

      <h2>Contact</h2>
      <p>
        King Universal Inc. (d/b/a KINGBAGS), Raleigh, North Carolina ·{" "}
        <a href="mailto:hello@kingbags.co">hello@kingbags.co</a>
      </p>
      <p>
        If we change this policy in a way that matters, we&apos;ll update the date above and,
        for significant changes, note it on the site.
      </p>
    </div>
  );
}
