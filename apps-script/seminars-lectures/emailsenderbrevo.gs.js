/**
 * ═══════════════════════════════════════════════════════════════════
 * Email Tools — Configuration & Brevo Integration (Brevo Lists Version)
 * Google Apps Script — paste into your spreadsheet's script editor
 * ═══════════════════════════════════════════════════════════════════
 *
 * Handles configuration, email composition and sending via Brevo API.
 * Requires: menu.js (menu actions, etc.)
 *
 * SETUP:
 * 1. Go to Project Settings (⚙️) → Script Properties
 * 2. Add property: BREVO_API_KEY = your Brevo API key
 * 3. Add property: SENDER_EMAIL   = verified sender email
 * 4. Add property: SENDER_NAME    = sender display name
 * 5. Add property: BREVO_LIST_ALL = ID of the master list on Brevo
 * 6. Add property: BREVO_LIST_L1  = ID of the Level 1 list on Brevo
 * 7. Add property: BREVO_LIST_L2  = ID of the Level 2 list on Brevo
 * 8. Add property: BREVO_LIST_L3  = ID of the Level 3 list on Brevo
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
    siteUrl: props.getProperty('SITE_URL') || 'https://transpersonal-training.com/',
    // PNG, non SVG: Outlook e altri client non mostrano gli SVG.
    logoUrl: 'https://transpersonal-training.com/assets/images/Graphics/logo-badge-email.png',
    heroImageUrl: props.getProperty('EMAIL_HERO_URL') || 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80&blend=1a1230&balph=45&bm=normal',
    brevoUrl: 'https://api.brevo.com/v3/smtp/email',
    scheduleSheet: props.getProperty('SCHEDULE_SHEET') || 'Seminars',
    lecturesSheet: 'Lectures',
    // IDs delle liste Brevo caricate dalle proprietà del progetto
    listAll: props.getProperty('BREVO_LIST_ALL'),
    listL1: props.getProperty('BREVO_LIST_L1'),
    listL2: props.getProperty('BREVO_LIST_L2'),
    listL3: props.getProperty('BREVO_LIST_L3')
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

  var parts = s.match(/(\d{1,2})[.\/-](\d{1,2})[.\/-](\d{4})/);
  if (parts) {
    return new Date(parseInt(parts[3], 10), parseInt(parts[2], 10) - 1, parseInt(parts[1], 10));
  }

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
  var match = s.match(/\d{1,2}[.\/-]\d{1,2}[.\/-]\d{4}\s*[\-–—]\s*(\d{1,2}[.\/-]\d{1,2}[.\/-]\d{4})/);
  if (match) return parseDate_(match[1]);
  return parseDate_(s);
}

/* ═══════════════════════════════════════════════════════════════════
   SCHEDULE & LECTURES PARSING
   ═══════════════════════════════════════════════════════════════════ */


/**
 * Recupera i testi di introduzione personalizzati direttamente dalle celle A2 e B2
 */
function getEmailIntroTexts_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Email_Text');
  var texts = { lectures: '', seminars: '', onlyText: '', onlyTextSubject: '' };
  
  if (sheet) {
    // Leggiamo direttamente le celle specifiche senza usare i cicli o i posizionamenti numerici
    texts.lectures = String(sheet.getRange("A2").getValue() || '').trim(); // Cella A2
    texts.seminars = String(sheet.getRange("B2").getValue() || '').trim(); // Cella B2
    texts.onlyText = String(sheet.getRange("C2").getValue() || '').trim(); // Cella C2
    texts.onlyTextSubject = String(sheet.getRange("D2").getValue() || '').trim(); // Cella D2 (facoltativa)
  }
  return texts;
}

/**
 * Get upcoming schedule events from the Seminars/Schedule sheet.
 */
/**
 * Get upcoming seminar events from the Seminars sheet.
 */
