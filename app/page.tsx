import Link from "next/link";
import { PRODUCTS } from "@/lib/products";
import SpinHero from "@/components/SpinHero";
import Reveal from "@/components/Reveal";
import BagArt from "@/components/BagArt";

const STEPS = [
  { n: "1", t: "Design it", d: "Choose your bag, download the real production template, and place your art edge to edge — every panel, every side." },
  { n: "2", t: "Price it yourself", d: "Pick your quantity and the price is right there. No quote emails, no waiting on a callback." },
  { n: "3", t: "Carry it in weeks", d: "Cut and sewn at the factories behind our national brand programs, then air freighted straight to you. Most orders land in 4–6 weeks; the industry norm for bags like these is closer to three months." },
];

const VERTICALS = ["DTC Brands", "Restaurants", "Gyms & Studios", "Breweries", "Retail", "Events"];

export default function Home() {
  const featured = PRODUCTS.filter((p) => p.featured);
  return (
    <>
      {/* HERO — copy superimposes over the spin once frames exist */}
      <section className="relative">
        <div className="mx-auto max-w-4xl px-5 pt-20 pb-8 md:pt-28 text-center relative z-10">
          <p className="section-label mb-6">Custom cut & sew · Edge-to-edge print · From 1,500 bags</p>
          <h1 className="font-serif font-black text-[44px] md:text-[74px] leading-[1.0] text-ink mb-7">
            A bag this good,<br />they'll <span className="text-ember italic">never</span> put it down.
          </h1>
          <p className="text-lg md:text-xl text-ink-soft max-w-xl mx-auto mb-10 leading-relaxed">
            Fully custom bags, built from scratch for your brand — your art covers every inch of fabric before the bag is even sewn.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <Link href="/design" className="btn-ember text-lg !px-12 !py-5">Design Your Bag</Link>
            <Link href="/products" className="btn-outline">See the lineup</Link>
          </div>
          <p className="text-sm text-ink-soft">Instant pricing · No account needed</p>
        </div>
        <div className="mx-auto max-w-5xl px-5 pb-20">
          <div className="aspect-[16/9] md:aspect-[16/8] rounded-4xl bg-smoke shadow-soft overflow-hidden">
            <SpinHero />
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="bg-charcoal text-white">
        <div className="mx-auto max-w-6xl px-5 py-5 flex flex-wrap justify-center gap-x-10 gap-y-2 text-[15px] font-medium">
          <span>The same bags we build for national brands</span>
          <span className="text-white/25">·</span>
          <span>Factory-direct pricing, no middleman markup</span>
          <span className="text-white/25">·</span>
          <span>Shipping and customs handled for you</span>
          <span className="text-white/25">·</span>
          <span>From 1,500 bags</span>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <h2 className="font-serif font-black text-4xl md:text-[50px] text-center text-ink mb-16 leading-tight">
              Design it. Price it. Carry it.
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 120}>
                <div className="bg-white rounded-2.5xl p-9 shadow-soft h-full">
                  <div className="w-12 h-12 rounded-full bg-ember-tint text-ember font-serif font-black text-2xl flex items-center justify-center mb-6">{s.n}</div>
                  <h3 className="font-bold text-2xl text-ink mb-3">{s.t}</h3>
                  <p className="text-ink-soft text-[16px] leading-relaxed">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* THE LINEUP */}
      <section className="py-24 bg-smoke">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <div className="text-center mb-16">
              <p className="section-label mb-4">The Lineup</p>
              <h2 className="font-serif font-black text-4xl md:text-[50px] text-ink leading-tight">
                Three shapes we've built a thousand times.
              </h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {featured.map((p, i) => (
              <Reveal key={p.slug} delay={i * 120}>
                <Link href={`/products/${p.slug}`} className="group block bg-white rounded-2.5xl overflow-hidden shadow-soft hover:shadow-lift transition-all hover:-translate-y-1 h-full">
                  <div className="aspect-square bg-paper flex items-center justify-center">
                    <BagArt variant={p.slug} className="w-3/5 text-ink/30 group-hover:text-ember/60 transition-colors" />
                  </div>
                  <div className="p-7">
                    <h3 className="font-bold text-ink text-xl group-hover:text-ember transition-colors">{p.name}</h3>
                    <p className="text-[15px] text-ink-soft mt-1.5 mb-4">{p.tagline}</p>
                    <p className="text-[15px] font-bold text-ember">
                      ${p.tiers[0].unitPrice.toFixed(2)}/bag at {p.minOrder.toLocaleString()}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="text-center">
            <Link href="/products" className="btn-ink">See all three bags</Link>
          </div>
        </div>
      </section>

      {/* VERTICALS */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-5 text-center">
          <Reveal>
            <h2 className="font-serif font-black text-4xl md:text-[50px] text-ink mb-14 leading-tight max-w-2xl mx-auto">
              If your customers carry it, it should carry your brand.
            </h2>
          </Reveal>
          <div className="flex flex-wrap justify-center gap-3">
            {VERTICALS.map((v, i) => (
              <Reveal key={v} delay={i * 60}>
                <div className="bg-white shadow-soft text-ink rounded-full px-7 py-3.5 font-semibold text-[15px] hover:bg-ember hover:text-white transition-colors cursor-default">
                  {v}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CREDIBILITY — the section you love, kept and elevated */}
      <section className="py-28 bg-charcoal text-white">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <Reveal>
            <p className="section-label mb-5" style={{ color: "#E8703C" }}>Why KINGBAGS</p>
            <h2 className="font-serif font-black text-4xl md:text-[50px] mb-7 leading-tight">
              The team behind some of America's largest bag programs.
            </h2>
            <p className="text-white/65 text-lg leading-relaxed max-w-xl mx-auto mb-10">
              For over a decade, King Universal has built bag programs for theme parks, destination retailers, and national chains. KINGBAGS is the same team, the same factories, and the same standards — sized for brands ordering 1,500 bags, not 150,000. You get the best bag your brand can put its name on, at the price the factory charges — not what a distributor marks it up to.
            </p>
            <Link href="/design" className="btn-light text-lg !px-12 !py-5">Design Your Bag</Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
