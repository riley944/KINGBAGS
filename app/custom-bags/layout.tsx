import Link from "next/link";
import Logo from "@/components/Logo";
import { CONTACT_EMAIL, PHONE, PHONE_HREF } from "@/lib/site";

export const metadata = {
  title: "Custom Printed Bags, Priced in 30 Seconds | KINGBAGS",
  description:
    "Fully custom cut-and-sew bags with edge-to-edge print. Real delivered price in thirty seconds, then a fifteen-minute call with the team behind America's biggest bag programs. From 1,500 bags.",
  robots: { index: true, follow: true },
};

// Ad landing shell: logo, one way to reach a human, no site navigation to
// wander off into. The page itself carries the whole pitch.
export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-ink/10 bg-paper">
        <div className="mx-auto max-w-6xl px-5 h-[64px] flex items-center justify-between">
          <Link href="/" aria-label="KINGBAGS home"><Logo /></Link>
          <div className="flex items-center gap-5 text-[14px] font-semibold">
            {PHONE && <a href={PHONE_HREF} className="text-ink hover:text-ember">{PHONE}</a>}
            <a href={`mailto:${CONTACT_EMAIL}`} className="hidden sm:inline text-ink-soft hover:text-ink">{CONTACT_EMAIL}</a>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="bg-charcoal text-white/60 text-[13px]">
        <div className="mx-auto max-w-6xl px-5 py-8 flex flex-wrap items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} KINGBAGS · A King Universal Inc. company · Raleigh, NC</p>
          <p className="flex gap-4">
            <Link href="/faq" className="hover:text-white">FAQ</Link>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
          </p>
        </div>
      </footer>
    </>
  );
}
