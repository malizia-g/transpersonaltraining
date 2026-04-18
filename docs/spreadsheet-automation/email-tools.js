/**
 * ═══════════════════════════════════════════════════════════════════
 *  Email Tools — Configuration & Brevo Integration
 *  Google Apps Script — paste into your spreadsheet's script editor
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Handles configuration, email composition and sending via Brevo API.
 *  Requires: menu.js (getContacts_, menu actions, etc.)
 *
 *  SETUP:
 *    1. Go to Project Settings (⚙️) → Script Properties
 *    2. Add property: BREVO_API_KEY = your Brevo API key
 *    3. Add property: SENDER_EMAIL   = verified sender email
 *    4. Add property: SENDER_NAME    = sender display name
 */

/* ═══════════════════════════════════════════════════════════════════
   CONFIGURATION
   ═══════════════════════════════════════════════════════════════════ */

function getConfig_() {
  var props = PropertiesService.getScriptProperties();
  var apiKey = props.getProperty('BREVO_API_KEY');
  if (!apiKey) {
    throw new Error(
      'BREVO_API_KEY not found!\n\n' +
      'Go to Project Settings (⚙️) → Script Properties\n' +
      'Add: BREVO_API_KEY = your Brevo API key'
    );
  }
  return {
    apiKey: apiKey,
    senderEmail: props.getProperty('SENDER_EMAIL') || 'noreply@transpersonaltraining.eu',
    senderName: props.getProperty('SENDER_NAME') || 'Transpersonal Training',
    siteUrl: props.getProperty('SITE_URL') || 'https://malizia-g.github.io/transpersonaltraining/',
    logoUrl: props.getProperty('LOGO_URL') || 'https://malizia-g.github.io/transpersonaltraining/assets/images/logo.svg',
    heroImageUrl: props.getProperty('EMAIL_HERO_URL') || 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
    brevoUrl: 'https://api.brevo.com/v3/smtp/email',
    contactsSheet: 'Contacts',
    scheduleSheet: props.getProperty('SCHEDULE_SHEET') || 'Seminars',
    lecturesSheet: 'Lectures'
  };
}

/**
 * Return the first matching sheet by name.
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} ss
 * @param {Array<string>} names
 * @return {GoogleAppsScript.Spreadsheet.Sheet|null}
 */
function getFirstExistingSheet_(ss, names) {
  for (var i = 0; i < names.length; i++) {
    var name = String(names[i] || '').trim();
    if (!name) continue;
    var s = ss.getSheetByName(name);
    if (s) return s;
  }
  return null;
}

/* ═══════════════════════════════════════════════════════════════════
   DATE HELPERS
   ═══════════════════════════════════════════════════════════════════ */

/** Parse a single date in DD.MM.YYYY format */
function parseDate_(str) {
  if (str instanceof Date && !isNaN(str.getTime())) {
    return new Date(str.getFullYear(), str.getMonth(), str.getDate());
  }

  var s = String(str || '').trim();
  if (!s) return null;

  // Accept DD.MM.YYYY, DD/MM/YYYY, DD-MM-YYYY
  var parts = s.match(/(\d{1,2})[.\/-](\d{1,2})[.\/-](\d{4})/);
  if (parts) {
    return new Date(parseInt(parts[3], 10), parseInt(parts[2], 10) - 1, parseInt(parts[1], 10));
  }

  // Accept YYYY-MM-DD
  var isoParts = s.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoParts) {
    return new Date(parseInt(isoParts[1], 10), parseInt(isoParts[2], 10) - 1, parseInt(isoParts[3], 10));
  }

  return null;
}

/** Parse date range like "29.02.2024 - 03.03.2024", return the END date */
function parseDateRange_(str) {
  if (str instanceof Date && !isNaN(str.getTime())) {
    return new Date(str.getFullYear(), str.getMonth(), str.getDate());
  }

  var s = String(str);
  // Try range format first
  var match = s.match(/\d{1,2}[.\/-]\d{1,2}[.\/-]\d{4}\s*[\-–—]\s*(\d{1,2}[.\/-]\d{1,2}[.\/-]\d{4})/);
  if (match) return parseDate_(match[1]);
  // Fall back to single date
  return parseDate_(s);
}

