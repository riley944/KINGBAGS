import Link from "next/link";
import { PRODUCTS } from "@/lib/products";
import SpinHero from "@/components/SpinHero";

const STEPS = [
  { n: "1", t: "Design it", d: "Pick your bag. Drop your art on the real production template. Watch it wrap the bag in 3D — edge to edge, every panel." },
  { n: "2", t: "Price it instantly", d: "Set your quantity and the price updates live. No sales calls, no quote emails, no waiting." },
  { n: "3", t: "Carry it in weeks", d: "Cut and sewn at the same factories behind national brand programs. QC checked, shipped to your door." },
];

const VERTICALS = ["Restaurants", "Gyms & Studios", "Breweries", "DTC Brands", "Retail", "Events"];

export default function Home() {
  const featured = PRODUCTS.filter((p) => p.featured);
  return (
    <>
      {/* HERO */}
      <section>
        <div className="mx-auto max-w-4xl px-5 pt-20 pb-10 md:pt-28 text-center">
          <p className="section-label mb-6">Custom cut & sew · Edge-to-edge print · From 2,000 bags</p>
          <h1 className="font-serif font-black text-[44px] md:text-[76px] leading-[1.0] text-ink mb-7">
            A bag this good,<br />they'll <span className="text-cobalt italic">never</span> put it down.
          </h1>
          <p className="text-lg md:text-xl text-ink-soft max-w-xl mx-auto mb-10 leading-relaxed font-medium">
            Fully custom bags, built from scratch for your brand. No blanks. No templates. Your art, every inch.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <Link href="/design" className="btn-cobalt text-lg !px-12 !py-5">Design Your Bag</Link>
            <Link href="/products" className="btn-ghost">See the lineup</Link>
          </div>
          <p className="text-sm text-ink-soft font-medium">Instant pricing · No account needed</p>
        </div>
        <div className="mx-auto max-w-5xl px-5 pb-20">
          <div className="aspect-[16/9] md:aspect-[16/8] rounded-4xl bg-smoke shadow-soft overflow-hidden">
            <SpinHero />
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-6xl px-5 py-5 flex flex-wrap justify-center gap-x-10 gap-y-2 text-[15px] font-semibold">
          <span>Edge-to-edge printing</span>
          <span className="text-white/30">·</span>
          <span>Custom cut & sew</span>
          <span className="text-white/30">·</span>
          <span>2,000 bag minimums</span>
          <span className="text-white/30">·</span>
          <span>The team behind national brand programs</span>
        </div>
      </section>

      {/* THREE STEPS */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="font-serif font-black text-4xl md:text-[52px] text-center text-ink mb-16 leading-tight">
            Three steps. That's the whole thing.
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((s) => (
              <div key={s.n} className="bg-smoke rounded-2.5xl p-9">
                <div className="w-12 h-12 rounded-full bg-cobalt text-white font-serif font-black text-2xl flex items-center justify-center mb-6">{s.n}</div>
                <h3 className="font-extrabold text-2xl text-ink mb-3">{s.t}</h3>
                <p className="text-ink-soft text-[16px] leading-relaxed font-medium">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-24 bg-smoke">
        <div className="mx-auto max-w-6xl px-5">
          <div className="text-center mb-16">
            <p className="section-label mb-4">The Lineup</p>
            <h2 className="font-serif font-black text-4xl md:text-[52px] text-ink leading-tight">
              Three bags. Infinitely yours.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {featured.map((p) => (
              <Link key={p.slug} href={`/products/${p.slug}`} className="group bg-white rounded-2.5xl overflow-hidden shadow-soft hover:shadow-lift transition-all hover:-translate-y-1">
                <div className="aspect-square bg-smoke flex items-center justify-center">
                  <span className="font-serif italic text-ink/20 text-lg">[ {p.shortName} ]</span>
                </div>
                <div className="p-7">
                  <h3 className="font-extrabold text-ink text-xl group-hover:text-cobalt transition-colors">{p.name}</h3>
                  <p className="text-[15px] text-ink-soft mt-1.5 mb-4 font-medium">{p.tagline}</p>
                  <p className="text-[15px] font-extrabold text-cobalt">
                    From ${p.tiers[p.tiers.length - 1].unitPrice.toFixed(2)}/bag
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center">
            <Link href="/products" className="btn-primary">See all three bags</Link>
          </div>
        </div>
      </section>

      {/* VERTICALS */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-6xl px-5 text-center">
          <h2 className="font-serif font-black text-4xl md:text-[52px] text-ink mb-5 leading-tight">
            Made for whatever you make.
          </h2>
          <p className="text-ink-soft text-lg max-w-lg mx-auto mb-14 font-medium">
            If your customers carry it, it should carry your brand.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {VERTICALS.map((v) => (
              <div key={v} className="bg-ink text-white rounded-full px-7 py-3.5 font-bold text-[15px] hover:bg-cobalt transition-colors">
                {v}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CREDIBILITY + FINAL CTA */}
      <section className="py-24 bg-ink text-white">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <p className="section-label mb-5" style={{ color: "#7B93F5" }}>Why KINGBAGS</p>
          <h2 className="font-serif font-black text-4xl md:text-[52px] mb-7 leading-tight">
            The team behind the bags at America's most loved brands.
          </h2>
          <p className="text-white/70 text-lg leading-relaxed max-w-xl mx-auto mb-10 font-medium">
            For over a decade, King Universal has built bag programs for theme parks, destination retailers, and national chains. KINGBAGS brings that exact craft to your business.
          </p>
          <Link href="/design" className="btn-cobalt text-lg !px-12 !py-5">Design Your Bag</Link>
        </div>
      </section>
    </>
  );
}
