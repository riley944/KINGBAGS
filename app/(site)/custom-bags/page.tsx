import { Suspense } from "react";
import Link from "next/link";
import LogoMarquee from "@/components/LogoMarquee";
import PriceAndBook from "@/components/PriceAndBook";
import SizeCards from "@/components/SizeCards";
import Reveal from "@/components/Reveal";
import { MIN_ORDER, SETUP_PER_COLOR } from "@/lib/products";
import { CTA } from "@/lib/site";

export const metadata = {
  title: "Custom Printed Bags, Priced in 30 Seconds | KINGBAGS",
  description:
    "Fully custom cut-and-sew bags with edge-to-edge print. Real delivered price in thirty seconds, then a fifteen-minute call with the team behind America's biggest bag programs. From 1,500 bags.",
};

// The ad landing page. Same header and footer as the rest of the site, the
// calculator in the hero, and enough bags on screen that a cold click from
// an ad understands what we make before it reads a word.

const PROOF = [
  { n: "Millions", d: "of bags shipped for national brand programs" },
  { n: "5–6 wks", d: "delivered, air freight and duties included" },
  { n: "Every panel", d: "full-color print, front, back, gussets, and base" },
];

const LOOK = [
  { slug: "lucky-dog", brand: "Lucky Dog" },
  { slug: "casa-bonita-mercado", brand: "Casa Bonita Mercado" },
  { slug: "good-day-coffee", brand: "Good Day Coffee" },
  { slug: "wild-threads", brand: "Wild Threads" },
  { slug: "olive-market", brand: "Market" },
  { slug: "pine-and-salt", brand: "Pine & Salt" },
];

const BUILT = [
  { t: "140 GSM laminated material", d: "The same spec as the national programs we run. Full-color print sealed under gloss, so it wipes clean and never peels." },
  { t: "Cross-stitched handles", d: "Reinforced sewn handles, cross-stitched at every stress point. Built for a real grocery load, not a trade-show giveaway." },
  { t: "Full-print gussets and base", d: "Your art runs across the sides and the bottom too, over a structured board base that keeps the bag standing." },
  { t: "Inspected before it ships", d: "Print registration, stitching, handle attachment, and count checked at the factory. Packed 100 to a carton." },
];

const STEPS = [
  { t: "Get your price", d: "Pick the size and quantity. The number is delivered and all-in, not a starting point." },
  { t: "Fifteen minutes with a specialist", d: "We confirm size, art, and timing, then build your photoreal proof. Nobody writes a five-figure check to a website." },
  { t: "Approve the proof, then we build", d: "Nothing is made or charged until you say go. Cut and sewn at the factories behind our national programs." },
];

const FAQ = [
  { q: "Is the price really all-in?", a: `Yes. Bag, full-color print, air freight, and customs duties, delivered to your door. The only line on top is a one-time print setup of $${SETUP_PER_COLOR} per ink color.` },
  { q: "What's the minimum?", a: `${MIN_ORDER.toLocaleString()} bags. Below that, fully custom cut-and-sew doesn't make sense for you or us; we'll tell you honestly on the call.` },
  { q: "Can I see one before I commit?", a: "Yes. Ask on the call and we'll send a finished bag from a past program, and a pre-production sample of your own bag can be made before the run starts. You approve a free photoreal proof either way." },
  { q: "What if the proof isn't right?", a: "You don't approve it, and nothing is charged. We revise until it is." },
  { q: "Who are you?", a: "KINGBAGS is the direct channel of King Universal Inc., the Raleigh team that produces bag programs for some of America's biggest brands. Same factories, same spec, simpler to buy." },
];

