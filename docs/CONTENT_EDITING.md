# Content Editing Guide

All editorial content on this site is stored as Markdown files inside `src/content/`. You can edit them directly — the site will rebuild automatically on the next deployment (or live in dev mode).

---

## Folder Structure

Each folder maps to one page, named beside it. A file only appears on the site if its page loads
it — see [How a page loads its content](#how-a-page-loads-its-content) below.

- [**home/**](../src/content/home/) → [`src/index.html`](../src/index.html)
  - [welcome.md](../src/content/home/welcome.md) — the welcome paragraphs (no front matter, prose only)
  - [quote.md](../src/content/home/quote.md) — the pull-quote box (`label`, `quote`, `attribution`)
  - [**cards/**](../src/content/home/cards/) — ⚠️ **orphaned.** The homepage stopped rendering these
    three cards and now links to the School Pillars page instead. Editing them changes nothing on the
    site. Keep or delete, but do not expect them to appear

- [**what-is-transpersonal-psychology/**](../src/content/what-is-transpersonal-psychology/) → [`src/what-is-transpersonal-psychology.html`](../src/what-is-transpersonal-psychology.html)
  - [00-abstract.md](../src/content/what-is-transpersonal-psychology/00-abstract.md) — the opening abstract (empty front matter, prose only)
  - [01-understanding-the-field.md](../src/content/what-is-transpersonal-psychology/01-understanding-the-field.md)
  - [02-science-and-spirit.md](../src/content/what-is-transpersonal-psychology/02-science-and-spirit.md) — includes a blockquote + source
  - [03-why-it-matters.md](../src/content/what-is-transpersonal-psychology/03-why-it-matters.md)

- [**training-overview/**](../src/content/training-overview/) → [`src/training-overview.html`](../src/training-overview.html)
  - [01-philosophy.md](../src/content/training-overview/01-philosophy.md)
  - [02-why-this-training.md](../src/content/training-overview/02-why-this-training.md) — **sectioned**: split on `###` headings
  - [03-program-overview.md](../src/content/training-overview/03-program-overview.md)
  - [04-eligibility.md](../src/content/training-overview/04-eligibility.md) — a list, plus the highlighted `note` box
  - [**commitment/**](../src/content/training-overview/commitment/) — four cards
    - [01-learning.md](../src/content/training-overview/commitment/01-learning.md)
    - [02-self-development.md](../src/content/training-overview/commitment/02-self-development.md)
    - [03-supervision.md](../src/content/training-overview/commitment/03-supervision.md) — two tracks, School and EUROTAS
    - [04-duration.md](../src/content/training-overview/commitment/04-duration.md)
  - [**admissions/**](../src/content/training-overview/admissions/) — one card per level
    - [01-level-1.md](../src/content/training-overview/admissions/01-level-1.md)
    - [02-level-2.md](../src/content/training-overview/admissions/02-level-2.md)
    - [03-level-3.md](../src/content/training-overview/admissions/03-level-3.md)

- [**techniques/**](../src/content/techniques/) → [`src/techniques.html`](../src/techniques.html), the **School Pillars** page
  - [00-intro.md](../src/content/techniques/00-intro.md) — page heading, kicker, and the trunk/pillars of the tree
  - [01-experiential.md](../src/content/techniques/01-experiential.md) — **sectioned** — Holotropic Breathwork & Experiential Work
  - [02-one-to-one.md](../src/content/techniques/02-one-to-one.md) — **sectioned** — Counselling & Psychotherapy Skills
  - [03-maps.md](../src/content/techniques/03-maps.md) — **sectioned** — Consciousness Maps & Research

- [**become-a-practice-client/**](../src/content/become-a-practice-client/) → [`src/become-a-practice-client.html`](../src/become-a-practice-client.html)
  - [**intro/**](../src/content/become-a-practice-client/intro/) — three icon cards
    - [01-counselling.md](../src/content/become-a-practice-client/intro/01-counselling.md)
    - [02-profiles.md](../src/content/become-a-practice-client/intro/02-profiles.md)
    - [03-breathwork.md](../src/content/become-a-practice-client/intro/03-breathwork.md)
  - [01-what-to-look-for.md](../src/content/become-a-practice-client/01-what-to-look-for.md)

- [**teachers/**](../src/content/teachers/) → [`src/teachers.html`](../src/teachers.html) — the intro block above each faculty group
  - [01-core-intro.md](../src/content/teachers/01-core-intro.md)
  - [02-guest-intro.md](../src/content/teachers/02-guest-intro.md)
  - [03-alumni-intro.md](../src/content/teachers/03-alumni-intro.md)

- [**sample-lesson/**](../src/content/sample-lesson/) → [`src/sample-lesson.html`](../src/sample-lesson.html)
  - [01-lesson.md](../src/content/sample-lesson/01-lesson.md) — everything about the video, so swapping
    the recording is a one-file edit. The file documents its own fields in comments; read those first
  - [02-transcript.md](../src/content/sample-lesson/02-transcript.md)

<a id="how-a-page-loads-its-content"></a>

### How a page loads its content

Three filters, defined in [.eleventy.js](../.eleventy.js). Which one a page uses decides how the
file is read, so it is worth knowing which you are editing:

| Filter | Reads | Used for |
|---|---|---|
| `pageContent` | one file → front matter + rendered body | most prose sections |
| `pageContentDir` | every `.md` in a folder, alphabetically | card sets — `commitment/`, `admissions/`, `intro/` |
| `pageSections` | one file, **split on `###` headings** into blocks | the School Pillars branches and "Why Is This Training for You?" |

A page loads its files by name. Adding a `.md` file to a folder read by `pageContentDir` makes it
appear; adding one anywhere else does nothing until a template asks for it.

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

## Editing Cards (Commitment, Admissions, Practice-Client Intro)

A card is one `.md` file in a folder the page loads with `pageContentDir`. Front matter carries the
structured bits, the body carries the description. From
[become-a-practice-client/intro/01-counselling.md](../src/content/become-a-practice-client/intro/01-counselling.md):

```markdown
---
icon: message-circle-heart
icon_color: text-science-blue-600
---

As a practice client, you can choose from available third-level students and contact
them directly for supervised sessions.
```

- `icon` — the [Lucide icon name](https://lucide.dev/icons/) (e.g. `wind`, `heart`, `compass`)
- `icon_color` — Tailwind text colour class for the icon
- Body text — the card description

**The three card folders do not share a schema.** Each template reads its own fields, so copy a
sibling file in the same folder rather than this example:

| Folder | Fields |
|---|---|
| [`become-a-practice-client/intro/`](../src/content/become-a-practice-client/intro/) | `icon`, `icon_color` |
| [`training-overview/commitment/`](../src/content/training-overview/commitment/) | `heading`, `icon`, `icon_color` — plus `school_track_heading` and `eurotas_track_heading` on the supervision card |
| [`training-overview/admissions/`](../src/content/training-overview/admissions/) | `level`, `label`, `who_can_apply`, `note_anchor` — no icon |

A field the template does not read is silently ignored: it will not error, it simply will not appear.

To add a card, create a new file in the same folder following the naming convention
(`05-my-card.md`). Files load alphabetically, so the number prefix sets the order. This works only
in folders read by `pageContentDir` — see [the table above](#how-a-page-loads-its-content).

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

## Editing Sectioned Pages (School Pillars, "Why Is This Training for You?")

The three School Pillars files and `02-why-this-training.md` work differently from everything else:
the body is **split on `###` headings**, and each block becomes one expandable item on the page.

Inside a block, three lines are special. They are lifted out of the prose and handed to the template
separately, so they render once, in their own place — not twice:

```markdown
---
icons:
  Holotropic Breathwork: wind
---

### Holotropic Breathwork
> The heart of the training: accelerated breathing, evocative music and focused bodywork.
![Mandala drawing during a session](/assets/images/Techniques/technique-mandala-breathwork "object-[50%_70%]")

The heart of the experiential training. Developed by Stanislav Grof, it combines accelerated
breathing, evocative music and focused bodywork to enter non-ordinary states of consciousness.
```

| Line | Becomes |
|---|---|
| `### Title` | the block's heading, and the key that looks up its icon in `icons:` |
| `> One sentence.` | the **preview** shown while the block is folded shut — write one sentence, not a paragraph |
| `*(Name, Name)*` | the teachers credited on the block, if any |
| `![alt](/path "object-position")` | the block's image |

Two things to get right in the image line:

- **The path has no file extension.** Write `/assets/images/Techniques/technique-mandala-breathwork`
  and the template builds the `<picture>` with `.webp` and `.jpg` itself. Adding `.jpg` breaks it.
- The quoted part is a Tailwind `object-position` class — `object-center` by default. Use it to move
  the crop when a face or focal point sits off-centre, e.g. `object-[50%_70%]` to favour the lower half.

Anything before the first `###` is the section's intro. Adding a new `###` block adds a new item to
the page; deleting one removes it. Order follows the file.

---

## Editing Lists (Eligibility, Admissions)

Use standard Markdown lists in the body:

Example from [04-eligibility.md](../src/content/training-overview/04-eligibility.md):

```markdown
---
heading: Who This Training Is For
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

- To **add a card** in a folder read by `pageContentDir` (`commitment/`, `admissions/`, `intro/`): create a new `.md` file with the next prefix number.
- To **remove a card**: delete the file.
- To **reorder cards**: rename the files — they load alphabetically.
- To **add a block** to a sectioned file (School Pillars, "Why Is This Training for You?"): add a `###` heading; see [Editing Sectioned Pages](#editing-sectioned-pages-school-pillars-why-is-this-training-for-you).
- To **add a whole new section** to a page: this needs the page template (`.html` in `src/`), because a new file is only read once a template asks for it. See [DOCUMENTATION.md](DOCUMENTATION.md) for the build system overview.

---

## Pages With Content in the Template

Not every page reads from `src/content/`. Two kinds are missing, for different reasons.

**Driven by Google Sheets at build time** — the body is data, not prose, so there is nothing to
migrate except the static intro paragraphs:

| Page | File |
|------|------|
| Curriculum | [`src/curriculum.html`](../src/curriculum.html) |
| Schedule | [`src/schedule.html`](../src/schedule.html) |
| Lectures Schedule | [`src/lectures-schedule.html`](../src/lectures-schedule.html) |

Moving those intros into `src/content/` is [TODO task 58](TODO.md#task-58).

**Written directly in the template** — editing these means editing the HTML:
[`apply.html`](../src/apply.html), [`venues.html`](../src/venues.html),
[`collaborations.html`](../src/collaborations.html), [`resources.html`](../src/resources.html),
[`monthly-call.html`](../src/monthly-call.html), [`legal-notice.html`](../src/legal-notice.html)
and [`404.html`](../src/404.html). Ask before restructuring any of them — several carry
form logic or generated data alongside the prose.
