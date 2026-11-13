'use client';

import { useRef, useState } from 'react';
import { profile } from '@/data/content';
import { emailjsConfig } from '@/lib/emailjs';

type Status = { kind: 'idle' | 'sending' | 'ok' | 'err'; msg?: string; mailto?: string };

const MIN_FILL_MS = 1500; // a human cannot read and fill this form faster than this
const COOLDOWN_MS = 30_000; // minimum gap between two successful sends from the same browser
const LAST_SENT_KEY = 'contact:lastSent';

function readLastSent() {
  try {
    return Number(localStorage.getItem(LAST_SENT_KEY) || 0);
  } catch {
    return 0; // storage blocked (private mode): skip the cooldown rather than break the form
  }
}

function writeLastSent() {
  try {
    localStorage.setItem(LAST_SENT_KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
}

function failureMessage(err: unknown) {
  const status = typeof err === 'object' && err !== null && 'status' in err ? Number((err as { status: unknown }).status) : 0;
  if (status === 429) return 'Too many messages right now. Please try again in a few minutes, or email me directly.';
  if (!status) return 'Could not reach the email service. Check your connection, or email me directly.';
  return 'Could not send your message right now. Please email me directly.';
}

export default function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const opened = useRef(Date.now());

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const name = String(data.name ?? '').trim();
    const email = String(data.email ?? '').trim();
    const message = String(data.message ?? '').trim();

    // Bots: a filled honeypot, or a form submitted impossibly fast. Pretend it worked, send nothing.
    if (data.company || Date.now() - opened.current < MIN_FILL_MS) {
      form.reset();
      setStatus({ kind: 'ok', msg: 'Thanks, your message is on its way. I will reply soon.' });
      return;
    }

    const wait = Math.ceil((COOLDOWN_MS - (Date.now() - readLastSent())) / 1000);
    if (wait > 0) {
      setStatus({ kind: 'err', msg: `Your last message was just sent. Please wait ${wait} seconds before sending another.` });
      return;
    }

    setStatus({ kind: 'sending' });
    // Strip control characters: the name ends up in the email subject.
    const cleanName = name.replace(/[\u0000-\u001f\u007f]+/g, ' ').trim();
    const subject = `Portfolio message from ${cleanName}`;
    try {
      // Loaded on demand so the EmailJS code is not part of the initial page download.
      const { default: emailjs } = await import('@emailjs/browser');
      // Several common names are sent so the template works whichever {{variables}} it uses.
      await emailjs.send(
        emailjsConfig.serviceId,
        emailjsConfig.templateId,
        {
          name: cleanName,
          from_name: cleanName,
          email,
          from_email: email,
          reply_to: email,
          subject,
          title: subject,
          message,
        },
        { publicKey: emailjsConfig.publicKey },
      );
      writeLastSent();
      form.reset();
      setStatus({ kind: 'ok', msg: 'Thanks, your message is on its way. I will reply soon.' });
    } catch (err) {
      // Visible in the browser console to help diagnose EmailJS setup problems (status and reason only).
      const e = err as { status?: number; text?: string };
      console.error('Contact form: EmailJS request failed:', e?.status ?? 'no response', e?.text ?? err);
      // Keep what the visitor wrote: offer the same message as a ready-to-send email.
      setStatus({
        kind: 'err',
        msg: failureMessage(err),
        mailto: `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`,
      });
    }
  }

  return (
    <form id="contact-form" className="form" onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor="name">Your name</label>
        <input id="name" name="name" type="text" autoComplete="name" required minLength={2} maxLength={80} />
      </div>
      <div className="field">
        <label htmlFor="email">Your email</label>
        <input id="email" name="email" type="email" autoComplete="email" required maxLength={120} />
      </div>
      <div className="field">
        <label htmlFor="message">Your message</label>
        <textarea id="message" name="message" placeholder="Tell me about your product or team, and what you need help with." required minLength={10} maxLength={3000} />
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
