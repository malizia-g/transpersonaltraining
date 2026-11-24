/* ═══════════════════════════════════════════════════════════════════
   WEB APP — JSON API
   ═══════════════════════════════════════════════════════════════════
   Bound to the spreadsheet holding the "Seminars" and "Lectures" tabs
   (Extensions → Apps Script). Deploy as Web App to expose sheet data as JSON.
   Usage:
     GET <url>                → data from the active sheet
     GET <url>?sheet=Seminars → data from the "Seminars" sheet
     GET <url>?calls=1        → upcoming info calls (see Calls.js)
     GET <url>?timestamps=1   → when this spreadsheet last changed, as
                                { "schedule": ISO date, "lectures": ISO date }

   A row is returned whenever it carries a date, a title, a facilitator, a
   teacher or a description. The Date cell is free to hold a real date, a
   rough one like "November 2026", or nothing at all — the website renders
   the exact date, the words, or "to be defined" accordingly.

   The website (src/_data/sheetTimestamps.js) reads ?timestamps=1 at every
   build and only downloads the sheets again when the date has moved.
   Both tabs share one file, so an edit to either refreshes both.

   After changing this code: Deploy → Manage deployments → pencil →
   Version: New version → Deploy, so the /exec URL stays the same.
   The first time, run testTimestamps once from the editor to grant
   Drive access.
   ═══════════════════════════════════════════════════════════════════ */

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // ?calls=1 → upcoming info calls from the EWTT calendar (Calls.js)
  if (e && e.parameter && e.parameter.calls) return callsFeed_();

  if (e && e.parameter && e.parameter.timestamps) {
    return ContentService.createTextOutput(JSON.stringify(timestamps_(ss)))
      .setMimeType(ContentService.MimeType.JSON);
  }

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

    // Keep anything the row can be recognised by. Requiring a date used to
    // drop every lecture whose date isn't settled yet — the site never saw
    // them, so they couldn't be listed as "to be defined" either. The Date
    // cell may now hold a real date, a rough one ("November 2026"), or
    // nothing; the website decides how to show each.
    if (identifies_(rowData)) {
      jsonData.push(rowData);
    }
  }

  // Seminars only keep what is chosen (Facilitator 1-3, Location…); the
  // website still gets the fields it always had, filled from the pools.
  if (sheet.getName() === 'Seminars') {
    var venues = venueIndex_(ss);
    jsonData = jsonData.map(function (row) { return enrichSeminar_(row, venues); });
  }

  return ContentService.createTextOutput(JSON.stringify(jsonData))
    .setMimeType(ContentService.MimeType.JSON);
}

// Venues tab → { "<Location>": { place, city, region, country, address, maps, arrival } }
function venueIndex_(ss) {
  var sh = ss.getSheetByName('Venues');
  var out = {};
  if (!sh || sh.getLastRow() < 2) return out;
  var v = sh.getDataRange().getDisplayValues();
  var h = v[0].map(function (x) { return String(x).trim().toLowerCase(); });
  var col = function (name) { return h.indexOf(name); };
  for (var i = 1; i < v.length; i++) {
    var key = String(v[i][col('location')] || '').trim();
    if (!key) continue;
    var cell = function (name) { var c = col(name); return c < 0 ? '' : String(v[i][c] || '').trim(); };
    out[key] = {
      place: cell('place'), city: cell('nearest city'), region: cell('region'), country: cell('country'),
      address: cell('address'), maps: cell('google maps'), arrival: cell('arrival')
    };
  }
  return out;
}

// One seminar row in the old shape the website and emails expect:
// facilitator "A & B", location = country, venue = place, city, address,
// maps, arrival. Rows already in the old shape pass through unchanged.
function enrichSeminar_(row, venues) {
  if (!row.facilitator && ('facilitator 1' in row)) {
    row.facilitator = ['facilitator 1', 'facilitator 2', 'facilitator 3']
      .map(function (k) { return String(row[k] || '').trim(); })
      .filter(function (x) { return x; })
      .join(' & ');
  }
  var label = String(row.location || '').trim();
  var v = venues[label];
  if (v) {
    row.locationlabel = label;
    row.location = v.country;
    row.venue = v.place;
    row.city = v.city;
    row.region = v.region;
    row.address = v.address;
    row.maps = v.maps;
    row.arrival = v.arrival;
  }
  return row;
}

// A row is worth sending if it can be told apart from a blank one. Title
// alone isn't enough: one seminar is recorded with a facilitator and no
// title, and dropping it would lose a real event.
function identifies_(rowData) {
  var fields = ['date', 'title', 'facilitator', 'facilitator 1', 'teacher 1', 'description'];
  for (var i = 0; i < fields.length; i++) {
    var value = rowData[fields[i]];
    if (value && value.toString().trim()) return true;
  }
  return false;
}

// The file's own last-modified date, reported under the keys the website
// uses for the two tabs in it.
function timestamps_(ss) {
  var updated = DriveApp.getFileById(ss.getId()).getLastUpdated().toISOString();
  return { schedule: updated, lectures: updated };
}

// Run once from the editor: grants Drive access and logs what the site will see.
function testTimestamps() {
  Logger.log(JSON.stringify(timestamps_(SpreadsheetApp.getActiveSpreadsheet())));
}
