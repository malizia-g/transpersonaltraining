/* ═══════════════════════════════════════════════════════════════════
   MONTHLY INFO CALLS — calendar feed + sign-up
   ═══════════════════════════════════════════════════════════════════
   Serves the website's /monthly-call/ page, through the same /exec URL
   as the Seminars/Lectures JSON (see doGet in JSON-API.js):

     GET  <url>?calls=1  → the upcoming info calls, read from the EWTT
                           Google Calendar: only events whose title has
                           the word "call" in it. The Meet link is NOT
                           in this answer — it goes out by email only.
     POST <url>          → { action: "callSignup", name, email, eventId }
                           adds a row to the "Call signups" tab of this
                           spreadsheet, emails the person the date, the
                           Google Meet link and an "add to calendar" link,
                           tells both offices (the homepage form's
                           Notifications tab), and — if they ticked the
                           box — adds them to the Brevo newsletter list.

   The calendar is read as whoever deployed the web app, so that account
   must be able to see the EWTT calendar (share it with them in Google
   Calendar → Settings → Share with specific people).

   After changing this code, run testCalls once from the editor (it asks
   for Calendar and Gmail permission the first time), then
   Deploy → Manage deployments → pencil → New version → Deploy.
   ═══════════════════════════════════════════════════════════════════ */

var CALLS_CALENDAR_ID = 'c_0b1085b8962d1b20c3363212521e74653d19480398f0e5074aa7a3e1c987bb37@group.calendar.google.com';
var CALLS_TITLE_RE = /\bcall\b/i;          // which calendar events are info calls
var CALLS_MEET_URL = 'https://meet.google.com/kdz-gzbi-aef';
var CALLS_LOOKAHEAD_DAYS = 365;
var CALLS_TIMEZONE = 'Europe/Rome';
var CALLS_SIGNUP_SHEET = 'Call signups';
var CALLS_SIGNUP_HEADERS = ['Received', 'Name', 'Email', 'Call', 'Event ID', 'Newsletter', 'Email status'];

// Who hears about each sign-up: the same people as the homepage contact form,
// both offices — read from the "Notifications" tab of the forms spreadsheet
// ("Agreements and Contacts"), one column per office. Edit the addresses
// there, not here. If the tab can't be read, the two public addresses below
// are used instead, so a sign-up is never silently unannounced.
var CALLS_NOTIFY_SPREADSHEET_ID = '1m35NaHlN_c3h_wNT0DhoG0MpUhCAy9ktpsCMDGpvpLs';
var CALLS_NOTIFY_SHEET = 'Notifications';
var CALLS_NOTIFY_HEADERS = ['WEST TRACK', 'EAST TRACK'];
var CALLS_NOTIFY_FALLBACK = ['west-office@transpersonal-training.com', 'east-office@transpersonal-training.com'];
var CALLS_MIN_FILL_MS = 3000;              // faster than this is a bot
var CALLS_SCHOOL_NAME = 'Transpersonal Training';
var CALLS_SCHOOL_URL = 'https://transpersonal-training.com';

function callsJson_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Upcoming info calls, soonest first, as plain objects the website can use.
function upcomingCalls_() {
  var cal = CalendarApp.getCalendarById(CALLS_CALENDAR_ID);
  if (!cal) throw new Error('Calendar not found or not shared with this account: ' + CALLS_CALENDAR_ID);
  var now = new Date();
  var until = new Date(now.getTime() + CALLS_LOOKAHEAD_DAYS * 24 * 3600 * 1000);
  return cal.getEvents(now, until)
    .filter(function (ev) { return !ev.isAllDayEvent() && CALLS_TITLE_RE.test(ev.getTitle()); })
    .map(function (ev) {
      return {
        id: ev.getId(),
        title: ev.getTitle(),
        description: ev.getDescription() || '',
        start: ev.getStartTime().toISOString(),
        end: ev.getEndTime().toISOString()
      };
    });
}

