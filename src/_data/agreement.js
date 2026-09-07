// The enrolment agreement text, pulled from the master Google Doc at build time
// so the Doc is the single source of truth and nobody has to keep two copies of
// a contract in sync by hand.
//
// The Doc is fetched through the same Apps Script web app as the forms
// (?doc=agreement), which runs as the school and returns clean HTML — so the Doc
// itself can stay private. Setup: docs/APPLICATION_PAGE_SETUP.md.
//
// Placeholders like {{fullName}} are left in the HTML; the browser fills them in
// on the Apply page (src/scripts/pages/apply.js).
//
// This is a legal document, so it must never render empty or half-fetched:
//   1. try the Doc
//   2. fall back to the last good fetch (agreement.cache.json)
//   3. fall back to agreement-fallback.html, which is committed
// A failure is loud in the build log but never breaks the page.

const https = require('https');
const fs = require('fs');
const path = require('path');

const CACHE_FILE = path.join(__dirname, 'agreement.cache.json');
const FALLBACK_FILE = path.join(__dirname, 'agreement-fallback.html');
const TIMEOUT_MS = 15000;

// A contract with no placeholders would print with the applicant's name, contact
// and chosen track simply missing — worse than not publishing at all, and easy
// to cause by editing the Doc. Treat it as a failed fetch rather than publish it.
//
// These four are the ones a blank breaks outright: who is signing, how to reach
// them, when, and which track — the track also decides which fee applies. The
// rest of the fields aren't listed, so the school can still restructure the Doc
// without the build refusing it.
const REQUIRED_PLACEHOLDERS = ['fullName', 'email', 'today', 'track'];

function get(url, redirectsLeft = 5) {
    return new Promise((resolve, reject) => {
        const req = https.get(url, { headers: { 'User-Agent': 'Eleventy-Static-Site-Generator' } }, (res) => {
            // Apps Script /exec always redirects to googleusercontent.com
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                if (!redirectsLeft) return reject(new Error('Too many redirects'));
                res.resume();
                return get(res.headers.location, redirectsLeft - 1).then(resolve, reject);
            }
            if (res.statusCode !== 200) {
                res.resume();
                return reject(new Error('HTTP ' + res.statusCode));
            }
            let body = '';
            res.on('data', (c) => (body += c));
            res.on('end', () => resolve(body));
        });
        req.on('error', reject);
        req.setTimeout(TIMEOUT_MS, () => req.destroy(new Error('Timed out after ' + TIMEOUT_MS + 'ms')));
    });
}

function fallback(why) {
    // Last good fetch beats the committed copy: it's closer to the Doc.
    if (fs.existsSync(CACHE_FILE)) {
        try {
            const cached = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
            if (cached && cached.html) {
                console.warn(`⚠ Agreement: ${why} — using the last fetched copy.`);
                return { html: cached.html, source: 'cache' };
            }
        } catch (_) { /* corrupt cache, fall through */ }
    }
    console.warn(`⚠ Agreement: ${why} — using the committed fallback text.`);
    return { html: fs.readFileSync(FALLBACK_FILE, 'utf-8'), source: 'fallback' };
}

module.exports = async function () {
    const endpoint = process.env.FORMS_ENDPOINT || require('./forms.js').endpoint;
    if (!endpoint) return fallback('no FORMS_ENDPOINT configured');

    try {
        console.log('Fetching enrolment agreement from the Google Doc...');
        const raw = await get(endpoint + '?doc=agreement');

        let data;
        try {
            data = JSON.parse(raw);
        } catch (_) {
            throw new Error('Response was not JSON: ' + raw.slice(0, 120));
        }
        if (data.status === 'error') throw new Error(data.message || 'Script returned an error');
        if (!data.html || !data.html.trim()) throw new Error('Script returned no text');

        const missing = REQUIRED_PLACEHOLDERS.filter((p) => !data.html.includes('{{' + p + '}}'));
        if (missing.length) {
            throw new Error(
                'the Doc is missing ' + missing.map((p) => `{{${p}}}`).join(', ') +
                ' — it would print contracts with those fields blank'
            );
        }

        fs.writeFileSync(CACHE_FILE, JSON.stringify({ html: data.html, fetched: new Date().toISOString() }));
        console.log(`✓ Agreement: fetched from the Google Doc (${data.html.length} chars)`);
        return { html: data.html, source: 'doc' };
    } catch (err) {
        // Node leaves .message empty on some connection errors (ECONNREFUSED
        // arrives as an AggregateError), and a blank reason here would be
        // useless exactly when someone is trying to work out why the contract
        // stopped updating.
        return fallback(err.message || err.code || String(err));
    }
};
