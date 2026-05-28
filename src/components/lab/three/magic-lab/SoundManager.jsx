import { useEffect, useRef } from 'react';
import useLabStore from './store';
import { useSoundEffects, useSoundStore } from './useSoundEffects';

/**
 * SoundManager - Component quáº£n lÃ½ Ã¢m thanh cho phÃ²ng thÃ­ nghiá»‡m 3D
 * Láº¯ng nghe cÃ¡c thay Ä‘á»•i tráº¡ng thÃ¡i tá»« store vÃ  phÃ¡t Ã¢m thanh phÃ¹ há»£p
 */
const SoundManager = () => {
  const { playSound, stopSound } = useSoundEffects();
  const { enabled } = useSoundStore();

  // Láº¥y tráº¡ng thÃ¡i tá»« store
  const beakers = useLabStore(state => state.beakers);
  const isPouringFormula = useLabStore(state => state.isPouringFormula);
  const chemicals = useLabStore(state => state.chemicals);

  // Refs Ä‘á»ƒ theo dÃµi tráº¡ng thÃ¡i trÆ°á»›c Ä‘Ã³
  const prevStateRef = useRef({
    isPouringFormula: null,
    beakerStates: {},
  });

  // Láº¯ng nghe khi Ä‘á»• hÃ³a cháº¥t
  useEffect(() => {
    if (!enabled) return;

    const prev = prevStateRef.current.isPouringFormula;

    if (isPouringFormula && !prev) {
      // XÃ¡c Ä‘á»‹nh tráº¡ng thÃ¡i cá»§a hÃ³a cháº¥t Ä‘ang Ä‘á»•
      const chem = chemicals[isPouringFormula];
      playSound('pour', { chemicalState: chem?.state || 'liquid' });
    }

    prevStateRef.current.isPouringFormula = isPouringFormula;
  }, [isPouringFormula, enabled, playSound, chemicals]);

  // Láº¯ng nghe thay Ä‘á»•i tráº¡ng thÃ¡i cá»§a cÃ¡c cá»‘c
  useEffect(() => {
    if (!enabled) return;

    beakers.forEach((beaker) => {
      const prevState = prevStateRef.current.beakerStates[beaker.id] || {};

      // --- QUáº¢N LÃ Lá»¬A/NHIá»†T ---
      if (beaker.isHeating && !prevState.isHeating) {
        playSound('fire', { continuous: true });
      } else if (!beaker.isHeating && prevState.isHeating) {
        stopSound('fire');
      }

      // --- QUáº¢N LÃ KHÃ/Sá»¦I Bá»ŒT ---
      if (beaker.activeBubbles && !prevState.activeBubbles) {
        // PhÃ¡t má»™t chuá»—i Ã¢m thanh fizz náº¿u cÃ³ bá»t khÃ­
        playSound('fizz', { duration: 5 });
      }

      // --- QUáº¢N LÃ KHÃ“I/HÆ I NÆ¯á»šC ---
      if (beaker.activeSmoke && !prevState.activeSmoke) {
        const type = beaker.isHeating ? 'steam' : 'smoke';
        playSound(type, { duration: 3 });
      }

      // --- QUáº¢N LÃ PHáº¢N á»¨NG Máº NH/Ná»” ---
      if (beaker.activeFlame && !prevState.activeFlame) {
        playSound('explosion', { intensity: beaker.intensity });
      }

      // PhÃ¡t Ã¢m thanh rung khi cÃ³ pháº£n á»©ng mÃ£nh liá»‡t
      if (beaker.shake && !prevState.shake) {
        playSound('explosion', { intensity: 'low' });
      }

      // Cáº­p nháº­t tráº¡ng thÃ¡i trÆ°á»›c Ä‘Ã³
      prevStateRef.current.beakerStates[beaker.id] = {
        isHeating: beaker.isHeating,
        activeBubbles: beaker.activeBubbles,
        activeSmoke: beaker.activeSmoke,
        activeFlame: beaker.activeFlame,
        shake: beaker.shake,
      };
    });
  }, [beakers, enabled, playSound, stopSound]);

  // Component nÃ y khÃ´ng render gÃ¬
  return null;
};

export default SoundManager;

