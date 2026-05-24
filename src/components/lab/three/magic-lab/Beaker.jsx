import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useLabStore from './store';

const AnimatedSolid = ({ targetPosition, color, type }) => {
  const meshRef = useRef();
  const [currentY, setCurrentY] = useState(2.0); // Bắt đầu rơi từ trên cao

  useFrame((state, delta) => {
    if (currentY > targetPosition[1]) {
      // Rơi xuống dần cho đến khi chạm đích
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

  // Tính toán màu sắc tổng hợp dựa trên các chất lỏng có trong cốc
  const beakerColor = useMemo(() => {
    if (contents.length === 0) return '#a0d8ef';
    const liquids = contents.filter(item => item?.state !== 'solid');
    if (liquids.length > 0) {
      const finalColor = liquids[liquids.length - 1].color;
      return (finalColor === '#ffffff' || !finalColor) ? '#a0d8ef' : finalColor;
    }
    return '#a0d8ef';
  }, [contents]);

  // Kiểm tra xem có chất rắn/kết tủa nào trong cốc không
  const hasPrecipitate = useMemo(() => {
    return contents.some(item => item.state === 'solid' || item.type === 'metal');
  }, [contents]);

  // Material nước bên trong
  const waterMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: beakerColor,
      transmission: hasPrecipitate ? 0.15 : 0.5, // Làm đục (giảm truyền sáng) nếu có kết tủa
      opacity: hasPrecipitate ? 0.95 : 0.85,
      transparent: true,
      roughness: hasPrecipitate ? 0.7 : 0.15,     // Tăng độ nhám để ánh sáng phân tán tạo hiệu ứng huyền phù/đục
      ior: 1.33,
      side: THREE.DoubleSide,
      emissive: isHeating ? beakerColor : '#000000',
      emissiveIntensity: isHeating ? 0.3 : 0
    });
  }, [beakerColor, isHeating, hasPrecipitate]);

  // Material vỏ cốc
  const beakerMaterial = useMemo(() => {
    const heatTime = beakerData.heatTime || 0;
    const isOverheating = heatTime >= 10;
    
    // Nếu quá nhiệt (sau 20s đun), thủy tinh chuyển dần sang ánh đỏ cam nóng chảy
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

  // Mức nước dựa trên số lượng chất lỏng và lượng nước bay hơi
  const liquidCount = contents.filter(item => item.state !== 'solid').length;
  const liquidVolume = beakerData.liquidVolume !== undefined ? beakerData.liquidVolume : 1.0;
  const waterLevel = Math.min(0.9, Math.max(0.15, liquidCount * 0.18 * liquidVolume));

  return (
    <group ref={groupRef} {...props}>
      {/* Vỏ cốc thủy tinh - Thân chính */}
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.52, 0.48, 1.1, 32, 1, true]} />
        <primitive object={beakerMaterial} attach="material" />
      </mesh>

      {/* Hiệu ứng chọn cốc (cũng dùng để trang trí) */}
      {isActive && (
        <mesh position={[0, -0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
           <ringGeometry args={[0.55, 0.65, 32]} />
           <meshBasicMaterial color="#3b82f6" transparent opacity={0.5} />
        </mesh>
      )}

      {/* Viền miệng cốc (lip) */}
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

      {/* Mỏ rót (Spout) */}
      <mesh position={[0, 1.1, 0.53]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.15, 0.04, 0.08]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={settings.beakerOpacity} transparent />
      </mesh>

      {/* Đáy cốc */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.48, 0.48, 0.06, 32]} />
        <meshPhysicalMaterial color="#ffffff" transmission={0.85} opacity={settings.beakerOpacity} transparent />
      </mesh>

      {/* Chất lỏng */}
      {liquidCount > 0 && (
        <mesh position={[0, waterLevel / 2 + 0.03, 0]}>
          <cylinderGeometry args={[0.46, 0.46, waterLevel, 32]} />
          <primitive object={waterMaterial} attach="material" />
        </mesh>
      )}

      {/* Chất rắn dưới đáy cốc (Có hiệu ứng rơi) */}
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
