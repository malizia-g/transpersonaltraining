# Baseline snapshot — old WordPress site (Search Console, July 2026)

> Stage 1 step 2 of [MARKETING_AND_SEO.md](../MARKETING_AND_SEO.md). Built from the GSC exports in
> [gsc/](gsc/), pulled 2026-07-20. **This is the "before" picture we measure the migration against.**
>
> Data window: **2026-01-16 → 2026-07-18** (~6 months). The export filter was set to "Ultimi 16 mesi"
> but Search Console only holds data from mid-January 2026 — that's the real extent of the history,
> so there is no earlier baseline to recover.

## Headline numbers

| Metric | Value |
|--------|-------|
| Clicks (6 months) | **347** (~58/month, ~1.9/day) |
| Impressions | **17,448** |
| Average CTR | 1.99% |
| Average position | 12.6 |
| Pages indexed | **255** (531 not indexed) |
| Referring domains | **7** |
| Manual actions | *(to confirm — expected none)* |

Device split: desktop 178 clicks / mobile 166 / tablet 3. Mobile converts far better
(3.09% CTR at position 7.7 vs desktop 1.5% at position 15.4) — mobile-first work in Phase E is
justified by data, not just principle.

## Finding 1 — the site's entire organic footprint is teacher-name reputation traffic

Clicks by page type:

| Page type | Pages | Clicks | Share | Impressions |
|-----------|-------|--------|-------|-------------|
| **Teacher bio pages** (`/kati-wortelkamp/`, …) | 32 | **228** | **64.0%** | 11,041 |
| Homepage | 1 | 84 | 23.6% | 2,948 |
| All other public pages (`/program/`, `/faculty/`, `/schedule/`, `/information/`…) | 20 | 18 | 5.1% | 3,283 |
| Student portal (incl. `student.` subdomain) | 78 | 18 | 5.1% | 1,262 |
| `test.` subdomain (see Finding 3) | 8 | 5 | 1.4% | 402 |
| Event/lecture pages | 25 | 3 | 0.8% | 44 |

The top queries are almost all personal names — `jure biechonski` (17 clicks), `stephan schillinger`
(9), `manal al hammadi` (6), `cristina revenco` (6), `bernadette blin` (4), `mario lorenzetti` (3).
The bio pages rank in **positions 3–8**, which is genuinely strong.

Only one non-name query earns meaningful clicks: **`transpersonal training`** (8 clicks, position 6)
— i.e. our own brand.

**Implication for the migration — resolved (July 2026).** The new site has a single `/teachers/`
page, so the question was whether 32 bio URLs can safely redirect to it. Fabio's decision: yes, no
per-teacher pages. This works here because `/teachers/` renders **all 32 bios into its HTML**
server-side (~4,200 words, collapsed with CSS rather than loaded by JavaScript), so the redirect
target genuinely contains the equivalent content — the condition that separates an acceptable
many-to-one redirect from a soft 404. Each card now has an `id`, and the page expands the matching
teacher from the URL fragment, so old URLs 301 to `/teachers/#<id>` and land the visitor on the right
bio. Expect to lose some long-tail name rankings anyway (one URL can't rank for 32 names as well as
32 URLs did); that residual risk is tracked as [PABLO task 32](../PABLO_TASKS.md) with a data-ranked
shortlist, to be revisited 4–6 weeks after cutover. See [REDIRECT_MAP.md](REDIRECT_MAP.md) §2.

## Finding 2 — we rank for nothing commercial

Every generic, revenue-relevant keyword pulls impressions but **zero clicks**, because nothing ranks
on page 1–5:

| Query | Impressions | Clicks | Avg position |
|-------|-------------|--------|--------------|
| transpersonal coaching south west | 405 | 0 | 33.2 |
| transpersonal coaching | 285 | 0 | 82.1 |
| transpersonal psychology institute | 155 | 0 | 58.0 |
| transpersonal psychology certificate | 123 | 0 | 67.4 |
| transpersonal psychology training uk | 113 | 0 | 50.8 |
| transpersonal psychology course | 103 | 0 | 70.0 |
| transpersonal psychology coaching | 94 | 0 | 87.3 |

This is the gap the whole keyword plan (Phase D) exists to close, and it confirms the plan's premise:
**there is no commercial organic ranking to protect at cutover.** The migration risk is concentrated
entirely in the bio pages and the homepage — everything else can be restructured freely.

