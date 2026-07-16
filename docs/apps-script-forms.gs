/**
 * Website forms endpoint — ONE web app behind every form on the site:
 *
 *   • contact form (homepage)     → a row in the "Contact" sheet + an email to you
 *   • application details         → a row in the "Applications" sheet
 *     (/apply/ step 1)
 *   • signed enrolment agreement  → a file in your Drive, and its link written
 *     (/apply/ step 3)              onto that person's "Applications" row
 *
 * The applicant is matched by EMAIL: step 1 creates their row, step 3 finds it
 * again and fills in the Agreement column. Re-submitting step 1 with the same
 * email updates that row instead of adding a second one.
 *
 * It runs as YOU, which is what lets a static website write to your
 * spreadsheet and Drive without any password living in the page.
 *
 * SETUP: see docs/APPLICATION_PAGE_SETUP.md. In short — open your forms
 * spreadsheet, Extensions → Apps Script, paste this in, deploy as a Web App
 * ("Execute as: Me", "Who has access: Anyone"), then paste the /exec URL into
 * src/_data/forms.js.
 *
 * NOTE: do NOT paste this into the Apps Script project that already serves the
 * website's Sheets data — that one has its own doGet() and the two would clash.
 * This belongs in its own project, bound to the forms spreadsheet.
 */

// ---- Config ---------------------------------------------------------------
// Where to email you when something comes in ('' = no email).
var NOTIFY_EMAIL = 'office@transpersonal-training.com';

// Leave empty when this script is bound to the spreadsheet (Extensions → Apps
// Script). Only set it if you ever move the script to a standalone project.
var SHEET_ID = '';

// Drive folder for signed agreements. Leave FOLDER_ID empty to auto-create /
// reuse a folder named FOLDER_NAME.
var FOLDER_ID = '';
var FOLDER_NAME = 'Signed Enrolment Agreements';

// The master enrolment agreement Google Doc. The website pulls its text from
// here at build time, so this Doc is the single source of truth — edit the
// contract there, never in the website code.
var AGREEMENT_DOC_ID = '1e3C_S2Es7M0S4oqVfct_1J9mELFJcILazjW9SkmC91U';
// Everything from a heading containing this phrase up to the next big heading is
// left out of the website copy — that's the internal "notes for the school".
var SKIP_SECTION_FROM = 'Notes for the school';

var CONTACT_SHEET = 'Contact';
var APPLICATION_SHEET = 'Applications';
var MAX_UPLOAD_MB = 15;

// The Applications columns, in order. Everything reads positions from this list
// by name, so you can reorder or rename here without touching the code below.
//
// Two dates, deliberately: "Received" is when they filled the form in, "Apply
// date" is when their signed agreement arrived — an empty Apply date means an
// application that was started but never completed.
var APPLICATION_HEADERS = [
  'Received', 'Name', 'Date of birth', 'Nationality', 'Country of residence',
  'Address', 'Email', 'Phone', 'Track', 'Subscription intent',
  'Apply date', 'Agreement'
];
var EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
// ---------------------------------------------------------------------------

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return json_({ status: 'error', message: 'No data received.' });
    }
    var data = JSON.parse(e.postData.contents);

    // Honeypot: the form has a hidden field that a human never sees and never
    // fills. If it has content, it's a bot — accept it so the bot moves on,
    // but drop it on the floor.
    if (data.website) return json_({ status: 'ok' });

    if (data.action === 'contact') return handleContact_(data);
    if (data.action === 'application') return handleApplication_(data);
    if (data.action === 'agreement') return handleAgreement_(data);
    return json_({ status: 'error', message: 'Unknown action.' });
  } catch (err) {
    return json_({ status: 'error', message: String(err) });
  }
}

