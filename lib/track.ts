// Conversion event helper. No-ops unless gtag is loaded (NEXT_PUBLIC_GA_ID
// or NEXT_PUBLIC_GADS_ID set).
//
// Two conversions matter for ads: `generate_lead` (price form submitted) and
// `book_call` (Calendly slot confirmed). Both go to GA4 as events. When the
// Google Ads conversion labels are set, the same moment also fires a direct
// Ads conversion so bidding can optimize without waiting on the GA4 import:
//   NEXT_PUBLIC_GADS_ID          AW-123456789
//   NEXT_PUBLIC_GADS_LEAD_LABEL  AbCdEfGhIj (label for "Price request")
//   NEXT_PUBLIC_GADS_BOOK_LABEL  KlMnOpQrSt (label for "Call booked")
type Gtag = (...args: unknown[]) => void;

const ADS_ID = process.env.NEXT_PUBLIC_GADS_ID || "";
const ADS_LABEL: Record<string, string | undefined> = {
  generate_lead: process.env.NEXT_PUBLIC_GADS_LEAD_LABEL,
  book_call: process.env.NEXT_PUBLIC_GADS_BOOK_LABEL,
};

export function track(event: string, params?: Record<string, string | number>) {
  if (typeof window === "undefined") return;
  const w = window as typeof window & { gtag?: Gtag };
  if (!w.gtag) return;
  w.gtag("event", event, params ?? {});
  const label = ADS_LABEL[event];
  if (ADS_ID && label) {
    w.gtag("event", "conversion", {
      send_to: `${ADS_ID}/${label}`,
      value: params?.value ?? 0,
      currency: params?.currency ?? "USD",
    });
  }
}

// Enhanced conversions: hand Google a hashed email so it can match the
// conversion to the click even without cookies. Safe to call before track().
export function identify(email: string) {
  if (typeof window === "undefined" || !ADS_ID) return;
  const w = window as typeof window & { gtag?: Gtag };
  w.gtag?.("set", "user_data", { email: email.trim().toLowerCase() });
}
