import Link from "next/link";
import Reveal from "@/components/Reveal";
import NextStep from "@/components/NextStep";
import { PRODUCTS, unitPrice, dims, SETUP_PER_COLOR, MIN_ORDER } from "@/lib/products";

export const metadata = {
  title: "Pricing | KINGBAGS",
  description:
    "Transparent per-bag pricing by size and quantity for fully custom, edge-to-edge printed bags. Air freight, customs, and duties included. From 1,500 bags.",
};

const QTYS = [1500, 2500, 5000, 10000, 25000, 50000];

export default function PricingPage() {
  const grocery = PRODUCTS.find((p) => p.slug === "grocery-tote")!;
  const canvas = PRODUCTS.find((p) => p.slug === "canvas-tote")!;

  return (
    <>
      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <Reveal>
            <p className="section-label mb-5">Pricing</p>
            <h1 className="font-serif text-4xl md:text-6xl text-ink leading-[1.05] mb-6">
              Honest numbers, right up front.
            </h1>
            <p className="text-lg text-ink-soft leading-relaxed">
              Every number on this page is <span className="text-ink font-semibold">all-in</span>:
              the fully custom, edge-to-edge printed bag <span className="text-ink font-semibold">plus air freight plus customs duties</span>,
              delivered to your door. Most suppliers quote the bag and bill you the rest later. We don&apos;t.
            </p>
          </Reveal>
        </div>
      </section>

      {/* WHAT'S IN THE NUMBER */}
      <section className="pb-8">
        <div className="mx-auto max-w-5xl px-5">
          <Reveal>
            <div className="bg-ember text-white rounded-2.5xl px-6 py-5 md:px-8 grid md:grid-cols-[auto_1fr] gap-x-8 gap-y-3 items-center">
              <span className="font-grotesk font-extrabold text-[13px] tracking-[0.18em] uppercase whitespace-nowrap">Every price includes</span>
              <ul className="flex flex-wrap gap-x-7 gap-y-1.5 text-[15px] font-semibold">
                <li>✓ The bag, fully custom, full-color</li>
                <li>✓ Air freight to your door</li>
                <li>✓ Customs clearance &amp; duties</li>
                <li>✓ Your free photoreal proof</li>
              </ul>
              <span className="md:col-start-2 text-[13px] text-white/70">Only thing on top: one-time print setup, ${SETUP_PER_COLOR} per ink color. No freight bill, no customs bill, no surprises.</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* GROCERY TOTE MATRIX */}
      <section className="pb-16">
        <div className="mx-auto max-w-5xl px-5">
          <Reveal>
            <div className="bg-white rounded-2.5xl border border-ink/10 overflow-hidden">
              <div className="p-8 pb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                  <h2 className="font-serif text-3xl md:text-4xl text-ink mb-1">{grocery.name}</h2>
                  <p className="text-ink-soft">{grocery.material}</p>
                </div>
                <div className="text-sm text-ink-soft md:text-right">
                  Landscape or portrait · Lead time {grocery.leadTime}
                </div>
              </div>
              <div className="px-4 md:px-8 pb-2 overflow-x-auto">
                <table className="w-full text-[15px] min-w-[640px]">
                  <thead>
                    <tr className="border-y border-ink/10 bg-smoke/70">
                      <th className="text-left px-4 py-3 font-grotesk text-[11px] font-bold tracking-[0.14em] uppercase text-ink-soft">Size</th>
                      {QTYS.map((q) => (
                        <th key={q} className="px-3 py-3 text-right font-grotesk text-[11px] font-bold tracking-[0.14em] uppercase text-ink-soft">
                          {q.toLocaleString()}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {grocery.sizes.map((s) => (
                      <tr key={s.code} className="border-b border-ink/5 last:border-0">
                        <td className="px-4 py-3.5">
                          <span className="font-semibold text-ink">{s.label}</span>
                          <span className="block text-[12px] text-ink-soft">{dims(s, "landscape")} or {dims(s, "portrait")}</span>
                        </td>
                        {QTYS.map((q) => (
                          <td key={q} className="px-3 py-3.5 text-right font-semibold text-ink tabular-nums">
                            ${unitPrice(grocery, s.code, q)!.toFixed(2)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-8 py-6 border-t border-ink/10 grid md:grid-cols-[1fr_auto] gap-5 items-center">
                <ul className="text-[13px] text-ink-soft space-y-1.5">
                  <li><span className="font-semibold text-ink">All-in per bag — bag + air freight + duties — delivered.</span> Minimum {MIN_ORDER.toLocaleString()} bags.</li>
                  <li>One-time print setup: ${SETUP_PER_COLOR} per ink color (full-color art is typically 4). Priced live in the studio.</li>
                  <li>Quantities between columns price in between. Over 50,000 — talk to us.</li>
                  <li>These are our proven constructions. Custom dimensions or constructions outside this ladder are quoted as a custom program.</li>
                </ul>
                <Link href="/design?style=grocery-tote" className="btn-ink !py-3 !px-7 !text-sm">
                  Price mine live
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CANVAS */}
      <section className="pb-24">
        <div className="mx-auto max-w-5xl px-5">
          <Reveal>
            <div className="bg-white rounded-2.5xl border border-ink/10 p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl text-ink mb-1">{canvas.name}</h2>
                <p className="text-ink-soft mb-2">{canvas.material} · natural or piece-dyed · landscape or portrait</p>
                <p className="text-[15px] text-ink-soft">
                  Quoted per project — canvas weight, dye, and handle style move the number.
                  Design it in the studio and we&apos;ll price it within one business day.
                </p>
              </div>
              <Link href="/design?style=canvas-tote" className="btn-ink !py-3 !px-7 !text-sm shrink-0">
                Design &amp; request a quote
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <NextStep />

      <section className="py-24">
        <div className="mx-auto max-w-3xl px-5">
          <Reveal>
            <div className="bg-charcoal rounded-4xl p-10 md:p-14 text-center text-white">
              <h2 className="font-serif text-3xl md:text-4xl leading-tight mb-4">
                Over 50,000 bags, or custom dimensions?
              </h2>
              <p className="text-white/65 text-lg mb-8 max-w-md mx-auto">
                Volume and custom programs get dedicated pricing, ocean-freight economics, and a direct line to our team.
              </p>
              <Link href="/talk" className="btn-light">Talk to a Specialist</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
