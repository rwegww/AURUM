import React, { useEffect, useRef } from 'react';
import { extend, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls as ThreeOrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Beaker from './Beaker';
import FireEffect from './FireEffect';
import BubbleParticles from './BubbleParticles';
import SmokeParticles from './SmokeParticles';
import PouringStream from './PouringStream';
import useLabStore from './store';

extend({ OrbitControls: ThreeOrbitControls });

const CameraControls = () => {
  const controlsRef = useRef();
  const { camera, gl } = useThree();

  useFrame(() => {
    controlsRef.current?.update();
  });

  return (
    <orbitControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2.15}
      minDistance={3.5}
      maxDistance={10}
      enablePan
      autoRotate={false}
    />
  );
};

const LabScene = () => {
  const beakers = useLabStore(state => state.beakers);
  const activeBeakerIndex = useLabStore(state => state.activeBeakerIndex);
  const setActiveBeaker = useLabStore(state => state.setActiveBeaker);
  const isPouringFormula = useLabStore(state => state.isPouringFormula);
  const evaporateStep = useLabStore(state => state.evaporateStep);

  const groupRef = useRef();

  // Xử lý bay hơi theo thời gian cho tất cả các cốc đang đun nóng
  useEffect(() => {
    const interval = setInterval(() => {
      beakers.forEach((beaker, beakerIdx) => {
        if (beaker.isHeating) {
            evaporateStep(beakerIdx);
        }
      });
    }, 2000); // 2 giây mỗi bước bay hơi
    return () => clearInterval(interval);
  }, [beakers, evaporateStep]);

  useFrame((state) => {
    const activeBeaker = beakers[activeBeakerIndex];
    if (activeBeaker?.shake) {
       // Use performance.now() instead of deprecated state.clock.elapsedTime
       const t = (performance.now() * 0.001) * 50;
       const intensity = activeBeaker.intensity === 'extreme' ? 0.15 : 0.05;
       state.camera.position.x += Math.sin(t) * intensity;
       state.camera.position.y += Math.cos(t * 1.2) * intensity;
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-4, 4, -3]} intensity={0.5} color="#60a5fa" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]} receiveShadow>
        <circleGeometry args={[5.5, 64]} />
        <shadowMaterial opacity={0.35} />
      </mesh>

      <group ref={groupRef}>
        {beakers.map((beaker, i) => {
          const xPos = (i - (beakers.length - 1) / 2) * 1.8;
          const isActive = i === activeBeakerIndex;

          return (
            <group key={beaker.id} position={[xPos, 0, 0]}>
              <Beaker 
                beakerData={beaker} 
                isActive={isActive} 
                onClick={() => setActiveBeaker(i)} 
              />

              <FireEffect active={beaker.activeFlame || beaker.isHeating} intensity={beaker.activeFlame ? beaker.intensity : 'low'} />
              <BubbleParticles active={beaker.activeBubbles} />
              <SmokeParticles active={beaker.activeSmoke} color={beaker.smokeColor} intensity={beaker.intensity} />

              {isActive && <PouringStream formula={isPouringFormula} />}



              {isActive && (
                <mesh position={[0, -0.18, 0.8]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[0.42, 0.48, 48]} />
                  <meshBasicMaterial color="#60a5fa" transparent opacity={0.75} />
                </mesh>
              )}
            </group>
          );
        })}
      </group>

      <CameraControls />
    </>
  );
};

export default LabScene;
