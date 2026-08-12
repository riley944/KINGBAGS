import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy-dark text-cream/70">
      <div className="mx-auto max-w-7xl px-5 py-14 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-baseline gap-0.5 mb-3">
            <span className="font-serif font-black text-xl text-cream">KING</span>
            <span className="font-serif font-black text-xl text-gold">BAGS</span>
          </div>
          <p className="text-sm leading-relaxed">
            Custom reusable bags from the team behind programs for America's most loved brands. A King Universal Inc. company.
          </p>
        </div>
        <div>
          <div className="text-xs font-bold tracking-[0.15em] uppercase text-gold mb-4">Products</div>
          <ul className="space-y-2 text-sm">
            <li><Link href="/products/grocery-tote" className="hover:text-gold">Grocery Totes</Link></li>
            <li><Link href="/products/insulated-cooler" className="hover:text-gold">Cooler Bags</Link></li>
            <li><Link href="/products/canvas-tote" className="hover:text-gold">Canvas Totes</Link></li>
            <li><Link href="/products/drawstring" className="hover:text-gold">Drawstring Bags</Link></li>
            <li><Link href="/products/wine-bag" className="hover:text-gold">Wine Bags</Link></li>
            <li><Link href="/products/produce-bag" className="hover:text-gold">Produce Bags</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-bold tracking-[0.15em] uppercase text-gold mb-4">Company</div>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-gold">About Us</Link></li>
            <li><Link href="/pricing" className="hover:text-gold">Pricing</Link></li>
            <li><Link href="/gallery" className="hover:text-gold">Our Work</Link></li>
            <li><Link href="/design" className="hover:text-gold">Design Your Bag</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-bold tracking-[0.15em] uppercase text-gold mb-4">Get In Touch</div>
          <p className="text-sm leading-relaxed">
            Volume over 10,000 units?<br />
            <a href="mailto:hello@kingbags.com" className="text-gold hover:text-gold-light">hello@kingbags.com</a>
          </p>
        </div>
      </div>
      <div className="border-t border-cream/10 py-5 text-center text-xs text-cream/40">
        © {new Date().getFullYear()} KINGBAGS · A King Universal Inc. Company · Raleigh, NC
      </div>
    </footer>
  );
}
