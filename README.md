# Nilesh K · Portfolio

Next.js 16 (App Router) · React 19 · TypeScript · GSAP · Three.js. Deploys to Vercel with no configuration.

The previous plain HTML/CSS/JS version of this site is preserved in git history (commit `4d6663f`).

## Run it locally

Requires Node 20.9 or newer.

```bash
npm install
cp .env.example .env.local   # then fill in the values you need
npm run dev                  # http://localhost:3000
```

Other scripts: `npm run build`, `npm start` (serve the production build), `npm run typecheck`.

## Edit your content

Everything lives in **`src/data/content.ts`**: name, roles, pitch, stats, projects (and their detail pages), experience and skills.
Search the file for `TODO` to find what still needs confirming:

- `since` is your start date at Hippo Video (currently Aug 2026).
- The Hippo Video project has an empty `highlights: []`. Add real, measurable results (APIs automated, time saved, hotels onboarded) and a "Highlights" card appears on its page automatically.
- Add `repo: 'https://github.com/...'` to a project to link its source. Without it the button links to your GitHub profile.
- Check the CGPA in `experience`. The older PDF resume said 7.48, this site says 7.74.

## Add your resume (download button)

Drop your PDF into `public/` named **`Nilesh_K_Resume.pdf`**. The "Download resume" button appears automatically once the file exists.
Use a version that includes your Hippo Video role, and decide whether you want your phone number public.
(`Nilesh_Resume_updated.pdf` in the repo root is the old resume; it is not served by the site.)

## Contact form

The form posts to `/api/contact`, which sends email through [Resend](https://resend.com) (free tier is enough).

1. Create a Resend API key.
2. Set `RESEND_API_KEY`, `CONTACT_TO_EMAIL` (where messages arrive) and `CONTACT_FROM_EMAIL` in your host's environment variables.
   Until you verify your own domain in Resend, keep `onboarding@resend.dev` as the sender.

Spam protection is built in: a hidden honeypot field, a minimum fill time, input validation, a request size cap and a per-IP rate limit.
Without the environment variables the form tells visitors it is not set up and offers their message as a ready-to-send email instead.
If Resend rejects a request, the reason is written to your host's server logs.

## Calendar button

Set `NEXT_PUBLIC_CALENDAR_URL` (Calendly, Cal.com, Google appointment page). The "Book a call" buttons then open it. Without it, the hero button scrolls to the contact form.

## Deploy to Vercel

1. Import this repository at https://vercel.com/new. `vercel.json` already sets the framework to Next.js, so this also works if the project was previously a static site.
2. Add the environment variables from `.env.example`.
3. Deploy. Every push redeploys automatically.

This app has a server route, so it needs a Node host such as Vercel or Netlify. It cannot be served from GitHub Pages.

## Custom domain

1. Buy a domain, for example `nileshk.dev`.
2. Vercel project → **Settings → Domains → Add**, then add the DNS records Vercel shows.
3. Set `NEXT_PUBLIC_SITE_URL` to the new domain (for example `https://nileshk.dev`) and redeploy.

Canonical links, the sitemap, robots.txt and share previews use `NEXT_PUBLIC_SITE_URL` when set, otherwise the Vercel production domain, otherwise `localhost`.

## SEO and social preview

Titles, descriptions, Open Graph/Twitter cards, a generated share image (`/opengraph-image`), sitemap, robots.txt and Person structured data are included.
After deploying, test your link at https://www.linkedin.com/post-inspector/ and submit `https://your-domain/sitemap.xml` in Google Search Console.

## Analytics

`@vercel/analytics` is wired in. Open your Vercel project → **Analytics** → Enable. It is privacy-friendly (no cookies) and does nothing off Vercel.

## What's in the box

- Loading intro (once per session, skipped for repeat visitors and reduced-motion users)
- Three.js glass slabs in the hero that react to cursor and scroll (CSS fallback on phones and without WebGL)
- GSAP scroll reveals, staggered cards and animated counters
- Dark/light toggle (remembered), sticky nav with active-section highlight, scroll progress bar
- Typing role effect, project detail pages, styled 404 page, working contact form
- Self-hosted fonts via `next/font` (no request to Google at page load)
- Security headers (`nosniff`, referrer policy, permissions policy, frame protection)
- Accessibility: skip link, visible focus, semantic landmarks, reduced-motion support, Escape closes the mobile menu. axe-core reports no violations on the home and project pages in both themes.

## Project layout

```
src/app          pages, API route, SEO files, 404
src/components   Nav, Hero, HeroScene (Three.js), ScrollEffects (GSAP), ContactForm, Cursor, Loader
src/data         content.ts  <- edit this
src/lib          site.ts (public site URL)
public           photo.png (+ add Nilesh_K_Resume.pdf)
```