A curiosity worth noting: `/pier-luigi-lattuada/` collected **4,850 impressions at position 7.6 but
only 1 click** (0.02% CTR). People search his name, see our page, and click elsewhere — the old bio
snippet isn't compelling. Same pattern on the `student.` subdomain profile (829 impressions, 0 clicks).

## Finding 3 — two subdomains nobody accounted for

Neither appears in `wp-sitemap.xml`; both surfaced only because the GSC property is domain-level.

1. **`test.transpersonal-training.com` — a public, indexed WordPress staging copy.**
   It serves a full duplicate of the school site (`/about/`, `/apply/`, `/courses/`) and earned
   402 impressions and 5 clicks. This is live duplicate content competing with the real site and
   leaking an unfinished environment into search results. **Fix now, independently of the migration:**
   HTTP auth or `noindex` + `Disallow`, then request removal in GSC. Added as an action below.
2. **`student.transpersonal-training.com` — the student portal, already on its own subdomain.**
   It runs WordPress + Tutor LMS (courses, quizzes, instructor profiles). This materially changes
   **Open Decision 3** (portal fate): the portal is *already* separated from the main domain, so the
   cutover mostly needs to leave it alone rather than migrate it. The remaining work is the handful
   of legacy portal paths still on the root domain (`/login/`, `/payment/`, `/dashboard-page/`…),
   which should 301 to their `student.` equivalents.

## Finding 4 — backlink profile: 7 domains, all relationship-based

| Linking site | Linking pages | Target pages | Who |
|--------------|---------------|--------------|-----|
| holotropatmen.de | 9 | 5 | Kati Wortelkamp's holotropic breathwork site (incl. a page titled "eastwest-transpersonal-training-school-west") |
| transpersonalaizglitiba.lv | 9 | 8 | Latvian Transpersonal Education Institute — partner |
| mariolorenzetti.org | 3 | 1 | Mario Lorenzetti (faculty) |
| holostribe.ro | 2 | 1 | Holos Transpersonal Training School, Romania — partner |
| juliajavkin.com | 2 | 1 | Julia Javkin (faculty) |
| tsadra.org | 2 | 1 | Tsadra Foundation wiki — Dennis Johnson entries |
| essence-sd.de | 1 | 1 | Stefan Dressler (faculty) |

Most-linked targets: the homepage (12 links from 6 sites), then `/lyudmila-skartsesku/`,
`/dennis-johnson/`, `/schedule/`, `/stefan-dressler/`, `/stephan-schillinger/`, and five more bios
with 1 link each.

This validates the Phase H thesis exactly — **every single backlink comes from a teacher or partner
institute**, none from directories, none from EUROTAS. Two conclusions:

- The outreach worksheet in the plan is the right instrument, and the 5 faculty/partner sites already
  linking prove the ask works. **EUROTAS is still not linking to us** — the highest-value target
  remains unclaimed.
- Seven referring domains is a very small profile. It is also *fragile*: bio pages carry links, which
  is a second reason the bio URLs must not be collapsed into one page.

## Finding 5 — index bloat

Of 786 known URLs, only **255 are indexed**; 531 are not. The largest exclusion buckets:

| Reason | Pages |
|--------|-------|
| Crawled, currently not indexed | 378 |
| Alternate page with proper canonical tag | 53 |
| **Not found (404)** | **39** |
| Blocked due to unauthorised access (403) | 16 |
| Duplicate, no user-selected canonical | 11 |
| Blocked by robots.txt | 8 |
| Duplicate, Google chose a different canonical | 14 |
| Page with redirect | 6 |
| Soft 404 | 3 |
| Server error (5xx) | 1 |

The 378 "crawled but not indexed" are overwhelmingly the 348 MEC event pages — Google crawls them and
judges them not worth indexing. That confirms they can be handled with a pattern rule at cutover
rather than individual redirects, and it's an argument for keeping lecture pages out of the public
sitemap on the new site (crawl budget spent on 348 near-duplicate pages is crawl budget not spent on
the money pages).

The **39 existing 404s** are worth exporting per-URL from GSC and fixing or redirecting *before*
cutover, so they don't get blamed on the migration afterwards.

## Finding 6 — the 39 404s are almost all someone else's problem, but the drilldown exposed a bigger one

Source: `gsc/extracted/drilldown/Tabella.csv` (exported 2026-07-20). Good news first — **only 4 of the
39 broken URLs are on the main domain**, so the pre-cutover 404 cleanup is nearly free:

