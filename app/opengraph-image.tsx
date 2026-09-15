import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "KINGBAGS — Fully custom cut-and-sew bags, from 1,500";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Share image for links pasted into iMessage, Slack, LinkedIn, and ads.
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#FFFFFF",
          color: "#10140F",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 40, fontWeight: 800, letterSpacing: -1, fontFamily: "Arial, sans-serif" }}>
          <span>KING</span>
          <span style={{ color: "#14532D" }}>BAGS</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 88, lineHeight: 1.02, letterSpacing: -2, maxWidth: 1000 }}>
            Make the bag nobody throws away.
          </div>
          <div style={{ fontSize: 30, color: "#5C635B", marginTop: 28, fontFamily: "Arial, sans-serif" }}>
            Fully custom cut-and-sew bags. Your art, edge to edge. All-in pricing from 1,500.
          </div>
        </div>
        <div style={{ display: "flex", gap: 36, fontSize: 22, fontFamily: "Arial, sans-serif", color: "#14532D", fontWeight: 700, letterSpacing: 2 }}>
          <span>FREIGHT & DUTIES INCLUDED</span>
          <span>FREE PROOF</span>
          <span>5–6 WEEKS</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
