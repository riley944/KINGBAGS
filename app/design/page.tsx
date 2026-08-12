import Link from "next/link";

export const metadata = {
  title: "Design Your Custom Bag | KINGBAGS",
  description: "The KINGBAGS configurator — pick your style, upload art, get instant pricing. Coming in Sprint 2.",
};

export default function DesignPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-24 text-center">
      <p className="section-label mb-4">The Configurator</p>
      <h1 className="font-serif font-bold text-4xl text-navy mb-4">Design Your Bag</h1>
      <p className="text-ink/60 mb-8 leading-relaxed">
        The full configurator — style picker, art upload, and instant pricing — lands here in Sprint 2.
        For now, browse the lineup and pricing, or reach out directly and we'll quote you within 24 hours.
      </p>
      <div className="flex justify-center gap-4">
        <Link href="/products" className="btn-gold">Browse Styles</Link>
        <a href="mailto:hello@kingbags.com" className="btn-outline">Email Us</a>
      </div>
    </div>
  );
}
