// Brand lockup: green bag-tile mark + single-color heavy wordmark.
// `dark` renders the wordmark for dark grounds (footer, charcoal sections).

export default function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg viewBox="0 0 64 64" className="w-8 h-8 shrink-0" aria-hidden="true">
        <rect width="64" height="64" rx="14" fill="#14532D" />
        <g fill="none" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 17 26 L 20 48 Q 20.3 51 23.5 51 L 40.5 51 Q 43.7 51 44 48 L 47 26 Z" />
          <path d="M 25 26 Q 25 15 32 15 Q 39 15 39 26" />
        </g>
      </svg>
      <span className={`font-hero font-extrabold text-[21px] tracking-[-0.01em] leading-none ${dark ? "text-white" : "text-ink"}`}>
        KINGBAGS
      </span>
    </span>
  );
}
