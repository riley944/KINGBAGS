import Link from "next/link";
import Reveal from "@/components/Reveal";
import BookCall from "@/components/BookCall";
import { CTA, SAMPLE_PRICE } from "@/lib/site";

export const metadata = {
  title: "Book Your Proof Review | KINGBAGS",
  description:
    "Fifteen minutes with a KINGBAGS specialist: your proof on screen, sizes, colors, quantity, and timing answered before you approve anything.",
};

const COVER = [
  "Your proof on screen, and any change you want made to it",
  "Which bag and size fits what you're carrying",
  "Quantity, price, and the real delivered date",
  "Samples, artwork, and how payment works",
];

export default async function TalkPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const email = sp.email;
  const name = sp.name;
  const summary = sp.q;

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-5 grid md:grid-cols-[1fr_1.2fr] gap-12 items-start">
        <Reveal>
          <div>
            <p className="section-label mb-5">Proof review</p>
            <h1 className="font-serif text-4xl md:text-6xl text-ink leading-[1.05] mb-6">
              Fifteen minutes with someone who has shipped millions of bags.
            </h1>
            <p className="text-lg text-ink-soft leading-relaxed mb-8">
              Nobody writes a five-figure check to a website. Pick a time and a member of the Raleigh team walks your project with you, proof on screen. No pitch, no pressure, and nothing is made or charged until you approve.
            </p>
            {summary && (
              <div className="bg-ember-tint rounded-2.5xl px-5 py-4 mb-8">
                <p className="text-[11px] font-grotesk font-bold tracking-[0.18em] uppercase text-ember mb-1">Your quote</p>
                <p className="font-semibold text-ink">{summary}</p>
              </div>
            )}
            <div className="text-[11px] font-grotesk font-bold tracking-[0.18em] uppercase text-ink-soft mb-3">We&apos;ll cover</div>
            <ul className="space-y-2.5 mb-10">
              {COVER.map((c) => (
                <li key={c} className="flex gap-2.5 text-[15px] text-ink leading-snug">
                  <span className="text-ember font-bold shrink-0">✓</span> {c}
                </li>
              ))}
            </ul>
            <div className="bg-smoke rounded-2.5xl p-6">
              <p className="font-semibold text-ink mb-1">Haven&apos;t priced a bag yet?</p>
              <p className="text-[14px] text-ink-soft mb-4">Two minutes in the studio gets you a locked all-in price and a better call.</p>
              <div className="flex flex-wrap gap-2.5">
                <Link href="/design" className="btn-ink !py-3 !px-6 !text-sm">{CTA.primary}</Link>
                <Link href="/samples" className="btn-outline !py-3 !px-6 !text-sm">Hold one first, ${SAMPLE_PRICE}</Link>
              </div>
            </div>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <BookCall email={email} name={name} summary={summary} />
        </Reveal>
      </div>
    </section>
  );
}
