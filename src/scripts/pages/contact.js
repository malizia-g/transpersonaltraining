// Homepage contact form → the Apps Script web app, which drops a row in the
// forms spreadsheet and emails the office. See docs/APPLICATION_PAGE_SETUP.md.
//
// The form keeps its mailto: action as a no-JS fallback; whenever this script
// runs we take over and post properly instead.
//
// Loaded as a plain script (not a module), same pattern as pages/apply.js.

(function () {
    'use strict';

    var form = document.getElementById('contactForm');
    if (!form) return;

    var btn = document.getElementById('contactBtn');
    var btnLabel = document.getElementById('contactBtnLabel');
    var statusEl = document.getElementById('contactStatus');

    var EMAIL_LINK = '<a class="underline hover:text-[#EBC98A]" href="mailto:west-office@transpersonal-training.com">west-office@transpersonal-training.com</a> or '
        + '<a class="underline hover:text-[#EBC98A]" href="mailto:east-office@transpersonal-training.com">east-office@transpersonal-training.com</a>';

    function setStatus(kind, html) {
        if (!statusEl) return;
        if (!html) { statusEl.classList.add('hidden'); return; }
        var tone = kind === 'ok' ? 'bg-green-900/40 border-green-500/50 text-green-100'
                 : kind === 'err' ? 'bg-red-900/40 border-red-500/50 text-red-100'
                 : 'bg-[#0F2540]/60 border-[#D9A756]/40 text-[#D5DEE9]';
        statusEl.className = 'text-sm p-3 border ' + tone;
        statusEl.innerHTML = html;
        statusEl.classList.remove('hidden');
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        var endpoint = window.FORMS_ENDPOINT || '';
        if (!endpoint) {
            setStatus('info', 'Our contact form isn’t switched on yet — please write to us at ' + EMAIL_LINK + ' and we’ll reply.');
            return;
        }

        var payload = {
            action: 'contact',
            name: form.elements.name.value.trim(),
            email: form.elements.email.value.trim(),
            message: form.elements.message.value.trim(),
            track: form.elements.track ? form.elements.track.value.trim() : '', // which office to notify; empty = both
            newsletter: form.elements.newsletter ? form.elements.newsletter.checked : false,
            website: form.elements.website ? form.elements.website.value : '' // honeypot
        };
        // The message is optional: plenty of people just want the lesson and
        // the brochure, and the reply sends those either way.
        if (!payload.name || !payload.email) {
            setStatus('err', 'Please fill in your name and email.');
            return;
        }

        btn.disabled = true;
        btnLabel.textContent = 'Sending…';
        setStatus('info', 'Sending your message…');

        // Sent as text/plain (the default for a string body) so the browser
        // makes a "simple" request and skips the CORS preflight that Apps
        // Script web apps don't answer.
        fetch(endpoint, { method: 'POST', body: JSON.stringify(payload) })
            .then(function (res) {
                return res.text().then(function (t) {
                    try { return JSON.parse(t); } catch (_) { return { status: 'ok' }; }
                });
            })
            .then(function (out) {
                if (out && out.status === 'error') throw new Error(out.message || 'Server error');
                setStatus('ok', 'Thank you — we’ve got your details. Check your inbox: the demo lesson and the brochure are on their way. If you asked us something, one of us will write back personally.');
                form.reset();
                // It's safely with the school now; don't keep a copy in this browser.
                if (window.FormCache) window.FormCache.clear('contact');
            })
            .catch(function () {
                setStatus('err', 'Sorry, your message didn’t go through. Please try again, or write to us at ' + EMAIL_LINK + '.');
            })
            .finally(function () {
                btn.disabled = false;
                btnLabel.textContent = 'Send my request';
            });
    });
})();
