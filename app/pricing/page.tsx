import Link from "next/link";
import Reveal from "@/components/Reveal";
import { PRODUCTS } from "@/lib/products";

export const metadata = {
  title: "Pricing | KINGBAGS",
  description: "Transparent quantity pricing for fully custom cut-and-sew bags. From 1,500 bags. No hidden fees, no distributor markup.",
};

export default function PricingPage() {
  return (
    <>
      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <Reveal>
            <p className="section-label mb-5">Pricing</p>
            <h1 className="font-serif font-black text-4xl md:text-6xl text-ink leading-[1.05] mb-6">
              Honest numbers, right up front.
            </h1>
            <p className="text-lg text-ink-soft leading-relaxed">
              Every price below is for a fully custom, edge-to-edge printed, cut-and-sewn bag — not a blank with a logo. Most orders fly air freight and land in 4–6 weeks. We&apos;re the importer of record, so customs, duties, and freight show up on one invoice with your final quote. No surprises at the port.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-5xl px-5 space-y-8">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.slug} delay={i * 100}>
              <div className="bg-white rounded-2.5xl shadow-soft overflow-hidden">
                <div className="p-8 pb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                  <div>
                    <h2 className="font-serif font-black text-3xl text-ink mb-1">{p.name}</h2>
                    <p className="text-ink-soft">{p.tagline}</p>
                  </div>
                  <div className="text-sm text-ink-soft">
                    {p.sizes.map((s) => s.label).join(" · ")} &nbsp;|&nbsp; Lead time {p.leadTime}
                  </div>
                </div>
                <div className="px-8 pb-8">
                  <div className="grid grid-cols-3 sm:grid-cols-6 rounded-2xl overflow-hidden border border-ink/10">
                    {p.tiers.map((t) => (
                      <div key={t.minQty} className="border-r border-ink/10 last:border-r-0 border-b sm:border-b-0">
                        <div className="bg-smoke px-3 py-2.5 text-center text-xs font-semibold text-ink-soft">
                          {t.minQty.toLocaleString()}+
                        </div>
                        <div className="px-3 py-3.5 text-center font-bold text-ink">
                          ${t.unitPrice.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <p className="text-sm text-ink-soft">Per-bag price. Minimum {p.minOrder.toLocaleString()} bags.</p>
                    <Link href={`/design?style=${p.slug}`} className="btn-ink !py-3 !px-7 !text-sm">
                      Design this bag
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="pb-28">
        <div className="mx-auto max-w-3xl px-5">
          <Reveal>
            <div className="bg-charcoal rounded-4xl p-10 md:p-14 text-center text-white">
              <h2 className="font-serif font-black text-3xl md:text-4xl leading-tight mb-4">
                Over 50,000 bags?
              </h2>
              <p className="text-white/65 text-lg mb-8 max-w-md mx-auto">
                Volume programs get dedicated pricing, custom construction options, ocean-freight economics, and a direct line to our team.
              </p>
              <a href="mailto:hello@kingbags.com" className="btn-light">hello@kingbags.com</a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
