import Link from "next/link";
import { PRODUCTS, entryPrice, MIN_ORDER, SETUP_PER_COLOR } from "@/lib/products";
import { CTA, SAMPLE_PRICE } from "@/lib/site";
import SpinHero from "@/components/SpinHero";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import LogoMarquee from "@/components/LogoMarquee";
import NextStep from "@/components/NextStep";

const STEPS = [
  { n: "1", t: "Design it", d: "Choose your bag, download the real production template, and place your art edge to edge — every panel, every side." },
  { n: "2", t: "Price it yourself", d: "Pick your quantity and the number is right there — and it's all-in: bag, air freight, and duties. No quote emails, no freight surprise later." },
  { n: "3", t: "Approve the proof", d: "You get a free photoreal proof of your exact bag. Nothing is made, and nothing is charged, until you say go." },
  { n: "4", t: "Carry it within weeks", d: "Cut and sewn at the factories behind our national brand programs, then air freighted straight to you. Most orders land in 5–6 weeks; the industry norm for bags like these is closer to three months." },
];

const BUILT = [
  { t: "140 GSM laminated material", d: "The same spec as the national programs we run. Full-color print sealed under gloss, so it wipes clean and never peels." },
  { t: "Cross-stitched handles", d: "Reinforced sewn handles, cross-stitched at every stress point. Built for a real grocery load, not a trade-show giveaway." },
  { t: "Full-print gussets and base", d: "Your art runs across the sides and the bottom too, over a structured board base that keeps the bag standing." },
  { t: "Inspected before it ships", d: "Print registration, stitching, handle attachment, and count checked at the factory. Packed 100 to a carton." },
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
  { icon: "plane", label: "Freight & duties included" },
  { icon: "stack", label: `From ${MIN_ORDER.toLocaleString()} bags` },
];

