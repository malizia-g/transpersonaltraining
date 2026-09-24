// Fetch schedule events from Google Sheets during build time
const https = require('https');
const fs = require('fs');
const path = require('path');
const { hasSheetChanged, commitSheetTimestamp } = require('./sheetTimestamps');

const SHEET_JSON_URL = 'https://script.google.com/macros/s/AKfycbyRGO028PWtWuqhz4GqKsdL4z-dsiI2RFocHhNbgPA8fjpm-y9j3ZLzX4TCYwYbMZ6i/exec?sheet=Seminars';
const CACHE_FILE = path.join(__dirname, 'scheduleEvents.cache.json');

// Emergency valve: lets a deploy go out on cached data when the sheet's
// web app is down and the content cannot wait.
const ALLOW_STALE_DATA = process.env.ALLOW_STALE_DATA === '1' || process.env.ALLOW_STALE_DATA === 'true';

// Google answers the web app with a redirect to googleusercontent.com, which
// sometimes redirects once more. Following only the first hop lands on an HTML
// page and the build quietly falls back to a stale cache, so recurse — and
// give up on a hung socket rather than waiting for the default forever.
function fetchUrl(url, timeout) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Eleventy-Static-Site-Generator' }, timeout }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location, timeout).then(resolve).catch(reject);
      }

      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(new Error('Failed to parse JSON: ' + e.message + '\nResponse: ' + body.substring(0, 200)));
        }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Request timed out')); });
  });
}

// One slow answer shouldn't sink a deploy. The web app cold-starts, and the
// first call after a quiet spell can outlast any sensible timeout, so try
// again with more patience each time before giving up for real.
async function fetchUrlWithRetry(url, label) {
  const timeouts = [30000, 60000, 90000];
  let lastError;
  for (let attempt = 0; attempt < timeouts.length; attempt++) {
    try {
      return await fetchUrl(url, timeouts[attempt]);
    } catch (error) {
      lastError = error;
      if (attempt < timeouts.length - 1) {
        console.warn(`\u21bb ${label}: ${error.message} \u2014 retrying (${attempt + 2}/${timeouts.length})`);
      }
    }
  }
  throw lastError;
}

module.exports = async function() {
  // Check if sheet has changed before fetching
  const changed = await hasSheetChanged('schedule');
  if (!changed && fs.existsSync(CACHE_FILE)) {
    try {
      const cached = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
      console.log(`⚡ Schedule: using cache (${cached.length} events, sheet unchanged)`);
      return cached;
    } catch (e) { /* cache read failed, fetch anyway */ }
  }

  try {
    console.log('Fetching schedule data from Google Sheets...');
    
    const data = await fetchUrlWithRetry(SHEET_JSON_URL, 'seminars');

    // Map fields to ensure all expected fields are present
    const mappedData = data.map(item => {
      const rawDate = (item.date || '').trim();
      return {
        ...item,
        // Same three states the lectures use: a real range, words that only
        // hint at when, or nothing at all.
        dateKind: !rawDate
          ? 'undated'
          : (/^\d{1,2}\.\d{1,2}\.\d{4}/.test(rawDate) ? 'exact' : 'indicative'),
        module: item.module || item['ewtt - module'] || item.ewtt_module || ''
      };
    });
    
    console.log(`Successfully fetched ${mappedData.length} schedule events`);

    // Event dates are free text ranges, so nothing here rejects a bad one.
    // Flag the ones no parser will understand: an indicative "August 2026" is
    // fine and deliberate, a mistyped "31.11.2026" is not, and they look alike.
    const indicative = mappedData
      .filter((item) => !/^\s*\d{1,2}\.\d{1,2}\.\d{4}/.test(item.date || ''))
      .map((item) => `${(item.date || '(empty)').trim()} \u2014 ${(item.title || 'untitled').trim()}`);
    if (indicative.length) {
      console.warn(`\u26a0\ufe0f ${indicative.length} event date(s) kept as written \u2014 check none of these is a typo:`);
      for (const line of indicative) console.warn(`   ${line}`);
    }

    // Save cache for fallback
    try {
      fs.writeFileSync(CACHE_FILE, JSON.stringify(mappedData, null, 2));
      console.log('✅ Schedule cache saved');
    } catch (cacheErr) {
      console.warn('⚠️ Could not save schedule cache:', cacheErr.message);
    }

    await commitSheetTimestamp('schedule');

    return mappedData;
    
  } catch (error) {
    console.error('Error fetching schedule data:', error.message);

    // Falling back to the cache used to happen silently: the build stayed
    // green while the site served a stale seminars list, and nothing said so.
    // Fail instead, so a bad fetch is visible at the point it happens.
    if (!ALLOW_STALE_DATA) {
      throw new Error(
        `Could not fetch the seminars: ${error.message}. ` +
        'Set ALLOW_STALE_DATA=1 to build from the cache anyway.'
      );
    }

    if (fs.existsSync(CACHE_FILE)) {
      try {
        const cached = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
        console.log(`⚠️ ALLOW_STALE_DATA — using cached schedule data (${cached.length} events)`);
        return cached;
      } catch (cacheErr) {
        console.error('❌ Cache read failed:', cacheErr.message);
      }
    }

    throw new Error(`Could not fetch the seminars and no usable cache exists: ${error.message}`);
  }
};
