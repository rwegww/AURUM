import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { stableRange } from '@/utils/stableRandom';

const SMOKE_COUNT = 60;

const SmokeParticles = ({ active = false, color = '#ffffff', intensity = 'medium' }) => {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const smokeParticles = useMemo(() => {
    const counts = intensity === 'high' ? SMOKE_COUNT : (intensity === 'extreme' ? SMOKE_COUNT * 1.5 : SMOKE_COUNT / 2);

    return Array.from({ length: Math.floor(counts) }, (_, i) => ({
      x: stableRange(`${intensity}-smoke-x`, i, -0.2, 0.2),
      z: stableRange(`${intensity}-smoke-z`, i, -0.2, 0.2),
      speed: stableRange(`${intensity}-smoke-speed`, i, 0.2, 0.6),
      size: stableRange(`${intensity}-smoke-size`, i, 0.1, 0.3),
      wobble: stableRange(`${intensity}-smoke-wobble`, i, 0, Math.PI * 2),
      wobbleSpeed: stableRange(`${intensity}-smoke-wobble-speed`, i, 0.5, 1.5),
      phase: stableRange(`${intensity}-smoke-phase`, i, 0, 5),
      rotationSpeed: stableRange(`${intensity}-smoke-rotation`, i, -0.05, 0.05),
    }));
  }, [intensity]);

  useFrame(() => {
    if (!meshRef.current || !active) return;
    const t = performance.now() * 0.001;

    smokeParticles.forEach((p, i) => {
      const cycle = (t * p.speed + p.phase) % 2;
      const y = cycle * 1.5 + 0.5;
      const xOffset = Math.sin(t * p.wobbleSpeed + p.wobble) * 0.2 * cycle;
      const zOffset = Math.cos(t * p.wobbleSpeed + p.wobble) * 0.2 * cycle;

      dummy.position.set(p.x + xOffset, y, p.z + zOffset);
      dummy.rotation.set(t * p.rotationSpeed, t * p.rotationSpeed, t * p.rotationSpeed);

      const lifeRatio = cycle / 2;
      const baseScale = p.size * (1 + lifeRatio * 2) * 8;
      const scale = lifeRatio > 0.8 ? baseScale * (1 - (lifeRatio - 0.8) * 5) : baseScale;

      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <instancedMesh ref={meshRef} args={[null, null, smokeParticles.length]} position={[0, 0, 0]}>
      <dodecahedronGeometry args={[0.05, 1]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.3}
        roughness={1}
        metalness={0}
        flatShading={false}
      />
    </instancedMesh>
  );
};

export default SmokeParticles;
