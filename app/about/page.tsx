import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "About | KINGBAGS",
  description:
    "KINGBAGS is built by King Universal — the team behind bag and merchandise programs for theme parks, destination retailers, and national chains for over a decade.",
};

const STATS = [
  { v: "10+", l: "Years building brand programs" },
  { v: "13+", l: "Partner factories worldwide" },
  { v: "6", l: "Product categories mastered" },
  { v: "95%", l: "Of orders, we're importer of record" },
];

const VALUES = [
  {
    t: "Cut and sew, never blanks",
    d: "Most 'custom' bags are catalog blanks with a logo pressed on. Every KINGBAGS bag is built from a flat production template — your art printed edge to edge across every panel, then cut and sewn into the finished bag. There is no blank. The bag is the art.",
  },
  {
    t: "Factory-direct, no middlemen",
    d: "The promotional products industry runs on distributors marking up someone else's work by 30–40%. We own the factory relationships. When you order from KINGBAGS, you're buying from the people who actually make the bag — which is why the quality is higher and the price still makes sense.",
  },
  {
    t: "Quality that survives the parking lot",
    d: "Our parent company's bags get carried out of theme parks, travel centers, and national retail chains millions of times a year. That volume forces a discipline most suppliers never face: reinforced stress points, QC on every run, materials chosen to last years, not weeks.",
  },
  {
    t: "A real person on every order",
    d: "The platform gives you instant pricing and a live proof — but before anything goes to production, a human on our team reviews your art, confirms your specs, and walks your order through the factory. Software for speed. People for certainty.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* HERO */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <Reveal>
            <p className="section-label mb-5">About KINGBAGS</p>
            <h1 className="font-serif font-black text-4xl md:text-6xl text-ink leading-[1.05] mb-7">
              We've been making bags for brands you already love.
            </h1>
            <p className="text-lg md:text-xl text-ink-soft leading-relaxed">
              KINGBAGS is the direct line into King Universal — a product development and sourcing company that has spent over a decade building bags and branded merchandise for theme parks, destination retailers, and national chains across America.
            </p>
          </Reveal>
        </div>
      </section>

      {/* STATS */}
      <section className="pb-24">
        <div className="mx-auto max-w-5xl px-5 grid grid-cols-2 md:grid-cols-4 gap-5">
          {STATS.map((s, i) => (
            <Reveal key={s.l} delay={i * 100}>
              <div className="bg-white rounded-2.5xl shadow-soft p-8 text-center h-full">
                <div className="font-serif font-black text-5xl text-ember mb-2">{s.v}</div>
                <div className="text-sm text-ink-soft leading-snug">{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* STORY */}
      <section className="py-24 bg-charcoal text-white">
        <div className="mx-auto max-w-3xl px-5">
          <Reveal>
            <p className="section-label mb-5" style={{ color: "#E8703C" }}>The Story</p>
            <h2 className="font-serif font-black text-3xl md:text-5xl leading-tight mb-8">
              Built in the rooms where the biggest bag programs get made.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <div className="space-y-6 text-white/70 text-lg leading-relaxed">
              <p>
                For years, our team has designed, sourced, and delivered merchandise for some of the most demanding retail environments in the country — the theme park gift shop moving thousands of units a day, the destination travel center whose branded merchandise is the reason people pull off the highway, the heritage restaurant chain whose country store is half the experience.
              </p>
              <p>
                In those rooms, a bag is never just a bag. It's the thing a guest carries through the park all day, the souvenir that rides home in the back seat, the tote that shows up at the farmers market three years later. We learned to build for that standard — because our clients' brands demanded it.
              </p>
              <p>
                KINGBAGS exists because we kept meeting brands who wanted that exact quality and couldn't get it. Too small for the big factory minimums. Too serious for logo-on-a-blank promo junk. So we opened our own front door: the same factories, the same construction, the same team — now from 2,000 bags.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <h2 className="font-serif font-black text-3xl md:text-5xl text-ink text-center leading-tight mb-16">
              How we work.
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-6">
            {VALUES.map((v, i) => (
              <Reveal key={v.t} delay={i * 100}>
                <div className="bg-white rounded-2.5xl shadow-soft p-9 h-full">
                  <h3 className="font-serif font-bold text-2xl text-ink mb-4">{v.t}</h3>
                  <p className="text-ink-soft leading-relaxed">{v.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-28">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <Reveal>
            <h2 className="font-serif font-black text-3xl md:text-5xl text-ink leading-tight mb-6">
              Your brand deserves the same craft.
            </h2>
            <p className="text-ink-soft text-lg mb-10">Design your bag in minutes. A real person reviews every order.</p>
            <Link href="/design" className="btn-ember text-lg !px-12 !py-5">Design Your Bag</Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