function callsFeed_() {
  try {
    return callsJson_(upcomingCalls_());
  } catch (err) {
    return callsJson_({ error: String(err) });
  }
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return callsJson_({ status: 'error', message: 'No data received.' });
    }
    var data = JSON.parse(e.postData.contents);
    if (data.action === 'callSignup') return handleCallSignup_(data);
    return callsJson_({ status: 'error', message: 'Unknown action.' });
  } catch (err) {
    return callsJson_({ status: 'error', message: String(err) });
  }
}

function handleCallSignup_(data) {
  // Bots: a filled honeypot or an impossibly fast submission is accepted
  // (so the bot moves on) and dropped, with a line in Executions.
  if (data.website) {
    Logger.log('Call signup dropped (honeypot): ' + data.email);
    return callsJson_({ status: 'ok' });
  }
  if (typeof data.elapsedMs === 'number' && data.elapsedMs < CALLS_MIN_FILL_MS) {
    Logger.log('Call signup dropped (' + data.elapsedMs + ' ms): ' + data.email);
    return callsJson_({ status: 'ok' });
  }

  var name = String(data.name || '').trim().slice(0, 120);
  var email = String(data.email || '').trim().slice(0, 160);
  if (!name || !email) return callsJson_({ status: 'error', message: 'Please fill in your name and email.' });
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return callsJson_({ status: 'error', message: 'That email address does not look right.' });
  }

  // The call they chose, or the next one. None scheduled is fine: they are
  // on the list and hear from us when a date is set.
  var calls = upcomingCalls_();
  var call = null;
  for (var i = 0; i < calls.length; i++) {
    if (calls[i].id === data.eventId) { call = calls[i]; break; }
  }
  if (!call) call = calls[0] || null;

  var newsletter = !!data.newsletter; // the opt-in box, unticked by default

  var sh = callsSheet_();
  var when = call ? callWhen_(call) : 'Next call (no date yet)';
  sh.appendRow([new Date(), name, email, when, call ? call.id : '', newsletter ? 'Yes' : 'No', 'sending…']);
  var row = sh.getLastRow();
  var status = [];

  // Both offices hear about it. Its own try: a bad address in the
  // Notifications tab must not stop the person getting their link.
  var notify = callsNotifyEmails_();
  try {
    MailApp.sendEmail({
      to: notify.join(','),
      replyTo: email,
      name: 'Transpersonal Training website',
      subject: 'Info call sign-up: ' + name,
      body: name + ' <' + email + '> signed up for the info call.\n\n'
        + 'Call: ' + when + '\n'
        + 'Newsletter: ' + (newsletter ? 'yes' : 'no') + '\n\n'
        + 'The Google Meet link has been emailed to them automatically. '
        + 'All sign-ups are in the "' + CALLS_SIGNUP_SHEET + '" tab of the Seminars/Lectures spreadsheet.'
    });
    status.push('Notified ' + notify.join(', '));
  } catch (err) {
    Logger.log('Call signup notification failed: ' + err);
    status.push('Notification FAILED: ' + err);
  }

  if (newsletter) status.push(callsAddToNewsletter_(name, email));

  try {
    MailApp.sendEmail({
      to: email,
      name: CALLS_SCHOOL_NAME,
      subject: call
        ? 'Your link for the info call on ' + Utilities.formatDate(new Date(call.start), CALLS_TIMEZONE, 'd MMMM')
        : 'You are on the list for our next info call',
      body: callEmailText_(name, call),
      htmlBody: callEmailHtml_(name, call)
    });
    status.unshift('Link sent');
  } catch (err) {
    Logger.log('Call signup email to ' + email + ' failed: ' + err);
    status.unshift('Link email FAILED: ' + err);
  }
  sh.getRange(row, CALLS_SIGNUP_HEADERS.indexOf('Email status') + 1).setValue(status.join(' · '));

  return callsJson_({ status: 'ok', scheduled: !!call });
}

