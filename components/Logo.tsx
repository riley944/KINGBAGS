// Brand wordmark: KING in ink, BAGS in the brand green, heavy serif caps.
// `dark` renders it for dark grounds (footer, charcoal sections).

export default function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span className="font-hero font-extrabold text-[22px] tracking-[0.04em] leading-none">
      <span className={dark ? "text-white" : "text-ink"}>KING</span>
      <span className={dark ? "text-[#4CA173]" : "text-ember"}>BAGS</span>
    </span>
  );
}
