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
  const activeBeakerIndex = useLabStore(state => state.activeBeakerIndex);
  const isPouringFormula = useLabStore(state => state.isPouringFormula);

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
      // Bắt đầu đổ - phát âm thanh pour
      playSound('pour', { chemicalState: 'liquid' });
    }

    prevStateRef.current.isPouringFormula = isPouringFormula;
  }, [isPouringFormula, enabled, playSound]);

  // Lắng nghe thay đổi trạng thái của các cốc
  useEffect(() => {
    if (!enabled) return;

    beakers.forEach((beaker, index) => {
      const prevState = prevStateRef.current.beakerStates[beaker.id] || {};

      // Phát âm thanh khi bật/tắt lửa
      if (beaker.isHeating && !prevState.isHeating) {
        playSound('fire', { duration: 3 });
      }

      // Phát âm thanh khi có bọt khí
      if (beaker.activeBubbles && !prevState.activeBubbles) {
        playSound('bubble', { duration: 4 });
      }

      // Phát âm thanh khi có khói
      if (beaker.activeSmoke && !prevState.activeSmoke) {
        if (beaker.isHeating) {
          playSound('steam', { duration: 3 });
        } else {
          playSound('smoke', { duration: 2 });
        }
      }

      // Phát âm thanh nổ khi có phản ứng mạnh
      if (beaker.activeFlame && !prevState.activeFlame) {
        playSound('explosion', { intensity: beaker.intensity });
      }

      // Phát âm thanh shake/rung khi có phản ứng mãnh liệt
      if (beaker.shake && !prevState.shake) {
        playSound('explosion', { intensity: beaker.intensity });
      }

      // Cập nhật trạng thái trước đó
      prevStateRef.current.beakerStates[beaker.id] = {
        isHeating: beaker.isHeating,
        activeBubbles: beaker.activeBubbles,
        activeSmoke: beaker.activeSmoke,
        activeFlame: beaker.activeFlame,
        shake: beaker.shake,
        contentsLength: beaker.contents.length,
      };
    });
  }, [beakers, enabled, playSound]);

  // Component này không render gì
  return null;
};

export default SoundManager;
