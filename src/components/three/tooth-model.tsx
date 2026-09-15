"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Environment, Float } from "@react-three/drei";
import * as THREE from "three";

const LAYER_LABELS = ["Enamel", "Dentin", "Pulp", "Root"] as const;

/** Lathe profile approximating a molar's silhouette: root tip -> neck -> crown dome. */
function buildToothProfile(scale: number) {
  const points = [
    new THREE.Vector2(0.0, -2.2),
    new THREE.Vector2(0.22, -2.0),
    new THREE.Vector2(0.3, -1.4),
    new THREE.Vector2(0.28, -0.6),
    new THREE.Vector2(0.34, -0.1),
    new THREE.Vector2(0.55, 0.15),
    new THREE.Vector2(0.72, 0.55),
    new THREE.Vector2(0.7, 0.95),
    new THREE.Vector2(0.45, 1.2),
    new THREE.Vector2(0.0, 1.28),
  ];
  return points.map((p) => new THREE.Vector2(p.x * scale, p.y));
}

function Layer({
  scale,
  color,
  opacity,
  segments = 48,
}: {
  scale: number;
  color: string;
  opacity: number;
  segments?: number;
}) {
  const geometry = useMemo(() => new THREE.LatheGeometry(buildToothProfile(scale), segments), [scale, segments]);
  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial
        color={color}
        transparent={opacity < 1}
        opacity={opacity}
        roughness={0.35}
        metalness={0.05}
        depthWrite={opacity > 0.85}
      />
    </mesh>
  );
}

function Pulp({ opacity }: { opacity: number }) {
  return (
    <mesh position={[0, 0.1, 0]}>
      <capsuleGeometry args={[0.12, 1.6, 6, 12]} />
      <meshStandardMaterial color="#d1495b" transparent opacity={opacity} roughness={0.4} />
    </mesh>
  );
}

function Scene({ stage }: { stage: number }) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.25;
  });

  const opacities = {
    enamel: stage === 0 ? 1 : 0.12,
    dentin: stage === 1 ? 1 : stage > 1 ? 0.15 : 0.5,
    pulp: stage >= 2 ? 1 : 0.15,
  };

  return (
    <group ref={group}>
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
        <Layer scale={1} color="#f5f3ee" opacity={opacities.enamel} />
        <Layer scale={0.82} color="#f0dfb8" opacity={opacities.dentin} segments={40} />
        <Pulp opacity={opacities.pulp} />

        {LAYER_LABELS.map((label, i) => (
          <Html
            key={label}
            position={[0.9, 1.1 - i * 0.75, 0]}
            center
            distanceFactor={6}
            className="pointer-events-none select-none"
            occlude={false}
          >
            <div
              className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-sm transition-all duration-300 ${
                stage === i
                  ? "scale-100 border-primary bg-primary text-primary-foreground opacity-100"
                  : "scale-90 border-white/40 bg-white/10 text-white/70 opacity-60"
              }`}
            >
              {label}
            </div>
          </Html>
        ))}
      </Float>
    </group>
  );
}

export default function ToothModel({ stage = 0 }: { stage?: number }) {
  const [ready, setReady] = useState(false);

  return (
    <Canvas
      camera={{ position: [0, 0.2, 5], fov: 38 }}
      onCreated={() => setReady(true)}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      style={{ opacity: ready ? 1 : 0, transition: "opacity 0.6s ease" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 4]} intensity={1.4} castShadow />
      <directionalLight position={[-3, -2, -3]} intensity={0.3} />
      <Scene stage={stage} />
      <Environment preset="studio" />
    </Canvas>
  );
}
