import { useEffect, useRef } from 'react';
import { MotionConfig, useReducedMotion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

// Delegation covers lazy pages, menus and portalled dialogs without extra renders.
function PressFeedback() {
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    if (reducedMotion) return undefined;
    const active = new Set();
    const showFeedback = (event) => {
      const control = event.target instanceof Element
        ? event.target.closest('button, a[href], [role="button"], input[type="submit"], input[type="button"]')
        : null;
      if (!control || control.closest('[disabled], [aria-disabled="true"], [inert], [data-motion="off"]')
        || control.getAttribute('aria-busy') === 'true') return;
      const rect = control.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const ring = document.createElement('span');
      ring.className = 'aurum-press-ring';
      ring.setAttribute('aria-hidden', 'true');
      const keyboard = event.detail === 0;
      ring.style.left = `${keyboard ? rect.left + rect.width / 2 : event.clientX}px`;
      ring.style.top = `${keyboard ? rect.top + rect.height / 2 : event.clientY}px`;
      document.body.appendChild(ring);
      active.add(ring);
      ring.addEventListener('animationend', () => {
        ring.remove();
        active.delete(ring);
      }, { once: true });
      if (active.size > 8) {
        const oldest = active.values().next().value;
        oldest.remove();
        active.delete(oldest);
      }
    };
    document.addEventListener('click', showFeedback, true);
    return () => {
      document.removeEventListener('click', showFeedback, true);
      active.forEach((ring) => ring.remove());
    };
  }, [reducedMotion]);
  return null;
}

export function MotionSystem({ children }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
      <PressFeedback />
      {children}
    </MotionConfig>
  );
}

export function PageTransition({ children, disabled = false, className = '' }) {
  const { pathname } = useLocation();
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    if (disabled || reducedMotion || !ref.current?.animate) return undefined;
    // Preserve route state and the containing block of fixed-position dialogs.
    const animation = ref.current.animate([{ opacity: 0.35 }, { opacity: 1 }], {
      duration: 280, easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    });
    return () => animation.cancel();
  }, [pathname, disabled, reducedMotion]);
  return <div ref={ref} className={`aurum-page ${className}`}>{children}</div>;
}
