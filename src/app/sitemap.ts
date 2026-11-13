import type { MetadataRoute } from 'next';
import { projects } from '@/data/content';
import { bookingEnabled } from '@/lib/booking';
import { siteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteUrl}/`, changeFrequency: 'monthly', priority: 1 },
    ...(bookingEnabled ? [{ url: `${siteUrl}/book`, changeFrequency: 'yearly' as const, priority: 0.6 }] : []),
    ...projects.map((p) => ({ url: `${siteUrl}/projects/${p.slug}`, changeFrequency: 'monthly' as const, priority: 0.7 })),
  ];
}
