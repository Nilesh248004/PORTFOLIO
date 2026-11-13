'use client';

import { useCallback, useEffect, useState, type CSSProperties } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { profile } from '@/data/content';
import { bookingEnabled } from '@/lib/booking';

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

export default function Hero({ resumeHref }: { resumeHref?: string }) {
  const typed = useTyping(profile.roles);
  const [mode, setMode] = useState<'pending' | 'webgl' | 'css'>('pending');

  useEffect(() => {
    const small = window.matchMedia('(max-width: 760px)').matches;
    const reduced = document.documentElement.classList.contains('rm');
    setMode(small || reduced ? 'css' : 'webgl');
  }, []);
  const fail = useCallback(() => setMode('css'), []);

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
          <a className="btn btn-primary" href="#work">
            See my work
          </a>
          {bookingEnabled ? (
            <Link className="btn btn-ghost" href="/book">
              Book a call
            </Link>
          ) : (
            <a className="btn btn-ghost" href="#contact-form">
              Contact me
            </a>
          )}
          {resumeHref && (
            <a className="btn btn-ghost" href={resumeHref} download>
              Download resume
            </a>
          )}
        </div>
      </div>

      <div className="hero-visual" data-reveal>
        <div className="floor" aria-hidden="true" />
        <div className="stage">
          <div className="portrait-glow" aria-hidden="true" />
          <div className="portrait glass">
            <Image src="/photo.png" alt={`Portrait of ${profile.name}`} width={783} height={1024} priority sizes="(max-width: 640px) 90vw, 440px" />
            <div className="portrait-tint" aria-hidden="true" />
            <div className="portrait-glare" aria-hidden="true" />
          </div>
          <div className="float-card card-b" style={{ right: -20, top: 40, transform: 'translateZ(60px)' }}>
            <span className="mono">QA @ {profile.company}</span>
          </div>
          {mode === 'webgl' && <HeroScene onFail={fail} />}
          {mode === 'css' && (
            <div className="slabs-css" aria-hidden="true">
              <div className="slab" style={{ transform: 'translateZ(0)', '--sh': 255 } as CSSProperties}>
                <span>BUILD</span>
              </div>
              <div className="slab" style={{ transform: 'translateZ(28px)', '--sh': 150 } as CSSProperties}>
                <span>TEST</span>
              </div>
              <div className="slab" style={{ transform: 'translateZ(56px)', '--sh': 350 } as CSSProperties}>
                <span>SHIP</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
