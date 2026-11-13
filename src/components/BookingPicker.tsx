'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { callTypes, profile } from '@/data/content';

type CalModule = typeof import('@calcom/embed-react');
type CalFn = (...args: unknown[]) => void;
type Theme = 'dark' | 'light';

const SLOW_AFTER_MS = 12_000;

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

// One Cal.com booking calendar. It is mounted fresh (via `key`) for every call type, because the embed
// initialises once per component instance.
function CalEmbed({ cal, username, slug, theme }: { cal: CalModule; username: string; slug: string; theme: Theme }) {
  const Cal = cal.default;
  const [status, setStatus] = useState<'loading' | 'ready' | 'slow'>('loading');
  const wrap = useRef<HTMLDivElement>(null);
  const config = useMemo(() => ({ layout: 'month_view' as const, theme }), [theme]);

  // Tell us when the calendar is ready or failed, and fall back to a message if it takes too long.
  useEffect(() => {
    let alive = true;
    let off: (() => void) | undefined;
    const timer = setTimeout(() => alive && setStatus((s) => (s === 'ready' ? s : 'slow')), SLOW_AFTER_MS);
    cal.getCalApi({ namespace: slug }).then((api) => {
      if (!alive) return;
      const fn = api as unknown as CalFn;
      const onReady = () => alive && setStatus('ready');
      const onFailed = () => alive && setStatus('slow');
      fn('on', { action: 'linkReady', callback: onReady });
      fn('on', { action: 'linkFailed', callback: onFailed });
      off = () => {
        fn('off', { action: 'linkReady', callback: onReady });
        fn('off', { action: 'linkFailed', callback: onFailed });
      };
    });
    return () => {
      alive = false;
      clearTimeout(timer);
      off?.();
    };
  }, [cal, slug]);

  // Keep the calendar's colours in step with the site's dark/light toggle.
  useEffect(() => {
    cal.getCalApi({ namespace: slug }).then((api) => {
      (api as unknown as CalFn)('ui', { theme, layout: 'month_view', hideEventTypeDetails: false });
    });
  }, [cal, slug, theme]);

  // The embed creates its own iframe; give it an accessible name.
  useEffect(() => {
    const box = wrap.current;
    if (!box) return;
    const label = () =>
      box.querySelectorAll('iframe').forEach((f) => {
        if (!f.getAttribute('title')) f.setAttribute('title', 'Booking calendar');
      });
    label();
    const observer = new MutationObserver(label);
    observer.observe(box, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {status !== 'ready' && (
        <p className="book-status" role="status">
          {status === 'loading' ? (
            'Loading the calendar...'
          ) : (
            <>
              The calendar is taking a while to load. You can also email{' '}
              <a href={`mailto:${profile.email}`}>{profile.email}</a> and I will suggest a time.
            </>
          )}
        </p>
      )}
      <div ref={wrap} role="region" aria-label="Booking calendar">
        <Cal namespace={slug} calLink={`${username}/${slug}`} config={config} style={{ width: '100%', minHeight: 560 }} />
      </div>
    </>
  );
}

export default function BookingPicker({ username }: { username: string }) {
  // null until the address bar has been read, so a link like /book?type=qa-help opens the right calendar first time.
  const [selected, setSelected] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>('dark');
  const [cal, setCal] = useState<CalModule | null>(null);
  const current = selected ?? callTypes[0].slug;

  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get('type');
    setSelected(callTypes.some((t) => t.slug === wanted) ? wanted : callTypes[0].slug);
  }, []);

  useEffect(() => {
    setTheme(currentTheme());
    const observer = new MutationObserver(() => setTheme(currentTheme()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  // The Cal.com code is only downloaded on this page.
  useEffect(() => {
    let alive = true;
    import('@calcom/embed-react').then((m) => alive && setCal(m));
    return () => {
      alive = false;
    };
  }, []);

  const choose = (slug: string) => {
    setSelected(slug);
    const url = new URL(window.location.href);
    url.searchParams.set('type', slug);
    window.history.replaceState(null, '', url);
  };

  return (
    <>
      <fieldset className="call-types">
        <legend>What is the call about?</legend>
        <div className="call-type-grid">
          {callTypes.map((t) => (
            <label key={t.slug} className="call-type">
              <input type="radio" name="call-type" value={t.slug} checked={current === t.slug} onChange={() => choose(t.slug)} />
              <span className="call-type-title">{t.title}</span>
              <span className="call-type-blurb">{t.blurb}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="cal-card glass">
        {cal && selected ? (
          <CalEmbed key={selected} cal={cal} username={username} slug={selected} theme={theme} />
        ) : (
          <p className="book-status" role="status">
            Loading the calendar...
          </p>
        )}
      </div>

      <p className="book-note">
        Prefer email? Write to <a href={`mailto:${profile.email}`}>{profile.email}</a>. The calendar is provided by Cal.com and loads from
        their servers.
      </p>
    </>
  );
}
