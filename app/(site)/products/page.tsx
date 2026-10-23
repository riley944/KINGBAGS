import Link from "next/link";
import Reveal from "@/components/Reveal";
import SizeCards from "@/components/SizeCards";
import { PRODUCTS } from "@/lib/products";

export const metadata = {
  title: "The Grocery Tote | KINGBAGS",
  description:
    "One fully custom cut-and-sew bag with edge-to-edge printing, in four sizes, landscape or portrait. Laminated, glossy, built to the spec of national brand programs. From 1,500 bags.",
};

export default function ProductsPage() {
  const p = PRODUCTS[0];
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
      <Reveal>
        <p className="section-label mb-4">The Bag</p>
        <h1 className="font-serif text-4xl md:text-6xl text-ink leading-[1.05] mb-4">One bag. Four sizes. Both orientations.</h1>
        <p className="text-ink-soft text-lg max-w-2xl mb-14">{p.description}</p>
      </Reveal>
      <SizeCards />
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/products/grocery-tote" className="btn-ink !py-3 !px-7 !text-sm">Full spec and price chart</Link>
        <Link href="/custom-bags" className="btn-outline !py-3 !px-7 !text-sm">Get Your Price</Link>
      </div>
      <p className="text-[12px] text-ink-soft mt-6">Concept artwork shown; the construction and material are our real production capability.</p>
    </div>
  );
}
