// Labeled form field used across the order path (studio rail, continue
// flow). Small grotesk label above the control, optional hint.
export const inputCls =
  "w-full rounded-xl px-4 py-3.5 bg-smoke text-ink placeholder:text-ink-soft/50 border border-transparent focus:border-ember focus:bg-white focus:outline-none transition-colors";

export default function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block mb-3">
      <span className="flex items-baseline gap-2 mb-1.5">
        <span className="text-[11px] font-grotesk font-bold tracking-[0.14em] uppercase text-ink-soft">{label}</span>
        {hint && <span className="text-[11px] text-ink-soft/70">{hint}</span>}
      </span>
      {children}
    </label>
  );
}
