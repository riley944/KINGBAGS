// Brand wordmark: KING in ink, BAGS one step lighter, tight grotesk caps.
// `dark` renders it for dark grounds (footer, charcoal sections).

export default function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span className="font-grotesk font-extrabold text-[22px] tracking-[-0.01em] leading-none">
      <span className={dark ? "text-white" : "text-ink"}>KING</span>
      <span className={dark ? "text-white/60" : "text-ink-soft"}>BAGS</span>
    </span>
  );
}
