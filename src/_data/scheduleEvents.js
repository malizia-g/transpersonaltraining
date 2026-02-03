// Fetch schedule events from Google Sheets during build time
const https = require('https');

const SHEET_JSON_URL = 'https://script.google.com/macros/s/AKfycbwF4y-K0oYh0Fd78xVezCcaGf7Ac5SglXAv0SUzcBJgqeg_kRXaLix3gSad8LAgg6oR/exec';

module.exports = async function() {
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
    return mappedData;
    
  } catch (error) {
    console.error('Error fetching schedule data:', error.message);
    // Return empty array on error so build doesn't fail
    return [];
  }
};
