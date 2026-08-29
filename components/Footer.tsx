import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white/75">
      <div className="mx-auto max-w-6xl px-5 py-16 grid gap-10 md:grid-cols-4">
        <div>
          <div className="mb-4">
            <Logo dark />
          </div>
          <p className="text-[15px] leading-relaxed">
            Fully custom bags from the team behind some of America's largest bag programs. A King Universal Inc. company.
          </p>
        </div>
        <div>
          <div className="text-xs font-bold tracking-[0.2em] uppercase text-white mb-4">Bags</div>
          <ul className="space-y-2.5 text-[15px]">
            <li><Link href="/products/grocery-tote" className="hover:text-white">The Grocery Tote</Link></li>
            <li><Link href="/products/canvas-tote" className="hover:text-white">The Canvas Tote</Link></li>
            <li><Link href="/products/beach-bag" className="hover:text-white">The Beach Bag</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-bold tracking-[0.2em] uppercase text-white mb-4">Company</div>
          <ul className="space-y-2.5 text-[15px]">
            <li><Link href="/about" className="hover:text-white">About</Link></li>
            <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
            <li><Link href="/samples" className="hover:text-white">Sample Kits</Link></li>
            <li><Link href="/gallery" className="hover:text-white">Lookbook</Link></li>
            <li><Link href="/design" className="hover:text-white">Start Your Order</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-bold tracking-[0.2em] uppercase text-white mb-4">Get In Touch</div>
          <p className="text-[15px] leading-relaxed">
            Volume over 50,000 bags?<br />
            <a href="mailto:hello@kingbags.com" className="text-white font-semibold hover:underline">hello@kingbags.com</a>
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-sm text-white/45">
        © {new Date().getFullYear()} KINGBAGS · A King Universal Inc. Company · Raleigh, NC
      </div>
    </footer>
  );
}
