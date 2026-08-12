import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-bone border-t border-ink/5 text-ink-soft">
      <div className="mx-auto max-w-6xl px-5 py-14 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-baseline gap-0.5 mb-3">
            <span className="font-serif font-black text-xl text-ink">KING</span>
            <span className="font-serif font-black text-xl text-clay">BAGS</span>
          </div>
          <p className="text-sm leading-relaxed">
            Fully custom reusable bags from the team behind programs for America's most loved brands. A King Universal Inc. company.
          </p>
        </div>
        <div>
          <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-clay mb-4">Bags</div>
          <ul className="space-y-2 text-sm">
            <li><Link href="/products/grocery-tote" className="hover:text-clay">Grocery Totes</Link></li>
            <li><Link href="/products/insulated-cooler" className="hover:text-clay">Cooler Bags</Link></li>
            <li><Link href="/products/canvas-tote" className="hover:text-clay">Canvas Totes</Link></li>
            <li><Link href="/products/drawstring" className="hover:text-clay">Drawstring Bags</Link></li>
            <li><Link href="/products/wine-bag" className="hover:text-clay">Wine Bags</Link></li>
            <li><Link href="/products/produce-bag" className="hover:text-clay">Produce Bags</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-clay mb-4">Company</div>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-clay">About Us</Link></li>
            <li><Link href="/pricing" className="hover:text-clay">Pricing</Link></li>
            <li><Link href="/gallery" className="hover:text-clay">Our Work</Link></li>
            <li><Link href="/design" className="hover:text-clay">Design Your Bag</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-clay mb-4">Get In Touch</div>
          <p className="text-sm leading-relaxed">
            Volume over 10,000 units?<br />
            <a href="mailto:hello@kingbags.com" className="text-clay hover:text-clay-dark font-semibold">hello@kingbags.com</a>
          </p>
        </div>
      </div>
      <div className="border-t border-ink/5 py-5 text-center text-xs text-ink-soft/50">
        © {new Date().getFullYear()} KINGBAGS · A King Universal Inc. Company · Raleigh, NC
      </div>
    </footer>
  );
}
