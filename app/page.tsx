import Link from "next/link";
import { PRODUCTS } from "@/lib/products";
import SpinHero from "@/components/SpinHero";
import Reveal from "@/components/Reveal";
import BagArt from "@/components/BagArt";
import CountUp from "@/components/CountUp";

const STEPS = [
  { n: "1", t: "Design it", d: "Choose your bag, download the real production template, and place your art edge to edge — every panel, every side." },
  { n: "2", t: "Price it yourself", d: "Pick your quantity and the price is right there. No quote emails, no waiting on a callback." },
  { n: "3", t: "Carry it within weeks", d: "Cut and sewn at the factories behind our national brand programs, then air freighted straight to you. Most orders land in 4–6 weeks; the industry norm for bags like these is closer to three months." },
];

const VERTICALS = [
  { slug: "dtc-brands", label: "DTC Brands", color: "#14532D" },
  { slug: "restaurants", label: "Restaurants", color: "#B45309" },
  { slug: "gyms-studios", label: "Gyms & Studios", color: "#1E40AF" },
  { slug: "breweries", label: "Breweries", color: "#7C2231" },
  { slug: "retail", label: "Retail", color: "#0F766E" },
  { slug: "events", label: "Events", color: "#6B21A8" },
];

const TRUST = [
  { icon: "bag", label: "Built for national brands" },
  { icon: "tag", label: "Factory-direct pricing" },
  { icon: "plane", label: "Shipping & customs handled" },
  { icon: "stack", label: "From 1,500 bags" },
];

