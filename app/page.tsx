import Link from "next/link";
import { PRODUCTS } from "@/lib/products";

const STEPS = [
  { n: "01", t: "Design From Scratch", d: "Pick your format, then make it yours: full-color edge-to-edge artwork, custom dimensions, handles, pockets, and hardware. This is cut and sew, not a blank with a logo." },
  { n: "02", t: "Get Instant Pricing", d: "See your exact per-unit and total price the moment you set quantity. Premium product, transparent pricing — no email chains, no three-day quote turnarounds." },
  { n: "03", t: "Delivered in 4–6 Weeks", d: "Produced at the same factories that run programs for national brands. Every run is QC checked before it ships to your door." },
];

const VERTICALS = [
  { name: "Restaurants", d: "Takeout bags that make your food look as good leaving as it does on the plate." },
  { name: "Gyms & Studios", d: "Member bags your community actually wants to carry." },
  { name: "Breweries & Wineries", d: "Bottle carriers and taproom totes fans take home." },
  { name: "Retail & Boutiques", d: "The carry-out bag that keeps advertising after checkout." },
  { name: "Events & Weddings", d: "Welcome bags and swag people keep, not toss." },
];

export default function Home() {
  const featured = PRODUCTS.filter((p) => p.featured);
  return (
    <>
      {/* HERO */}
      <section className="bg-navy text-cream">
        <div className="mx-auto max-w-7xl px-5 py-24 md:py-32 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="section-label mb-4 !text-gold">From the team behind bags for America's most loved brands</p>
            <h1 className="font-serif font-black text-4xl md:text-6xl leading-[1.05] mb-6">
              Your brand.<br />Carried <span className="text-gold">everywhere.</span>
            </h1>
            <p className="text-lg text-cream/70 mb-8 max-w-md leading-relaxed">
              Fully custom cut-and-sew bags with full-color, edge-to-edge printing. No blanks, no templates — your bag, built from scratch. From 500 units.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/design" className="btn-gold">Design Your Bag</Link>
              <Link href="/products" className="inline-block border-2 border-cream/30 text-cream font-semibold px-7 py-3 rounded-md hover:border-gold hover:text-gold transition-colors">
                Browse Styles
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <div className="w-full aspect-square max-w-md rounded-2xl bg-navy-light border border-cream/10 flex items-center justify-center">
              <span className="font-serif text-cream/20 text-xl italic">[ hero bag photography ]</span>
            </div>
          </div>
        </div>
        {/* Trust bar */}
        <div className="border-t border-cream/10">
          <div className="mx-auto max-w-7xl px-5 py-5 flex flex-wrap justify-center gap-x-10 gap-y-2 text-sm text-cream/50">
            <span>✓ Full-color edge-to-edge printing</span>
            <span>✓ Custom cut &amp; sew — no blanks</span>
            <span>✓ 500 unit minimums</span>
            <span>✓ Recycled materials available</span>
            <span>✓ US-based team</span>
            <span>✓ 13+ global factories</span>
            <span>✓ Decade-long brand relationships</span>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-5">
          <p className="section-label mb-3 text-center">How It Works</p>
          <h2 className="font-serif font-bold text-3xl md:text-4xl text-center text-navy mb-14">
            From art file to delivered bags in three steps.
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((s) => (
              <div key={s.n} className="bg-white rounded-xl p-8 shadow-sm border border-navy/5">
                <div className="font-serif font-black text-4xl text-gold mb-4">{s.n}</div>
                <h3 className="font-bold text-lg text-navy mb-2">{s.t}</h3>
                <p className="text-sm text-ink/60 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-5">
          <p className="section-label mb-3 text-center">The Lineup</p>
          <h2 className="font-serif font-bold text-3xl md:text-4xl text-center text-navy mb-14">
            Six formats. Every one fully custom.
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mb-10">
            {featured.map((p) => (
              <Link key={p.slug} href={`/products/${p.slug}`} className="group bg-cream rounded-xl overflow-hidden border border-navy/5 hover:shadow-lg transition-shadow">
                <div className="aspect-[4/3] bg-navy/5 flex items-center justify-center">
                  <span className="font-serif italic text-navy/20">[ {p.shortName} photo ]</span>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-navy text-lg group-hover:text-gold-dark transition-colors">{p.name}</h3>
                  <p className="text-sm text-ink/60 mt-1 mb-3">{p.tagline}</p>
                  <p className="text-sm font-semibold text-gold-dark">
                    From ${p.tiers[p.tiers.length - 1].unitPrice.toFixed(2)}/unit
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center">
            <Link href="/products" className="btn-outline">View All Six Styles</Link>
          </div>
        </div>
      </section>

      {/* VERTICALS */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-5">
          <p className="section-label mb-3 text-center">Built For Your Business</p>
          <h2 className="font-serif font-bold text-3xl md:text-4xl text-center text-navy mb-14">
            Whatever you do, your bag should do it too.
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {VERTICALS.map((v) => (
              <div key={v.name} className="bg-white rounded-xl p-6 border border-navy/5 text-center">
                <h3 className="font-bold text-navy mb-2">{v.name}</h3>
                <p className="text-xs text-ink/60 leading-relaxed">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CREDIBILITY */}
      <section className="py-20 bg-navy text-cream">
        <div className="mx-auto max-w-4xl px-5 text-center">
          <p className="section-label mb-4 !text-gold">Why KINGBAGS</p>
          <h2 className="font-serif font-bold text-3xl md:text-4xl mb-6">
            The same team. The same factories.<br />Now available to every business.
          </h2>
          <p className="text-cream/70 leading-relaxed max-w-2xl mx-auto mb-8">
            For over a decade, our parent company King Universal has designed and produced bags and branded merchandise
            for some of the most demanding retail brands in America — theme parks, destination retailers, and national
            chains. KINGBAGS brings that exact infrastructure to orders starting at just 500 units.
          </p>
          <Link href="/design" className="btn-gold">Start Designing</Link>
        </div>
      </section>
    </>
  );
}
