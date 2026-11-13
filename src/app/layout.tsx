import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import Loader from '@/components/Loader';
import Cursor from '@/components/Cursor';
import { profile } from '@/data/content';
import { siteUrl } from '@/lib/site';
import './globals.css';

// Fonts are downloaded at build time and served from the same origin (no render-blocking request to Google).
const body = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

const description = `${profile.name} is a ${profile.title} at ${profile.company}. Building reliable software: API automation with Karate, full-stack apps, AI tools and DevOps automation.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${profile.name} | ${profile.title} at ${profile.company}`, template: `%s | ${profile.name}` },
  description,
  applicationName: `${profile.name} Portfolio`,
  authors: [{ name: profile.name }],
  keywords: ['Nilesh K', 'QA engineer', 'software engineer', 'API automation', 'Karate', 'Hippo Video', 'Next.js portfolio'],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: `${profile.name} Portfolio`,
    title: `${profile.name} | ${profile.title} at ${profile.company}`,
    description,
  },
  twitter: { card: 'summary_large_image', title: `${profile.name} | ${profile.title}`, description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#060b1a',
  width: 'device-width',
  initialScale: 1,
};

const bootScript = `(function(){try{var d=document.documentElement;var t=localStorage.getItem('theme')||'dark';d.dataset.theme=t;var r=matchMedia('(prefers-reduced-motion: reduce)').matches;d.classList.add(r?'rm':'anim');if(sessionStorage.getItem('intro')||r){d.dataset.skipLoader='1'}if(matchMedia('(hover: hover) and (pointer: fine)').matches&&!r){d.classList.add('fine')}}catch(e){}})();`;

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  jobTitle: profile.title,
  worksFor: { '@type': 'Organization', name: profile.company },
  url: siteUrl,
  image: `${siteUrl}/photo.png`,
  email: `mailto:${profile.email}`,
  sameAs: [profile.linkedin, profile.github],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={`${body.variable} ${display.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <Loader />
        <Cursor />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
