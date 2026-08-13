// Apply page — 3 steps:
//   1. applicant fills the form
//   2. we fill the printable enrolment agreement and open the print / Save-as-PDF dialog
//   3. applicant uploads the signed copy, which is POSTed to a Google Apps Script
//      web app that saves it to the school's Google Drive.
//
// Loaded as a plain script (not a module), same pattern as pages/resources.js.

(function () {
    'use strict';

    // The Apps Script /exec URL, shared with the homepage contact form and set
    // once in src/_data/forms.js (see docs/APPLICATION_PAGE_SETUP.md). Empty
    // keeps upload switched off and shows the "email your signed copy" note.
    var MAX_UPLOAD_MB = 15;

    var form = document.getElementById('applicationForm');
    var step2 = document.getElementById('step2');
    var printBtn = document.getElementById('printBtn');
    var formHint = document.getElementById('formHint');

    var FIELD_IDS = ['fullName', 'dob', 'nationality', 'countryResidence', 'email', 'address', 'phone', 'track', 'joining'];

    function fmtDate(iso) {
        if (!iso) return '';
        var d = new Date(iso + 'T00:00:00');
        if (isNaN(d.getTime())) return iso;
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    }
    function today() {
        return new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    }

    function collect() {
        var data = {};
        FIELD_IDS.forEach(function (id) {
            var el = document.getElementById(id);
            data[id] = el ? el.value.trim() : '';
        });
        return data;
    }

    function validate() {
        var ok = true;
        form.querySelectorAll('[required]').forEach(function (el) {
            var valid = !!(el.value && el.value.trim() !== '');
            if (el.type === 'email' && valid) valid = /.+@.+\..+/.test(el.value);
            el.classList.toggle('field-error', !valid);
            if (!valid && ok) el.focus();
            if (!valid) ok = false;
        });
        return ok;
    }

    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    // The agreement text comes from the master Google Doc with {{placeholders}}
    // left in it (see src/_data/agreement.js). This swaps them for the
    // applicant's answers. Anything the Doc asks for that we don't have — an
    // unknown or unanswered placeholder — becomes a dash rather than a gap, so
    // the printed contract never has a blank where a value was expected.
    function renderAgreement(template, map) {
        return template.replace(/\{\{\s*(\w+)\s*\}\}/g, function (_, key) {
            var value = map[key];
            var text = (value === undefined || value === null || value === '') ? '—' : value;
            return '<span class="fill">' + escapeHtml(text) + '</span>';
        });
    }

    function fill(data) {
        var map = {
            fullName: data.fullName,
            dob: fmtDate(data.dob),
            nationality: data.nationality,
            countryResidence: data.countryResidence,
            address: data.address,
            email: data.email,
            phone: data.phone,
            track: data.track,
            joining: data.joining,
            today: today()
        };
        var template = document.getElementById('agreementTemplate');
        var target = document.querySelector('#agreementPrintable .agreement-doc');
        if (template && target) target.innerHTML = renderAgreement(template.innerHTML, map);
        // Step 3 matches on this address, so carry it over rather than making
        // them retype it (and risk a typo that orphans their upload).
        var upEmail = document.getElementById('upEmail');
        if (upEmail && !upEmail.value) upEmail.value = data.email;
    }

    // Sends the details to the spreadsheet, where step 3 finds them again by
    // email to attach the signed agreement. Deliberately fire-and-forget: the
    // applicant's real goal is the printable document, so a failed request must
    // never block it — and if the row never arrived, the upload creates one.
    function sendApplication(data) {
        var endpoint = window.FORMS_ENDPOINT || '';
        if (!endpoint) return;
        var payload = Object.assign({ action: 'application' }, data);
        fetch(endpoint, { method: 'POST', body: JSON.stringify(payload) })
            .catch(function () { /* the office still gets the signed copy at step 3 */ });
    }

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!validate()) { formHint.classList.remove('hidden'); return; }
            formHint.classList.add('hidden');
            var data = collect();
            fill(data);
            sendApplication(data);
            step2.classList.remove('hidden');
            step2.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    if (printBtn) {
        printBtn.addEventListener('click', function () { window.print(); });
    }

    // ---------- Download a real PDF ----------
    // Print stays the primary route: the browser's own print-to-PDF keeps the
    // text selectable and breaks pages properly. This button is for people who
    // just want the file, so html2pdf is fetched on first click only — it's
    // ~900 KB and nobody should pay for it who doesn't press the button.
    var PDF_LIB_URL = 'https://unpkg.com/html2pdf.js@0.14.0/dist/html2pdf.bundle.min.js';
    var pdfLibPromise = null;

    function loadPdfLib() {
        if (window.html2pdf) return Promise.resolve(window.html2pdf);
        if (pdfLibPromise) return pdfLibPromise;
        pdfLibPromise = new Promise(function (resolve, reject) {
            var s = document.createElement('script');
            s.src = PDF_LIB_URL;
            s.onload = function () {
                if (window.html2pdf) resolve(window.html2pdf);
                else reject(new Error('html2pdf did not register'));
            };
            s.onerror = function () {
                pdfLibPromise = null; // let a later click retry
                reject(new Error('html2pdf failed to load'));
            };
            document.head.appendChild(s);
        });
        return pdfLibPromise;
    }

    function agreementFilename() {
        var el = document.getElementById('fullName');
        var slug = (el ? el.value : '').trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
        return 'Enrolment-Agreement' + (slug ? '-' + slug : '') + '.pdf';
    }

    var downloadBtn = document.getElementById('downloadBtn');
    var downloadNote = document.getElementById('downloadNote');
    var downloadBtnLabel = document.getElementById('downloadBtnLabel');

    function setNote(kind, html) {
        if (!downloadNote) return;
        if (!html) { downloadNote.classList.add('hidden'); return; }
        downloadNote.className = 'text-sm mt-3 p-3 border ' + (kind === 'err'
            ? 'bg-red-50 border-red-300 text-red-800'
            : 'bg-neutral-warm-50 border-neutral-warm-300 text-neutral-warm-700');
        downloadNote.innerHTML = html;
        downloadNote.classList.remove('hidden');
    }

    if (downloadBtn) {
        downloadBtn.addEventListener('click', function () {
            var doc = document.querySelector('#agreementPrintable .agreement-doc');
            if (!doc) return;

            downloadBtn.disabled = true;
            downloadBtnLabel.textContent = 'Preparing PDF…';
            setNote('', '');

            loadPdfLib().then(function (html2pdf) {
                return html2pdf().set({
                    margin: 14,
                    filename: agreementFilename(),
                    // html2pdf renders to an image, so scale drives how sharp the
                    // text prints and quality only trades off compression noise:
                    // scale 2 + 0.85 keeps it crisp at ~2.4 MB instead of ~4 MB.
                    image: { type: 'jpeg', quality: 0.85 },
                    html2canvas: { scale: 2, backgroundColor: '#ffffff', useCORS: true },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                    // avoid-all, or the renderer slices straight through a line
                    // of text at the page boundary — half on one page, half on
                    // the next. It pushes whole blocks to the next page instead.
                    pagebreak: { mode: ['avoid-all', 'css'] }
                }).from(doc).save();
            }).catch(function () {
                setNote('err', 'Sorry, the PDF couldn’t be generated here. Please use <strong>Print agreement</strong> and choose “Save as PDF” in the print dialog.');
            }).finally(function () {
                downloadBtn.disabled = false;
                downloadBtnLabel.textContent = 'Download PDF';
            });
        });
    }

    // ---------- Step 3: upload ----------
    var uploadForm = document.getElementById('uploadForm');
    var statusEl = document.getElementById('uploadStatus');
    var uploadBtn = document.getElementById('uploadBtn');
    var uploadBtnLabel = document.getElementById('uploadBtnLabel');

    function setStatus(kind, html) {
        var base = 'text-sm p-3 border ';
        var tone = kind === 'ok' ? 'bg-green-50 border-green-300 text-green-800'
                 : kind === 'err' ? 'bg-red-50 border-red-300 text-red-800'
                 : 'bg-neutral-warm-50 border-neutral-warm-300 text-neutral-warm-700';
        statusEl.className = base + tone;
        statusEl.innerHTML = html;
        statusEl.classList.remove('hidden');
    }

    function readFileBase64(file) {
        return new Promise(function (resolve, reject) {
            var r = new FileReader();
            r.onload = function () {
                var res = String(r.result || '');
                var i = res.indexOf(',');
                resolve(i >= 0 ? res.slice(i + 1) : '');
            };
            r.onerror = reject;
            r.readAsDataURL(file);
        });
    }

    if (uploadForm) {
        uploadForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var fileInput = document.getElementById('signedFile');
            var email = document.getElementById('upEmail').value.trim();
            var file = fileInput.files && fileInput.files[0];

            if (!email || !file) { setStatus('err', 'Please add your email and the signed file.'); return; }
            if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
                setStatus('err', 'That file is larger than ' + MAX_UPLOAD_MB + '&nbsp;MB. Please compress it, or email it to <a class="underline" href="mailto:office@transpersonal-training.com">office@transpersonal-training.com</a>.');
                return;
            }
            var endpoint = window.FORMS_ENDPOINT || '';
            if (!endpoint) {
                setStatus('info', 'Online upload isn’t switched on yet. Please email your signed agreement to <a class="underline" href="mailto:office@transpersonal-training.com">office@transpersonal-training.com</a>.');
                return;
            }

            uploadBtn.disabled = true;
            uploadBtnLabel.textContent = 'Uploading…';
            setStatus('info', 'Uploading your signed agreement…');

            readFileBase64(file).then(function (b64) {
                var payload = JSON.stringify({
                    action: 'agreement', // the same endpoint also takes contact messages
                    email: email, // the only key linking this file to an application
                    filename: file.name,
                    mimeType: file.type || 'application/octet-stream',
                    dataBase64: b64
                });
                // Sent as text/plain (default for a string body) so the browser
                // makes a "simple" request and skips the CORS preflight that
                // Apps Script web apps don't answer.
                return fetch(endpoint, { method: 'POST', body: payload });
            }).then(function (res) {
                return res.text().then(function (t) {
                    try { return JSON.parse(t); } catch (_) { return { status: 'ok' }; }
                });
            }).then(function (out) {
                if (out && out.status === 'error') throw new Error(out.message || 'Server error');
                setStatus('ok', 'Thank you — your signed agreement has been received. The office will be in touch by email.');
                uploadForm.reset();
                // The school has the details now, so don't leave personal data
                // sitting in this browser. (FormCache comes from main.js, which
                // is a module and loads after this script.)
                if (window.FormCache) window.FormCache.clear('apply');
            }).catch(function () {
                setStatus('err', 'Sorry, the upload didn’t go through. Please try again, or email your signed agreement to <a class="underline" href="mailto:office@transpersonal-training.com">office@transpersonal-training.com</a>.');
            }).finally(function () {
                uploadBtn.disabled = false;
                uploadBtnLabel.textContent = 'Upload signed agreement';
            });
        });
    }
})();
