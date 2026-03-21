import { useRef, useCallback } from 'react';

/**
 * Native-feeling pull-to-refresh via pointer/touch events.
 * Returns a ref to attach to the scrollable container and a spinner state.
 */
export function usePullToRefresh(onRefresh) {
  const startY = useRef(null);
  const pulling = useRef(false);
  const indicatorRef = useRef(null);

  const onTouchStart = useCallback((e) => {
    startY.current = e.touches[0].clientY;
    pulling.current = false;
  }, []);

  const onTouchMove = useCallback((e) => {
    const el = e.currentTarget;
    if (el.scrollTop > 0) return;
    const delta = e.touches[0].clientY - startY.current;
    if (delta > 0 && indicatorRef.current) {
      pulling.current = true;
      const clamped = Math.min(delta * 0.4, 60);
      indicatorRef.current.style.transform = `translateY(${clamped}px)`;
      indicatorRef.current.style.opacity = String(Math.min(clamped / 60, 1));
    }
  }, []);

  const onTouchEnd = useCallback(async () => {
    if (!indicatorRef.current) return;
    const current = parseFloat(indicatorRef.current.style.transform.replace('translateY(', '') || '0');
    if (pulling.current && current >= 40) {
      indicatorRef.current.style.transform = 'translateY(48px)';
      indicatorRef.current.style.opacity = '1';
      await onRefresh();
    }
    indicatorRef.current.style.transition = 'transform 0.25s ease, opacity 0.25s ease';
    indicatorRef.current.style.transform = 'translateY(0px)';
    indicatorRef.current.style.opacity = '0';
    setTimeout(() => {
      if (indicatorRef.current) indicatorRef.current.style.transition = '';
    }, 260);
    pulling.current = false;
  }, [onRefresh]);

  const scrollProps = { onTouchStart, onTouchMove, onTouchEnd };

  return { indicatorRef, scrollProps };
}