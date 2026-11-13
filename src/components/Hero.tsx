'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { profile } from '@/data/content';

const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false });

function useTyping(words: string[]) {
  const [text, setText] = useState(words[0]);
  useEffect(() => {
    if (document.documentElement.classList.contains('rm')) return;
    let w = 0;
    let i = words[0].length;
    let dir: 1 | -1 = -1;
    let timer: ReturnType<typeof setTimeout>;
    const step = () => {
      const word = words[w];
      i += dir;
      setText(word.slice(0, i));
      let delay = dir === 1 ? 70 : 38;
      if (dir === 1 && i === word.length) {
        dir = -1;
        delay = 1800;
      } else if (dir === -1 && i === 0) {
        dir = 1;
        w = (w + 1) % words.length;
        delay = 350;
      }
      timer = setTimeout(step, delay);
    };
    timer = setTimeout(step, 4500);
    return () => clearTimeout(timer);
  }, [words]);
  return text;
}

export default function Hero({ resumeHref, calendarUrl }: { resumeHref?: string; calendarUrl?: string }) {
  const typed = useTyping(profile.roles);
  const stage = useRef<HTMLDivElement>(null);
  const portrait = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<'pending' | 'webgl' | 'css'>('pending');

  useEffect(() => {
    const small = window.matchMedia('(max-width: 760px)').matches;
    const reduced = document.documentElement.classList.contains('rm');
    setMode(small || reduced ? 'css' : 'webgl');
  }, []);
  const fail = useCallback(() => setMode('css'), []);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !stage.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    const py = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    stage.current.style.transform = `rotateY(${(-9 + (px - 0.5) * 22).toFixed(1)}deg) rotateX(${(4 - (py - 0.5) * 16).toFixed(1)}deg)`;
    portrait.current?.style.setProperty('--gx', `${(px * 100).toFixed(0)}%`);
    portrait.current?.style.setProperty('--gy', `${(py * 100).toFixed(0)}%`);
  };
  const onLeave = () => {
    if (stage.current) stage.current.style.transform = 'rotateY(-9deg) rotateX(4deg)';
    portrait.current?.style.setProperty('--gx', '50%');
    portrait.current?.style.setProperty('--gy', '30%');
  };

  return (
    <section id="top" className="hero">
      <div className="hero-copy">
        <div className="pill glass" data-reveal>
          <i aria-hidden="true" />
          {profile.company} · {profile.since} – Present
        </div>
        <h1 data-reveal>{profile.name}</h1>
        <p className="hero-role" data-reveal>
          <span className="sr-only">{profile.title}</span>
          <span aria-hidden="true">{typed}</span>
          <span className="caret" aria-hidden="true" />
        </p>
        <p className="hero-pitch" data-reveal>
          {profile.pitch}
        </p>
        <div className="hero-actions" data-reveal>
          <a className="btn btn-primary" data-magnetic href="#work">
            See my work
          </a>
          <a className="btn btn-ghost" data-magnetic href={calendarUrl || '#contact-form'} {...(calendarUrl ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
            Book a call
          </a>
          {resumeHref && (
            <a className="btn btn-ghost" data-magnetic href={resumeHref} download>
              Download resume
            </a>
          )}
        </div>
      </div>

      <div className="hero-visual" data-reveal onPointerMove={onMove} onPointerLeave={onLeave}>
        <div className="floor" aria-hidden="true" />
        <div ref={stage} className="stage" style={{ transform: 'rotateY(-9deg) rotateX(4deg)' }}>
          <div className="portrait-glow" aria-hidden="true" />
          <div ref={portrait} className="portrait glass">
            <Image src="/photo.png" alt={`Portrait of ${profile.name}`} width={783} height={1024} priority sizes="(max-width: 640px) 90vw, 440px" />
            <div className="portrait-tint" aria-hidden="true" />
            <div className="portrait-glare" aria-hidden="true" />
          </div>
          <div className="float-card card-a" style={{ ['--z' as string]: '90px', left: -28, bottom: 48, transform: 'translateZ(90px)' }}>
            <b>3</b>
            <small>End-to-end projects</small>
          </div>
          <div className="float-card card-b" style={{ ['--z' as string]: '60px', right: -20, top: 40, transform: 'translateZ(60px)', animationDelay: '-3s' }}>
            <span className="mono">QA @ {profile.company}</span>
          </div>
          {mode === 'webgl' && <HeroScene onFail={fail} />}
          {mode === 'css' && (
            <div className="slabs-css" aria-hidden="true">
              <div className="slab" style={{ transform: 'translateZ(0)' }}>
                <span>BUILD</span>
              </div>
              <div className="slab" style={{ transform: 'translateZ(28px)' }}>
                <span>TEST</span>
              </div>
              <div className="slab" style={{ transform: 'translateZ(56px)', background: 'linear-gradient(145deg,rgba(37,99,235,.6),rgba(56,189,248,.2))' }}>
                <span>SHIP</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