const FAQ_TEASER = [
  { q: "Is the price really all-in?", a: "Yes. Bag, air freight, and customs duties, delivered. The only line on top is a one-time print setup of $" + SETUP_PER_COLOR + " per ink color." },
  { q: "Can I hold one before I order?", a: `The $${SAMPLE_PRICE} Quality Kit ships in days. The $300 Exact Sample is a pre-production copy of your actual bag. Both are credited in full.` },
  { q: "What if the proof isn't right?", a: "You don't approve it, and nothing is charged. We revise until it is." },
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
  return (
    <>
      {/* HERO — full-viewport spin with the headline imposed over the bag */}
      <section className="relative h-[calc(100svh-68px)] min-h-[680px] overflow-hidden bg-paper">
        <div className="absolute inset-x-0 top-[32%] bottom-[28%] sm:top-[31%] sm:bottom-[17%]">
          <SpinHero />
        </div>
        <div className="relative z-10 h-full flex flex-col items-center justify-between text-center px-5 pt-8 md:pt-12 pb-6 pointer-events-none">
          <div className="max-w-6xl mx-auto">
            <h1 className="font-hero font-extrabold text-[11vw] md:text-[88px] leading-[1.02] text-ink">
              Make the bag <span className="text-gold italic">nobody</span><br />throws away.
            </h1>
            <p className="text-ink-soft text-[15px] md:text-[17px] mt-4 max-w-3xl mx-auto leading-snug md:whitespace-nowrap bg-paper/80 backdrop-blur-sm rounded-full px-4 py-1 inline-block">
              Fully custom cut-and-sew reusable bags. Your artwork, edge to edge. Delivered from {MIN_ORDER.toLocaleString()} pieces.
            </p>
          </div>
          <div className="pointer-events-auto">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link href="/design" className="btn-ember group text-lg !px-10 !py-4">
                {CTA.primary}
                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <Link href="/samples" className="btn-outline bg-paper/70 backdrop-blur-sm !py-4">{CTA.sample}</Link>
            </div>
            <p className="text-[12.5px] md:text-[13px] text-ink-soft mt-4 font-medium">
              {CTA.reassurance} ·{" "}
              <Link href="/talk" className="text-ember font-semibold hover:underline">or talk to a specialist</Link>
            </p>
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

      {/* CLIENT PROOF — renders once logos are added in lib/site.ts */}
      <LogoMarquee />

      {/* THE LINEUP */}
      <section className="py-24 bg-smoke">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <div className="text-center mb-16">
              <p className="section-label mb-4">The Bags</p>
              <h2 className="font-serif font-black text-4xl md:text-[50px] text-ink leading-tight">
                Two bags. Every size. Both orientations.
              </h2>
              <p className="text-ink-soft text-lg mt-4 max-w-2xl mx-auto">
                Proven constructions that price instantly in the studio. Need dimensions outside the ladder? We quote custom programs on the same factories.
              </p>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
            {PRODUCTS.map((p, i) => (
              <Reveal key={p.slug} delay={i * 120}>
                <Link href={`/products/${p.slug}`} className="group block bg-white rounded-2.5xl overflow-hidden border border-ink/10 hover:border-ember/50 hover:shadow-lift transition-all h-full">
                  <div className="aspect-square bg-smoke relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.examples[0].src} alt={`${p.name} — concept by ${p.examples[0].brand}`} className="absolute inset-0 w-full h-full object-contain mix-blend-multiply" />
                  </div>
                  <div className="p-7">
                    <h3 className="font-bold text-ink text-xl group-hover:text-ember transition-colors">{p.name}</h3>
                    <p className="text-[15px] text-ink-soft mt-1.5 mb-4">{p.tagline}</p>
                    <p className="text-[15px] font-bold text-ember">
                      {entryPrice(p) ? `From $${entryPrice(p)!.toFixed(2)}/bag at ${p.minOrder.toLocaleString()} · freight & duties in` : "Quoted per project"}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="text-center">
            <Link href="/products" className="btn-ink">Compare both bags</Link>
          </div>
        </div>
      </section>

      {/* BUILT, NOT MOCKED UP — construction proof */}
      <section className="py-24 md:py-28 bg-charcoal text-white">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <div className="max-w-3xl mb-14">
              <p className="section-label mb-4" style={{ color: "#4CA173" }}>This isn&apos;t a mockup business</p>
              <h2 className="font-serif font-black text-4xl md:text-[50px] leading-tight mb-5">
                Not a stock tote with a logo. A bag built around your art.
              </h2>
              <p className="text-white/65 text-lg leading-relaxed">
                Your artwork is printed onto the flat material first, then cut and sewn into the bag. That&apos;s the difference between a print area and a whole bag, and it&apos;s why the front, back, gussets, and base all carry your brand.
              </p>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {BUILT.map((b, i) => (
              <Reveal key={b.t} delay={i * 90}>
                <div className="bg-white/[0.06] border border-white/10 rounded-2.5xl p-6 h-full">
                  <div className="w-8 h-1 rounded-full bg-gold mb-5" />
                  <h3 className="font-bold text-[17px] mb-2">{b.t}</h3>
                  <p className="text-white/60 text-[15px] leading-relaxed">{b.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 md:py-28">
        <div className="mx-auto max-w-6xl px-5 grid md:grid-cols-[1fr_1.5fr] gap-12 md:gap-20">
          <Reveal>
            <div className="md:sticky md:top-28">
              <h2 className="font-serif font-black text-4xl md:text-5xl text-ink leading-[1.05] mb-6">
                Design it.<br />Price it.<br />Carry it.
              </h2>
              <p className="text-ink-soft text-lg leading-relaxed max-w-sm mb-8">
                Fully custom bags, built from scratch for your brand — your art covers every inch of fabric before the bag is even sewn.
              </p>
              <Link href="/design" className="btn-ember">{CTA.primary} →</Link>
            </div>
          </Reveal>
          <div>
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 100}>
                <div className="flex gap-7 md:gap-9 py-8 first:pt-1 border-b border-ink/10 last:border-b-0">
                  <div className="font-grotesk font-extrabold text-4xl text-gold w-12 shrink-0 leading-none">{s.n}</div>
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

      {/* SAMPLE + SPECIALIST */}
      <NextStep tone="tint" />

      {/* CREDIBILITY */}
      <section className="py-24 md:py-28">
        <div className="mx-auto max-w-6xl px-5 grid md:grid-cols-[1.2fr_1fr] gap-12 items-center">
          <Reveal>
            <div>
              <p className="section-label mb-4">Why KINGBAGS</p>
              <h2 className="font-serif font-black text-4xl md:text-[50px] text-ink leading-tight mb-6">
                The team behind some of America&apos;s largest bag programs.
              </h2>
              <p className="text-ink-soft text-lg leading-relaxed mb-5">
                For over a decade, King Universal has built bag programs for theme parks, destination retailers, and national chains. KINGBAGS is the same team, the same factories, and the same standards — sized for brands ordering {MIN_ORDER.toLocaleString()} bags, not 150,000.
              </p>
              <p className="text-ink-soft text-lg leading-relaxed">
                You get the best bag your brand can put its name on, at the price the factory charges — not what a distributor marks it up to.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <ul className="bg-smoke rounded-2.5xl p-8 space-y-4">
              {[
                "10+ years manufacturing brand bag programs",
                "Millions of bags produced",
                "Raleigh, NC project team",
                "Factory-direct production, no distributor markup",
              ].map((line) => (
                <li key={line} className="flex gap-3 text-[16px] text-ink font-semibold leading-snug">
                  <span className="text-ember shrink-0">✓</span> {line}
                </li>
              ))}
              <li className="pt-3">
                <Link href="/about" className="text-ember font-semibold hover:underline">Meet the team →</Link>
              </li>
            </ul>
          </Reveal>
        </div>
      </section>

      {/* FAQ TEASER */}
      <section className="py-20 bg-smoke border-y border-ink/10">
        <div className="mx-auto max-w-6xl px-5 grid md:grid-cols-[1fr_2fr] gap-10 items-start">
          <Reveal>
            <div>
              <p className="section-label mb-3">Buyer FAQ</p>
              <h2 className="font-serif text-3xl md:text-4xl text-ink leading-tight mb-4">The questions a serious buyer asks.</h2>
              <Link href="/faq" className="text-ember font-semibold hover:underline">Read all of them →</Link>
            </div>
          </Reveal>
          <div className="divide-y divide-ink/10">
            {FAQ_TEASER.map((f, i) => (
              <Reveal key={f.q} delay={i * 80}>
                <div className="py-5 first:pt-0">
                  <h3 className="font-semibold text-ink text-[17px] mb-1.5">{f.q}</h3>
                  <p className="text-ink-soft leading-relaxed">{f.a}</p>
                </div>
              </Reveal>
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
                The hardest-working ad you&apos;ll ever buy.
              </h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-12 md:gap-8 text-center">
            <Reveal delay={0}>
              <div>
                <div className="font-grotesk font-extrabold text-7xl md:text-8xl text-gold mb-3 tabular-nums tracking-tight">
                  <CountUp to={3300} />
                </div>
                <p className="text-white/75 text-lg leading-snug max-w-[240px] mx-auto">
                  impressions from a single bag over its life
                </p>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div>
                <div className="font-grotesk font-extrabold text-7xl md:text-8xl text-gold mb-3 tracking-tight">⅒¢</div>
                <p className="text-white/75 text-lg leading-snug max-w-[240px] mx-auto">
                  cost per impression — the cheapest ad medium measured
                </p>
              </div>
            </Reveal>
            <Reveal delay={240}>
              <div>
                <div className="font-grotesk font-extrabold text-7xl md:text-8xl text-gold mb-3 tabular-nums tracking-tight">
                  <CountUp to={5} suffix="M" />
                </div>
                <p className="text-white/75 text-lg leading-snug max-w-[240px] mx-auto">
                  impressions from one {MIN_ORDER.toLocaleString()}-bag minimum run
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

      {/* THE GREEN MATH — kept modest and sourced */}
      <section className="py-24 md:py-28 border-t border-ink/10">
        <div className="mx-auto max-w-6xl px-5 grid md:grid-cols-[1.1fr_1fr] gap-14 md:gap-20 items-center">
          <Reveal>
            <div>
              <p className="section-label mb-4">The Green Math</p>
              <h2 className="font-serif font-black text-4xl md:text-[54px] text-ink leading-[1.05] mb-6">
                One bag retires <span className="text-ember italic">hundreds</span>.
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
                <div className="font-grotesk font-extrabold text-6xl md:text-7xl text-ember mb-2 tabular-nums tracking-tight">
                  <CountUp to={12} />
                  <span className="text-3xl md:text-4xl align-baseline"> min</span>
                </div>
                <p className="text-ink-soft text-[15px] leading-snug">the average working life of a plastic bag</p>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div>
                <div className="font-grotesk font-extrabold text-6xl md:text-7xl text-ember mb-2 tracking-tight">Years</div>
                <p className="text-ink-soft text-[15px] leading-snug">the working life of a laminated cut-and-sew bag</p>
              </div>
            </Reveal>
          </div>
        </div>
        <p className="text-center text-ink-soft/60 text-[13px] mt-14 px-5">
          Plastic-bag use time is a widely cited industry estimate; reuse counts vary by household.
        </p>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 bg-charcoal text-white">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <Reveal>
            <h2 className="font-serif font-black text-4xl md:text-[50px] mb-5 leading-tight">
              Price yours in the next two minutes.
            </h2>
            <p className="text-white/65 text-lg leading-relaxed max-w-xl mx-auto mb-9">
              {CTA.reassurance}.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link href="/design" className="btn-light text-lg !px-10 !py-4">{CTA.primary}</Link>
              <Link href="/talk" className="text-white font-semibold underline underline-offset-4 hover:no-underline">{CTA.talk}</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