function TrustIcon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    bag: (
      <>
        <path d="M5 8.5 6.2 19a2 2 0 0 0 2 1.8h7.6a2 2 0 0 0 2-1.8L19 8.5Z" />
        <path d="M9 8.5V7a3 3 0 0 1 6 0v1.5" />
      </>
    ),
    tag: (
      <>
        <path d="M3.5 12.5 12 4h5.5a2 2 0 0 1 2 2v5.5l-8.5 8.5a2 2 0 0 1-2.8 0l-4.7-4.7a2 2 0 0 1 0-2.8Z" />
        <circle cx="15.5" cy="8.5" r="1.2" />
      </>
    ),
    plane: (
      <>
        <path d="M21 3 3.5 10.5l6.5 2.5 2.5 6.5L21 3Z" />
        <path d="M10 13 21 3" />
      </>
    ),
    stack: (
      <>
        <path d="m12 3 9 5-9 5-9-5 9-5Z" />
        <path d="m3.5 12.5 8.5 4.7 8.5-4.7" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none" stroke="#E9A13B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

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
            <h1 className="font-hero font-extrabold text-[11.5vw] md:text-[92px] leading-[1.02] text-ink">
              Make the bag <span className="text-gold italic">nobody</span><br />throws away.
            </h1>
          </div>
          <div className="pointer-events-auto">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/design" className="btn-ember group text-lg !px-12 !py-5">
                Start Your Order
                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <Link href="/products" className="btn-outline bg-paper/70 backdrop-blur-sm">Explore the Bags</Link>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP — slow ticker, one thin line on every screen */}
      <section className="bg-ember-dark text-white py-3.5">
        <div className="ticker">
          <div className="ticker-track">
            {[0, 1].map((copy) => (
              <div key={copy} className="ticker-half" aria-hidden={copy === 1}>
                {TRUST.map((t) => (
                  <span key={t.label} className="flex items-center gap-2.5 text-[12.5px] font-bold tracking-[0.14em] uppercase whitespace-nowrap">
                    <TrustIcon name={t.icon} />
                    {t.label}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE MATH — marketing impact stats */}
      <section className="py-24 md:py-32 bg-ember text-white">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <div className="text-center mb-16">
              <p className="section-label mb-4" style={{ color: "#E9A13B" }}>The Math</p>
              <h2 className="font-serif font-black text-4xl md:text-[54px] leading-tight max-w-3xl mx-auto">
                The hardest-working ad you'll ever buy.
              </h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-12 md:gap-8 text-center">
            <Reveal delay={0}>
              <div>
                <div className="font-serif font-black text-7xl md:text-8xl text-gold mb-3 tabular-nums">
                  <CountUp to={3300} />
                </div>
                <p className="text-white/75 text-lg leading-snug max-w-[240px] mx-auto">
                  impressions from a single bag over its life
                </p>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div>
                <div className="font-serif font-black text-7xl md:text-8xl text-gold mb-3">⅒¢</div>
                <p className="text-white/75 text-lg leading-snug max-w-[240px] mx-auto">
                  cost per impression — the cheapest ad medium measured
                </p>
              </div>
            </Reveal>
            <Reveal delay={240}>
              <div>
                <div className="font-serif font-black text-7xl md:text-8xl text-gold mb-3 tabular-nums">
                  <CountUp to={5} suffix="M" />
                </div>
                <p className="text-white/75 text-lg leading-snug max-w-[240px] mx-auto">
                  impressions from one 1,500-bag minimum run
                </p>
              </div>
            </Reveal>
          </div>
          <Reveal delay={300}>
            <p className="text-center text-white/40 text-[13px] mt-14">
              Source: ASI Ad Impressions Study, 2026
            </p>
          </Reveal>
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
                  <div className="font-serif font-black text-5xl text-gold w-12 shrink-0 leading-none">{s.n}</div>
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
              <p className="section-label mb-4">The Bags</p>
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
            <Link href="/products" className="btn-ink">Compare all three bags</Link>
          </div>
        </div>
      </section>

      {/* VERTICALS */}
      <section className="py-24 bg-gold-tint">
        <div className="mx-auto max-w-5xl px-5 text-center">
          <Reveal>
            <h2 className="font-serif font-black text-4xl md:text-[50px] text-ink mb-10 leading-tight max-w-2xl mx-auto">
              If your customers carry it, it should carry your brand.
            </h2>
            <div className="flex flex-wrap justify-center gap-3.5">
              {VERTICALS.map((v, i) => (
                <Reveal key={v.label} delay={i * 60}>
                  <Link
                    href={`/for/${v.slug}`}
                    style={{ backgroundColor: v.color }}
                    className="inline-block text-white font-bold text-base md:text-lg px-7 py-3.5 rounded-full transition-all hover:scale-110 hover:shadow-lift"
                  >
                    {v.label}
                  </Link>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* THE GREEN MATH — environmental impact */}
      <section className="py-24 md:py-32 border-t border-ink/10">
        <div className="mx-auto max-w-6xl px-5 grid md:grid-cols-[1.1fr_1fr] gap-14 md:gap-20 items-center">
          <Reveal>
            <div>
              <p className="section-label mb-4">The Green Math</p>
              <h2 className="font-serif font-black text-4xl md:text-[54px] text-ink leading-[1.05] mb-6">
                One bag retires <span className="text-ember italic">five hundred</span>.
              </h2>
              <p className="text-ink-soft text-lg leading-relaxed mb-4 max-w-lg">
                A single-use plastic bag works for about 12 minutes. A KINGBAGS bag works for
                years — and every trip it takes is one more plastic bag that never gets made.
              </p>
              <p className="text-ink-soft text-lg leading-relaxed max-w-lg">
                Your customers already want to carry the solution. Put your name on it.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 gap-x-8 gap-y-12 text-center">
            <Reveal delay={100}>
              <div>
                <div className="font-serif font-black text-6xl md:text-7xl text-ember mb-2 tabular-nums">
                  <CountUp to={500} suffix="+" />
                </div>
                <p className="text-ink-soft text-[15px] leading-snug">single-use bags replaced per bag, per year</p>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div>
                <div className="font-serif font-black text-6xl md:text-7xl text-ember mb-2 tabular-nums">
                  <CountUp to={12} />
                  <span className="text-3xl md:text-4xl align-baseline"> min</span>
                </div>
                <p className="text-ink-soft text-[15px] leading-snug">the average working life of a plastic bag</p>
              </div>
            </Reveal>
            <Reveal delay={300}>
              <div className="col-span-2">
                <div className="font-serif font-black text-6xl md:text-7xl text-gold mb-2 tabular-nums">
                  <CountUp to={750} suffix="K+" />
                </div>
                <p className="text-ink-soft text-[15px] leading-snug">plastic bags a 1,500-bag run can retire every year it's carried</p>
              </div>
            </Reveal>
          </div>
        </div>
        <p className="text-center text-ink-soft/60 text-[13px] mt-14 px-5">
          Based on industry lifecycle estimates for reusable shopping bags
        </p>
      </section>

      {/* CREDIBILITY — the section you love, kept and elevated */}
      <section className="py-28 bg-charcoal text-white">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <Reveal>
            <p className="section-label mb-5" style={{ color: "#4CA173" }}>Why KINGBAGS</p>
            <h2 className="font-serif font-black text-4xl md:text-[50px] mb-7 leading-tight">
              The team behind some of America's largest bag programs.
            </h2>
            <p className="text-white/65 text-lg leading-relaxed max-w-xl mx-auto mb-10">
              For over a decade, King Universal has built bag programs for theme parks, destination retailers, and national chains. KINGBAGS is the same team, the same factories, and the same standards — sized for brands ordering 1,500 bags, not 150,000. You get the best bag your brand can put its name on, at the price the factory charges — not what a distributor marks it up to.
            </p>
            <Link href="/design" className="btn-light text-lg !px-12 !py-5">Start Your Order</Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
