import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { stableRange } from '@/utils/stableRandom';

const BUBBLE_COUNT = 25;

const BubbleParticles = ({ active = false }) => {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const bubbles = useMemo(() => {
    return Array.from({ length: BUBBLE_COUNT }, (_, i) => ({
      x: stableRange('bubble-x', i, -0.35, 0.35),
      z: stableRange('bubble-z', i, -0.35, 0.35),
      speed: stableRange('bubble-speed', i, 0.3, 0.9),
      size: stableRange('bubble-size', i, 0.015, 0.045),
      wobble: stableRange('bubble-wobble', i, 0, Math.PI * 2),
      wobbleSpeed: stableRange('bubble-wobble-speed', i, 1, 3),
      phase: stableRange('bubble-phase', i, 0, 3),
    }));
  }, []);

  useFrame(() => {
    if (!meshRef.current || !active) return;
    const t = performance.now() * 0.001;

    bubbles.forEach((b, i) => {
      const cycle = (t * b.speed + b.phase) % 1.2;
      const y = cycle * 0.8 + 0.05;
      const xOffset = Math.sin(t * b.wobbleSpeed + b.wobble) * 0.05;

      dummy.position.set(b.x + xOffset, y, b.z);

      const lifeRatio = cycle / 1.2;
      const scale = lifeRatio < 0.8
        ? b.size * (0.5 + lifeRatio * 0.8) * 12
        : b.size * (1 - (lifeRatio - 0.8) * 5) * 12;

      dummy.scale.setScalar(Math.max(0.01, scale));
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <instancedMesh ref={meshRef} args={[null, null, BUBBLE_COUNT]}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshPhysicalMaterial
        color="#ffffff"
        transparent
        opacity={0.4}
        roughness={0}
        transmission={0.8}
        ior={1.33}
      />
    </instancedMesh>
  );
};

export default BubbleParticles;
