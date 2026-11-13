'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Scroll reveals, staggered groups, and the stat-card animations (count-up, word scramble, word-by-word stream).
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

      // Stat cards fade in one after another; start each card's own animation just after its card appears.
      const cardDelay = (el: Element) => {
        const card = el.closest('.stat');
        const index = card?.parentElement ? Array.from(card.parentElement.children).indexOf(card) : 0;
        return 0.15 + Math.max(index, 0) * 0.12;
      };

      gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
        const target = Number(el.dataset.count || 0);
        const o = { v: 0 };
        el.textContent = '0';
        gsap.to(o, {
          v: target,
          duration: 1.8,
          ease: 'power2.out',
          delay: cardDelay(el),
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          onUpdate: () => {
            el.textContent = Math.round(o.v).toLocaleString('en-US');
          },
        });
      });

      // Words: letters flicker, then lock in left to right.
      const glyphs = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
      const randomGlyph = () => glyphs[Math.floor(Math.random() * glyphs.length)];
      gsap.utils.toArray<HTMLElement>('[data-decode]').forEach((el) => {
        const finalText = el.dataset.decode || '';
        const frames = 22; // ~20 flicker updates per second instead of one per screen refresh
        const o = { f: 0 };
        let last = -1;
        el.textContent = finalText.replace(/\S/g, randomGlyph);
        gsap.to(o, {
          f: frames,
          duration: 1.1,
          ease: 'none',
          delay: cardDelay(el),
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          onUpdate: () => {
            const frame = Math.floor(o.f);
            if (frame === last) return;
            last = frame;
            const settled = Math.floor((frame / frames) * finalText.length);
            el.textContent = finalText
              .split('')
              .map((ch, i) => (i < settled || ch === ' ' ? ch : randomGlyph()))
              .join('');
          },
          onComplete: () => {
            el.textContent = finalText;
          },
        });
      });

      // Streamed label: words appear one by one. They keep their space (opacity only), so the card never resizes.
      gsap.utils.toArray<HTMLElement>('[data-stream]').forEach((box) => {
        const words = Array.from(box.children);
        gsap.set(words, { opacity: 0 });
        gsap.to(words, {
          opacity: 1,
          duration: 0.05,
          ease: 'none',
          stagger: 0.09,
          delay: cardDelay(box) + 0.35,
          scrollTrigger: { trigger: box, start: 'top 92%', once: true },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return null;
}
