// Fetch schedule events from Google Sheets during build time
const https = require('https');
const fs = require('fs');
const path = require('path');
const { hasSheetChanged } = require('./sheetTimestamps');

const SHEET_JSON_URL = 'https://script.google.com/macros/s/AKfycbyRGO028PWtWuqhz4GqKsdL4z-dsiI2RFocHhNbgPA8fjpm-y9j3ZLzX4TCYwYbMZ6i/exec?sheet=Seminars';
const CACHE_FILE = path.join(__dirname, 'scheduleEvents.cache.json');

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
    
    const data = await new Promise((resolve, reject) => {
      const request = https.get(SHEET_JSON_URL, {
        headers: {
          'User-Agent': 'Eleventy-Static-Site-Generator'
        }
      }, (res) => {
        // Follow redirects
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          console.log('Following redirect to:', res.headers.location);
          https.get(res.headers.location, (redirectRes) => {
            let body = '';
            
            redirectRes.on('data', (chunk) => {
              body += chunk;
            });
            
            redirectRes.on('end', () => {
              try {
                const json = JSON.parse(body);
                resolve(json);
              } catch (e) {
                reject(new Error('Failed to parse JSON: ' + e.message + '\nResponse: ' + body.substring(0, 200)));
              }
            });
          }).on('error', (err) => {
            reject(err);
          });
          return;
        }
        
        let body = '';
        
        res.on('data', (chunk) => {
          body += chunk;
        });
        
        res.on('end', () => {
          try {
            const json = JSON.parse(body);
            resolve(json);
          } catch (e) {
            reject(new Error('Failed to parse JSON: ' + e.message + '\nResponse: ' + body.substring(0, 200)));
          }
        });
      });
      
      request.on('error', (err) => {
        reject(err);
      });
    });
    
    // Map fields to ensure all expected fields are present
    const mappedData = data.map(item => ({
      ...item,
      module: item.module || item['ewtt - module'] || item.ewtt_module || ''
    }));
    
    console.log(`Successfully fetched ${mappedData.length} schedule events`);

    // Save cache for fallback
    try {
      fs.writeFileSync(CACHE_FILE, JSON.stringify(mappedData, null, 2));
      console.log('✅ Schedule cache saved');
    } catch (cacheErr) {
      console.warn('⚠️ Could not save schedule cache:', cacheErr.message);
    }

    return mappedData;
    
  } catch (error) {
    console.error('Error fetching schedule data:', error.message);

    // Fall back to cached data
    if (fs.existsSync(CACHE_FILE)) {
      try {
        const cached = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
        console.log(`⚠️ Using cached schedule data (${cached.length} events)`);
        return cached;
      } catch (cacheErr) {
        console.error('❌ Cache read failed:', cacheErr.message);
      }
    }

    // Return empty array as last resort so build doesn't fail
    return [];
  }
};
