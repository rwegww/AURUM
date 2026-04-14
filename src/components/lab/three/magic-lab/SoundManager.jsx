import { useEffect, useRef } from 'react';
import useLabStore from './store';
import { useSoundEffects, useSoundStore } from './useSoundEffects';

/**
 * SoundManager - Component quản lý âm thanh cho phòng thí nghiệm 3D
 * Lắng nghe các thay đổi trạng thái từ store và phát âm thanh phù hợp
 */
const SoundManager = () => {
  const { playSound, stopSound } = useSoundEffects();
  const { enabled } = useSoundStore();

  // Lấy trạng thái từ store
  const beakers = useLabStore(state => state.beakers);
  const isPouringFormula = useLabStore(state => state.isPouringFormula);
  const chemicals = useLabStore(state => state.chemicals);

  // Refs để theo dõi trạng thái trước đó
  const prevStateRef = useRef({
    isPouringFormula: null,
    beakerStates: {},
  });

  // Lắng nghe khi đổ hóa chất
  useEffect(() => {
    if (!enabled) return;

    const prev = prevStateRef.current.isPouringFormula;

    if (isPouringFormula && !prev) {
      // Xác định trạng thái của hóa chất đang đổ
      const chem = chemicals[isPouringFormula];
      playSound('pour', { chemicalState: chem?.state || 'liquid' });
    }

    prevStateRef.current.isPouringFormula = isPouringFormula;
  }, [isPouringFormula, enabled, playSound, chemicals]);

  // Lắng nghe thay đổi trạng thái của các cốc
  useEffect(() => {
    if (!enabled) return;

    beakers.forEach((beaker) => {
      const prevState = prevStateRef.current.beakerStates[beaker.id] || {};

      // --- QUẢN LÝ LỬA/NHIỆT ---
      if (beaker.isHeating && !prevState.isHeating) {
        playSound('fire', { continuous: true });
      } else if (!beaker.isHeating && prevState.isHeating) {
        stopSound('fire');
      }

      // --- QUẢN LÝ KHÍ/SỦI BỌT ---
      if (beaker.activeBubbles && !prevState.activeBubbles) {
        // Phát một chuỗi âm thanh fizz nếu có bọt khí
        playSound('fizz', { duration: 5 });
      }

      // --- QUẢN LÝ KHÓI/HƠI NƯỚC ---
      if (beaker.activeSmoke && !prevState.activeSmoke) {
        const type = beaker.isHeating ? 'steam' : 'smoke';
        playSound(type, { duration: 3 });
      }

      // --- QUẢN LÝ PHẢN ỨNG MẠNH/NỔ ---
      if (beaker.activeFlame && !prevState.activeFlame) {
        playSound('explosion', { intensity: beaker.intensity });
      }

      // Phát âm thanh rung khi có phản ứng mãnh liệt
      if (beaker.shake && !prevState.shake) {
        playSound('explosion', { intensity: 'low' });
      }

      // Cập nhật trạng thái trước đó
      prevStateRef.current.beakerStates[beaker.id] = {
        isHeating: beaker.isHeating,
        activeBubbles: beaker.activeBubbles,
        activeSmoke: beaker.activeSmoke,
        activeFlame: beaker.activeFlame,
        shake: beaker.shake,
      };
    });
  }, [beakers, enabled, playSound, stopSound]);

  // Component này không render gì
  return null;
};

export default SoundManager;
