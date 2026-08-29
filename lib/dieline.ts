// Dieline geometry in millimeters, matched to the factory production layout
// (reference: 400x350x150 template, 30mm hems). Two columns: main column
// (hem / front / base / back-rotated / hem) + side gusset column, where the
// gusset column is blank at base level and over the hems (no print).
// Physical constraint: baseD === gussetW === bag depth.

export type Dieline = {
  bodyW: number;   // main panel width (bag width)
  panelH: number;  // front/back panel height (bag height)
  baseD: number;   // base depth strip (bag depth = gussetW)
  gussetW: number; // side gusset width
  hem: number;     // top/bottom hem
};

// Per product+size. Scaled from the 451x400x150 reference template.
export const DIELINES: Record<string, Record<string, Dieline>> = {
  "grocery-tote": {
    S:  { bodyW: 305, panelH: 330, baseD: 178, gussetW: 178, hem: 30 },
    M:  { bodyW: 356, panelH: 381, baseD: 203, gussetW: 203, hem: 30 },
    L:  { bodyW: 406, panelH: 406, baseD: 229, gussetW: 229, hem: 30 },
    XL: { bodyW: 483, panelH: 432, baseD: 254, gussetW: 254, hem: 30 },
  },
  "canvas-tote": {
    S: { bodyW: 330, panelH: 330, baseD: 127, gussetW: 127, hem: 25 },
    M: { bodyW: 381, panelH: 381, baseD: 152, gussetW: 152, hem: 25 },
    L: { bodyW: 457, panelH: 406, baseD: 178, gussetW: 178, hem: 25 },
  },
  "beach-bag": {
    OS: { bodyW: 559, panelH: 381, baseD: 203, gussetW: 203, hem: 30 },
  },
};

// Full flat template dimensions (mm)
export function templateSize(d: Dieline) {
  const mainH = d.hem + d.panelH + d.baseD + d.panelH + d.hem;
  const width = d.bodyW + d.gussetW; // main column + gusset column
  return { width, height: mainH };
}

// Regions of the template canvas (all in mm, origin top-left)
export function regions(d: Dieline) {
  return {
    front:  { x: 0, y: d.hem, w: d.bodyW, h: d.panelH },
    base:   { x: 0, y: d.hem + d.panelH, w: d.bodyW, h: d.baseD },
    back:   { x: 0, y: d.hem + d.panelH + d.baseD, w: d.bodyW, h: d.panelH }, // drawn 180° rotated
    gusset1:{ x: d.bodyW, y: d.hem, w: d.gussetW, h: d.panelH },
    gusset2:{ x: d.bodyW, y: d.hem + d.panelH + d.baseD, w: d.gussetW, h: d.panelH },
  };
}
