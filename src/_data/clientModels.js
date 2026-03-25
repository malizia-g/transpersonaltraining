const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Fetch client models from Google Apps Script during build time
const SHEET_JSON_URL = 'https://script.googleusercontent.com/macros/echo?user_content_key=AWDtjMUyuiyYlfHt7pCtAor5otKhxtCfq0znz09ZOo9ErtGhaeSYpcKSgDBq0rF0mIj3DfMdMJgVAQ8zYjlIiwA3XC_YkxgBntldx8y2qJ0tIiytQ6q09h2OT4r0MjTspLq8qQcg6xqKJcpdtz2omby3K_0doLkKlgwNrE7LMwFQ1QehCBsOd-0TnIU3ZZRfoUqXqGIpBR3mhLn0ZHa9nG14nFJI-2-U-Bnnh9sH2ppYXHJ7JGWWfDYlxm1UGQ0CDd2UBMTpK8bYwpeWMGnALGsyvGojC8pxzwoJ_s7vwWcS&lib=MPEuo3nRl8JayOBpeNZqAjw8mHdyRNTio';
const CACHE_FILE = path.join(__dirname, 'clientModels.cache.json');
const IMAGES_OUTPUT_DIR = path.join(__dirname, '../../_site/assets/images/people/students');
const LOCAL_IMAGE_PATH = '/assets/images/people/students';

const STATUS_PRIORITY = ['active', 'approved', 'pending', 'on-hold', 'completed'];

const MIME_TO_EXT = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

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

// Download a single file from a URL (follows redirects) and save to disk.
// Resolves with the final filename (e.g. "anna-keller.jpg").
function downloadFile(url, destPathNoExt, maxRedirects) {
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
        return downloadFile(res.headers.location, destPathNoExt, maxRedirects - 1)
          .then(resolve).catch(reject);
      }

      if (res.statusCode !== 200) {
        return reject(new Error('HTTP ' + res.statusCode));
      }

      // Verify we got an image, not an HTML page
      const mime = (res.headers['content-type'] || '').split(';')[0].trim().toLowerCase();
      if (!mime.startsWith('image/')) {
        res.resume(); // drain response
        return reject(new Error('Not an image (' + mime + ')'));
      }

      const ext = MIME_TO_EXT[mime] || '.jpg';
      const destPath = destPathNoExt + ext;
      const ws = fs.createWriteStream(destPath);

      res.pipe(ws);
      ws.on('finish', function() { ws.close(); resolve(path.basename(destPath)); });
      ws.on('error', function(err) { fs.unlink(destPath, function() {}); reject(err); });
    });

    req.on('error', reject);
    req.on('timeout', function() { req.destroy(); reject(new Error('Timeout')); });
  });
}

// Download all student images in parallel into _site output directory.
// Returns a map { studentId: "/assets/images/people/students/studentId.ext" }
async function downloadStudentImages(students) {
  fs.mkdirSync(IMAGES_OUTPUT_DIR, { recursive: true });

  const results = await Promise.allSettled(
    students.map(async function(student) {
      if (!student.picture_link || !student.id) return null;

      try {
        const destBase = path.join(IMAGES_OUTPUT_DIR, student.id);
        const fileName = await downloadFile(student.picture_link, destBase);
        return { id: student.id, localPath: LOCAL_IMAGE_PATH + '/' + fileName };
      } catch (err) {
        console.warn('  ⚠️ Image download failed for ' + student.id + ': ' + err.message);
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

  return localPaths;
}

module.exports = async function() {
  // 1. Fetch data (or use cache)
  var mapped;

  try {
    console.log('Fetching client models from Google Apps Script...');
    var rawData = await fetchJson(SHEET_JSON_URL);
    mapped = sortByStatusThenName((Array.isArray(rawData) ? rawData : []).map(mapItem));

    // Save cache with original Drive URLs
    try {
      fs.writeFileSync(CACHE_FILE, JSON.stringify(mapped, null, 2));
      console.log('✅ Client models data updated (' + mapped.length + ' records)');
    } catch (cacheError) {
      console.warn('⚠️ Could not save client models cache:', cacheError.message);
    }
  } catch (error) {
    console.error('Error fetching client models:', error.message);

    if (fs.existsSync(CACHE_FILE)) {
      try {
        var cached = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
        console.log('⚠️ Using cached client models (' + cached.length + ' records)');
        mapped = sortByStatusThenName(cached.map(mapItem));
      } catch (cacheError) {
        console.error('❌ Client models cache read failed:', cacheError.message);
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