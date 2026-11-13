/** @type {import('next').NextConfig} */

// Same baseline headers the previous static site shipped with, plus clickjacking protection.
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // `next dev` would otherwise generate an AGENTS.md file in the project root every time it runs.
  agentRules: false,
  images: { formats: ['image/avif', 'image/webp'] },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
