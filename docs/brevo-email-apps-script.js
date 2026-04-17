/**
 * ═══════════════════════════════════════════════════════════════════
 *  Email Tools — Brevo Integration
 *  Google Apps Script — paste into your spreadsheet's script editor
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Adds a "📧 Email Tools" menu to the spreadsheet with:
 *    • Send Schedule      — upcoming training events
 *    • Send Lectures      — upcoming lectures
 *    • Send to Level      — filtered by L1/L2/L3
 *    • Test Email         — send test to yourself
 *    • Manage Contacts    — open Contacts tab
 *
 *  SETUP:
 *    1. Go to Project Settings (⚙️) → Script Properties
 *    2. Add property: BREVO_API_KEY = your Brevo API key
 *    3. Add property: SENDER_EMAIL   = verified sender email
 *    4. Add property: SENDER_NAME    = sender display name
 *    5. Create a "Contacts" tab with columns:
 *       Name | Email | Level | Status | Consent Date
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
    brevoUrl: 'https://api.brevo.com/v3/smtp/email',
    contactsSheet: 'Contacts',
    scheduleSheet: 'Schedule',
    lecturesSheet: 'Lectures'
  };
}

/* ═══════════════════════════════════════════════════════════════════
   MENU
   ═══════════════════════════════════════════════════════════════════ */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('📧 Email Tools')
    .addItem('Send Schedule (upcoming events)', 'sendScheduleEmail')
    .addItem('Send Lectures (upcoming lectures)', 'sendLecturesEmail')
    .addSeparator()
    .addItem('Send to Level L1', 'sendToL1')
    .addItem('Send to Level L2', 'sendToL2')
    .addItem('Send to Level L3', 'sendToL3')
    .addSeparator()
    .addItem('✉️ Test Email (send to myself)', 'sendTestEmail')
    .addItem('📋 Open Contacts Tab', 'openContactsTab')
    .addToUi();
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
   SCHEDULE & LECTURES PARSING
   ═══════════════════════════════════════════════════════════════════ */

/**
 * Get upcoming schedule events from the Schedule sheet.
 * Expected columns: Date | Facilitator | Title | Description | Module | Location | Type1 | Type2
 */
function getScheduleEvents_() {
  var config = getConfig_();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(config.scheduleSheet);
  if (!sheet) return [];

  var data = sheet.getDataRange().getValues();
  var events = [];
  var today = new Date();
  today.setHours(0, 0, 0, 0);

  for (var i = 1; i < data.length; i++) {
    var dateStr = String(data[i][0] || '').trim();
    if (!dateStr) continue;

    // Try to parse the end date from a range like "20.06.2025 - 22.06.2025"
    var endDate = parseDateRange_(dateStr);
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
    var dateStr = String(data[i][0] || '').trim();
    if (!dateStr) continue;

    var d = parseDate_(dateStr);
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
   DATE HELPERS
   ═══════════════════════════════════════════════════════════════════ */

/** Parse a single date in DD.MM.YYYY format */
function parseDate_(str) {
  var parts = String(str).match(/(\d{2})\.(\d{2})\.(\d{4})/);
  if (!parts) return null;
  return new Date(parseInt(parts[3]), parseInt(parts[2]) - 1, parseInt(parts[1]));
}

/** Parse date range like "29.02.2024 - 03.03.2024", return the END date */
function parseDateRange_(str) {
  var s = String(str);
  // Try range format first
  var match = s.match(/\d{2}\.\d{2}\.\d{4}\s*-\s*(\d{2}\.\d{2}\.\d{4})/);
  if (match) return parseDate_(match[1]);
  // Fall back to single date
  return parseDate_(s);
}

/* ═══════════════════════════════════════════════════════════════════
   HTML EMAIL TEMPLATES
   ═══════════════════════════════════════════════════════════════════ */

function buildEmailHeader_(title) {
  return '<!DOCTYPE html>' +
    '<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">' +
    '<style>' +
    'body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f5f5f5; }' +
    '.container { max-width: 600px; margin: 0 auto; background: #ffffff; }' +
    '.header { background: #1a1a2e; color: #ffffff; padding: 30px; text-align: center; }' +
    '.header h1 { margin: 0; font-size: 24px; font-weight: 300; letter-spacing: 1px; }' +
    '.content { padding: 30px; }' +
    '.event { border-left: 3px solid #6c63ff; padding: 15px 20px; margin-bottom: 20px; background: #fafafa; }' +
    '.event h3 { margin: 0 0 8px 0; color: #1a1a2e; font-size: 16px; }' +
    '.event .meta { color: #666; font-size: 13px; margin-bottom: 6px; }' +
    '.event .desc { color: #444; font-size: 14px; line-height: 1.5; }' +
    '.footer { background: #f0f0f0; padding: 20px 30px; text-align: center; font-size: 12px; color: #888; }' +
    '.footer a { color: #6c63ff; }' +
    '</style></head><body>' +
    '<div class="container">' +
    '<div class="header"><h1>' + escapeHtml_(title) + '</h1></div>' +
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
    html += '<p>Here are the upcoming training events:</p>';
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
    html += '<p>Here are the upcoming lectures:</p>';
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

/* ═══════════════════════════════════════════════════════════════════
   WEB APP — JSON API
   ═══════════════════════════════════════════════════════════════════
   Deploy as Web App to expose sheet data as JSON.
   Usage:
     GET <url>                → data from the active sheet
     GET <url>?sheet=Schedule → data from the "Schedule" sheet
   ═══════════════════════════════════════════════════════════════════ */

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // Use the ?sheet= parameter if provided, otherwise fall back to the active sheet
  var sheetName = (e && e.parameter && e.parameter.sheet)
    ? e.parameter.sheet
    : null;

  var sheet = sheetName
    ? ss.getSheetByName(sheetName)
    : ss.getActiveSheet();

  if (!sheet) {
    return ContentService.createTextOutput(
      JSON.stringify({ error: 'Sheet "' + sheetName + '" not found.' })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  // Get all data from the sheet
  var data = sheet.getDataRange().getValues();

  // Get headers (first row) — used as JSON keys
  var headers = data[0];

  var jsonData = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];

    // Skip completely empty rows
    if (row.every(function(cell) {
      return cell === '' || cell === null || cell === undefined;
    })) {
      continue;
    }

    // Build object dynamically from headers
    var rowData = {};
    for (var j = 0; j < headers.length; j++) {
      var key = headers[j].toString().toLowerCase().trim();
      if (key) {
        rowData[key] = row[j] ? row[j].toString() : '';
      }
    }

    // Only add rows that have at least a date
    if (rowData.date) {
      jsonData.push(rowData);
    }
  }

  return ContentService.createTextOutput(JSON.stringify(jsonData))
    .setMimeType(ContentService.MimeType.JSON);
}
