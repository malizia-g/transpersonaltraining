# SEO Baseline — old-site snapshot & Search Console data

> Working folder for Stage 1 steps 1–3 of [MARKETING_AND_SEO.md](../MARKETING_AND_SEO.md).
>
> **Status (2026-07-20): steps 1, 2 and B1 complete; B2 drafted and evidence-based.**
> Search Console verified ✅ · GSC exports collected ✅ · old-site inventory captured ✅ ·
> baseline analysed ✅ · redirect map drafted 🟡 (blocked only on the hosting decision).

## Read this first

**[BASELINE.md](BASELINE.md)** — the analysis, and the most important document in this folder.
Five findings, including two that change the plan: 64% of the old site's organic traffic comes from
**teacher bio pages**, and there is a **public indexed `test.` subdomain** leaking duplicate content
right now.

**[REDIRECT_MAP.md](REDIRECT_MAP.md)** — the 301 map, prioritized by real click and backlink data.

## Contents

| Path | Contents |
|------|----------|
| [BASELINE.md](BASELINE.md) | Baseline analysis: traffic, queries, backlinks, index health, what it changes |
| [REDIRECT_MAP.md](REDIRECT_MAP.md) | 301 map: exact rules for pages/bios, pattern rules for events/taxonomies |
| `gsc/` | Raw Search Console exports, 2026-07-20 (performance, coverage, links) |
| `gsc/extracted/` | Unzipped CSVs — `performance/Query.csv`, `performance/Pagine.csv`, `coverage/*`, `drilldown/Tabella.csv` (the 39 404 URLs) |
| `raw/posts-page-1.txt` | 25 WordPress pages (public + legacy portal paths) |
| `raw/posts-post-1.txt` | 33 posts — 32 teacher bios + agreement appendix |
| `raw/posts-mec-events-1.txt` | 348 MEC event/lecture pages |
| `raw/taxonomies-*.txt`, `raw/users-1.txt` | 165 tag/category/author archives (junk tier) |

URL inventory captured 2026-07-20 from `https://transpersonal-training.com/wp-sitemap.xml`:
**574 indexable URLs**. GSC reports 255 indexed / 531 not indexed.

## The numbers in one line

347 clicks · 17,448 impressions · 6 months (2026-01-16 → 07-18) · 255 pages indexed ·
7 referring domains · average position 12.6.

## Settled since the first draft

- **Property type:** Domain property, confirmed — the exports contain `student.` and `test.`
  subdomain URLs, which a URL-prefix property could never report.
- **Sitemap:** none submitted (Fabio, Jul 2026). Nothing to do now; the new sitemap gets submitted at
  cutover (plan step 19).
- **Teacher bio URLs:** no per-teacher pages — all 32 redirect to `/teachers/#<id>`. See
  [REDIRECT_MAP.md](REDIRECT_MAP.md) §2 and [TODO task 32](../TODO.md#task-32).
- **Ahrefs:** the free Webmaster Tools tier does not allow CSV export. Not worth paying for — GSC's
  7 referring domains are enough for a profile this small. Read the numbers on screen in AWT
  (Site Explorer → Referring domains) and note any domain missing from BASELINE.md Finding 4 by hand.

- **404 export:** done. Only 4 of the 39 are on the main domain; the rest are deleted theme-demo
  pages on `student.`/`test.`. See [BASELINE.md](BASELINE.md) Finding 6.

## Still open

Tracked in **[TODO.md](../TODO.md)** — listed here only so this file names its own loose ends:

- **Hosting decision** — the last blocker on finalizing the redirect map → [task 10](../TODO.md#task-10)
- **Portal SEO hygiene** on `student.` — 76 indexed pages of quizzes, dashboards and theme demo
  content → [task 33](../TODO.md#task-33)
- **Recover the West Program 2026 PDF** — both upload paths are dead → [task 34](../TODO.md#task-34)
- **Confirm Manual Actions / Security Issues are clean** in GSC (expected: no issues) → [task 39](../TODO.md#task-39)

## Refreshing this baseline

Re-export from Search Console right before cutover and again 4–6 weeks after, using the same
filters, so the comparison is like-for-like. The "before" numbers to beat are in
[BASELINE.md](BASELINE.md) → *Headline numbers*.
