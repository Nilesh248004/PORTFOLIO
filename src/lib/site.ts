// The site's public origin, used for canonical links, the sitemap, robots.txt and share previews.
// Order of preference: NEXT_PUBLIC_SITE_URL (your custom domain) → the Vercel production domain
// (set automatically on Vercel deployments) → localhost for local development.

function withProtocol(value: string) {
  const v = value.trim().replace(/\/+$/, '');
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return withProtocol(explicit);
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return withProtocol(vercel);
  return 'http://localhost:3000';
}

export const siteUrl = resolveSiteUrl();
