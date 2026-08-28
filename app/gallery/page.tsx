import Link from "next/link";
import Reveal from "@/components/Reveal";
import BagArt from "@/components/BagArt";

export const metadata = {
  title: "Our Work | KINGBAGS",
  description: "Bag programs built by the KINGBAGS team for theme parks, destination retailers, national chains, and growing brands.",
};

// Swap placeholders for real photography as it's shot. Keep aspect-square images ~1200px.
const WORK = [
  { title: "Destination retail tote program", cat: "Destination Retail", note: "Multi-size edge-to-edge program for a national travel retailer." },
  { title: "Theme park carryall", cat: "Attractions", note: "High-volume guest favorite, reinforced for all-day carry." },
  { title: "Heritage brand market tote", cat: "National Chains", note: "Country-store canvas program, printed and sewn to spec." },
  { title: "DTC launch tote", cat: "Brands", note: "Full-bleed art, 5,000-unit first run for a food brand launch." },
  { title: "Insulated checkout cooler", cat: "Grocery", note: "Foil-lined, full-color exterior, sold at register." },
  { title: "Event welcome bag", cat: "Events", note: "Custom dimensions and rope handles for a flagship event." },
];

export default function GalleryPage() {
  return (
    <>
      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <Reveal>
            <p className="section-label mb-5">Our Work</p>
            <h1 className="font-serif font-black text-4xl md:text-6xl text-ink leading-[1.05] mb-6">
              Bags that went out into the world.
            </h1>
            <p className="text-lg text-ink-soft leading-relaxed">
              A look at the kind of programs our team builds — from national retail floors to first-run brand launches.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WORK.map((w, i) => (
              <Reveal key={w.title} delay={(i % 3) * 100}>
                <div className="group bg-white rounded-2.5xl overflow-hidden shadow-soft hover:shadow-lift transition-all hover:-translate-y-1 h-full">
                  <div className="aspect-square bg-smoke flex items-center justify-center">
                    <BagArt
                      variant={["grocery-tote", "canvas-tote", "beach-bag"][i % 3]}
                      className="w-1/2 text-ink/25 group-hover:text-ember/50 transition-colors"
                    />
                  </div>
                  <div className="p-6">
                    <div className="text-[11px] font-bold tracking-[0.18em] uppercase text-ember mb-2">{w.cat}</div>
                    <h2 className="font-bold text-ink text-lg mb-1.5">{w.title}</h2>
                    <p className="text-sm text-ink-soft leading-relaxed">{w.note}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-28">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <Reveal>
            <h2 className="font-serif font-black text-3xl md:text-5xl text-ink leading-tight mb-6">Yours goes here next.</h2>
            <Link href="/design" className="btn-ember text-lg !px-12 !py-5">Design Your Bag</Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
