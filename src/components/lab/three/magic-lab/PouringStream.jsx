import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useLabStore from './store';
import { stableRange } from '@/utils/stableRandom';

const STREAM_COUNT = 30;

const PouringStream = ({ formula = null }) => {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const chemicals = useLabStore(state => state.chemicals);
  const chemical = formula ? (Object.values(chemicals).find(c => c.formula === formula) || chemicals[formula]) : null;
  const streamColor = chemical?.color || '#cccccc';
  const isSolid = chemical?.state === 'solid' || chemical?.type?.includes('metal');

  const particles = useMemo(() => {
    const seed = `pouring-${isSolid ? 'solid' : 'liquid'}`;

    return Array.from({ length: STREAM_COUNT }, (_, i) => ({
      xSpread: stableRange(`${seed}-x`, i, -0.075, 0.075),
      zSpread: stableRange(`${seed}-z`, i, -0.075, 0.075),
      speed: stableRange(`${seed}-speed`, i, 1.5, 3),
      phase: stableRange(`${seed}-phase`, i, 0, 2),
      size: isSolid
        ? stableRange(`${seed}-size`, i, 0.02, 0.06)
        : stableRange(`${seed}-size`, i, 0.01, 0.035),
    }));
  }, [isSolid]);

  useFrame(() => {
    if (!meshRef.current || !formula) return;
    const t = performance.now() * 0.001;

    particles.forEach((p, i) => {
      const cycle = (t * p.speed + p.phase) % 1;
      let x;
      let y;
      let z;

      if (isSolid) {
        y = 2 - cycle * 1.6;
        const spread = cycle * 0.15;
        x = p.xSpread * spread;
        z = p.zSpread * spread;
      } else {
        y = 1.8 - cycle * 1.4;
        const spread = cycle * 0.3;
        x = p.xSpread * spread - 0.3;
        z = p.zSpread * spread;
      }

      dummy.position.set(x, y, z);
      dummy.scale.setScalar(p.size * (isSolid ? 22 : 12));
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
