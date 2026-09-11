import type { Metadata } from "next";
import { DM_Serif_Display, DM_Sans, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import Analytics from "@/components/Analytics";
import AttributionCapture from "@/components/AttributionCapture";

// Type system: DM Serif Display for headlines and prices (one weight —
// font-synthesis is disabled in globals.css so weight utilities don't
// fake-bold it), DM Sans for body and UI, Bricolage Grotesque as the
// accent for the wordmark, labels, buttons, and stat numerals.
const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://kingbags.co"),
  title: "KINGBAGS — Fully Custom Cut & Sew Bags | From 1,500 Bags",
  description:
    "Fully custom cut-and-sew bags from the team behind some of America's largest bag programs. Edge-to-edge printing, instant pricing, delivered in 4–6 weeks. From 1,500 bags.",
  keywords: [
    "custom reusable bags",
    "branded tote bags bulk",
    "custom grocery bags",
    "custom bags for business",
    "wholesale reusable bags",
  ],
  openGraph: {
    title: "KINGBAGS — Fully Custom Cut & Sew Bags",
    description:
      "Design your fully custom bag online. Instant pricing, from 1,500 bags, delivered in 4–6 weeks.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${dmSans.variable} ${bricolage.variable}`}>
      <body>
        <noscript>
          <style>{`.reveal { opacity: 1 !important; }`}</style>
        </noscript>
        <Analytics />
        <AttributionCapture />
        {children}
      </body>
    </html>
  );
}
