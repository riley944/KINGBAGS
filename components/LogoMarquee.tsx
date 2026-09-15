import { CLIENT_LOGOS } from "@/lib/site";

// A slow, continuous line of client program logos. Renders nothing until
// logos are added to CLIENT_LOGOS in lib/site.ts.
export default function LogoMarquee({ dark = false }: { dark?: boolean }) {
  if (CLIENT_LOGOS.length === 0) return null;
  const logos = CLIENT_LOGOS.length < 8 ? [...CLIENT_LOGOS, ...CLIENT_LOGOS] : CLIENT_LOGOS;
  return (
    <section className={`py-10 border-y ${dark ? "bg-charcoal border-white/10" : "bg-white border-ink/10"}`} aria-label="Brands whose bag programs our team has produced">
      <p className={`text-center font-grotesk text-[11px] font-bold tracking-[0.2em] uppercase mb-7 ${dark ? "text-white/50" : "text-ink-soft"}`}>
        Bag programs produced by the KINGBAGS team at King Universal
      </p>
      <div className="ticker">
        <div className="ticker-track" style={{ animationDuration: `${Math.max(30, logos.length * 4)}s` }}>
          {[0, 1].map((copy) => (
            <div key={copy} className="ticker-half !gap-14 !pr-14" aria-hidden={copy === 1}>
              {logos.map((l, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={`${l.file}-${i}`}
                  src={`/clients/${l.file}`}
                  alt={l.name}
                  title={l.name}
                  style={{ width: l.width ?? 120 }}
                  className={`h-10 object-contain shrink-0 ${dark ? "brightness-0 invert opacity-80" : "grayscale opacity-70"} hover:opacity-100 hover:grayscale-0 transition`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
