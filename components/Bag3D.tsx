"use client";
import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { Dieline, templateSize, regions } from "@/lib/dieline";

function uvRect(d: Dieline, r: { x: number; y: number; w: number; h: number }, rot180 = false) {
  const { width, height } = templateSize(d);
  const u0 = r.x / width, u1 = (r.x + r.w) / width;
  // canvas y-down -> uv y-up
  const v1 = 1 - r.y / height, v0 = 1 - (r.y + r.h) / height;
  return rot180
    ? new Float32Array([u1, v0, u0, v0, u1, v1, u0, v1])
    : new Float32Array([u0, v1, u1, v1, u0, v0, u1, v0]);
}

function Panel({ w, h, pos, rotY, uv, tex, bow = 0 }: {
  w: number; h: number; pos: [number, number, number]; rotY: number;
  uv: Float32Array; tex: THREE.CanvasTexture; bow?: number;
}) {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(w, h, 16, 1);
    // subtle outward bow so panels read as fabric, not cardboard
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i);
      p.setZ(i, Math.cos((x / w) * Math.PI) * -bow + bow);
    }
    // interpolate the 4-corner uv rect across segments
    const uvAttr = g.attributes.uv;
    for (let i = 0; i < uvAttr.count; i++) {
      const u = uvAttr.getX(i), v = uvAttr.getY(i);
      const top = [uv[0] + (uv[2] - uv[0]) * u, uv[1] + (uv[3] - uv[1]) * u];
      const bot = [uv[4] + (uv[6] - uv[4]) * u, uv[5] + (uv[7] - uv[5]) * u];
      uvAttr.setXY(i, top[0] + (bot[0] - top[0]) * (1 - v), top[1] + (bot[1] - top[1]) * (1 - v));
    }
    g.computeVertexNormals();
    return g;
  }, [w, h, uv, bow]);

  return (
    <mesh geometry={geo} position={pos} rotation={[0, rotY, 0]} castShadow receiveShadow>
      <meshStandardMaterial map={tex} roughness={0.85} metalness={0} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Handles({ w, h, d }: { w: number; h: number; d: number }) {
  const r = w * 0.16;
  const tube = Math.min(0.9, w * 0.035);
  const mat = <meshStandardMaterial color="#2A2A28" roughness={0.6} />;
  return (
    <>
      <mesh position={[0, h / 2, d / 2]} rotation={[0, 0, 0]} castShadow>
        <torusGeometry args={[r, tube, 12, 32, Math.PI]} />{mat}
      </mesh>
      <mesh position={[0, h / 2, -d / 2]} castShadow>
        <torusGeometry args={[r, tube, 12, 32, Math.PI]} />{mat}
      </mesh>
    </>
  );
}

function BagMesh({ dieline, textureCanvas, version }: { dieline: Dieline; textureCanvas: HTMLCanvasElement; version: number }) {
  const tex = useMemo(() => {
    const t = new THREE.CanvasTexture(textureCanvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, [textureCanvas]);
  useEffect(() => { tex.needsUpdate = true; }, [version, tex]);

  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.12; // slow idle turn
  });

  const d = dieline;
  const S = 0.02; // mm -> world units
  const W = d.bodyW * S, H = d.panelH * S, D = d.gussetW * S;
  const r = regions(d);

  return (
    <group ref={group} position={[0, -H / 2, 0]}>
      <Panel w={W} h={H} pos={[0, H / 2, D / 2]} rotY={0} uv={uvRect(d, r.front)} tex={tex} bow={D * 0.06} />
      <Panel w={W} h={H} pos={[0, H / 2, -D / 2]} rotY={Math.PI} uv={uvRect(d, r.back, true)} tex={tex} bow={D * 0.06} />
      <Panel w={D} h={H} pos={[W / 2, H / 2, 0]} rotY={-Math.PI / 2} uv={uvRect(d, r.gusset1)} tex={tex} bow={D * 0.04} />
      <Panel w={D} h={H} pos={[-W / 2, H / 2, 0]} rotY={Math.PI / 2} uv={uvRect(d, r.gusset2)} tex={tex} bow={D * 0.04} />
      {/* base */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial map={tex} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      <Handles w={W} h={H} d={D} />
    </group>
  );
}

export default function Bag3D({ dieline, textureCanvas, version }: {
  dieline: Dieline; textureCanvas: HTMLCanvasElement | null; version: number;
}) {
  if (!textureCanvas) {
    return <div className="w-full h-full flex items-center justify-center text-ink/20 font-serif italic">Upload art to see your bag</div>;
  }
  return (
    <Canvas shadows camera={{ position: [0, 2.5, 16], fov: 32 }} dpr={[1, 2]}>
      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 10, 6]} intensity={1.1} castShadow shadow-mapSize={[1024, 1024]} />
      <BagMesh dieline={dieline} textureCanvas={textureCanvas} version={version} />
      <ContactShadows position={[0, -4.05, 0]} opacity={0.35} blur={2.4} far={8} scale={24} />
      <Environment preset="studio" />
      <OrbitControls enablePan={false} minDistance={9} maxDistance={26} maxPolarAngle={Math.PI / 1.9} />
    </Canvas>
  );
}
