// Fetch lecture events from Google Sheets during build time
const https = require('https');

const LECTURES_JSON_URL = 'https://script.googleusercontent.com/macros/echo?user_content_key=AY5xjrTmj2Re30CmbE7pYXzu1-pvwai-Tppy8uZBeVccAbBmN25-WrzTrkJmh20AzApzekXwqfwIp515WQcXbp5fBSniRfA-EkPt-zygQv2W6h7E9GTj-HrGn29BthHo6J_jdjMTXlKyiYsMM8dBrJUXHUShd4jtoCU9Szi1DYUorS-dc2GBkBAbcOo2UnvYal6XZDF0Q4CoqS6TvyFG11yBJAOQS3l7j51GJfk5C4Wa4yHHXYemzGHO_6hZjQ8fBli58H7RvXoCe0zSSAdQMZU4m8Yq9PWFQWVmE55e2But&lib=M1jGRTx7dxs_SyOVE98XsSQ8mHdyRNTio';

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
    return mapped;
  } catch (error) {
    console.error('Error fetching lecture data:', error.message);
    return [];
  }
};
