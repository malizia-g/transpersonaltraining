#!/usr/bin/env node
// Post-build step: translates the English pages already built into _site
// into each configured language via the DeepL API, writing the result to
// _site/<lang>/... . The English source (templates, markdown) is never
// touched — this only reads/writes the built HTML output.
//
// Skips entirely (English-only build) when DEEPL_API_KEY is not set, so
// local dev and PRs without the secret still build fine.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const cheerio = require('cheerio');

const SITE_DIR = path.join(__dirname, '..', '..', '_site');
const CACHE_DIR = path.join(__dirname, '..', '..', '.cache', 'i18n');
const SITE_ORIGIN = 'https://transpersonal-training.com';

// Add more entries here to grow the set of translated languages later —
// nothing else in the site needs to change.
const LANGS = [
  { code: 'ru', deepl: 'ru', label: 'RU' },
];

async function main() {
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) {
    console.log('[i18n] DEEPL_API_KEY not set — skipping translation (English-only build).');
    return;
  }
  if (!fs.existsSync(SITE_DIR)) {
    console.log('[i18n] _site not found — run the Eleventy build first.');
    return;
  }

  const deepl = require('deepl-node');
  const translator = new deepl.Translator(apiKey);

  const htmlFiles = walk(SITE_DIR).filter((f) => f.endsWith('.html'));
  console.log(`[i18n] Found ${htmlFiles.length} HTML pages to translate into: ${LANGS.map((l) => l.code).join(', ')}`);

  for (const lang of LANGS) {
    const cacheDir = path.join(CACHE_DIR, lang.code);
    fs.mkdirSync(cacheDir, { recursive: true });

    let cacheHits = 0;
    let translatedCount = 0;
    let failed = 0;

    for (const file of htmlFiles) {
      const rel = path.relative(SITE_DIR, file);
      const source = fs.readFileSync(file, 'utf-8');
      const hash = crypto.createHash('sha256').update(source).digest('hex');
      const cachePath = path.join(cacheDir, `${hash}.html`);

      const urls = alternateUrls(source);

      let translatedBody;
      if (fs.existsSync(cachePath)) {
        translatedBody = fs.readFileSync(cachePath, 'utf-8');
        cacheHits++;
      } else {
        try {
          const result = await translator.translateText(source, 'en', lang.deepl, {
            tagHandling: 'html',
          });
          translatedBody = result.text;
          fs.writeFileSync(cachePath, translatedBody, 'utf-8');
          translatedCount++;
        } catch (err) {
          console.warn(`[i18n] Failed to translate ${rel} into ${lang.code}: ${err.message}`);
          failed++;
          continue;
        }
      }

      const finalHtml = localize(translatedBody, lang.code, urls);
      const outPath = path.join(SITE_DIR, lang.code, rel);
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, finalHtml, 'utf-8');

      // Also declare the alternate on the English original itself.
      const englishWithAlternates = injectAlternates(source, urls);
      fs.writeFileSync(file, englishWithAlternates, 'utf-8');
    }

    console.log(`[i18n] [${lang.code}] ${translatedCount} translated via API, ${cacheHits} from cache, ${failed} failed.`);
  }
}

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Don't recurse into already-translated output from a previous language pass.
      if (LANGS.some((l) => l.code === entry.name)) continue;
      out.push(...walk(full));
    } else {
      out.push(full);
    }
  }
  return out;
}

// Reads the canonical URL out of the (untouched) English source and derives
// the equivalent URL for every configured language, so both the English
// page and each translation can point hreflang alternates at each other.
function alternateUrls(sourceHtml) {
  const $ = cheerio.load(sourceHtml, { decodeEntities: false });
  const canonical = $('link[rel="canonical"]').attr('href') || null;
  const en = canonical;
  const byLang = {};
  if (canonical && canonical.startsWith(SITE_ORIGIN)) {
    for (const lang of LANGS) {
      byLang[lang.code] = localizeSiteUrl(canonical, lang.code);
    }
  }
  return { en, byLang };
}

function localizeSiteUrl(url, langCode) {
  const rest = url.slice(SITE_ORIGIN.length) || '/';
  return `${SITE_ORIGIN}/${langCode}${rest}`;
}

function injectAlternates(html, urls) {
  if (!urls.en) return html;
  const $ = cheerio.load(html, { decodeEntities: false });
  if ($('link[rel="alternate"][hreflang]').length) return html; // already injected
  const tags = [`<link rel="alternate" hreflang="en" href="${urls.en}">`];
  for (const lang of LANGS) {
    if (urls.byLang[lang.code]) {
      tags.push(`<link rel="alternate" hreflang="${lang.code}" href="${urls.byLang[lang.code]}">`);
    }
  }
  tags.push(`<link rel="alternate" hreflang="x-default" href="${urls.en}">`);
  $('head').append('\n' + tags.join('\n') + '\n');
  return $.html();
}

function isPageLink(href) {
  if (!href) return false;
  if (/^([a-z][a-z0-9+.-]*:)?\/\//i.test(href)) return false; // absolute / protocol-relative
  if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:') || href.startsWith('#')) return false;
  if (!href.startsWith('/')) return false;
  if (href.startsWith('/assets/') || href.startsWith('/css/') || href.startsWith('/scripts/')) return false;
  if (LANGS.some((l) => href.startsWith(`/${l.code}/`))) return false; // already localized
  return true;
}

// Rewrites in-page links to stay inside the translated section, sets the
// <html lang>, localizes canonical/og:url, and adds hreflang alternates.
function localize(html, langCode, urls) {
  const $ = cheerio.load(html, { decodeEntities: false });

  $('html').attr('lang', langCode);

  $('a[href]').each((_, el) => {
    if ($(el).closest('.lang-switch').length) return; // handled client-side, not per-locale
    const href = $(el).attr('href');
    if (isPageLink(href)) {
      $(el).attr('href', href === '/' ? `/${langCode}/` : `/${langCode}${href}`);
    }
  });

  const canonicalEl = $('link[rel="canonical"]');
  if (canonicalEl.attr('href') && urls.byLang[langCode]) {
    canonicalEl.attr('href', urls.byLang[langCode]);
  }
  const ogUrlEl = $('meta[property="og:url"]');
  if (ogUrlEl.attr('content') && urls.byLang[langCode]) {
    ogUrlEl.attr('content', urls.byLang[langCode]);
  }

  if (urls.en) {
    const tags = [`<link rel="alternate" hreflang="en" href="${urls.en}">`];
    for (const lang of LANGS) {
      if (urls.byLang[lang.code]) {
        tags.push(`<link rel="alternate" hreflang="${lang.code}" href="${urls.byLang[lang.code]}">`);
      }
    }
    tags.push(`<link rel="alternate" hreflang="x-default" href="${urls.en}">`);
    $('head').append('\n' + tags.join('\n') + '\n');
  }

  return $.html();
}

main().catch((err) => {
  console.error('[i18n] Unexpected failure:', err);
  process.exit(1);
});
