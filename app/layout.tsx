import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "KINGBAGS — Fully Custom Cut & Sew Bags | From 1,500 Bags",
  description:
    "Fully custom cut-and-sew bags from the team behind bags for America's most loved brands. Edge-to-edge printing, instant pricing, air-freighted in as little as 4–6 weeks — not the industry's 60–90 days. From 1,500 bags.",
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
      "Design your fully custom bag online. Instant pricing. From 1,500 bags, air-freighted in as little as 4–6 weeks.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
