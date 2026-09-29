import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const getPageScrollers = () => [
  document.scrollingElement,
  ...document.querySelectorAll('[data-page-scroll]'),
].filter(Boolean);

export default function BackToTop({ hasAssistant = true }) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setVisible(getPageScrollers().some((element) => element.scrollTop > 400));
    };
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    // Capture also sees the independent lesson and management scroll areas.
    document.addEventListener('scroll', scheduleUpdate, { capture: true, passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });
    scheduleUpdate();
    return () => {
      document.removeEventListener('scroll', scheduleUpdate, true);
      window.removeEventListener('resize', scheduleUpdate);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  const scrollToTop = () => {
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'instant'
      : 'smooth';
    getPageScrollers().forEach((element) => {
      element.scrollTo({ top: 0, behavior });
    });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label={t('nav.back_to_top')}
      title={t('nav.back_to_top')}
      className={`fixed right-[max(1.25rem,env(safe-area-inset-right))] z-40 flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-b-4 border-viet-green/40 bg-white text-viet-green shadow-lg shadow-viet-green/15 hover:bg-viet-green hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-viet-green motion-safe:animate-fade-in cursor-pointer ${hasAssistant ? 'bottom-[calc(5.5rem+env(safe-area-inset-bottom))]' : 'bottom-[max(1.25rem,env(safe-area-inset-bottom))]'}`}
    >
      <ArrowUp size={24} strokeWidth={2.5} aria-hidden="true" />
    </button>
  );
}
