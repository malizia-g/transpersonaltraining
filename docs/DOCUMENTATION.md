# Transpersonal Training — Project Documentation

> Consolidated reference for the site's architecture, build process, design system, and integrations.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Build Process](#build-process)
3. [Directory Structure](#directory-structure)
4. [Color Palette & Design System](#color-palette--design-system)
5. [Google Sheets Integration](#google-sheets-integration)
6. [Google Apps Script — Rebuild Button](#google-apps-script--rebuild-button)
7. [Schedule Page Setup](#schedule-page-setup)
8. [Theme System](#theme-system)
9. [SEO & Deployment](#seo--deployment)
10. [Training Programme — Commitment & Roles](#training-programme--commitment--roles)
11. [Transpersonal Psychology — Overview](#transpersonal-psychology--overview)
12. [Curriculum PDF Generator](#curriculum-pdf-generator)
13. [Curriculum PDF Download (website)](#curriculum-pdf-download-website)
14. [Refactoring History](#refactoring-history)

---

## Architecture Overview

### Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Static Site Generator | Eleventy (11ty) | 3.1.2 |
| CSS Framework | Tailwind CSS | 3.4.19 |
| CSS Processing | PostCSS + Autoprefixer | 8.5.6 / 10.4.24 |
| Template Engine | Nunjucks (.njk) | — |
| Markdown Parser | markdown-it | 14.1.0 |
| Icons | Lucide (CDN, pinned v0.344.0) | 0.344.0 |
| Fonts | Google Fonts (Inter, Merriweather) | CDN |
| Task Runner | npm-run-all | 4.1.5 |

No frontend framework — vanilla ES6 modules with native `type="module"`.

---

## Build Process

```bash
npm run dev        # Build CSS + Eleventy in watch mode (parallel)
npm run build      # Full build: clean → Tailwind CSS → Eleventy
npm run serve      # Alias for dev
```

**Flow:**

```
src/styles/main.css  →  Tailwind CLI  →  _site/css/main.css
src/scripts/**/*.js  →  Copy          →  _site/scripts/
src/**/*.html        →  Eleventy+Njk  →  _site/**/index.html
src/assets/**/*      →  Copy          →  _site/assets/
```

### Deploy Workflow

File: `.github/workflows/deploy.yml`

Triggers:
- Push to `main` or `staging`
- Daily cron at `0 6 * * *` (06:00 UTC / 08:00 CET)
- Manual dispatch (`workflow_dispatch`)
- Webhook from Google Sheets (`repository_dispatch: rebuild-schedule`)

Deploys to the `deploy` branch via `peaceiris/actions-gh-pages`.

### Branch Strategy

```
feature/xxx  ──▶  staging  ──▶  deploy (auto)
                     │
                     └──▶  main (confirmed releases)
```

| Branch | Purpose |
|--------|----------|
| `main` | Default branch — confirmed, stable code |
| `staging` | Integration branch — merge confirmed work here, triggers deploy workflow automatically |
| `deploy` | Auto-generated — contains the built `_site/` output for GitHub Pages. Never edit directly |
| `working_on_*` / `feature/*` | Short-lived branches for specific tasks — always named after the activity (e.g. `feature/pdf-exporter`, `working_on_automations`) |

**Workflow:**
1. Create a branch from `staging` with a descriptive name (e.g. `feature/new-teachers-page`)
2. Work on the branch, commit often
3. Merge into `staging` when ready — this triggers the deploy action
4. Periodically merge `staging` into `main` to keep the default branch up to date

---

## Directory Structure

```
transpersonaltraining/
├── src/                          # Source (Eleventy input)
│   ├── _includes/                # Nunjucks templates
│   │   ├── base.njk              # Main layout
│   │   ├── navigation.njk        # Global navbar
│   │   ├── footer.njk            # Global footer
│   │   └── blog_article.njk      # Blog post layout
│   │
│   ├── _data/                    # Structured data
│   │   ├── teachers/*.md         # One file per teacher — bio + front matter
│   │   ├── teachers.js           # Assembles the roster from that folder
│   │   ├── collaborations/       # Partner institutes, one file each
│   │   ├── curriculumData.js     # Curriculum from Google Sheets
│   │   ├── scheduleEvents.js     # Schedule from Google Sheets (cache fallback)
│   │   ├── lectureEvents.js      # Lectures from Google Sheets (cache fallback)
│   │   ├── practiceClients.js    # Practice clients from Google Sheets
│   │   ├── scheduleFilters.js    # Schedule filter options
│   │   ├── lectureFilters.js     # Lecture filter options
│   │   ├── sheetTimestamps.js    # Asks the Apps Script which sheets changed
│   │   ├── agreement.js          # Enrolment agreement from the master Google Doc
│   │   ├── brochure.js           # Reports whether the brochure PDF exists
│   │   ├── forms.js  seo.js  readingResources.js  testimonials.js
│   │   └── *.cache.json          # Build caches (gitignored)
│   │
│   ├── content/                  # Editorial Markdown, one folder per page
│   │                             #   → see CONTENT_EDITING.md
│   ├── styles/
│   │   └── main.css              # All styles (Tailwind directives + components)
│   │
│   ├── scripts/                  # Modular JavaScript
│   │   ├── main.js               # Entry point
│   │   ├── modules/              # icons, navigation, form-cache
│   │   └── pages/                # apply, contact, lectures-schedule, resources,
│   │                             #   sample-lesson, schedule-ssr, training
│   │
│   ├── assets/                   # images/  videos/  documents/
│   ├── blog/*.md                 # Blog posts
│   └── *.html                    # Pages with Eleventy front matter
│
├── lib/
│   └── prefix-markdown-links.js  # Applies PATH_PREFIX inside rendered Markdown
├── scripts/
│   └── i18n/translate.js
├── _site/                        # Build output (gitignored)
├── docs/                         # Project documentation
├── TESTS/                        # Experimental HTML pages
├── .eleventy.js                  # Eleventy config
├── tailwind.config.js            # Tailwind config
├── postcss.config.js             # PostCSS config
└── package.json                  # Dependencies and scripts
```

---

## Color Palette & Design System

### Philosophy

**Science with Soul** — mystic depth (a deep indigo ground) carrying human
warmth (a pale gold CTA on a warm paper). The scheme is *Indigo Night*, picked
from the colour planner that lives on the `new_color_scheme` branch.

### How colour is declared

The home page, the techniques page, the nav and the footer carry no literal
hexes. Every colour resolves through the tokens at the top of
`src/styles/main.css`, which are derived from fifteen numbers — five HSL
triples plus three small offsets:

| Role | Token | Where it lands |
|------|-------|----------------|
| deep | `--deep-*` | hero, quote band, contact section, footer |
| dusk | `--dusk-*` | the second dark the gradients drift to |
| accent | `--acc-*` | CTA buttons, kickers, hairlines |
| second | `--sec-*` | card borders, drop caps, section kickers |
| paper | `--pap-*` | the light sections |

Everything else — the gradient stops, the five steps of text-on-dark, borders
and hover states — is derived from those by nudging lightness or alpha, so
changing the scheme means changing fifteen numbers and nothing else.

### Derived tokens in the markup

```
bg-[color:var(--c-deep)]      the dark ground        text-[color:var(--c-heading)]  headings
bg-[color:var(--c-paper)]     the light sections     text-[color:var(--c-body)]     body copy
bg-[color:var(--c-paper-hi)]  the lighter paper      text-[color:var(--c-link)]     links
text-[color:var(--c-acc)]     CTA / kickers          text-[color:var(--c-on-dark-2)] copy on dark
text-[color:var(--c-sec)]     supporting accent      border-[color:var(--c-line)]   rules
```

### Veils over the photographs

The hero, the quote band and the contact band are photographs with a wash of
palette colour over them. Each band's wash is scaled by its own multiplier
(`--veil-hero`, `--veil-glow`, `--veil-quote`, `--veil-contact`), so how much of
the picture survives is a separate decision from what colour the page is. Indigo
Night ships at `0.95 / 0.35 / 1 / 0.8`.

### What is not a token

Four things keep their own colour on purpose, and should stay that way:

- **Status tones.** The green/red notices on the contact and application forms,
  the required-field asterisk, and the Active / On Hold badges on the practice
  client page say something the palette cannot.
- **The botanical drawings.** The curriculum vine and its leaves are an
  illustration, not chrome.
- **Video surfaces.** The player letterboxes on /resources/, /sample-lesson/
  and the lectures page stay black, as video wants.
- **The printable agreement.** `/apply/` prints near-black ink on white paper;
  its headings follow the palette, its body does not.

### Accessibility

The palette generator on `new_color_scheme` gates every scheme on fourteen
contrast pairs before it will emit anything: body, headings, links and the two
accents on paper at 4.5:1, the CTA text on the accent at 4.5:1, and the muted
tier (`--c-body-dim`) and icons at 3:1. Indigo Night clears all of them.

The 3:1 tier is deliberate and is where the muted text sits — breadcrumbs,
meta lines, captions. It is the same weight the old design used there
(`neutral-warm-600`), so it reads as before, but it is below AA for body copy:
do not use `--c-body-dim` for anything a visitor has to read.

---

## Google Sheets Integration

### How It Works

Schedule and lecture data is fetched from Google Sheets **at build time** (not client-side). Two Eleventy data files handle this:

- `src/_data/scheduleEvents.js` — fetches schedule events
- `src/_data/lectureEvents.js` — fetches lecture events
- `src/_data/practiceClients.js` — fetches practice client/student therapist records

Both use a **cache fallback** mechanism:
1. On successful fetch → save to `*.cache.json`
2. On fetch failure → read from cache
3. If no cache available → return `[]`

### Procedure For Adding New Student Profiles

To add a new student to the “Become a Practice Client” page:

1. Add a new row in the source spreadsheet.
2. Fill in the student fields using the existing column headers.
3. Set the `id` column with a unique slug, for example `anna-keller`.
4. Upload the student image to the shared Google Drive folder used for student images.
5. Name the image file exactly like the student `id`, for example `anna-keller.jpg`.
6. If no image is available yet, the site will fall back to `default.png`.
7. Save the spreadsheet row and trigger the website rebuild if needed.

Operational rules:

- keep one image per student in the shared Drive folder
- keep the filename aligned with the spreadsheet `id`
- use lowercase ids with hyphens for consistency
- if you manually provide a `picture_link`, it overrides the automatic image lookup

Photos are resized during the build, so upload whatever you were sent — a phone
photograph, a picture saved as PNG — without preparing it first. Each one is
scaled to 800 px on its longest edge (the cards show them 224 px tall), rotated
upright from its EXIF orientation, and written as JPEG or PNG, whichever comes
out smaller for that particular image.

Replacing a photo in Drive is enough: every photo is re-fetched on every build,
so the new one appears at the next deploy. It did not always work this way — the
build used to skip the download whenever a file was already on disk, and since
the link in the sheet does not change when the picture behind it does, a replaced
photo was never picked up again.

Cache files are gitignored locally but committed by GitHub Actions.

### Google Sheets API URLs

The spreadsheet data is exported as JSON via Google Apps Script web apps. Each data file uses a stable `/exec` endpoint:

| Data | File | Stable URL |
|------|------|------------|
| Practice Clients | `src/_data/practiceClients.js` | `https://script.google.com/macros/s/AKfycbzyBD_kWrr6irrQcMSwOFtHxip3rfYpc1_2q0oscmKCHLJVFFSiGd4zAzsikgbXTEXKow/exec` |
| Lecture Events | `src/_data/lectureEvents.js` | `https://script.google.com/macros/s/AKfycbwr2rE4dFTkQ5ZJzHewA9jBxYmAbxgqTOX-Kd20dNyDi7xbkGWjOFBjdrhHEF0yK-9Ucg/exec` |
| Schedule Events | `src/_data/scheduleEvents.js` | `https://script.google.com/macros/s/AKfycbwF4y-K0oYh0Fd78xVezCcaGf7Ac5SglXAv0SUzcBJgqeg_kRXaLix3gSad8LAgg6oR/exec` |

> **Important:** Always use the stable `/exec` URLs (format `script.google.com/macros/s/.../exec`). Never use the temporary `script.googleusercontent.com/macros/echo?user_content_key=...` redirect URLs — those tokens expire and cause fetches to return HTML instead of JSON.

### Spreadsheet Structure

Expected column headers (row 1):

| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| Date | Facilitator | Title | Description | Status | Location | Type1 | Type2 |

The Google Apps Script converts headers to lowercase automatically.

### Google Apps Script — JSON Exporter

The Apps Script in the spreadsheet exports data as JSON. Key points:
- Deployed as a web app ("Execute as: Me", "Who has access: Anyone")
- Automatically reads column headers and uses them as JSON keys
- Skips empty rows and rows without a date
- Handles missing data gracefully (empty string for missing cells)
- Changes are available instantly after spreadsheet edits — no need to redeploy the script

**Full setup guide:** the scripts themselves are in [`docs/googlescripts/`](googlescripts/), each
with its setup steps in a header comment. (An older `TESTS/Instructions/` guide is referenced in
older commits but is no longer in the repo.)

---

## Google Apps Script — Rebuild Button

A "🌐 Website → 🔄 Rebuild Website" menu button in Google Sheets triggers a site rebuild via GitHub Actions.

### How It Works

1. User clicks "🔄 Rebuild Website" in the spreadsheet menu
2. Apps Script sends a `repository_dispatch` event to GitHub
3. The `deploy.yml` workflow runs, fetching fresh data from the spreadsheet
4. Site is rebuilt and deployed in ~2-3 minutes

### Setup Steps

1. **Create GitHub Personal Access Token** (classic) with `repo` scope
2. **Open Apps Script editor** in the spreadsheet (Extensions → Apps Script)
3. **Add the rebuild code** to `Code.gs` (uses `UrlFetchApp.fetch` to call GitHub API)
4. **Replace the token placeholder** with your actual PAT
5. **Authorize the script** (run `testConfiguration` first)
6. **Reload the spreadsheet** — the "🌐 Website" menu will appear

### Security

- The PAT is stored only in Google Apps Script (not in the repo)
- Never share or commit the token
- Consider setting an expiration date and renewing periodically

---

## Schedule Page Setup

The schedule page (`src/schedule.html`) displays events from Google Sheets.

**Data flow:**
1. `scheduleEvents.js` fetches data from Google Sheets at build time
2. Eleventy renders the events server-side as HTML cards
3. `schedule-ssr.js` handles client-side filtering (type, year, facilitator, location)

**Features:**
- Automatic date formatting (European DD.MM.YYYY format)
- Status badges with color coding
- Advanced filtering system (type, year, facilitator, location)
- Combined filter support
- Future/past event sorting (future events first, ascending; past events descending)
- Responsive card layout
- Loading skeleton and error handling

---

## Theme System

There isn't one. The site had seven switchable themes and a
`theme-switcher.js` module; both were dropped when colour moved behind the
tokens described under [Color Palette & Design System](#color-palette--design-system).
A visitor sees one scheme, and it is the one compiled into the stylesheet.

The colour planner — an on-page switcher, 22 schemes tagged by family, and a
generator that gates each against fourteen WCAG contrast pairs — still exists on
the `new_color_scheme` branch, where schemes are judged before one is brought
here.

---

## SEO & Deployment

### Domain

Site deploys to `transpersonal-training.com`. `pathPrefix` is `"/"`.

### Meta Tags

SEO meta tags (title, description, canonical URL, Open Graph, Twitter Cards) are generated through `eleventy-plugin-seo`.

Implementation:
- Plugin registration: `.eleventy.js`
- Global defaults: `src/_data/seo.js`
- Rendering hook in shared layout: `src/_includes/base.njk`
- Page-level overrides via front matter: `title`, `description`, `author`, `image`, `ogtype`

Compatibility note:
- Existing pages that still use `description` and `ogType` continue to work because the base layout maps them to the plugin inputs.

### OG Image

Fallback OG image: `src/assets/images/og-default.jpg`

Blog note:
- Blog posts can override the fallback image with a page-level `image` field in front matter.
- `src/_includes/blog_article.njk` also reuses that same `image` value for the article hero when present.

### Sitemap

A sitemap is generated and should be submitted to Google Search Console at:
`https://transpersonal-training.com/sitemap.xml`

---

## Training Programme — Commitment & Roles

### Structure

| Level | Duration | Focus |
|-------|----------|-------|
| Level 1 | 1 year | Self Development |
| Level 2 | 1.5 years | Counselling Skills |
| Level 3 | 1.5 years | Psychotherapy Skills |

### Weekly Commitment

- **Online Lessons:** 2 hours/week (40 lessons/year = 80 hours)
- **Peer Group Meetings:** bi-weekly (from Level 2: 20 sessions, ~2 hours each)

### Personal Development

- **Therapy:** 10h (L1) + 20h (L2) + 20h (L3) from a Transpersonal Therapist
- **Group Coaching:** monthly transpersonal therapy group, facilitated by a school graduate
- **Residential Weekends:** 4 per year (30h each = 120h/year = 480h total)
- **Additional Development:** 150h (conferences, summer school, retreats)
- **Holotropic Breathwork:** 40 sessions total

### Supervision

**School requirements:**
- 50h supervision for transpersonal psychotherapy practice
- 50h sessions with model clients

**EUROTAS requirements:**
- 150h supervision (50h L2 + 100h L3)
- 300h clinical practice/internships

---

## Transpersonal Psychology — Overview

Transpersonal psychology is a branch of psychology that integrates the spiritual and transcendent aspects of human experience with the framework of modern psychology. It extends beyond conventional psychological models by incorporating states of consciousness, peak experiences, mystical experiences, and other transformative processes.

Key areas include:
- States of consciousness and altered states
- Peak experiences and flow states
- Meditation, mindfulness, and contemplative practices
- Holotropic breathwork
- Jungian depth psychology
- Somatic and body-oriented approaches

The training programme prepares therapists to work with these dimensions in clinical practice, combining evidence-based approaches with spiritual sensitivity.

---

## Refactoring History

### Tag: v1.0.0-refactored

Completed refactoring phases:

| Phase | Description | Impact |
|-------|-------------|--------|
| Phase 1 | Removed duplicate HTML files | ~14,939 lines removed |
| Phase 2 | CSS organized + local Tailwind build | 3.5MB → 23KB |
| Phase 3 | JavaScript modularized (ES6 modules) | Clean module structure |
| Phase 4 | Assets organized into src/assets/ | Consistent media handling |
| Phase 5 | Legacy files cleaned up | Duplicates removed |

### Build-Time Migration (Phase 3 — Cleanup)

- ✅ Legacy root files removed (`teachers.html`, `style.css`, `schedule-app.js`, `schedule_data.csv`)
- ✅ Old `schedule.js` removed (replaced by `schedule-ssr.js`)
- ✅ CSS consolidated into single `main.css`
- ✅ Cache fallback added to `scheduleEvents.js` and `lectureEvents.js`
- ✅ Daily cron rebuild + webhook trigger added to deploy workflow

---

## Curriculum JSON Endpoint

Script: `docs/googlescripts/curriculum-json-apps-script.js`

The Apps Script deployed as a **Web App** on the Curriculum spreadsheet. Its `doGet`
is a router over two routes:

| Route | Returns |
|-------|---------|
| `…/exec` | the whole curriculum as hierarchical JSON — what `src/_data/curriculumData.js` fetches at build time (falling back to `curriculumData.cache.json` if the request fails) |
| `…/exec?format=pdf` | the curriculum as a downloadable PDF — see [Curriculum PDF Download](#curriculum-pdf-download-website) |

The parser itself lives in `buildCurriculumTree()` so the PDF route can reuse it
instead of carrying its own copy.

It shares its parser with the PDF generator below: `COL`, `readShow`, `classifyRow`,
`buildItem` and `parseLevelTopic` must stay identical in both files, or the PDFs and
the website will disagree about the same spreadsheet.

**After any edit: Deploy → Manage deployments → ✎ → Version: *New version*.** Without
a new version the published URL keeps serving the old code and the site never sees
the change. Verify the output first with **Preview JSON data** in the PDF script's menu.

---

## Curriculum PDF Generator

Script: `docs/googlescripts/curriculum-pdf-apps-script.js`

A Google Apps Script that adds a **📄 Curriculum Tools** menu to the Curriculum Google Spreadsheet, allowing you to generate and download PDF documents directly from the spreadsheet data.

### Setup

1. Open the **Curriculum Spreadsheet** in Google Sheets
2. Go to **Extensions → Apps Script**
3. Delete any existing code (or create a new `.gs` file)
4. Copy and paste the entire contents of `docs/googlescripts/curriculum-pdf-apps-script.js`
5. Save (Ctrl+S)
6. Reload the spreadsheet — a **📄 Curriculum Tools** menu will appear in the menu bar
7. First use will prompt for Google authorization (access to Drive & Docs)

### Menu Options

| Action | Description |
|--------|-------------|
| **Generate Curriculum PDF (detailed)** | Full curriculum: cover page, table of contents, all modules with descriptions, sub-modules, hours breakdown, teachers, teaching strategy |
| **Generate Program PDF (summary)** | Marketing overview: summary table by level, concise module list, experiential components |
| **Preview JSON data** | Shows the parsed hierarchical JSON in a dialog (for debugging) |

### How It Works

1. Parses the spreadsheet into hierarchical JSON: **Levels → Sections → Modules → SubModules**
2. Creates a temporary Google Doc with professional formatting (colors per level, styled tables)
3. Exports the Doc as PDF
4. Saves the PDF in the **same Google Drive folder** as the spreadsheet
5. Shows a dialog with a download link
6. Deletes the temporary Google Doc

### Spreadsheet Structure Requirements

The script expects these columns in order (A–Q):

| Column | Header |
|--------|--------|
| A | Level |
| B | Year |
| C | #Module |
| D | Topic / Activity Focus |
| E | Desc. |
| F | Teaching strategy |
| G | Hours |
| H | Theory |
| I | Group Therapy/supervision |
| J | Breathwork |
| K | Seminar |
| L | Delivery Format |
| M | EAP/EUROTAS Category |
| N | Core Teacher |
| O | Guest Teacher |
| P | Compulsory |
| Q | Show on website |

**Column Q — Show on website.** Read by both the PDF script and the website build
(`src/_data/curriculumData.js`), which drops any row set to `FALSE` — module,
sub-module, experiential item, whole section or whole level. A **blank cell keeps the
row visible**, so nothing disappears from the site by omission; type `FALSE` only in
the rows you want hidden. If you use checkboxes instead, note that an unticked box
exports as `false` and therefore hides the row, so every published row must be ticked.
The PDFs ignore the flag by default — flip `PDF_RESPECTS_SHOW_ON_WEBSITE` to `true`
to filter them too.

New columns must be appended at the **end**: the scripts map columns by fixed index,
so inserting one mid-table shifts everything after it.

Row classification:
- **Level headers** — Level = "L1", Topic = "L1: SELF DEVELOPMENT"
- **Section headers** — Level set, no module number, no delivery format (e.g. "ONLINE LESSONS")
- **Modules** — Module = integer (1, 2, 3…)
- **Sub-modules** — Module = decimal (1.1, 1.2…)
- **Cross-module activities** — Module = range (1-4, 4-9…)
- **Standalone items** — No module, has delivery format (e.g. exams)
- **Special notes** — Level = "L1.1" (decimal level)

### Notes

- The previous version of the PDF will be **trashed** (moved to bin) on re-generation
- PDF generation takes ~10-20 seconds depending on data volume
- Colors: L1 = green, L2 = blue, L3 = brown/gold

---

### Performance Metrics

| Metric | Value |
|--------|-------|
| CSS Build | ~420ms |
| Eleventy Build | ~180ms (6+ pages) |
| Total Build | ~600ms |
| CSS (minified) | 23KB (99.3% reduction from CDN) |
| JS main.js | ~700 bytes |
| JS modules total | ~4KB |
| JS schedule page | 17KB |

### Known Issues

- **Browserslist outdated warning** — fix with `npx update-browserslist-db@latest`
  ([TODO task 59](TODO.md#task-59))

---

### Practice Client Status Chip Colors

Defined in `src/become-a-practice-client.html` via `if/elif` blocks (full class strings required for Tailwind JIT scanning).

| Status | Colour | Classes | Reasoning |
|--------|--------|---------|-----------|
| **Active** | Emerald green | `bg-emerald-100 text-emerald-700` | Currently in training — a status tone, deliberately outside the palette |
| **Approved** | Paper | `bg-[color:var(--c-paper-2)] text-[color:var(--c-heading)]` | Accepted — quiet, in the page's own colours |
| **Pending** | Accent | `bg-[color:var(--c-acc-20)] text-[color:var(--c-sec)]` | Waiting — the CTA gold, held back |
| **On Hold** | Orange | `bg-orange-100 text-orange-700` | Paused — a gentle warning, again a status tone |
| **Completed** | Deep | `bg-[color:var(--c-deep-10)] text-[color:var(--c-heading)]` | Finished — settled, distinct from active |

---

*Last updated: June 2026*

---

## Curriculum PDF Download (website)

Script: `docs/googlescripts/curriculum-pdf-download-apps-script.js`

The **Download PDF** button in the hero of `/curriculum/` links to the JSON web app
with `?format=pdf`. The URL is built in `src/_data/curriculumData.js` and reaches the
template as `curriculumData.pdfUrl`, so it can never drift from the JSON endpoint.

### What the visitor gets

A PDF built from the same spreadsheet rows as the page, filtered and grouped the same
way, laid out to follow it: title block, *Our Hero Journey*, then per level the
certificate box, the lessons (with their topic breakdowns), the experiential work and
the examinations.

### Why the URL doesn't just return the file

An Apps Script web app can only answer with text or HTML — it cannot stream a binary
body, so **no `/exec` URL can hand a browser a PDF directly**. This script instead
builds the file, keeps it on the school's Drive shared "anyone with the link", and
returns a page that bounces the browser to Drive's download URL. The visitor sees a
tab open for a moment before the download starts.

`&mode=url` returns `{"url": …}` as JSON instead, for a caller that would rather do
the redirect itself.

### Built once, not per click

Each request fingerprints the curriculum content plus `WEB_PDF.RENDER_VERSION`. While
the fingerprint is unchanged the same Drive file is served, so repeat downloads are
instant and Drive doesn't fill with copies; the first click after a spreadsheet edit
rebuilds it (a few seconds). `&refresh=1` forces a rebuild.

### Setup

1. Curriculum spreadsheet → **Extensions → Apps Script**
2. **+ → Script**, name it `curriculum-pdf-download`, paste the file
3. Update the JSON script from `curriculum-json-apps-script.js` (its `doGet` is now
   the router, and the parser has moved into `buildCurriculumTree()`)
4. Run **`webPdfWarmUp()`** once from the editor and accept the Drive/Docs
   permissions — the web app runs as you, but new scopes must be granted
   interactively once, or every `?format=pdf` request fails
5. **Deploy → Manage deployments → ✎ → Version: *New version***
6. Open `…/exec?format=pdf` in a browser to check the download

### Kept in sync by hand

`WEB_PDF.SUBTITLE` and `WEB_PDF_CERTIFICATES` mirror the hero subtitle and the
"What you earn" boxes in `src/curriculum.html`; `webPdfModel_()` mirrors the grouping
rules in `src/_data/curriculumData.js`. Change one, change the other, or the PDF and
the page will disagree.

### Not the same as the menu PDFs

The **📄 Curriculum Tools** menu above stays as it is: those are the complete internal
documents, generated by hand and ignoring the "Show on website" column. This one is
the public document and respects it.
