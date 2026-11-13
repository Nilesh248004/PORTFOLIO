import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Nav from '@/components/Nav';
import ScrollEffects from '@/components/ScrollEffects';
import { profile, projects } from '@/data/content';

type Props = { params: Promise<{ slug: string }> };

// Only the slugs in content.ts exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) return {};
  const description = p.short || p.problem;
  return {
    title: p.title,
    description,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: { title: `${p.title} | ${profile.name}`, description, url: `/projects/${p.slug}` },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const i = projects.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const p = projects[i];
  const next = projects[(i + 1) % projects.length];
  const prev = projects[(i - 1 + projects.length) % projects.length];

  return (
    <div className="page">
      <div className="blob" aria-hidden="true" style={{ top: -200, left: -160, width: 700, height: 700, background: 'radial-gradient(circle,var(--glow-1),transparent 68%)' }} />
      <div className="blob" aria-hidden="true" style={{ top: 400, right: -240, width: 700, height: 700, background: 'radial-gradient(circle,var(--glow-2),transparent 68%)' }} />
      <Nav home={false} />
      <main id="main" className="container proj">
        <Link className="back" href="/#work">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
          All projects
        </Link>
        <p className="eyebrow" style={{ marginTop: 24 }} data-reveal>Project</p>
        <h1 data-reveal>{p.title}</h1>
        <div className="tags" style={{ marginTop: 24 }} data-reveal>
          {p.tags.map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
        {p.result && (
          <p className="font-display" style={{ marginTop: 24, fontSize: 24, fontWeight: 600, color: 'var(--accent)' }} data-reveal>
            {p.result}
          </p>
        )}

        <div className="proj-grid" data-stagger>
          <section className="proj-card glass">
            <h2>The problem</h2>
            <p>{p.problem}</p>
          </section>
          <section className="proj-card glass">
            <h2>What I did</h2>
            <ul className="bullets">
              {p.approach.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </section>
          {p.highlights.length > 0 && (
            <section className="proj-card glass">
              <h2>Highlights</h2>
              <ul className="bullets">
                {p.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </section>
          )}
          <section className={`proj-card glass${p.highlights.length === 0 ? ' span-all' : ''}`}>
            <h2>Stack</h2>
            <div className="tags">
              {p.stack.map((s) => (
                <span key={s} className="tag">{s}</span>
              ))}
            </div>
            <div style={{ marginTop: 24 }}>
              <a className="btn btn-ghost btn-sm" href={p.repo || profile.github} target="_blank" rel="noopener noreferrer">
                {p.repo ? 'View source on GitHub' : 'See my GitHub'}
              </a>
            </div>
          </section>
        </div>

        <nav className="proj-nav" aria-label="More projects">
          <Link className="btn btn-ghost btn-sm" href={`/projects/${prev.slug}`}>
            ← {prev.title}
          </Link>
          <Link className="btn btn-ghost btn-sm" href={`/projects/${next.slug}`}>
            {next.title} →
          </Link>
        </nav>
      </main>
      <ScrollEffects />
    </div>
  );
}
