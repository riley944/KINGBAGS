"use client";
import Link from "next/link";
import { useState } from "react";

const NAV = [
  { href: "/products", label: "Bags" },
  { href: "/pricing", label: "Pricing" },
  { href: "/gallery", label: "Our Work" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-ink/10">
      <div className="mx-auto max-w-6xl px-5 flex items-center justify-between h-[68px]">
        <Link href="/" className="flex items-baseline gap-0.5">
          <span className="font-serif font-black text-2xl tracking-tight text-ink">KING</span>
          <span className="font-serif font-black text-2xl tracking-tight text-cobalt">BAGS</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-[15px] font-semibold text-ink hover:text-cobalt transition-colors">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:block">
          <Link href="/design" className="bg-cobalt text-white text-[15px] font-bold px-6 py-3 rounded-full hover:bg-cobalt-dark transition-all hover:scale-[1.03]">
            Design Your Bag
          </Link>
        </div>
        <button className="md:hidden text-ink text-2xl" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? "✕" : "☰"}
        </button>
      </div>
      {open && (
        <nav className="md:hidden bg-white border-t border-ink/10 px-5 py-5 flex flex-col gap-4">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-ink font-semibold text-lg" onClick={() => setOpen(false)}>
              {n.label}
            </Link>
          ))}
          <Link href="/design" className="bg-cobalt text-white font-bold px-6 py-4 rounded-full text-center" onClick={() => setOpen(false)}>
            Design Your Bag
          </Link>
        </nav>
      )}
    </header>
  );
}
