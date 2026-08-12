import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "KINGBAGS — Custom Reusable Bags for Your Business | 500 Unit Minimums",
  description:
    "Premium custom reusable bags from the team behind bags for America's most loved brands. Grocery totes, cooler bags, canvas totes and more. 500 unit minimums, instant pricing, delivered in 3–4 weeks.",
  keywords: [
    "custom reusable bags",
    "branded tote bags bulk",
    "custom grocery bags",
    "custom bags for business",
    "wholesale reusable bags",
  ],
  openGraph: {
    title: "KINGBAGS — Custom Reusable Bags for Your Business",
    description:
      "Design your custom bag online. Instant pricing. 500 unit minimums. Delivered in 3–4 weeks.",
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
