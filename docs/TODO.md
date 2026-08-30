# TODO — everything still to be done

**This is the single list.** Anything that is open, undecided, or waiting on someone is
here. If a task is not in this file, nobody is tracking it.

What this file does *not* hold, on purpose:

| Elsewhere | Why it stays there |
|---|---|
| **Reasoning and evidence** behind a task | The hosting comparison, the Search Console findings, the teacher-traffic shortlist, the fee conflicts — each task links to its own analysis. Facts age slowly; task status changes weekly. Keeping them apart is what stops this list going stale |
| [FUTURE_IDEAS.md](FUTURE_IDEAS.md) | A backlog of *proposals* — CMS options, Google Docs pipeline, linting. Nothing there has been decided, so nothing there is owed to anyone |
| [MARKETING_AND_SEO.md § Master Step List](MARKETING_AND_SEO.md#3-master-step-list--prepare-everything-then-flip-the-switch) | The *sequence* — which phase, what effort, what depends on what. It says in which order to work; this file says what is left |

Task numbers are stable and are referenced from the other documents (`TODO.md#task-33`).
They are never reused.

*Replaces `PABLO_TASKS.md`, which was absorbed here on 30 August 2026 along with the open
items from `MARKETING_AND_SEO.md`, `seo-baseline/BASELINE.md`, `seo-baseline/README.md`,
`seo-baseline/REDIRECT_MAP.md`, `SEO_KEYWORD_MAP.md`, `OLD_SITE_CONTENT_MIGRATION.md`,
`BROCHURE.md`, `CONTENT_EDITING.md` and `DOCUMENTATION.md`.*

---

## The one blocker

Everything in §6 and roughly a third of §4 waits on **[task 10 — the hosting decision](#task-10)**.
Nothing else in this file blocks the launch by itself. `PABLO_TASKS` used to say it plainly:
*"the site cannot go live until the production hosting path is confirmed."* That is still true.

**Order of work:** §2 now (it costs us today, whatever happens next) → §1 decisions →
§3 and §4 in parallel → §5 → §6 on cutover day → §7 after.

---

## §1 — Decisions waiting on Fabio or Pablo

Each one blocks work that cannot sensibly start without it.

<a id="task-10"></a>
### 10. Production hosting path — **the blocker**

**Recommendation (Jul 2026): Cloudflare Pages.** The migration needs ~60 real 301 redirects and
GitHub Pages can serve none. Cloudflare Pages gives native `_redirects`, is free with unlimited
bandwidth, and settles task 17 too (free cookieless analytics). The existing GitHub Actions build
is kept — only the final publish step changes to `wrangler pages deploy`.

- [ ] Decide the hosting path (recommended: Cloudflare Pages; alternative: Netlify)
- [ ] Configure `transpersonal-training.com` and enforce HTTPS
- [ ] Swap the deploy step in [.github/workflows/deploy.yml](../.github/workflows/deploy.yml), set `PATH_PREFIX` to `/`
- [ ] Add the `_redirects` file generated from [REDIRECT_MAP.md](seo-baseline/REDIRECT_MAP.md)
- [ ] Verify `student.transpersonal-training.com` still resolves after the DNS change — it must be left untouched
- [ ] Confirm the free plan's build limits suit a site that rebuilds on every Sheets change
- [ ] Run a final production deployment test

→ Full comparison table and rationale: [MARKETING_AND_SEO.md § Hosting](MARKETING_AND_SEO.md#decision-4--hostingcdn)

<a id="task-20"></a>
### 20. The single legal entity + GDPR details

Pablo confirmed there will be **one** entity. The site currently uses "Eastwest Transpersonal
Training School" as a placeholder in the footer and as the GDPR data controller in the privacy modal.

- [ ] Confirm the definitive registered legal name
- [ ] Add registered address (at least city/country) and any registration number
- [ ] Update the footer + privacy modal once confirmed

Why: the privacy policy names a data controller for GDPR — it must be the real legal entity.
→ [OLD_SITE_CONTENT_MIGRATION.md § G](OLD_SITE_CONTENT_MIGRATION.md#g-legal-identity-unblocks-26) (answers to Q28–30: *"TO_BE defined"*)

<a id="task-21"></a>
### 21. Payment method

Online payment is **not** available for now — the old Stripe checkout was dropped. The site says
enrolment is arranged directly with the office.

- [ ] Decide the future payment processor (Stripe or other)
- [ ] Until then, keep the "arranged with the office" wording on Training Overview → Fees

<a id="task-5"></a>
### 5. Lectures spreadsheet + the login system

- [ ] Clean up the Lectures spreadsheet data and publishing flow
- [ ] Decide what lecture information is public and what requires restricted access
- [ ] Decide and approve the login approach (the previous Google OAuth plan was discarded)
- [ ] Implement the access-control approach before publishing protected content
- [ ] Test the Lectures page with the final data and access rules

Why: lecture data appears to require controlled access, which makes it a launch decision, not a detail.
Interacts with task 10 and with the portal's fate on `student.`

<a id="task-15"></a>
### 15. What to do with the experimental `TESTS/` pages

- [ ] Review the HTML files in `TESTS/`
- [ ] Decide per file: keep, migrate, or delete

Why: the repository should not ship misleading legacy experiments.

<a id="task-17"></a>
### 17. Analytics — pick the tool, then wire it up

The choice is cookieless (Plausible / Cloudflare Web Analytics) vs GA4 with a consent banner.
**Recommendation: cookieless** — it is the only option that keeps the "no tracking" promise in the
privacy modal true, and it comes free if task 10 lands on Cloudflare Pages.

- [ ] Decide the tool
- [ ] Add it to the build
- [ ] Define conversion events from day one (application started/submitted, PDF download, newsletter signup)

⚠️ Related, unresolved: the privacy modal still claims no data is gathered while Google Fonts and
unpkg load from third-party CDNs. Self-hosting them is [task 48](#task-48).

<a id="task-41"></a>
### 41. The `/training-overview/` URL

`WEBSITE_CONTENT.md` proposes `/holistic_Therapy_for_self_development` ("this is good for seo").
The instinct is right — `/training-overview/` contains no keyword — but that form uses underscores
and capitals, against URL conventions. The site is not live, so a change is cheap now and expensive later.

- [ ] Decide: keep `/training-overview/`, or move to `/transpersonal-psychotherapy-training/`
- [ ] If moved, update the matching row in [REDIRECT_MAP.md](seo-baseline/REDIRECT_MAP.md)

<a id="task-42"></a>
### 42. The Hero's Journey post — title and URL

`hero journey` is 3,600/mo at difficulty 19, the biggest volume in the whole keyword research.
The post shipped as `/blog/the-heros-journey-in-transpersonal-work/` rather than the
`/blog/the-heros-journey/` the map specified, so the exact phrase no longer leads the title.

- [ ] Decide: retitle/rename for the exact-match benefit, or accept the softer match as final

<a id="task-26"></a>
### 26. Official certificate wording — optional but useful

Pablo: no exact official title yet (*"is it important?"*). Not a blocker, but fixed wording lets us
use `educationalCredentialAwarded` verbatim in schema and keeps page copy consistent.

- [ ] If/when the exact certificate titles are fixed, send them

<a id="task-55"></a>
### 55. Who writes the content?

Blocks the blog cadence (Phase G) and the email sequences (Phase I).

- [ ] Decide: Fabio, teachers on rotation, syndication from Manal/Mario, or a hired writer

<a id="task-56"></a>
### 56. Who owns social, week to week?

- [ ] Decide. If nobody, defer Phase J rather than doing it badly

<a id="task-57"></a>
### 57. Any budget for a Google Ads pilot in 2026–27?

- [ ] Decide (blocks Phase L only — optional throughout)

---

## §2 — Costing us today, independent of the launch

These are live problems on the current WordPress estate. None of them waits on task 10.

<a id="task-31"></a>
### 31. Secure `test.transpersonal-training.com` — **do this week**

Search Console (July 2026) shows it publicly reachable and **indexed**: a full WordPress duplicate
of the school site, 8 pages, 402 impressions, 5 clicks. It competes with the real site for the same
searches and exposes an unfinished environment in results.

- [ ] Put it behind HTTP authentication (best), or add `noindex` + `Disallow: /` to its robots.txt
- [ ] Submit a removal request in Search Console once blocked
- [ ] Confirm whether it is needed at all — if not, take it down

→ [BASELINE.md Finding 3](seo-baseline/BASELINE.md#finding-3--two-subdomains-nobody-accounted-for)

<a id="task-33"></a>
### 33. Portal SEO hygiene — `student.` is leaking into Google

**76 pages** drawing search impressions, much of it material that should never be indexed. It earns
no traffic, dilutes the domain's topical signal, wastes crawl budget, and exposes student-only material.

- [ ] `noindex` the student-only areas: lesson pages, quizzes, `/dashboard/`, `/classroom/`, instructor profiles
- [ ] Delete or `noindex` the leftover **EduBlink theme demo content** — `/category/web-development/`, `/child-education/`, `/software/`, `/component/testimonials/`, `/component/features/`, `/purchase-guide/`, plus the cooking/nutrition/sales filler posts
- [ ] Purge trashed content still crawlable (a course URL ending in `__trashed`)
- [ ] Clean up duplicate WooCommerce course products (`…-copy-3`, `-copy-5`, `-copy-6` of the same course)
- [ ] Decide whether the WooCommerce catalogue should be indexed at all, given payment is disabled ([task 21](#task-21))

→ [BASELINE.md Finding 6](seo-baseline/BASELINE.md#the-real-problem-the-drilldown-revealed-the-portal-is-leaking-into-google). Note this compounds
[task 32](#task-32): Lattuada's portal instructor profile pulls 829 impressions with zero clicks
*on top of* the 4,850 on his main-site bio, so name searches hit two of our pages and convert on neither.

<a id="task-34"></a>
### 34. Recover the missing West Program 2026 PDF

Both upload paths 404 while `/program-2026/` itself is live:
`/wp-content/uploads/2025/09/West_Program_26.pdf` and `…/2025/10/West_Program_26.pdf`.

- [ ] Find the file and republish it
- [ ] 301 both old paths to the new location

Why: a programme brochure is exactly the lead magnet Phase I wants to gate behind an email form —
worth recovering rather than redirecting away. See also [task 44](#task-44).

<a id="task-22"></a>
### 22. "Psychotherapist" — copy audit

"Psychotherapist" is a legally protected title in some countries and the school is only *working
toward* EAP compliance. A caveat now appears on Curriculum and Training Overview, and `/legal-notice/`
is linked with an asterisk from the home and Apply heroes.

- [ ] Audit remaining copy that implies graduates become "psychotherapists" — homepage welcome text,
      JSON-LD `occupationalCategory` — and soften where needed

---

## §3 — Before launch: content and data

<a id="task-1"></a>
### 1. Home page content and imagery

- [x] Review the text for tone, clarity and accuracy
- [x] Confirm the hero message, CTA and supporting sections match the current offer
- [ ] Replace or approve the current Home page photos

<a id="task-3"></a>
### 3. Curriculum spreadsheet as the source of truth

- [ ] Complete the Curriculum spreadsheet with the final data
- [ ] Ensure the Curriculum page is populated from it
- [ ] Test the page after the spreadsheet is finalised
- [ ] Verify the exported structure matches the intended public presentation

<a id="task-4"></a>
### 4. Schedule spreadsheet and page

- [ ] Clean up the Schedule spreadsheet structure and content
- [ ] Verify dates, labels, filters and event grouping
- [ ] Test the Schedule page end to end
- [ ] Confirm it renders correctly on desktop and mobile

<a id="task-6"></a>
### 6. Teachers page — core teachers only

- [ ] Remove guest and non-core teachers from the public page
- [ ] Review bios, ordering and images for the remaining core faculty
- [ ] Get the right pictures from the teachers

<a id="task-7"></a>
### 7. Transpersonal Therapy page

- [ ] Review and rewrite the text where needed
- [ ] Fix all internal and external links
- [ ] Confirm it aligns with the overall message of the site

<a id="task-8"></a>
### 8. Become a Practice Client page

- [ ] Collect the relevant information from current students
- [ ] Rewrite and structure the text using the confirmed data
- [ ] Check it explains the process, expectations and value clearly

Why: the page depends on real operational information and should not launch with placeholders.

<a id="task-9"></a>
### 9. School Pillars page (formerly Techniques) — Pablo's review

- [x] Define the full page structure
- [x] Prepare the content for all techniques presented
- [ ] Review copy, images and technique descriptions for accuracy
- [ ] Test the page as a complete deliverable

<a id="task-12"></a>
### 12. Meta descriptions — final pass

- [ ] Review page descriptions for clarity, search intent and tone
- [ ] Update any copy that no longer matches the final messaging
- [ ] Re-check key pages after renaming or restructuring

Do this *after* the content decisions above are settled, not before.

<a id="task-24"></a>
### 24. The Eastern in-person venue

The Venues page currently carries an "Eastern track venue — coming soon" placeholder, no photos.

- [ ] Confirm the Eastern venue (city/country)
- [ ] Replace the placeholder with real copy and photos

<a id="task-25"></a>
### 25. `/apply/` page — the East/West selector

The page is built (details → generated enrolment agreement → signed-copy upload) and the homepage
contact form has a West/East track selector as an interim measure.

- [ ] Add the track choice to `/apply/` itself, with the full enrolment-options matrix, fees and timeline
- [ ] Confirm the definitive enrolment-options list (full training / self-development L1 only /
      single lecture €45 / single seminar on request — identical East & West)

<a id="task-35"></a>
### 35. Teachers page — the roster itself

The meta description names five teachers, because teacher-name searches are **64% of all organic
clicks** and after the migration this one page absorbs all 32 old bio URLs. Who is named there
directly affects what the page is found for. Currently: Jure Biechonski, Manal Al-Hammadi,
Lyudmila Skartsesku, Kati Wortelkamp, Stefan Dressler.

- [ ] Review the roster: who is current core / guest / alumni faculty
- [ ] Confirm those five names are the right ones to lead with (`src/teachers.html`)
- [ ] ⚠️ **Pier Luigi Lattuada was removed at Fabio's request.** Worth a conscious decision: his old
      bio draws **4,850 impressions**, by far the highest search demand of any name on the site. If he
      is still associated with the school, leaving him out forfeits that. If not, removing him is
      correct — but check he is not still listed elsewhere
- [ ] Two names needing a status decision regardless: **Maria Kuehl-Weigmann** (deceased 2023 — keep
      the memorial bio, exclude from outreach) and **Samvedam B. Randles** / **Cristina Revenco**,
      both listed as alumni faculty, drawing 12 and 11 clicks

→ [SEO_KEYWORD_MAP.md](SEO_KEYWORD_MAP.md) and [BASELINE.md Finding 1](seo-baseline/BASELINE.md#finding-1--the-sites-entire-organic-footprint-is-teacher-name-reputation-traffic)

<a id="task-36"></a>
### 36. Venues page

- [ ] Confirm the Eastern venue and replace the placeholder ([task 24](#task-24))
- [ ] ⚠️ Once the list is complete, consider putting the countries back in the title
      (e.g. "Training Venues in Germany & Italy"). The title was shortened to plain "Training Venues"
      only because the list is incomplete; place names carry real search intent for people looking
      for a breathwork retreat near them, and the short title gives that up
- [ ] Confirm reuse rights for the Monteverdi photos before production — they are third-party,
      from grimaldisavelli.com

<a id="task-37"></a>
### 37. Rewrite the "Hero's Journey" blog draft

Fabio wrote the full first draft of
[the-heros-journey-in-transpersonal-work.md](../src/blog/the-heros-journey-in-transpersonal-work.md).

- [ ] Pablo to read and rewrite in his own voice before publish
- [ ] Check the "Level 1 / 2 / 3 → Call / Ordeal / Return" mapping still holds once
      [task 3](#task-3) is finalised
- [ ] Confirm the "Further Reading" list is one the school will put its name behind

See also [task 42](#task-42) on the title and URL.

<a id="task-43"></a>
### 43. Fix `WEBSITE_CONTENT.md` before writing any copy from it

**These are not SEO issues — they are wrong facts.** The site's figures are authoritative: they also
appear in `src/_data/agreement-fallback.html`, i.e. inside the agreement the applicant signs.
Nothing in that doc should be published as copy until the fee rows agree with `training-overview.html`.

- [ ] Reconcile the fee, cohort and module-count rows against the site
      (→ the conflict table in [SEO_KEYWORD_MAP.md](SEO_KEYWORD_MAP.md#factual-conflicts))
- [ ] Links to WordPress URLs that die at migration: `/schedule/#tab-id-2`, `/program/`,
      `/wp-content/uploads/2024/01/…pdf`, and **`/participate/`, which does not exist on the new site**
- [ ] Second email `ewtts@posteo.de` alongside `office@transpersonal-training.com` — keep or drop?
- [ ] Typo "EURTOS" → EUROTAS
- [ ] *"Entry Requirements: Degree (there should be a hyperlink…)"* → link to the `/training-overview/`
      eligibility section
- [ ] *"I DONT KNOW WHERE THIS GOES"* on the **"Is the programme for me?"** block → suggested home:
      `/training-overview/`, above the eligibility list
- [ ] *"STUDENTS PAGE — this needs to be called something else"* → ambiguous: the `student.` portal,
      or `/lectures-schedule/`?

<a id="task-44"></a>
### 44. Add the programme brochure PDF

Until `src/assets/documents/transpersonal-training-brochure.pdf` exists, `src/_data/brochure.js`
reports it unavailable and every download CTA hides itself — so nothing links to a 404. Drop the file
in with exactly that filename and rebuild; no template changes needed.

- [ ] Design and add the PDF
- [ ] Put the site URL on page 1 — someone arriving from a search result needs a way back
- [ ] Do **not** title it with the exact primary keyword of an HTML page — title it
      "Programme Brochure 2027–2030", not as a landing page

Why both constraints matter: [BROCHURE.md](BROCHURE.md). See also [task 34](#task-34).

<a id="task-45"></a>
### 45. Draft the "Our history" paragraph

Pablo asked for a draft rather than writing it himself (Q34). School founded 2021, East cohort first.

- [ ] Draft one short piece for the About section or as a blog post, for Pablo's review

<a id="task-46"></a>
### 46. The two missing money pages

Both were specified in the keyword map and neither exists. The Hero's Journey angle shipped as a
blog post instead of the pillar page originally planned.

- [ ] **Transpersonal Therapist (career)** page
- [ ] **FAQ** page — also unlocks `FAQPage` structured data ([task 47](#task-47))

<a id="task-50"></a>
### 50. Collect testimonials from current students

- [ ] Collect them, then place them on the trust layer (Phase F)

<a id="task-53"></a>
### 53. Keyword map — the half that is still open

Titles and descriptions now match the map for 13 of ~15 pages. Not done:

- [ ] Audit H1s and body copy against the target keywords, page by page
- [ ] Close the gaps found in the long-tail audit
      (→ [SEO_KEYWORD_MAP.md § Long-tail phrase coverage](SEO_KEYWORD_MAP.md#long-tail-phrase-coverage))
- [ ] Consider making `transpersonal psychotherapy` (320/mo, **difficulty 2**) the explicit focus of
      `/what-is-transpersonal-psychology/` — currently spread thin across pages

Titles alone do not move rankings; the baseline confirms nothing commercial ranks yet.

---

## §4 — Before launch: build and technical

<a id="task-27"></a>
### 27. Build the Accreditation page (EUROTAS)

The current official PDF was located during the July review:
`https://eurotas.world/wp-content/uploads/2021/08/General-Criteria-for-ESTP-Certification.pdf`
(landing page: `https://eurotas.world/eurotas-certifications-for-professionals/`).

- [ ] Build the page, linking that PDF, explaining TREE membership (still accurate per Pablo),
      and restating the per-level breathwork requirement — scaled per level length, not a flat ~10/year

Why it earns its place: it would own `transpersonal psychology degree europe` (difficulty 5) and
`eurotas accredited psychotherapy schools`, both currently unassigned to any page.

<a id="task-30"></a>
### 30. Load Recommended Reading from a spreadsheet

`/resources/` currently pulls from a static data file (`src/_data/readingResources.js`).

- [ ] Create the spreadsheet (same fields: category, title, author, note, url for books;
      title, source, note, url for videos)
- [ ] Wire the page to build from it, following the Curriculum/Schedule/Lectures pattern
- [ ] Test after the spreadsheet is finalised
- [ ] Refresh the selection — Pablo wants some of the old videos back, then a review pass

Why: keeps the list editable without a code change.

<a id="task-47"></a>
### 47. Expand the structured data

- [ ] `Event` (schedule), `Person` (teachers), `BlogPosting`, `FAQPage`, `BreadcrumbList`; enrich `Course`

`Person` per teacher matters more than usual here: all 32 old bio URLs now 301 to a single
`/teachers/` page, and the schema is what tells Google that one page covers 32 distinct people.

<a id="task-48"></a>
### 48. Technical SEO leftovers

Done already: 404 page, canonical for syndicated posts, nav URL consistency.

- [ ] Self-host fonts and icons — also what makes the privacy modal's "no tracking" claim true ([task 17](#task-17))
- [ ] Rebuild the Agreement page into the new site
- [ ] Dynamic copyright year

<a id="task-49"></a>
### 49. Image pipeline and performance

- [ ] `@11ty/eleventy-img` pipeline
- [ ] Alt-text audit
- [ ] Lazy loading
- [ ] Lighthouse ≥ 90 on mobile

---

## §5 — Accounts, email and outreach

<a id="task-23"></a>
### 23. Create and link the social / newsletter channels

Facebook exists and is linked (footer + homepage + JSON-LD `sameAs`). Still to create:

- [ ] Instagram → footer + homepage + JSON-LD `sameAs`
- [ ] YouTube → same three places
- [ ] Substack → footer + relevant CTAs
- [ ] WhatsApp and/or Telegram contact (Telegram matters for Russian-speaking Eastern applicants)
      → contact section + footer

<a id="task-38"></a>
### 38. Migrate the CleverReach list to Brevo

Brevo is confirmed for email marketing (Pablo). The existing **CleverReach** list runs
Jan 2024 – Jun 2026.

- [ ] Export from CleverReach, import into Brevo
- [ ] Send a re-permission email before mailing the list

Why the re-permission step is not optional: an imported list without fresh consent is both a GDPR
exposure and the fastest way to burn a new sending domain's reputation.

<a id="task-60"></a>
### 60. Email marketing — the rest of Phase I

- [ ] Brevo account and lists
- [ ] Newsletter signup on the site
- [ ] Programme-PDF lead magnet ([task 44](#task-44) / [task 34](#task-34) supply the PDF)
- [ ] Welcome sequence drafted
- [ ] Application nurture sequence

→ [MARKETING_AND_SEO.md § I0 Setup order](MARKETING_AND_SEO.md#i0-setup-order-start-here)

<a id="task-40"></a>
### 40. Ask EUROTAS for the accredited-school listing link

The single most valuable missing backlink in the profile — the school has 7 referring domains total.

- [ ] Ask EUROTAS to list the school in their accredited-schools directory

<a id="task-29"></a>
### 29. Partner and faculty backlink outreach

Pablo asked for the full list so he can check who links back. It lives in
[MARKETING_AND_SEO.md § Backlinks & Partner Outreach](MARKETING_AND_SEO.md#backlinks--partner-outreach),
with ready-to-send wording in [BACKLINK_OUTREACH_TEMPLATES.md](BACKLINK_OUTREACH_TEMPLATES.md).

- [ ] Confirm which of the 7 partner institutes are still active — **before** any are published on
      the Accreditation page ([task 27](#task-27)). Only Holos (Romania) has been checked so far
- [ ] Note any *new* partner institutes to add
- [ ] Work through the faculty list; several have their own sites and are reciprocal-link candidates

<a id="task-51"></a>
### 51. Launch with fresh content

- [ ] Draft 2–3 original blog posts so the site does not launch with an empty blog

---

## §6 — Cutover week

Every item here waits on [task 10](#task-10).

<a id="task-61"></a>
### 61. Freeze and back up WordPress before the switch

- [ ] Freeze content edits on the old site
- [ ] Take a full backup/export (database + `wp-content/uploads`) and keep it somewhere retrievable

Why: the redirect map is only as good as the ability to check what a URL used to serve. Once DNS
moves, the old site is gone and any mistake in the map becomes unverifiable.

<a id="task-52"></a>
### 52. Full pre-cutover QA

- [ ] Crawl the staging build (Screaming Frog): zero 404s, one canonical per page
- [ ] Rich Results Test on the structured data
- [ ] Mobile check
- [ ] Live form test end to end

<a id="task-54"></a>
### 54. Pre-cutover checks on the old estate

- [ ] Check the GSC Links export for hotlinked `/wp-content/uploads/*` images before letting uploads die
- [ ] Confirm whether any `?lang=` / Russian-language event variants are indexed outside the sitemap

<a id="task-28"></a>
### 28. 301 the old East URLs

- [ ] `/program/`, `/archive-2021/`…`/archive-2025/` and the Russian-language event pages → map to the
      new integrated-programme page, `/schedule/`, or the homepage

<a id="task-14"></a>
### 14. Re-add the production CNAME — only if GitHub Pages wins

- [ ] Re-add `src/CNAME` with `transpersonal-training.com` before the final production merge
- [ ] Skip entirely if [task 10](#task-10) lands anywhere else

<a id="task-13"></a>
### 13. Search Console at cutover

The domain property is already verified and active. What remains is launch-day work:

- [ ] Submit the new sitemap (+ Bing Webmaster Tools)
- [ ] URL-inspect the top 10 pages
- [ ] Monitor coverage and redirects weekly for 4–6 weeks; fix crawl errors as they appear

⚠️ **Remove the pre-launch noindex on cutover day.** `.github/workflows/deploy.yml` has a step named
*"Keep the pre-launch build out of search results"* that forces `noindex, follow` onto every page,
because the github.io copy canonicalises to a domain where most of those URLs still 404. Once the
domain points here, that step must be deleted or the live site stays invisible.

---

## §7 — After launch

<a id="task-32"></a>
### 32. Dedicated pages for the highest-traffic teachers — decide 4–6 weeks after cutover

**Decision taken (Fabio, July 2026):** do *not* build a page for every teacher. All 32 old bio URLs
301 to the single `/teachers/` page, anchored per teacher — already implemented.

**Why this task survives anyway:** teacher bio pages are **64% of the old site's organic clicks**
(228 of 347) at positions 3–8. One page cannot rank well for 32 personal names at once, so some loss
is expected. If the loss turns out material, the fix is to give *a few* teachers their own page.

- [ ] 4–6 weeks after cutover, check GSC: are teacher-name queries still bringing ~200 clicks per 6 months?
- [ ] If clicks dropped materially, build pages for the shortlist only — ranked by measured demand in
      [MARKETING_AND_SEO.md § Teacher shortlist](MARKETING_AND_SEO.md#teacher-page-shortlist).
      If only three are built: **Lattuada, Biechonski, Al-Hammadi** — Lattuada for the 4,850 untapped
      impressions at 0.02% CTR, the other two because they are the actual traffic

<a id="task-62"></a>
### 62. Google Business Profile and reviews

- [ ] Create the profile
- [ ] Ask current students for reviews
- [ ] Venue-level local SEO for Todtmoos and Monteverdi — place names carry real search intent
      (see also [task 36](#task-36))

<a id="task-16"></a>
### 16. An article editing workflow

- [ ] Define how posts get drafted, reviewed and published
- [ ] Decide whether Google Docs is enough or a backend/CMS is needed
      (options compared in [FUTURE_IDEAS.md § CMS Integration](FUTURE_IDEAS.md#cms-integration--comparison))

<a id="task-18"></a>
### 18. The Google Apps Script rebuild button

- [ ] Create a GitHub Personal Access Token for rebuild triggers
- [ ] Add the rebuild action to the spreadsheet Apps Script
- [ ] Test that a spreadsheet-side rebuild updates the site safely

<a id="task-19"></a>
### 19. Finish the PDF exporter

- [ ] Install `docs/googlescripts/curriculum-pdf-apps-script.js` into the Curriculum spreadsheet
- [ ] Test both PDF outputs
- [ ] Adjust styling and exported content as needed

---

## §8 — Housekeeping

<a id="task-2"></a>
### 2. Program → Training Overview rename — one item left

The rename itself is done: navigation, internal links, headings and SEO text all updated.

- [ ] Check SEO on the renamed page (folds into [task 12](#task-12) and [task 53](#task-53))

<a id="task-39"></a>
### 39. Search Console and backlink housekeeping

- [ ] Confirm Manual Actions and Security Issues are clean (expected: no issues)
- [ ] Ahrefs Webmaster Tools: cross-check GSC's 7 referring domains by hand and note any missing from
      [BASELINE.md Finding 4](seo-baseline/BASELINE.md#finding-4--backlink-profile-7-domains-all-relationship-based).
      The free tier does not allow CSV export and is not worth paying for at this size

<a id="task-58"></a>
### 58. Migrate the last hardcoded intro copy

Curriculum, Schedule and Lectures Schedule still hold their static intro text inside their templates,
because the pages themselves are driven by Google Sheets at build time.

- [ ] Move the static intro prose into `src/content/` so it is editable like every other page
      (→ [CONTENT_EDITING.md § Pages Not Yet Migrated](CONTENT_EDITING.md#pages-not-yet-migrated))

<a id="task-59"></a>
### 59. Browserslist warning

- [ ] `npx update-browserslist-db@latest`

---

## Settled — no action, kept as the record

| What | Outcome |
|---|---|
| **Form backend** | Google Apps Script, not Brevo forms — one script writes contact messages and applications to a spreadsheet and signed agreements to Drive. Keeps leads in the Sheets workflow the office already uses and supports a file upload no generic form service offers |
| **Fees transparency** | Publish exact prices. €489/module East · €689/module West · €45/single lecture · single seminar on request. Discounts on request; one free module per referred student |
| **Language** | English-only for now, confirmed by Pablo, even with a live Russian-language Eastern track. A Russian landing page may come later — explicitly out of scope for launch |
| **Student portal fate** | Already on its own host (`student.`, WordPress + Tutor LMS), so the cutover does not touch it. Replacing Tutor LMS is a separate, non-blocking decision |
| **Teacher bio URLs** | No per-teacher pages; all 32 → `/teachers/#<id>`, and the page expands the right teacher from the fragment. Residual risk is [task 32](#task-32) |
| **Sitemap** | None submitted on the old site. The new one gets submitted at cutover ([task 13](#task-13)) |
| **GSC property type** | Domain property, confirmed — the exports contain `student.` and `test.` URLs, which a URL-prefix property could never report |
| **404 export** | Done 2026-07-20. Only 4 of 39 are on the main domain; the rest are deleted theme-demo pages on `student.`/`test.` |
| **OG image** | Built — `src/assets/images/Graphics/og-default.jpg` |
| **`/apply/` page, `/resources/`, `/collaborations/`** | Built and live |
| **Baseline + redirect map** | 347 clicks / 17,448 impressions / 255 indexed pages / 7 referring domains measured; 574 old URLs inventoried and the 301 map drafted |
| **Codebase cleanup** | Deploy workflow branches, legacy root files, `schedule.js` → `schedule-ssr.js`, CSS consolidated into `main.css`, cache fallback on data fetchers, daily rebuild cron and webhook trigger, docs consolidated into `docs/` |

---

*Last updated: 30 August 2026*
