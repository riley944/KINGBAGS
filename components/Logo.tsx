// Brand wordmark: KING in ink, BAGS in the brand green, tight grotesk caps.
// `dark` renders it for dark grounds (footer, charcoal sections).

export default function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span className="font-grotesk font-extrabold text-[22px] tracking-[-0.01em] leading-none">
      <span className={dark ? "text-white" : "text-ink"}>KING</span>
      <span className={dark ? "text-[#4CA173]" : "text-ember"}>BAGS</span>
    </span>
  );
}
