import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CHEMICALS } from './reactionDB';

const STREAM_COUNT = 30;

const PouringStream = ({ formula = null }) => {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const chemical = formula ? CHEMICALS[formula] : null;
  const streamColor = chemical?.color || '#cccccc';
  const isSolid = chemical?.state === 'solid' || chemical?.type === 'metal';

  const particles = useMemo(() => {
    return Array.from({ length: STREAM_COUNT }, () => ({
      xSpread: (Math.random() - 0.5) * 0.15,
      zSpread: (Math.random() - 0.5) * 0.15,
      speed: 1.5 + Math.random() * 1.5,
      phase: Math.random() * 2,
      size: isSolid ? (0.02 + Math.random() * 0.04) : (0.01 + Math.random() * 0.025)
    }));
  }, [isSolid]);

  useFrame((state) => {
    if (!meshRef.current || !formula) return;
    const t = state.clock.elapsedTime;

    particles.forEach((p, i) => {
      const cycle = ((t * p.speed + p.phase) % 1.0); // 0 -> 1 loop
      
      let x, y, z;
      if (isSolid) {
        // Rơi thẳng từ trên xuống trong tâm cốc
        y = 2.0 - cycle * 1.6; 
        const spread = cycle * 0.15;
        x = p.xSpread * spread; // Không có offset sang trái
        z = p.zSpread * spread;
      } else {
        // Đổ từ bình vào (offset sang trái)
        y = 1.8 - cycle * 1.4; 
        const spread = cycle * 0.3;
        x = p.xSpread * spread - 0.3; // Offset -0.3
        z = p.zSpread * spread;
      }

      dummy.position.set(x, y, z);
      const scale = p.size * (isSolid ? 22 : 12);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (!formula) return null;

  return (
    <instancedMesh ref={meshRef} args={[null, null, STREAM_COUNT]}>
      {isSolid ? (
        <dodecahedronGeometry args={[0.02, 0]} />
      ) : (
        <sphereGeometry args={[0.015, 6, 6]} />
      )}
      <meshStandardMaterial
        color={streamColor}
        transparent
        opacity={isSolid ? 0.9 : 0.6}
        roughness={isSolid ? 0.7 : 0.2}
      />
    </instancedMesh>
  );
};

export default PouringStream;
