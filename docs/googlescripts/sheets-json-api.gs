/* ═══════════════════════════════════════════════════════════════════
   WEB APP — JSON API
   ═══════════════════════════════════════════════════════════════════
   Bound to the spreadsheet holding the "Seminars" and "Lectures" tabs
   (Extensions → Apps Script). Deploy as Web App to expose sheet data as JSON.
   Usage:
     GET <url>                → data from the active sheet
     GET <url>?sheet=Seminars → data from the "Seminars" sheet
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

  return ContentService.createTextOutput(JSON.stringify(jsonData))
    .setMimeType(ContentService.MimeType.JSON);
}

// A row is worth sending if it can be told apart from a blank one. Title
// alone isn't enough: one seminar is recorded with a facilitator and no
// title, and dropping it would lose a real event.
function identifies_(rowData) {
  var fields = ['date', 'title', 'facilitator', 'teacher 1', 'description'];
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
