// /monthly-call/: hides calls that are already over (the page is built
// ahead of time) and posts the sign-up form to the Seminars/Lectures web app,
// which records it and emails the Google Meet link
// (apps-script/seminars-lectures/Calls.js).
//
// Plain script, same pattern as pages/contact.js.

(function () {
    'use strict';

    var now = Date.now();

    // ---- Past calls -------------------------------------------------------
    var items = document.querySelectorAll('[data-call]');
    var left = 0;
    Array.prototype.forEach.call(items, function (li) {
        if (new Date(li.getAttribute('data-end')).getTime() <= now) li.remove();
        else left++;
    });
    var select = document.getElementById('call-event');
    if (select) {
        Array.prototype.forEach.call(select.querySelectorAll('option[data-end]'), function (opt) {
            if (new Date(opt.getAttribute('data-end')).getTime() <= now) opt.remove();
        });
    }
    if (items.length && !left) {
        var heading = document.querySelector('[data-calls-heading]');
        var empty = document.querySelector('[data-calls-empty]');
        if (heading) heading.classList.add('hidden');
        if (empty) empty.classList.remove('hidden');
        var hidden = document.querySelector('#callForm input[name="eventId"]');
        if (hidden) hidden.value = '';
        if (select) select.closest('div').remove();
        var label = document.getElementById('callBtnLabel');
        if (label) label.textContent = 'Tell me the next date';
    }

    // "Save my place" on a card preselects that call in the form.
    Array.prototype.forEach.call(document.querySelectorAll('[data-call-signup]'), function (a) {
        a.addEventListener('click', function () {
            if (select) select.value = a.getAttribute('data-call-signup');
            setTimeout(function () {
                var name = document.getElementById('call-name');
                if (name) name.focus({ preventScroll: true });
            }, 400);
        });
    });

    // ---- Sign-up ----------------------------------------------------------
    var form = document.getElementById('callForm');
    if (!form) return;

    var loadedAt = Date.now();
    var btn = document.getElementById('callBtn');
    var btnLabel = document.getElementById('callBtnLabel');
    var statusEl = document.getElementById('callStatus');
    var EMAIL_LINK = '<a class="underline" href="mailto:west-office@transpersonal-training.com">west-office@transpersonal-training.com</a>';

    function setStatus(kind, html) {
        var tone = kind === 'ok' ? 'bg-green-900/40 border-green-500/50 text-green-100'
                 : kind === 'err' ? 'bg-red-900/40 border-red-500/50 text-red-100'
                 : 'bg-[color:var(--c-deep-60)] border-[color:var(--c-acc-40)] text-[color:var(--c-on-dark-2)]';
        statusEl.className = 'text-sm p-3 border ' + tone;
        statusEl.innerHTML = html;
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var payload = {
            action: 'callSignup',
            name: form.elements.name.value.trim(),
            email: form.elements.email.value.trim(),
            eventId: form.elements.eventId ? form.elements.eventId.value : '',
            newsletter: form.elements.newsletter ? form.elements.newsletter.checked : false,
            website: form.elements.hp_leave_empty.value,
            elapsedMs: Date.now() - loadedAt
        };
        if (!payload.name || !payload.email) {
            setStatus('err', 'Please fill in your name and email.');
            return;
        }

        var idle = btnLabel.textContent;
        btn.disabled = true;
        btnLabel.textContent = 'Sending…';
        setStatus('info', 'Signing you up…');

        // text/plain body → a "simple" request, no CORS preflight (which
        // Apps Script web apps don't answer).
        fetch(form.getAttribute('data-endpoint'), { method: 'POST', body: JSON.stringify(payload) })
            .then(function (res) {
                // Same leniency as contact.js: an unreadable answer after a
                // completed request has, in practice, been a success.
                return res.text().then(function (t) {
                    try { return JSON.parse(t); } catch (_) { return { status: 'ok', scheduled: true }; }
                });
            })
            .then(function (out) {
                if (!out || out.status !== 'ok') throw new Error((out && out.message) || 'Server error');
                setStatus('ok', out.scheduled
                    ? 'You’re in! Check your inbox: the date and the Google Meet link are on their way.'
                    : 'Thank you — we’ll write to you as soon as the next call is scheduled.');
                form.reset();
            })
            .catch(function (err) {
                var msg = err && err.message && !/fetch|JSON|Server error/i.test(err.message) ? err.message + ' ' : '';
                setStatus('err', msg + 'Sorry, that didn’t go through. Please try again, or write to us at ' + EMAIL_LINK + '.');
            })
            .finally(function () {
                btn.disabled = false;
                btnLabel.textContent = idle;
            });
    });
})();
