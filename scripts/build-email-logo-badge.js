// Regenerates src/assets/images/Graphics/logo-badge-email.png — the PNG
// version of the site's logo used in the confirmation email header
// (docs/googlescripts/apps-script-forms.gs, EMAIL_LOGO_URL).
//
// Why a PNG and not the site's own SVG: Outlook desktop doesn't render SVG at
// all (neither inline <svg> nor <img src="…svg">), and support elsewhere is
// patchy, so a raster image is the one format every email client actually
// shows.
//
// Run this again only if the logo mark or the gold accent colour changes —
// `node scripts/build-email-logo-badge.js` from the repo root.

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SIZE = 120; // 2x a 60px display size, for retina-crisp rendering in email clients
const LOGO_RATIO = 0.8; // matches the site's own badge proportions (w-8 inside w-10 — see navigation.njk)
const ACCENT = '#d4b75e'; // --c-acc, src/styles/main.css

const SOURCE_LOGO = path.join(__dirname, '..', 'src/assets/images/Graphics/logo.svg');
const OUTPUT = path.join(__dirname, '..', 'src/assets/images/Graphics/logo-badge-email.png');

async function build() {
  const circleSvg = `<svg width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg"><circle cx="${SIZE / 2}" cy="${SIZE / 2}" r="${SIZE / 2}" fill="${ACCENT}"/></svg>`;
  const circleBuf = await sharp(Buffer.from(circleSvg)).png().toBuffer();

  const logoSize = Math.round(SIZE * LOGO_RATIO);
  const logoBuf = await sharp(SOURCE_LOGO).resize(logoSize, logoSize).png().toBuffer();

  const offset = Math.round((SIZE - logoSize) / 2);
  const out = await sharp(circleBuf)
    .composite([{ input: logoBuf, left: offset, top: offset }])
    .png()
    .toBuffer();

  fs.writeFileSync(OUTPUT, out);
  console.log('written:', OUTPUT, out.length, 'bytes');
}

build().catch((e) => { console.error(e); process.exit(1); });
