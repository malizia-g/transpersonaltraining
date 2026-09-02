const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { hasSheetChanged, commitSheetTimestamp } = require('./sheetTimestamps');

// Fetch practice clients from Google Apps Script during build time
const SHEET_JSON_URL = 'https://script.google.com/macros/s/AKfycbzyBD_kWrr6irrQcMSwOFtHxip3rfYpc1_2q0oscmKCHLJVFFSiGd4zAzsikgbXTEXKow/exec';
const CACHE_FILE = path.join(__dirname, 'practiceClients.cache.json');
const IMAGES_OUTPUT_DIR = path.join(__dirname, '../../_site/assets/images/people/students');
const LOCAL_IMAGE_PATH = '/assets/images/people/students';

const STATUS_PRIORITY = ['active', 'approved', 'pending', 'on-hold', 'completed'];

// The cards show the photo 224 px tall, at most ~380 px wide; 800 px covers
// that on a retina screen with room to spare.
const MAX_EDGE = 800;
const JPEG_QUALITY = 82;

function normalizeUrl(value) {
  const url = String(value || '').trim();
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return 'https://' + url;
}

function normalizeStatus(value) {
  const raw = String(value || '').trim().toLowerCase();
  if (!raw) return 'pending';
  if (raw === 'on hold') return 'on-hold';
  if (STATUS_PRIORITY.includes(raw)) return raw;
  return 'pending';
}

function mapItem(item) {
  const country = item.country || item.location || '';
  const id = String(item.id || '').trim();

  return {
    id,
    name: item.name || '',
    email: item.email || '',
    phone: item.phone || '',
    country,
    city: item.city || '',
    location: item.location || country,
    intake_date: item.intake_date || item['intake date'] || '',
    status: normalizeStatus(item.status),
    spoken_languages: item.spoken_languages || item['spoken languages'] || '',
    skills: item.skills || '',
    bio: item.bio || '',
    training: item.training || '',
    practice: item.practice || '',
    bth: item.bth || item.BTH || '',
    bio_summary: item.bio_summary || item['bio summary'] || '',
    focus_area: item.focus_area || item['focus area'] || '',
    picture_link: item.picture_link || item['picture link'] || item.image || '',
    website: normalizeUrl(item.website),
    skill_1: item.skill_1 || item.skill1 || item['skill 1'] || '',
    skill_2: item.skill_2 || item.skill2 || item['skill 2'] || '',
    skill_3: item.skill_3 || item.skill3 || item['skill 3'] || '',
  };
}

function sortByStatusThenName(items) {
  return [...items].sort((a, b) => {
    const aIndex = STATUS_PRIORITY.indexOf(a.status);
    const bIndex = STATUS_PRIORITY.indexOf(b.status);

    if (aIndex !== bIndex) {
      return aIndex - bIndex;
    }

    return a.name.localeCompare(b.name);
  });
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(
      url,
      {
        headers: {
          'User-Agent': 'Eleventy-Static-Site-Generator',
        },
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          fetchJson(res.headers.location).then(resolve).catch(reject);
          return;
        }

        let body = '';

        res.on('data', (chunk) => {
          body += chunk;
        });

        res.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch (error) {
            reject(new Error(`Failed to parse JSON: ${error.message}`));
          }
        });
      }
    );

    request.on('error', (error) => reject(error));
  });
}

// Fetch a single image from a URL (follows redirects) into memory.
// Resolves with the raw bytes; the caller decides what to write to disk.
function fetchImage(url, maxRedirects) {
  maxRedirects = typeof maxRedirects === 'number' ? maxRedirects : 10;

  return new Promise((resolve, reject) => {
    if (maxRedirects <= 0) return reject(new Error('Too many redirects'));

    const get = url.startsWith('https') ? https.get : http.get;

    const req = get(url, {
      headers: { 'User-Agent': 'Eleventy-Static-Site-Generator' },
      timeout: 30000,
    }, (res) => {
      // Follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchImage(res.headers.location, maxRedirects - 1).then(resolve).catch(reject);
      }

      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error('HTTP ' + res.statusCode));
      }

      // Verify we got an image, not an HTML page
      const mime = (res.headers['content-type'] || '').split(';')[0].trim().toLowerCase();
      if (!mime.startsWith('image/')) {
        res.resume(); // drain response
        return reject(new Error('Not an image (' + mime + ')'));
      }

      const chunks = [];
      res.on('data', (chunk) => { chunks.push(chunk); });
      res.on('end', () => { resolve(Buffer.concat(chunks)); });
      res.on('error', reject);
    });

    req.on('error', reject);
    req.on('timeout', function() { req.destroy(); reject(new Error('Timeout')); });
  });
}

