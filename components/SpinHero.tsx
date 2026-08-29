"use client";
import { useEffect, useRef, useState } from "react";
import BagArt from "./BagArt";

// ===== CONFIG — edit these when you drop in real frames =====
const FRAME_COUNT = 12;            // number of images in the spin
const FRAME_PATH = (i: number) =>
  `/spin/frame-${String(i + 1).padStart(2, "0")}.webp`; // /public/spin/frame-01.webp ... frame-36.webp
const SPIN_DURATION_MS = 1800;     // one full rotation time
const HOLD_FRAME = 0;              // frame index to rest on after the spin
// ============================================================

export default function SpinHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const spinningRef = useRef(false);
  const hasSpunRef = useRef(false);

  // Preload all frames
  useEffect(() => {
    let loadedCount = 0;
    let errorCount = 0;
    const imgs: HTMLImageElement[] = [];
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = FRAME_PATH(i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount + errorCount === FRAME_COUNT) {
          if (errorCount > 0) setFailed(true);
          else setLoaded(true);
        }
      };
      img.onerror = () => {
        errorCount++;
        if (loadedCount + errorCount === FRAME_COUNT) setFailed(true);
      };
      imgs.push(img);
    }
    imagesRef.current = imgs;
  }, []);

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);
    // contain-fit the image
    const scale = Math.min(rect.width / img.width, rect.height / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    ctx.drawImage(img, (rect.width - w) / 2, (rect.height - h) / 2, w, h);
  };

  const spin = () => {
    if (spinningRef.current || !loaded) return;
    spinningRef.current = true;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / SPIN_DURATION_MS, 1);
      // ease-out so it settles gently
      const eased = 1 - Math.pow(1 - t, 3);
      const frame = Math.floor(eased * (FRAME_COUNT - 1));
      drawFrame(frame);
      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        drawFrame(HOLD_FRAME);
        spinningRef.current = false;
      }
    };
    requestAnimationFrame(tick);
  };

  // Spin on load, and re-spin when scrolled back into view
  useEffect(() => {
    if (!loaded) return;
    drawFrame(HOLD_FRAME);
    const el = wrapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            if (!hasSpunRef.current || entry.intersectionRatio > 0.5) {
              hasSpunRef.current = true;
              spin();
            }
          }
        });
      },
      { threshold: [0, 0.5, 1] }
    );
    observer.observe(el);
    // redraw on resize
    const onResize = () => drawFrame(HOLD_FRAME);
    window.addEventListener("resize", onResize);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  return (
    <div ref={wrapRef} className="w-full h-full flex items-center justify-center">
      {loaded ? (
        <canvas ref={canvasRef} className="w-full h-full" />
      ) : failed ? (
        // Illustrated lineup until real spin frames exist in /public/spin/
        <div className="flex items-end justify-center gap-8 md:gap-14 px-8 pb-6 w-full">
          <BagArt variant="canvas-tote" className="w-1/4 max-w-[180px] text-ink/25" />
          <BagArt variant="grocery-tote" className="w-1/3 max-w-[240px] text-ember/50" />
          <BagArt variant="beach-bag" className="w-1/4 max-w-[200px] text-ink/25" />
        </div>
      ) : (
        <div className="animate-pulse text-ink/15 font-serif italic">loading…</div>
      )}
    </div>
  );
}
