"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Bags" },
  { href: "/pricing", label: "Pricing" },
  { href: "/samples", label: "Samples" },
  { href: "/gallery", label: "Our Work" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  return (
    <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur-md border-b border-ink/10">
      <div className="mx-auto max-w-6xl px-5 flex items-center justify-between h-[68px]">
        <Link href="/" className="flex items-baseline gap-0.5">
          <span className="font-serif font-black text-2xl tracking-tight text-ink">KING</span>
          <span className="font-serif font-black text-2xl tracking-tight text-ember">BAGS</span>
        </Link>
        <nav className="hidden md:flex items-center gap-7">
          {NAV.map((n) => {
            const active = n.href === "/" ? path === "/" : path.startsWith(n.href);
            return (
              <Link key={n.href} href={n.href}
                className={`text-[15px] font-semibold transition-colors ${active ? "text-ember" : "text-ink hover:text-ember"}`}>
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden md:block">
          <Link href="/design" className="bg-ember text-white text-[15px] font-semibold px-6 py-3 rounded-full hover:bg-ember-dark transition-all hover:scale-[1.03]">
            Design Your Bag
          </Link>
        </div>
        <button className="md:hidden text-ink text-2xl" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? "✕" : "☰"}
        </button>
      </div>
      {open && (
        <nav className="md:hidden bg-paper border-t border-ink/10 px-5 py-5 flex flex-col gap-4">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-ink font-semibold text-lg" onClick={() => setOpen(false)}>
              {n.label}
            </Link>
          ))}
          <Link href="/design" className="bg-ember text-white font-semibold px-6 py-4 rounded-full text-center" onClick={() => setOpen(false)}>
            Design Your Bag
          </Link>
        </nav>
      )}
    </header>
  );
}
