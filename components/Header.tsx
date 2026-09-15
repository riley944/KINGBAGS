"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { useState } from "react";
import { CTA } from "@/lib/site";

const NAV = [
  { href: "/products", label: "Bags" },
  { href: "/pricing", label: "Pricing" },
  { href: "/samples", label: "Samples" },
  { href: "/gallery", label: "Lookbook" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const talkActive = path.startsWith("/talk");
  return (
    <header className={`sticky top-0 z-50 border-b border-ink/10 ${open ? "bg-paper" : "bg-paper/90 backdrop-blur-md"}`}>
      <div className="mx-auto max-w-6xl px-5 flex items-center justify-between h-[68px]">
        <Link href="/" aria-label="KINGBAGS home">
          <Logo />
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {NAV.map((n) => {
            const active = path.startsWith(n.href);
            return (
              <Link key={n.href} href={n.href}
                className={`relative text-[15px] font-semibold transition-colors after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:h-[2px] after:bg-ember after:rounded-full after:transition-all ${active ? "text-ember after:w-full" : "text-ink hover:text-ember after:w-0 hover:after:w-full"}`}>
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <Link href="/account"
            className={`text-[14px] font-semibold transition-colors mr-2 ${path.startsWith("/account") ? "text-ember" : "text-ink-soft hover:text-ink"}`}>
            Account
          </Link>
          <Link href="/talk"
            className={`text-[14px] font-bold px-4 py-2.5 rounded-full border transition-all inline-flex items-center gap-2 font-grotesk ${talkActive ? "border-ember text-ember" : "border-ink/20 text-ink hover:border-ember hover:text-ember"}`}>
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
            </svg>
            {CTA.talk}
          </Link>
          <Link href="/design" className="group bg-ember text-white text-[14px] font-bold font-grotesk px-5 py-2.5 rounded-full hover:bg-ember-dark transition-all hover:scale-[1.03] inline-flex items-center gap-2">
            {CTA.primary}
            <span className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
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
            {[{ href: "/", label: "Home" }, ...NAV, { href: "/talk", label: CTA.talk }].map((n) => {
              const active = n.href === "/" ? path === "/" : path.startsWith(n.href);
              return (
                <Link key={n.href} href={n.href} onClick={() => setOpen(false)}
                  className="flex items-baseline justify-between py-4 border-b border-ink/10 group">
                  <span className={`font-hero text-3xl ${active ? "text-ember" : "text-ink"}`}>{n.label}</span>
                  <span className="text-ember text-xl opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </Link>
              );
            })}
          </nav>
          <div className="px-5 pb-8 pt-4 shrink-0">
            <Link href="/account" onClick={() => setOpen(false)}
              className="block text-center font-semibold text-ink py-3 mb-2 rounded-full border border-ink/15 hover:border-ember hover:text-ember transition-colors">
              Your Account
            </Link>
            <Link href="/design" className="btn-ember w-full !py-4 text-center" onClick={() => setOpen(false)}>
              {CTA.primary} →
            </Link>
            <p className="text-center text-[12px] text-ink-soft mt-3">{CTA.reassurance}</p>
          </div>
        </div>
      )}
    </header>
  );
}
