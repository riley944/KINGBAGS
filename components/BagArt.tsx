// Line-art bag illustrations used wherever product photography hasn't been
// shot yet. Drawn in the brand's ink at low opacity so empty slots read as
// deliberate art direction rather than missing images.

import type React from "react";

type Variant = "grocery-tote" | "canvas-tote" | "beach-bag";

const STROKE = "currentColor";

function GroceryTote() {
  return (
    <g fill="none" stroke={STROKE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {/* body */}
      <path d="M 45 62 L 51 150 Q 51.5 158 60 158 L 140 158 Q 148.5 158 149 150 L 155 62 Z" />
      {/* gusset hint */}
      <path d="M 58 62 L 63 158 M 142 62 L 137 158" opacity="0.35" />
      {/* rim */}
      <path d="M 45 62 L 155 62" />
      {/* handles */}
      <path d="M 72 62 Q 72 30 100 30 Q 128 30 128 62" opacity="0" />
      <path d="M 70 62 Q 70 28 87 28 M 130 62 Q 130 28 113 28 M 87 28 L 113 28" />
      {/* base seam */}
      <path d="M 56 140 L 144 140" opacity="0.35" />
    </g>
  );
}

function CanvasTote() {
  return (
    <g fill="none" stroke={STROKE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {/* taller, straighter body */}
      <path d="M 55 58 L 55 152 Q 55 160 63 160 L 137 160 Q 145 160 145 152 L 145 58 Z" />
      {/* rim */}
      <path d="M 55 58 L 145 58" />
      {/* long straps */}
      <path d="M 76 58 L 76 26 Q 76 22 80 22 L 90 22 M 124 58 L 124 26 Q 124 22 120 22 L 110 22 M 90 22 L 110 22" />
      {/* stitch lines */}
      <path d="M 70 58 L 70 160 M 130 58 L 130 160" opacity="0.35" strokeDasharray="1 6" />
    </g>
  );
}

function BeachBag() {
  return (
    <g fill="none" stroke={STROKE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {/* wide flared body */}
      <path d="M 34 70 L 48 148 Q 49.5 156 58 156 L 142 156 Q 150.5 156 152 148 L 166 70 Z" />
      {/* rim */}
      <path d="M 34 70 L 166 70" />
      {/* rope handles */}
      <path d="M 68 70 Q 68 38 100 38 Q 132 38 132 70" />
      <path d="M 72 70 Q 72 42 100 42 Q 128 42 128 70" opacity="0.35" />
      {/* flat base */}
      <path d="M 50 146 L 150 146" opacity="0.35" />
    </g>
  );
}

const ART: Record<Variant, () => React.ReactElement> = {
  "grocery-tote": GroceryTote,
  "canvas-tote": CanvasTote,
  "beach-bag": BeachBag,
};

export default function BagArt({
  variant,
  className = "",
}: {
  variant: string;
  className?: string;
}) {
  const Art = ART[(variant in ART ? variant : "grocery-tote") as Variant];
  return (
    <svg viewBox="0 0 200 190" className={className} role="img" aria-label="Bag illustration">
      <Art />
    </svg>
  );
}
