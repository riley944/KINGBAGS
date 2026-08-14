import Link from "next/link";
import { notFound } from "next/navigation";
import { PRODUCTS, getProduct } from "@/lib/products";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  return {
    title: `${p.name} — Fully Custom From $${p.tiers[p.tiers.length - 1].unitPrice.toFixed(2)}/Bag | KINGBAGS`,
    description: `${p.description.slice(0, 150)}...`,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <Link href="/products" className="text-sm text-forest font-semibold hover:underline">← All Bags</Link>
      <div className="grid md:grid-cols-2 gap-12 mt-6">
        <div className="aspect-square bg-sand rounded-4xl flex items-center justify-center">
          <span className="font-serif italic text-ink/15">[ {p.name} photography ]</span>
        </div>
        <div>
          <h1 className="font-serif font-black text-4xl text-ink mb-2">{p.name}</h1>
          <p className="text-lg text-forest font-medium mb-6">{p.tagline}</p>
          <p className="text-ink-soft leading-relaxed mb-8">{p.description}</p>

          <div className="mb-8">
            <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-ink-soft mb-3">Sizes</div>
            <div className="flex flex-wrap gap-2">
              {p.sizes.map((s) => (
                <span key={s.code} className="bg-white shadow-soft rounded-xl px-4 py-2.5 text-sm">
                  <span className="font-bold text-ink">{s.label}</span>
                  <span className="text-ink-soft ml-2">{s.dims}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-8 mb-8 text-sm">
            <div><span className="font-bold text-ink">Minimum:</span> {p.minOrder.toLocaleString()} bags</div>
            <div><span className="font-bold text-ink">Lead time:</span> {p.leadTime}</div>
          </div>

          <div className="bg-white rounded-2.5xl shadow-soft overflow-hidden mb-8">
            <div className="bg-forest text-bone text-[11px] font-bold tracking-[0.2em] uppercase px-5 py-3">Quantity Pricing</div>
            <table className="w-full text-sm">
              <tbody>
                {p.tiers.map((t, i) => (
                  <tr key={t.minQty} className={i % 2 ? "bg-bone" : ""}>
                    <td className="px-5 py-3 font-medium text-ink">{t.minQty.toLocaleString()}+ bags</td>
                    <td className="px-5 py-3 text-right font-bold text-ink">${t.unitPrice.toFixed(2)}/bag</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Link href={`/design?style=${p.slug}`} className="btn-primary w-full text-center">
            Design This Bag
          </Link>
        </div>
      </div>
    </div>
  );
}
