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
    <header className="sticky top-0 z-50 bg-bone/85 backdrop-blur-md border-b border-ink/5">
      <div className="mx-auto max-w-6xl px-5 flex items-center justify-between h-16">
        <Link href="/" className="flex items-baseline gap-0.5">
          <span className="font-serif font-black text-xl tracking-tight text-ink">KING</span>
          <span className="font-serif font-black text-xl tracking-tight text-clay">BAGS</span>
        </Link>
        <nav className="hidden md:flex items-center gap-7">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-sm font-medium text-ink-soft hover:text-ink transition-colors">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:block">
          <Link href="/design" className="bg-clay text-white text-sm font-bold px-6 py-2.5 rounded-full hover:bg-clay-dark transition-all hover:scale-[1.03]">
            Design Your Bag
          </Link>
        </div>
        <button className="md:hidden text-ink text-2xl" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? "✕" : "☰"}
        </button>
      </div>
      {open && (
        <nav className="md:hidden bg-bone border-t border-ink/5 px-5 py-5 flex flex-col gap-4">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-ink-soft font-medium" onClick={() => setOpen(false)}>
              {n.label}
            </Link>
          ))}
          <Link href="/design" className="bg-clay text-white font-bold px-6 py-3.5 rounded-full text-center" onClick={() => setOpen(false)}>
            Design Your Bag
          </Link>
        </nav>
      )}
    </header>
  );
}
