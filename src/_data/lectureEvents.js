// Fetch lecture events from Google Sheets during build time
const https = require('https');
const fs = require('fs');
const path = require('path');

const LECTURES_JSON_URL = 'https://script.google.com/macros/s/AKfycbwr2rE4dFTkQ5ZJzHewA9jBxYmAbxgqTOX-Kd20dNyDi7xbkGWjOFBjdrhHEF0yK-9Ucg/exec';
const CACHE_FILE = path.join(__dirname, 'lectureEvents.cache.json');

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
  try {
    console.log('Fetching lecture data from Google Sheets...');
    const data = await fetchUrl(LECTURES_JSON_URL);

    const mapped = data.map((item, index) => {
      let formattedDate = '';
      const rawDate = (item.date || '').trim();
      if (rawDate) {
        const d = new Date(rawDate);
        if (!isNaN(d.getTime())) {
          const dd = String(d.getDate()).padStart(2, '0');
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const yyyy = d.getFullYear();
          formattedDate = `${dd}.${mm}.${yyyy}`;
        }
      }
      return {
        index: index + 1,
        date: formattedDate,
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

    // Save cache for fallback
    try {
      fs.writeFileSync(CACHE_FILE, JSON.stringify(mapped, null, 2));
      console.log('✅ Lecture cache saved');
    } catch (cacheErr) {
      console.warn('⚠️ Could not save lecture cache:', cacheErr.message);
    }

    return mapped;
  } catch (error) {
    console.error('Error fetching lecture data:', error.message);

    // Fall back to cached data
    if (fs.existsSync(CACHE_FILE)) {
      try {
        const cached = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
        console.log(`⚠️ Using cached lecture data (${cached.length} events)`);
        return cached;
      } catch (cacheErr) {
        console.error('❌ Cache read failed:', cacheErr.message);
      }
    }

    // Return empty array as last resort so build doesn't fail
    return [];
  }
};
