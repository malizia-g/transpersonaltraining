// Fetch lecture events from Google Sheets during build time
const https = require('https');
const fs = require('fs');
const path = require('path');
const { hasSheetChanged, commitSheetTimestamp } = require('./sheetTimestamps');

const LECTURES_JSON_URL = 'https://script.google.com/macros/s/AKfycbyRGO028PWtWuqhz4GqKsdL4z-dsiI2RFocHhNbgPA8fjpm-y9j3ZLzX4TCYwYbMZ6i/exec?sheet=Lectures';
// Renamed when the date fix below landed: CI restores *.cache.json between
// runs, and the old file still holds the day-early dates. A new name makes the
// first build after the fix fetch fresh instead of trusting it.
const CACHE_FILE = path.join(__dirname, 'lectureEvents-berlin.cache.json');

// Emergency valve: lets a deploy go out on cached data when the sheet's
// web app is down and the content cannot wait.
const ALLOW_STALE_DATA = process.env.ALLOW_STALE_DATA === '1' || process.env.ALLOW_STALE_DATA === 'true';

const BERLIN_DATE = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Berlin', day: '2-digit', month: '2-digit', year: 'numeric'
});

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Eleventy-Static-Site-Generator' }, timeout: 30000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }

      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(new Error('Failed to parse JSON: ' + e.message));
        }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Request timed out')); });
  });
}

module.exports = async function() {
  // Check if sheet has changed before fetching
  const changed = await hasSheetChanged('lectures');
  if (!changed && fs.existsSync(CACHE_FILE)) {
    try {
      const cached = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
      console.log(`⚡ Lectures: using cache (${cached.length} events, sheet unchanged)`);
      return cached;
    } catch (e) { /* cache read failed, fetch anyway */ }
  }

  try {
    console.log('Fetching lecture data from Google Sheets...');
    const data = await fetchUrl(LECTURES_JSON_URL);

    const indicative = [];

    const mapped = data.map((item, index) => {
      let formattedDate = '';
      // How much the sheet actually knows about when this happens, so the page
      // can say "13.01.2026", "November 2026" or "to be defined" rather than
      // showing an empty slot and leaving the reader to guess which it is.
      let dateKind = 'undated';
      const rawDate = (item.date || '').trim();
      if (rawDate) {
        const d = new Date(rawDate);
        if (!isNaN(d.getTime())) {
          // The sheet sends midnight Berlin time. Read the day in that zone,
          // not the build machine's: in UTC (CI) midnight Tuesday is still
          // 23:00 Monday, and every lecture showed up a day early.
          const parts = {};
          for (const p of BERLIN_DATE.formatToParts(d)) parts[p.type] = p.value;
          formattedDate = `${parts.day}.${parts.month}.${parts.year}`;
          dateKind = 'exact';
        } else {
          // Not a real date, but the cell says something — "November 2026",
          // "Spring 2027". Keep the words: they place the lecture better than
          // nothing does, and blanking them loses what the sheet knew.
          formattedDate = rawDate;
          dateKind = 'indicative';
          indicative.push(`${rawDate} — ${(item.title || 'untitled').trim()}`);
        }
      }
      return {
        index: index + 1,
        date: formattedDate,
        dateKind,
        module: (item.module || '').trim(),
        title: (item.title || '').trim(),
        description: (item.description || '').trim(),
        teacher1: (item['teacher 1'] || '').trim(),
        teacher2: (item['teacher 2'] || '').trim(),
        startHour: (item['start hour'] || '').trim(),
        finishHour: (item['finish hour'] || '').trim(),
        videoLink: (item['video link'] || '').trim()
      };
    });

    console.log(`Successfully fetched ${mapped.length} lecture events`);

    // A date nobody can parse is either deliberate or a typo, and only a human
    // can tell which. Name them so a slip shows up here instead of quietly
    // becoming an "indicative" date on the live page.
    if (indicative.length) {
      console.warn(`⚠️ ${indicative.length} lecture date(s) kept as written — check none of these is a typo:`);
      for (const line of indicative) console.warn(`   ${line}`);
    }

    // Save cache for fallback
    try {
      fs.writeFileSync(CACHE_FILE, JSON.stringify(mapped, null, 2));
      console.log('✅ Lecture cache saved');
    } catch (cacheErr) {
      console.warn('⚠️ Could not save lecture cache:', cacheErr.message);
    }

    await commitSheetTimestamp('lectures');

    return mapped;
  } catch (error) {
    console.error('Error fetching lecture data:', error.message);

    // Falling back to the cache used to happen silently: the build stayed
    // green while the site served a stale lectures list, and nothing said so.
    // Fail instead, so a bad fetch is visible at the point it happens.
    if (!ALLOW_STALE_DATA) {
      throw new Error(
        `Could not fetch the lectures: ${error.message}. ` +
        'Set ALLOW_STALE_DATA=1 to build from the cache anyway.'
      );
    }

    if (fs.existsSync(CACHE_FILE)) {
      try {
        const cached = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
        console.log(`⚠️ ALLOW_STALE_DATA — using cached lecture data (${cached.length} events)`);
        return cached;
      } catch (cacheErr) {
        console.error('❌ Cache read failed:', cacheErr.message);
      }
    }

    throw new Error(`Could not fetch the lectures and no usable cache exists: ${error.message}`);
  }
};
