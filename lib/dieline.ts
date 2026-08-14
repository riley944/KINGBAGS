// Dieline geometry in millimeters, from the 451_40_15 production template.
// Layout: main column (hem/front/base/back/hem) + side gusset column.

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
    S:  { bodyW: 305, panelH: 330, baseD: 130, gussetW: 178, hem: 30 },
    M:  { bodyW: 356, panelH: 380, baseD: 140, gussetW: 203, hem: 30 },
    L:  { bodyW: 406, panelH: 406, baseD: 150, gussetW: 229, hem: 30 },
    XL: { bodyW: 483, panelH: 432, baseD: 160, gussetW: 254, hem: 30 },
  },
  "canvas-tote": {
    S: { bodyW: 330, panelH: 330, baseD: 110, gussetW: 127, hem: 25 },
    M: { bodyW: 381, panelH: 381, baseD: 120, gussetW: 152, hem: 25 },
    L: { bodyW: 457, panelH: 406, baseD: 130, gussetW: 178, hem: 25 },
  },
  "beach-bag": {
    OS: { bodyW: 559, panelH: 381, baseD: 160, gussetW: 203, hem: 30 },
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
