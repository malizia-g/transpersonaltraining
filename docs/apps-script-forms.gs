/**
 * Website forms endpoint — ONE web app behind every form on the site:
 *
 *   • contact form (homepage)     → a row in the "Contact" sheet + an email to you
 *   • application details         → a row in the "Applications" sheet
 *     (/apply/ step 1)
 *   • signed enrolment agreement  → a file in your Drive, and its link written
 *     (/apply/ step 3)              onto that person's "Applications" row
 *
 * Who gets told about a new message is read from the spreadsheet too, not
 * hard-coded here — see NOTIFY_SHEET below. The contact form and the signed
 * agreement also send a confirmation back to the person who submitted them.
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
// Who gets notified when something comes in. The addresses live in the forms
// spreadsheet, in a tab with one column per office — so the school can add or
// remove people without touching this code or redeploying. See notifyEmails_().
//
// Put the tab's name here. Capitalisation doesn't matter, and if the tab is
// renamed outright it's still found by its two column headings — notifications
// keep working either way.
var NOTIFY_SHEET = 'Notifications';
var NOTIFY_WEST_HEADER = 'WEST TRACK';
var NOTIFY_EAST_HEADER = 'EAST TRACK';

// The school's public addresses, the ones printed on the website. Two jobs:
// the Reply-To on the confirmation we send back to the sender, and a fallback
// set of recipients if the tab above can't be read, so a mistake in the
// spreadsheet can never silence a notification altogether ('' = no email).
//
// Don't rely on them for notifications: mail sent here has to survive the
// domain's forwarding, which is the hop that was swallowing them before. For a
// human hitting Reply that hop works fine, which is why they're used for that.
var OFFICE_EMAIL_WEST = 'west-office@transpersonal-training.com';
var OFFICE_EMAIL_EAST = 'east-office@transpersonal-training.com';

// The name and signature on mail the school sends out.
var SCHOOL_NAME = 'Transpersonal Training';
var SCHOOL_URL = 'https://transpersonal-training.com';

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
var AGREEMENT_DOC_ID = '1Gyu8MRYX9StBSReQPbCymDVo2hKrxfZNmUgDFs2b_eE';
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
  'Apply date', 'Agreement', 'Diploma'
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

// ---- ONE-OFF: put the {{placeholders}} into the master Doc -----------------
/**
 * Run this ONCE, by hand, from the Apps Script editor: pick
 * setupAgreementPlaceholders in the function dropdown and press Run. It edits
 * the master agreement Doc so the website can fill it in per applicant:
 *
 *   - the student details table gets {{fullName}}, {{dob}}, … in its empty cells
 *   - "Track: ☐ Western ☐ Eastern"      becomes "Track: {{track}}"
 *   - "How you are joining" + its boxes  become "Subscription intent: {{joining}}"
 *   - "Intended start date / cohort"     is removed (the website dropped it)
 *   - the header Date and the student's signature Name get {{today}}/{{fullName}}
 *
 * Safe to run twice — it looks for what it hasn't done yet. It writes to a
 * contract, so check the result: if anything looks wrong, the Doc's
 * File → Version history restores the previous version in two clicks.
 * Check View → Logs afterwards to see exactly what it changed.
 */
