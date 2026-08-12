import Link from "next/link";
import { PRODUCTS } from "@/lib/products";

const STEPS = [
  { n: "1", t: "Design it", d: "Pick your format. Upload your art. Full-color, edge-to-edge, custom cut and sew — your bag, exactly how you imagine it." },
  { n: "2", t: "Price it instantly", d: "Set your quantity and watch the price update in real time. No sales calls. No three-day quote emails." },
  { n: "3", t: "Carry it in weeks", d: "Made at the same factories behind national brand programs. QC checked, shipped to your door in 4–6 weeks." },
];

const VERTICALS = [
  { name: "Restaurants", emoji: "🍽️" },
  { name: "Gyms & Studios", emoji: "💪" },
  { name: "Breweries & Wineries", emoji: "🍺" },
  { name: "Retail & Boutiques", emoji: "🛍️" },
  { name: "Events & Weddings", emoji: "🎉" },
];

export default function Home() {
  const featured = PRODUCTS.filter((p) => p.featured);
  return (
    <>
      {/* HERO — centered, product-first, CTA front and center */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-4xl px-5 pt-24 pb-16 md:pt-32 md:pb-20 text-center">
          <p className="section-label mb-6">Custom cut & sew · Full-color printing · From 500 units</p>
          <h1 className="font-serif font-black text-5xl md:text-7xl leading-[1.02] text-ink mb-6">
            A bag this good,<br />they'll <span className="text-clay italic">never</span> put it down.
          </h1>
          <p className="text-lg md:text-xl text-ink-soft max-w-xl mx-auto mb-10 leading-relaxed">
            Fully custom reusable bags, built from scratch for your brand. No blanks. No templates. Just your bag, done right.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Link href="/design" className="btn-clay text-lg !px-12 !py-5">Design Your Bag</Link>
            <Link href="/products" className="btn-ghost">See the lineup →</Link>
          </div>
          <p className="text-sm text-ink-soft/60">Instant pricing · No account needed</p>
        </div>

        {/* Product hero visual */}
        <div className="mx-auto max-w-5xl px-5 pb-20">
          <div className="aspect-[16/8] rounded-4xl bg-sand shadow-soft flex items-center justify-center">
            <span className="font-serif italic text-ink/20 text-xl">[ hero: one beautiful bag, centered, studio light ]</span>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-y border-ink/5 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-5 flex flex-wrap justify-center gap-x-10 gap-y-2 text-sm text-ink-soft">
          <span>Full-color edge-to-edge printing</span>
          <span>·</span>
          <span>Custom cut & sew</span>
          <span>·</span>
          <span>500 unit minimums</span>
          <span>·</span>
          <span>Recycled materials</span>
          <span>·</span>
          <span>The team behind national brand programs</span>
        </div>
      </section>

      {/* THREE STEPS */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="font-serif font-bold text-4xl md:text-5xl text-center text-ink mb-16">
            Three steps. That's the whole thing.
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((s) => (
              <div key={s.n} className="bg-white rounded-2.5xl p-9 shadow-soft">
                <div className="w-11 h-11 rounded-full bg-clay-tint text-clay font-serif font-black text-xl flex items-center justify-center mb-5">{s.n}</div>
                <h3 className="font-bold text-xl text-ink mb-2">{s.t}</h3>
                <p className="text-ink-soft leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-6xl px-5">
          <div className="text-center mb-16">
            <p className="section-label mb-3">The Lineup</p>
            <h2 className="font-serif font-bold text-4xl md:text-5xl text-ink">
              Six formats. Infinitely yours.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {featured.map((p) => (
              <Link key={p.slug} href={`/products/${p.slug}`} className="group bg-bone rounded-2.5xl overflow-hidden hover:shadow-lift transition-all hover:-translate-y-1">
                <div className="aspect-square bg-sand flex items-center justify-center">
                  <span className="font-serif italic text-ink/15">[ {p.shortName} ]</span>
                </div>
                <div className="p-7">
                  <h3 className="font-bold text-ink text-lg group-hover:text-clay transition-colors">{p.name}</h3>
                  <p className="text-sm text-ink-soft mt-1 mb-4">{p.tagline}</p>
                  <p className="text-sm font-bold text-clay">
                    From ${p.tiers[p.tiers.length - 1].unitPrice.toFixed(2)}/bag
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center">
            <Link href="/products" className="btn-primary">See all six formats</Link>
          </div>
        </div>
      </section>

      {/* VERTICALS — playful strip */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-5 text-center">
          <h2 className="font-serif font-bold text-4xl md:text-5xl text-ink mb-4">
            Made for whatever you make.
          </h2>
          <p className="text-ink-soft max-w-lg mx-auto mb-14">
            Restaurants, gyms, taprooms, boutiques, big days — if your customers carry it, it should carry your brand.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {VERTICALS.map((v) => (
              <div key={v.name} className="bg-white rounded-full px-7 py-3.5 shadow-soft flex items-center gap-2.5 hover:shadow-lift hover:-translate-y-0.5 transition-all">
                <span className="text-xl">{v.emoji}</span>
                <span className="font-semibold text-ink">{v.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CREDIBILITY + FINAL CTA */}
      <section className="py-24 bg-ink text-bone">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <p className="section-label mb-5 !text-clay-light">Why KINGBAGS</p>
          <h2 className="font-serif font-bold text-4xl md:text-5xl mb-6 leading-tight">
            The team behind the bags at America's most loved brands.
          </h2>
          <p className="text-bone/60 leading-relaxed max-w-xl mx-auto mb-10">
            For over a decade, our parent company King Universal has built bag programs for theme parks, destination retailers, and national chains. KINGBAGS brings that exact craft to your business — starting at just 500 units.
          </p>
          <Link href="/design" className="btn-clay text-lg !px-12 !py-5">Design Your Bag</Link>
        </div>
      </section>
    </>
  );
}
