import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BUBBLE_COUNT = 25;

const BubbleParticles = ({ active = false }) => {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const bubbles = useMemo(() => {
    return Array.from({ length: BUBBLE_COUNT }, () => ({
      x: (Math.random() - 0.5) * 0.7,
      z: (Math.random() - 0.5) * 0.7,
      speed: 0.3 + Math.random() * 0.6,
      size: 0.015 + Math.random() * 0.03,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 1 + Math.random() * 2,
      phase: Math.random() * 3 // Offset thời gian để bọt không xuất hiện cùng lúc
    }));
  }, []);

  useFrame((state) => {
    if (!meshRef.current || !active) return;
    const t = state.clock.elapsedTime;

    bubbles.forEach((b, i) => {
      // Bay lên theo chu kỳ
      const cycle = ((t * b.speed + b.phase) % 1.2); // 0 -> 1.2 loop
      const y = cycle * 0.8 + 0.05; // Từ đáy cốc bay lên

      // Wobble ngang
      const xOffset = Math.sin(t * b.wobbleSpeed + b.wobble) * 0.05;

      dummy.position.set(b.x + xOffset, y, b.z);

      // Scale: to dần rồi nhỏ lại khi vỡ
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
