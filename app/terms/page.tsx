import type { Metadata } from "next";
import "../legal.css";

export const metadata: Metadata = {
  title: "Terms of Service | KINGBAGS",
  description: "The terms that govern quotes, orders, and production with KINGBAGS.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16 md:py-24 legal">
      <p className="section-label mb-4">Legal</p>
      <h1 className="font-serif font-black text-4xl md:text-5xl text-ink leading-[1.05] mb-3">
        Terms of Service
      </h1>
      <p className="!text-ink-soft text-sm mb-2">Last updated: September 7, 2026</p>
      <p>
        These terms govern your use of kingbags.co and your orders with KINGBAGS, a brand of
        King Universal Inc. (&quot;we,&quot; &quot;us&quot;). By placing an order you agree to
        them. They&apos;re written to be read — if anything is unclear, email us before you
        order.
      </p>

      <h2>Quotes and pricing</h2>
      <p>
        Studio pricing is an instant estimate based on the product, size, and quantity you
        configure. Your final price is confirmed with your proof before anything is charged.
        Quotes don&apos;t include taxes or duties where applicable, and unusual artwork,
        materials, or shipping requirements can change pricing — we&apos;ll always tell you
        before you approve.
      </p>

      <h2>Artwork and proofs</h2>
      <ul>
        <li>
          You confirm you own or are licensed to use all artwork you upload, and that it
          doesn&apos;t infringe anyone&apos;s rights. You keep ownership of your artwork; you
          grant us the license needed to produce your order.
        </li>
        <li>
          Every order gets a proof. Production does not start until you approve it. Once you
          approve a proof, you&apos;re approving exactly what will be made — check spelling,
          colors, and layout carefully.
        </li>
        <li>
          Printed colors can vary slightly from screens. We match as closely as commercial
          printing on fabric allows.
        </li>
      </ul>

      <h2>Payment</h2>
      <p>
        Payment details are collected when you place your order, but you are not charged until
        you approve your proof. By approving your proof you authorize the charge for your
        order. Payments are processed by Stripe; your card statement will show KINGBAGS.
      </p>

      <h2>Production and delivery</h2>
      <p>
        Custom manufacturing runs on estimates, not guarantees: typical door-to-door time is
        4–6 weeks from proof approval, and we&apos;ll tell you promptly if your order will run
        long. Delivery dates aren&apos;t a basis for cancellation unless we miss them by an
        unreasonable margin. Risk of loss passes on delivery to your address.
      </p>

      <h2>Samples</h2>
      <p>
        Sample kit fees are credited in full toward the order they precede. Samples are
        representative of construction and materials; minor variation between a sample and a
        production run is normal.
      </p>

      <h2>Cancellations, changes, and issues</h2>
      <ul>
        <li>Before proof approval: cancel any time, no charge.</li>
        <li>
          After proof approval: your order is in production and generally can&apos;t be
          cancelled or changed. Contact us immediately and we&apos;ll do what&apos;s possible.
        </li>
        <li>
          Because every order is custom-made to your approved proof, returns aren&apos;t
          accepted for preference reasons. If your bags arrive defective, damaged, or not
          matching your approved proof, tell us within 14 days of delivery with photos and
          we&apos;ll make it right — remake, replacement, or refund of the affected units.
        </li>
      </ul>

      <h2>Acceptable use</h2>
      <p>
        We decline artwork we&apos;re not able to produce: content that infringes trademarks or
        copyrights you don&apos;t hold, or unlawful content. If artwork is declined, nothing is
        charged.
      </p>

      <h2>Liability</h2>
      <p>
        To the fullest extent allowed by law, our total liability for any order is limited to
        the amount you paid for that order, and we aren&apos;t liable for indirect or
        consequential damages (like lost profits from a delayed campaign). Nothing here limits
        liability that can&apos;t be limited by law.
      </p>

      <h2>General</h2>
      <p>
        These terms are governed by the laws of North Carolina. If a court finds part of them
        unenforceable, the rest stands. We may update these terms; the version posted when you
        place an order is the one that applies to it.
      </p>

      <h2>Contact</h2>
      <p>
        King Universal Inc. (d/b/a KINGBAGS), Raleigh, North Carolina ·{" "}
        <a href="mailto:hello@kingbags.co">hello@kingbags.co</a>
      </p>
    </div>
  );
}
