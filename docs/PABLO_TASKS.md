# Pablo's Tasks — Website Launch Priorities

This document lists the remaining manual tasks required to put the website online.
All items are organized as launch priorities so work can be sequenced without confusion.

Priority labels:
- P0 = launch blocker, must be completed before go-live
- P1 = strongly recommended before or immediately around launch
- P2 = can happen after launch

---

## P0 — Launch Blockers

These items directly affect content accuracy, information architecture, protected content, or the ability to publish the site safely.

### 1. Review the Home page content and imagery

**Status:** Active

Actions:
- [x] Review the Home page text for tone, clarity, and accuracy
- [ ] Replace or approve the current Home page photos
- [x] Confirm that the hero message, CTA, and supporting sections match the current offer

Reason:
- The homepage is the main entry point and must reflect the final positioning before launch

---

### 2. Rename the Program page to avoid confusion with Curriculum

**Status:** Done

Actions:
- [x] Decide on a clearer name for the current Program page
- [x] Update navigation, internal links, page headings, and SEO text accordingly
- [x] Make sure the distinction between Program and Curriculum is obvious to visitors
- [ ] Check SEO

Reason:
- The current naming risks confusing users about whether they are looking at the overview or the detailed curriculum

---

### 3. Complete the Curriculum spreadsheet and use it as the source of truth

**Status:** Pending

Actions:
- [ ] Complete the Curriculum Spreadsheet with the final data
- [ ] Ensure the Curriculum page is populated from the spreadsheet data
- [ ] Test the Curriculum page after the spreadsheet is finalized
- [ ] Verify the exported structure matches the intended public presentation

Reason:
- Curriculum content must be accurate and maintainable before the site is published

---

### 4. Fix the Schedule spreadsheet and test the Schedule page

**Status:** Pending

Actions:
- [ ] Clean up the Schedule spreadsheet data structure and content
- [ ] Verify dates, labels, filters, and event grouping
- [ ] Test the Schedule page end to end after the spreadsheet update
- [ ] Confirm that the public schedule renders correctly on desktop and mobile

Reason:
- The schedule is operational content and must be reliable at launch

---

### 5. Fix the Lectures spreadsheet and define the login system

**Status:** Pending

Actions:
- [ ] Clean up the Lectures spreadsheet data and publishing flow
- [ ] Decide what lecture information is public and what requires restricted access
- [ ] Decide and approve the login approach for restricted lecture content (the previous Google OAuth plan document was discarded)
- [ ] Implement or finalize the access-control approach before publishing protected lecture content
- [ ] Test the Lectures page with the final data and access rules

Reason:
- Lecture data appears to require controlled access, so this is a launch decision, not a post-launch detail

---

### 6. Limit the Teachers page to Core Teachers only

**Status:** Pending

Actions:
- [ ] Remove guest teachers or any non-core teachers from the public Teachers page
- [ ] Review bios, ordering, and images for the remaining core faculty
- [ ] Confirm the page matches the intended public positioning
- [ ] Get the right pictures from the teachers

Reason:
- The faculty page must reflect the final public-facing teaching team

---

### 7. Revise the Transpersonal Therapy page

**Status:** Pending

Actions:
- [ ] Review and rewrite the page text where needed
- [ ] Fix all internal and external links
- [ ] Confirm the page aligns with the overall message of the website

Reason:
- Weak copy or broken links on core explanatory pages reduce trust at launch

---

### 8. Finalize the Become a Client Model page

**Status:** Pending

Actions:
- [ ] Collect the relevant information from the current students
- [ ] Rewrite and structure the page text using the confirmed data
- [ ] Check that the page clearly explains the process, expectations, and value

Reason:
- This page depends on real operational information and should not go live with placeholder or incomplete details

---

### 9. Review the Techniques page

**Status:** Pending

Actions:
- [x] Define the full page structure
- [x] Prepare the content for all techniques presented
- [ ] Review the page copy, images, and technique descriptions for accuracy
- [ ] Test the page as a complete deliverable

Reason:
- The page has already been built (structure, copy, and imagery are in place), but it still needs Pablo's review before launch

---

### 10. Choose and finalize the production deployment path

**Status:** Pending

