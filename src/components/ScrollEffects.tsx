'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Scroll reveals, staggered groups and animated counters.
export default function ScrollEffects() {
  useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains('rm')) return;
    gsap.registerPlugin(ScrollTrigger);

    const heroDelay = root.dataset.skipLoader ? 0.1 : 1.7;
    const done = (el: Element) => {
      el.classList.add('in');
      gsap.set(el, { clearProps: 'transform,opacity' });
    };

    const ctx = gsap.context(() => {
      let heroIdx = 0;
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        const inHero = !!el.closest('#top');
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          delay: inHero ? heroDelay + heroIdx++ * 0.12 : 0,
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          onComplete: () => done(el),
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((group) => {
        gsap.to(Array.from(group.children), {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: { trigger: group, start: 'top 88%', once: true },
          onComplete: () => Array.from(group.children).forEach(done),
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
        const target = Number(el.dataset.count || 0);
        const o = { v: 0 };
        el.textContent = '0';
        gsap.to(o, {
          v: target,
          duration: 1.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          onUpdate: () => {
            el.textContent = Math.round(o.v).toLocaleString('en-US');
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return null;
}
