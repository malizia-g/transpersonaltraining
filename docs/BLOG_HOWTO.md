# How to create a new Blog post

Guide for adding articles to the blog directly from GitHub, without development tools.

---

## Relevant folder structure

```
src/
├── blog/
│   ├── article-name.md           ← blog posts (one per file)
│   └── blog.11tydata.js          ← automatic configuration (do not touch)
└── assets/
    └── images/
        └── blog/                 ← blog article images
```

---

## 1. Upload an image (optional)

Before creating the post, upload the image to GitHub:

1. Go to the `src/assets/images/blog/` folder
2. Click **Add file → Upload files**
3. Drag the image file (JPG or PNG, preferably 800×600 px or larger)
4. Click **Commit changes**

> Note the exact file name (e.g. `meditation.jpg`): you will need it in the frontmatter.

---

## 2. Create the post's Markdown file

1. Go to the `src/blog/` folder
2. Click **Add file → Create new file**
3. Name the file using the format `article-title.md`
   - Use lowercase letters, hyphens instead of spaces, no accents
   - The file name becomes the URL: `article-title.md` → `/blog/article-title/`

---

## 3. File structure

Every post consists of two parts: the **frontmatter** (metadata) and the **content** in Markdown.

### Frontmatter — required fields

```yaml
---
title: "The article title"
author: First Last
date: 2026-06-23
description: "A sentence summarising the article (used in SEO meta tags and the blog list)."
image: image-name.jpg
tags: [keyword, another-keyword, third-keyword]
---
```

| Field | Required | Notes |
|-------|:---:|-------|
| `title` | ✅ | Title shown on the page and in search engines |
| `author` | ✅ | Author's full name |
| `date` | ✅ | Format `YYYY-MM-DD` |
| `description` | ✅ | Max ~160 characters, also used for SEO |
| `image` | ✅ | File name only (e.g. `meditation.jpg`), uploaded to `src/assets/images/blog/` |
| `tags` | ✅ | List of keywords used to filter articles |

### Frontmatter — optional fields

```yaml
authorUrl: https://authorwebsite.com/        # link on the author's name
source: Name of the original site            # if the article comes from another site
sourceUrl: https://originalsite.com/url      # URL of the original article
```

| Field | Notes |
|-------|-------|
| `authorUrl` | The author's name becomes a clickable link |
| `source` | Text shown in the "Originally published on …" badge |
| `sourceUrl` | Adds the badge to the article and "Via …" in the list. If present without `source`, uses the URL as text |

---

## 4. Content formatting

The content uses standard **Markdown** syntax. A few rules specific to this blog:

```markdown
**Bold text** → promoted to H1 heading (use only once, at the beginning)

*Italic text* → promoted to H2 subheading (use for sections)

Normal text → paragraph
```

### Recommended internal structure

```markdown
**Main section title**

*First subsection — Period or theme*

Paragraph text...

*Second subsection*

Paragraph text...
```

---

## 5. Complete example article

A ready-to-copy fictional post you can adapt.

---

**File:** `src/blog/mindfulness-and-transpersonal-psychology.md`

```markdown
---
title: "Mindfulness and Transpersonal Psychology: a natural alliance"
author: Manal Al-Hammadi
authorUrl: https://manalpsychotherapy.com/
date: 2026-07-01
description: "How mindfulness practices integrate with the transpersonal approach to foster deep and lasting transformation."
image: mindfulness-meditation.jpg
tags: [mindfulness, meditation, transpersonal psychology, transformation, awareness]
---

**Mindfulness and Transpersonal Psychology: a natural alliance**

Mindfulness has become one of the most widespread terms in contemporary mental health. But what happens when we look at it through the lens of transpersonal psychology? The answer is that the two perspectives are not only compatible — they reinforce each other in ways that deserve careful exploration.

*The roots of mindfulness in contemplative experience*

Jon Kabat-Zinn, who introduced mindfulness to Western medicine through the MBSR programme in the 1970s, always acknowledged his debt to Buddhist traditions. Transpersonal psychology shares this openness: it regards contemplative practices not as spiritual folklore, but as refined methodologies for exploring layers of consciousness that conventional psychology struggles to reach.

*What the transpersonal perspective adds*

Where a standard clinical approach uses mindfulness primarily as a tool for emotional regulation — with solid, well-documented results — transpersonal psychology also sees it as a gateway to experiences of self-expansion. Attention to the present moment is not just an anti-stress technique: it can become the entry point into expanded states of consciousness, a sense of interconnectedness, and deep identity transformation.

*Mindfulness as practice and as orientation*

One of the most practical teachings that the transpersonal perspective offers to mindfulness work is the distinction between mindfulness as a technique (sitting in silence for twenty minutes a day) and mindfulness as a continuous orientation to life. The transpersonal therapist encourages the client to bring this quality of presence not only to the meditation cushion, but into relationships, work, and moments of crisis. It is in this continuity that transformation occurs.

*Implications for training*

A good transpersonal psychotherapy training programme today includes mindfulness not as an add-on module, but as a thread running through the entire curriculum. The future practitioner learns to practise it personally before offering it to clients — because no technique is transmitted through theory alone.
```

---

## 6. Checking after publication

After committing to GitHub, the site rebuilds automatically (via CI/CD). Within a few minutes you can check:

- The article list at `/blog/`
- The individual article page at `/blog/file-name/`

If the image does not appear, verify that the name in the `image:` field matches **exactly** the name of the file uploaded to `src/assets/images/blog/` (including upper and lower case).
