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
    title: `${p.name} — Custom Printed From $${p.tiers[p.tiers.length - 1].unitPrice.toFixed(2)}/Unit | KINGBAGS`,
    description: `${p.description.slice(0, 150)}...`,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();

  return (
    <div className="mx-auto max-w-7xl px-5 py-16">
      <Link href="/products" className="text-sm text-gold-dark font-semibold hover:underline">← All Products</Link>
      <div className="grid md:grid-cols-2 gap-12 mt-6">
        <div className="aspect-square bg-navy/5 rounded-2xl flex items-center justify-center">
          <span className="font-serif italic text-navy/20">[ {p.name} photography ]</span>
        </div>
        <div>
          <h1 className="font-serif font-bold text-4xl text-navy mb-2">{p.name}</h1>
          <p className="text-lg text-gold-dark font-medium mb-6">{p.tagline}</p>
          <p className="text-ink/70 leading-relaxed mb-8">{p.description}</p>

          <div className="mb-6">
            <div className="text-xs font-bold tracking-[0.15em] uppercase text-navy/50 mb-2">Materials</div>
            <div className="flex flex-wrap gap-2">
              {p.materials.map((m) => (
                <span key={m} className="bg-white border border-navy/10 rounded-full px-4 py-1.5 text-sm">{m}</span>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <div className="text-xs font-bold tracking-[0.15em] uppercase text-navy/50 mb-2">Colors</div>
            <div className="flex flex-wrap gap-2">
              {p.colors.map((c) => (
                <span key={c} className="bg-white border border-navy/10 rounded-full px-4 py-1.5 text-sm">{c}</span>
              ))}
            </div>
          </div>
          <div className="flex gap-8 mb-8 text-sm">
            <div><span className="font-bold text-navy">Min Order:</span> {p.minOrder.toLocaleString()} units</div>
            <div><span className="font-bold text-navy">Lead Time:</span> {p.leadTime}</div>
          </div>

          {/* Pricing table */}
          <div className="bg-white rounded-xl border border-navy/10 overflow-hidden mb-8">
            <div className="bg-navy text-cream text-xs font-bold tracking-[0.15em] uppercase px-5 py-3">Quantity Pricing</div>
            <table className="w-full text-sm">
              <tbody>
                {p.tiers.map((t, i) => (
                  <tr key={t.minQty} className={i % 2 ? "bg-cream/50" : ""}>
                    <td className="px-5 py-3 font-medium">{t.minQty.toLocaleString()}+ units</td>
                    <td className="px-5 py-3 text-right font-bold text-navy">${t.unitPrice.toFixed(2)}/unit</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Link href={`/design?style=${p.slug}`} className="btn-gold w-full text-center">
            Design This Bag
          </Link>
        </div>
      </div>
    </div>
  );
}
