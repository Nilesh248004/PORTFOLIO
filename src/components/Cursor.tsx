'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

// Glowing cursor (fine pointers only) + magnetic pull on [data-magnetic] elements.
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains('fine')) return;
    root.classList.add('has-cursor');

    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.08, ease: 'power3' });
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.08, ease: 'power3' });
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.35, ease: 'power3' });
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.35, ease: 'power3' });

    let magnet: HTMLElement | null = null;

    const move = (e: PointerEvent) => {
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);

      const t = e.target as HTMLElement | null;
      const interactive = !!t?.closest('a, button, input, textarea, [data-magnetic]');
      ring.current?.classList.toggle('hover', interactive);

      const m = t?.closest<HTMLElement>('[data-magnetic]') ?? null;
      if (magnet && magnet !== m) {
        gsap.to(magnet, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
      }
      magnet = m;
      if (m) {
        const r = m.getBoundingClientRect();
        const mx = (e.clientX - (r.left + r.width / 2)) * 0.28;
        const my = (e.clientY - (r.top + r.height / 2)) * 0.35;
        gsap.to(m, { x: mx, y: my, duration: 0.3, ease: 'power3.out' });
      }
    };
    const leave = () => {
      if (magnet) gsap.to(magnet, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
      magnet = null;
    };

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
      root.classList.remove('has-cursor');
    };
  }, []);

  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true" />
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
