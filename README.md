# transpersonaltraining

Professional transpersonal psychotherapy training website built with Eleventy + Tailwind CSS.

## Quick Start

```bash
npm install
npm run dev        # Development (watch mode)
npm run build      # Production build
```

## How to Add an Article

To add a new blog article:

1. Create a new Markdown file inside `src/blog/`.
2. Add the required front matter at the top of the file:
	- `title`
	- `author`
	- `date`
	- `description`
	- `image`
	- `tags`
3. Place the article image inside `src/assets/images/`.
4. Use the image path in the `image` field, for example: `/assets/images/my-new-article.jpg`
5. Write the article content below the front matter in Markdown.
6. Run `npm run build` to make sure the article passes validation and is generated correctly.

Example:

```md
---
title: "My New Article"
author: Your Name
date: 2026-02-14
description: "A short summary of the article for SEO and blog previews."
image: /assets/images/my-new-article.jpg
tags: [transpersonal, psychology, training]
---

Your article content starts here.
```

Notes:

- The `description` field is required for SEO and blog previews.
- The `image` field is required for the article card and social sharing metadata.
- Tags should be written as a list inside square brackets.
- Use a short, clear description because it is reused in search and social previews.

## Documentation

All project documentation is in the [`docs/`](docs/) folder:

| File | Description |
|------|-------------|
| [DOCUMENTATION.md](docs/DOCUMENTATION.md) | Architecture, build process, design system, integrations |
| [FUTURE_IDEAS.md](docs/FUTURE_IDEAS.md) | Planned improvements and proposals |
| [PABLO_TASKS.md](docs/PABLO_TASKS.md) | Pending manual tasks (DNS, FTP, Google setup) |

## Stack

- **Eleventy** 3.1.2 — Static site generator
- **Tailwind CSS** 3.4.19 — Utility-first CSS
- **Nunjucks** — Template engine
- **Lucide** v0.344.0 — Icon library (CDN)
- **Google Sheets** — Schedule/lecture data (fetched at build time)

## Deploy

Automated via GitHub Actions (`.github/workflows/deploy.yml`):
- Push to `main` → build and deploy
- Daily rebuild at 06:00 UTC
- Manual trigger from GitHub Actions or Google Sheets button

## Nature Background (image + video)

The hero section uses a royalty-free nature photo from Unsplash as fallback. An optional `<video>` element activates if a valid URL is provided. The video is hidden if the user prefers reduced motion.

### Recommended free sources
- [Coverr](https://coverr.co/) (video)
- [Pexels](https://www.pexels.com/videos/) (video)
- [Pixabay](https://pixabay.com/videos/) (video)
- [Unsplash](https://unsplash.com/) (images)

