import Link from "next/link";
import Reveal from "@/components/Reveal";
import { CALENDLY_URL, CONTACT_EMAIL, CTA, SAMPLE_PRICE } from "@/lib/site";

export const metadata = {
  title: "Talk to a Bag Specialist | KINGBAGS",
  description:
    "Book fifteen minutes with a KINGBAGS specialist to walk through your artwork, sizes, quantities, and timeline before you order.",
};

const COVER = [
  "Which bag and size fits what you're carrying",
  "Whether your artwork will print the way you expect",
  "Quantity, price, and the real delivered date",
  "Samples, proofs, and how payment works",
];

export default function TalkPage() {
  return (
    <>
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5 grid md:grid-cols-[1fr_1.2fr] gap-12 items-start">
          <Reveal>
            <div>
              <p className="section-label mb-5">Talk to a specialist</p>
              <h1 className="font-serif text-4xl md:text-6xl text-ink leading-[1.05] mb-6">
                Fifteen minutes with someone who has shipped millions of bags.
              </h1>
              <p className="text-lg text-ink-soft leading-relaxed mb-8">
                Nobody writes a five-figure check to a website. Pick a time and a member of the Raleigh team will walk your project with you. No pitch, no pressure, and the studio still prices it live afterward.
              </p>
              <div className="text-[11px] font-grotesk font-bold tracking-[0.18em] uppercase text-ink-soft mb-3">We&apos;ll cover</div>
              <ul className="space-y-2.5 mb-10">
                {COVER.map((c) => (
                  <li key={c} className="flex gap-2.5 text-[15px] text-ink leading-snug">
                    <span className="text-ember font-bold shrink-0">✓</span> {c}
                  </li>
                ))}
              </ul>
              <div className="bg-smoke rounded-2.5xl p-6">
                <p className="font-semibold text-ink mb-1">Rather hold one first?</p>
                <p className="text-[14px] text-ink-soft mb-4">The ${SAMPLE_PRICE} Quality Kit ships in days and is credited toward your order.</p>
                <Link href="/samples" className="btn-ink !py-3 !px-6 !text-sm">{CTA.sample}</Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            {CALENDLY_URL ? (
              <div className="bg-white rounded-2.5xl border border-ink/10 overflow-hidden shadow-soft">
                <iframe
                  title="Book a call with KINGBAGS"
                  src={`${CALENDLY_URL}${CALENDLY_URL.includes("?") ? "&" : "?"}hide_gdpr_banner=1&primary_color=14532d`}
                  className="w-full h-[760px] border-0"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="bg-white rounded-2.5xl border border-ink/10 p-8 md:p-10 shadow-soft">
                <h2 className="font-serif text-2xl text-ink mb-3">Pick a time by email</h2>
                <p className="text-ink-soft leading-relaxed mb-6">
                  Send us two or three windows that work for you and what you&apos;re hoping to make. A specialist replies within one business day with a confirmed time.
                </p>
                <a
                  href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Book a call with a bag specialist")}&body=${encodeURIComponent("Hi KINGBAGS,\n\nI'd like to talk through a bag project.\n\nWhat I'm making it for:\nRough quantity:\nTimes that work for me:\n")}`}
                  className="btn-ember w-full !py-4 text-center"
                >
                  Email to book a call
                </a>
                <p className="text-[13px] text-ink-soft mt-4 text-center">
                  Or write to{" "}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-ember font-semibold hover:underline">{CONTACT_EMAIL}</a>
                </p>
              </div>
            )}
          </Reveal>
        </div>
      </section>
    </>
  );
}
