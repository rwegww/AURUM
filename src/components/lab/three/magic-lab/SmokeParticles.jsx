import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SMOKE_COUNT = 60;

const SmokeParticles = ({ active = false, color = '#ffffff', intensity = 'medium' }) => {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const smokeParticles = useMemo(() => {
    const counts = intensity === 'high' ? SMOKE_COUNT : (intensity === 'extreme' ? SMOKE_COUNT * 1.5 : SMOKE_COUNT / 2);
    return Array.from({ length: Math.floor(counts) }, () => ({
      x: (Math.random() - 0.5) * 0.4,
      z: (Math.random() - 0.5) * 0.4,
      speed: 0.2 + Math.random() * 0.4,
      size: 0.1 + Math.random() * 0.2,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.5 + Math.random() * 1,
      phase: Math.random() * 5,
      rotationSpeed: (Math.random() - 0.5) * 0.1
    }));
  }, [intensity]);

  useFrame((state) => {
    if (!meshRef.current || !active) return;
    const t = state.clock.elapsedTime;

    smokeParticles.forEach((p, i) => {
      // Bay lên và tan biến
      const cycle = ((t * p.speed + p.phase) % 2.0); // 0 -> 2.0 loop
      const y = cycle * 1.5 + 0.5; // Bay lên từ cốc

      const xOffset = Math.sin(t * p.wobbleSpeed + p.wobble) * 0.2 * cycle;
      const zOffset = Math.cos(t * p.wobbleSpeed + p.wobble) * 0.2 * cycle;

      dummy.position.set(p.x + xOffset, y, p.z + zOffset);
      dummy.rotation.set(t * p.rotationSpeed, t * p.rotationSpeed, t * p.rotationSpeed);

      // Scale: to dần khi bay lên
      const lifeRatio = cycle / 2.0;
      const scale = p.size * (1 + lifeRatio * 2) * 8;

      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      
      // Mờ dần theo độ cao
      // Note: instancedMesh doesn't support per-instance opacity easily without special shader
      // but we can use scale to "disappear"
      if (lifeRatio > 0.8) {
          dummy.scale.setScalar(scale * (1 - (lifeRatio - 0.8) * 5));
          dummy.updateMatrix();
          meshRef.current.setMatrixAt(i, dummy.matrix);
      }
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
