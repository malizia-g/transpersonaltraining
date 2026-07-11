# Marketing & SEO Plan — Transpersonal Training

> Complete, prioritized roadmap for marketing the school and optimizing the website for search.
> Companion documents: [PABLO_TASKS.md](PABLO_TASKS.md) (launch blockers), [FUTURE_IDEAS.md](FUTURE_IDEAS.md) (technical backlog).
>
> Preliminary SEO research (keyword volumes, clusters, competitors) lives in the shared
> [Google Drive SEO folder](https://drive.google.com/drive/u/1/folders/1V3B3Ou0l_iZ-n1tkCS_HriQqGO9hIDTU):
> - [Selecting Keywords](https://docs.google.com/spreadsheets/d/1HE6d2vZnmz9gqIRw3Yug2iBD-61k3RsiXonjhSz29M0) — ~65 keywords with volume, difficulty, CPC, awareness stage
> - [Cluster Keywords Map](https://docs.google.com/spreadsheets/d/1vyGrnHLGvWC4gvbL3UU0zgpHoGUVsnvc2H2yaulVxyg) — page-by-page keyword assignments with priorities
> - [SEO Competitor Analysis](https://docs.google.com/spreadsheets/d/1IpYDSNKzPb4tb-dUchyT3nwHU5pTpa2t3epJhKajO7s) — 14 competitor schools listed, metrics to fill in
> - [SEO Longtail Keywords](https://docs.google.com/document/d/10fWmPbUOrqP2YLXMonK9G3jaxAPJA8mnzzj9SohCjKE) — long-tail phrases by audience persona

*Created: July 2026*

---

## Table of Contents

1. [Where We Stand (Audit Summary)](#1-where-we-stand-audit-summary)
2. [Goals & Audiences](#2-goals--audiences)
3. [Master Step List — Prepare Everything, Then Flip the Switch](#3-master-step-list--prepare-everything-then-flip-the-switch)
4. [Step details — Phase A: Conversion Foundation](#phase-a--conversion-foundation-do-first)
5. [Step details — Phase B: WordPress → New Site Migration](#phase-b--wordpress--new-site-seo-migration)
6. [Step details — Phase C: Measurement Setup](#phase-c--measurement-setup)
7. [Step details — Phase D: On-Page SEO](#phase-d--on-page-seo-keyword-implementation)
8. [Step details — Phase E: Technical SEO & Performance](#phase-e--technical-seo--performance)
9. [Step details — Phase F: Trust & E-E-A-T](#phase-f--trust--e-e-a-t)
10. [Step details — Phase G: Content Engine (Blog)](#phase-g--content-engine-blog)
11. [Step details — Phase H: Off-Page SEO & Authority](#phase-h--off-page-seo--authority)
12. [Step details — Phase I: Email Marketing](#phase-i--email-marketing)
13. [Step details — Phase J: Social Media](#phase-j--social-media)
14. [Step details — Phase K: Events as Marketing](#phase-k--events-as-marketing)
15. [Step details — Phase L: Paid Acquisition (Optional)](#phase-l--paid-acquisition-optional)
16. [KPIs & Review Cadence](#kpis--review-cadence)
17. [Open Decisions for Fabio](#open-decisions-for-fabio)

---

## 1. Where We Stand (Audit Summary)

### Already in place (good foundation)

| Area | Status |
|------|--------|
| Meta tags | `eleventy-plugin-seo` renders title, description, canonical, Open Graph, Twitter Cards on every page; per-page overrides via front matter |
| Sitemap & robots | `sitemap.xml` and `robots.txt` generated at build time |
| Structured data | JSON-LD `EducationalOrganization` + `Course` on the homepage |
| OG image | `og-default.jpg` exists in `src/assets/images/Graphics/` |
| Performance | Static Eleventy site, 23 KB CSS, WebP images with `<picture>` fallbacks, clean URLs |
| Blog | Working blog with front-matter validation (description + image required), 3 posts |
| Keyword research | Done (Drive sheets above) — volumes, difficulty, intent, awareness stages, page clusters |
| Privacy | GDPR privacy modal; site currently uses no cookies/tracking |

### Critical gaps found in the audit

1. **The production domain still serves the old WordPress site.** `transpersonal-training.com` currently runs WordPress (Enfold theme, MEC events, a full student portal with login/dashboard/payment pages, yearly archive pages, Russian-language event pages). The new Eleventy site is not live. Launching without a redirect plan will throw away every existing backlink and ranking, and will break the student portal. → Phase B.
2. **The conversion path is broken.** The only contact/application mechanism is a `<form action="mailto:...">` ([index.html:304](../src/index.html#L304)). `mailto:` forms silently fail for most users (no configured mail client, popup blocked, no feedback). All marketing spend/effort funnels into a form that loses leads. → Phase A.
3. **Zero measurement.** No analytics, no Search Console. We cannot see what works. → Phase C.
4. **Keyword map not implemented.** Every row in the Cluster Keywords Map is "To Do": page titles/H1s/copy don't yet target the researched keywords, and three mapped pages don't exist yet (Courses/Hero Journey, Transpersonal Therapist, FAQ). → Phase D.
5. **Duplicate-content risk on the blog.** 2 of 3 posts are republished from the authors' own sites (manalpsychotherapy.com, mariolorenzetti.org) with no `rel=canonical` pointing anywhere. Google may ignore or penalize them. → Phase G.
6. **Structured data stops at the homepage.** No `Event` schema on the schedule (free rich-result opportunity for seminars), no `Person` for teachers, no `BlogPosting`, no `FAQPage`, no `BreadcrumbList`. → Phase D/E.
7. **No social presence linked anywhere.** `sameAs: []` is empty in the JSON-LD; footer has no social icons; no profiles to point to. → Phase J.
8. **No email capture.** No newsletter, no lead magnet — visitors who aren't ready to apply today are lost forever. → Phase I.
9. **GDPR inconsistency.** The privacy policy states "no data is gathered by browsing this site", but Google Fonts and Lucide icons load from Google/unpkg CDNs (IP addresses transmitted; German courts have ruled this violates GDPR — and one venue is in Germany). Self-host both. → Phase E.
10. **Small technical items:** no 404 page; navigation mixes `/page/` and `/page/index.html` URL forms; footer `Agreement` link points at a WordPress URL that will die at migration; JSON-LD `Course` lacks `offers` (price) and location data.

---

## 2. Goals & Audiences

### Business goals (proposed — confirm)

| Priority | Goal | Primary metric |
|----------|------|----------------|
| 1 | Fill the 2027–2030 cohort | Qualified applications submitted |
| 2 | Fill intensives/seminars open to externals | Event registrations |
| 3 | Recruit client models for trainees | Client-model applications |
| 4 | Build a long-term audience | Email list growth |

### Audience personas (from the Longtail Keywords doc)

1. **Aspiring transpersonal psychotherapists** — professionals seeking rigorous, EUROTAS-accredited training. Highest value; lowest volume. BOFU pages: Training Overview, Curriculum, Fees, Apply.
2. **Aspiring counsellors** — career-changers wanting holistic counselling certification. BOFU/MOFU.
3. **Breathwork facilitator candidates** — searching "breathwork training", "holotropic breathwork facilitator". MOFU: Techniques page, dedicated breathwork page.
4. **Therapy seekers dissatisfied with classical psychotherapy** — potential client models and future students. TOFU blog + Become a Client Model.
5. **Personal-growth seekers** — seminars, self-development year (Level 1). TOFU blog + Schedule.

**Language/geography:** courses are in English, delivered online + intensives in Germany/Italy. Primary SEO target: English-language searches from Europe. (Italian-language expansion is an open decision — see [Open Decisions](#open-decisions-for-fabio).)

---

## 3. Master Step List — Prepare Everything, Then Flip the Switch

**Strategy: the old WordPress site keeps serving the domain while the entire new site — pages, SEO, forms, email, measurement — is built and verified on the staging build. The cutover then becomes a short, low-risk switch instead of a construction site in production.**

Work top to bottom within each stage. Details for every step are in the phase sections below.

### Stage 1 — Preparation (old WordPress site still live on the domain)

Everything in this stage can be completed and tested before touching DNS or hosting.

| # | Step | Phase | Effort | Depends on |
|---|------|-------|--------|------------|
| 1 | Verify the domain in Google Search Console **now** (DNS TXT record — works while WP is live, preserves history, and unlocks the old site's query data and Links report, which feed the redirect map) | C | S | DNS access |
| 2 | Baseline snapshot of the old site: GSC top queries/pages, backlinks (Ahrefs Webmaster Tools), current rankings for the 10 priority keywords | B/C | S | step 1 |
| 3 | WordPress URL inventory + 301 redirect map; decide student-portal fate; choose hosting/CDN that can serve redirects | B | M | portal & hosting decisions |
| 4 | Replace the `mailto:` form with a real form backend; test delivery end-to-end to office@transpersonal-training.com | A | S | provider decision |
| 5 | Build the dedicated `/apply/` page (process, requirements, fees indication, form) | A | M | content from Pablo/Fabio |
| 6 | Create the missing money pages: Courses/Hero Journey, Transpersonal Therapist (career), FAQ, Fees & Dates | D | L | content |
| 7 | Implement the Cluster Keywords Map on all existing pages (titles, H1, descriptions, copy) | D | M | — |
| 8 | Expand structured data: `Event` (schedule), `Person` (teachers), `BlogPosting`, `FAQPage`, `BreadcrumbList`, enrich `Course` | D | M | — |
| 9 | Technical SEO hygiene: 404 page, canonical for syndicated posts, nav URL consistency, self-hosted fonts/icons, Agreement page rebuilt into the new site, dynamic copyright year | E | M | — |
| 10 | Image SEO & performance: `@11ty/eleventy-img` pipeline, alt-text audit, lazy loading; Lighthouse ≥ 90 on mobile | E | M | — |
| 11 | Trust layer: Accreditation page, testimonials collected from current students, teacher bios enriched with credentials | F | M | testimonials collection |
| 12 | Integrate cookieless analytics into the build + define conversion events (starts collecting automatically at cutover) | C | S | tool decision |
| 13 | Email marketing ready: Brevo account, lists, programme-PDF lead magnet, welcome sequence drafted, forms wired into the site | I | L | step 4 |
| 14 | Create social profiles (Instagram + LinkedIn), add them to footer + JSON-LD `sameAs` | J | S | ownership decision |
| 15 | Draft 2–3 original blog posts so the site launches with fresh content | G | M | author availability |
| 16 | Full pre-cutover QA: crawl the staging build (Screaming Frog), zero 404s, one canonical per page, Rich Results Test, mobile check, live form test | B/E | S | steps 4–10 |

### Stage 2 — Cutover (launch week)

| # | Step | Phase | Effort |
|---|------|-------|--------|
| 17 | Freeze WP content and take a full backup/export; move or preserve the student portal per the step-3 decision | B | S |
| 18 | Switch DNS/hosting: new site live on the domain, 301 redirects active, HTTPS enforced | B | S |
| 19 | Submit the sitemap in GSC (+ Bing), URL-inspect the top 10 pages; announce the launch (email + social) | B/C | S |
| 20 | Monitor GSC coverage and redirects weekly for 4–6 weeks; fix crawl errors as they appear | B | ongoing |

### Stage 3 — Post-launch growth (first 6–12 months)

| # | Step | Phase | Effort |
|---|------|-------|--------|
| 21 | Blog cadence: 1–2 posts/month following the keyword sheet, internal-linking rules | G | ongoing |
| 22 | Off-page: EUROTAS/EAP directory listings, teacher & partner backlinks, niche directories (the domain doesn't change at cutover, so this can start during Stage 1 if capacity allows) | H | M |
| 23 | Google Business Profile + student reviews, venue-level local SEO | H | S |
| 24 | Email sequences live: application nurture + monthly newsletter | I | ongoing |
| 25 | Social cadence with the repurposing pipeline | J | ongoing |
| 26 | Events as marketing: free intro webinars/open evenings, add-to-calendar, post-event follow-up | K | ongoing |
| 27 | Paid acquisition pilot (Google Ads on high-intent keywords) — optional | L | M |
| 28 | Monthly KPI review loop (GSC + analytics + applications), quarterly revision of this plan | — | ongoing |

Effort: S = hours, M = days, L = a week+.

---

## Phase A — Conversion Foundation (do first)

Nothing else in this plan pays off while leads leak out of a broken form. Steps 1–3 of Stage 1 are data gathering — **this is the first thing to actually build**, and it can be built and tested in full while the old site still serves the domain.

### A1. Real form backend

- Replace `<form action="mailto:...">` on the homepage (and any future Apply page) with a static-site-friendly form service. Candidates:
  - **Brevo forms** — free tier, doubles as the email-marketing platform (Phase I) → leads land directly in a contact list. Recommended if Brevo is confirmed for email.
  - **Formspree / Web3Forms / Tally** — 5-minute setup, forwards to `office@transpersonal-training.com`.
  - **Google Forms (embedded)** — zero cost, ugly but workable; data in Sheets fits the existing Sheets-driven workflow.
- Requirements whichever tool wins: success/error feedback on the page, spam protection (honeypot), GDPR consent checkbox, notification email to the school, and the submission stored somewhere durable (not only email).
- Update the privacy modal to name the form processor.

### A2. Dedicated `/apply/` page

Right now "Apply" is a scroll-to-contact anchor. High-intent visitors need one page that closes:

- Admission requirements (already drafted in `src/content/training-overview/admissions/`)
- Process timeline: enquiry → interview → enrolment; key dates for the 2027 cohort
- Fees (or at least a range + payment options) — cost is a top pre-application search; competitors that hide fees lose applicants
- The application form itself + a low-commitment alternative ("book a 20-minute call")
- FAQ excerpt + testimonial

### A3. Secondary conversions everywhere

Every page should end with a next step. Standardize three CTA blocks and add one to each page: **Apply / Ask a question** (BOFU pages), **Join an intro evening** (MOFU), **Get the programme PDF by email** (TOFU — feeds Phase I).

---

## Phase B — WordPress → New Site SEO Migration

The old site has years of history, backlinks, and indexed URLs. A naive cutover = starting SEO from zero **and** breaking the current students' portal.

Timing: **B1 and B2 are Stage 1 preparation work** — do them early, while WordPress still serves the domain. **B3 is the Stage 2 cutover itself** and only runs once everything in Stage 1 is verified.

### B1. Inventory (before touching anything)

- Export all indexed URLs: WP sitemaps (`/wp-sitemap.xml` — posts, pages, events, portfolio, categories, tags), plus GSC "Pages" report once access exists, plus a `site:transpersonal-training.com` check.
- Identify which old URLs have backlinks (free: GSC Links report + Ahrefs Webmaster Tools).
- Classify every URL: **public content** (map to new page), **student portal** (`/login/`, `/dashboard-page/`, `/payment/`, `/user-profile/`, `/information/`, `/course-archive/`…), **archives/junk** (410 or redirect to closest hub).

### B2. Redirect map & portal decision

- Write a 301 map, e.g. `/faculty/ → /teachers/`, `/program-2026/ → /training-overview/`, `/schedule/ → /schedule/` (same path — verify content parity), `/apply/ → /apply/` (new page from A2), archive pages → homepage or blog.
- **Student portal:** the WP login/dashboard/payment system is in active use. Options: (a) move WP to a subdomain like `portal.transpersonal-training.com` and 301 the portal paths there; (b) replace with the new restricted-lectures approach (see PABLO task 5) before cutover. Decide before DNS changes.
- GitHub Pages cannot serve real 301s. Options: host behind **Cloudflare** (free) and use Bulk Redirects, or choose hosting that supports redirects (Netlify/Cloudflare Pages `_redirects` file). This may decide PABLO task 10 (deployment path).
- Rehome the `/agreement-appendix` page (footer links to it on the WP site today).

### B3. Cutover checklist

- [ ] Verify domain in GSC **before** cutover (keeps history)
- [ ] Freeze WP content; take a full backup/export
- [ ] Deploy new site + redirects; keep portal reachable
- [ ] Crawl the new site (Screaming Frog free tier, 500 URLs) — zero 404s, one canonical per page
- [ ] Submit new sitemap in GSC; use URL Inspection on the 10 most important pages
- [ ] Watch GSC Coverage + redirects for 4–6 weeks; fix crawl errors weekly

---

## Phase C — Measurement Setup

### C1. Google Search Console (+ Bing Webmaster Tools)

Domain-level verification (DNS TXT), email alerts on. This is free, takes an hour, and is the single most important SEO tool. **Do it now, as Stage 1 step 1** — a domain property covers the old WordPress site and the future site alike, so verifying today gives immediate access to the old site's query data and Links report (the raw material for the B1/B2 baseline and the redirect map) and preserves history across the cutover. The sitemap gets submitted at cutover (step 19).

### C2. Analytics — privacy-consistent choice

The privacy policy promises no cookies/tracking. Two coherent paths:

| Option | Pros | Cons |
|--------|------|------|
| **Cookieless analytics** (Plausible €9/mo, Fathom, GoatCounter free, Cloudflare Web Analytics free) | No consent banner, privacy policy stays true, EU-hosted options | Less detail than GA4; small cost |
| **GA4** | Free, powerful, integrates with Google Ads | Requires consent banner + privacy-policy rewrite; consent rejections blind you anyway |

**Recommendation: cookieless (Plausible or Cloudflare).** The site's audience is privacy-sensitive; a "no tracking" stance is itself marketing. Revisit only if paid ads (Phase L) demand GA4/Ads integration.

### C3. Define conversions from day one

Track as events: application form submitted, contact form submitted, programme-PDF requested, newsletter signup, outbound `mailto:` click, schedule-page → event detail engagement. Add UTM discipline for every campaign link (email, social, ads) — document the convention here when adopted.

---

## Phase D — On-Page SEO (Keyword Implementation)

This turns the Drive research into actual rankings. Work page by page through the [Cluster Keywords Map](https://docs.google.com/spreadsheets/d/1vyGrnHLGvWC4gvbL3UU0zgpHoGUVsnvc2H2yaulVxyg), updating its Status column as pages ship.

### D1. Page ↔ keyword assignments (condensed from the sheet)

| Priority | Page | Primary keyword target | Working title/hook (from sheet) |
|----------|------|------------------------|--------------------------------|
| 1 | Home | transpersonal psychology training / transpersonal counselling training | "Certified Transpersonal Psychology Training" |
| 1 | **Courses (new page)** | hero journey, transpersonal training for therapists | "Our Hero Journey: an Advanced Shadow Work — Professional Training for Therapists" |
| 1 | Become a Client Model | free counselling / breathwork seminars free | promotional angle |
| 2 | **Transpersonal Therapist (new page)** | what is transpersonal psychology → career angle | "Why Holistic Training is the Future of Psychotherapy" |
| 2 | Techniques | breathwork facilitator training, breathwork certification | "Breathwork Facilitator Certification: Integrate Somatics into Therapy" |
| 3 | Blog pillar | what is transpersonal psychology | "Beyond the Ego: An Introduction to Transpersonal Psychology" |
| 3 | Blog | spiritual crisis vs psychosis | "Spiritual Emergency: How to Distinguish Awakening from Mental Illness" |
| 3 | Blog | spiritual bypassing | "The Trap of Spiritual Bypassing" |
| 3 | Blog | psychology and spirituality | "Bridging the Gap: Integrating Spirituality into Clinical Practice" |
| 3 | Blog | what is kundalini; polyvagal theory; non-ordinary states; evidence-based transpersonal therapies | (four further posts) |

High-value keywords not yet mapped to any page (from Selecting Keywords, all low difficulty): `transpersonal psychotherapy` (320/mo, SEO difficulty 2!), `eurotas accredited psychotherapy schools`, `transpersonal psychology degree europe` (difficulty 5), `holistic counselling courses online` (difficulty 5), `non-ordinary states of consciousness` (difficulty 6). Assign each a home: most fit the What-is page, an Accreditation page (Phase F), or the FAQ.

### D2. Per-page on-page checklist (apply to every page)

- [ ] `<title>` ≤ 60 chars, primary keyword first, brand last (`Breathwork Facilitator Training | Transpersonal Training`)
- [ ] Meta description 140–160 chars, includes keyword + a reason to click (accreditation, dates, "online + residential")
- [ ] Exactly one `<h1>` containing the primary keyword naturally
- [ ] H2s cover secondary keywords from the cluster (they're listed per page in the sheet)
- [ ] Primary keyword in the first 100 words of body copy
- [ ] 2–4 internal links to related pages with descriptive anchor text (not "click here")
- [ ] Image alt texts descriptive; hero image filename meaningful
- [ ] A CTA block (Phase A3)

### D3. Structured data expansion

- **Schedule page:** one `Event` JSON-LD per upcoming intensive (name, startDate, endDate, location with venue address, offers, organizer). Google shows event rich results — free SERP real estate. Generated at build time from the same Sheets data.
- **Teachers page:** `Person` schema per core teacher (name, jobTitle, affiliation, image, sameAs → their personal sites — Manal and Mario already have sites).
- **Blog:** `BlogPosting` schema in `blog_article.njk` (headline, author as `Person`, datePublished, image).
- **FAQ page (new):** `FAQPage` schema → FAQ rich results.
- **All pages:** `BreadcrumbList`.
- **Enrich the homepage `Course`:** add `offers` (price/priceCurrency once fees are public), `hasCourseInstance` with real dates and both venue locations, `aggregateRating` when reviews exist, fill `sameAs` once social profiles exist (Phase J).
- Validate everything with Google's Rich Results Test after each change.

---

## Phase E — Technical SEO & Performance

- **404 page:** create `src/404.html` with navigation and search-relevant links (GitHub Pages serves `/404.html` automatically).
- **Canonical for syndicated posts:** the two republished articles must emit `<link rel="canonical">` to the original URLs (add a `canonicalUrl` front-matter field rendered in `base.njk`/`blog_article.njk`), or be rewritten into substantially different pieces. Otherwise they waste crawl budget and can drag site quality.
- **URL consistency:** `navigation.njk` links to both `/curriculum/` and `/curriculum/index.html` forms. Normalize everything to the trailing-slash form (one URL = one page).
- **Self-host fonts & icons:** download Inter + Cormorant Garamond as woff2 (google-webfonts-helper), serve from `/assets/fonts/`; bundle the ~6 Lucide icons actually used as inline SVG or a local file instead of the 300 KB unpkg script. Fixes the GDPR inconsistency (item 9 of the audit), removes 3 third-party DNS connections, improves LCP.
- **Image pipeline:** adopt `@11ty/eleventy-img` (already in FUTURE_IDEAS): responsive `srcset`, AVIF/WebP, width/height attributes (prevents CLS), `loading="lazy"` below the fold.
- **Page loader:** the full-screen loader overlay delays perceived load on every page; consider removing it or gating it to slow connections — LCP is a ranking factor.
- **Footer Agreement link:** points to the WP page; will 404 after migration. Bring the agreement into the new site (or the portal).
- **Copyright year:** make it dynamic (`© {current year}`).
- **Run Lighthouse + PageSpeed Insights** after E-items land; target ≥90 performance/SEO/accessibility on mobile. Add Lighthouse CI later (FUTURE_IDEAS).

---

## Phase F — Trust & E-E-A-T

Google weighs expertise/authoritativeness heavily for health-adjacent topics (this is a psychotherapy school — YMYL territory). Trust signals also convert humans.

- **Accreditation page (new):** what EUROTAS/EAP accreditation means, certification path hours (already documented in DOCUMENTATION.md), logos, links to the EUROTAS listing. Targets `eurotas accredited psychotherapy schools`, `transpersonal psychology degree europe`.
- **Teacher bios:** expand with credentials, publications, years of practice; link each teacher's personal site (and get a link back — Phase H). Add `Person` schema (D3).
- **Testimonials & alumni stories:** collect 5–10 short quotes (with photo + name + cohort, with consent) from current East/West students; place on Home, Training Overview, Apply. Later: 2–3 long-form alumni interviews as blog posts ("From nurse to transpersonal therapist").
- **Photos of real seminars:** already shot and releases confirmed (see `photo_updating` branch work) — real people in real venues outperform stock everywhere.
- **About/Contact completeness:** physical address (at least city/country), responsible persons, email — reassures both Google and applicants.
- **Video:** a 2-minute "welcome from the founders" on the homepage and a venue walkthrough. Hosted self/bunny.net or YouTube (YouTube doubles as a channel — Phase J).

---

## Phase G — Content Engine (Blog)

### G1. Editorial system

- Cadence: **1–2 posts/month, sustained** beats 8 posts in January and silence after.
- Workflow already documented in [BLOG_HOWTO.md](BLOG_HOWTO.md); decide the drafting flow (Google Docs → GitHub per FUTURE_IDEAS pipeline, or direct GitHub editing) — PABLO task 16.
- Every post: primary keyword from the sheet, D2 checklist, ≥2 internal links to a money page (Training Overview, Techniques, Apply), CTA block (programme PDF / newsletter).

### G2. First 8 posts (order from the keyword sheet priorities)

1. Beyond the Ego: What is Transpersonal Psychology? (pillar — link from every later post)
2. Spiritual Emergency: Distinguishing Awakening from Crisis (`spiritual crisis` 170/mo, diff 35)
3. The Hero's Journey as a Map for Therapy (`hero journey` 3600/mo, diff 19 — biggest volume in the research)
4. What is Spiritual Bypassing? (90/mo, diff 35)
5. Breathwork for Anxiety: What the Evidence Says (90/mo, diff 32)
6. Repeating Cycles: Why Behaviour Patterns Return (`behaviour pattern` 320/mo, diff 18)
7. Non-Ordinary States of Consciousness in Healing (diff 6)
8. Evidence-Based Transpersonal Therapies (E-E-A-T flagship; cite research)

### G3. Syndication policy

Guest/republished posts (Manal, Mario) are good for relationships and content volume, but: always add `rel=canonical` to the original (E), always add an author box linking their site, and keep the ratio ≥1 original : 1 syndicated.

---

## Phase H — Off-Page SEO & Authority

Backlinks in this niche are won through relationships, not cold outreach.

Timing note: the domain does not change at cutover, so links pointed at `transpersonal-training.com` today keep their full value afterwards. Directory listings and partner links can start during Stage 1 if there's capacity — just link to the root domain or to paths that exist on both the old and new site.

- **EUROTAS**: ensure the school is listed on eurotas.world's accredited-schools/members pages with a followed link (likely the single most valuable backlink available — topical, authoritative, trust-transferring).
- **Teacher network:** every core and guest teacher with a website links to the school ("I teach at…"). Manal and Mario already republish content — formalize reciprocal links.
- **Directories:** EAP, national transpersonal associations, breathwork directories (e.g. breathwork alliance lists), therapy-training directories, GoodTherapy-style course listings, Psychology Today (where applicable).
- **Guest articles:** offer teachers' articles to established outlets (transpersonal journals, EUROTAS newsletter, therapy blogs) with a bio link.
- **Google Business Profile:** create one for the school (education category). Even without a public campus it enables reviews and Maps presence; encourage students to leave Google reviews. Consider venue-tagged posts around each intensive.
- **Monitor:** Ahrefs Webmaster Tools (free) quarterly for new/lost links.

---

## Phase I — Email Marketing

The single highest-ROI channel for a school with a long decision cycle (people consider a 4-year training for months). A Brevo integration plan already exists in the `gas-automation` orphan branch.

- **Platform:** Brevo (free tier: 300 emails/day, forms, automation). EU-based, GDPR-friendly.
- **Lead magnets:**
  1. **Programme PDF** — the Curriculum PDF generator already produces a "Program PDF (summary)"; gate it behind an email form ("Get the full programme brochure").
  2. **Free intro webinar recording** (after first webinar, Phase K).
- **Sequences:**
  - *Welcome* (3 emails): brochure delivery → school story/what makes transpersonal training different → invitation to intro evening / call booking.
  - *Application nurture:* for people who enquired but didn't apply — testimonials, teacher spotlights, deadline reminders for the 2027 cohort.
  - *Newsletter* (monthly): next events, latest blog post, one student/teacher story.
- **Compliance:** double opt-in, consent text at the form, privacy modal updated to name Brevo.

---

## Phase J — Social Media

Rule: **two channels done consistently beat five done sporadically.** Recommended pair for this audience:

| Channel | Why | Cadence |
|---------|-----|---------|
| **Instagram** | Personal-growth/breathwork audience lives here; seminar photos are strong material (releases in hand) | 2–3 posts/week + stories at events |
| **LinkedIn** | Career-changers and therapists researching professional training; teachers can amplify | 1–2 posts/week |
| *(later)* YouTube | Lecture excerpts, teacher talks, venue tours; compounds with blog embeds | 1–2 videos/month when capacity exists |

- Repurposing pipeline: 1 blog post → 3 IG carousels + 1 LinkedIn post + newsletter section. Nothing is created for social from scratch.
- Content mix: 40% educational (concepts from the keyword list), 30% behind-the-scenes (venues, seminars), 20% people (teachers/students), 10% CTA (events, application windows).
- Once profiles exist: add to footer, to JSON-LD `sameAs`, and to email signatures.

---

## Phase K — Events as Marketing

The schedule of intensives is a marketing asset, not just logistics.

- **Free/low-cost intro formats:** quarterly online "Introduction to Transpersonal Psychotherapy" evening; occasional taster breathwork sessions (targets `breathwork seminars free` from the keyword map). Registration through the Phase A form → email list.
- **Event schema** on every schedule entry (D3) + **add-to-calendar** links.
- Publish events also to: LinkedIn Events, Facebook Events, EUROTAS community calendar, local listings near venues.
- Post-event: photo recap post (blog + social), replay email to registrants with an Apply CTA.
- Each cohort application window gets a mini-campaign: announcement post, 2 emails, deadline reminder across channels.

---

## Phase L — Paid Acquisition (Optional)

Only after Phases A–I are live (paid traffic into a leaky funnel is burned money). The keyword sheet already contains CPC data.

- **Google Ads — exact/phrase match pilot (~€300–500/mo for 2–3 months):** bid only on high-intent, low-competition terms: `transpersonal psychotherapy training`, `transpersonal counselling certification`, `holotropic breathwork facilitator training`, `eurotas accredited`, `transpersonal psychology course`. Land on `/apply/` or Training Overview. Low volumes mean low spend — this is a precision tool here, not a firehose.
- **Meta ads:** only for event promotion (intro webinars) with interest targeting (breathwork, Jung, holistic therapy). Note: real retargeting requires pixels/cookies → conflicts with the no-tracking stance; run cold-audience event ads instead.
- Measure cost per qualified application, not clicks. Kill anything above the acceptable acquisition cost given a 4-year tuition LTV.

---

## KPIs & Review Cadence

| KPI | Source | Baseline | Check |
|-----|--------|----------|-------|
| Qualified applications / enquiries | Form backend | 0 (broken form) | Weekly |
| Organic clicks & impressions | GSC | — (new site) | Monthly |
| Rankings for the 10 priority keywords (D1 table) | GSC / free rank checker | — | Monthly |
| Email list size & open rate | Brevo | 0 | Monthly |
| Event registrations | Form/Brevo | — | Per event |
| Indexed pages & coverage errors | GSC | — | Weekly for 6 weeks post-migration, then monthly |
| Referring domains | Ahrefs Webmaster Tools | ~unknown (audit in B1) | Quarterly |
| Core Web Vitals (mobile) | PageSpeed Insights | — | After Phase E, then quarterly |

**Cadence:** 30-minute monthly review (GSC + analytics + application count) → pick the top 3 actions for next month. Quarterly: revisit this document, update the Cluster Keywords Map statuses, re-run the competitor sheet.

---

## Open Decisions for Fabio

These block specific steps; everything else can proceed.

1. **Form backend** (blocks step 4): Brevo forms vs Formspree/Tally vs embedded Google Form. *Recommendation: Brevo, since it also covers Phase I.*
2. **Analytics tool** (blocks step 12): cookieless (Plausible/Cloudflare) vs GA4+consent banner. *Recommendation: cookieless.*
3. **Student portal fate at migration** (blocks steps 3 and 17–18): keep WordPress on a subdomain vs replace before cutover. This interacts with PABLO task 5 (lectures login) and task 10 (hosting).
4. **Hosting/CDN** (blocks steps 3 and 18): GitHub Pages alone cannot do 301 redirects — put Cloudflare in front, or switch to Netlify/Cloudflare Pages?
5. **Fees transparency** (affects steps 5–6): publish fees, a range, or "on request"? *Recommendation: at least a range — it qualifies leads and is heavily searched.*
6. **Who writes content** (blocks steps 15 and 21): Fabio, teachers on rotation, syndication from Manal/Mario, or a hired writer?
7. **Social ownership** (blocks steps 14 and 25): who runs Instagram/LinkedIn week to week? If nobody, defer Phase J rather than doing it badly.
8. **Italian-language market:** the keyword sheet contains `Respirazione olotropica`; venues include Tuscany. Add an Italian section (`/it/` + hreflang) or stay English-only? *Recommendation: English-only until the cohort fills, then reassess.*
9. **Ads budget** (blocks step 27): is there any budget for a Google Ads pilot in 2026–27?

---

*Last updated: July 2026*
