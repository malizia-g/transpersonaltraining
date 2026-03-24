# Future Ideas & Proposals

> Collection of planned improvements, research, and proposals for the Transpersonal Training website.

---

## Table of Contents

1. [CMS Integration — Comparison](#cms-integration--comparison)
2. [Google Docs → GitHub Pipeline](#google-docs--github-pipeline)
3. [FTP Deploy to Custom Hosting](#ftp-deploy-to-custom-hosting)
4. [Asset Optimization](#asset-optimization)
5. [Linting & Formatting](#linting--formatting)
6. [Performance Optimization](#performance-optimization)
7. [Advanced Build Pipeline](#advanced-build-pipeline)
8. [Testing](#testing)
9. [SEO & Accessibility Enhancements](#seo--accessibility-enhancements)
10. [TESTS/ Experimental Pages](#tests-experimental-pages)

---

## CMS Integration — Comparison

### The Problem

Need a way to edit content (teacher bios, courses, pages) without touching code. OAuth is an obstacle — solutions that avoid managing it are preferred.

### Options Without OAuth

| Solution | OAuth? | Setup Complexity | Who Edits |
|----------|--------|-----------------|-----------|
| **Google Docs Pipeline** | No | Medium (GAS + Action) | Anyone with Google Doc access |
| **Pages CMS** | Managed by them | Very low | GitHub account holders |
| **Sveltia CMS** | GitHub App (no server) | Low | GitHub account holders |
| **Decap CMS** | Requires OAuth server | High | GitHub account holders |
| **Keystatic** | Keystatic Cloud (no server) | Medium | GitHub account holders |

### Keystatic vs Pages CMS

| Criteria | Keystatic | Pages CMS |
|----------|-----------|-----------|
| Setup time | 30-60 min | 5-10 min |
| Auth | GitHub App (Keystatic Cloud free) or personal token | Fully managed (GitHub login) |
| Editing UI | Rich: typed forms, relations, rich-text editor | Simple: Markdown/JSON/YAML editors |
| Schema | Defined in TypeScript code | Defined in `.pages.yml` |
| Validation | Strong: required fields, types, selects, relations | Basic: follows file structure |
| Dependencies | Adds npm packages | Zero (only a YAML file) |
| Lock-in | Medium | Zero |
| Best for | Structured content, complex schemas | Quick start, zero maintenance |

### Recommendation

Start with **Pages CMS** (5 min setup, zero risk). If more structure/validation is needed later, migrate to **Keystatic**. Both work on repo files — migration is painless.

Example `.pages.yml`:
```yaml
content:
  - name: teachers
    label: Teacher Bios
    path: src/_data/bios
    filename: "{slug}.md"
    type: document
  - name: coreTeachers
    label: Core Teachers Data
    path: src/_data
    filename: coreTeachers.json
    type: file
```

### Sveltia CMS — Note

Drop-in replacement for Decap/Netlify CMS. Config already exists in `src/admin/`. Just change the `<script>` tag — provides free proxy auth without a server.

---

## Google Docs → GitHub Pipeline

### Concept

Manage site content (teacher bios, courses, pages) as Google Docs, auto-syncing them to the repo as `.md` files via a Google Apps Script + GitHub Actions pipeline.

### Architecture

```
Editor modifies Google Doc / Photo on Drive
        ↓
Content Registry (Google Sheet: type, id, doc_id, image_id, enabled)
        ↓
Click "📄 Sync Content & Rebuild" in spreadsheet menu
        ↓
GAS triggers GitHub Action (sync-content.yml) via workflow_dispatch
        ↓
Action calls GAS endpoint → receives JSON (HTML docs + base64 images)
        ↓
Action converts HTML→MD (pandoc) + decodes images
        ↓
Writes src/_data/bios/*.md + src/assets/images/teachers/*.jpg
        ↓
git commit + push → triggers deploy.yml → Eleventy build → deploy
```

### Content Registry (Google Sheet)

| Column | Description |
|--------|-------------|
| `type` | Destination folder (bio, course, etc.) |
| `id` | Filename (e.g., `tina-lindhard`) |
| `doc_id` | Google Doc ID |
| `image_id` | Google Drive file ID for photo |
| `enabled` | TRUE/FALSE |

### Checklist

- [ ] Create Google Docs for the 12 teachers
- [ ] Create Content Registry in the spreadsheet
- [ ] Write GAS code (endpoint + button)
- [ ] Create `sync-content.yml` workflow
- [ ] Update image paths in teacher JSON files
- [ ] End-to-end test

### Limits

- GAS: 6 MB response limit, ~50 MB execution — resize photos in GAS
- Alternative for heavy photos: direct download from Drive URL in the Action
- No OAuth needed: GAS accesses Docs/Drive natively

### Required GitHub Secrets

- `GAS_CONTENT_URL` — Web app endpoint URL
- `GAS_CONTENT_KEY` — Secret key for authentication

---

## FTP Deploy to Custom Hosting

### Steps

1. **Add GitHub Secrets:** `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`
2. **Add FTP deploy step** to `.github/workflows/deploy.yml`:

```yaml
- name: Deploy to Custom Hosting (FTP)
  uses: SamKirkland/FTP-Deploy-Action@4.3.0
  with:
    server: ${{ secrets.FTP_SERVER }}
    username: ${{ secrets.FTP_USERNAME }}
    password: ${{ secrets.FTP_PASSWORD }}
    local-dir: ./_site/
    server-dir: /public_html/
```

3. **Test** via manual workflow trigger
4. Adjust `server-dir` for your hosting (e.g., `/htdocs/`, `/www/`)
5. Consider SFTP with `protocol: sftp` for encrypted transfers

### Alternative: S3/CloudFront

```yaml
- name: Deploy to S3
  uses: jakejarvis/s3-sync-action@master
  with:
    args: --delete
  env:
    AWS_S3_BUCKET: ${{ secrets.AWS_S3_BUCKET }}
    AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
    AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    SOURCE_DIR: '_site'
```

---

## Asset Optimization

### Video Compression

```bash
# Compress with ffmpeg
ffmpeg -i forest-stream.mp4 -vcodec libx264 -crf 28 forest-stream-compressed.mp4
```

### Image Optimization

- Implement `@11ty/eleventy-img` for automatic optimization
- Generate `srcset` for responsive images
- Add WebP/AVIF fallback formats
- Implement lazy loading

---

## Linting & Formatting

### Proposed Setup

```bash
# ESLint for JavaScript
npm install -D eslint eslint-config-standard

# Prettier for code formatting
npm install -D prettier

# Husky + lint-staged for pre-commit hooks
npm install -D husky lint-staged
npx husky install
```

### Proposed Scripts

```json
{
  "lint": "eslint src/scripts/**/*.js",
  "format": "prettier --write \"src/**/*.{html,css,js,njk,md}\"",
  "lint:fix": "eslint --fix src/scripts/**/*.js"
}
```

---

## Performance Optimization

- [ ] Critical CSS inlined for first paint
- [ ] JS code splitting (per-page bundles)
- [ ] Service Worker for PWA support
- [ ] Preload/prefetch critical resources
- [ ] Native image lazy loading

---

## Advanced Build Pipeline

- [ ] JS minification with esbuild/terser
- [ ] Source maps for debugging
- [ ] Bundle analyzer
- [ ] Lighthouse CI for performance monitoring

---

## Testing

- [ ] Unit tests for JS modules (Jest)
- [ ] E2E tests (Playwright/Cypress)
- [ ] Visual regression testing
- [ ] Accessibility testing (axe)

---

## SEO & Accessibility Enhancements

- [ ] Generate `sitemap.xml` automatically
- [ ] Implement structured data (JSON-LD)
- [ ] Full accessibility audit
- [ ] Skip links implementation
- [ ] JSDoc for JavaScript functions
- [ ] Style guide for components
- [ ] CONTRIBUTING.md for contributors

---

## TESTS/ Experimental Pages

The `TESTS/` folder contains experimental HTML pages. Decision needed:

| File | Size | Notes |
|------|------|-------|
| `hero_journey.html` | 48KB | Keep as page? Integrate? Delete? |
| `client_model.html` | 18KB | May already be migrated to `src/client-model.html` |
| `transpersonal_therapist.html` | 21KB | Integrate into site or delete? |

---

*Last updated: March 2026*
