import { useEffect, useRef, useState } from 'react';

export function useInView<T extends HTMLElement>(options?: IntersectionObserverInit): [React.RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px', ...options }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [options]);

  return [ref, inView];
}

export function useCountUp(target: number, duration = 1400, start = false) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const begin = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - begin) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);

  return value;
}