function setupAgreementPlaceholders() {
  var doc = DocumentApp.openById(AGREEMENT_DOC_ID);
  var body = doc.getBody();
  var did = [];

  // 1. Details table — match on the label in the left cell, so this doesn't
  //    depend on row order.
  var FIELDS = {
    'Full legal name': '{{fullName}}',
    'Date of birth': '{{dob}}',
    'Nationality': '{{nationality}}',
    'Country of residence': '{{countryResidence}}',
    'Full postal address': '{{address}}',
    'Email': '{{email}}',
    'Telephone / WhatsApp': '{{phone}}'
  };
  var tables = body.getTables();
  for (var t = 0; t < tables.length; t++) {
    for (var r = 0; r < tables[t].getNumRows(); r++) {
      var row = tables[t].getRow(r);
      if (row.getNumCells() < 2) continue;
      var placeholder = FIELDS[row.getCell(0).getText().trim()];
      if (placeholder) {
        row.getCell(1).setText(placeholder);
        did.push(row.getCell(0).getText().trim() + ' → ' + placeholder);
      }
    }
  }

  // 2. Header date. Targeted at the "Document version" line, because
  //    "Date: ____" also appears in the signature block.
  var paragraphs = body.getParagraphs();
  for (var i = 0; i < paragraphs.length; i++) {
    if (paragraphs[i].getText().indexOf('Document version') !== -1) {
      paragraphs[i].replaceText('_{3,}', '{{today}}');
      did.push('header date → {{today}}');
    }
  }

  // 3. Track, subscription intent, and the fields the website no longer asks for.
  var remove = [];
  paragraphs = body.getParagraphs();
  for (var j = 0; j < paragraphs.length; j++) {
    var p = paragraphs[j];
    var text = p.getText().trim();

    // Rebuilt rather than pattern-matched: the checkboxes are separated by
    // non-breaking spaces, and replaceText uses RE2, whose \s — unlike
    // JavaScript's — does not match them. Rewriting the line sidesteps
    // whatever whitespace the Doc happens to contain.
    if (text.indexOf('Track:') === 0) {
      p.clear();
      p.appendText('Track: ').setBold(true);
      p.appendText('{{track}}').setBold(false);
      did.push('track → {{track}}');

    } else if (text.indexOf('How you are joining') === 0) {
      p.clear();
      p.appendText('Subscription intent (optional): ').setBold(true);
      p.appendText('{{joining}}').setBold(false);
      did.push('joining → {{joining}}');

    // Only the joining checkboxes — the consent boxes in sections 6-8 also
    // start with ☐ and must survive.
    } else if (/^☐\s*(Full training|Self-development only|Single lectures)/.test(text)) {
      remove.push(p);
    } else if (text.indexOf('Intended start date') === 0) {
      remove.push(p);
    }
  }
  for (var k = 0; k < remove.length; k++) {
    did.push('removed: ' + remove[k].getText().trim().substring(0, 40));
    remove[k].removeFromParent();
  }

  // 4. The student's name on the signature line (not the School's).
  for (var s = 0; s < tables.length; s++) {
    if (tables[s].getText().indexOf('THE STUDENT') === -1) continue;
    for (var sr = 0; sr < tables[s].getNumRows(); sr++) {
      var cell = tables[s].getRow(sr).getCell(0);
      if (cell.getText().trim().indexOf('Name:') === 0) {
        cell.replaceText('_{3,}', '{{fullName}}');
        did.push('signature name → {{fullName}}');
      }
    }
  }

  doc.saveAndClose();
  Logger.log('Done:\n  ' + did.join('\n  '));
  return did;
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
  var track = clean_(data.track, 40); // which office to notify; blank = not sure, notify both

  if (!name || !email || !message) {
    return json_({ status: 'error', message: 'Please fill in your name, email and message.' });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return json_({ status: 'error', message: 'That email address does not look right.' });
  }

  sheet_(CONTACT_SHEET, ['Received', 'Name', 'Email', 'Message'])
    .appendRow([new Date(), name, email, message]);

  var notify = notifyEmails_(track);
  if (notify) {
    MailApp.sendEmail({
      to: notify,
      replyTo: email, // so you can just hit Reply
      name: 'Transpersonal Training website',
      subject: 'Website enquiry from ' + name,
      body: name + ' <' + email + '> wrote:\n\n' + message
    });
  }

  sendConfirmation_(email, track,
    'We have your message — ' + SCHOOL_NAME,
    'Hi ' + name + ',\n\n'
      + 'Thank you for writing to us. Your message has reached the school and a real '
      + 'person will read it — we normally reply within a few days.\n\n'
      + 'This is what you sent, for your own records:\n\n' + message);

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
    'Agreement': row ? cell_(sh, row, 'Agreement') : '',
    'Diploma': row ? cell_(sh, row, 'Diploma') : ''
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

  // The diploma is optional, so only decode/validate it if one was sent.
  var diplomaBytes = null;
  if (data.diplomaBase64) {
    diplomaBytes = Utilities.base64Decode(data.diplomaBase64);
    if (diplomaBytes.length > MAX_UPLOAD_MB * 1024 * 1024) {
      return json_({ status: 'error', message: 'The diploma file is larger than ' + MAX_UPLOAD_MB + ' MB.' });
    }
  }

  var sh = sheet_(APPLICATION_SHEET, APPLICATION_HEADERS);
  var row = findRowByEmail_(sh, email);
  // The whole row in one read. Each cell_() is a separate round trip to Sheets,
  // and this handler is already the slowest thing the website does.
  var existing = row ? sh.getRange(row, 1, 1, APPLICATION_HEADERS.length).getValues()[0] : [];
  var name = String(existing[APPLICATION_HEADERS.indexOf('Name')] || '');
  var track = String(existing[APPLICATION_HEADERS.indexOf('Track')] || ''); // routes the notification below

  var folder = getFolder_();
  var stamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd_HH-mm');
  var label = sanitize_(name) || sanitize_(email.split('@')[0]) || 'applicant';

  // Named on the blob rather than with a setName() afterwards: that would be a
  // second call to Drive for something the first call can already carry.
  var origName = sanitize_(data.filename) || 'signed-agreement';
  var blob = Utilities.newBlob(bytes, data.mimeType || 'application/octet-stream',
    label + '__' + stamp + '__' + origName);
  var file = folder.createFile(blob);

  // Same folder as the agreement, but tagged "Diploma" in the name instead so
  // the two are easy to tell apart once they sit side by side in Drive.
  var diplomaUrl = '';
  if (diplomaBytes) {
    var diplomaOrigName = sanitize_(data.diplomaFilename) || 'diploma';
    var diplomaBlob = Utilities.newBlob(diplomaBytes, data.diplomaMimeType || 'application/octet-stream',
      label + '__' + stamp + '__Diploma__' + diplomaOrigName);
    diplomaUrl = folder.createFile(diplomaBlob).getUrl();
  }

  // The signed agreement arriving is what makes this a real application, so
  // that moment — not the form fill — is the date stamped here.
  var applyDate = new Date();
  if (row) {
    // One write instead of three. Built from the row we already read, so the
    // untouched columns keep their values and an earlier diploma survives an
    // upload that doesn't carry a new one.
    var updated = existing.slice();
    updated[APPLICATION_HEADERS.indexOf('Apply date')] = applyDate;
    updated[APPLICATION_HEADERS.indexOf('Agreement')] = file.getUrl();
    if (diplomaUrl) updated[APPLICATION_HEADERS.indexOf('Diploma')] = diplomaUrl;
    sh.getRange(row, 1, 1, APPLICATION_HEADERS.length).setValues([updated]);
  } else {
    // No application row for this address — they typed a different email, or
    // signed a copy from elsewhere. Never drop the file: give it its own row
    // so it's still visible, and flag it in the notification below.
    sh.appendRow(rowFrom_({
      'Received': applyDate, 'Email': email, 'Apply date': applyDate, 'Agreement': file.getUrl(),
      'Diploma': diplomaUrl
    }));
  }

  var notify = notifyEmails_(track);
  if (notify) {
    MailApp.sendEmail({
      to: notify,
      replyTo: email,
      subject: 'New signed enrolment agreement: ' + (name || email),
      body: (row
        ? 'Matched to the application from ' + name + '.'
        : 'NO MATCHING APPLICATION for ' + email + ' — it was added as a new row. '
          + 'They may have used a different email at step 1.') +
        '\n\nEmail: ' + email + '\nFile: ' + file.getUrl() +
        (diplomaUrl ? '\nDiploma: ' + diplomaUrl : '')
    });
  }
  sendConfirmation_(email, track,
    'Your signed enrolment agreement has arrived — ' + SCHOOL_NAME,
    'Hi ' + (name || 'there') + ',\n\n'
      + 'Your signed enrolment agreement has reached us safely'
      + (diplomaUrl ? ', along with your diploma' : '') + '. It is now with the '
      + 'office, and someone will be in touch by email about the next steps.\n\n'
      + 'There is nothing more for you to do for now. If anything looks wrong, '
      + 'just reply to this email and we will sort it out.');

  return json_({
    status: 'ok', matched: !!row, fileId: file.getId(), fileUrl: file.getUrl(),
    diplomaUrl: diplomaUrl || undefined
  });
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

// Routes a notification to the right office by track, reading the addresses
// from the notification tab. An unrecognised or missing track (message sent
// before choosing an office, or no matching application row) goes to both, so
// nothing is ever silently missed.
function notifyEmails_(track) {
  var west = notifyColumn_(NOTIFY_WEST_HEADER, OFFICE_EMAIL_WEST);
  var east = notifyColumn_(NOTIFY_EAST_HEADER, OFFICE_EMAIL_EAST);

  var picked = track === 'Western' ? west
             : track === 'Eastern' ? east
             : west.concat(east);

  // Someone in both columns should still get exactly one copy.
  return picked.filter(function (addr, i) { return picked.indexOf(addr) === i; }).join(',');
}

// The public address a reply should go to, by track — both when we don't know
// which office it is.
function officeEmail_(track) {
  if (track === 'Western') return OFFICE_EMAIL_WEST;
  if (track === 'Eastern') return OFFICE_EMAIL_EAST;
  return [OFFICE_EMAIL_WEST, OFFICE_EMAIL_EAST].filter(function (e) { return !!e; }).join(',');
}

// Confirms to the sender that what they sent actually arrived — the website
// says so on screen, but a page can be closed and an email can be kept.
//
// Deliberately swallows its own errors: the submission is already saved by the
// time this runs, so a confirmation that won't send (mail quota, a typo'd
// address) must never turn a successful submission into an error on screen.
function sendConfirmation_(to, track, subject, body) {
  try {
    MailApp.sendEmail({
      to: to,
      name: SCHOOL_NAME,
      replyTo: officeEmail_(track), // a reply reaches a person, not this script
      subject: subject,
      body: body + '\n\nWarm regards,\n' + SCHOOL_NAME + '\n' + SCHOOL_URL
    });
  } catch (err) {
    Logger.log('Confirmation to ' + to + ' failed: ' + err);
  }
}

// The notification tab's grid, fetched once. notifyEmails_ wants two columns
// out of it, and a Sheets read is a slow call to make twice — this global lives
// exactly as long as one execution, which is the right scope for the cache.
var notifyGrid_;

function notifyGrid() {
  if (notifyGrid_ !== undefined) return notifyGrid_;
  var sh = notifySheet_();
  notifyGrid_ = (sh && sh.getLastRow() > 1)
    ? sh.getRange(1, 1, sh.getLastRow(), sh.getLastColumn()).getDisplayValues()
    : null;
  return notifyGrid_;
}

// The addresses in one column of the notification tab, top to bottom. Gaps are
// normal — the two columns fill up at their own pace — so blanks are skipped,
// and so is anything that isn't an email address (a note, a name, a heading
// someone added). Falls back to the hard-coded office address when the tab or
// the column has nothing usable in it.
function notifyColumn_(header, fallback) {
  var rows = notifyGrid();
  if (rows) {
    var headers = rows[0];
    for (var col = 0; col < headers.length; col++) {
      if (String(headers[col]).trim().toUpperCase() !== header) continue;
      // slice, not shift: the grid is cached and the other column still needs it.
      var found = rows.slice(1)
        .map(function (row) { return String(row[col] || '').trim(); })
        .filter(function (addr) { return EMAIL_RE.test(addr); });
      if (found.length) return found;
    }
  }
  return fallback ? [fallback] : [];
}

// The notification tab: by name, or — if it's been renamed — by the heading in
// its first cell, so renaming the tab can't quietly cut the notifications off.
var notifySheetFound_;

function notifySheet_() {
  if (notifySheetFound_ !== undefined) return notifySheetFound_;
  notifySheetFound_ = findNotifySheet_();
  return notifySheetFound_;
}

function findNotifySheet_() {
  var ss = SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) return null;
  var sh = ss.getSheetByName(NOTIFY_SHEET);
  if (sh) return sh;

  var all = ss.getSheets();

  // getSheetByName is case-sensitive, and nobody should have to remember
  // whether the tab was typed with a capital. Names are already in hand here,
  // so this costs nothing.
  var wanted = NOTIFY_SHEET.trim().toUpperCase();
  for (var i = 0; i < all.length; i++) {
    if (String(all[i].getName()).trim().toUpperCase() === wanted) return all[i];
  }

  // Renamed outright: fall back to the heading in the first cell. This one does
  // cost a read per tab, which is why it comes last.
  for (var j = 0; j < all.length; j++) {
    var first = String(all[j].getRange(1, 1).getDisplayValue() || '').trim().toUpperCase();
    if (first === NOTIFY_WEST_HEADER) return all[j];
  }
  return null;
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
