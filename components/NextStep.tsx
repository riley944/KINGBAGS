import Link from "next/link";
import { CTA, SAMPLE_PRICE } from "@/lib/site";

// The persistent low-risk next step: hold a sample, or talk to a person.
// Dropped onto product, pricing, lookbook, and industry pages.
export default function NextStep({ tone = "light" }: { tone?: "light" | "tint" }) {
  return (
    <section className={tone === "tint" ? "bg-ember-tint" : "bg-white border-y border-ink/10"}>
      <div className="mx-auto max-w-6xl px-5 py-12 md:py-14 grid md:grid-cols-[1.3fr_1fr] gap-8 items-center">
        <div>
          <p className="section-label mb-3">Not ready to order?</p>
          <h2 className="font-serif text-3xl md:text-4xl text-ink leading-tight mb-3">
            Hold a real one for ${SAMPLE_PRICE}. Or put fifteen minutes on the calendar.
          </h2>
          <p className="text-ink-soft text-[15px] md:text-base leading-relaxed max-w-xl">
            The sample kit ships in days and is credited in full toward your first run. A specialist walks your artwork, sizes, and timeline, proof on screen, and answers anything before you commit.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3 md:justify-end">
          <Link href="/samples" className="btn-ember !py-3.5 text-center">{CTA.sample}</Link>
          <Link href="/talk" className="btn-outline !py-3.5 text-center">{CTA.book}</Link>
        </div>
      </div>
    </section>
  );
}
