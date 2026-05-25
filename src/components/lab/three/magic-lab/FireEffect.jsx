import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { stableRandom, stableRange } from '@/utils/stableRandom';

const FireEffect = ({ active = false, intensity = 'medium' }) => {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const count = useMemo(() => {
    switch (intensity) {
      case 'extreme': return 120;
      case 'shatter': return 150;
      case 'high': return 80;
      default: return 40;
    }
  }, [intensity]);

  const particles = useMemo(() => {
    const baseSpeed = intensity === 'extreme' ? 1.5 : 0.8;
    const baseRadius = intensity === 'extreme' ? 0.6 : 0.35;

    return Array.from({ length: count }, (_, i) => ({
      offset: stableRange(`${intensity}-fire-offset`, i, 0, Math.PI * 2),
      speed: stableRange(`${intensity}-fire-speed`, i, baseSpeed, baseSpeed + 2),
      radius: stableRange(`${intensity}-fire-radius`, i, 0, baseRadius),
      phase: stableRange(`${intensity}-fire-phase`, i, 0, Math.PI * 2),
      size: stableRange(`${intensity}-fire-size`, i, 0.03, 0.09),
      ySpread: intensity === 'extreme' ? 2.5 : 0.8,
      whiteSpark: stableRandom(`${intensity}-fire-white`, i) > 0.8,
    }));
  }, [count, intensity]);

  const colorOrange = useMemo(() => new THREE.Color('#ff6600'), []);
  const colorRed = useMemo(() => new THREE.Color('#ff2200'), []);
  const colorYellow = useMemo(() => new THREE.Color('#ffaa00'), []);

  useFrame(() => {
    if (!meshRef.current || !active) return;
    const t = performance.now() * 0.001;

    particles.forEach((p, i) => {
      const cycle = (t * p.speed + p.phase) % 1.5;
      const x = Math.sin(t * 2 + p.offset) * p.radius * (1 + cycle);
      const z = Math.cos(t * 2 + p.offset) * p.radius * 0.6 * (1 + cycle);
      const y = cycle * p.ySpread;

      dummy.position.set(x, y - 0.1, z);
      dummy.scale.setScalar(Math.max(0.1, 1 - cycle / 1.5) * p.size * (intensity === 'extreme' ? 25 : 15));
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      const color = new THREE.Color();
      if (intensity === 'extreme' && p.whiteSpark) {
        color.set('#ffffff');
      } else if (cycle < 0.3) {
        color.copy(colorYellow);
      } else if (cycle < 0.7) {
        color.lerpColors(colorOrange, colorYellow, (0.7 - cycle) / 0.4);
      } else {
        color.lerpColors(colorRed, colorOrange, (1.5 - cycle) / 0.8);
      }
      meshRef.current.setColorAt(i, color);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <group position={[0, 0, 0]}>
      <instancedMesh ref={meshRef} args={[null, null, count]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshBasicMaterial transparent opacity={0.9} toneMapped={false} />
      </instancedMesh>

      <pointLight
        color={intensity === 'extreme' ? '#ffffff' : '#ff6600'}
        intensity={intensity === 'extreme' ? 10 : 5}
        distance={5}
        decay={2}
        position={[0, 0.5, 0]}
      />
    </group>
  );
};

export default FireEffect;