function getSeminarEvents_() {
  var config = getConfig_();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  // Cerca il foglio provando prima 'Seminars' e poi i vecchi nomi per sicurezza
  var sheet = getFirstExistingSheet_(ss, ['Seminars', config.scheduleSheet, 'Schedule']);
  if (!sheet) return [];

  var data = sheet.getDataRange().getValues();
  var events = [];
  var today = new Date();
  today.setHours(0, 0, 0, 0);

  for (var i = 1; i < data.length; i++) {
    var rawDate = data[i][0];
    if (rawDate === '' || rawDate === null || rawDate === undefined) continue;

    var dateStr = formatDateToString_(rawDate);
    if (!dateStr) continue;

    var endDate = parseDateRange_(rawDate);
    if (endDate && endDate >= today) {
      var rawImageUrl = String(data[i][8] || '').trim();
      var finalImageUrl = getDirectImageUrl_(rawImageUrl);

      events.push({
        date: dateStr,
        facilitator: String(data[i][1] || '').trim(),
        title: String(data[i][2] || '').trim(),
        description: String(data[i][3] || '').trim(),
        module: String(data[i][4] || '').trim(),
        location: String(data[i][5] || '').trim(),
        type1: String(data[i][6] || '').trim(),
        type2: String(data[i][7] || '').trim(),
        imageUrl: finalImageUrl 
      });
    }
  }
  return events;
}

function buildSeminarsHtml_(events) {
  var html = buildEmailHeader_('Upcoming Seminars');
  var introTexts = getEmailIntroTexts_(); // <--- Questa riga deve esserci!

  if (events.length === 0) {
    html += '<p>No upcoming seminars scheduled at this time.</p>';
  } else {
    // Controlla se la cella B2 ha testo, altrimenti usa il backup in inglese
    var intro = introTexts.seminars ? introTexts.seminars : 'Here are the upcoming seminars:';
    html += '<p class="intro" style="white-space: pre-line;">' + escapeHtml_(intro) + '</p>';
    
    for (var i = 0; i < events.length; i++) {
      var e = events[i];
      html += '<div class="event" style="margin-bottom: 30px;">';
      if (e.imageUrl) {
        html += '<img src="' + escapeHtml_(e.imageUrl) + '" style="width: 100%; height: 250px; object-fit: cover; border-radius: 8px; margin-bottom: 15px; display: block;" alt="Seminar Image" />';
      }
      html += '<h3>' + escapeHtml_(e.title) + '</h3>';
      html += '<div class="meta">📅 ' + escapeHtml_(e.date);
      if (e.location) html += '  |  📍 ' + escapeHtml_(e.location);
      if (e.facilitator) html += '  |  👤 ' + escapeHtml_(e.facilitator);
      html += '</div>';
      if (e.module) html += '<div class="meta">' + escapeHtml_(e.module) + '</div>';
      if (e.description) html += '<div class="desc">' + escapeHtml_(e.description) + '</div>';
      html += '</div>';
    }
  }

  html += buildEmailFooter_();
  return html;
}


/**
 * Get upcoming lecture events from the Lectures sheet.
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
    if (rawDate === '' || rawDate === null || rawDate === undefined) continue;

    var dateStr = formatDateToString_(rawDate);
    if (!dateStr) continue;

    var d = parseDate_(rawDate);
    if (d && d >= today) {
      
      // MODIFICATO: Legge la colonna J (indice 9) per il foglio delle lezioni
      var rawImageUrl = String(data[i][9] || '').trim();
      var finalImageUrl = getDirectImageUrl_(rawImageUrl);

      events.push({
        date: dateStr,                               
        startHour: String(data[i][1] || '').trim(),  
        finishHour: String(data[i][2] || '').trim(), 
        module: String(data[i][3] || '').trim(),     
        title: String(data[i][4] || '').trim(),      
        description: String(data[i][5] || '').trim(),
        imageUrl: finalImageUrl 
      });
    }
  }

  return events;
}

/* ═══════════════════════════════════════════════════════════════════
   HTML EMAIL TEMPLATES
   ═══════════════════════════════════════════════════════════════════ */