/* ═══════════════════════════════════════════════════════════════════
   SCHEDULE & LECTURES PARSING
   ═══════════════════════════════════════════════════════════════════ */

/**
 * Get upcoming schedule events from the Seminars/Schedule sheet.
 * Expected columns: Date | Facilitator | Title | Description | Module | Location | Type1 | Type2
 */
function getScheduleEvents_() {
  var config = getConfig_();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getFirstExistingSheet_(ss, [config.scheduleSheet, 'Seminars', 'Schedule']);
  if (!sheet) return [];

  var data = sheet.getDataRange().getValues();
  var events = [];
  var today = new Date();
  today.setHours(0, 0, 0, 0);

  for (var i = 1; i < data.length; i++) {
    var rawDate = data[i][0];
    var dateStr = String(rawDate || '').trim();
    if (!dateStr) continue;

    // Try to parse the end date from a range like "20.06.2025 - 22.06.2025"
    var endDate = parseDateRange_(rawDate);
    if (endDate && endDate >= today) {
      events.push({
        date: dateStr,
        facilitator: String(data[i][1] || '').trim(),
        title: String(data[i][2] || '').trim(),
        description: String(data[i][3] || '').trim(),
        module: String(data[i][4] || '').trim(),
        location: String(data[i][5] || '').trim(),
        type1: String(data[i][6] || '').trim(),
        type2: String(data[i][7] || '').trim()
      });
    }
  }

  return events;
}

/**
 * Get upcoming lecture events from the Lectures sheet.
 * Expected columns: Date | Module | Title | Description | Teacher 1 | Teacher 2 | Start Hour | Finish Hour | Video Link
 */
function getLectureEvents_() {
  var config = getConfig_();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(config.lecturesSheet);
  if (!sheet) return [];

  var data = sheet.getDataRange().getValues();
  var events = [];
  var today = new Date();
  today.setHours(0, 0, 0, 0);

  for (var i = 1; i < data.length; i++) {
    var rawDate = data[i][0];
    var dateStr = String(rawDate || '').trim();
    if (!dateStr) continue;

    var d = parseDate_(rawDate);
    if (d && d >= today) {
      events.push({
        date: dateStr,
        module: String(data[i][1] || '').trim(),
        title: String(data[i][2] || '').trim(),
        description: String(data[i][3] || '').trim(),
        teacher1: String(data[i][4] || '').trim(),
        teacher2: String(data[i][5] || '').trim(),
        startHour: String(data[i][6] || '').trim(),
        finishHour: String(data[i][7] || '').trim()
      });
    }
  }

  return events;
}

/* ═══════════════════════════════════════════════════════════════════
   HTML EMAIL TEMPLATES
   ═══════════════════════════════════════════════════════════════════ */

