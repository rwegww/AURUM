import React, { useRef } from 'react';
import { OrbitControls, Environment, ContactShadows, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import Beaker from './Beaker';
import FireEffect from './FireEffect';
import BubbleParticles from './BubbleParticles';
import SmokeParticles from './SmokeParticles';
import PouringStream from './PouringStream';
import useLabStore from './store';

const LabScene = () => {
  const beakers = useLabStore(state => state.beakers);
  const activeBeakerIndex = useLabStore(state => state.activeBeakerIndex);
  const setActiveBeaker = useLabStore(state => state.setActiveBeaker);
  const isPouringFormula = useLabStore(state => state.isPouringFormula);
  const evaporateStep = useLabStore(state => state.evaporateStep);

  const groupRef = useRef();

  // Xử lý bay hơi theo thời gian cho tất cả các cốc đang đun nóng
  React.useEffect(() => {
    const interval = setInterval(() => {
      beakers.forEach((beaker, i) => {
        if (beaker.isHeating) {
            evaporateStep(i);
        }
      });
    }, 2000); // 2 giây mỗi bước bay hơi
    return () => clearInterval(interval);
  }, [beakers, evaporateStep]);

  useFrame((state) => {
    const activeBeaker = beakers[activeBeakerIndex];
    if (activeBeaker?.shake) {
       const t = state.clock.elapsedTime * 50;
       const intensity = activeBeaker.intensity === 'extreme' ? 0.15 : 0.05;
       state.camera.position.x += Math.sin(t) * intensity;
       state.camera.position.y += Math.cos(t * 1.2) * intensity;
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
      <Environment preset="night" />
      <ContactShadows position={[0, -0.01, 0]} scale={10} blur={3} opacity={0.5} />

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

              {beaker.reactionProducts.length > 0 && (
                <Html position={[0.7, 0.8, 0]} center distanceFactor={4}>
                  <div style={{
                    background: 'rgba(0,0,0,0.85)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '12px',
                    padding: '10px 18px',
                    border: '1px solid rgba(255,255,255,0.25)',
                    pointerEvents: 'none',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                    animation: 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}>
                    {beaker.reactionProducts.map((p) => (
                      <div key={p.formula} style={{
                        color: p.color === '#ffffff' ? '#a0d8ef' : p.color,
                        fontFamily: 'monospace',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        lineHeight: '1.4',
                        textShadow: `0 0 10px ${p.color}55`
                      }}>
                        {p.formula}
                      </div>
                    ))}
                  </div>
                </Html>
              )}

              <Html position={[0, -0.25, 0.8]} center>
                 <div 
                   onClick={() => setActiveBeaker(i)}
                   style={{
                     cursor: 'pointer',
                     color: isActive ? '#60a5fa' : '#4b5563',
                     fontSize: '12px',
                     fontWeight: 'bold',
                     textTransform: 'uppercase',
                     letterSpacing: '1px',
                     background: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                     padding: '3px 10px',
                     borderRadius: '6px',
                     transition: 'all 0.3s',
                     border: isActive ? '1px solid rgba(96, 165, 250, 0.3)' : '1px solid transparent'
                   }}
                 >
                   {isActive ? (
                     beaker.reactionMessage.includes('💥') || beaker.reactionMessage.includes('💣') 
                       ? '🔴 DANGER' 
                       : (beaker.contents.length > 0 
                           ? [...new Set(beaker.contents.map(c => c.formula))].join(' + ') 
                           : '🟢 TRỐNG')
                   ) : `Cốc ${i+1}`}
                 </div>
              </Html>
            </group>
          );
        })}
      </group>

      <OrbitControls
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.15}
        minDistance={3.5}
        maxDistance={10}
        enablePan={true}
        autoRotate={false}
      />
    </>
  );
};

export default LabScene;
