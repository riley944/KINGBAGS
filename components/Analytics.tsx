import Script from "next/script";

// GA4 loads only when NEXT_PUBLIC_GA_ID is set (Vercel env var), so local
// and preview builds stay untracked until the ID is configured.
// NEXT_PUBLIC_GADS_ID (AW-XXXXXXXXX) adds the Google Ads tag on the same
// gtag loader so conversions can be sent directly (see lib/track.ts).
export default function Analytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID;
  const ads = process.env.NEXT_PUBLIC_GADS_ID;
  if (!id && !ads) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id || ads}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
${id ? `gtag('config', '${id}');` : ""}
${ads ? `gtag('config', '${ads}', { allow_enhanced_conversions: true });` : ""}`}
      </Script>
    </>
  );
}