**Recommendation added July 2026: Cloudflare Pages.** The SEO migration needs ~60 real 301 redirects and GitHub Pages cannot serve any. Full comparison and rationale in [MARKETING_AND_SEO.md → Open Decisions #4](MARKETING_AND_SEO.md#open-decisions-for-fabio). Short version: Cloudflare Pages gives native `_redirects`, is free with unlimited bandwidth, and also provides free cookieless analytics (settling the analytics decision too). The existing GitHub Actions build is kept — only the final publish step changes to `wrangler pages deploy`.

Actions:
- [ ] Decide the hosting path (recommended: Cloudflare Pages; alternative: Netlify)
- [ ] Configure the production domain `transpersonal-training.com` and enforce HTTPS
- [ ] Swap the deploy step in `.github/workflows/deploy.yml` and set `PATH_PREFIX` to `/`
- [ ] Add the `_redirects` file generated from [seo-baseline/REDIRECT_MAP.md](seo-baseline/REDIRECT_MAP.md)
- [ ] Verify `student.transpersonal-training.com` still resolves after any DNS change
- [ ] Run a final production deployment test before launch

Reason:
- The site cannot go live until the production hosting path is confirmed and tested
- The hosting choice is now the *only* remaining blocker on the 301 redirect map

---

## P1 — Strongly Recommended Before or Around Launch

These items are not necessarily blockers for first publication, but they should be completed as part of launch hardening.

### 11. Create the default OG image

**Status:** Done (2026-08-24)

File:
- `src/assets/images/Graphics/og-default.jpg`

Actions:
- [x] Create a 1200 x 630 social sharing image
- [x] Use the final logo, title, and brand message
- [x] Save it to the expected path so link previews work correctly

---

### 12. Review all page meta descriptions

**Status:** Review recommended

Actions:
- [ ] Review page descriptions for clarity, search intent, and tone of voice
- [ ] Update any copy that does not match the final messaging
- [ ] Re-check key pages after renaming or restructuring content

Reason:
- Final SEO copy should match the real public offer at launch

---

### 13. Set up Google Search Console

**Status:** Pending when domain is ready

Actions:
- [ ] Add the production domain to Google Search Console
- [ ] Verify ownership
- [ ] Submit the sitemap after the live site is online

Reason:
- This helps search indexing and gives visibility into launch issues

---

### 14. Re-add the production CNAME if needed

**Status:** Pending

Actions:
- [ ] Re-add `src/CNAME` with `transpersonal-training.com` before the final production merge if GitHub Pages is used
- [ ] Skip this if the final hosting path does not use GitHub Pages

Reason:
- The domain configuration must match the chosen deployment method

---

### 15. Decide what to do with the experimental TESTS pages

**Status:** Decision needed

Actions:
- [ ] Review the HTML files in `TESTS/`
- [ ] Decide whether each one should be kept, migrated, or deleted
- [ ] Remove anything that should not be part of the project long term

Reason:
- The repository should be clean before launch and not contain misleading legacy experiments

---

## P2 — Post-Launch Improvements

These items are valuable, but they do not need to block the first public release unless strategy changes.

### 16. Create an article editing workflow

**Status:** Pending

Actions:
- [ ] Define how new blog articles should be drafted, reviewed, and published
- [ ] Decide whether Google Docs is sufficient or whether a backend or CMS is needed
- [ ] Compare editorial simplicity, permissions, and maintenance cost before choosing

Reason:
- This is important for content operations, but it can be finalized after the site is live if the current article volume is low

---

### 17. Add Google Analytics if needed

**Status:** Optional

Actions:
- [ ] Create a GA4 property
- [ ] Add the measurement code to the site
- [ ] Confirm that tracking is compliant with the preferred privacy approach

Reason:
- Useful for measurement, but not required to publish the website

---

### 18. Set up the Google Apps Script rebuild button

**Status:** Pending

Actions:
- [ ] Create a GitHub Personal Access Token for rebuild triggers
- [ ] Add the rebuild action to the spreadsheet Apps Script
- [ ] Test that a spreadsheet-side rebuild can update the site safely

Reason:
- Helpful for operations, but not essential for the first release

---

### 19. Finish the PDF exporter

**Status:** Pending

Actions:
- [ ] Install `docs/googlescripts/curriculum-pdf-apps-script.js` into the Curriculum Spreadsheet Apps Script editor
- [ ] Test both PDF outputs
- [ ] Adjust styling and exported content as needed

Reason:
- Useful for admin workflow, but not required for the public website to launch

---

## New tasks from old-site content integration (July 2026)

These came out of the old-site → new-site content review ([OLD_SITE_CONTENT_MIGRATION.md](OLD_SITE_CONTENT_MIGRATION.md)) and Pablo's answers. Everything that was *clear* has already been applied to the site on branch `old-website-info-integrations`; the items below are the ones that still need a decision, an account, or external action.

### P0 — Blockers created/confirmed by the review

**20. Choose and finalize the single legal entity + GDPR details.**
Pablo confirmed there will be **one** entity (do not name multiple). As a placeholder the site now uses "Eastwest Transpersonal Training School" in the footer and as the GDPR data controller in the privacy modal.
- [ ] Confirm the definitive registered legal name
- [ ] Add registered address (at least city/country) and any registration number to the privacy modal
- [ ] Update the footer + privacy modal once confirmed
Reason: the privacy policy names a data controller for GDPR — it must be the real legal entity.

**21. Decide the payment method.**
Pablo: online payment is **not** available for now (old Stripe checkout dropped). The site currently says enrolment/payment is arranged directly with the office.
- [ ] Decide the future payment processor (Stripe or other)
- [ ] Until then, keep the "arranged with the office" wording (Training Overview → Fees)

**31. Secure the `test.transpersonal-training.com` subdomain — live SEO damage, fix this week.**
Search Console (July 2026) shows `test.transpersonal-training.com` is publicly reachable and **indexed by Google**: a full WordPress duplicate of the school site (`/about/`, `/apply/`, `/courses/`), 8 pages, 402 impressions, 5 clicks. It competes with the real site for the same searches and exposes an unfinished environment in results. This is unrelated to the migration — it is costing us now.
- [ ] Put it behind HTTP authentication (best), or add `noindex` + `Disallow: /` to its robots.txt
- [ ] Submit a removal request in Search Console once blocked
- [ ] Confirm whether it is still needed at all — if not, take it down
Reason: duplicate content on an indexed staging copy dilutes the real site and can surface half-finished pages to prospective students. See [seo-baseline/BASELINE.md](seo-baseline/BASELINE.md) Finding 3.

**22. "Psychotherapist" title — copy audit.**
Pablo flagged that "psychotherapist" is a legally protected title in some countries and the school is only *working toward* EAP compliance. A caveat is now shown on the Curriculum and Training Overview pages.
- [ ] Audit existing copy that implies graduates become "psychotherapists" (e.g. homepage welcome text, JSON-LD `occupationalCategory`) and soften where needed for legal safety.

### P1 — Accounts & channels to create, then wire up

**23. Create and link social/newsletter channels.**
Facebook already exists and is now linked (footer + homepage + JSON-LD `sameAs`). Still to create:
- [ ] Instagram account → add to footer + homepage + JSON-LD `sameAs`
- [ ] Substack → add to footer + relevant CTAs
- [ ] WhatsApp and/or Telegram contact (Telegram is important for Russian-speaking Eastern applicants) → add to contact section + footer

**24. Choose the Eastern in-person venue.**
The Venues page now has an "Eastern track venue — coming soon" section (placeholder, no photos).
- [ ] Confirm the Eastern venue (city/country)
- [ ] Replace the "coming soon" placeholder with real copy + photos (new shot-list item)

**25. Build the `/apply/` page (with East/West selector).**
Pablo wants applicants to choose "Apply for West" or "Apply for East." The homepage contact form now has a West/East track selector as an interim measure.
- [ ] Build a dedicated `/apply/` page with the track choice, the full enrolment-options matrix, fees, and the process/timeline (see Marketing plan Phase A2)
- [ ] Confirm the definitive enrolment-options list (full training / self-development L1 only / single lecture €45 / single seminar on request — identical East & West)

**26. Provide official certificate wording (optional but useful).**
Pablo: no exact official title yet ("is it important?"). It is not a blocker, but a fixed wording lets us use `educationalCredentialAwarded` verbatim in schema and keep page copy consistent.
- [ ] If/when the exact certificate titles are fixed, send them so the Curriculum/Training Overview copy and the homepage JSON-LD can match.

**27. Build the Accreditation page (EUROTAS).**
The current official EUROTAS PDF was located during the review:
`https://eurotas.world/wp-content/uploads/2021/08/General-Criteria-for-ESTP-Certification.pdf`
(landing page: `https://eurotas.world/eurotas-certifications-for-professionals/`).
- [ ] Build the Accreditation page (Marketing Phase F) linking this PDF, explaining TREE membership (still accurate per Pablo), and restating the per-level breathwork requirement.

**30. Load the Recommended Reading page from a spreadsheet.**
The `/resources/` Recommended Reading & Watching page (books + videos) currently pulls from a static data file (`src/_data/readingResources.js`).
- [ ] Create a Recommended Reading spreadsheet (same fields as the current data file: category, title, author, note, url for books; title, source, note, url for videos)
- [ ] Wire the page to build from the spreadsheet, following the same source-of-truth pattern as Curriculum/Schedule/Lectures
- [ ] Test the page after the spreadsheet is finalized
Reason: keeps the reading/watching list editable by Pablo without a code change, consistent with how other dynamic content is managed.

### P2 — After launch / dependent on hosting

**28. Set up 301 redirects for old East URLs.**
- [ ] `/program/`, `/archive-2021/`…`/archive-2025/` and the Russian-language event pages → map to the new integrated-programme page / `/schedule/` / homepage (depends on the hosting decision, task 10 + Marketing open decision #4).

**35. Update the Teachers page content.**
Flagged by Fabio during the SEO keyword pass (July 2026). The page's meta description now names five teachers, because teacher-name searches are **64% of all organic clicks** and after the migration this one page absorbs all 32 old bio URLs — so who is named there directly affects what the page is found for. Currently named: Jure Biechonski, Manal Al-Hammadi, Lyudmila Skartsesku, Kati Wortelkamp, Stefan Dressler.
- [ ] Review and update the roster itself: who is still current core / guest / alumni faculty
- [ ] Confirm the five names in the meta description are the right ones to lead with (`src/teachers.html`)
- [ ] ⚠️ **Pier Luigi Lattuada was removed at Fabio's request.** Worth a conscious decision: his old bio page draws **4,850 impressions**, by far the highest search demand of any name on the site. If he is still associated with the school, leaving him out forfeits that. If he is not, removing him is correct — but then also check he is not still listed elsewhere on the site.
- [ ] Two names needing a status decision regardless: **Maria Kuehl-Weigmann** (deceased 2023 — keep the memorial bio, exclude from outreach) and **Samvedam B. Randles** / **Cristina Revenco**, both listed as alumni faculty but drawing 12 and 11 clicks
Reason: see [SEO_KEYWORD_MAP.md](SEO_KEYWORD_MAP.md) and [seo-baseline/BASELINE.md](seo-baseline/BASELINE.md) Finding 1.

**36. Update the Venues page.**
Flagged by Fabio during the same pass. The page title was shortened to plain "Training Venues" because the venue list is incomplete — the Eastern-track venue is still a "coming soon" placeholder (task 24).
- [ ] Confirm the Eastern venue and replace the placeholder with real copy and photos
- [ ] ⚠️ Once the list is complete, consider putting the countries back in the title (e.g. "Training Venues in Germany & Italy"). Place names carry real search intent for people looking for a breathwork retreat near them; the short title gives that up.
- [ ] Confirm reuse rights for the Monteverdi photos before production (they are third-party, from grimaldisavelli.com)

**33. Portal SEO hygiene — `student.transpersonal-training.com` is leaking into Google.**
Found while analysing the Search Console 404 export (July 2026). The portal has **76 pages drawing search impressions**, much of it material that should not be indexed at all. It doesn't earn traffic, it dilutes the domain's topical signal, it wastes crawl budget (a large share of the 378 "crawled, not indexed" pages), and it exposes student-only material publicly.
- [ ] `noindex` the student-only areas: lesson pages, quizzes, `/dashboard/`, `/classroom/`, instructor profiles
- [ ] Delete or `noindex` the leftover **EduBlink theme demo content** — `/category/web-development/`, `/child-education/`, `/software/`, `/component/testimonials/`, `/component/features/`, `/purchase-guide/`, plus the cooking/nutrition/sales filler posts (most already 404, some still live)
- [ ] Purge trashed content that is still crawlable (e.g. a course URL ending in `__trashed`)
- [ ] Clean up duplicate WooCommerce course products (`…-copy-3`, `…-copy-5`, `…-copy-6` of the same course)
- [ ] Decide whether the WooCommerce product catalogue should be indexed at all, given online payment is currently disabled (task 21)
Reason: see [seo-baseline/BASELINE.md](seo-baseline/BASELINE.md) Finding 6. Note this also compounds the Lattuada CTR problem in task 32 — his portal instructor profile pulls 829 impressions with zero clicks *on top of* the 4,850 on his main-site bio, so name searches hit two of our pages and convert on neither.

**34. Recover the missing West Program 2026 PDF.**
Search Console shows both upload paths returning 404, while the `/program-2026/` page itself is live:
`/wp-content/uploads/2025/09/West_Program_26.pdf` and `/wp-content/uploads/2025/10/West_Program_26.pdf`.
- [ ] Find the file and republish it
- [ ] 301 both old paths to the new location
Reason: a programme brochure is exactly the lead magnet the marketing plan wants to gate behind an email form (Phase I). Worth recovering rather than redirecting away.

**32. Dedicated pages for the highest-traffic teachers — insurance policy, decide 4–6 weeks after cutover.**

**Decision taken (Fabio, July 2026):** do *not* build a page for every teacher. All 32 old bio URLs
301 to the single `/teachers/` page (anchored per teacher — already implemented, see
[seo-baseline/REDIRECT_MAP.md](seo-baseline/REDIRECT_MAP.md) §2).

**Why this task exists anyway:** teacher bio pages are **64% of the old site's organic clicks**
(228 of 347) and rank in positions 3–8 for teacher-name searches. One page cannot rank well for 32
different personal names at once, so some loss is expected. If Search Console shows the loss is
material, the fix is to give *a few* teachers their own page — not all of them.

- [ ] 4–6 weeks after cutover, check GSC: are teacher-name queries still bringing ~200 clicks per 6 months?
- [ ] If clicks dropped materially, build dedicated pages for the shortlist below only

**Shortlist, ranked by measured search demand** (clicks / impressions / avg. position over 6 months to 2026-07-18, from [seo-baseline/BASELINE.md](seo-baseline/BASELINE.md)) — note "most famous" here means *most searched*, which is not the same as most senior:

| # | Teacher | Clicks | Impressions | Position | Section on new site | Why |
|---|---------|--------|-------------|----------|---------------------|-----|
| 1 | **Pier Luigi Lattuada** | 1 | **4,850** | 7.6 | alumni | **Biggest opportunity on the site.** Enormous search demand, ranking already good, but 0.02% CTR — people search him, see us, click elsewhere. A real page with a proper title/description could convert a large share of those 4,850 monthly-ish impressions. |
| 2 | **Prof. Jure Biechonski** | **26** | 813 | 5.0 | guest | Highest actual click earner |
| 3 | **Manal Al-Hammadi** | **25** | 578 | 8.0 | core | Second highest; core teacher; has her own site (reciprocal-link partner) |
| 4 | Stephan Schillinger | 12 | 528 | 6.0 | guest | High impressions + 2 backlinks |
| 5 | Stefan Dressler | 10 | 469 | 8.1 | guest | High impressions + 2 backlinks; own site (essence-sd.de) |
| 6 | Dr. Kirsten E. Cameron | 9 | 413 | 9.1 | alumni | High impressions, weakest position of the top group |
| 7 | Vladimir Maykov | 5 | 308 | 7.2 | alumni | Strong Russian-language demand (Eastern track) |
| 8 | Tina Lindhard | 2 | 277 | 7.1 | guest | 277 impressions but only 2 clicks — CTR problem like Lattuada |
| 9 | Dr. Ingo Benjamin Jahrsetz | 13 | 181 | 5.5 | guest | Strong clicks; has a backlink |
| 10 | Gabriel Fernandez-Borsot | 13 | 210 | 6.3 | guest | Strong clicks |

If only three are built, build **Lattuada, Biechonski, Al-Hammadi** — Lattuada for the untapped
impressions, the other two because they are the actual traffic.

⚠️ Note two names in the wider data that need a decision regardless: **Maria Kuehl-Weigmann**
(7 clicks — deceased 2023, keep the memorial bio but exclude from outreach) and **Samvedam B. Randles**
/ **Cristina Revenco** (12 and 11 clicks, both listed as alumni faculty) — confirm they should stay on
the page at all.

**29. Partner & faculty backlink outreach.**
Pablo asked for the full list of partner institutes and faculty so he can check they link back to the school. The list lives in **[MARKETING_AND_SEO.md → Backlinks & Partner Outreach](MARKETING_AND_SEO.md#backlinks--partner-outreach)**.
- [ ] Work through that list; confirm which of the 7 partner institutes are still active before any are published on the Accreditation page
- [ ] Note any *new* partner institutes to add

**37. Rewrite the "Hero's Journey" blog article draft.**
Fabio wrote a full first draft of [src/blog/the-heros-journey-in-transpersonal-work.md](../src/blog/the-heros-journey-in-transpersonal-work.md) (Claude had only left an outline with bracketed placeholders before). Author is set to Fabio Malizia; date is 2026-07-20.
- [ ] Pablo to read and rewrite/edit the draft in his own voice before publish
- [ ] Check the "Level 1 / Level 2 / Level 3 → Call / Ordeal / Return" mapping still holds once Curriculum content (task 3) is finalized
- [ ] Confirm the "Further Reading" book list is one Pablo is happy to put the school's name behind

---

## Already Completed in the Codebase

These items have already been handled and do not need further action unless requirements change.

- Deploy workflow branch configuration updated
- Legacy root files cleaned up
- Old `schedule.js` removed in favor of `schedule-ssr.js`
- CSS consolidated into `main.css`
- Cache fallback added to data fetchers
- Daily rebuild cron and webhook trigger added
- Documentation consolidated into `docs/`

---

## Recommended Launch Order

1. Finalize page content decisions: Home, Program naming, Teachers, Transpersonal Therapy, Become a Client Model, Techniques
2. Finalize spreadsheet data sources: Curriculum, Schedule, Lectures
3. Approve and implement the lecture login and access approach
4. Choose the production hosting path and test deployment
5. Add launch assets and SEO basics: OG image, meta review, Search Console
6. Publish the site
7. Tackle editorial workflow, rebuild tooling, analytics, and PDF automation after launch

---

## Go-Live Checklist

### P0
- [ ] Review the Home page text and photos
- [ ] Rename the Program page to reduce confusion with Curriculum
- [ ] Complete the Curriculum Spreadsheet
- [ ] Confirm the Curriculum page is driven by spreadsheet data
- [ ] Fix the Schedule spreadsheet
- [ ] Test the Schedule page
- [ ] Fix the Lectures spreadsheet
- [ ] Approve the login system for lecture content
- [ ] Test the Lectures page and access rules
- [ ] Limit the Teachers page to Core Teachers only
- [ ] Revise the Transpersonal Therapy text and links
- [ ] Collect current student information for Become a Client Model
- [ ] Finalize the Become a Client Model text
- [ ] Review the Techniques page (copy, images, technique descriptions)
- [ ] Choose the production deployment path
- [ ] Configure the production domain
- [ ] Run a final production deployment test

### P1
- [ ] Create the default OG image
- [ ] Review meta descriptions after content decisions are final
- [ ] Set up Google Search Console
- [ ] Re-add `src/CNAME` if GitHub Pages is the final host
- [ ] Decide what to do with the `TESTS/` pages

### P2
- [ ] Decide on the article editing workflow: Google Docs vs backend or CMS
- [ ] Add Google Analytics if needed
- [ ] Set up the spreadsheet rebuild button
- [ ] Finish and test the PDF exporter
