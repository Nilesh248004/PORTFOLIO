'use client';

import { useRef, useState } from 'react';
import { profile } from '@/data/content';

type Status = { kind: 'idle' | 'sending' | 'ok' | 'err'; msg?: string; mailto?: string };

export default function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const opened = useRef(Date.now());

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus({ kind: 'sending' });
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, elapsed: Date.now() - opened.current }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Something went wrong. Please email me directly.');
      form.reset();
      setStatus({ kind: 'ok', msg: 'Thanks, your message is on its way. I will reply soon.' });
    } catch (err) {
      // Keep what the visitor wrote: offer the same message as a ready-to-send email.
      const subject = encodeURIComponent(`Portfolio message from ${String(data.name ?? '').trim() || 'a visitor'}`);
      const text = encodeURIComponent(String(data.message ?? ''));
      setStatus({
        kind: 'err',
        msg: err instanceof Error ? err.message : 'Something went wrong. Please email me directly.',
        mailto: `mailto:${profile.email}?subject=${subject}&body=${text}`,
      });
    }
  }

  return (
    <form id="contact-form" className="form" onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" type="text" autoComplete="name" required minLength={2} maxLength={80} />
      </div>
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required maxLength={120} />
      </div>
      <div className="field">
        <label htmlFor="message">How can I help?</label>
        <textarea id="message" name="message" required minLength={10} maxLength={3000} />
      </div>
      {/* honeypot: real visitors never see or fill this */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <button className="btn btn-primary" type="submit" disabled={status.kind === 'sending'}>
        {status.kind === 'sending' ? 'Sending...' : 'Send message'}
      </button>
      <p className={`form-msg ${status.kind === 'ok' ? 'ok' : status.kind === 'err' ? 'err' : ''}`} role="status" aria-live="polite">
        {status.msg}
        {status.mailto && (
          <>
            {' '}
            <a className="form-fallback" href={status.mailto}>
              Send it from your email app instead
            </a>
          </>
        )}
      </p>
    </form>
  );
}
