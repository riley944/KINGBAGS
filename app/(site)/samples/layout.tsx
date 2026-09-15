import Reveal from "@/components/Reveal";
import { MIN_ORDER } from "@/lib/products";

export const metadata = {
  title: "Sample Kits | KINGBAGS",
  description:
    "Hold the quality before you order. A $35 Quality Kit with a finished program bag, a printed rendering, and a spec sheet, or a $300 Exact Sample of your own design — both fully credited toward your order.",
};

// The intro is server-rendered here so crawlers and link previews see real
// content; the kits and checkout state hydrate on the client inside.
export default function SamplesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <div className="max-w-2xl mx-auto text-center mb-14">
        <Reveal>
          <p className="section-label mb-5">Samples</p>
          <h1 className="font-serif text-4xl md:text-6xl text-ink leading-[1.05] mb-6">
            Hold it before you order it.
          </h1>
          <p className="text-lg text-ink-soft leading-relaxed">
            Nobody should order {MIN_ORDER.toLocaleString()} bags they&apos;ve never touched. Every sample is fully
            credited toward your order — so if you were going to order anyway, it costs you nothing.
          </p>
        </Reveal>
      </div>
      {children}
    </div>
  );
}
