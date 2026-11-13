import fs from 'node:fs';
import path from 'node:path';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import ScrollEffects from '@/components/ScrollEffects';
import ContactForm from '@/components/ContactForm';
import { experience, profile, projects, skills, stats } from '@/data/content';

const RESUME_FILE = 'Nilesh_K_Resume.pdf';

function Arrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function Home() {
  // The resume button only appears once you drop the PDF into /public.
  const hasResume = fs.existsSync(path.join(process.cwd(), 'public', RESUME_FILE));
  const resumeHref = hasResume ? `/${RESUME_FILE}` : undefined;
  const calendarUrl = process.env.NEXT_PUBLIC_CALENDAR_URL || undefined;

  return (
    <div className="page">
      <div className="blob" aria-hidden="true" style={{ top: -220, left: -160, width: 760, height: 760, background: 'radial-gradient(circle,var(--glow-1),transparent 68%)' }} />
      <div className="blob" aria-hidden="true" style={{ top: 240, right: -260, width: 820, height: 820, background: 'radial-gradient(circle,var(--glow-2),transparent 68%)' }} />
      <div className="blob" aria-hidden="true" style={{ top: 2100, left: -300, width: 800, height: 800, background: 'radial-gradient(circle,var(--glow-3),transparent 68%)' }} />

      <Nav />
      <main id="main" className="container">
        <Hero resumeHref={resumeHref} calendarUrl={calendarUrl} />

        <section aria-label="Highlights" className="section">
          <div className="stats" data-stagger>
            {stats.map((s) => (
              <div key={s.label} className="stat glass">
                <b>
                  <span data-count={s.value}>{s.value.toLocaleString('en-US')}</span>
                  {s.suffix && <em>{s.suffix}</em>}
                </b>
                <p>{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="work" className="section">
          <p className="eyebrow" data-reveal>Selected work</p>
          <h2 className="h2" data-reveal>Projects built from problem to deployment</h2>
          <div className="tiles" data-stagger>
            {projects.map((p) => (
              <Link key={p.slug} href={`/projects/${p.slug}`} className={`tile glass ${p.tone}${p.wide ? ' wide' : ''}`}>
                <div className="tags">
                  {p.tags.map((t) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
                <div>
                  <h3>{p.title}</h3>
                  {p.bullets ? (
                    <ul className="bullets">
                      {p.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{p.short}</p>
                  )}
                  {p.result && <div className="result">{p.result}</div>}
                  <span className="more">
                    View work <Arrow />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section id="experience" className="section">
          <p className="eyebrow" data-reveal>Experience and education</p>
          <h2 className="h2" data-reveal>Where I have built quality</h2>
          <div className="timeline" data-stagger>
            {experience.map((e, i) => (
              <div key={e.title} className="t-row">
                <div className="t-rail" aria-hidden="true">
                  <span className="t-dot" />
                  {i < experience.length - 1 && <span className="t-line" />}
                </div>
                <div className="t-card glass">
                  <div className="t-head">
                    <h3>{e.title}</h3>
                    <span className="t-when">{e.when}</span>
                  </div>
                  <p className="t-org">{e.org}</p>
                  {e.note && <p className="t-org" style={{ fontSize: 15, marginTop: 4 }}>{e.note}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="skills" className="section">
          <p className="eyebrow" data-reveal>Toolkit</p>
          <h2 className="h2" data-reveal>What I work with</h2>
          <div className="skills" data-stagger>
            {skills.map((s) => (
              <div key={s.group} className={`skill glass${s.featured ? ' featured' : ''}`}>
                <h3>{s.group}</h3>
                <div className="tags">
                  {s.items.map((i) => (
                    <span key={i} className="tag">{i}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="section" style={{ paddingBottom: 96 }}>
          <div className="contact glass" data-reveal>
            <div className="contact-grid">
              <div className="contact-copy">
                <p className="eyebrow">Contact</p>
                <h2>Let&apos;s make your product dependable</h2>
                <p>Have a product that needs testing, or a team that needs an engineer who cares about quality? Send a message and I will get back to you.</p>
                <div className="contact-links">
                  {calendarUrl && (
                    <a className="btn btn-primary" href={calendarUrl} target="_blank" rel="noopener noreferrer">
                      Book a call
                    </a>
                  )}
                  <a className="btn btn-ghost btn-sm" href={`mailto:${profile.email}`}>
                    {profile.email}
                  </a>
                  <a className="btn btn-ghost btn-sm" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                  <a className="btn btn-ghost btn-sm" href={profile.github} target="_blank" rel="noopener noreferrer">
                    GitHub
                  </a>
                </div>
              </div>
              <ContactForm />
            </div>
          </div>
        </section>

        <footer className="footer">
          <span>
            {profile.name} · {profile.title} · {profile.company}
          </span>
          <span>{new Date().getFullYear()}</span>
        </footer>
      </main>
      <ScrollEffects />
    </div>
  );
}
