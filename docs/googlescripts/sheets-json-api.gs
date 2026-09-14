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

    // Only add rows that have at least a date
    if (rowData.date) {
      jsonData.push(rowData);
    }
  }

  return ContentService.createTextOutput(JSON.stringify(jsonData))
    .setMimeType(ContentService.MimeType.JSON);
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
