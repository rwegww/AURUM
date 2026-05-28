import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useLabStore from './store';

const AnimatedSolid = ({ targetPosition, color, type }) => {
  const meshRef = useRef();
  const [currentY, setCurrentY] = useState(2.0); // Báº¯t Ä‘áº§u rÆ¡i tá»« trÃªn cao

  useFrame((state, delta) => {
    if (currentY > targetPosition[1]) {
      // RÆ¡i xuá»‘ng dáº§n cho Ä‘áº¿n khi cháº¡m Ä‘Ã­ch
      const newY = Math.max(targetPosition[1], currentY - delta * 4);
      setCurrentY(newY);
      if (meshRef.current) {
        meshRef.current.position.y = newY;
      }
    }
  });

  return (
    <group ref={meshRef} position={[targetPosition[0], currentY, targetPosition[2]]}>
      {/* Cluster of 3 smaller pieces to look like a crumbly precipitate/sediment */}
      <mesh position={[0, 0, 0]}>
        <dodecahedronGeometry args={[0.045, 0]} />
        <meshStandardMaterial
          color={color || '#888888'}
          roughness={0.8}
          metalness={type === 'metal' ? 0.8 : 0.1}
        />
      </mesh>
      <mesh position={[0.03, -0.015, 0.015]}>
        <dodecahedronGeometry args={[0.035, 0]} />
        <meshStandardMaterial
          color={color || '#888888'}
          roughness={0.8}
          metalness={type === 'metal' ? 0.8 : 0.1}
        />
      </mesh>
      <mesh position={[-0.025, -0.01, -0.025]}>
        <dodecahedronGeometry args={[0.03, 0]} />
        <meshStandardMaterial
          color={color || '#888888'}
          roughness={0.8}
          metalness={type === 'metal' ? 0.8 : 0.1}
        />
      </mesh>
    </group>
  );
};

