# 301 Redirect Map — WordPress → new Eleventy site

> Step B2 of [MARKETING_AND_SEO.md](../MARKETING_AND_SEO.md). Built from the old site's sitemap
> inventory (574 URLs, [raw/](raw/)) and **prioritized with real Search Console data**
> ([BASELINE.md](BASELINE.md), exports 2026-07-20).
>
> Priority column: **HIGH** = earns organic clicks and/or holds backlinks, must redirect to a true
> equivalent · **med** = some impressions, no clicks · **low** = no signals, 410 acceptable.
>
> Still blocked on **hosting** (plan Open Decision 4): GitHub Pages can't serve 301s — these rules
> assume Cloudflare Bulk Redirects or a Netlify/Cloudflare Pages `_redirects` file.
> **Open Decision 3 (portal) is now largely answered** — see §3.

## 1. Public pages (from `raw/posts-page-1.txt`)

| Old URL | New target | Clicks | Priority | Notes |
|---------|-----------|--------|----------|-------|
| `/` | `/` | 84 | **HIGH** | 12 backlinks from 6 sites; domain root, no rule needed |
| `/program/` | `/training-overview/` | 9 | **HIGH** | 1,962 impressions — the best-performing content page |
| `/program-2026/` | `/training-overview/` | 0 | med | |
| `/program-2024/` | `/training-overview/` | 0 | low | not in sitemap, appears in GSC |
| `/faculty/` | `/teachers/` | 6 | **HIGH** | 865 impressions |
| `/schedule/` | `/schedule/` | 1 | **HIGH** | has 2 backlinks; same path — verify content parity |
| `/information/` | `/resources/` | 1 | med | old reading/videos list → new Resources page |
| `/apply/` | `/apply/` | 0 | **HIGH** | same path; zero traffic today but it's the conversion page |
| `/archive-2021/` … `/archive-2025/` | `/schedule/` | 0 | low | 5 yearly archives (`archive-2023` has 156 impressions) |
| `/closed_meeteing_iurii_becioski-7-9-04-23/` | 410 | 1 | low | one-off closed meeting page |
| `/wp-content/uploads/2024/10/newsletter-9.pdf` | 410 | 0 | low | check the Links export for hotlinked PDFs before killing uploads |
| `/program-2024/` | `/training-overview/` | 0 | low | **already 404 today** — confirmed 2026-07-20 |
| `/wp-content/uploads/2025/09/West_Program_26.pdf` | new PDF location | 0 | **HIGH** | **already 404 today.** The West Program 2026 brochure is missing — recover the file first ([TODO task 34](../TODO.md#task-34)), then redirect here |
| `/wp-content/uploads/2025/10/West_Program_26.pdf` | new PDF location | 0 | **HIGH** | same file, second path |
| `/?page_id=3` | 410 | 0 | low | ancient WP internal URL, already 404 |

## 2. Teacher bio pages — the highest-stakes rules in this map

**These 32 URLs are 64% of all organic clicks (228 of 347) and carry most of the site's backlinks.**
They rank in positions 3–8 for teacher-name searches. See [BASELINE.md](BASELINE.md) Finding 1.

### Decision (Fabio, July 2026): all 32 → `/teachers/`, anchored per teacher

No per-teacher pages. Every old bio URL 301s to **`/teachers/#<teacher-id>`**.

**Why this is defensible here** (it usually isn't): `/teachers/` is not a thin hub page — the new
template renders **every teacher's full bio, credentials and training into the HTML** server-side
(`{{ teacher.bio | markdown | safe }}` inside the loop; the cards are collapsed with CSS, not loaded
by JavaScript). The rendered page is ~4,200 words and contains all 32 bios, so Google can index the
content and the redirect points at a page that genuinely holds the equivalent text. This is the
condition that separates an acceptable many-to-one redirect from a soft-404.

**Implemented (July 2026):** each card now carries `id="{{ teacher.id }}"`, and `/teachers/` reads
`location.hash` on load to expand and scroll to the matching teacher
([src/teachers.html](../../src/teachers.html)). A visitor arriving from a Google search for
"jure biechonski" lands on his bio already open, not on 32 collapsed cards.

**What this still costs, honestly.** One URL cannot rank as well for 32 different personal names as
32 URLs did. Expect to keep the brand and the strongest names and to lose ground on the long tail;
fragments (`#id`) are ignored by Google when consolidating signals, so all 32 old URLs consolidate
into one. Link equity does still flow through the 301s, so the backlink profile is preserved.
This is a deliberate trade of some organic traffic for a much simpler site — it is tracked as
**[TODO task 32](../TODO.md#task-32)**, to be revisited 4–6 weeks after cutover with GSC
data, at which point *a few* high-demand teachers may get their own page after all.

### The rules

**29 of 32 old slugs match the new teacher IDs exactly**, so those are mechanical:

```
/<slug>/  →  /teachers/#<slug>        (29 rules, slugs in raw/posts-post-1.txt)
```

Three slugs differ and need explicit rules — all three are high-traffic, so getting them right matters:

| Old URL | New anchor | Clicks | Impressions |
|---------|-----------|--------|-------------|
| `/jure-biechoniski/` | `/teachers/#jure-biechonski` (spelling fix) | 26 | 813 |
| `/dr-ingo-benjamin-jahrsetz/` | `/teachers/#ingo-jahrsetz` | 13 | 181 |
| `/cathys-bio/` | `/teachers/#cathy-geils` | 7 | 171 |

Two special cases in the same sitemap file:
- **`/agreement-appendix/`** — not a bio. The enrolment agreement appendix, still linked from the
  current footer. Rebuild in the new site or point at `/legal-notice/`.
- **`/portfolio-item/bernadette-blin/`** → `/teachers/#bernadette-blin`.

### Post-cutover verification

Run URL Inspection in GSC on the highest-traffic bios and watch their name queries weekly:
`/jure-biechoniski/` (26 clicks), `/manal-al-hammadi/` (25), `/gabriel-fernandez-borsot/` (13),
`/dr-ingo-benjamin-jahrsetz/` (13), `/stephan-schillinger/` (12), `/samvedam-randles/` (12),
`/cristina-revenco/` (11), `/rainer-pervoltz/` (11), `/stefan-dressler/` (10), `/kirsten-cameron/` (9).

Bios holding backlinks (equity must land safely): `/lyudmila-skartsesku/` (3 links),
`/dennis-johnson/` (2), `/stefan-dressler/` (2), `/stephan-schillinger/` (2), plus
`/dario-giuffrida/`, `/dr-ingo-benjamin-jahrsetz/`, `/kati-wortelkamp/`, `/pier-luigi-lattuada/`,
`/tina-lindhard/` (1 each).

Because all 32 consolidate onto one page, `/teachers/` needs a title and meta description that can
plausibly rank for personal names — e.g. leading with "Our Teachers" is weaker than naming the
faculty. Worth testing after launch.

## 3. Student portal — mostly already solved

GSC revealed the portal already runs on **`student.transpersonal-training.com`** (WordPress + Tutor
LMS). It is a separate host and the cutover does not touch it. Remaining work is only the legacy
portal paths still sitting on the root domain:

| Old URL | New target |
|---------|-----------|
| `/login/` `/register/` `/logout/` `/forgot-password/` `/reset-password/` | matching `student.` path |
| `/user-profile/` `/dashboard-page/` `/payment/` `/course-archive/` | matching `student.` path |
| `/add-events/` `/st/` `/login-customizer/` | 410 (admin internals) |

Confirm each target exists on `student.` before writing the rule; where there's no equivalent, send it
to the portal homepage rather than 404.

## 4. Event/lecture pages (348 URLs, `raw/posts-mec-events-1.txt`)

3 clicks and 44 impressions across all 348. GSC reports 378 pages "crawled, currently not indexed" —
Google already decided these aren't worth indexing. Pattern rule, no per-URL mapping:

- **`/events/*` → `/schedule/`** (or the `student.` portal if lecture content moves there).
- Do **not** put per-lecture pages in the new site's sitemap — 348 near-duplicate URLs waste crawl
  budget that should go to the money pages.

## 5. Taxonomy & author archives (~165 URLs)

All zero-traffic. Pattern rules:

| Pattern | Count | Rule |
|---------|-------|------|
| `/tag/*` | 131 | → `/blog/` |
| `/mec-category/*` | 29 | → `/schedule/` |
| `/category/*` | 2 | → `/blog/` |
| `/author/*` | 2 | → `/teachers/` |
| `/alb_elements*`, post-format archives | 3 | 410 (Enfold builder internals) |

## 6. Pre-cutover cleanup (do before, so it isn't blamed on the migration)

Status for each of these lives in [TODO.md](../TODO.md); what follows is what needs doing and why.

- **`test.transpersonal-training.com` is public and indexed** — 8 pages, 402 impressions, a full
  duplicate of the site. Unrelated to the cutover; fix now → [TODO task 31](../TODO.md#task-31)
  ([BASELINE.md](BASELINE.md) Finding 3)
- [x] ~~**39 URLs already return 404** per GSC — export and triage.~~ Done 2026-07-20
      ([BASELINE.md](BASELINE.md) Finding 6). Result: only **4 are on the main domain** and all four are
      now rows in §1 above. The other 35 sit on `student.`/`test.` and are deleted theme-demo content —
      correctly 404, nothing to do. The count is self-healing (66 in April → 39 in July).
- **Portal SEO hygiene** — `student.` has 76 indexed pages including quizzes, dashboards, trashed
  content and theme demo junk. Independent of the cutover → [TODO task 33](../TODO.md#task-33)
- Check the Links export for hotlinked `/wp-content/uploads/*` images before letting uploads die,
  and confirm whether any `?lang=` / Russian-language event variants are indexed outside the sitemap
  → [TODO task 54](../TODO.md#task-54)

## Cutover format

Cloudflare Bulk Redirects and Netlify `_redirects` both accept `source target 301` lines. This map
converts mechanically: ~15 exact page rules + 3 bio slug rules (+29 identity paths) + 12 portal rules
+ 5 pattern rules. Keep this file as the source of truth and generate the hosting-specific file from
it at cutover (plan step 18).
