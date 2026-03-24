const https = require('https');
const fs = require('fs');
const path = require('path');

const SHEET_JSON_URL = process.env.CLIENT_MODELS_SHEET_JSON_URL || '';
const CACHE_FILE = path.join(__dirname, 'clientModels.cache.json');

const STATUS_PRIORITY = ['active', 'approved', 'pending', 'on-hold', 'completed'];

function normalizeStatus(value) {
  const raw = String(value || '').trim().toLowerCase();
  if (!raw) return 'pending';
  if (raw === 'on hold') return 'on-hold';
  if (STATUS_PRIORITY.includes(raw)) return raw;
  return 'pending';
}

function mapItem(item) {
  const country = item.country || item.location || '';

  return {
    id: item.id || '',
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

module.exports = async function() {
  if (!SHEET_JSON_URL) {
    if (fs.existsSync(CACHE_FILE)) {
      const cached = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
      return sortByStatusThenName(cached.map(mapItem));
    }

    return [];
  }

  try {
    console.log('Fetching client model data from Google Sheets...');
    const data = await fetchJson(SHEET_JSON_URL);
    const mapped = sortByStatusThenName((Array.isArray(data) ? data : []).map(mapItem));

    try {
      fs.writeFileSync(CACHE_FILE, JSON.stringify(mapped, null, 2));
      console.log('✅ Client models cache saved');
    } catch (cacheError) {
      console.warn('⚠️ Could not save client models cache:', cacheError.message);
    }

    return mapped;
  } catch (error) {
    console.error('Error fetching client model data:', error.message);

    if (fs.existsSync(CACHE_FILE)) {
      try {
        const cached = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
        console.log(`⚠️ Using cached client model data (${cached.length} records)`);
        return sortByStatusThenName(cached.map(mapItem));
      } catch (cacheError) {
        console.error('❌ Client model cache read failed:', cacheError.message);
      }
    }

    return [];
  }
};