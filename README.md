# transpersonaltraining

Professional transpersonal psychotherapy training website built with Eleventy + Tailwind CSS.

## Quick Start

```bash
npm install
npm run dev        # Development (watch mode)
npm run build      # Production build
```

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

