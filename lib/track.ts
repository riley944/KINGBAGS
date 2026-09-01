// Conversion event helper. No-ops unless GA is loaded (NEXT_PUBLIC_GA_ID set).
export function track(event: string, params?: Record<string, string | number>) {
  if (typeof window === "undefined") return;
  const w = window as typeof window & { gtag?: (...args: unknown[]) => void };
  if (w.gtag) w.gtag("event", event, params ?? {});
}
