/**
 * ═══════════════════════════════════════════════════════════════════
 *  Web App — JSON API
 *  Google Apps Script — paste into your spreadsheet's script editor
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Deploy as Web App to expose sheet data as JSON.
 *  Usage:
 *    GET <url>                → data from the active sheet
 *    GET <url>?sheet=Seminars → data from the "Seminars" sheet
 *    GET <url>?sheet=Lectures → data from the "Lectures" sheet
 */

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
