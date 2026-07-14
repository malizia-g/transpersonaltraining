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

Actions:
- [ ] Decide whether the site will go live via GitHub Pages or custom hosting with FTP or SFTP
- [ ] Configure the production domain `transpersonal-training.com`
- [ ] If using GitHub Pages, set the custom domain and enforce HTTPS
- [ ] If using custom hosting, add the deployment secrets and deployment step
- [ ] Run a final production deployment test before launch

Reason:
- The site cannot go live until the production hosting path is confirmed and tested

---

## P1 — Strongly Recommended Before or Around Launch

These items are not necessarily blockers for first publication, but they should be completed as part of launch hardening.

### 11. Create the default OG image

**Status:** Pending

File needed:
- `src/assets/images/og-default.jpg`

Actions:
- [ ] Create a 1200 x 630 social sharing image
- [ ] Use the final logo, title, and brand message
- [ ] Save it to the expected path so link previews work correctly

Reason:
- Without this image, social previews will be broken or low quality

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
- [ ] Install `docs/spreadsheet-automation/curriculum-pdf-apps-script.js` into the Curriculum Spreadsheet Apps Script editor
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

**29. Partner & faculty backlink outreach.**
Pablo asked for the full list of partner institutes and faculty so he can check they link back to the school. The list lives in **[MARKETING_AND_SEO.md → Backlinks & Partner Outreach](MARKETING_AND_SEO.md#backlinks--partner-outreach)**.
- [ ] Work through that list; confirm which of the 7 partner institutes are still active before any are published on the Accreditation page
- [ ] Note any *new* partner institutes to add

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
