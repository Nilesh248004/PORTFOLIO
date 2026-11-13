import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Nav from '@/components/Nav';
import ScrollEffects from '@/components/ScrollEffects';
import BookingPicker from '@/components/BookingPicker';
import { profile } from '@/data/content';
import { bookingEnabled, calUsername } from '@/lib/booking';
import { hues } from '@/lib/palette';

const description = `Book a call with ${profile.name}: a hiring chat, help with QA and testing, career advice or a general intro.`;

export const metadata: Metadata = {
  title: 'Book a call',
  description,
  alternates: { canonical: '/book' },
  openGraph: { title: `Book a call | ${profile.name}`, description, url: '/book' },
};

export default function BookPage() {
  // Not switched on yet: visitors get a normal 404. While developing, show how to switch it on instead.
  const showSetupHint = !bookingEnabled && process.env.NODE_ENV !== 'production';
  if (!bookingEnabled && !showSetupHint) notFound();

  return (
    <div className="page hue" style={{ '--h': hues.green } as CSSProperties}>
      <div className="blob" aria-hidden="true" style={{ top: -200, left: -160, width: 700, height: 700, background: 'radial-gradient(circle,var(--accent-glow),transparent 68%)' }} />
      <div className="blob" aria-hidden="true" style={{ top: 400, right: -240, width: 700, height: 700, background: 'radial-gradient(circle,var(--glow-a),transparent 68%)' }} />
      <Nav home={false} />
      <main id="main" className="container proj book">
        <Link className="back" href="/">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
          Back to home
        </Link>
        <p className="eyebrow" style={{ marginTop: 24 }} data-reveal>Book a call</p>
        <h1 data-reveal>Pick a time to talk</h1>
        <p className="book-intro" data-reveal>
          Choose what the call is about, then pick a time. Times are shown in your own time zone, and the invite with the meeting link
          arrives by email.
        </p>

        {showSetupHint ? (
          <section className="proj-card glass" style={{ marginTop: 40 }}>
            <h2>Booking is not switched on yet</h2>
            <p>
              Set <code>NEXT_PUBLIC_CAL_USERNAME</code> to your Cal.com username in <code>.env.local</code>, then restart{' '}
              <code>npm run dev</code>. Until it is set, this page returns &ldquo;not found&rdquo; on the live site and the Book a call
              buttons lead to the contact form. This note only shows while developing.
            </p>
          </section>
        ) : (
          <BookingPicker username={calUsername} />
        )}
      </main>
      <ScrollEffects />
    </div>
  );
}
