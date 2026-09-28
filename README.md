# Starry Coop 星月小馆: website

The marketing website for Starry Coop, a Chinese & Taiwanese kitchen upstairs at 1373 Marine Drive, West Vancouver.
It's a fast, static site built with [Astro 7](https://astro.build) and designed to be hosted on **AWS Amplify Hosting**.

- **Pages:** 12 content pages plus a 404:
  - Home, Menu, Skewers in Pot, Handmade Noodles & Dumplings, Hot Pots & Groups
  - About, Reviews, Reserve, Visit/Contact, FAQ, Accessibility, Privacy
- **Speed:**
  - No framework JavaScript. About 6 KB of small scripts, each loaded only on the page that needs it.
  - Photos are served as AVIF/WebP at responsive sizes.
  - Fonts are self-hosted, including a 22 KB Chinese display subset.
- **Security:**
  - A strict, hash-based Content Security Policy on every page, plus HSTS and other hardening headers (`customHttp.yml`).
  - No cookies, no trackers, and no third-party requests unless a visitor chooses to load the interactive map.
- **Local SEO:**
  - Restaurant, Menu, FAQ and Breadcrumb structured data (JSON-LD).
  - A unique title and description for every page, with bilingual headings.
  - Sitemap, canonical URLs and Open Graph images.
- **Accessibility:** built to WCAG 2.2 AA, with keyboard support, visible focus, reduced-motion support and alt text on every photo.

---

## Deploy to AWS Amplify

1. **Put the code in Git.** This `site/` folder is the repository root. For example:
   ```bash
   cd site
   git init
   git add .
   git commit -m "feat: Starry Coop website"
   ```
   Then push it to a new GitHub, GitLab, Bitbucket or CodeCommit repository.
   *If you keep `site/` inside a larger repo instead, choose "monorepo" in Amplify and set the app root to `site`.*
2. **Create the app.** In the [Amplify console](https://console.aws.amazon.com/amplify/), choose **Create new app → Host web app**, connect the repository, and pick the branch.
   Amplify reads `amplify.yml` automatically. It installs with Node 22 and runs the tests, the build and `verify-dist`.
3. **Add the rewrite for the 404 page.** Go to **Hosting → Rewrites and redirects → Manage → Open text editor** and paste:
   ```json
   [
     { "source": "/<*>", "target": "/404.html", "status": "404" }
   ]
   ```
4. **Set environment variables** under **Hosting → Environment variables**:

   | Variable | When | Value |
   |---|---|---|
   | `SITE_URL` | Production branch only, and only after the owner confirms the launch checklist below | The live domain, e.g. `https://www.starrycoop.ca`. **Until it's set, every page is `noindex` and robots.txt blocks crawlers**, so preview URLs never get indexed. |
   | `PUBLIC_BOOKING_ENDPOINT` | Optional | HTTPS URL for online table requests (see *Online booking* below). When it's unset, the site is **phone-first**: the Reserve page and the homepage lead with "Call (604) 281-1888". |

   Redeploy after changing variables.
5. **Connect the domain** under **Hosting → Custom domains**. Amplify issues the SSL certificate. Add a `www` ↔ apex redirect there too.
6. **Update Google.** Set the Google Business Profile "Website" field to the new domain, and submit `https://<domain>/sitemap-index.xml` in Google Search Console.

Security and cache headers live in `customHttp.yml`, and Amplify applies them on every deploy.

**No-Git alternative:** run `npm ci && npm run build` locally, zip the contents of `dist/`, and use **Deploy without Git** in Amplify. You still need to do steps 3–6.

---

## Online booking (optional)

There are two ways to switch on the request form. Either way, set `PUBLIC_BOOKING_ENDPOINT` and redeploy. The CSP automatically allows that origin.

**A. AWS (recommended; data stays in Canada).** `infra/booking-function/` holds a Lambda + Amazon SES endpoint, deployed with AWS SAM in `ca-central-1`. It includes:
- shared validation with the website, so the browser and server rules can never differ;
- an origin allow-list with CORS;
- a honeypot field and a minimum fill time;
- a per-IP limit of 5 requests per hour;
- a concurrency cap and email alarms.

Deploy it with:
```bash
cd infra/booking-function
npm install
npm run deploy     # guided: region ca-central-1, AllowedOrigins, ToEmail, FromEmail
```
Before deploying, verify the `FromEmail` address (or its domain) in Amazon SES. SES accounts start in the sandbox; request production access so emails reach any inbox. Then copy the `BookingEndpoint` output into `PUBLIC_BOOKING_ENDPOINT`.

**B. A form service.** Any HTTPS endpoint that accepts a JSON POST and returns 2xx works, for example Formspree. Paste its endpoint URL into the variable.

If the endpoint can't be reached, guests see a panel that keeps their details and offers **Call** (plus **Send as a text** once `SITE.phone.acceptsSms` is set to `true`), so no request is lost silently.

---

## Editing content

Everything the owner is likely to change lives in plain data files under `src/data/`:

| File | What it controls |
|---|---|
| `site.ts` | Name, address, phone, **hours**, rating snapshot, links, booking flag, Google attributes |
| `menu.ts` | **Every dish and price.** `verified: false` marks prices derived from the Uber Eats listing. Set `MENU_SHOW_UNVERIFIED_PRICES = false` to show "Ask in store" for those instead. `newUntil` makes "New" badges expire. |
| `reviews.ts` + `review-sources.ts` | Quoted Google reviews. A test ensures every quote is word-for-word from the source text. |
| `faq.ts` | FAQ answers (also published as FAQ structured data) |
| `pages.ts` | SEO title, description and H1 for every page, with a test enforcing lengths and uniqueness |
| `photos.ts` | The photo register: alt text, source and restrictions |

After changing Chinese headings or labels, run `npm run build && npm run fonts:cjk && npm run build` so the display font includes any new characters. The build fails if you forget.

## Commands

| Command | Does |
|---|---|
| `npm run dev` | Local dev server on http://localhost:4321 |
| `npm run test` | Unit tests: hours, booking validation, SEO registry, review provenance |
| `npm run check` | Type check |
| `npm run build` | Production build + `verify-dist` quality gate |
| `npm run preview` | Serve the built site locally |
| `npm run fonts:cjk` | Rebuild the Chinese display-font subset |

`scripts/verify-dist.mjs` fails the build if any page:
- is missing exactly one H1, a title, a description, a canonical URL or the CSP;
- has inline styles;
- has an image without alt text;
- loads a third-party script;
- contains a broken internal link;
- publishes staff names;
- shows Chinese display text the font subset doesn't cover.

It also fails if any photo is used on more than two pages.

---

## Owner launch checklist (please confirm before setting `SITE_URL`)

1. **Photo rights.** The photos come from the Google Business Profile, and several were uploaded by customers. Confirm the restaurant owns them or has permission, or swap them in `src/assets/photos/` (same file names).
2. **Prices.** Check the menu, especially items marked `verified: false` in `menu.ts`.
3. **Hours**, and whether any holiday closures should be noted.
4. **Booking.** Choose phone-only or online requests, and give the inbox for requests.
5. **SMS.** Can (604) 281-1888 receive texts? If yes, set `acceptsSms: true` in `site.ts`.
6. **Happy hour.** Days, times and specials, so they can be published.
7. **Dietary claims.** Which dishes are vegan or vegetarian.
8. **Chinese copy.** Review the dish names and headings.
9. **Domain** name.
10. **Logo.** A vector file of the moon-and-star logo, if available (the site currently uses a redrawn mark).

Research, design competition results, audit gates and the final plan are in the `research/` folder of the working project; they aren't needed for deployment.
