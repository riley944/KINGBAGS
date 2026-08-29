import type { Metadata } from "next";
import { Fraunces, Instrument_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["600", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-hero",
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
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
    <html lang="en" className={`${fraunces.variable} ${instrumentSans.variable} ${instrumentSerif.variable}`}>
      <body>
        <noscript>
          <style>{`.reveal { opacity: 1 !important; }`}</style>
        </noscript>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
