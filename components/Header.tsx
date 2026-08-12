"use client";
import Link from "next/link";
import { useState } from "react";

const NAV = [
  { href: "/products", label: "Products" },
  { href: "/pricing", label: "Pricing" },
  { href: "/gallery", label: "Our Work" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-navy text-cream shadow-lg">
      <div className="mx-auto max-w-7xl px-5 flex items-center justify-between h-16">
        <Link href="/" className="flex items-baseline gap-0.5">
          <span className="font-serif font-black text-2xl tracking-tight">KING</span>
          <span className="font-serif font-black text-2xl tracking-tight text-gold">BAGS</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-sm font-medium text-cream/80 hover:text-gold transition-colors">
              {n.label}
            </Link>
          ))}
          <Link href="/design" className="bg-gold text-navy text-sm font-bold px-5 py-2.5 rounded-md hover:bg-gold-light transition-colors">
            Design Your Bag
          </Link>
        </nav>
        <button className="md:hidden text-cream text-2xl" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? "✕" : "☰"}
        </button>
      </div>
      {open && (
        <nav className="md:hidden bg-navy-dark px-5 pb-5 flex flex-col gap-4">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-cream/90 font-medium" onClick={() => setOpen(false)}>
              {n.label}
            </Link>
          ))}
          <Link href="/design" className="bg-gold text-navy font-bold px-5 py-3 rounded-md text-center" onClick={() => setOpen(false)}>
            Design Your Bag
          </Link>
        </nav>
      )}
    </header>
  );
}
