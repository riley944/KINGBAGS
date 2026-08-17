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
    title: `${p.name} — Fully Custom, $${p.tiers[0].unitPrice.toFixed(2)}/Bag at ${p.minOrder.toLocaleString()} | KINGBAGS`,
    description: `${p.description.slice(0, 150)}...`,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
      <Link href="/products" className="text-sm text-ember font-semibold hover:underline">← All Bags</Link>
      <div className="grid md:grid-cols-2 gap-12 mt-8">
        <div className="aspect-square bg-smoke rounded-4xl flex items-center justify-center">
          <span className="font-serif italic text-ink/20">[ {p.name} photography ]</span>
        </div>
        <div>
          <h1 className="font-serif font-black text-4xl md:text-5xl text-ink mb-3">{p.name}</h1>
          <p className="text-lg text-ember font-semibold mb-6">{p.tagline}</p>
          <p className="text-ink-soft text-lg leading-relaxed mb-9">{p.description}</p>

          <div className="mb-9">
            <div className="text-[11px] font-bold tracking-[0.18em] uppercase text-ink-soft mb-3">Sizes</div>
            <div className="flex flex-wrap gap-2.5">
              {p.sizes.map((s) => (
                <span key={s.code} className="bg-white shadow-soft rounded-xl px-4 py-2.5 text-sm">
                  <span className="font-semibold text-ink">{s.label}</span>
                  <span className="text-ink-soft ml-2">{s.dims}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-8 mb-9 text-[15px]">
            <div><span className="font-semibold text-ink">Minimum:</span> <span className="text-ink-soft">{p.minOrder.toLocaleString()} bags</span></div>
            <div><span className="font-semibold text-ink">Lead time:</span> <span className="text-ink-soft">{p.leadTime}</span></div>
          </div>

          <div className="bg-white rounded-2.5xl shadow-soft overflow-hidden mb-9">
            <div className="bg-charcoal text-white text-[11px] font-bold tracking-[0.18em] uppercase px-6 py-3.5">Quantity Pricing</div>
            <table className="w-full text-[15px]">
              <tbody>
                {p.tiers.map((t, i) => (
                  <tr key={t.minQty} className={i % 2 ? "bg-paper" : ""}>
                    <td className="px-6 py-3.5 font-medium text-ink">{t.minQty.toLocaleString()}+ bags</td>
                    <td className="px-6 py-3.5 text-right font-bold text-ink">${t.unitPrice.toFixed(2)}/bag</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Link href={`/design?style=${p.slug}`} className="btn-ember w-full text-center !py-4">
            Design This Bag
          </Link>
        </div>
      </div>
    </div>
  );
}
