import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Marketing-site chrome. The /admin ops app lives outside this group and
// renders its own.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
