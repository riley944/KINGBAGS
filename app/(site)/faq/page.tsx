import Link from "next/link";
import Reveal from "@/components/Reveal";
import NextStep from "@/components/NextStep";
import { MIN_ORDER, SETUP_PER_COLOR } from "@/lib/products";
import { SAMPLE_PRICE } from "@/lib/site";

export const metadata = {
  title: "Buyer FAQ | KINGBAGS",
  description:
    "Print method, artwork requirements, color matching, samples, lead times, shipping, payment, and quality control for fully custom cut-and-sew bags from KINGBAGS.",
};

type QA = { q: string; a: string };
type Group = { title: string; items: QA[] };

const GROUPS: Group[] = [
  {
    title: "The bag",
    items: [
      {
        q: "What does \"fully custom cut and sew\" actually mean?",
        a: "Your artwork is printed onto the flat material first, then the panels are cut and sewn into a bag. That's why the print runs edge to edge across the front, back, both gussets, and the base with no blank borders. A stock tote with a logo is the opposite: a finished bag with a small print area.",
      },
      {
        q: "Are the sizes fixed, or can I get custom dimensions?",
        a: "Both. The Grocery Tote comes in four proven sizes, each in landscape or portrait, and those price instantly in the studio. If you need dimensions outside that ladder, or a construction we don't list, we quote it as a custom program. Same factories, just a few more days to price.",
      },
      {
        q: "What is the material?",
        a: "The Grocery Tote is 140 GSM laminated non-woven polypropylene with a glossy finish, the same spec the national programs we run use. It wipes clean and holds full-color print. The Canvas Tote is premium cotton canvas, natural or piece-dyed.",
      },
      {
        q: "How much can it carry?",
        a: "The reinforced, cross-stitched handles and board bottom are built for a full grocery load. If your use case is heavier than groceries, tell us and we'll adjust the handle spec.",
      },
    ],
  },
  {
    title: "Artwork and print",
    items: [
      {
        q: "What print method do you use?",
        a: "Full-color print laminated under gloss for the Grocery Tote, so it doesn't crack, peel, or fade with use. Canvas programs are quoted with the method that suits the art, typically screen print or full-surface dye-sublimation.",
      },
      {
        q: "What files do you need?",
        a: "A PNG, JPG, or WebP placed on our production template in the studio, at 200 DPI or better at print size. The studio checks resolution and bleed as you place it. If you have vector art or a PDF, send it and we'll place it for you.",
      },
      {
        q: "Can you match my brand colors?",
        a: "Yes. Send Pantone references with your artwork and we match them on the pre-production sample. Print is CMYK process, so a few neon or metallic Pantones are approximated. We flag those on your proof before anything is made.",
      },
      {
        q: "Do I see a proof first?",
        a: "Always. Every order gets a free photoreal proof of your exact bag. Nothing is produced, and nothing is charged, until you approve it.",
      },
      {
        q: "What does the print setup fee cover?",
        a: `A one-time $${SETUP_PER_COLOR} per ink color, which covers the printing plates for your artwork. Full-color art is typically four colors. Reorders of the same art don't pay it again.`,
      },
    ],
  },
  {
    title: "Samples",
    items: [
      {
        q: "Can I hold one before I order?",
        a: `Yes, and you should. The $${SAMPLE_PRICE} Quality Kit ships in days with a finished bag from a past program, a printed rendering of your design, and a spec sheet. The $300 Exact Sample is a pre-production copy of your actual bag, made at your factory with your plates. Both are credited in full toward your order.`,
      },
      {
        q: "Do I get a pre-production sample on every order?",
        a: "You get a free photoreal proof on every order. A physical pre-production sample is the Exact Sample, which we recommend on first orders and any new artwork. It adds about two to three weeks before the run starts.",
      },
    ],
  },
  {
    title: "Ordering, timing, and delivery",
    items: [
      {
        q: "What is the minimum?",
        a: `${MIN_ORDER.toLocaleString()} bags of one design. Sizes and orientations can't be mixed inside a single run, but two designs at ${MIN_ORDER.toLocaleString()} each is fine.`,
      },
      {
        q: "How long does it take?",
        a: "Most Grocery Tote orders land in five to six weeks from proof approval: about thirty days in production, then air freight and customs. Canvas runs six to eight weeks. If you have a hard date, tell us before you approve the proof and we'll confirm it can be met.",
      },
      {
        q: "Is the price really all-in?",
        a: "Yes. Every per-bag price on this site includes the bag, air freight to your door, and customs clearance and duties. The only line on top is the one-time print setup. You will not get a freight bill or a customs bill later.",
      },
      {
        q: "Where do you ship?",
        a: "Anywhere in the United States and Canada, to one address. Split shipments to multiple locations are available on request and priced by destination.",
      },
      {
        q: "How do I pay?",
        a: "Card or US bank account, saved securely through Stripe when you place the order. Nothing is charged until you approve your proof. Ask about terms on repeat programs.",
      },
      {
        q: "Can I cancel?",
        a: "Free until you approve the proof. After approval, materials are cut and plates are made, so the order is committed. Full terms are on the Terms page.",
      },
    ],
  },
  {
    title: "Quality",
    items: [
      {
        q: "How is quality controlled?",
        a: "Every run is inspected at the factory before it's packed: print registration, stitching, handle attachment, and count. Cartons hold 100 bags. If anything arrives defective, tell us within 14 days and we replace or credit it.",
      },
      {
        q: "Who is actually making these?",
        a: "The same factories that produce King Universal's national bag programs for theme parks, destination retailers, and chains. KINGBAGS is that team, sized for brands ordering 1,500 bags instead of 150,000. The project team is in Raleigh, North Carolina.",
      },
    ],
  },
];

export default function FaqPage() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: GROUPS.flatMap((g) =>
      g.items.map((i) => ({
        "@type": "Question",
        name: i.q,
        acceptedAnswer: { "@type": "Answer", text: i.a },
      })),
    ),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-5">
          <Reveal>
            <p className="section-label mb-5">Buyer FAQ</p>
            <h1 className="font-serif text-4xl md:text-6xl text-ink leading-[1.05] mb-5">
              The questions a serious buyer asks.
            </h1>
            <p className="text-lg text-ink-soft leading-relaxed">
              Straight answers on print, artwork, samples, timing, payment, and quality. If yours isn&apos;t here,{" "}
              <Link href="/talk" className="text-ember font-semibold hover:underline">talk to a specialist</Link>.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-20 md:pb-24">
        <div className="mx-auto max-w-3xl px-5 space-y-12">
          {GROUPS.map((g, gi) => (
            <Reveal key={g.title} delay={gi * 60}>
              <div>
                <h2 className="font-grotesk font-extrabold text-[12px] tracking-[0.2em] uppercase text-ember mb-4">{g.title}</h2>
                <div className="divide-y divide-ink/10 border-y border-ink/10">
                  {g.items.map((i) => (
                    <details key={i.q} className="group py-4">
                      <summary className="flex items-start justify-between gap-6 cursor-pointer list-none">
                        <span className="font-semibold text-ink text-[17px] leading-snug">{i.q}</span>
                        <span className="text-ember text-xl leading-none mt-0.5 transition-transform group-open:rotate-45">+</span>
                      </summary>
                      <p className="text-ink-soft leading-relaxed mt-3 pr-8">{i.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <NextStep tone="tint" />
    </>
  );
}
