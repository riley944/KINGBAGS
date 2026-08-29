"use client";
import { useState } from "react";
import BagArt from "./BagArt";

// Renders /public/lookbook/<slug>/front.webp when it exists; falls back to the
// line-art placeholder until the concept's imagery is dropped in.
export default function ConceptImage({ slug, variant }: { slug: string; variant: string }) {
  const [missing, setMissing] = useState(false);
  if (missing) {
    return (
      <div className="aspect-square bg-smoke flex items-center justify-center">
        <BagArt variant={variant} className="w-1/2 text-ink/25" />
      </div>
    );
  }
  return (
    <div className="aspect-square bg-smoke">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/lookbook/${slug}/front.webp`}
        alt={`${slug} concept bag`}
        className="w-full h-full object-cover"
        onError={() => setMissing(true)}
      />
    </div>
  );
}
