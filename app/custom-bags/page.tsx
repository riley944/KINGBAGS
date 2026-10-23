import { Suspense } from "react";
import Link from "next/link";
import LogoMarquee from "@/components/LogoMarquee";
import PriceAndBook from "@/components/PriceAndBook";
import { MIN_ORDER, SETUP_PER_COLOR } from "@/lib/products";
import { SAMPLE_PRICE } from "@/lib/site";

// The ad landing page. Price in thirty seconds, book the call, done.

const PROOF = [
  { n: "Millions", d: "of bags shipped for national brand programs" },
  { n: "5–6 wks", d: "delivered, air freight and duties included" },
  { n: "Every panel", d: "full-color print, front, back, gussets, and base" },
];

const STEPS = [
  { t: "Get your price", d: "Pick the bag, size, and quantity. The number is delivered and all-in, not a starting point." },
  { t: "Fifteen minutes with a specialist", d: "We confirm size, art, and timing, then build your photoreal proof. Nobody writes a five-figure check to a website." },
  { t: "Approve the proof, then we build", d: "Nothing is made or charged until you say go. Cut and sewn at the factories behind our national programs." },
];

const FAQ = [
  { q: "Is the price really all-in?", a: `Yes. Bag, full-color print, air freight, and customs duties, delivered to your door. The only line on top is a one-time print setup of $${SETUP_PER_COLOR} per ink color.` },
  { q: "What's the minimum?", a: `${MIN_ORDER.toLocaleString()} bags. Below that, fully custom cut-and-sew doesn't make sense for you or us; we'll tell you honestly on the call.` },
  { q: "Can I see one before I commit?", a: `The $${SAMPLE_PRICE} Quality Kit ships in days. A $300 Exact Sample is a pre-production copy of your actual bag. Both are credited in full against your run.` },
  { q: "What if the proof isn't right?", a: "You don't approve it, and nothing is charged. We revise until it is." },
  { q: "Who are you?", a: "KINGBAGS is the direct channel of King Universal Inc., the Raleigh team that produces bag programs for some of America's biggest brands. Same factories, same spec, simpler to buy." },
];

export default function CustomBagsLanding() {
  return (
    <>
      <section className="bg-paper">
        <div className="mx-auto max-w-6xl px-5 pt-12 md:pt-16 pb-10 grid lg:grid-cols-[1fr_1.05fr] gap-10 lg:gap-14 items-start">
          <div className="lg:pt-6">
            <p className="section-label mb-4">Fully custom printed bags</p>
            <h1 className="font-serif text-[40px] md:text-[56px] text-ink leading-[1.02] mb-5">
              Your art on every inch of the bag. A real price in thirty seconds.
            </h1>
            <p className="text-ink-soft text-lg leading-relaxed mb-7 max-w-xl">
              Cut-and-sew bags built by the team behind national brand programs, sold direct.
              Edge-to-edge print, reinforced handles, delivered in five to six weeks, from {MIN_ORDER.toLocaleString()} bags.
            </p>
            <ul className="grid sm:grid-cols-3 gap-4 mb-8">
              {PROOF.map((p) => (
                <li key={p.n} className="border-l-2 border-ember pl-3">
                  <p className="font-grotesk font-extrabold text-[22px] text-ink leading-none">{p.n}</p>
                  <p className="text-[13px] text-ink-soft mt-1.5 leading-snug">{p.d}</p>
                </li>
              ))}
            </ul>
            <p className="text-[13px] text-ink-soft">
              Price is delivered and all-in. Free photoreal proof. Nothing charged until you approve.
            </p>
          </div>
          <div id="price" className="scroll-mt-6">
            <Suspense fallback={<div className="bg-white rounded-2.5xl border border-ink/10 shadow-soft h-[520px]" />}>
              <PriceAndBook />
            </Suspense>
          </div>
        </div>
      </section>

      <LogoMarquee />

      <section className="py-16 md:py-20 bg-smoke">
        <div className="mx-auto max-w-6xl px-5">
          <p className="section-label mb-4 text-center">How it works</p>
          <h2 className="font-serif text-3xl md:text-[40px] text-ink text-center leading-tight mb-12">Three steps. One call. No surprises.</h2>
          <ol className="grid md:grid-cols-3 gap-6">
            {STEPS.map((s, i) => (
              <li key={s.t} className="bg-white rounded-2.5xl border border-ink/10 p-7">
                <p className="font-grotesk font-extrabold text-ember text-[13px] tracking-[0.2em] mb-3">0{i + 1}</p>
                <h3 className="font-serif text-[22px] text-ink leading-tight mb-2">{s.t}</h3>
                <p className="text-[15px] text-ink-soft leading-relaxed">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white border-y border-ink/10">
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

      <section className="py-14 bg-ember text-white">
        <div className="mx-auto max-w-6xl px-5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-serif text-3xl leading-tight mb-1">Ready for your number?</h2>
            <p className="text-white/80">Thirty seconds to a delivered price. Fifteen minutes to a proof.</p>
          </div>
          <Link href="#price" className="btn-light !py-4 !px-9">Get Your Price →</Link>
        </div>
      </section>
    </>
  );
}
