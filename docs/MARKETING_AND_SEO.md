# Marketing & SEO Plan — Transpersonal Training

> Complete, prioritized roadmap for marketing the school and optimizing the website for search.
> Companion documents: [PABLO_TASKS.md](PABLO_TASKS.md) (launch blockers), [FUTURE_IDEAS.md](FUTURE_IDEAS.md) (technical backlog),
> [OLD_SITE_CONTENT_MIGRATION.md](OLD_SITE_CONTENT_MIGRATION.md) (old-site content gap analysis: fees, enrollment options, certificates, partners, contacts — feeds Phases A/B/F and adds open decisions 10–16),
> [SEO_KEYWORD_MAP.md](SEO_KEYWORD_MAP.md) (**current source of truth for page ↔ keyword assignments** — supersedes the D1 table below and the Drive Cluster Keywords Map, both written when the site had a different page structure; also holds the long-tail phrase coverage audit).
>
> Preliminary SEO research (keyword volumes, clusters, competitors) lives in the shared
> [Google Drive SEO folder](https://drive.google.com/drive/u/1/folders/1V3B3Ou0l_iZ-n1tkCS_HriQqGO9hIDTU):
> - [Selecting Keywords](https://docs.google.com/spreadsheets/d/1HE6d2vZnmz9gqIRw3Yug2iBD-61k3RsiXonjhSz29M0) — ~65 keywords with volume, difficulty, CPC, awareness stage
> - [Cluster Keywords Map](https://docs.google.com/spreadsheets/d/1vyGrnHLGvWC4gvbL3UU0zgpHoGUVsnvc2H2yaulVxyg) — page-by-page keyword assignments with priorities
> - [SEO Competitor Analysis](https://docs.google.com/spreadsheets/d/1IpYDSNKzPb4tb-dUchyT3nwHU5pTpa2t3epJhKajO7s) — 14 competitor schools listed, metrics to fill in
> - [SEO Longtail Keywords](https://docs.google.com/document/d/10fWmPbUOrqP2YLXMonK9G3jaxAPJA8mnzzj9SohCjKE) — long-tail phrases by audience persona

*Created: July 2026*

---

## Progress log — what is actually done

> Updated 2026-07-20. This section is the quick status; the phase sections below hold the detail.
> Several items in the original audit are now stale — they are struck through where superseded.

**Done**

| Stage 1 step | What happened |
|---|---|
| 1 — Search Console | ✅ Domain property verified and active |
| 2 — Baseline snapshot | ✅ Measured and analysed → **[seo-baseline/BASELINE.md](seo-baseline/BASELINE.md)**. 347 clicks / 17,448 impressions / 255 indexed pages / 7 referring domains |
| 3 — URL inventory + redirect map | ✅ 574 old URLs inventoried, 301 map drafted and prioritized by real click/backlink data → [seo-baseline/REDIRECT_MAP.md](seo-baseline/REDIRECT_MAP.md). Portal question answered (already on `student.`). **Only the hosting choice still blocks it** |
| 3c — Protect bio-page traffic | ✅ Old teacher URLs 301 to `/teachers/#<id>`; the page now expands the right teacher from the URL fragment |
| 4 — Real form backend | ✅ **Built and live.** Google Apps Script web app → contact messages and applications land in a spreadsheet, signed agreements in Drive, notification email to the office. Honeypot, GDPR consent text and on-page success/error feedback all present. `mailto:` survives only as a no-JS fallback. See [APPLICATION_PAGE_SETUP.md](APPLICATION_PAGE_SETUP.md) |
| 5 — `/apply/` page | ✅ **Built.** 3-step flow: details → generated enrolment agreement (from the master Google Doc) → signed-copy upload |
| Resources page | ✅ `/resources/` live (Phase G4) |
| Collaborations page | ✅ `/collaborations/` live (Phase H) |

**Next up, in order**

1. **Hosting decision** — the single remaining blocker on the redirect map (recommendation: Cloudflare Pages, [Open Decisions #4](#open-decisions-for-fabio))
2. **Email marketing (Phase I)** — Brevo account, CleverReach list migration, newsletter signup on the site, programme-PDF lead magnet. *This, not the form backend, is what Brevo is for*
3. **Urgent hygiene, independent of the cutover** — secure the `test.` subdomain ([PABLO 31](PABLO_TASKS.md)), portal SEO hygiene ([PABLO 33](PABLO_TASKS.md)), recover the missing West Program PDF ([PABLO 34](PABLO_TASKS.md))
4. **Analytics (step 12)** — free if Cloudflare Pages is chosen
5. **On-page SEO (Phase D)** — 🟡 **partly done (Jul 2026):** titles/descriptions for 13 of ~15 mapped pages now match [SEO_KEYWORD_MAP.md](SEO_KEYWORD_MAP.md) (D2's first checklist item). Still open: H1s and body copy haven't been audited against the map (D2's other checklist items), the FAQ and Transpersonal Therapist (career) pages don't exist yet, and the long-tail phrase audit found real gaps (see [SEO_KEYWORD_MAP.md § Long-tail phrase coverage](SEO_KEYWORD_MAP.md#long-tail-phrase-coverage)). The baseline still confirms nothing commercial ranks yet — titles alone don't move that; it needs indexing time plus the remaining D2 items

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

> **Baseline measured (Jul 2026).** Search Console data for the old site is now in
> **[seo-baseline/BASELINE.md](seo-baseline/BASELINE.md)** — read it alongside this section, it
> corrects two assumptions below. In short: 347 clicks / 17,448 impressions over 6 months, 255 pages
> indexed, 7 referring domains. **64% of clicks go to teacher bio pages** (teacher-name searches,
> positions 3–8); commercial keywords rank at positions 50–88 with zero clicks. Two undocumented
> subdomains exist: `student.` (the portal, already separated) and `test.` (a public indexed staging
> copy — fix now).

### Critical gaps found in the audit

1. **The production domain still serves the old WordPress site.** `transpersonal-training.com` currently runs WordPress (Enfold theme, MEC events, a full student portal with login/dashboard/payment pages, yearly archive pages, Russian-language event pages). The new Eleventy site is not live. Launching without a redirect plan will throw away every existing backlink and ranking, and will break the student portal. → Phase B.
2. ~~**The conversion path is broken.** The only contact/application mechanism is a `<form action="mailto:...">`.~~ → **RESOLVED (Jul 2026).** Both the homepage contact form and the new `/apply/` page now POST to a Google Apps Script web app that writes to a spreadsheet, saves signed agreements to Drive and emails the office; `mailto:` remains only as a no-JS fallback. Every Phase A1 requirement is met — feedback on the page, honeypot, GDPR consent, durable storage. Remaining: name the processor in the privacy modal (see Phase A1).
3. ~~**Zero measurement.** No analytics, no Search Console.~~ → **PARTLY RESOLVED (Jul 2026):** Search Console verified, and the old site's baseline is measured ([BASELINE.md](seo-baseline/BASELINE.md)). **Analytics is still missing** → Phase C2.
4. 🟡 **Keyword map partly implemented (Jul 2026).** Titles/descriptions were rewritten for 13 of ~15 pages to match [SEO_KEYWORD_MAP.md](SEO_KEYWORD_MAP.md) (which itself supersedes the stale Drive Cluster Keywords Map — the sheet's 13 "pages" don't match the site's 18 real ones). Not done: H1s and body copy haven't been checked against target keywords page by page; `/venues/` title is deliberately still generic pending [PABLO task 36](PABLO_TASKS.md) (Eastern venue placeholder); of the three planned new pages, the Hero's Journey angle shipped as a **blog post** (`/blog/the-heros-journey-in-transpersonal-work/`, byline Fabio Malizia) rather than the dedicated pillar page the map originally specified, and **Transpersonal Therapist (career) and FAQ still don't exist**. A long-tail phrase audit against the Longtail Keywords doc also found real content gaps — see [SEO_KEYWORD_MAP.md § Long-tail phrase coverage](SEO_KEYWORD_MAP.md#long-tail-phrase-coverage). → Phase D.
5. ~~**Duplicate-content risk on the blog.** 2 of 3 posts are republished from the authors' own sites (manalpsychotherapy.com, mariolorenzetti.org) with no `rel=canonical` pointing anywhere. Google may ignore or penalize them.~~ → **RESOLVED (Jul 2026).** The premise only held for one post: Mario Lorenzetti's medicine-wheel piece is genuinely republished from `mariolorenzetti.org`, and now emits `rel=canonical` to the original there. Manal Al-Hammadi's two posts were never syndicated — she wrote them directly for this blog — so the `source`/`sourceUrl` front matter that wrongly implied otherwise (and the "Originally published on…" badge it drove) has been removed from both; they now self-canonicalize like any original post, and her byline still links to her site as an author credit. Mechanism: `base.njk` emits `rel=canonical` to `sourceUrl` when a post sets it, else to the page's own URL — any future republished post is covered automatically just by setting `sourceUrl`. See Phase G3.
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

> **Reference, not a to-do.** Unlike the "Business goals" table above (marked *proposed — confirm*),
> nothing here needs an action from Fabio/Pablo by itself. It's the lens other phases are already
> written through: it says *who* a page or blog post is for and *how close to applying* they are
> (TOFU = just discovering the topic, MOFU = comparing options, BOFU = ready to apply), so that
> Phase D copy and Phase G blog topics get matched to the right audience instead of guessed at. The
> five personas below are our synthesis of the Longtail doc's 7 keyword categories — read literally,
> it groups by search intent, not by person; category 3 ("not satisfied with classical
> psychotherapy") and category 2 ("personal therapy") both feed persona 4 here, for example.

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
| 1 | ✅ **DONE (Jul 2026)** — domain verified in Google Search Console | C | S | — |
| 2 | ✅ **DONE (Jul 2026)** — baseline captured and analysed: **[seo-baseline/BASELINE.md](seo-baseline/BASELINE.md)**. 347 clicks / 17,448 impressions / 255 indexed pages / 7 referring domains. *(Ahrefs cross-check still pending)* | B/C | S | step 1 |
| 3 | 🟡 WordPress URL inventory ✅ (574 URLs) + 301 redirect map ✅ drafted and data-prioritized ([seo-baseline/REDIRECT_MAP.md](seo-baseline/REDIRECT_MAP.md)); portal fate ✅ largely answered (already on `student.` subdomain); **still blocked on the hosting/CDN choice** | B | M | hosting decision |
| 3b | 🔴 **NEW — urgent, independent of the cutover:** `test.transpersonal-training.com` is publicly indexed with a full duplicate of the site (402 impressions). Add HTTP auth or `noindex`+`Disallow`, then request removal in GSC | E | S | server access |
| 3c | ✅ **DONE (Jul 2026)** — bio-page traffic protection. Bio pages are **64% of all organic clicks**. Decision (Fabio): no per-teacher pages; all 32 old URLs 301 to **`/teachers/#<id>`**, and the page now expands the right teacher from the URL fragment. Viable because all 32 bios are server-rendered into that page's HTML. Residual risk tracked as [PABLO task 32](PABLO_TASKS.md) | D/F | S | — |
| 4 | ✅ **DONE (Jul 2026)** — real form backend live (Apps Script → Sheets + Drive + notification email). `mailto:` kept only as a no-JS fallback | A | S | — |
| 5 | ✅ **DONE (Jul 2026)** — `/apply/` page built: details → generated enrolment agreement → signed-copy upload | A | M | — |
| 6 | Create the missing money pages: Courses/Hero Journey, Transpersonal Therapist (career), FAQ, Fees & Dates | D | L | content |
| 7 | Implement the Cluster Keywords Map on all existing pages (titles, H1, descriptions, copy) | D | M | — |
| 8 | Expand structured data: `Event` (schedule), `Person` (teachers), `BlogPosting`, `FAQPage`, `BreadcrumbList`, enrich `Course` | D | M | — |
| 9 | 🟡 Technical SEO hygiene: ✅ 404 page, ✅ canonical for syndicated posts, ✅ nav URL consistency — still open: self-hosted fonts/icons, Agreement page rebuilt into the new site, dynamic copyright year | E | M | — |
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

### A1. Real form backend — ✅ BUILT (Jul 2026)

**Solution chosen: a Google Apps Script web app**, not a third-party form service. One script serves
both forms and writes into one spreadsheet; full documentation in
[APPLICATION_PAGE_SETUP.md](APPLICATION_PAGE_SETUP.md).

| What | Where it lands |
|------|----------------|
| Homepage contact message | `Contact` tab in the forms spreadsheet + email to the office |
| Application details (`/apply/` step 1) | `Applications` tab |
| Signed agreement (`/apply/` step 3) | PDF in a Drive folder + link written into that applicant's row |

Why this rather than Brevo forms: the school already runs on Google Sheets (curriculum, schedule,
lectures), so leads land inside the same workflow the office already uses, one applicant to one row,
and the signed-agreement upload — which no generic form service does — comes for free.

All Phase A1 requirements are met: on-page success/error feedback, honeypot spam trap, GDPR consent
text at the form, notification email, and durable storage in Sheets/Drive rather than email alone.
The endpoint lives in [src/_data/forms.js](../src/_data/forms.js) (overridable via `FORMS_ENDPOINT`);
`mailto:` survives in the markup purely as a no-JavaScript fallback.

**Still to do on this item:**
- [ ] **Name the processors in the privacy modal.** It currently says only "our email provider"
      generically. GDPR expects the real ones: Google (Apps Script / Sheets / Drive), plus Brevo once
      email marketing goes live, plus the host once chosen.
- [ ] Re-test delivery end-to-end after the hosting cutover (the endpoint is called from the browser,
      so a domain change shouldn't matter, but confirm).

### A2. Dedicated `/apply/` page — ✅ BUILT (Jul 2026)

`/apply/` ([src/apply.html](../src/apply.html)) is a 3-step flow: applicant details → the enrolment
agreement generated in-browser from the master Google Doc → upload of the hand-signed copy. Fees are
published on Training Overview (exact prices, Open Decision 5).

**Still to do on this item:**
- [ ] Add the low-commitment alternative — "book a 20-minute call" — for visitors not ready to apply
- [ ] Add an FAQ excerpt and a testimonial to the page (Phase F trust signals)
- [ ] Fill the remaining `[…]` placeholders in the agreement Doc and get the lawyer review
      (blocks real use — see [PABLO task 22](PABLO_TASKS.md) and the legal-notice work)

### A3. Secondary conversions everywhere

Every page should end with a next step. Standardize three CTA blocks and add one to each page: **Apply / Ask a question** (BOFU pages), **Join an intro evening** (MOFU), **Get the programme PDF by email** (TOFU — feeds Phase I).

---

## Phase B — WordPress → New Site SEO Migration

The old site has years of history, backlinks, and indexed URLs. A naive cutover = starting SEO from zero **and** breaking the current students' portal.

Timing: **B1 and B2 are Stage 1 preparation work** — do them early, while WordPress still serves the domain. **B3 is the Stage 2 cutover itself** and only runs once everything in Stage 1 is verified.

### B1. Inventory (before touching anything)

> **✅ Sitemap inventory captured (2026-07-20):** 574 indexable URLs pulled from `/wp-sitemap.xml`
> into [seo-baseline/raw/](seo-baseline/) with a classified draft map in
> [seo-baseline/REDIRECT_MAP.md](seo-baseline/REDIRECT_MAP.md). Still pending: GSC "Pages" +
> Links exports to catch non-sitemap URLs and backlinked pages.

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

> **✅ DONE (Jul 2026):** Search Console is verified and active. Next: pull the baseline exports —
> the exact export checklist lives in [seo-baseline/README.md](seo-baseline/README.md); drop the
> files in `docs/seo-baseline/gsc/`. (Confirm the property is a *Domain* property, not URL-prefix.)

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

This turns the Drive research into actual rankings.

> ⚠️ **The table below is the original plan and is now stale** — it was written against 13 "pages"
> from the Drive sheet that don't line up with the site's actual 18 pages. **Work from
> [SEO_KEYWORD_MAP.md](SEO_KEYWORD_MAP.md) instead** — it resolves the mapping and is kept current;
> this table is left here for the original reasoning only (working titles/hooks, priority order).

### D1. Page ↔ keyword assignments (condensed from the sheet — superseded, see note above)

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

- 🔴 **Secure the `test.` subdomain (urgent, do first).** `test.transpersonal-training.com` is publicly reachable and indexed by Google — a full WordPress duplicate of the school site (`/about/`, `/apply/`, `/courses/`), 8 pages, 402 impressions, 5 clicks. It competes with the real site for the same terms and exposes an unfinished environment in search results. Fix: HTTP auth (best) or `noindex` + `Disallow: /` in its robots.txt, then a removal request in GSC. Independent of the migration.
- **Existing 404s:** GSC reports **39 URLs already returning 404** on the live site. Export them (Indicizzazione → Pagine → "Non trovata (404)") and fix or redirect them *before* cutover, so they don't get misattributed to the migration.
- **404 page:** create `src/404.html` with navigation and search-relevant links (GitHub Pages serves `/404.html` automatically).
- ~~**Canonical for syndicated posts:** the two republished articles must emit `<link rel="canonical">` to the original URLs...~~ → **DONE (Jul 2026).** Only Mario's post was actually syndicated; it now points `rel=canonical` at `mariolorenzetti.org`. Manal's two posts were original-for-this-site, so the incorrect `sourceUrl` was removed from them instead — they self-canonicalize. `base.njk` derives canonical from a post's `sourceUrl` front matter automatically, so this doesn't need repeating per post.
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
- **Teacher bios — the highest-value SEO asset on the site.** The GSC baseline shows bio pages earn **64% of all organic clicks** at positions 3–8, and carry most of the backlink profile ([BASELINE.md](seo-baseline/BASELINE.md) Findings 1 & 4). They stay consolidated on the single `/teachers/` page (Fabio's decision — old URLs 301 to `/teachers/#<id>`), so that page has to carry the weight: (a) expand each bio with credentials, publications, years of practice; (b) link each teacher's personal site and get a link back (Phase H); (c) add `Person` schema per teacher (D3) — this matters more now that there's one URL, since the schema is what tells Google the page covers 32 distinct people; (d) **write the `/teachers/` title and meta description so they can rank for personal names**, not just for "our teachers"; (e) if dedicated pages become necessary, the ranked shortlist is in [PABLO task 32](PABLO_TASKS.md) — `/pier-luigi-lattuada/` alone draws 4,850 impressions at 0.02% CTR, the single biggest untapped opportunity in the data.
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

Guest/republished posts are good for relationships and content volume, but: always add `rel=canonical` to the original (E) — automatic now, just set `sourceUrl` in front matter — and always add an author box linking their site, and keep the ratio ≥1 original : 1 syndicated.

**Correction (Jul 2026):** of the current three posts, only Mario Lorenzetti's is actually syndicated from his own site (`mariolorenzetti.org`) and carries `sourceUrl` + canonical accordingly. Manal Al-Hammadi's two posts were originally mislabeled the same way, but she wrote both directly for this blog — they're original content, not reprints, so `sourceUrl` was removed and they don't get an "Originally published on…" badge. Her author byline still links to `manalpsychotherapy.com` as a credit, independent of syndication status. Ratio today: 2 original (Manal ×2) : 1 syndicated (Mario) — already inside policy, without even counting the new Fabio-authored post (G2 item 3, now published).

### G4. Resources / Recommended Reading page

**Confirmed with Pablo (Jul 2026):** build a public "Resources" page. The old site's
`/information/` page had a 10-category recommended-reading list and a set of videos (Grof,
Campbell, the Mindells, shamanism/psychedelics documentaries). Port **some** of the old videos
as a starting point, but the list will be **refreshed** — treat the old content as a seed, not
the final selection. Long-tail SEO value (book/author queries), and cheap E-E-A-T. Place it in
the content backlog (P2), link it from the footer Resources column and relevant blog posts.

> **BUILT (Jul 2026):** data-driven page live at `/resources/` (source `src/resources.html`,
> data `src/_data/readingResources.js`), linked from the Resources nav dropdown + footer.
> Seeded with a themed starter library of ~20 recognised transpersonal classics (grouped into
> 9 categories) + a "Talks & documentaries" section with **3 live, verified video links** (Grof
> — Omega Institute; Campbell & Moyers — *Power of Myth* Ep.1; Mindell — *Process Psychology & the
> Dream Body*). Add a book/video by appending one object to the arrays in `readingResources.js`
> (no template change); a video with an empty `url` auto-shows a "Link coming" chip. **Still to
> do:** let Fabio review/refresh the book curation and add more videos from the old `/information/`
> page if wanted.

---

## Phase H — Off-Page SEO & Authority

Backlinks in this niche are won through relationships, not cold outreach.

Timing note: the domain does not change at cutover, so links pointed at `transpersonal-training.com` today keep their full value afterwards. Directory listings and partner links can start during Stage 1 if there's capacity — just link to the root domain or to paths that exist on both the old and new site.

- **EUROTAS**: ensure the school is listed on eurotas.world's accredited-schools/members pages with a followed link (likely the single most valuable backlink available — topical, authoritative, trust-transferring).
- **Teacher network:** every core and guest teacher with a website links to the school ("I teach at…"). Manal and Mario already republish content — formalize reciprocal links.
- **Directories:** EAP, national transpersonal associations, breathwork directories (e.g. breathwork alliance lists), therapy-training directories, GoodTherapy-style course listings, Psychology Today (where applicable).
- **Guest articles:** offer teachers' articles to established outlets (transpersonal journals, EUROTAS newsletter, therapy blogs) with a bio link.
- **Google Business Profile & reviews:**
  - [ ] Create the profile (education category); verify it (postcard/phone/email per Google's flow)
  - [ ] Fill in description, website link, photos, course info — even without a public campus it enables reviews and Maps presence
  - [ ] Set up a simple review-ask flow: email/WhatsApp message with a direct review link sent to each cohort within 1–2 weeks of course/seminar completion
  - [ ] Respond to every review (thanks / address concerns) — signals activity to Google and reassures prospects
  - [ ] Consider venue-tagged posts around each intensive
- **Monitor:** Ahrefs Webmaster Tools (free) quarterly for new/lost links.

---

## Backlinks & Partner Outreach

> **Shareable worksheet for collaborators.** This is the concrete companion to Phase H. The goal
> is simple: every partner institute and every teacher who has a website should link back to
> `https://transpersonal-training.com` — a plain followed link with natural anchor text like
> "I teach at Eastwest Transpersonal Training School" or "In partnership with Eastwest
> Transpersonal Training School." These topical, relationship-based links are the single most
> valuable SEO asset available to a school in this niche.
>
> **How to use this table:** for each row, (1) check whether a link to us already exists on their
> site, (2) if not, ask them to add one, (3) confirm the link is *followed* (not `rel="nofollow"`)
> and points to the homepage or a relevant page. Fill in the Status column as you go. When a
> partnership or teaching relationship is no longer current, mark it so we don't publish it on the
> Accreditation/Teachers pages.
>
> **Ready-to-send outreach copy:** email + WhatsApp templates (address people by first name) are in
> **[BACKLINK_OUTREACH_TEMPLATES.md](BACKLINK_OUTREACH_TEMPLATES.md)**.
>
> **Public showcase for the ask:** the reciprocal offer is now backed by a live, data-driven
> **Collaborations page** (`/collaborations/`, source `src/collaborations.html` +
> `src/_data/collaborations/*.md`) grouping partners into **present / past / future**. Add a
> partner by dropping one `.md` file in that folder. ⚠️ The 7 partner institutes below are seeded
> there as *present* from the old site — **confirm each is still an active partner before this page
> goes to production** (same open item as the migration doc §2.7).

### The single most valuable target

| Target | Why | Status |
|--------|-----|--------|
| **EUROTAS** (eurotas.world) | Ensure the school is listed on the accredited-schools / members pages with a **followed** link. Most authoritative, most topical link available. | ☐ confirm listing + link |

### Partner institutes (from the old site — confirm each is still active before publishing)

Pablo to confirm both **(a) still an active partner** and **(b) links back to us**. Website URLs
to be filled in during outreach.

| Institute | Location | Still active? | Links back to us? |
|-----------|----------|---------------|-------------------|
| International Institute for Consciousness Exploration & Psychotherapy | Freiburg, Germany | ☐ | ☐ |
| Transpersonal Psychotherapy School | Milan, Italy | ☐ | ☐ |
| Integral Transpersonal Institute | Milan, Italy | ☐ | ☐ |
| Inner Arts Institute | Watertown, MA, USA | ☐ | ☐ |
| School of Transpersonal Psychology & Hypnotherapy "Teadlik Mina" | Estonia | ☐ | ☐ |
| Latvian Transpersonal Education Institute | Latvia | ☐ | ☐ |
| Holos Transpersonal Training School | Romania | ☐ | ☐ |
| *(new partners not on the old list — add here)* | | ☐ | ☐ |

### Faculty with a known website (reciprocal-link asks)

These teachers already have a personal/professional site in our data — the easiest wins, since
the relationship already exists. Ask each to add "I teach at Eastwest Transpersonal Training
School" with a followed link.

| Teacher | Role | Website (from site data) | Links back to us? |
|---------|------|--------------------------|-------------------|
| Kati Wortelkamp | Head West (core) | kati-wortelkamp.de | ☐ |
| Lyudmila Skartsesku | Head East (core) | arasco.org | ☐ |
| Manal Al-Hammadi | Core | manalpsychotherapy.com | ☐ |
| Mario Lorenzetti | Guest | mariolorenzetti.org | ☐ |
| Tina Lindhard | Guest | tinalindhard.com | ☐ |
| Stefan Dressler | Guest | essence-sd.de | ☐ |
| Lilian Gscheidel | Alumni faculty | wandel-zart-und-wild.de | ☐ |

### Faculty / past collaborators without a website on file

Named on the old site and worth a backlink ask if they have a site (find URL during outreach).
This is also the list Pablo asked for, to check who links back. **Exclude Maria Kühl-Weigmann
(deceased 2023) from outreach.**

Bernadette Blin, Gabriel Fernandez-Borsot, Dr. Ingo Benjamin Jahrsetz, Prof. Jure Biechonski,
Nicolás Cambas, Rainer Pervöltz, Stephan Schillinger, Samvedam B. Randles, Pier Luigi Lattuada,
Dr. Serge Obolensky Beddington-Behrens, Dr. Kirsten E. Cameron, Vladimir Maykov, Lev Belogorodskii,
Liudmila Serbina, Cristina Revenco, Dario Giuffrida, Dennis Johnson, Erik Andersen, Cathy Geils,
Charlotte Kihl, Ingrida Indane, Rita Aguila, Lydia Maidan, Vera Covaliciuc.

### Other backlink sources (from Phase H, restated for the worksheet)

- [ ] EAP and national transpersonal associations directory listings
- [ ] Breathwork directories (breathwork alliance–style lists), therapy-training directories, GoodTherapy-style course listings
- [ ] Google Business Profile (enables reviews + Maps)
- [ ] Guest articles in transpersonal journals / EUROTAS newsletter with a bio link

---

## Phase I — Email Marketing

The single highest-ROI channel for a school with a long decision cycle (people consider a 4-year training for months). A Brevo integration plan already exists in the `gas-automation` orphan branch.

> **Scope note (Jul 2026):** the form backend is already built on Apps Script (A1), so **Brevo is not
> needed for forms** — it is needed for *email marketing*: the newsletter, the welcome sequence, the
> nurture flow, and the CleverReach list migration. The two systems connect at one point: after Apps
> Script saves a submission, it also calls Brevo's API to add the contact — only when the person
> ticked a separate marketing-consent box. Enquiry consent and marketing consent are different things
> under GDPR and must stay separate checkboxes.

> **Status (Aug 2026) — an interim auto-reply now ships; Brevo is still to do.**
>
> The funnel restructure delivered the *trigger* without the platform. `handleContact_()` in
> `docs/googlescripts/apps-script-forms.gs` now sends every enquirer an immediate auto-reply carrying the sample
> lesson and the brochure, and inviting a call. The message field became optional, so someone who
> only wants the materials no longer has to compose a question first.
>
> What that interim step deliberately does **not** do, and what Brevo is still needed for:
>
> - **No sequences.** One email, once. There is no welcome series, no nurture for people who
>   enquired and went quiet, no deadline reminders for the 2027 cohort.
> - **No list.** Contacts land in the `Contact` sheet and nowhere else. Nobody is subscribed to
>   anything, which is why the form's consent text can honestly say "we will not add you to a
>   mailing list" — that sentence has to change the day Brevo goes live.
> - **No measurement.** `MailApp` reports no opens, clicks or bounces, so the reply's effectiveness
>   is invisible. Compounded by analytics still being missing (C2).
> - **Deliverability is unauthenticated.** Mail goes out through Apps Script's quota under a Google
>   address, not through an SPF/DKIM-signed school domain. Fine for a handful of replies a day;
>   not fine for bulk.
>
> Everything in I0 below stands. Step 6 changes slightly: the Apps Script hook already has the
> contact in hand at the right moment, so wiring Brevo in is an addition to `handleContact_()`
> rather than new plumbing.
>
> **Lead-magnet gating was reversed.** I0's plan was to gate the programme PDF behind an email form.
> Both assets are now public and indexable instead — a gated PDF and a gated video produce no
> crawlable content, and `/sample-lesson/`'s transcript is the single best organic asset the site
> can offer. The accepted cost is that nobody is captured on download; the contact form is the
> capture. Reasoning in `docs/SEO_KEYWORD_MAP.md` § *Funnel restructure*.

### I0. Setup order (start here)

1. [ ] **Create the Brevo account** on the free tier (300 emails/day) with `office@transpersonal-training.com`.
2. [ ] **Authenticate the sending domain** — add Brevo's SPF, DKIM and DMARC records to
       `transpersonal-training.com` DNS. Skipping this is the main reason school newsletters land in
       spam. If DNS moves to Cloudflare for hosting (Open Decision 4), do both DNS jobs in one sitting.
3. [ ] **Create the lists:** `Newsletter`, `Applicants`, `Enquiries`, `Students`, and
       `CleverReach-import` kept separate until re-confirmed.
4. [ ] **Migrate the CleverReach list** (Jan 2024 – Jun 2026 subscribers): export from CleverReach,
       import into Brevo, then send **one re-permission email** and keep only those who click. Do not
       silently move them into the active list — the original consent was given to a different sender
       and platform, and Brevo's deliverability suffers badly on a cold imported list.
5. [ ] **Add a marketing-consent checkbox** (separate from the existing GDPR enquiry consent) to the
       homepage contact form and `/apply/`, defaulted to unticked.
6. [ ] **Extend the Apps Script** to POST the contact to Brevo when that box is ticked
       (`POST https://api.brevo.com/v3/contacts` with the API key in Script Properties, never in the
       repo — the forms endpoint is public).
7. [ ] **Add a newsletter signup block** — the site has none anywhere today. Footer + end of blog posts.
8. [ ] **Update the privacy modal** to name Brevo as a processor (see A1).

- **Platform:** Brevo (free tier: 300 emails/day, forms, automation). EU-based, GDPR-friendly.
- **Lead magnets:** ~~gate the programme PDF behind an email form~~ → **superseded (Aug 2026):
  both are public.** See the status note above.
  1. **Programme brochure PDF** — hand-designed, self-hosted at `/assets/documents/`, indexable.
     Not yet committed; `src/_data/brochure.js` hides every download CTA until it is. See
     `docs/BROCHURE.md`.
  2. **Sample lesson** — `/sample-lesson/`, an unlisted YouTube recording embedded with a full
     transcript. Recording still to be chosen; the page renders a "recording on its way" state
     until `src/content/sample-lesson/01-lesson.md` gets a `videoUrl`.
  3. **Free intro webinar recording** (after first webinar, Phase K).
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

Baselines below are **measured**, from [seo-baseline/BASELINE.md](seo-baseline/BASELINE.md)
(6 months to 2026-07-18, old WordPress site). The migration's first job is not to lose them.

| KPI | Source | Baseline (Jul 2026) | Check |
|-----|--------|---------------------|-------|
| Qualified applications / enquiries | Form backend | 0 (broken form) | Weekly |
| Organic clicks & impressions | GSC | **347 clicks / 17,448 impr** per 6 months (~58 clicks/mo) | Monthly |
| Rankings for the 10 priority keywords (D1 table) | GSC / free rank checker | **nothing ranks** — commercial terms sit at positions 50–88, zero clicks | Monthly |
| Teacher-name rankings (bio pages) | GSC | **positions 3–8, 228 clicks** = 64% of all traffic — protect at cutover | Monthly |
| Email list size & open rate | Brevo | 0 (CleverReach list to migrate) | Monthly |
| Event registrations | Form/Brevo | — | Per event |
| Indexed pages & coverage errors | GSC | **255 indexed / 531 not** (39 live 404s to clean) | Weekly for 6 weeks post-migration, then monthly |
| Referring domains | Ahrefs Webmaster Tools | **7** (all faculty/partner sites; EUROTAS not linking) | Quarterly |
| Average CTR / position | GSC | 1.99% / 12.6 | Monthly |
| Core Web Vitals (mobile) | PageSpeed Insights | — (mobile is 48% of clicks at position 7.7) | After Phase E, then quarterly |

**Cadence:** 30-minute monthly review (GSC + analytics + application count) → pick the top 3 actions for next month. Quarterly: revisit this document, update the Cluster Keywords Map statuses, re-run the competitor sheet.

---

## Open Decisions for Fabio

These block specific steps; everything else can proceed.

1. ~~**Form backend** (blocks step 4): Brevo forms vs Formspree/Tally vs embedded Google Form.~~ → **RESOLVED and BUILT (Jul 2026): Google Apps Script**, not Brevo forms. One script writes contact messages and applications into a spreadsheet and signed agreements into Drive, which keeps leads inside the Sheets workflow the office already uses and supports the file upload no generic form service offers. See Phase A1. **Brevo is still confirmed for email marketing** (Pablo) — a different job, see Phase I0. ⚠️ The existing **CleverReach** list (Jan 2024 – Jun 2026) needs an export/import plus a re-permission email before it can be mailed.
2. **Analytics tool** (blocks step 12): cookieless (Plausible/Cloudflare) vs GA4+consent banner. *Recommendation: cookieless.*
3. **Student portal fate at migration** (blocks steps 3 and 17–18): keep WordPress on a subdomain vs replace before cutover. This interacts with PABLO task 5 (lectures login) and task 10 (hosting). → **LARGELY RESOLVED (Jul 2026) by the GSC data:** the portal already runs on its own host, `student.transpersonal-training.com` (WordPress + Tutor LMS), so the cutover doesn't touch it. Remaining work is only 301-ing the ~12 legacy portal paths still on the root domain (`/login/`, `/payment/`, `/dashboard-page/`…) to their `student.` equivalents. Whether to *eventually* replace Tutor LMS with the new restricted-lectures approach is now a separate, non-blocking decision.
4. **Hosting/CDN** (blocks steps 3 and 18): GitHub Pages alone cannot do 301 redirects — put Cloudflare in front, or switch to Netlify/Cloudflare Pages? → **RECOMMENDATION (Jul 2026): move to Cloudflare Pages**, keeping the existing GitHub Actions build.

   The redirect map needs roughly **60 rules** (15 page rules + 32 bio anchors + 12 portal paths + pattern rules). That number is what decides this:

   | Option | Redirects | Verdict |
   |--------|-----------|---------|
   | **GitHub Pages alone** | none (only client-side meta-refresh hacks, which don't pass ranking signals) | ❌ not viable — this is the whole reason the decision exists |
   | **Cloudflare in front of GitHub Pages** | Bulk Redirects / Redirect Rules, but the *free* plan's allowance is small relative to 60 rules | ⚠️ workable only if we compress to pattern rules, or pay |
   | **Cloudflare Pages** | native `_redirects` file, supports far more rules than we need; free, unlimited bandwidth | ✅ **recommended** |
   | **Netlify** | native `_redirects`, equally capable and best-documented | ✅ good alternative; free tier has bandwidth/build-minute caps Cloudflare doesn't |

   **Why Cloudflare Pages specifically:** it settles three open items in one move — hosting, the 301s, and **Open Decision 2 (analytics)**, because Cloudflare Web Analytics is free and cookieless, which is exactly the privacy-consistent option Phase C recommends and keeps the "no tracking" promise in the privacy modal true. It also puts DNS, the redirects and the CDN in one place for cutover day, which matters when the change has to be fast and reversible.

   **Migration effort is small.** Keep [.github/workflows/deploy.yml](../.github/workflows/deploy.yml) exactly as it is — the Sheets fetching, the data and student-image caches, and the `repository_dispatch` rebuild trigger all keep working. Only the last step changes: instead of `peaceiris/actions-gh-pages` publishing to the `deploy` branch, run a `wrangler pages deploy _site` step. Also set `PATH_PREFIX` to `/` (it is currently `/transpersonaltraining/` for the GitHub project-site path) and add the `_redirects` file generated from [seo-baseline/REDIRECT_MAP.md](seo-baseline/REDIRECT_MAP.md). If GitHub Pages is kept for staging, nothing else needs to change.

   **Caveat to check before committing:** confirm Cloudflare Pages' free-plan build/deploy limits suit a site that rebuilds on every Sheets change, and that `student.transpersonal-training.com` (the portal, on its own host) keeps resolving correctly once DNS moves to Cloudflare — it must be left untouched.
5. **Fees transparency** (affects steps 5–6): publish fees, a range, or "on request"? *Recommendation: at least a range — it qualifies leads and is heavily searched.* → **RESOLVED (Jul 2026): publish exact prices.** €489/module (East) · €689/module (West) · €45/single lecture · single seminar on request. Now shown on Training Overview → Fees. Discounts (financial hardship, on request) and referral (one free module per new student introduced) are published too. Online payment is **not** available yet — enrolment is arranged with the office (see PABLO task 21).
6. **Who writes content** (blocks steps 15 and 21): Fabio, teachers on rotation, syndication from Manal/Mario, or a hired writer?
7. **Social ownership** (blocks steps 14 and 25): who runs Instagram/LinkedIn week to week? If nobody, defer Phase J rather than doing it badly.
8. **Language / international markets:** Add other-language sections (`/it/`, `/ru/` + hreflang) or stay English-only? *Recommendation: English-only until the cohort fills, then reassess.* → **RESOLVED (Jul 2026): English-only for now.** Confirmed by Pablo, even though the 2027–2030 cohort now has a live Russian-language Eastern track (Russian speakers will rely on browser/Google translation for the moment). A Russian landing page *may* come later but is explicitly out of scope for launch. Keep an eye on the widened audience: the Eastern track opens up Russian-language / Eastern-Europe demand that the current English-only SEO plan does not capture.
9. **Ads budget** (blocks step 27): is there any budget for a Google Ads pilot in 2026–27?

---

*Last updated: 20 July 2026*
