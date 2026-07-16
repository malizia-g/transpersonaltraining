// Where the website's forms send what people type — the contact form on the
// homepage and the signed-agreement upload on /apply/ both use this one URL.
//
// Paste the Apps Script Web App URL below (the one ending in /exec).
// Full instructions: docs/APPLICATION_PAGE_SETUP.md
//
// Leave it empty and both forms stay switched off, showing an "email us
// instead" note rather than silently losing the message.
//
// It's not a secret — the browser calls it directly, so it's fine in the repo.
// FORMS_ENDPOINT in the environment overrides it, if you'd rather set it there.

module.exports = {
    endpoint: process.env.FORMS_ENDPOINT || 'https://script.google.com/macros/s/AKfycbzvBoWMzUkTqL7LRYcrd_cW-fhV2RmaxGo2ot6tRIoUF8zI5Hq9fPNQRgRDSaFn434sOQ/exec'
};