| URL | Status | What to do |
|-----|--------|-----------|
| `/wp-content/uploads/2025/09/West_Program_26.pdf` | 404 confirmed | **Real content loss** — see below |
| `/wp-content/uploads/2025/10/West_Program_26.pdf` | 404 confirmed | same file, second path |
| `/program-2024/` | 404 confirmed | 301 → `/training-overview/` |
| `/?page_id=3` | 404 confirmed | ancient WP internal URL — ignore or 410 |

**The West Program 2026 brochure is missing.** Both upload paths 404 while `/program-2026/` (the page)
still returns 200. A programme PDF is precisely the lead magnet Phase I wants to gate behind an email
form, so this is worth recovering rather than redirecting: find the file, republish it, and point both
old paths at the new location.

The remaining 35 broken URLs sit on `student.` (~28) and `test.` (~4), and they are mostly **EduBlink
theme demo content** that was imported with the LMS theme, indexed by Google, then deleted — posts
about cooking, nutrition, sales technique and fitness (`/essential-kitchen-skills-for-aspiring-chefs/`,
`/how-to-handle-common-sales-challenges/`, `/fasting-in-ramadan-excellence-and-how-tos/`…). Their
being 404 is the correct end state; nothing to fix. The count is also self-healing: GSC shows it
falling from 66 in April to 39 in July.

### The real problem the drilldown revealed: the portal is leaking into Google

Chasing the 404s surfaced that **`student.transpersonal-training.com` has 76 pages drawing search
impressions**, and much of it is material that should never be in an index:

- **Student-only course internals** — lesson pages, `dashboard`, `classroom`, and dozens of quiz URLs
  (`/quizzes/test-describe-your-understanding-4-2-3-2-3-2-2-2-2/`).
- **Deleted content still crawlable** — e.g. a course page ending in `__trashed`.
- **A WooCommerce product catalogue** with visible duplicates (`…-copy-3`, `…-copy-5`, `…-copy-6` of
  the same course).
- **Surviving theme demo pages** — `/category/web-development/`, `/child-education/`, `/software/`,
  `/component/testimonials/`, `/purchase-guide/`.

None of it earns meaningful traffic, but it dilutes the domain's topical signal, wastes crawl budget
(this is a large part of the 378 "crawled, not indexed" pages) and exposes student material publicly.

It also compounds the Lattuada problem from Finding 2: his `student.` instructor profile pulls
**829 impressions with zero clicks**, on top of the 4,850 on his main-site bio. Searches for his name
are hitting two of our pages and converting on neither.

Tracked as [PABLO_TASKS.md task 33](../PABLO_TASKS.md).

## What this changes in the plan

1. **Per-teacher pages become a launch requirement, not a nice-to-have** — they are 64% of current
   organic traffic and carry most backlinks. Good news: `src/_data/teachers/` already holds 32
   per-teacher markdown files, so generating a page per teacher is a template change, not a content
   project. **29 of 32 slugs already match the old URLs exactly** (see REDIRECT_MAP §2).
2. **Secure `test.transpersonal-training.com` immediately** — this is a live SEO leak today,
   unrelated to the cutover.
3. **Open Decision 3 (portal) is largely answered** — the portal already lives on `student.`; leave it,
   and just redirect the legacy root-domain portal paths.
4. **Baseline KPI targets** for the migration: do not lose the 347 clicks / 255 indexed pages; hold
   bio-page positions 3–8; grow referring domains from 7.
5. **Fix the CTR problem on high-impression bios** (Lattuada: 4,850 impressions → 1 click). Titles and
   meta descriptions on the new per-teacher pages should be written to earn the click, not just to
   exist.

## Immediate actions arising

- [ ] Block/noindex `test.transpersonal-training.com` + removal request in GSC — **do this week**
- [x] ~~Export the 39 404 URLs from GSC~~ — done 2026-07-20, analysed in Finding 6
- [ ] **Recover the West Program 2026 PDF** (both `/wp-content/uploads/2025/09|10/West_Program_26.pdf`
      are dead) and 301 the old paths to wherever it is republished
- [ ] 301 `/program-2024/` → `/training-overview/`
- [ ] Portal SEO hygiene on `student.` — noindex the student-only areas, purge theme demo pages and
      duplicate products ([PABLO task 33](../PABLO_TASKS.md))
- [ ] Build per-teacher pages on the new site with the old slugs (see REDIRECT_MAP §2)
- [ ] Confirm GSC property type is *Domain* (the presence of `student.`/`test.` URLs in this export
      already indicates it is) and that Manual Actions is clean
- [ ] Ahrefs Webmaster Tools: export backlinks to cross-check GSC's 7 domains
- [ ] Ask EUROTAS for the accredited-school listing link (highest-value missing backlink)
