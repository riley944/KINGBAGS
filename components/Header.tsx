"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { useState } from "react";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Bags" },
  { href: "/pricing", label: "Pricing" },
  { href: "/samples", label: "Samples" },
  { href: "/gallery", label: "Lookbook" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  return (
    <header className={`sticky top-0 z-50 border-b border-ink/10 ${open ? "bg-paper" : "bg-paper/90 backdrop-blur-md"}`}>
      <div className="mx-auto max-w-6xl px-5 flex items-center justify-between h-[68px]">
        <Link href="/" aria-label="KINGBAGS home">
          <Logo />
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
        <div className="md:hidden fixed inset-0 z-50 bg-paper flex flex-col">
          <div className="flex items-center justify-between h-[68px] px-5 border-b border-ink/10 shrink-0">
            <Link href="/" aria-label="KINGBAGS home" onClick={() => setOpen(false)}>
              <Logo />
            </Link>
            <button className="text-ink text-2xl w-10 h-10 flex items-center justify-center" onClick={() => setOpen(false)} aria-label="Close menu">
              ✕
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-5">
            {NAV.map((n) => {
              const active = n.href === "/" ? path === "/" : path.startsWith(n.href);
              return (
                <Link key={n.href} href={n.href} onClick={() => setOpen(false)}
                  className="flex items-baseline justify-between py-5 border-b border-ink/10 group">
                  <span className={`font-hero font-bold text-4xl ${active ? "text-ember" : "text-ink"}`}>{n.label}</span>
                  <span className="text-ember text-xl opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </Link>
              );
            })}
          </nav>
          <div className="px-5 pb-8 pt-4 shrink-0">
            <Link href="/design" className="btn-ember w-full !py-4 text-center" onClick={() => setOpen(false)}>
              Design Your Bag
            </Link>
            <p className="text-center text-sm text-ink-soft mt-4">
              <a href="mailto:hello@kingbags.com" className="hover:text-ink">hello@kingbags.com</a>
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
