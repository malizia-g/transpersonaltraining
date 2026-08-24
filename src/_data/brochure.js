// The downloadable programme brochure.
//
// The PDF is designed by hand and committed to src/assets/documents/ — it is
// not generated from the spreadsheet the way the curriculum PDF is. Until it
// lands, every CTA that points at it would 404, so the file's presence is
// checked once at build time and templates render the download only when it is
// really there. Same instinct as the `pendingVideos` flag on /resources/ and
// the cache fallbacks in curriculumData.js: never ship a dead link.
//
// To publish the brochure: drop the PDF at the path below and rebuild. Nothing
// else needs changing.
//
// It is deliberately INDEXABLE. Hosting it here rather than on Drive means
// links and shares credit this domain instead of drive.google.com — that, not
// noindex, was always the point. Two things keep an indexed PDF from becoming a
// dead end for the people who land on it directly:
//   · put the site URL and a "read the full programme online at …" line on
//     page 1 of the PDF itself;
//   · do not title the PDF with the exact primary keyword of an HTML page, or
//     Google may serve the PDF in place of /training-overview/.
// See docs/BROCHURE.md for the full note, and docs/SEO_KEYWORD_MAP.md for the
// per-page keyword targets.

const fs = require('fs');
const path = require('path');

const FILENAME = 'transpersonal-training-brochure.pdf';
const RELATIVE = `/assets/documents/${FILENAME}`;
const ABSOLUTE = path.join(__dirname, '..', 'assets', 'documents', FILENAME);

module.exports = function () {
  let available = false;
  let sizeMb = null;

  try {
    const stat = fs.statSync(ABSOLUTE);
    available = stat.isFile() && stat.size > 0;
    if (available) sizeMb = (stat.size / (1024 * 1024)).toFixed(1);
  } catch (error) {
    // Not there yet — that is an expected state, not a build failure.
    available = false;
  }

  if (!available) {
    console.warn(
      `[brochure] ${FILENAME} not found in src/assets/documents/ — ` +
      'brochure download CTAs will be hidden on this build.'
    );
  }

  return { available, url: RELATIVE, filename: FILENAME, sizeMb };
};
