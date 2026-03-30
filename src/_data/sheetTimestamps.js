// Shared module: fetch last-modified timestamps from Google Sheets
// and compare with local cache to skip unnecessary data fetches.
const https = require('https');
const fs = require('fs');
const path = require('path');

const TIMESTAMPS_URL = 'https://script.google.com/macros/s/AKfycbwHywVdKwfFubk5KfrsBJ7Iw5q4YjTYapeFRdN_MCt650qz4U3J9fQp0rtXBi018Iw/exec';
const TIMESTAMPS_CACHE = path.join(__dirname, 'sheetTimestamps.cache.json');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: { 'User-Agent': 'Eleventy-Static-Site-Generator' },
      timeout: 15000
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch (e) { reject(new Error('Failed to parse timestamps JSON: ' + e.message)); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timestamps request timed out')); });
  });
}

// Singleton: fetch timestamps once per build, share across all data files
let _timestampsPromise = null;

function getRemoteTimestamps() {
  if (!_timestampsPromise) {
    _timestampsPromise = fetchUrl(TIMESTAMPS_URL).catch((err) => {
      console.warn('⚠️ Could not fetch sheet timestamps:', err.message);
      return null;
    });
  }
  return _timestampsPromise;
}

function getSavedTimestamps() {
  try {
    if (fs.existsSync(TIMESTAMPS_CACHE)) {
      return JSON.parse(fs.readFileSync(TIMESTAMPS_CACHE, 'utf-8'));
    }
  } catch (e) { /* ignore */ }
  return {};
}

function saveTimestamps(timestamps) {
  try {
    fs.writeFileSync(TIMESTAMPS_CACHE, JSON.stringify(timestamps, null, 2));
  } catch (e) {
    console.warn('⚠️ Could not save timestamps cache:', e.message);
  }
}

/**
 * Check if a specific sheet has changed since last build.
 * @param {string} sheetKey - 'schedule', 'lectures', or 'clientModels'
 * @returns {Promise<boolean>} true if data should be re-fetched
 */
async function hasSheetChanged(sheetKey) {
  const remote = await getRemoteTimestamps();
  if (!remote || !remote[sheetKey]) {
    // Can't determine — fetch to be safe
    console.log(`  ℹ️ No remote timestamp for "${sheetKey}" — will fetch`);
    return true;
  }

  const saved = getSavedTimestamps();
  const remoteTs = remote[sheetKey];
  const savedTs = saved[sheetKey];

  if (savedTs && savedTs === remoteTs) {
    console.log(`  ✅ "${sheetKey}" unchanged (${remoteTs}) — using cache`);
    return false;
  }

  console.log(`  🔄 "${sheetKey}" changed: ${savedTs || '(no cache)'} → ${remoteTs}`);
  // Save updated timestamp
  saved[sheetKey] = remoteTs;
  saveTimestamps(saved);
  return true;
}

module.exports = { hasSheetChanged };
