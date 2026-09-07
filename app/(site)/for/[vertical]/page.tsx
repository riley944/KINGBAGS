import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import BagArt from "@/components/BagArt";
import ConceptImage from "@/components/ConceptImage";
import CountUp from "@/components/CountUp";
import { VERTICALS, getVertical } from "@/lib/verticals";
import { PRODUCTS } from "@/lib/products";

export function generateStaticParams() {
  return VERTICALS.map((v) => ({ vertical: v.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ vertical: string }> }) {
  const { vertical } = await params;
  const v = getVertical(vertical);
  if (!v) return {};
  return {
    title: `${v.headline.replace(/\.$/, "")} | KINGBAGS`,
    description: `${v.sub} Fully custom cut-and-sew, edge-to-edge print, from 1,500 bags, delivered in 4–6 weeks.`,
  };
}

export default async function VerticalPage({ params }: { params: Promise<{ vertical: string }> }) {
  const { vertical } = await params;
  const v = getVertical(vertical);
  if (!v) notFound();

  const bags = v.bestBags
    .map((slug) => PRODUCTS.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <>
      {/* HERO — vertical color owns the page */}
      <section className="py-20 md:py-28" style={{ backgroundColor: v.color }}>
        <div className="mx-auto max-w-4xl px-5 text-center text-white">
          <Reveal>
            <p className="text-[12px] font-bold tracking-[0.2em] uppercase mb-5 text-white/70">
              KINGBAGS for {v.label}
            </p>
            <h1 className="font-hero font-extrabold text-5xl md:text-7xl leading-[1.02] mb-7">
              {v.headline}
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl mx-auto mb-10">
              {v.sub}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href={`/design?style=${v.bestBags[0]}`} className="btn-light text-lg !px-10 !py-4">
                Start Your Order →
              </Link>
              <Link href="/samples" className="text-white font-semibold underline underline-offset-4 hover:no-underline">
                Or hold a sample first — $35
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHERE IT SHOWS UP */}
      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <h2 className="font-serif font-black text-3xl md:text-5xl text-ink text-center leading-tight mb-14">
              Where the bag does its work.
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {v.moments.map((m, i) => (
              <Reveal key={m.t} delay={i * 100}>
                <div className="bg-white rounded-2.5xl border border-ink/10 p-8 h-full">
                  <div className="w-10 h-1.5 rounded-full mb-5" style={{ backgroundColor: v.color }} />
                  <h3 className="font-bold text-xl text-ink mb-2.5">{m.t}</h3>
                  <p className="text-ink-soft leading-relaxed">{m.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* THE NUMBERS */}
      <section className="py-16 bg-charcoal text-white">
        <div className="mx-auto max-w-5xl px-5 grid grid-cols-3 gap-6 text-center">
          <Reveal>
            <div>
              <div className="font-serif font-black text-4xl md:text-6xl mb-1 tabular-nums" style={{ color: v.onDark }}>
                <CountUp to={3300} />
              </div>
              <p className="text-white/60 text-sm md:text-[15px]">impressions per bag</p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div>
              <div className="font-serif font-black text-4xl md:text-6xl mb-1" style={{ color: v.onDark }}>4–6</div>
              <p className="text-white/60 text-sm md:text-[15px]">weeks door to door</p>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <div>
              <div className="font-serif font-black text-4xl md:text-6xl mb-1 tabular-nums" style={{ color: v.onDark }}>
                <CountUp to={1500} />
              </div>
              <p className="text-white/60 text-sm md:text-[15px]">bag minimum, factory-direct</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* RECOMMENDED CONSTRUCTIONS */}
      <section className="py-20 md:py-24 bg-smoke">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <h2 className="font-serif font-black text-3xl md:text-5xl text-ink text-center leading-tight mb-14">
              The right bags for {v.label.toLowerCase()}.
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {bags.map((p, i) => (
              <Reveal key={p.slug} delay={i * 100}>
                <Link href={`/products/${p.slug}`} className="group block bg-white rounded-2.5xl overflow-hidden border border-ink/10 hover:border-ember/50 hover:shadow-lift transition-all h-full">
                  <div className="aspect-square bg-smoke flex items-center justify-center">
                    <BagArt variant={p.slug} className="w-3/5 text-ink/30 group-hover:text-ember/60 transition-colors" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-ink text-lg group-hover:text-ember transition-colors">{p.name}</h3>
                    <p className="text-sm text-ink-soft mt-1 mb-3">{p.material}</p>
                    <p className="text-[15px] font-bold text-ember">
                      ${p.tiers[0].unitPrice.toFixed(2)}/bag at {p.minOrder.toLocaleString()}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CONCEPTS */}
      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-5xl px-5">
          <Reveal>
            <h2 className="font-serif font-black text-3xl md:text-5xl text-ink text-center leading-tight mb-14">
              What it can look like.
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {v.concepts.map((slug, i) => (
              <Reveal key={slug} delay={i * 100}>
                <Link href="/gallery" className="group block bg-white rounded-2.5xl overflow-hidden border border-ink/10 hover:border-ember/50 hover:shadow-lift transition-all">
                  <ConceptImage slug={slug} variant="grocery-tote" />
                </Link>
              </Reveal>
            ))}
          </div>
          <p className="text-[13px] text-ink-soft text-center mt-8">
            Concept artwork — real constructions, materials, and print methods.{" "}
            <Link href="/gallery" className="text-ember font-semibold hover:underline">See the full Lookbook</Link>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 md:pb-28">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <Reveal>
            <h2 className="font-serif font-black text-3xl md:text-5xl text-ink leading-tight mb-6">
              Price yours in the next two minutes.
            </h2>
            <p className="text-ink-soft text-lg mb-9">
              Instant pricing in the studio. Free proof before production. Nothing to pay until you approve it.
            </p>
            <Link href={`/design?style=${v.bestBags[0]}`} className="btn-ember text-lg !px-12 !py-5">
              Start Your Order →
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
