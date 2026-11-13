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

Everything lives in **`src/data/content.ts`**: name, roles, pitch, projects (and their detail pages), experience and skills.
Search the file for `TODO` to find what still needs confirming:

- `since` is your start date at Hippo Video (currently Aug 2026).
- The Hippo Video project has an empty `highlights: []`. Add real, measurable results (APIs automated, time saved, hotels onboarded) and a "Highlights" card appears on its page automatically.
- Each project can have a row of big-number cards under its title: add `stats: [{ value: 6, suffix: '-node', label: '...' }]` to the project. Numbers count up when scrolled into view, words such as `'SSE'` scramble and then settle, and `stream: true` makes the label appear word by word. Visitors who prefer reduced motion see the final text with no animation. The Hippo Video cards only restate your bullets: replace them with real figures (see the TODO).
- Add `repo: 'https://github.com/...'` to a project to link its source. Without it the button links to your GitHub profile.
- Check the CGPA in `experience`. The older PDF resume said 7.48, this site says 7.74.

## Add your resume (download button)

Drop your PDF into `public/` named **`Nilesh_K_Resume.pdf`**. The "Download resume" button appears automatically once the file exists.
Use a version that includes your Hippo Video role, and decide whether you want your phone number public.
(`Nilesh_Resume_updated.pdf` in the repo root is the old resume; it is not served by the site.)

## Contact form

The form sends email with [EmailJS](https://www.emailjs.com) straight from the visitor's browser, so it needs no server and no environment variables.
It uses the EmailJS service, template and public key from your previous site (see `src/lib/emailjs.ts`). These three values are public by design, not secrets.
To use a different EmailJS account, set `NEXT_PUBLIC_EMAILJS_SERVICE_ID`, `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` and `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` (locally in `.env.local`, and in your host's settings).

**Template variables.** Each message sends these values, so use any of them in your EmailJS template (Subject, Content, Reply-To):
`{{name}}`, `{{from_name}}`, `{{email}}`, `{{from_email}}`, `{{reply_to}}`, `{{subject}}`, `{{title}}`, `{{message}}`.
The recipient address is set in the EmailJS dashboard, in the template's "To Email" field.

**Spam and abuse.** The form has a hidden honeypot field, a minimum fill time and a 30-second gap between sends. Because EmailJS keys are public, a determined bot could still call EmailJS directly, so also turn on the protections in your EmailJS dashboard (Account → Security: for example reCAPTCHA and restricting which sites can use your key).

**If sending fails**, visitors see a clear message and a button to send the same text from their own email app. The failure reason (status and text from EmailJS) is also printed in the browser console, which is the quickest way to debug a template or key problem.

## Calendar button

Set `NEXT_PUBLIC_CALENDAR_URL` (Calendly, Cal.com, Google appointment page). The "Book a call" buttons then open it. Without it, the hero button scrolls to the contact form.

## Deploy to Vercel

1. Import this repository at https://vercel.com/new. `vercel.json` already sets the framework to Next.js, so this also works if the project was previously a static site.
2. Deploy. No environment variables are required. Add the optional ones from `.env.example` if you want them.
3. Every push redeploys automatically.

This is a Next.js app, so deploy it on Vercel or Netlify. It cannot be served as-is from GitHub Pages.

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
- Three.js glass slabs in the hero that move with the page scroll only; they never follow the mouse, and the portrait and project cards do not tilt on hover (CSS fallback on phones and without WebGL)
- GSAP scroll reveals, staggered cards and animated counters
- Dark/light toggle (remembered), sticky nav with active-section highlight, scroll progress bar
- Typing role effect, project detail pages, styled 404 page, working contact form
- Self-hosted fonts via `next/font` (no request to Google at page load)
- Security headers (`nosniff`, referrer policy, permissions policy, frame protection)
- Accessibility: skip link, visible focus, semantic landmarks, reduced-motion support, Escape closes the mobile menu. axe-core reports no violations on the home and project pages in both themes.

## Project layout

```
src/app          pages, SEO files, 404
src/components   Nav, Hero, HeroScene (Three.js), ScrollEffects (GSAP), Stats, ContactForm, Loader
src/data         content.ts  <- edit this
src/lib          site.ts (public site URL), emailjs.ts (contact form config)
public           photo.png (+ add Nilesh_K_Resume.pdf)
```