const Beaker = ({ beakerData, isActive, ...props }) => {
  const groupRef = useRef();
  const { contents, isHeating } = beakerData;
  const settings = useLabStore(state => state.settings);

  // TÃ­nh toÃ¡n mÃ u sáº¯c tá»•ng há»£p dá»±a trÃªn cÃ¡c cháº¥t lá»ng cÃ³ trong cá»‘c
  const beakerColor = useMemo(() => {
    if (contents.length === 0) return '#a0d8ef';
    const liquids = contents.filter(item => item?.state !== 'solid');
    if (liquids.length > 0) {
      const finalColor = liquids[liquids.length - 1].color;
      return (finalColor === '#ffffff' || !finalColor) ? '#a0d8ef' : finalColor;
    }
    return '#a0d8ef';
  }, [contents]);

  // Kiá»ƒm tra xem cÃ³ cháº¥t ráº¯n/káº¿t tá»§a nÃ o trong cá»‘c khÃ´ng
  const hasPrecipitate = useMemo(() => {
    return contents.some(item => item.state === 'solid' || item.type === 'metal');
  }, [contents]);

  // Material nÆ°á»›c bÃªn trong
  const waterMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: beakerColor,
      transmission: hasPrecipitate ? 0.15 : 0.5, // LÃ m Ä‘á»¥c (giáº£m truyá»n sÃ¡ng) náº¿u cÃ³ káº¿t tá»§a
      opacity: hasPrecipitate ? 0.95 : 0.85,
      transparent: true,
      roughness: hasPrecipitate ? 0.7 : 0.15,     // TÄƒng Ä‘á»™ nhÃ¡m Ä‘á»ƒ Ã¡nh sÃ¡ng phÃ¢n tÃ¡n táº¡o hiá»‡u á»©ng huyá»n phÃ¹/Ä‘á»¥c
      ior: 1.33,
      side: THREE.DoubleSide,
      emissive: isHeating ? beakerColor : '#000000',
      emissiveIntensity: isHeating ? 0.3 : 0
    });
  }, [beakerColor, isHeating, hasPrecipitate]);

  // Material vá» cá»‘c
  const beakerMaterial = useMemo(() => {
    const heatTime = beakerData.heatTime || 0;
    const isOverheating = heatTime >= 10;
    
    // Náº¿u quÃ¡ nhiá»‡t (sau 20s Ä‘un), thá»§y tinh chuyá»ƒn dáº§n sang Ã¡nh Ä‘á» cam nÃ³ng cháº£y
    const glowIntensity = isOverheating ? Math.min(1.5, (heatTime - 9) * 0.25) : 0;
    const emissiveColor = isOverheating ? '#ff3300' : '#000000';

    return new THREE.MeshPhysicalMaterial({
      color: isActive ? "#ffffff" : "#cccccc",
      transmission: 0.92,
      opacity: settings.beakerOpacity,
      transparent: true,
      roughness: 0.05,
      ior: 1.52,
      thickness: 0.02,
      side: THREE.DoubleSide,
      emissive: emissiveColor,
      emissiveIntensity: glowIntensity,
    });
  }, [isActive, settings.beakerOpacity, beakerData.heatTime]);

  // Má»©c nÆ°á»›c dá»±a trÃªn sá»‘ lÆ°á»£ng cháº¥t lá»ng vÃ  lÆ°á»£ng nÆ°á»›c bay hÆ¡i
  const liquidCount = contents.filter(item => item.state !== 'solid').length;
  const liquidVolume = beakerData.liquidVolume !== undefined ? beakerData.liquidVolume : 1.0;
  const waterLevel = Math.min(0.9, Math.max(0.15, liquidCount * 0.18 * liquidVolume));

  return (
    <group ref={groupRef} {...props}>
      {/* Vá» cá»‘c thá»§y tinh - ThÃ¢n chÃ­nh */}
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.52, 0.48, 1.1, 32, 1, true]} />
        <primitive object={beakerMaterial} attach="material" />
      </mesh>

      {/* Hiá»‡u á»©ng chá»n cá»‘c (cÅ©ng dÃ¹ng Ä‘á»ƒ trang trÃ­) */}
      {isActive && (
        <mesh position={[0, -0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
           <ringGeometry args={[0.55, 0.65, 32]} />
           <meshBasicMaterial color="#3b82f6" transparent opacity={0.5} />
        </mesh>
      )}

      {/* Viá»n miá»‡ng cá»‘c (lip) */}
      <mesh position={[0, 1.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.52, 0.02, 8, 32]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.85}
          opacity={settings.beakerOpacity}
          transparent
          roughness={0.05}
          ior={1.52}
        />
      </mesh>

      {/* Má» rÃ³t (Spout) */}
      <mesh position={[0, 1.1, 0.53]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.15, 0.04, 0.08]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={settings.beakerOpacity} transparent />
      </mesh>

      {/* ÄÃ¡y cá»‘c */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.48, 0.48, 0.06, 32]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.85} opacity={settings.beakerOpacity} transparent />
      </mesh>

      {/* Cháº¥t lá»ng */}
      {liquidCount > 0 && (
        <mesh position={[0, waterLevel / 2 + 0.03, 0]}>
          <cylinderGeometry args={[0.46, 0.46, waterLevel, 32]} />
          <primitive object={waterMaterial} attach="material" />
        </mesh>
      )}

      {/* Cháº¥t ráº¯n dÆ°á»›i Ä‘Ã¡y cá»‘c (CÃ³ hiá»‡u á»©ng rÆ¡i) */}
      {contents.map((item, idx) => {
        if (item.state === 'solid' || item.type === 'metal') {
          const angle = idx * Math.PI * 0.618;
          const radius = 0.15 + (idx % 3) * 0.08;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          const yRest = 0.1 + idx * 0.025;
          
          return (
            <AnimatedSolid 
              key={`solid-${item.id || idx}`} 
              targetPosition={[x, yRest, z]} 
              color={item.color} 
              type={item.type} 
            />
          );
        }
        return null;
      })}
    </group>
  );
};

export default Beaker;

