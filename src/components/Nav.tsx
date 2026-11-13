'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { profile } from '@/data/content';
import { bookingEnabled } from '@/lib/booking';

const links = [
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
];

// "Contact" dropdown: reach out by mail (the contact form) or by call (the booking page).
// A disclosure button that opens on click; Escape, a click outside, or tabbing away closes it.
function ContactMenu({ prefix, active }: { prefix: string; active: boolean }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      button.current?.focus();
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div
      className="nav-menu"
      ref={root}
      onBlur={(e) => {
        if (!root.current?.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        ref={button}
        type="button"
        className={`nav-link nav-menu-btn${active ? ' active' : ''}`}
        aria-expanded={open}
        aria-controls="contact-menu"
        onClick={() => setOpen((o) => !o)}
      >
        Contact
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div id="contact-menu" className="nav-dropdown">
          <a href={`${prefix}#contact`} onClick={() => setOpen(false)}>
            <strong>Reach out by mail</strong>
            <span>Send me a message</span>
          </a>
          <Link href="/book" onClick={() => setOpen(false)}>
            <strong>Reach out by call</strong>
            <span>Book a time to talk</span>
          </Link>
        </div>
      )}
    </div>
  );
}

export default function Nav({ home = true }: { home?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const bar = useRef<HTMLDivElement>(null);
  const prefix = home ? '' : '/';

  useEffect(() => {
    setTheme((document.documentElement.dataset.theme as 'dark' | 'light') || 'dark');

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    let io: IntersectionObserver | undefined;
    if (home) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) setActive(e.target.id);
          });
        },
        { rootMargin: '-45% 0px -50% 0px' },
      );
      links.forEach((l) => {
        const el = document.getElementById(l.id);
        if (el) io!.observe(el);
      });
      const top = document.getElementById('top');
      if (top) {
        new IntersectionObserver(([e]) => e.isIntersecting && setActive(''), { rootMargin: '-45% 0px -50% 0px' }).observe(top);
      }
    }
    return () => {
      window.removeEventListener('scroll', onScroll);
      io?.disconnect();
    };
  }, [home]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* ignore */
    }
  };

  return (
    <>
      <div ref={bar} className="progress" aria-hidden="true" />
      <header className={`header${scrolled ? ' scrolled' : ''}`}>
        <div className="header-inner">
          <Link className="logo" href="/" aria-label={`NK ${profile.name}, home`}>
            <span className="logo-mark">NK</span>{' '}
            {profile.name}
          </Link>
          <div className="nav-right">
            <nav className="nav glass" aria-label="Primary">
              {links.map((l) =>
                l.id === 'contact' && bookingEnabled ? (
                  <ContactMenu key={l.id} prefix={prefix} active={active === l.id} />
                ) : (
                  <a key={l.id} className={`nav-link${active === l.id ? ' active' : ''}`} href={`${prefix}#${l.id}`} aria-current={active === l.id ? 'true' : undefined}>
                    {l.label}
                  </a>
                ),
              )}
            </nav>
            <button className="icon-btn glass" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} type="button">
              {theme === 'dark' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
                </svg>
              )}
            </button>
            <button className="icon-btn glass menu-btn" onClick={() => setOpen((o) => !o)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu" type="button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>
      </header>
      <div id="mobile-menu" className={`mobile-menu${open ? ' open' : ''}`} aria-hidden={!open}>
        {links
          .filter((l) => !(l.id === 'contact' && bookingEnabled))
          .map((l) => (
            <a key={l.id} href={`${prefix}#${l.id}`} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
              {l.label}
            </a>
          ))}
        {bookingEnabled && (
          <>
            <a href={`${prefix}#contact`} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
              Reach out by mail
            </a>
            <Link href="/book" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
              Reach out by call
            </Link>
          </>
        )}
      </div>
    </>
  );
}