// Write one student photo, scaled down to what the card actually needs.
// Drive holds whatever the student sent us — 4000 px camera files, photographs
// saved as PNG — while the card shows them 224 px tall, so everything is
// resized to MAX_EDGE and re-encoded as JPEG. Resolves with the filename.
async function saveStudentImage(buffer, destBase) {
  const resized = sharp(buffer)
    .rotate()                                   // honour the EXIF orientation
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true });

  // Photographs belong in JPEG, but a flat graphic — the placeholder some
  // students still have — comes out several times larger that way, so encode
  // both and keep whichever is smaller rather than assuming.
  const jpeg = await resized.clone()
    .flatten({ background: '#ffffff' })         // PNG transparency onto the card
    .jpeg({ quality: JPEG_QUALITY, progressive: true, mozjpeg: true })
    .toBuffer();
  const png = await resized.clone()
    .png({ compressionLevel: 9, palette: true })
    .toBuffer();

  const usePng = png.length < jpeg.length;
  const destPath = destBase + (usePng ? '.png' : '.jpg');
  fs.writeFileSync(destPath, usePng ? png : jpeg);

  // An earlier build may have left this student behind under another extension.
  ['.jpg', '.png', '.webp', '.gif', '.jpeg'].forEach(function(ext) {
    const other = destBase + ext;
    try { if (other !== destPath && fs.existsSync(other)) fs.unlinkSync(other); } catch (e) { /* ignore */ }
  });

  return path.basename(destPath);
}

// Download all student images in parallel into _site output directory.
// Returns a map { studentId: "/assets/images/people/students/studentId.jpg" }
//
// Every photo is fetched on every build. Skipping the download when a file
// already sat on disk meant a photo replaced in Drive was never picked up
// again: the URL in the sheet does not change when the picture behind it does,
// and CI restores the previous build's images before this runs.
async function downloadStudentImages(students) {
  fs.mkdirSync(IMAGES_OUTPUT_DIR, { recursive: true });

  const results = await Promise.allSettled(
    students.map(async function(student) {
      if (!student.picture_link || !student.id) return null;

      const destBase = path.join(IMAGES_OUTPUT_DIR, student.id);

      try {
        const buffer = await fetchImage(student.picture_link);
        const fileName = await saveStudentImage(buffer, destBase);
        return { id: student.id, localPath: LOCAL_IMAGE_PATH + '/' + fileName };
      } catch (err) {
        console.warn('  ⚠️ Image download failed for ' + student.id + ': ' + err.message);

        // Fall back to whatever an earlier build left here, so one unreachable
        // photo does not blank out a card.
        const stale = ['.jpg', '.png', '.webp', '.gif']
          .map(function(ext) { return destBase + ext; })
          .filter(function(f) { return fs.existsSync(f); })[0];

        if (stale) {
          console.warn('     ↩️ keeping the previously downloaded copy');
          return { id: student.id, localPath: LOCAL_IMAGE_PATH + '/' + path.basename(stale) };
        }
        return null;
      }
    })
  );

  var localPaths = {};
  results.forEach(function(r) {
    if (r.status === 'fulfilled' && r.value) {
      localPaths[r.value.id] = r.value.localPath;
    }
  });

  pruneDepartedStudents(students);

  return localPaths;
}

