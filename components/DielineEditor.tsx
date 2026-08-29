"use client";
import { useRef, useEffect, useCallback } from "react";
import { Dieline, templateSize, regions } from "@/lib/dieline";

export type ArtState = { img: HTMLImageElement | null; x: number; y: number; scale: number };

// Renders the full dieline (template outlines + user art) to a canvas.
// The same canvas is consumed by the 3D bag as its texture.
export function drawDieline(
  canvas: HTMLCanvasElement,
  d: Dieline,
  art: ArtState,
  pxPerMM: number,
  showGuides: boolean
) {
  const { width, height } = templateSize(d);
  const W = Math.round(width * pxPerMM);
  const H = Math.round(height * pxPerMM);
  if (canvas.width !== W) canvas.width = W;
  if (canvas.height !== H) canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Fabric base
  ctx.fillStyle = "#F2F4F0";
  ctx.fillRect(0, 0, W, H);

  // User art — tiled/positioned across the WHOLE template (edge-to-edge philosophy)
  if (art.img) {
    const s = (W / art.img.width) * art.scale;
    const w = art.img.width * s;
    const h = art.img.height * s;
    ctx.drawImage(art.img, art.x * W - w / 2, art.y * H - h / 2, w, h);
  }

  // The gusset column only prints across the two side panels: blank the
  // base-level square and the hem strips, matching the factory layout.
  {
    const bx = d.bodyW * pxPerMM;
    const bw = W - bx;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(bx, 0, bw, d.hem * pxPerMM);
    ctx.fillRect(bx, (d.hem + d.panelH) * pxPerMM, bw, d.baseD * pxPerMM);
    ctx.fillRect(bx, (d.hem + d.panelH + d.baseD + d.panelH) * pxPerMM, bw, d.hem * pxPerMM);
  }

  // Panel guides (only in editor view, not on 3D texture)
  if (showGuides) {
    const r = regions(d);
    ctx.strokeStyle = "rgba(30,58,47,0.55)";
    ctx.setLineDash([6, 6]);
    ctx.lineWidth = 1.5;
    const boxes: [string, { x: number; y: number; w: number; h: number }][] = [
      ["FRONT", r.front], ["BASE", r.base], ["BACK (prints rotated)", r.back],
      ["SIDE 1", r.gusset1], ["SIDE 2", r.gusset2],
    ];
    ctx.font = `${Math.max(11, 12 * pxPerMM * 2)}px Satoshi, sans-serif`;
    ctx.fillStyle = "rgba(30,58,47,0.6)";
    for (const [label, b] of boxes) {
      ctx.strokeRect(b.x * pxPerMM, b.y * pxPerMM, b.w * pxPerMM, b.h * pxPerMM);
      ctx.fillText(label, b.x * pxPerMM + 8, b.y * pxPerMM + 18);
    }
    ctx.setLineDash([]);
  }
}

export default function DielineEditor({
  dieline, art, onArtChange, editorCanvasRef,
}: {
  dieline: Dieline;
  art: ArtState;
  onArtChange: (a: ArtState) => void;
  editorCanvasRef: React.RefObject<HTMLCanvasElement | null>;
}) {
  const drag = useRef<{ on: boolean; sx: number; sy: number; ox: number; oy: number }>({ on: false, sx: 0, sy: 0, ox: 0, oy: 0 });

  const redraw = useCallback(() => {
    const c = editorCanvasRef.current;
    if (c) drawDieline(c, dieline, art, 1.1, true);
  }, [dieline, art, editorCanvasRef]);

  useEffect(() => { redraw(); }, [redraw]);

  return (
    <div>
      <canvas
        ref={editorCanvasRef}
        className="w-full h-auto rounded-2.5xl bg-sand shadow-soft touch-none select-none"
        style={{ cursor: art.img ? "grab" : "default", maxHeight: 480, objectFit: "contain" }}
        onPointerDown={(e) => {
          if (!art.img) return;
          drag.current = { on: true, sx: e.clientX, sy: e.clientY, ox: art.x, oy: art.y };
        }}
        onPointerMove={(e) => {
          if (!drag.current.on) return;
          const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
          onArtChange({
            ...art,
            x: Math.max(0, Math.min(1, drag.current.ox + (e.clientX - drag.current.sx) / rect.width)),
            y: Math.max(0, Math.min(1, drag.current.oy + (e.clientY - drag.current.sy) / rect.height)),
          });
        }}
        onPointerUp={() => (drag.current.on = false)}
        onPointerLeave={() => (drag.current.on = false)}
      />
      {art.img && (
        <div className="mt-3 bg-white rounded-2xl p-4 shadow-soft">
          <label className="text-[11px] font-bold tracking-[0.2em] uppercase text-ink-soft block mb-2">Art Size</label>
          <input
            type="range" min={0.3} max={3} step={0.01} value={art.scale}
            onChange={(e) => onArtChange({ ...art, scale: Number(e.target.value) })}
            className="w-full accent-forest"
          />
        </div>
      )}
    </div>
  );
}
