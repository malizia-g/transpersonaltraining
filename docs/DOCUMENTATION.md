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
12. [Refactoring History](#refactoring-history)

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
- Push to `main` (and `test-11ty`, `testImages` during development)
- Daily cron at `0 6 * * *` (06:00 UTC / 08:00 CET)
- Manual dispatch (`workflow_dispatch`)
- Webhook from Google Sheets (`repository_dispatch: rebuild-schedule`)

Deploys to the `deploy` branch via `peaceiris/actions-gh-pages`.

---

## Directory Structure

```
transpersonaltraining/
├── src/                          # Source (Eleventy input)
│   ├── _includes/               # Nunjucks templates
│   │   ├── base.njk            # Main layout
│   │   ├── navigation.njk      # Global navbar
│   │   └── footer.njk          # Global footer
│   │
│   ├── _data/                  # Structured data
│   │   ├── coreTeachers.json   # Core teacher list
│   │   ├── guestTeachers.json  # Guest teacher list
│   │   ├── scheduleEvents.js   # Fetch schedule from Google Sheets (with cache fallback)
│   │   ├── lectureEvents.js    # Fetch lectures from Google Sheets (with cache fallback)
│   │   ├── scheduleFilters.js  # Schedule filter options
│   │   ├── lectureFilters.js   # Lecture filter options
│   │   ├── teachers.js         # Teachers data
│   │   └── bios/*.md           # Teacher biographies in Markdown
│   │
│   ├── styles/
│   │   └── main.css            # All styles consolidated (Tailwind directives + component styles)
│   │
│   ├── scripts/                # Modular JavaScript
│   │   ├── main.js            # Entry point
│   │   ├── modules/           # Reusable core modules
│   │   │   ├── icons.js       # Lucide icon management
│   │   │   ├── navigation.js  # Mobile menu, scroll navbar
│   │   │   └── theme-switcher.js # Theme system
│   │   └── pages/             # Page-specific scripts
│   │       ├── schedule-ssr.js # Schedule filters (SSR)
│   │       ├── lectures-schedule.js # Lecture filters
│   │       └── training.js    # Vine animation
│   │
│   ├── assets/                # Media files
│   │   ├── images/
│   │   └── videos/
│   │
│   ├── blog/                  # Blog posts (Markdown)
│   │   └── *.md
│   │
│   └── *.html                 # Pages with Eleventy front matter
│
├── _site/                     # Build output (gitignored)
├── docs/                      # Project documentation
├── TESTS/                     # Experimental HTML pages
├── .eleventy.js               # Eleventy config
├── tailwind.config.js         # Tailwind config
├── postcss.config.js          # PostCSS config
└── package.json               # Dependencies and scripts
```

---

## Color Palette & Design System

### Philosophy

**Science with Soul** — combines scientific credibility (blue) with human warmth (yellow-tinted neutrals) and mystic depth (indigo & iris).

### Primary Colors

| Color | Hex | Role | Psychology |
|-------|-----|------|------------|
| Scientific Blue | `#1E40AF` | Primary brand, buttons, authority | Trust, stability, intelligence |
| Deep Indigo | `#312E81` | Secondary headings, depth | Wisdom, rich authority |

### Accent Colors

| Color | Hex | Role | Psychology |
|-------|-----|------|------------|
| Warm Yellow | `#FCD34D` | CTA buttons, badges, warmth | Accessibility, optimism, humanity |
| Calm Teal | `#2DD4BF` | Card borders, secondary accent | Healing, growth, balance |

### Neutral Warmth

| Color | Hex | Role |
|-------|-----|------|
| Off-white | `#FFFEF9` | Primary background |
| Warm cream | `#FAF8F3` | Secondary background |
| Warm gray 600–700 | — | Body text |

### Iris / Mystical Section

Violet-Indigo gradient (Violet-500 → Indigo-500) — used for contact/CTA sections, guest teacher badges, and transpersonal section backgrounds.

### Tailwind Color Classes

```
text-science-blue-*  / bg-science-blue-*        → Primary blue
text-indigo-deep-*   / bg-indigo-deep-*          → Headings/depth
text-warm-yellow-*   / bg-warm-yellow-*          → Accent/CTA
text-accent-teal-*   / bg-accent-teal-*          → Secondary accent
text-neutral-warm-*  / bg-neutral-warm-*         → Text/backgrounds
text-violet-*        / bg-violet-*               → Mystical sections
```

### CSS Variables

```css
--color-primary:      #1E40AF;
--color-indigo-deep:  #312E81;
--color-cta:          #FCD34D;
--color-accent-teal:  #2DD4BF;
```

### Component Color Mapping

| Component | Background | Text/Accent |
|-----------|-----------|-------------|
| Hero | Blue 900 → 800 gradient | Warm Yellow CTA, white secondary |
| Welcome | Neutral Warm 50 | Science Blue 700 heading |
| Feature Cards | White, colored top border (Teal / Blue / Yellow) | Science Blue 700 heading |
| Contact CTA | Science Blue 700 → 600 gradient | Warm Yellow CTA button |

### Brand Consistency Checklist

- All headings: `text-science-blue-700` or darker
- All CTA buttons: `bg-warm-yellow-200`
- Body text: `text-neutral-warm-700` or `text-science-blue-800`
- Section backgrounds: `bg-neutral-warm-50` or lighter
- Accent elements: `accent-teal-*`
- Hover states: increase yellow saturation (300 level)
- Card borders: color variation (blue, teal, yellow)

### Accessibility

- White buttons on blue backgrounds: 9.6:1+ contrast ratio
- All text meets WCAG AA standards
- Not relying solely on color (color-blind friendly)

---

## Google Sheets Integration

### How It Works

Schedule and lecture data is fetched from Google Sheets **at build time** (not client-side). Two Eleventy data files handle this:

- `src/_data/scheduleEvents.js` — fetches schedule events
- `src/_data/lectureEvents.js` — fetches lecture events
- `src/_data/clientModels.js` — fetches client model/student therapist records

Both use a **cache fallback** mechanism:
1. On successful fetch → save to `*.cache.json`
2. On fetch failure → read from cache
3. If no cache available → return `[]`

### Procedure For Adding New Student Profiles

To add a new student to the “Become a Client Model” page:

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

Cache files are gitignored locally but committed by GitHub Actions.

### Google Sheets API URL

The spreadsheet data is exported as JSON via a Google Apps Script web app. The URL is stored in:
- Locally: `.env` file (`GOOGLE_SHEET_JSON_URL`)
- CI/CD: GitHub Secrets

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

**Full setup guide:** See `TESTS/Instructions/GOOGLE_APPS_SCRIPT_SETUP.md` (archived reference)

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

7 dynamic color themes:

| Theme | Name |
|-------|------|
| `default` | School Lavender (light violet) |
| `iris` | Deep Iris (dark violet) |
| `blue` | Scientific Blue |
| `ocean` | Ocean Depth (teal) |
| `forest` | Deep Forest (green) |
| `earth` | Burnt Earth (terracotta) |
| `alchemy` | Alchemy (magenta) |

Implementation:
- CSS variables for dynamic colors
- LocalStorage for persisting preference
- Theme switcher button fixed bottom-right
- JS module: `src/scripts/modules/theme-switcher.js`

---

## SEO & Deployment

### Domain

Site deploys to `transpersonal-training.com`. `pathPrefix` is `"/"`.

### Meta Tags

SEO meta tags (Open Graph, Twitter Cards, canonical URL, description) are configured in `src/_includes/base.njk` using front matter variables `description` and `ogType`.

### OG Image

Needs to be created: `src/assets/images/og-default.jpg` (1200×630px)

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

---

*Last updated: March 2026*
