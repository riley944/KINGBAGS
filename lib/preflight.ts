import { Dieline, templateSize } from "./dieline";

// Deterministic artwork pre-flight. Pure math against the live dieline —
// runs entirely in the browser, before anything is uploaded.
//
// How art maps to the template (see drawDieline): the drawn art width is
// always `scale` × the full template width, so at scale s the artwork's
// natural pixels cover (templateWidthMm × s) of printed fabric. Effective
// print resolution follows directly from that.

export type PreflightLevel = "pass" | "warn" | "fail";

export type PreflightCheck = {
  id: string;
  level: PreflightLevel;
  title: string;
  detail: string;
};

export function runPreflight(opts: {
  img: HTMLImageElement;
  fileType: string | null; // mime type of the uploaded file, null for generated art
  dieline: Dieline;
  x: number; // art center, 0–1 across template width
  y: number; // art center, 0–1 across template height
  scale: number; // drawn art width as a fraction of template width
}): PreflightCheck[] {
  const { img, fileType, dieline, x, y, scale } = opts;
  const { width: tw, height: th } = templateSize(dieline);
  const checks: PreflightCheck[] = [];

  // --- 1. Effective print resolution -------------------------------------
  const coveredWidthMm = tw * scale;
  const dpi = (img.naturalWidth * 25.4) / coveredWidthMm;
  const dpiRounded = Math.round(dpi);
  if (dpi >= 200) {
    checks.push({
      id: "resolution",
      level: "pass",
      title: `Resolution: ~${dpiRounded} DPI at this size`,
      detail: "Sharp at print size. 200+ DPI prints crisp on fabric.",
    });
  } else if (dpi >= 120) {
    checks.push({
      id: "resolution",
      level: "warn",
      title: `Resolution: ~${dpiRounded} DPI at this size`,
      detail:
        "Printable, but fine detail may soften. Shrink the art or upload a higher-resolution file for a crisper result.",
    });
  } else {
    checks.push({
      id: "resolution",
      level: "fail",
      title: `Resolution: ~${dpiRounded} DPI at this size`,
      detail:
        "Too low to print cleanly at this size — it will look blurry on the finished bag. Upload a larger file or reduce the art size.",
    });
  }

  // --- 2. Full-bleed coverage ---------------------------------------------
  // Art rectangle in template-normalized units.
  const heightFrac = (tw * scale * (img.naturalHeight / img.naturalWidth)) / th;
  const left = x - scale / 2;
  const right = x + scale / 2;
  const top = y - heightFrac / 2;
  const bottom = y + heightFrac / 2;
  const eps = 0.002; // sub-millimeter slack
  const covers = left <= eps && right >= 1 - eps && top <= eps && bottom >= 1 - eps;
  if (covers) {
    checks.push({
      id: "bleed",
      level: "pass",
      title: "Full-bleed coverage",
      detail: "Your art reaches every edge of the template — no blank fabric will show.",
    });
  } else {
    const gaps: string[] = [];
    if (left > eps) gaps.push(`${Math.round(left * tw)}mm left`);
    if (right < 1 - eps) gaps.push(`${Math.round((1 - right) * tw)}mm right`);
    if (top > eps) gaps.push(`${Math.round(top * th)}mm top`);
    if (bottom < 1 - eps) gaps.push(`${Math.round((1 - bottom) * th)}mm bottom`);
    checks.push({
      id: "bleed",
      level: "warn",
      title: "Art doesn't reach every edge",
      detail: `Uncovered: ${gaps.join(", ")}. Blank areas print as base fabric — fine if intentional, or drag and resize to cover the full template.`,
    });
  }

  // --- 3. File format ------------------------------------------------------
  if (fileType === "image/png" || fileType === "image/webp") {
    checks.push({
      id: "format",
      level: "pass",
      title: "File format: lossless",
      detail: "PNG/WebP keeps edges clean — ideal for logos and flat color.",
    });
  } else if (fileType === "image/jpeg") {
    checks.push({
      id: "format",
      level: "warn",
      title: "File format: JPEG",
      detail:
        "JPEG compression can print as faint blockiness in flat colors. It's usually fine for photos — for logos and solid colors, PNG is safer.",
    });
  } else if (fileType) {
    checks.push({
      id: "format",
      level: "warn",
      title: `File format: ${fileType.replace("image/", "").toUpperCase()}`,
      detail: "Our art team will confirm this format converts cleanly for print.",
    });
  }

  return checks;
}
