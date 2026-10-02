"use client";
import type { Order } from "@/lib/supabase";
import { Badge, Chip, nextAction, ACTION_TONE, money, ago, isOpen, type NextAction } from "./shared";

// The daily work view: every open order sorted into what it needs next.
const QUEUES: { key: NextAction["key"][]; title: string; blurb: string }[] = [
  { key: ["charge"], title: "Ready to charge", blurb: "Approved on the call. Money is one click away." },
  { key: ["proof", "review", "approve"], title: "Your move", blurb: "Proofs to build, calls to run, approvals to log." },
  { key: ["call"], title: "Needs a call booked", blurb: "Card on file, nobody on the calendar." },
  { key: ["card"], title: "Waiting on a card", blurb: "Order saved, slot not reserved." },
  { key: ["changes"], title: "Waiting on artwork", blurb: "Customer owes a new file." },
  { key: ["ship", "track"], title: "Production & shipping", blurb: "At the factory or in the air." },
];

export default function Queues({ orders, onOpen }: { orders: Order[]; onOpen: (id: string) => void }) {
  const withAction = orders.filter((o) => isOpen(o) || o.status === "in_production" || (o.status === "shipped" && !o.tracking_url)).map((o) => ({ o, a: nextAction(o) }));
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
      {QUEUES.map((q) => {
        const items = withAction.filter(({ a }) => q.key.includes(a.key)).sort((x, y) => new Date(x.o.created_at).getTime() - new Date(y.o.created_at).getTime());
        return (
          <section key={q.title} className="bg-white rounded-xl border border-ink/10 flex flex-col">
            <div className="px-5 pt-4 pb-3 border-b border-ink/5 flex items-start justify-between gap-3">
              <div>
                <h2 className="font-serif font-bold text-[17px] text-ink leading-tight">{q.title}</h2>
                <p className="text-[12px] text-ink-soft mt-0.5">{q.blurb}</p>
              </div>
              <span className={`font-grotesk font-extrabold text-lg tabular-nums ${items.length ? "text-ink" : "text-ink/30"}`}>{items.length}</span>
            </div>
            {items.length === 0 ? (
              <p className="px-5 py-6 text-[13px] text-ink-soft/70">Clear.</p>
            ) : (
              <ul className="divide-y divide-ink/5">
                {items.map(({ o, a }) => (
                  <li key={o.id}>
                    <button onClick={() => onOpen(o.id)} className="w-full text-left px-5 py-3.5 hover:bg-smoke/60 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-ink text-[14px] truncate">{o.company}</p>
                          <p className="text-[12px] text-ink-soft truncate">{o.quantity.toLocaleString()} bags · {o.product_name.split(" — ")[0]}</p>
                        </div>
                        <p className="font-semibold text-ink text-[14px] tabular-nums shrink-0">{money(o.total_price)}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Chip tone={ACTION_TONE[a.key]}>{a.label}</Chip>
                        <Badge status={o.status} />
                        <span className="ml-auto text-[11px] text-ink-soft">{ago(o.created_at)}</span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