// Every valid address under WEST TRACK and EAST TRACK, each once.
function callsNotifyEmails_() {
  var found = [];
  try {
    var ss = SpreadsheetApp.openById(CALLS_NOTIFY_SPREADSHEET_ID);
    var sh = ss.getSheetByName(CALLS_NOTIFY_SHEET);
    var rows = sh ? sh.getDataRange().getValues() : [];
    if (rows.length) {
      var headers = rows[0].map(function (h) { return String(h).trim().toUpperCase(); });
      CALLS_NOTIFY_HEADERS.forEach(function (wanted) {
        var col = headers.indexOf(wanted);
        if (col < 0) return;
        rows.slice(1).forEach(function (r) {
          var addr = String(r[col] || '').trim();
          if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(addr) && found.indexOf(addr) < 0) found.push(addr);
        });
      });
    }
  } catch (err) {
    Logger.log('Notifications tab unreadable, using the office addresses: ' + err);
  }
  return found.length ? found : CALLS_NOTIFY_FALLBACK;
}

// Adds the person to the general Brevo list (BREVO_LIST_ALL in Script
// Properties, the list the newsletter is sent to). Returns a line for the
// sheet's status column; never throws.
function callsAddToNewsletter_(name, email) {
  try {
    var config = getConfig_();
    if (!config.listAll) return 'Newsletter: BREVO_LIST_ALL not set, add them by hand';
    var res = UrlFetchApp.fetch('https://api.brevo.com/v3/contacts', {
      method: 'post',
      contentType: 'application/json',
      headers: { 'api-key': config.apiKey, accept: 'application/json' },
      payload: JSON.stringify({
        email: email,
        attributes: { FIRSTNAME: name },
        listIds: [Number(config.listAll)],
        updateEnabled: true // already in Brevo → just add them to the list
      }),
      muteHttpExceptions: true
    });
    var code = res.getResponseCode();
    return code < 300 ? 'Added to newsletter' : 'Newsletter FAILED (' + code + '): ' + res.getContentText().slice(0, 200);
  } catch (err) {
    return 'Newsletter FAILED: ' + err;
  }
}

function callsSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(CALLS_SIGNUP_SHEET);
  if (!sh) {
    sh = ss.insertSheet(CALLS_SIGNUP_SHEET);
    sh.appendRow(CALLS_SIGNUP_HEADERS);
    sh.getRange(1, 1, 1, CALLS_SIGNUP_HEADERS.length).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

// "Wednesday 9 December 2026, 20:00–21:00 (Italy/Germany time)"
function callWhen_(call) {
  var s = new Date(call.start), e = new Date(call.end);
  return Utilities.formatDate(s, CALLS_TIMEZONE, 'EEEE d MMMM yyyy, HH:mm') + '–'
    + Utilities.formatDate(e, CALLS_TIMEZONE, 'HH:mm') + ' (Central European Time)';
}

function callGoogleCalendarUrl_(call) {
  function stamp(iso) { return iso.replace(/[-:]/g, '').replace(/\.\d{3}/, ''); }
  return 'https://calendar.google.com/calendar/render?action=TEMPLATE'
    + '&text=' + encodeURIComponent(CALLS_SCHOOL_NAME + ' — info call')
    + '&dates=' + stamp(call.start) + '/' + stamp(call.end)
    + '&details=' + encodeURIComponent('Join on Google Meet: ' + CALLS_MEET_URL)
    + '&location=' + encodeURIComponent(CALLS_MEET_URL);
}

function callEmailText_(name, call) {
  if (!call) {
    return 'Dear ' + name + ',\n\n'
      + 'thank you for your interest in our monthly info call. No date is set right now: '
      + 'we will write to you as soon as the next one is in the calendar.\n\n'
      + 'Warm regards,\n' + CALLS_SCHOOL_NAME + '\n' + CALLS_SCHOOL_URL;
  }
  return 'Dear ' + name + ',\n\n'
    + 'thank you for signing up for our info call. Here are the details:\n\n'
    + 'When: ' + callWhen_(call) + '\n'
    + 'Where: Google Meet — ' + CALLS_MEET_URL + '\n\n'
    + 'Add it to your Google Calendar: ' + callGoogleCalendarUrl_(call) + '\n\n'
    + 'No preparation is needed: come with your questions. You can join from a browser, '
    + 'no account or app required.\n\n'
    + 'Warm regards,\n' + CALLS_SCHOOL_NAME + '\n' + CALLS_SCHOOL_URL;
}

// Flat hex copies of the site palette (see the forms script for why).
function callEmailHtml_(name, call) {
  var deep = '#1a1230', acc = '#d4b75e', paper = '#f7f4ed', heading = '#252163', body = '#5c574d', line = '#dcd7cb';
  var serif = "Georgia, 'Times New Roman', serif";
  var sans = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function button(href, label) {
    return '<a href="' + esc(href) + '" style="display:inline-block;background:' + acc + ';color:' + deep
      + ';font-family:' + sans + ';font-weight:bold;font-size:14px;padding:12px 24px;text-decoration:none;">' + esc(label) + '</a>';
  }
  var p = '<p style="margin:0 0 20px;">';
  var content = p + 'Dear ' + esc(name) + ',</p>';
  if (call) {
    content += p + 'thank you for signing up for our info call. Here are the details:</p>'
      + '<p style="margin:0 0 24px;padding:16px 20px;background:' + paper + ';border-left:3px solid ' + acc + ';">'
      + '<strong style="color:' + heading + ';">When</strong><br>' + esc(callWhen_(call)) + '<br><br>'
      + '<strong style="color:' + heading + ';">Where</strong><br>Google Meet &middot; '
      + '<a href="' + CALLS_MEET_URL + '" style="color:' + heading + ';">' + CALLS_MEET_URL.replace('https://', '') + '</a></p>'
      + '<p style="margin:0 0 12px;">' + button(CALLS_MEET_URL, 'Join on Google Meet') + '</p>'
      + p + '<a href="' + esc(callGoogleCalendarUrl_(call)) + '" style="color:' + heading + ';">Add it to your Google Calendar</a></p>'
      + p + 'No preparation is needed: come with your questions. You can join from a browser, no account or app required.</p>';
  } else {
    content += p + 'thank you for your interest in our monthly info call. No date is set right now: '
      + 'we will write to you as soon as the next one is in the calendar.</p>';
  }
  return '<div style="background:' + paper + ';padding:32px 16px;">'
    + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid ' + line + ';">'
    + '<tr><td style="background:' + deep + ';padding:24px 32px;text-align:center;">'
    + '<span style="color:' + acc + ';font-family:' + serif + ';font-size:13px;letter-spacing:3px;text-transform:uppercase;">' + esc(CALLS_SCHOOL_NAME) + '</span>'
    + '</td></tr>'
    + '<tr><td style="padding:32px;color:' + body + ';font-family:' + sans + ';font-size:15px;line-height:1.7;">'
    + content
    + '<p style="margin:28px 0 0;">Warm regards,<br><span style="font-family:' + serif + ';color:' + heading + ';">' + esc(CALLS_SCHOOL_NAME) + '</span></p>'
    + '</td></tr>'
    + '<tr><td style="padding:18px 32px;border-top:1px solid ' + line + ';text-align:center;">'
    + '<a href="' + CALLS_SCHOOL_URL + '" style="color:' + heading + ';font-family:' + sans + ';font-size:12px;text-decoration:none;">' + CALLS_SCHOOL_URL.replace(/^https?:\/\//, '') + '</a>'
    + '</td></tr></table></div>';
}

// Run once from the editor: grants Calendar + Gmail access, logs the feed,
// and mails you the confirmation a subscriber would get.
function testCalls() {
  var calls = upcomingCalls_();
  Logger.log(JSON.stringify(calls, null, 2));
  var me = Session.getEffectiveUser().getEmail();
  MailApp.sendEmail({ to: me, subject: '[TEST] Call signup email', body: callEmailText_('Test', calls[0] || null), htmlBody: callEmailHtml_('Test', calls[0] || null) });
  Logger.log('Test email sent to ' + me);
  Logger.log('Sign-ups would be announced to: ' + callsNotifyEmails_().join(', '));
}
