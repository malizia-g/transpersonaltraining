// Upcoming monthly info calls, read at build time from the EWTT Google
// Calendar through the Seminars/Lectures web app (?calls=1, see
// apps-script/seminars-lectures/Calls.js). Only events with "call" in the
// title are sent, and never the Meet link: that goes out by email to whoever
// signs up on /monthly-call/, which posts to the same URL.
//
// Unlike the seminars, a failed fetch does not stop the build: the page
// falls back to the last good answer, or to "no call scheduled".
const https = require('https');
const fs = require('fs');
const path = require('path');

const ENDPOINT = 'https://script.google.com/macros/s/AKfycbyRGO028PWtWuqhz4GqKsdL4z-dsiI2RFocHhNbgPA8fjpm-y9j3ZLzX4TCYwYbMZ6i/exec';
const CACHE_FILE = path.join(__dirname, 'monthlyCalls.cache.json');
const TIMEZONE = 'Europe/Rome';

function fetchJson(url, timeout = 60000) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Eleventy-Static-Site-Generator' }, timeout }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchJson(res.headers.location, timeout).then(resolve).catch(reject);
      }
      let body = '';
      res.on('data', (c) => { body += c; });
      res.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch (e) { reject(new Error('Not JSON: ' + body.substring(0, 120))); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Request timed out')); });
  });
}

const fmt = (opts) => new Intl.DateTimeFormat('en-GB', { timeZone: TIMEZONE, ...opts });
const dayFmt = fmt({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const dayShortFmt = fmt({ weekday: 'long', day: 'numeric', month: 'long' });
const timeFmt = fmt({ hour: '2-digit', minute: '2-digit', hour12: false });
const zoneFmt = fmt({ timeZoneName: 'short' });

// 2026-12-09T19:00:00.000Z → 20261209T190000Z
const stamp = (iso) => iso.replace(/[-:]/g, '').replace(/\.\d{3}/, '');

function decorate(call) {
  const start = new Date(call.start);
  const end = new Date(call.end);
  const title = 'Transpersonal Training — info call';
  const details = 'Sign up at https://transpersonal-training.com/monthly-call/ to receive the Google Meet link.';
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Transpersonal Training//Monthly call//EN',
    'BEGIN:VEVENT',
    `UID:${call.id}`,
    `DTSTAMP:${stamp(new Date().toISOString())}`,
    `DTSTART:${stamp(call.start)}`,
    `DTEND:${stamp(call.end)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${details}`,
    'END:VEVENT', 'END:VCALENDAR'
  ].join('\r\n');
  return {
    ...call,
    day: dayFmt.format(start),
    dayShort: dayShortFmt.format(start), // "Wednesday 9 December", for the homepage popup
    time: `${timeFmt.format(start)}–${timeFmt.format(end)}`,
    zone: zoneFmt.formatToParts(start).find((p) => p.type === 'timeZoneName').value,
    googleUrl: 'https://calendar.google.com/calendar/render?action=TEMPLATE'
      + `&text=${encodeURIComponent(title)}`
      + `&dates=${stamp(call.start)}/${stamp(call.end)}`
      + `&details=${encodeURIComponent(details)}`,
    icsUrl: 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics)
  };
}

module.exports = async function () {
  let calls;
  try {
    const data = await fetchJson(`${ENDPOINT}?calls=1`);
    if (!Array.isArray(data)) throw new Error(data && data.error ? data.error : 'unexpected answer');
    // A deployment that predates Calls.js ignores ?calls=1 and answers with
    // the active sheet's rows — those have no id/start/end.
    if (data.some((c) => !c || !c.id || !c.start || !c.end)) {
      throw new Error('answer is not a list of calls (is the web app deployed with Calls.js?)');
    }
    calls = data;
    try { fs.writeFileSync(CACHE_FILE, JSON.stringify(calls, null, 2)); } catch (_) { /* cache is optional */ }
    console.log(`📅 Monthly calls: ${calls.length} upcoming`);
  } catch (err) {
    console.warn(`⚠️ Monthly calls: could not fetch (${err.message})`);
    try {
      calls = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
      console.warn(`   using cache (${calls.length} calls)`);
    } catch (_) {
      calls = [];
    }
  }
  const now = Date.now();
  return {
    endpoint: ENDPOINT,
    upcoming: calls
      .filter((c) => new Date(c.end).getTime() > now)
      .sort((a, b) => new Date(a.start) - new Date(b.start))
      .map(decorate)
  };
};
