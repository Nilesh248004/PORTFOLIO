/** @type {import('next').NextConfig} */

// Same baseline headers the previous static site shipped with, plus clickjacking protection.
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
];

// How long browsers and Vercel's CDN may keep files that Next.js would otherwise send as "always re-check".
// Pages and /_next/static assets already have the right caching from Next.js, so they are not listed here.
// stale-while-revalidate lets the CDN serve the cached copy instantly while it fetches a fresh one in the background.
const cache = (seconds, staleSeconds) => [
  { key: 'Cache-Control', value: `public, max-age=${seconds}, stale-while-revalidate=${staleSeconds}` },
];
const DAY = 86400;

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // `next dev` would otherwise generate an AGENTS.md file in the project root every time it runs.
  agentRules: false,
  images: { formats: ['image/avif', 'image/webp'] },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      // portrait and resume: cached for a day; a new file shows up within a day of deploying
      { source: '/photo.png', headers: cache(DAY, 7 * DAY) },
      { source: '/Nilesh_K_Resume.pdf', headers: cache(DAY, 7 * DAY) },
      // favicon and link-share image
      { source: '/icon', headers: cache(DAY, 7 * DAY) },
      { source: '/opengraph-image', headers: cache(DAY, 7 * DAY) },
      // search engine files: an hour, so new pages are picked up quickly
      { source: '/sitemap.xml', headers: cache(3600, DAY) },
      { source: '/robots.txt', headers: cache(3600, DAY) },
    ];
  },
};

export default nextConfig;
