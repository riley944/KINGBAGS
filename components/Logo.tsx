// Brand wordmark: KINGBAGS in heavy high-contrast serif caps.
// `dark` renders it for dark grounds (footer, charcoal sections).

export default function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span
      className={`font-hero font-extrabold text-[22px] tracking-[0.04em] leading-none ${dark ? "text-white" : "text-ink"}`}
    >
      KINGBAGS
    </span>
  );
}
