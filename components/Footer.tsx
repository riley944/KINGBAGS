import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-ink text-white/80">
      <div className="mx-auto max-w-6xl px-5 py-16 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-baseline gap-0.5 mb-4">
            <span className="font-serif font-black text-2xl text-white">KING</span>
            <span className="font-serif font-black text-2xl text-cobalt" style={{ color: "#5B78F0" }}>BAGS</span>
          </div>
          <p className="text-[15px] leading-relaxed">
            Fully custom bags from the team behind programs for America's most loved brands. A King Universal Inc. company.
          </p>
        </div>
        <div>
          <div className="text-xs font-extrabold tracking-[0.2em] uppercase text-white mb-4">Bags</div>
          <ul className="space-y-2.5 text-[15px]">
            <li><Link href="/products/grocery-tote" className="hover:text-white">Grocery Totes</Link></li>
            <li><Link href="/products/canvas-tote" className="hover:text-white">Canvas Totes</Link></li>
            <li><Link href="/products/beach-bag" className="hover:text-white">Beach Bags</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-extrabold tracking-[0.2em] uppercase text-white mb-4">Company</div>
          <ul className="space-y-2.5 text-[15px]">
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
            <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
            <li><Link href="/gallery" className="hover:text-white">Our Work</Link></li>
            <li><Link href="/design" className="hover:text-white">Design Your Bag</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-extrabold tracking-[0.2em] uppercase text-white mb-4">Get In Touch</div>
          <p className="text-[15px] leading-relaxed">
            Volume over 25,000 bags?<br />
            <a href="mailto:hello@kingbags.com" className="text-white font-bold hover:underline">hello@kingbags.com</a>
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-sm text-white/50">
        © {new Date().getFullYear()} KINGBAGS · A King Universal Inc. Company · Raleigh, NC
      </div>
    </footer>
  );
}
