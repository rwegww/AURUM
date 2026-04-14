import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const FireEffect = ({ active = false, intensity = 'medium' }) => {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Increase particle count based on intensity
  const count = useMemo(() => {
    switch (intensity) {
      case 'extreme': return 120;
      case 'shatter': return 150;
      case 'high': return 80;
      default: return 40;
    }
  }, [intensity]);

  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      offset: Math.random() * Math.PI * 2,
      speed: (intensity === 'extreme' ? 1.5 : 0.8) + Math.random() * 2,
      radius: (intensity === 'extreme' ? 0.6 : 0.35) * Math.random(),
      phase: Math.random() * Math.PI * 2,
      size: 0.03 + Math.random() * 0.06,
      ySpread: intensity === 'extreme' ? 2.5 : 0.8
    }));
  }, [count, intensity]);

  const colorOrange = useMemo(() => new THREE.Color('#ff6600'), []);
  const colorRed = useMemo(() => new THREE.Color('#ff2200'), []);
  const colorYellow = useMemo(() => new THREE.Color('#ffaa00'), []);
  const colorPurple = useMemo(() => new THREE.Color('#a855f7'), []); // For KMnO4 reactions

  useFrame((state) => {
    if (!meshRef.current || !active) return;
    const t = state.clock.elapsedTime;

    particles.forEach((p, i) => {
      const cycle = ((t * p.speed + p.phase) % 1.5); 
      const x = Math.sin(t * 2 + p.offset) * p.radius * (1 + cycle);
      const z = Math.cos(t * 2 + p.offset) * p.radius * 0.6 * (1 + cycle);
      const y = cycle * p.ySpread; 

      dummy.position.set(x, y - 0.1, z);

      const scale = Math.max(0.1, (1 - cycle / 1.5)) * p.size * (intensity === 'extreme' ? 25 : 15);
      dummy.scale.setScalar(scale);

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      const color = new THREE.Color();
      if (intensity === 'extreme' && Math.random() > 0.8) {
          color.set('#ffffff'); // White hot sparks
      } else {
          if (cycle < 0.3) color.copy(colorYellow);
          else if (cycle < 0.7) color.lerpColors(colorOrange, colorYellow, (0.7 - cycle) / 0.4);
          else color.lerpColors(colorRed, colorOrange, (1.5 - cycle) / 0.8);
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
        color={intensity === 'extreme' ? "#ffffff" : "#ff6600"} 
        intensity={intensity === 'extreme' ? 10 : 5} 
        distance={5} 
        decay={2} 
        position={[0, 0.5, 0]} 
      />
    </group>
  );
};

export default FireEffect;