function buildEmailHeader_(title) {
  var config = getConfig_();

  return '<!DOCTYPE html>' +
    '<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">' +
    '<style>' +
    'body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #eef2ef; color: #1f2f24; }' +
    '.container { max-width: 600px; margin: 0 auto; background: #ffffff; }' +
    '.hero { width: 100%; line-height: 0; }' +
    '.hero img { width: 100%; max-height: 260px; object-fit: cover; display: block; }' +
    '.header { background: linear-gradient(180deg, #19352a 0%, #12251d 100%); color: #ffffff; padding: 26px 30px 30px; text-align: center; }' +
    '.logo-wrap { display: inline-block; background: #0e1f18; border: 1px solid rgba(255,255,255,0.18); border-radius: 12px; padding: 8px 12px; margin-bottom: 14px; }' +
    '.logo-wrap img { display: block; width: 130px; max-width: 100%; height: auto; }' +
    '.kicker { margin: 0; font-size: 11px; letter-spacing: 1.6px; text-transform: uppercase; color: #b9d2c2; }' +
    '.header h1 { margin: 8px 0 0; font-size: 28px; font-weight: 600; letter-spacing: 0.2px; }' +
    '.header p { margin: 9px 0 0; font-size: 14px; color: #d8e7de; }' +
    '.campaign-title { margin: 14px auto 0; display: inline-block; font-size: 12px; color: #d9ece0; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 999px; padding: 6px 12px; }' +
    '.content { padding: 30px; }' +
    '.intro { color: #425648; font-size: 14px; margin: 0 0 20px; }' +
    '.event { border-left: 4px solid #4f8466; padding: 15px 20px; margin-bottom: 18px; background: #f7fbf8; border-radius: 0 8px 8px 0; }' +
    '.event h3 { margin: 0 0 8px 0; color: #1a2d22; font-size: 16px; }' +
    '.event .meta { color: #566a5c; font-size: 13px; margin-bottom: 6px; }' +
    '.event .desc { color: #444; font-size: 14px; line-height: 1.5; }' +
    '.footer { background: #edf3ef; padding: 20px 30px; text-align: center; font-size: 12px; color: #627767; }' +
    '.footer a { color: #2f6f4f; }' +
    '</style></head><body>' +
    '<div class="container">' +
    '<div class="hero"><img src="' + escapeHtml_(config.heroImageUrl) + '" alt="Forest landscape" /></div>' +
    '<div class="header">' +
    '<div class="logo-wrap"><a href="' + escapeHtml_(config.siteUrl) + '" target="_blank" rel="noopener noreferrer"><img src="' + escapeHtml_(config.logoUrl) + '" alt="Transpersonal Training" /></a></div>' +
    '<p class="kicker">Transpersonal Training</p>' +
    '<h1>Next Events</h1>' +
    '<p>Discover upcoming modules, lectures and live sessions.</p>' +
    '<div class="campaign-title">' + escapeHtml_(title) + '</div>' +
    '</div>' +
    '<div class="content">';
}

function buildEmailFooter_() {
  return '</div>' +
    '<div class="footer">' +
    '<p>Transpersonal Training — European Transpersonal Training</p>' +
    '<p><a href="{{unsubscribe}}">Unsubscribe</a></p>' +
    '</div></div></body></html>';
}

