"use client";
import { useEffect } from "react";
import { CALENDLY_URL, CONTACT_EMAIL } from "@/lib/site";
import { track } from "@/lib/track";

// The booking step. Embeds Calendly when NEXT_PUBLIC_CALENDLY_URL is set
// (prefilled with the visitor's details and quote), otherwise falls back to
// a prewritten email. Fires the `book_call` conversion when a slot is booked.
type Props = {
  email?: string;
  name?: string;
  summary?: string; // e.g. "Grocery Tote · Large · 2,500 bags · $7,950"
  value?: number;
  compact?: boolean;
};

export default function BookCall({ email, name, summary, value, compact = false }: Props) {
  useEffect(() => {
    if (!CALENDLY_URL) return;
    const onMsg = (e: MessageEvent) => {
      if (typeof e.data === "object" && e.data?.event === "calendly.event_scheduled") {
        track("book_call", { kb_action: "proof_review_booked", value: value ?? 0, currency: "USD" });
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [value]);

  if (CALENDLY_URL) {
    const u = new URL(CALENDLY_URL);
    u.searchParams.set("hide_gdpr_banner", "1");
    u.searchParams.set("primary_color", "14532d");
    if (email) u.searchParams.set("email", email);
    if (name) u.searchParams.set("name", name);
    if (summary) u.searchParams.set("a1", summary);
    return (
      <div className={`bg-white rounded-2.5xl border border-ink/10 overflow-hidden ${compact ? "" : "shadow-soft"}`}>
        <iframe
          title="Book your proof review with KINGBAGS"
          src={u.toString()}
          className={`w-full border-0 ${compact ? "h-[620px]" : "h-[760px]"}`}
          loading="lazy"
        />
      </div>
    );
  }

  const subject = "Book my proof review";
  const body = `Hi KINGBAGS,\n\nI'd like to book a fifteen-minute proof review.\n\n${summary ? `My quote: ${summary}\n` : ""}${name ? `Name: ${name}\n` : ""}Times that work for me:\n`;
  const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return (
    <div className={`bg-white rounded-2.5xl border border-ink/10 ${compact ? "p-5" : "p-8 md:p-10 shadow-soft"}`}>
      {!compact && <h2 className="font-serif text-2xl text-ink mb-3">Pick a time by email</h2>}
      <p className={`text-ink-soft leading-relaxed ${compact ? "text-[13px] mb-4" : "mb-6"}`}>
        Send two or three windows that work for you. A specialist confirms within one business day and brings your proof to the call.
      </p>
      <a
        href={href}
        onClick={() => track("book_call", { kb_action: "proof_review_requested", value: value ?? 0, currency: "USD" })}
        className={`btn-ember w-full text-center ${compact ? "!py-3.5 !text-[14px]" : "!py-4"}`}
      >
        Email to book my proof review
      </a>
    </div>
  );
}