// ?doc=agreement serves the master agreement to the website build.
// Plain /exec lets you check in a browser that the deployment is live.
function doGet(e) {
  if (e && e.parameter && e.parameter.doc === 'agreement') {
    try {
      return json_({ status: 'ok', html: docToHtml_(AGREEMENT_DOC_ID) });
    } catch (err) {
      return json_({ status: 'error', message: String(err) });
    }
  }
  return json_({ status: 'ok', info: 'Website forms endpoint is live. Use POST to submit.' });
}

// ---- Google Doc → clean HTML ----------------------------------------------
// Deliberately hand-rolled rather than using Drive's HTML export: that export is
// a soup of inline styles and <span class="c17">, whereas the website's print
// stylesheet needs plain semantic tags. This emits exactly those.

function docToHtml_(docId) {
  var body = DocumentApp.openById(docId).getBody();
  var out = [];
  var listItems = [];
  var skipping = false;

  function flushList() {
    if (!listItems.length) return;
    out.push('<ul>' + listItems.join('') + '</ul>');
    listItems = [];
  }

  for (var i = 0; i < body.getNumChildren(); i++) {
    var el = body.getChild(i);
    var type = el.getType();

    if (type === DocumentApp.ElementType.PARAGRAPH) {
      var p = el.asParagraph();
      var heading = p.getHeading();
      var isBigHeading = heading === DocumentApp.ParagraphHeading.TITLE ||
                         heading === DocumentApp.ParagraphHeading.HEADING1 ||
                         heading === DocumentApp.ParagraphHeading.HEADING2;

      // The internal notes run from their heading to the next big heading.
      if (skipping && isBigHeading) skipping = false;
      if (!skipping && heading !== DocumentApp.ParagraphHeading.NORMAL &&
          p.getText().indexOf(SKIP_SECTION_FROM) !== -1) {
        flushList();
        skipping = true;
      }
      if (skipping) continue;

      var html = runsToHtml_(p);
      if (!html.trim()) continue;
      flushList();
      out.push(wrapParagraph_(heading, html));

    } else if (type === DocumentApp.ElementType.LIST_ITEM) {
      if (skipping) continue;
      var li = runsToHtml_(el.asListItem());
      if (li.trim()) listItems.push('<li>' + li + '</li>');

    } else if (type === DocumentApp.ElementType.TABLE) {
      if (skipping) continue;
      flushList();
      out.push(tableToHtml_(el.asTable()));

    } else if (type === DocumentApp.ElementType.HORIZONTAL_RULE) {
      if (skipping) continue;
      flushList();
      out.push('<hr>');
    }
  }
  flushList();
  return out.join('\n');
}

function wrapParagraph_(heading, html) {
  var H = DocumentApp.ParagraphHeading;
  if (heading === H.TITLE || heading === H.HEADING1) return '<h1>' + html + '</h1>';
  if (heading === H.HEADING2) return '<h2>' + html + '</h2>';
  if (heading === H.HEADING3 || heading === H.HEADING4 ||
      heading === H.HEADING5 || heading === H.HEADING6) return '<h3>' + html + '</h3>';
  return '<p>' + html + '</p>';
}

function tableToHtml_(table) {
  var rows = [];
  for (var r = 0; r < table.getNumRows(); r++) {
    var row = table.getRow(r);
    var cells = [];
    for (var c = 0; c < row.getNumCells(); c++) {
      var cell = row.getCell(c);
      var parts = [];
      for (var k = 0; k < cell.getNumChildren(); k++) {
        var child = cell.getChild(k);
        if (child.getType() === DocumentApp.ElementType.PARAGRAPH) {
          parts.push(runsToHtml_(child.asParagraph()));
        } else if (child.getType() === DocumentApp.ElementType.LIST_ITEM) {
          parts.push(runsToHtml_(child.asListItem()));
        }
      }
      cells.push('<td>' + parts.join('<br>') + '</td>');
    }
    rows.push('<tr>' + cells.join('') + '</tr>');
  }
  return '<table>' + rows.join('') + '</table>';
}

