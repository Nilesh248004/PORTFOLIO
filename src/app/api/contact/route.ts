import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Best-effort per-instance rate limit (resets on cold start). Good enough for a portfolio.
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 4;
const MAX_BODY_BYTES = 20_000;

function limited(ip: string) {
  const now = Date.now();
  // Forget visitors whose window has passed so the map cannot grow without bound.
  if (hits.size > 500) {
    for (const [key, times] of hits) if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
  }
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_HITS;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);

const SEND_FAILED = 'Could not send your message right now. Please email me directly.';

export async function POST(req: Request) {
  if (Number(req.headers.get('content-length') ?? 0) > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'That message is too large.' }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });

  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim();
  const message = String(body.message ?? '').trim();
  const honeypot = String(body.company ?? '');
  const elapsed = Number(body.elapsed ?? 0);

  // Spam checks: honeypot filled, or form submitted impossibly fast. Pretend success.
  if (honeypot || elapsed < 1500) return NextResponse.json({ ok: true });

  if (name.length < 2 || name.length > 80 || message.length < 10 || message.length > 3000 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 120) {
    return NextResponse.json({ error: 'Please check your name, email and message and try again.' }, { status: 400 });
  }

  const ip = (req.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim();
  if (limited(ip)) return NextResponse.json({ error: 'Too many messages. Please try again in a few minutes.' }, { status: 429 });

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!key || !to) {
    return NextResponse.json({ error: 'The contact form is not set up yet. Please email me directly.' }, { status: 503 });
  }

  // The name goes into the subject line, so strip line breaks and control characters.
  const subjectName = name.replace(/[\u0000-\u001f\u007f]+/g, ' ').trim();

  let res: Response;
  try {
    res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(8000),
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>',
        to: [to],
        reply_to: email,
        subject: `Portfolio message from ${subjectName}`,
        text: `From: ${name} <${email}>\n\n${message}`,
        html: `<p><strong>From:</strong> ${esc(name)} &lt;${esc(email)}&gt;</p><p style="white-space:pre-wrap">${esc(message)}</p>`,
      }),
    });
  } catch (err) {
    console.error('Contact form: could not reach Resend:', err instanceof Error ? err.message : err);
    return NextResponse.json({ error: SEND_FAILED }, { status: 502 });
  }

  if (!res.ok) {
    // Logs the provider's status/reason (e.g. invalid key, unverified sender) without the visitor's details.
    console.error('Contact form: Resend rejected the request:', res.status, await res.text().catch(() => ''));
    return NextResponse.json({ error: SEND_FAILED }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
