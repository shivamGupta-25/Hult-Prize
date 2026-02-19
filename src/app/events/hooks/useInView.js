"use client";

import { useRef, useState, useEffect } from "react";

/**
 * useInView — fires once when the element enters the viewport.
 * Returns [ref, inView].
 */
export function useInView(options = {}) {
  const ref = useRef(null);
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
      { threshold: 0.15, ...options }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return [ref, inView];
}

/**
 * AnimatedCounter — counts up from 0 to `end` when scrolled into view.
 */
export function AnimatedCounter({ end, duration = 1800, suffix = "" }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView();
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const numericEnd = parseInt(String(end).replace(/\D/g, "")) || 0;
    const startTime = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * numericEnd));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, end, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}