function escapeHtml_(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildScheduleHtml_(events) {
  var html = buildEmailHeader_('Upcoming Training Events');

  if (events.length === 0) {
    html += '<p>No upcoming events scheduled at this time.</p>';
  } else {
    html += '<p class="intro">Here are the upcoming training events:</p>';
    for (var i = 0; i < events.length; i++) {
      var e = events[i];
      html += '<div class="event">';
      html += '<h3>' + escapeHtml_(e.title) + '</h3>';
      html += '<div class="meta">📅 ' + escapeHtml_(e.date);
      if (e.location) html += ' &nbsp;|&nbsp; 📍 ' + escapeHtml_(e.location);
      if (e.facilitator) html += ' &nbsp;|&nbsp; 👤 ' + escapeHtml_(e.facilitator);
      html += '</div>';
      if (e.module) html += '<div class="meta">' + escapeHtml_(e.module) + '</div>';
      if (e.description) html += '<div class="desc">' + escapeHtml_(e.description) + '</div>';
      html += '</div>';
    }
  }

  html += buildEmailFooter_();
  return html;
}

function buildLecturesHtml_(events) {
  var html = buildEmailHeader_('Upcoming Lectures');

  if (events.length === 0) {
    html += '<p>No upcoming lectures scheduled at this time.</p>';
  } else {
    html += '<p class="intro">Here are the upcoming lectures:</p>';
    for (var i = 0; i < events.length; i++) {
      var e = events[i];
      html += '<div class="event">';
      html += '<h3>' + escapeHtml_(e.title) + '</h3>';
      html += '<div class="meta">📅 ' + escapeHtml_(e.date);
      if (e.startHour) html += ' &nbsp;|&nbsp; 🕐 ' + escapeHtml_(e.startHour) + ' – ' + escapeHtml_(e.finishHour);
      html += '</div>';
      var teachers = [e.teacher1, e.teacher2].filter(function(t) { return t; }).join(', ');
      if (teachers) html += '<div class="meta">👤 ' + escapeHtml_(teachers) + '</div>';
      if (e.module) html += '<div class="meta">Module ' + escapeHtml_(e.module) + '</div>';
      if (e.description) html += '<div class="desc">' + escapeHtml_(e.description) + '</div>';
      html += '</div>';
    }
  }

  html += buildEmailFooter_();
  return html;
}

/* ═══════════════════════════════════════════════════════════════════
   BREVO API
   ═══════════════════════════════════════════════════════════════════ */

/**
 * Send email via Brevo API.
 * @param {Array<{name:string, email:string}>} recipients
 * @param {string} subject
 * @param {string} htmlContent
 */
function sendViaBrevo_(recipients, subject, htmlContent) {
  var config = getConfig_();

  if (!recipients || recipients.length === 0) {
    throw new Error('No recipients found. Check the Contacts tab.');
  }

  var to = recipients.map(function(r) {
    return { email: r.email, name: r.name || r.email };
  });

  var payload = {
    sender: { name: config.senderName, email: config.senderEmail },
    to: to,
    subject: subject,
    htmlContent: htmlContent
  };

  var options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'api-key': config.apiKey
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  var response = UrlFetchApp.fetch(config.brevoUrl, options);
  var code = response.getResponseCode();
  var body = response.getContentText();

  if (code >= 200 && code < 300) {
    Logger.log('✅ Email sent successfully to ' + to.length + ' recipients');
    return JSON.parse(body);
  } else {
    Logger.log('❌ Brevo error: ' + code + ' — ' + body);
    throw new Error('Brevo API error (' + code + '): ' + body);
  }
}

/* ═══════════════════════════════════════════════════════════════════
   CONTACTS
   ═══════════════════════════════════════════════════════════════════ */

/**
 * Get contacts from the Contacts sheet.
 * Columns: Name | Email | Level | Status | Consent Date
 * Only returns contacts with Status = "Active" and a Consent Date.
 */
function getContacts_(filterLevel) {
  var config = getConfig_();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(config.contactsSheet);
  if (!sheet) {
    throw new Error(
      'Sheet "' + config.contactsSheet + '" not found.\n' +
      'Create a tab named "Contacts" with columns:\n' +
      'Name | Email | Level | Status | Consent Date'
    );
  }

  var data = sheet.getDataRange().getValues();
  var contacts = [];

  for (var i = 1; i < data.length; i++) { // skip header row
    var name = String(data[i][0] || '').trim();
    var email = String(data[i][1] || '').trim();
    var level = String(data[i][2] || '').trim().toUpperCase();
    var status = String(data[i][3] || '').trim().toLowerCase();
    var consent = data[i][4];

    // GDPR: only include active contacts with consent
    if (!email || status !== 'active' || !consent) continue;

    // Filter by level if specified
    if (filterLevel && level !== filterLevel.toUpperCase()) continue;

    contacts.push({ name: name, email: email, level: level });
  }

  return contacts;
}

function openContactsTab() {
  var config = getConfig_();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(config.contactsSheet);
  if (!sheet) {
    // Create the Contacts tab if it doesn't exist
    sheet = ss.insertSheet(config.contactsSheet);
    sheet.getRange('A1:E1').setValues([['Name', 'Email', 'Level', 'Status', 'Consent Date']]);
    sheet.getRange('A1:E1').setFontWeight('bold');
    sheet.setColumnWidth(1, 150);
    sheet.setColumnWidth(2, 250);
    sheet.setColumnWidth(3, 80);
    sheet.setColumnWidth(4, 80);
    sheet.setColumnWidth(5, 120);
  }
  ss.setActiveSheet(sheet);
}

/* ═══════════════════════════════════════════════════════════════════
   MENU ACTIONS
   ═══════════════════════════════════════════════════════════════════ */

function sendScheduleEmail() {
  var ui = SpreadsheetApp.getUi();
  var contacts = getContacts_();
  var events = getScheduleEvents_();

  if (contacts.length === 0) {
    ui.alert('No active contacts found in the Contacts tab.');
    return;
  }

  var result = ui.alert(
    'Send Schedule Email',
    'Send ' + events.length + ' upcoming events to ' + contacts.length + ' contacts?',
    ui.ButtonSet.YES_NO
  );

  if (result !== ui.Button.YES) return;

  try {
    var html = buildScheduleHtml_(events);
    sendViaBrevo_(contacts, 'Upcoming Training Events — Transpersonal Training', html);
    ui.alert('✅ Email sent to ' + contacts.length + ' contacts!');
  } catch (e) {
    ui.alert('❌ Error: ' + e.message);
  }
}

function sendLecturesEmail() {
  var ui = SpreadsheetApp.getUi();
  var contacts = getContacts_();
  var events = getLectureEvents_();

  if (contacts.length === 0) {
    ui.alert('No active contacts found in the Contacts tab.');
    return;
  }

  var result = ui.alert(
    'Send Lectures Email',
    'Send ' + events.length + ' upcoming lectures to ' + contacts.length + ' contacts?',
    ui.ButtonSet.YES_NO
  );

  if (result !== ui.Button.YES) return;

  try {
    var html = buildLecturesHtml_(events);
    sendViaBrevo_(contacts, 'Upcoming Lectures — Transpersonal Training', html);
    ui.alert('✅ Email sent to ' + contacts.length + ' contacts!');
  } catch (e) {
    ui.alert('❌ Error: ' + e.message);
  }
}

function sendToLevel_(level) {
  var ui = SpreadsheetApp.getUi();
  var contacts = getContacts_(level);
  var scheduleEvents = getScheduleEvents_();
  var lectureEvents = getLectureEvents_();

  if (contacts.length === 0) {
    ui.alert('No active contacts found for level ' + level + '.');
    return;
  }

  var result = ui.alert(
    'Send to Level ' + level,
    'Send upcoming events to ' + contacts.length + ' ' + level + ' contacts?',
    ui.ButtonSet.YES_NO
  );

  if (result !== ui.Button.YES) return;

  try {
    // Combine schedule and lectures into one email
    var html = buildEmailHeader_('Updates for ' + level + ' Students');
    
    if (scheduleEvents.length > 0) {
      html += '<h2 style="color:#1a1a2e; font-size:18px;">Training Events</h2>';
      for (var i = 0; i < scheduleEvents.length; i++) {
        var e = scheduleEvents[i];
        html += '<div class="event">';
        html += '<h3>' + escapeHtml_(e.title) + '</h3>';
        html += '<div class="meta">📅 ' + escapeHtml_(e.date);
        if (e.location) html += ' | 📍 ' + escapeHtml_(e.location);
        html += '</div></div>';
      }
    }

    if (lectureEvents.length > 0) {
      html += '<h2 style="color:#1a1a2e; font-size:18px;">Lectures</h2>';
      for (var j = 0; j < lectureEvents.length; j++) {
        var l = lectureEvents[j];
        html += '<div class="event">';
        html += '<h3>' + escapeHtml_(l.title) + '</h3>';
        html += '<div class="meta">📅 ' + escapeHtml_(l.date);
        if (l.startHour) html += ' | 🕐 ' + escapeHtml_(l.startHour) + '–' + escapeHtml_(l.finishHour);
        html += '</div></div>';
      }
    }

    html += buildEmailFooter_();
    sendViaBrevo_(contacts, 'Training Updates — ' + level, html);
    ui.alert('✅ Email sent to ' + contacts.length + ' ' + level + ' contacts!');
  } catch (e) {
    ui.alert('❌ Error: ' + e.message);
  }
}

function sendToL1() { sendToLevel_('L1'); }
function sendToL2() { sendToLevel_('L2'); }
function sendToL3() { sendToLevel_('L3'); }

function sendTestEmail() {
  var ui = SpreadsheetApp.getUi();
  var response = ui.prompt(
    '✉️ Test Email',
    'Enter your email address:',
    ui.ButtonSet.OK_CANCEL
  );

  if (response.getSelectedButton() !== ui.Button.OK) return;

  var testEmail = response.getResponseText().trim();
  if (!testEmail || testEmail.indexOf('@') === -1) {
    ui.alert('Please enter a valid email address.');
    return;
  }

  try {
    var scheduleEvents = getScheduleEvents_();
    var html = buildScheduleHtml_(scheduleEvents);
    sendViaBrevo_(
      [{ name: 'Test', email: testEmail }],
      '[TEST] Upcoming Events — Transpersonal Training',
      html
    );
    ui.alert('✅ Test email sent to ' + testEmail + '!');
  } catch (e) {
    ui.alert('❌ Error: ' + e.message);
  }
}
