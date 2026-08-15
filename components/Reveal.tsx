"use client";
import { useEffect, useRef } from "react";

// Wrap any block: <Reveal><div>...</div></Reveal> — fades/rises in when scrolled into view.
export default function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.style.animationDelay = `${delay}ms`;
            el.classList.add("in");
            io.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);
  return <div ref={ref} className="reveal">{children}</div>;
}