// Walks a paragraph's text runs so bold/italic/links survive the trip.
function runsToHtml_(para) {
  var text = para.editAsText();
  var s = text.getText();
  if (!s) return '';
  var bounds = text.getTextAttributeIndices();
  var html = '';
  for (var i = 0; i < bounds.length; i++) {
    var start = bounds[i];
    var end = (i + 1 < bounds.length) ? bounds[i + 1] : s.length;
    if (end <= start) continue;
    var chunk = escapeHtml_(s.substring(start, end));
    var url = text.getLinkUrl(start);
    if (text.isBold(start)) chunk = '<strong>' + chunk + '</strong>';
    if (text.isItalic(start)) chunk = '<em>' + chunk + '</em>';
    if (url) chunk = '<a href="' + escapeHtml_(url) + '">' + chunk + '</a>';
    html += chunk;
  }
  return html;
}

// The Doc holds {{placeholders}} that the website fills in per applicant, so
// braces must survive escaping untouched.
function escapeHtml_(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ---- Contact form ---------------------------------------------------------

function handleContact_(data) {
  var name = clean_(data.name, 120);
  var email = clean_(data.email, 160);
  var message = clean_(data.message, 5000);

  if (!name || !email || !message) {
    return json_({ status: 'error', message: 'Please fill in your name, email and message.' });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return json_({ status: 'error', message: 'That email address does not look right.' });
  }

  sheet_(CONTACT_SHEET, ['Received', 'Name', 'Email', 'Message'])
    .appendRow([new Date(), name, email, message]);

  if (NOTIFY_EMAIL) {
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      replyTo: email, // so you can just hit Reply
      name: 'Transpersonal Training website',
      subject: 'Website enquiry from ' + name,
      body: name + ' <' + email + '> wrote:\n\n' + message
    });
  }
  return json_({ status: 'ok' });
}

// ---- Application details (/apply/ step 1) ---------------------------------

function handleApplication_(data) {
  var email = clean_(data.email, 160);
  if (!EMAIL_RE.test(email)) {
    return json_({ status: 'error', message: 'That email address does not look right.' });
  }

  var sh = sheet_(APPLICATION_SHEET, APPLICATION_HEADERS);
  var row = findRowByEmail_(sh, email);

  var values = {
    'Received': new Date(),
    'Name': clean_(data.fullName, 120),
    'Date of birth': clean_(data.dob, 40),
    'Nationality': clean_(data.nationality, 80),
    'Country of residence': clean_(data.countryResidence, 80),
    'Address': clean_(data.address, 300),
    'Email': email,
    'Phone': clean_(data.phone, 60),
    'Track': clean_(data.track, 40),
    'Subscription intent': clean_(data.joining, 120),
    // Keep what step 3 already wrote — re-generating must not wipe it.
    'Apply date': row ? cell_(sh, row, 'Apply date') : '',
    'Agreement': row ? cell_(sh, row, 'Agreement') : ''
  };

  if (row) sh.getRange(row, 1, 1, APPLICATION_HEADERS.length).setValues([rowFrom_(values)]);
  else sh.appendRow(rowFrom_(values));

  return json_({ status: 'ok' });
}

// ---- Signed enrolment agreement (/apply/ step 3) --------------------------