export default function CustomBagsLanding() {
  return (
    <>
      {/* HERO: copy and a real bag on the left, the calculator on the right */}
      <section className="bg-paper">
        <div className="mx-auto max-w-6xl px-5 pt-10 md:pt-14 pb-12 grid lg:grid-cols-[1fr_1.05fr] gap-10 lg:gap-14 items-start">
          <div>
            <p className="section-label mb-4">Fully custom printed bags</p>
            <h1 className="font-serif text-[40px] md:text-[54px] text-ink leading-[1.02] mb-5">
              Your art on every inch of the bag. A real price in thirty seconds.
            </h1>
            <p className="text-ink-soft text-lg leading-relaxed mb-7 max-w-xl">
              Cut-and-sew bags built by the team behind national brand programs, sold direct.
              Edge-to-edge print, reinforced handles, delivered in five to six weeks, from {MIN_ORDER.toLocaleString()} bags.
            </p>
            <div className="relative rounded-2.5xl bg-smoke overflow-hidden mb-7">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/spin/frame-01.webp" alt="A fully custom printed KINGBAGS grocery tote" className="w-full aspect-[4/3] object-contain mix-blend-multiply p-6" />
              <span className="absolute bottom-3 left-3 bg-white/90 text-ink text-[11px] font-grotesk font-bold tracking-[0.14em] uppercase px-2.5 py-1 rounded-full">A real program bag</span>
            </div>
            <ul className="grid sm:grid-cols-3 gap-4">
              {PROOF.map((p) => (
                <li key={p.n} className="border-l-2 border-ink pl-3">
                  <p className="font-grotesk font-extrabold text-[22px] text-ink leading-none">{p.n}</p>
                  <p className="text-[13px] text-ink-soft mt-1.5 leading-snug">{p.d}</p>
                </li>
              ))}
            </ul>
          </div>
          <div id="price" className="scroll-mt-24 lg:sticky lg:top-24">
            <Suspense fallback={<div className="bg-white rounded-2.5xl border border-ink/10 shadow-soft h-[520px]" />}>
              <PriceAndBook />
            </Suspense>
          </div>
        </div>
      </section>

      <LogoMarquee />

      {/* THE BAG IN FOUR SIZES */}
      <section className="py-20 md:py-24 bg-smoke">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <div className="text-center mb-12">
              <p className="section-label mb-4">The bag</p>
              <h2 className="font-serif text-3xl md:text-[44px] text-ink leading-tight">One bag. Four sizes. Both orientations.</h2>
              <p className="text-ink-soft text-lg mt-4 max-w-2xl mx-auto">Laminated, glossy, wipes clean. Your art on every panel. Pick a size and the calculator above fills in.</p>
            </div>
          </Reveal>
          <SizeCards />
        </div>
      </section>

      {/* WHAT FULL CUSTOM LOOKS LIKE */}
      <section className="py-20 md:py-24 bg-white border-y border-ink/10">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
              <div>
                <p className="section-label mb-4">What full custom looks like</p>
                <h2 className="font-serif text-3xl md:text-[44px] text-ink leading-tight">Not a logo on a stock tote.<br />A bag built around your art.</h2>
              </div>
              <Link href="/gallery" className="text-ink font-semibold underline underline-offset-4 hover:no-underline">See the lookbook</Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
            {LOOK.map((c, i) => (
              <Reveal key={c.slug} delay={(i % 3) * 90}>
                <figure className="bg-smoke rounded-2.5xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/lookbook/${c.slug}/front.webp`} alt={`${c.brand} concept bag`} className="w-full aspect-square object-cover" />
                  <figcaption className="px-4 py-3 text-[12px] text-ink-soft">Concept: {c.brand}</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
          <p className="text-[12px] text-ink-soft mt-5">Concept artwork shown. The construction, material, and print are our real production capability.</p>
        </div>
      </section>

      {/* BUILT, NOT MOCKED UP */}
      <section className="py-20 md:py-24 bg-charcoal text-white">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <div className="max-w-3xl mb-12">
              <p className="section-label mb-4" style={{ color: "#9A9A9A" }}>This isn&apos;t a mockup business</p>
              <h2 className="font-serif text-3xl md:text-[44px] leading-tight mb-5">Printed flat first, then cut and sewn.</h2>
              <p className="text-white/65 text-lg leading-relaxed">
                Your artwork goes onto the material before the bag exists. That&apos;s the difference between a print area and a whole bag, and it&apos;s why the front, back, gussets, and base all carry your brand.
              </p>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {BUILT.map((b, i) => (
              <Reveal key={b.t} delay={i * 90}>
                <div className="bg-white/[0.06] border border-white/10 rounded-2.5xl p-6 h-full">
                  <div className="w-8 h-1 rounded-full bg-white/40 mb-5" />
                  <h3 className="font-bold text-[17px] mb-2">{b.t}</h3>
                  <p className="text-white/60 text-[15px] leading-relaxed">{b.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 md:py-24 bg-smoke">
        <div className="mx-auto max-w-6xl px-5">
          <p className="section-label mb-4 text-center">How it works</p>
          <h2 className="font-serif text-3xl md:text-[40px] text-ink text-center leading-tight mb-12">Three steps. One call. No surprises.</h2>
          <ol className="grid md:grid-cols-3 gap-6">
            {STEPS.map((s, i) => (
              <li key={s.t} className="bg-white rounded-2.5xl border border-ink/10 p-7">
                <p className="font-grotesk font-extrabold text-ink-soft text-[13px] tracking-[0.2em] mb-3">0{i + 1}</p>
                <h3 className="font-serif text-[22px] text-ink leading-tight mb-2">{s.t}</h3>
                <p className="text-[15px] text-ink-soft leading-relaxed">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-24 bg-white border-y border-ink/10">
        <div className="mx-auto max-w-3xl px-5">
          <h2 className="font-serif text-3xl md:text-[36px] text-ink leading-tight mb-8">Questions buyers ask first</h2>
          <dl className="divide-y divide-ink/10">
            {FAQ.map((f) => (
              <div key={f.q} className="py-5">
                <dt className="font-semibold text-ink text-[17px] mb-1.5">{f.q}</dt>
                <dd className="text-[15px] text-ink-soft leading-relaxed">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="py-14 bg-ink text-white">
        <div className="mx-auto max-w-6xl px-5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-serif text-3xl leading-tight mb-1">Ready for your number?</h2>
            <p className="text-white/80">Thirty seconds to a delivered price. Fifteen minutes to a proof.</p>
          </div>
          <div className="flex gap-3 flex-wrap justify-center">
            <Link href="#price" className="btn-light !py-4 !px-9">{CTA.primary} →</Link>
            <Link href="/talk" className="text-white font-semibold underline underline-offset-4 hover:no-underline self-center">{CTA.talk}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
