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
      {/* HERO — full-viewport spin with the headline imposed over the bag */}
      <section className="relative h-[calc(100svh-68px)] min-h-[640px] overflow-hidden bg-paper">
        <div className="absolute inset-x-0 top-[30%] bottom-[26%] sm:top-[18%] sm:bottom-[15%]">
          <SpinHero />
        </div>
        <div className="relative z-10 h-full flex flex-col items-center justify-between text-center px-5 pt-10 md:pt-14 pb-8 pointer-events-none">
          <div className="max-w-6xl mx-auto">
            <p className="section-label mb-5">Custom cut & sew · Edge-to-edge print · From 1,500 bags</p>
            <h1 className="font-hero font-black text-[11vw] md:text-[84px] leading-[0.98] tracking-[-0.02em] text-ink">
              A bag this good, they'll<br /><span className="text-ember italic">never</span> put it down.
            </h1>
          </div>
          <div className="pointer-events-auto">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
              <Link href="/design" className="btn-ember text-lg !px-12 !py-5">Design Your Bag</Link>
              <Link href="/products" className="btn-outline bg-paper/70 backdrop-blur-sm">See the lineup</Link>
            </div>
            <p className="text-sm text-ink-soft">Instant pricing · No account needed</p>
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
      <section className="py-24 md:py-28 border-t border-ink/10">
        <div className="mx-auto max-w-6xl px-5 grid md:grid-cols-[1fr_1.5fr] gap-12 md:gap-20">
          <Reveal>
            <div className="md:sticky md:top-28">
              <h2 className="font-serif font-black text-4xl md:text-5xl text-ink leading-[1.05] mb-6">
                Design it.<br />Price it.<br />Carry it.
              </h2>
              <p className="text-ink-soft text-lg leading-relaxed max-w-sm">
                Fully custom bags, built from scratch for your brand — your art covers every inch of fabric before the bag is even sewn.
              </p>
            </div>
          </Reveal>
          <div>
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 100}>
                <div className="flex gap-7 md:gap-9 py-9 first:pt-1 border-b border-ink/10 last:border-b-0">
                  <div className="font-serif font-black text-5xl text-ember w-12 shrink-0 leading-none">{s.n}</div>
                  <div>
                    <h3 className="font-bold text-xl text-ink mb-2">{s.t}</h3>
                    <p className="text-ink-soft leading-relaxed">{s.d}</p>
                  </div>
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
                <Link href={`/products/${p.slug}`} className="group block bg-white rounded-2.5xl overflow-hidden border border-ink/10 hover:border-ember/50 hover:shadow-lift transition-all h-full">
                  <div className="aspect-square bg-smoke flex items-center justify-center">
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
      <section className="py-24 border-t border-ink/10">
        <div className="mx-auto max-w-5xl px-5 text-center">
          <Reveal>
            <h2 className="font-serif font-black text-4xl md:text-[50px] text-ink mb-10 leading-tight max-w-2xl mx-auto">
              If your customers carry it, it should carry your brand.
            </h2>
            <p className="flex flex-wrap justify-center gap-x-3 gap-y-2 text-[13px] md:text-sm font-bold tracking-[0.18em] uppercase text-ink-soft">
              {VERTICALS.map((v, i) => (
                <span key={v} className="flex items-center gap-3">
                  {i > 0 && <span className="text-ember">·</span>}
                  <span>{v}</span>
                </span>
              ))}
            </p>
          </Reveal>
        </div>
      </section>

      {/* CREDIBILITY — the section you love, kept and elevated */}
      <section className="py-28 bg-charcoal text-white">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <Reveal>
            <p className="section-label mb-5" style={{ color: "#58B383" }}>Why KINGBAGS</p>
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