function buildEmailHeader_(title, heading, subtitle) {
  var config = getConfig_();
  if (heading === undefined) heading = 'Next Events';
  if (subtitle === undefined) subtitle = 'Discover upcoming modules, lectures and live sessions.';

  // Colori e font del sito (src/styles/main.css). I client di posta non leggono
  // le variabili CSS, quindi qui i colori sono scritti per esteso. I font arrivano
  // dal dominio del sito; dove il client non li carica valgono Georgia e Arial.
  var SERIF = "'Cormorant Garamond', Georgia, 'Times New Roman', serif";
  var SANS = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
  var FONTS = 'https://transpersonal-training.com/assets/fonts/';

  return '<!DOCTYPE html>' +
    '<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">' +
    '<style>' +
    "@font-face { font-family: 'Cormorant Garamond'; font-weight: 600; src: url(" + FONTS + "CormorantGaramond-600-latin.woff2) format('woff2'); }" +
    "@font-face { font-family: 'Cormorant Garamond'; font-weight: 700; src: url(" + FONTS + "CormorantGaramond-700-latin.woff2) format('woff2'); }" +
    "@font-face { font-family: Inter; font-weight: 400; src: url(" + FONTS + "Inter-400-latin.woff2) format('woff2'); }" +
    'body { margin: 0; padding: 0; font-family: ' + SANS + '; background: #f7f4ed; color: #5c574d; }' +
    '.container { max-width: 600px; margin: 0 auto; background: #fdfaf5; }' +
    '.header { color: #efedf8; padding: 56px 30px 60px; text-align: center; border-bottom: 3px solid #d4b75e; text-shadow: 0 1px 8px rgba(18,13,33,0.75); }' +
    '.header h1 { margin: 0; font-family: ' + SERIF + '; font-size: 34px; font-weight: 600; line-height: 1.15; color: #ffffff; }' +
    '.header p { margin: 9px 0 0; font-size: 14px; color: #efedf8; }' +
    '.campaign-title { margin: 14px auto 0; display: inline-block; font-size: 12px; color: #e8d391; border: 1px solid #d4b75e; border-radius: 999px; padding: 6px 12px; }' +
    '.content { padding: 30px; }' +
    '.intro { color: #5c574d; font-size: 15px; line-height: 1.6; margin: 0 0 22px; }' +
    '.section-title { font-family: ' + SERIF + '; color: #242163; font-size: 24px; font-weight: 600; margin: 24px 0 14px; }' +
    '.event { border-left: 3px solid #d4b75e; padding: 15px 20px; margin-bottom: 18px; background: #ffffff; border-radius: 0 8px 8px 0; }' +
    '.event h3 { margin: 0 0 8px 0; font-family: ' + SERIF + '; color: #242163; font-size: 22px; font-weight: 600; line-height: 1.2; }' +
    '.event .meta { color: #6a3ea8; font-size: 13px; margin-bottom: 6px; }' +
    '.event .desc { color: #5c574d; font-size: 14px; line-height: 1.55; }' +
    '.footer { background: #1a1230; padding: 22px 30px; text-align: center; font-size: 12px; color: #d9d4e8; }' +
    '.footer p { margin: 6px 0; }' +
    '.footer a { color: #e8d391; }' +
    '</style></head><body>' +
    '<div class="container">' +
    // Foto come sfondo; dove il client non la mostra resta il colore scuro, così il testo si legge.
    '<div class="header" style="background-color: #1a1230; background-image: url(\'' + escapeHtml_(config.heroImageUrl) + '\'); background-size: cover; background-position: center;">' +
    '<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 0 auto 20px;"><tr>' +
    '<td style="padding-right: 10px; vertical-align: middle;"><a href="' + escapeHtml_(config.siteUrl) + '" target="_blank" rel="noopener noreferrer"><img src="' + escapeHtml_(config.logoUrl) + '" width="44" height="44" alt="" style="display: block; border: 0;" /></a></td>' +
    '<td style="vertical-align: middle; text-align: left; font-family: ' + SERIF.replace(/'/g, '') + '; font-weight: 700; color: #efedf8; line-height: 1;">' +
    '<div style="font-size: 11px; letter-spacing: 0.1em;">EastWest</div>' +
    '<div style="font-size: 22px; letter-spacing: 0.025em; margin-top: 2px;">Transpersonal Training</div>' +
    '</td></tr></table>' +
    '<h1>' + escapeHtml_(heading) + '</h1>' +
    (subtitle ? '<p>' + escapeHtml_(subtitle) + '</p>' : '') +
    (title ? '<div class="campaign-title">' + escapeHtml_(title) + '</div>' : '') +
    '</div>' +
    '<div class="content">';
}

function buildEmailFooter_() {
  return '</div>' +
    '<div class="footer">' +
    '<p>EastWest Transpersonal Training</p>' +
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

function buildEventsHtml_(events) {
  var html = buildEmailHeader_('Upcoming Training Events');
  
  // 1. RECUPERIAMO I TESTI DAL FOGLIO "Email_Text"
  var introTexts = getEmailIntroTexts_();

  if (events.length === 0) {
    html += '<p>No upcoming events scheduled at this time.</p>';
  } else {
    // 2. SE LA CELLA B2 È COMPILATA USA IL TUO TESTO, ALTRIMENTI USA IL DEFAULT
    var intro = introTexts.seminars ? introTexts.seminars : 'Here are the upcoming training events:';
    html += '<p class="intro" style="white-space: pre-line;">' + escapeHtml_(intro) + '</p>';
    
    for (var i = 0; i < events.length; i++) {
      var e = events[i];
      html += '<div class="event" style="margin-bottom: 30px;">';
      
      // SE C'È L'IMMAGINE, LA COLOCHIAMO IN CIMA ALL'EVENTO
      if (e.imageUrl) {
        html += '<img src="' + escapeHtml_(e.imageUrl) + '" style="width: 100%; height: 250px; object-fit: cover; border-radius: 8px; margin-bottom: 15px; display: block;" alt="Event Image" />';
      }
      
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
  var introTexts = getEmailIntroTexts_();

  if (events.length === 0) {
    html += '<p>No upcoming lectures scheduled at this time.</p>';
  } else {
    // Se c'è un testo personalizzato usa quello, altrimenti usa il default inglese
    var intro = introTexts.lectures ? introTexts.lectures : 'Here are the upcoming lectures:';
    // Mantiene le andate a capo digitate nel foglio trasformandole in <br> per l'HTML
    html += '<p class="intro" style="white-space: pre-line;">' + escapeHtml_(intro) + '</p>';
    
    for (var i = 0; i < events.length; i++) {
      var e = events[i];
      html += '<div class="event" style="margin-bottom: 30px;">';
      if (e.imageUrl) {
        html += '<img src="' + escapeHtml_(e.imageUrl) + '" style="width: 100%; height: 250px; object-fit: cover; border-radius: 8px; margin-bottom: 15px; display: block;" alt="Lecture Image" />';
      }
      html += '<h3>' + escapeHtml_(e.title) + '</h3>';
      html += '<div class="meta">📅 ' + escapeHtml_(e.date);
      if (e.startHour) {
        html += ' &nbsp;|&nbsp; 🕐 ' + escapeHtml_(e.startHour) + ' – ' + escapeHtml_(e.finishHour);
      }
      html += '</div>';
      if (e.module) html += '<div class="meta">Module ' + escapeHtml_(e.module) + '</div>';
      if (e.description) html += '<div class="desc">' + escapeHtml_(e.description) + '</div>';
      html += '</div>';
    }
  }

  html += buildEmailFooter_();
  return html;
}

/* ═══════════════════════════════════════════════════════════════════
   BREVO API — SENDING
   ═══════════════════════════════════════════════════════════════════ */

function sendViaBrevo_(recipients, subject, htmlContent) {
  var config = getConfig_();

  if (!recipients || recipients.length === 0) {
    throw new Error('No recipients found in the selected Brevo List.');
  }

  // Ogni destinatario riceve un messaggio separato (messageVersions), così
  // nessuno vede gli indirizzi degli altri. Brevo accetta max 1000 versioni a chiamata.
  var BATCH_SIZE = 1000;
  var sent = 0;

  for (var i = 0; i < recipients.length; i += BATCH_SIZE) {
    var versions = recipients.slice(i, i + BATCH_SIZE).map(function(r) {
      return { to: [{ email: r.email, name: r.name || r.email }] };
    });

    var payload = {
      sender: { name: config.senderName, email: config.senderEmail },
      subject: subject,
      htmlContent: htmlContent,
      messageVersions: versions
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

    if (code < 200 || code >= 300) {
      Logger.log('❌ Brevo error: ' + code + ' — ' + body);
      throw new Error('Brevo API error (' + code + ') dopo ' + sent + ' invii riusciti su ' + recipients.length + ': ' + body);
    }
    sent += versions.length;
  }

  Logger.log('✅ Email sent successfully to ' + sent + ' recipients');
  return { sent: sent };
}

/* ═══════════════════════════════════════════════════════════════════
   BREVO API — FETCH CONTACTS FROM LISTS
   ═══════════════════════════════════════════════════════════════════ */

/**
 * Ruota dinamicamente la richiesta verso l'ID della lista Brevo corretto.
 * Sostituisce la vecchia lettura dal Foglio contatti.
 */
function getContacts_(filterLevel) {
  var config = getConfig_();
  var listId;

  if (filterLevel) {
    var propName = 'list' + filterLevel.toUpperCase(); // es: listL1, listL2, listL3
    listId = config[propName];
    if (!listId) {
      throw new Error('ID lista per il livello ' + filterLevel + ' non trovato nelle proprietà dello script (es. BREVO_LIST_' + filterLevel.toUpperCase() + ').');
    }
  } else {
    listId = config.listAll;
    if (!listId) {
      throw new Error('ID lista generale (BREVO_LIST_ALL) non trovato nelle proprietà dello script.');
    }
  }

  return getContactsFromBrevoList_(listId);
}

/**
 * Chiama l'API di Brevo per scaricare tutti i contatti attivi in una lista specifica.
 * Gestisce automaticamente la paginazione (fino a 500 per blocco).
 */
function getContactsFromBrevoList_(listId) {
  var config = getConfig_();
  var contacts = [];
  var limit = 500;
  var offset = 0;
  var hasMore = true;

  while (hasMore) {
    var url = 'https://api.brevo.com/v3/contacts/lists/' + listId + '/contacts?limit=' + limit + '&offset=' + offset;
    var options = {
      method: 'get',
      contentType: 'application/json',
      headers: {
        'api-key': config.apiKey,
        'accept': 'application/json'
      },
      muteHttpExceptions: true
    };

    var response = UrlFetchApp.fetch(url, options);
    var code = response.getResponseCode();
    var body = response.getContentText();

    if (code !== 200) {
      throw new Error('Errore Brevo API (' + code + ') nel recupero della lista ID ' + listId + ': ' + body);
    }

    var data = JSON.parse(body);
    
    if (data.contacts && data.contacts.length > 0) {
      for (var i = 0; i < data.contacts.length; i++) {
        var c = data.contacts[i];
        
        // Rispetta la privacy: salta chi è in blacklist (disiscritto)
        if (c.emailBlacklisted) continue;

        // Tenta di ricostruire il nome usando gli attributi standard di Brevo
        var name = '';
        if (c.attributes) {
          var firstName = c.attributes.FIRSTNAME || c.attributes.NOME || c.attributes.NAME || '';
          var lastName = c.attributes.LASTNAME || c.attributes.COGNOME || '';
          name = (firstName + ' ' + lastName).trim();
        }

        contacts.push({
          name: name || c.email,
          email: c.email
        });
      }

      // Avanza l'offset per la pagina successiva
      offset += limit;
      
      // Se Brevo ha restituito meno contatti del limite massimo, significa che siamo all'ultima pagina
      if (data.contacts.length < limit) {
        hasMore = false;
      }
    } else {
      hasMore = false;
    }
  }

  return contacts;
}

/** Legacy function retained for compatibility, can be ignored */
function openContactsTab() {
  SpreadsheetApp.getUi().alert('La gestione contatti ora avviene direttamente su Brevo.');
}

/* ═══════════════════════════════════════════════════════════════════
   MENU ACTIONS (Rimangono identiche nel comportamento!)
   ═══════════════════════════════════════════════════════════════════ */

function sendSeminarsEmail() {
  var ui = SpreadsheetApp.getUi();
  try {
    var contacts = getContacts_(); // Prende la lista ALL da Brevo
    var events = getSeminarEvents_();

    if (contacts.length === 0) {
      ui.alert('Nessun contatto attivo trovato nella lista Brevo.');
      return;
    }

    /*var result = ui.alert(
      'Invia Email Calendario',
      'Inviare ' + events.length + ' eventi a ' + contacts.length + ' contatti recuperati da Brevo?',
      ui.ButtonSet.YES_NO
    );

    if (result !== ui.Button.YES) return;
*/
    var html = buildEventsHtml_(events);
    sendViaBrevo_(contacts, 'Upcoming Training Events — Transpersonal Training', html);
    ui.alert('✅ Email inviata a ' + contacts.length + ' contatti da Brevo!');
  } catch (e) {
    ui.alert('❌ Errore: ' + e.message);
  }
}

function sendLecturesEmail() {
  var ui = SpreadsheetApp.getUi();
  try {
    var contacts = getContacts_(); // Prende la lista ALL da Brevo
    var events = getLectureEvents_();

    if (contacts.length === 0) {
      ui.alert('Nessun contatto attivo trovato nella lista Brevo.');
      return;
    }

    var result = ui.alert(
      'Invia Email Lezioni',
      'Inviare ' + events.length + ' lezioni a ' + contacts.length + ' contatti recuperati da Brevo?',
      ui.ButtonSet.YES_NO
    );

    if (result !== ui.Button.YES) return;

    var html = buildLecturesHtml_(events);
    sendViaBrevo_(contacts, 'Upcoming Lectures — Transpersonal Training', html);
    ui.alert('✅ Email inviata a ' + contacts.length + ' contatti da Brevo!');
  } catch (e) {
    ui.alert('❌ Errore: ' + e.message);
  }
}

/**
 * Email con il solo testo di Email_Text!C2 (oggetto facoltativo in D2),
 * senza seminari né lezioni.
 */
function buildOnlyTextEmail_() {
  var texts = getEmailIntroTexts_();
  if (!texts.onlyText) {
    throw new Error('Scrivi il testo dell\'email nella cella C2 del foglio "Email_Text".');
  }
  var subject = texts.onlyTextSubject || 'News — Transpersonal Training';
  var html = buildEmailHeader_('', subject, '') +
    '<p class="intro" style="white-space: pre-line;">' + escapeHtml_(texts.onlyText) + '</p>' +
    buildEmailFooter_();
  return { subject: subject, html: html };
}

function sendOnlyTextEmail() {
  var ui = SpreadsheetApp.getUi();
  try {
    var email = buildOnlyTextEmail_();
    var contacts = getContacts_(); // Prende la lista ALL da Brevo

    if (contacts.length === 0) {
      ui.alert('Nessun contatto attivo trovato nella lista Brevo.');
      return;
    }

    var result = ui.alert(
      'Invia solo testo',
      'Inviare "' + email.subject + '" a ' + contacts.length + ' contatti recuperati da Brevo?',
      ui.ButtonSet.YES_NO
    );

    if (result !== ui.Button.YES) return;

    sendViaBrevo_(contacts, email.subject, email.html);
    ui.alert('✅ Email inviata a ' + contacts.length + ' contatti da Brevo!');
  } catch (e) {
    ui.alert('❌ Errore: ' + e.message);
  }
}

/** Invia a chi ha cliccato la voce di menu la stessa email che riceverebbero i contatti. */
function sendToMyself_(buildEmail) {
  var ui = SpreadsheetApp.getUi();
  try {
    var myEmail = Session.getEffectiveUser().getEmail();
    if (!myEmail) throw new Error('Impossibile leggere il tuo indirizzo email.');

    var email = buildEmail();
    sendViaBrevo_([{ name: myEmail, email: myEmail }], '[TEST] ' + email.subject, email.html);
    ui.alert('✅ Email di prova inviata a ' + myEmail + '!');
  } catch (e) {
    ui.alert('❌ Errore: ' + e.message);
  }
}

function sendSeminarsToMyself() {
  sendToMyself_(function() {
    return {
      subject: 'Upcoming Training Events — Transpersonal Training',
      html: buildEventsHtml_(getSeminarEvents_())
    };
  });
}

function sendLecturesToMyself() {
  sendToMyself_(function() {
    return {
      subject: 'Upcoming Lectures — Transpersonal Training',
      html: buildLecturesHtml_(getLectureEvents_())
    };
  });
}

function sendOnlyTextToMyself() {
  sendToMyself_(buildOnlyTextEmail_);
}

function sendToLevel_(level) {
  var ui = SpreadsheetApp.getUi();
  try {
    var contacts = getContacts_(level); // Prende la lista Lx specifica da Brevo
    var scheduleEvents = getSeminarEvents_();
    var lectureEvents = getLectureEvents_();

    if (contacts.length === 0) {
      ui.alert('Nessun contatto attivo trovato su Brevo per il livello ' + level + '.');
      return;
    }

    var result = ui.alert(
      'Invia a Livello ' + level,
      'Inviare gli aggiornamenti a ' + contacts.length + ' contatti della lista Brevo ' + level + '?',
      ui.ButtonSet.YES_NO
    );

    if (result !== ui.Button.YES) return;

    var html = buildEmailHeader_('Updates for ' + level + ' Students');
    
    if (scheduleEvents.length > 0) {
      html += '<h2 class="section-title">Training Events</h2>';
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
      html += '<h2 class="section-title">Lectures</h2>';
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
    ui.alert('✅ Email inviata a ' + contacts.length + ' contatti del livello ' + level + '!');
  } catch (e) {
    ui.alert('❌ Errore: ' + e.message);
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
    var seminarEvents = getSeminarEvents_();
    var html = buildEventsHtml_(seminarEvents);
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


/**
 * Converte un oggetto Date di Google Sheets nel formato leggibile: GG/MM/AAAA
 */
function formatDateToString_(rawDate) {
  if (rawDate instanceof Date && !isNaN(rawDate.getTime())) {
    var day = ('0' + rawDate.getDate()).slice(-2);
    var month = ('0' + (rawDate.getMonth() + 1)).slice(-2);
    var year = rawDate.getFullYear();
    var hours = ('0' + rawDate.getHours()).slice(-2);
    var minutes = ('0' + rawDate.getMinutes()).slice(-2);
    
    return day + '/' + month + '/' + year;
  }
  return String(rawDate || '').trim();
}

/**
 * Converte un link standard di Google Drive in un link diretto all'immagine
 */
function getDirectImageUrl_(url) {
  if (!url) return '';
  var match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return 'https://lh3.googleusercontent.com/d/' + match[1];
  }
  return url.trim(); 
}


