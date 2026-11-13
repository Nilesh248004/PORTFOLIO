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
- Each skill group has a `hue` (0-360) that sets its card's colour. Pick hues at least ~30 apart so the cards stay distinct.
- Each project can have a row of big-number cards under its title: add `stats: [{ value: 6, suffix: '-node', label: '...' }]` to the project. Numbers count up when scrolled into view, words such as `'SSE'` scramble and then settle, and `stream: true` makes the label appear word by word. Visitors who prefer reduced motion see the final text with no animation. The Hippo Video cards only restate your bullets: replace them with real figures (see the TODO).
- Add `repo: 'https://github.com/...'` to a project to link its source. Without it the button links to your GitHub profile.
- Check the CGPA in `experience`. The older PDF resume said 7.48, this site says 7.74.

## Colours

The site uses one palette of eight colours, defined in `src/lib/palette.ts`: blue, violet, pink, red, orange, amber, green and teal.

- Every section, project, timeline entry, skill group and call type takes one of them. Change it with the `hue` fields in `src/data/content.ts`; the section colours are set in `src/app/page.tsx`.
- Everything accent-coloured inside follows that colour: borders, card tints, chips, links, bullets and the nav highlight (which matches the section you are reading).
- The brand gradient (blue, violet, pink) is used for the logo, the main buttons and the role line under your name. The progress bar and footer line run through the whole palette, and the BUILD / TEST / SHIP slabs are blue, green and pink.
- Colours are OKLCH, which keeps lightness even across hues, so text stays readable on every colour in both themes. All text was checked against WCAG AA contrast.

## Add your resume (download button)

Drop your PDF into `public/` named **`Nilesh_K_Resume.pdf`**. The "Download resume" button appears automatically once the file exists.
Use a version that includes your Hippo Video role, and decide whether you want your phone number public.
(`Nilesh_Resume_updated.pdf` in the repo root is the old resume; it is not served by the site.)

## Contact form

The form sends email with [EmailJS](https://www.emailjs.com) straight from the visitor's browser, so it needs no server and no environment variables.
It uses the EmailJS service, template and public key from your previous site (see `src/lib/emailjs.ts`). These three values are public by design, not secrets.
To use a different EmailJS account, set `NEXT_PUBLIC_EMAILJS_SERVICE_ID`, `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` and `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` (locally in `.env.local`, and in your host's settings).

**Template.** Paste `docs/emailjs-template.html` into your EmailJS template (Content, in the code editor). It shows who wrote, their email as a link, when it arrived, the message with its line breaks, and a Reply button. Then set these in the template's Settings tab:

| Setting | Value |
|---|---|
| Subject | `{{subject}}` |
| To Email | your own address |
| From Name | `{{from_name}}` |
| Reply To | `{{reply_to}}` |

**Variables sent with every message** (use any of them in the template): `{{name}}`, `{{from_name}}`, `{{email}}`, `{{from_email}}`, `{{reply_to}}`, `{{subject}}`, `{{title}}`, `{{message}}`, `{{time}}` (UTC). Always use double braces: EmailJS escapes HTML in `{{ }}` but not in `{{{ }}}`, and the message comes from a stranger.

**Spam and abuse.** The form has a hidden honeypot field, a minimum fill time and a 30-second gap between sends. Because EmailJS keys are public, a determined bot could still call EmailJS directly, so also turn on the protections in your EmailJS dashboard (Account → Security: for example reCAPTCHA and restricting which sites can use your key).

**If sending fails**, visitors see a clear message and a button to send the same text from their own email app. The failure reason (status and text from EmailJS) is also printed in the browser console, which is the quickest way to debug a template or key problem.

## Call booking (Cal.com)

Visitors book calls on the **`/book`** page, which shows a [Cal.com](https://cal.com) calendar inside the site. Cal.com handles availability, time zones, Google Calendar sync, meeting links, email invites and reminders. The page is off until you set `NEXT_PUBLIC_CAL_USERNAME`.

**Set it up (about 15 minutes):**

1. Create a Cal.com account (it has a free plan; check its current limits) and note your username.
2. Settings → Calendars: connect Google Calendar, so busy times are blocked and bookings are added to it.
3. Availability: set your time zone, working days and hours.
4. Create four event types whose URL slugs are exactly these (or edit `callTypes` in `src/data/content.ts` to match your own):

   | Slug | Call type |
   |---|---|
   | `hiring-chat` | Hiring or recruiter chat |
   | `qa-help` | QA or testing help |
   | `career-advice` | Career advice or mentoring |
   | `intro-chat` | General intro chat |

   For each one set the length and the location (for example Google Meet). Under Limits, set the minimum notice, a buffer between calls and how far ahead people can book.
5. Set `NEXT_PUBLIC_CAL_USERNAME` to your username, in `.env.local` for local work and in your host's environment variables for the live site, then redeploy.
6. Open `/book` and book a test call using a different email address.

**How it behaves**

- The nav's **Contact** dropdown offers "Reach out by mail" (the contact form) and "Reach out by call" (`/book`). The hero's Book a call button and the call card under the contact form also go to `/book`; the card's shortcuts open a specific call type. Link straight to one call type with `/book?type=qa-help`.
- The calendar follows the site's dark/light toggle, works on phones, and the call types are keyboard accessible.
- If the calendar has not loaded after 12 seconds, visitors see your email address instead.
- To hide a call type, remove it from `callTypes`. Slugs that do not exist in Cal.com show a "not found" page inside the calendar, so keep the two lists in step.
- While `NEXT_PUBLIC_CAL_USERNAME` is empty: `/book` returns 404 on the live site (a setup note shows in `npm run dev`), the Contact menu is a plain link, the call card is hidden, and the hero button reads "Contact me" and goes to the contact form.
- Privacy: the calendar loads from Cal.com's servers, and the page says so.

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
- Three.js glass slabs (BUILD / TEST / SHIP) in the hero that follow the mouse, spread on scroll and bob gently. They are the only animated card-like element: the portrait and project cards stay still on hover (CSS fallback on phones and without WebGL)
- GSAP scroll reveals, staggered cards and animated counters
- Dark/light toggle (remembered), sticky nav with active-section highlight, scroll progress bar
- Typing role effect, project detail pages, styled 404 page, working contact form, call booking page
- "Spectrum" colour system: each section, project and card has its own colour from one palette (see Colours above)
- Self-hosted fonts via `next/font` (no request to Google at page load)
- Security headers (`nosniff`, referrer policy, permissions policy, frame protection)
- Accessibility: skip link, visible focus, semantic landmarks, reduced-motion support, Escape closes the mobile menu. axe-core reports no violations on the home and project pages in both themes.

## Project layout

```
src/app          pages, SEO files, 404
src/components   Nav, Hero, HeroScene (Three.js), ScrollEffects (GSAP), Stats, ContactForm, BookingPicker, Loader
src/data         content.ts  <- edit this
src/lib          site.ts (public site URL), emailjs.ts (contact form config), booking.ts (booking on/off), palette.ts (colours)
public           photo.png (+ add Nilesh_K_Resume.pdf)
```