function handleAgreement_(data) {
  if (!data.dataBase64) return json_({ status: 'error', message: 'No file content.' });

  var email = clean_(data.email, 160);
  if (!EMAIL_RE.test(email)) {
    return json_({ status: 'error', message: 'That email address does not look right.' });
  }

  var bytes = Utilities.base64Decode(data.dataBase64);
  if (bytes.length > MAX_UPLOAD_MB * 1024 * 1024) {
    return json_({ status: 'error', message: 'That file is larger than ' + MAX_UPLOAD_MB + ' MB.' });
  }

  var sh = sheet_(APPLICATION_SHEET, APPLICATION_HEADERS);
  var row = findRowByEmail_(sh, email);
  var name = row ? String(cell_(sh, row, 'Name') || '') : '';

  var origName = sanitize_(data.filename) || 'signed-agreement';
  var blob = Utilities.newBlob(bytes, data.mimeType || 'application/octet-stream', origName);
  var stamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd_HH-mm');
  var label = sanitize_(name) || sanitize_(email.split('@')[0]) || 'applicant';
  var file = getFolder_().createFile(blob).setName(label + '__' + stamp + '__' + origName);

  // The signed agreement arriving is what makes this a real application, so
  // that moment — not the form fill — is the date stamped here.
  var applyDate = new Date();
  if (row) {
    sh.getRange(row, APPLICATION_HEADERS.indexOf('Apply date') + 1).setValue(applyDate);
    sh.getRange(row, APPLICATION_HEADERS.indexOf('Agreement') + 1).setValue(file.getUrl());
  } else {
    // No application row for this address — they typed a different email, or
    // signed a copy from elsewhere. Never drop the file: give it its own row
    // so it's still visible, and flag it in the notification below.
    sh.appendRow(rowFrom_({
      'Received': applyDate, 'Email': email, 'Apply date': applyDate, 'Agreement': file.getUrl()
    }));
  }

  if (NOTIFY_EMAIL) {
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      replyTo: email,
      subject: 'New signed enrolment agreement: ' + (name || email),
      body: (row
        ? 'Matched to the application from ' + name + '.'
        : 'NO MATCHING APPLICATION for ' + email + ' — it was added as a new row. '
          + 'They may have used a different email at step 1.') +
        '\n\nEmail: ' + email + '\nFile: ' + file.getUrl()
    });
  }
  return json_({ status: 'ok', matched: !!row, fileId: file.getId(), fileUrl: file.getUrl() });
}

// ---- Helpers --------------------------------------------------------------

// Turns a {column name: value} map into a row in APPLICATION_HEADERS order,
// so nothing here depends on remembering column numbers.
function rowFrom_(values) {
  return APPLICATION_HEADERS.map(function (h) {
    return values[h] !== undefined ? values[h] : '';
  });
}

function cell_(sh, row, header) {
  return sh.getRange(row, APPLICATION_HEADERS.indexOf(header) + 1).getValue();
}

// The row number for an email, or 0. Searches bottom-up so the most recent
// application wins if the same address was somehow entered twice.
function findRowByEmail_(sh, email) {
  var last = sh.getLastRow();
  if (last < 2) return 0;
  var col = APPLICATION_HEADERS.indexOf('Email') + 1;
  var values = sh.getRange(2, col, last - 1, 1).getValues();
  var needle = email.trim().toLowerCase();
  for (var i = values.length - 1; i >= 0; i--) {
    if (String(values[i][0]).trim().toLowerCase() === needle) return i + 2;
  }
  return 0;
}

// Finds the tab, creating it with a bold frozen header row the first time.
function sheet_(name, headers) {
  var ss = SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('No spreadsheet. Bind this script to your forms sheet, or set SHEET_ID.');
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(headers);
    sh.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

function getFolder_() {
  if (FOLDER_ID) return DriveApp.getFolderById(FOLDER_ID);
  var it = DriveApp.getFoldersByName(FOLDER_NAME);
  return it.hasNext() ? it.next() : DriveApp.createFolder(FOLDER_NAME);
}

// Trims and caps free text. A leading ' stops Sheets reading "=..." or "+..."
// as a formula — a pasted spreadsheet formula should stay text.
function clean_(s, max) {
  if (!s) return '';
  var out = String(s).trim().slice(0, max);
  return /^[=+\-@]/.test(out) ? "'" + out : out;
}

function sanitize_(s) {
  return s ? String(s).replace(/[^\w.\-]+/g, '_').slice(0, 80) : '';
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