// Delete the photos of students who are no longer in the sheet.
//
// Nothing else ever removes them. The output directory is not built from
// scratch — CI restores the previous build's photos into it before Eleventy
// runs — and the deploy step publishes with `keep_files: true`, so a card
// dropped from the sheet keeps its picture both on disk and on the live site,
// indefinitely. Anything whose filename does not match a current student id
// goes; extensions are ignored, since the same student can move between .jpg
// and .png as the source photo changes.
function pruneDepartedStudents(students) {
  const current = new Set(
    students.map(function(s) { return s.id; }).filter(Boolean)
  );

  // An empty list means the fetch failed and no cache could stand in for it,
  // which is indistinguishable here from "every student left". Deleting the
  // whole gallery over a bad build day is not a trade worth making.
  if (current.size === 0) return 0;

  var removed = 0;

  fs.readdirSync(IMAGES_OUTPUT_DIR, { withFileTypes: true }).forEach(function(entry) {
    if (!entry.isFile()) return;
    if (current.has(entry.name.replace(/\.[^.]+$/, ''))) return;

    try {
      fs.unlinkSync(path.join(IMAGES_OUTPUT_DIR, entry.name));
      removed++;
      console.log('  \uD83D\uDDD1\uFE0F  Removed ' + entry.name + ' \u2014 no longer in the sheet');
    } catch (e) {
      console.warn('  \u26A0\uFE0F Could not remove ' + entry.name + ': ' + e.message);
    }
  });

  return removed;
}

module.exports = async function() {
  // Check if sheet has changed before fetching
  // 'clientModels' is the key the remote Apps Script publishes timestamps under.
  // It stays as-is on purpose: renaming it here without renaming it there
  // would silently defeat the cache and re-fetch the sheet every build.
  const changed = await hasSheetChanged('clientModels');
  if (!changed && fs.existsSync(CACHE_FILE)) {
    try {
      const cached = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
      console.log(`⚡ Practice clients: using cache (${cached.length} records, sheet unchanged)`);
      // Still need to download images for _site output (which is cleaned each build)
      console.log('Downloading student images from Drive (cached data)...');
      var localPaths = await downloadStudentImages(cached);
      var downloadCount = Object.keys(localPaths).length;
      console.log('✅ Downloaded ' + downloadCount + '/' + cached.length + ' student images');
      for (var j = 0; j < cached.length; j++) {
        if (localPaths[cached[j].id]) {
          cached[j].picture_link = localPaths[cached[j].id];
        }
      }
      return cached;
    } catch (e) { /* cache read failed, fetch anyway */ }
  }

  // 1. Fetch data (or use cache)
  var mapped;

  try {
    console.log('Fetching practice clients from Google Apps Script...');
    var rawData = await fetchJson(SHEET_JSON_URL);
    mapped = sortByStatusThenName((Array.isArray(rawData) ? rawData : []).map(mapItem));

    // Save cache with original Drive URLs
    try {
      fs.writeFileSync(CACHE_FILE, JSON.stringify(mapped, null, 2));
      console.log('✅ Practice clients data updated (' + mapped.length + ' records)');
    } catch (cacheError) {
      console.warn('⚠️ Could not save practice clients cache:', cacheError.message);
    }

    await commitSheetTimestamp('clientModels');
  } catch (error) {
    console.error('Error fetching practice clients:', error.message);

    if (fs.existsSync(CACHE_FILE)) {
      try {
        var cached = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
        console.log('⚠️ Using cached practice clients (' + cached.length + ' records)');
        mapped = sortByStatusThenName(cached.map(mapItem));
      } catch (cacheError) {
        console.error('❌ Practice clients cache read failed:', cacheError.message);
        return [];
      }
    } else {
      return [];
    }
  }

  // 2. Download images from Drive into _site/assets/images/people/students/
  console.log('Downloading student images from Drive...');
  var localPaths = await downloadStudentImages(mapped);
  var downloadCount = Object.keys(localPaths).length;
  console.log('✅ Downloaded ' + downloadCount + '/' + mapped.length + ' student images');

  // 3. Replace picture_link with local paths (keep Drive URL if download failed)
  for (var i = 0; i < mapped.length; i++) {
    if (localPaths[mapped[i].id]) {
      mapped[i].picture_link = localPaths[mapped[i].id];
    }
  }

  return mapped;
};