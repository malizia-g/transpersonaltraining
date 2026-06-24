# Content Editing Guide

All editorial content on this site is stored as Markdown files inside `src/content/`. You can edit them directly — the site will rebuild automatically on the next deployment (or live in dev mode).

---

## Folder Structure

```
src/content/
├── home/                          ← Homepage
│   ├── welcome.md                 ← Welcome section paragraphs
│   ├── for-you.md                 ← "Is this programme for you?" list
│   ├── quote.md                   ← Pull quote box
│   └── cards/
│       ├── 01-mind-body-spirit.md
│       ├── 02-holotropic-breathwork.md
│       └── 03-accredited-qualification.md
│
├── what-is-transpersonal-psychology/
│   ├── 01-understanding-the-field.md
│   ├── 02-science-and-spirit.md    ← Includes blockquote + source
│   └── 03-why-it-matters.md
│
├── transpersonal-therapy/
│   ├── 01-what-is.md
│   └── principles/
│       ├── 01-holistic.md
│       ├── 02-transcendent.md
│       ├── 03-inner-healing.md
│       └── 04-spiritual.md
│
├── training-overview/
│   ├── 01-philosophy.md
│   ├── 02-program-overview.md
│   ├── 03-eligibility.md
│   ├── commitment/
│   │   ├── 01-learning.md
│   │   ├── 02-self-development.md
│   │   ├── 03-supervision.md
│   │   └── 04-duration.md
│   └── admissions/
│       ├── 01-level-1.md
│       ├── 02-level-2.md
│       └── 03-level-3.md
│
├── techniques/
│   ├── 00-intro.md
│   └── cards/
│       ├── 01-breathwork.md
│       ├── 02-gestalt.md
│       ├── 03-somatic.md
│       └── 04-shamanic.md
│
├── become-a-client-model/
│   ├── intro/
│   │   ├── 01-counselling.md
│   │   ├── 02-profiles.md
│   │   └── 03-breathwork.md
│   ├── 01-what-to-look-for.md
│   └── 02-cta.md
│
└── teachers/
    ├── 01-core-intro.md
    └── 02-guest-intro.md
```

---

## File Format

Each file may have two parts separated by `---`:

```
---
heading: Section Title
some_field: Some value
---

Body text written in **Markdown**.
```

- Everything between the `---` delimiters is **front matter** (structured data in YAML format).
- Everything below the second `---` is **body text** in Markdown.

---

## Editing Prose Sections

Open the relevant file and edit the body text directly. Standard Markdown is supported:

```markdown
---
heading: Why It Matters Today
---

Contemporary transpersonal work supports people who seek **not only** symptom reduction,
but deeper integration and transformation.

It is especially relevant when psychological healing and spiritual questions overlap.
```

Paragraphs are separated by a blank line. The heading in the front matter (`heading:`) controls what appears as the section title on the page.

---

## Editing Cards (Technique Cards, Principle Cards, Home Cards)

Cards use front matter for the icon and title, and body text for the description:

```markdown
---
icon: wind
icon_color: text-accent-teal-600
icon_bg: bg-accent-teal-100
title: Breathwork Psychotechnology
---

Holotropic and integrative breathwork techniques for accessing non-ordinary states
of consciousness and deep healing.
```

- `icon` — the [Lucide icon name](https://lucide.dev/icons/) (e.g. `wind`, `heart`, `compass`)
- `icon_color` — Tailwind text colour class for the icon
- `icon_bg` — Tailwind background class for the icon container
- `title` — displayed as the card heading
- Body text — the card description

To add a new card in a folder (e.g. a 5th technique), create a new file following the same naming convention (`05-my-technique.md`). Files are loaded in alphabetical order.

---

## Editing Blockquotes

The `02-science-and-spirit.md` file uses front matter to store the blockquote and its source separately from the surrounding prose:

```markdown
---
heading: A Bridge Between Science and Spirit
blockquote: "The quoted text goes here..."
blockquote_source: Source name, publication
---

Surrounding paragraph text goes here.
```

---

## Editing Lists (Eligibility, Admissions, For-You)

Use standard Markdown lists in the body:

```markdown
---
heading: Eligibility
subheading: General Eligibility (All Levels)
intro: "Applicants should demonstrate:"
note: "Warning text shown in the highlighted note box."
---

- First requirement
- Second requirement
- Third requirement
```

Numbered lists use `1.`, `2.`, `3.` etc.
Nested lists use indentation (two spaces or a tab).

---

## YAML Syntax Rules

When writing front matter values, follow these rules to avoid build errors:

| Situation | Correct syntax |
|-----------|----------------|
| Simple text | `heading: Simple text` |
| Text with colon | `heading: "Text with: colon"` |
| Text with quotes | `heading: 'It''s fine'` |
| Multi-line | Use `\|` for block text (see below) |

```yaml
---
long_text: |
  This is a multi-line
  value in YAML.
---
```

---

## Adding or Removing Sections

The page template controls the layout structure (HTML, CSS classes). The content files control what text appears inside.

- To **add a new card** in a `cards/` or similar directory: create a new `.md` file with the correct prefix number.
- To **remove a card**: delete the file.
- To **reorder cards**: rename the files (they are loaded alphabetically).
- To **add a new section** to a page: this requires editing the page template (`.html` file in `src/`). See `docs/DOCUMENTATION.md` for the build system overview.

---

## Pages Not Yet Migrated

The following pages still have their content embedded directly in their templates. They are complex, data-driven pages:

| Page | File | Reason |
|------|------|---------|
| Curriculum | `src/curriculum.html` | Driven by Google Sheets at build time |
| Schedule | `src/schedule.html` | Driven by Google Sheets at build time |
| Lectures Schedule | `src/lectures-schedule.html` | Driven by Google Sheets at build time |

For these pages, static intro text can be migrated to `src/content/` in a future iteration.
