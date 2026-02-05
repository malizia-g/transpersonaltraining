# Google Apps Script Setup for JSON Export

## Overview
This guide shows how to set up a Google Apps Script to export your spreadsheet data as JSON, which is more reliable and precise than CSV.

## Step-by-Step Instructions

### 1. Open Your Google Spreadsheet
- Go to your spreadsheet: https://docs.google.com/spreadsheets/d/1gh7_HExBvqNNVG8q6LMyQ-qBX-IGapSS5Ighbm_GTDk

### 2. Open Apps Script Editor
- Click on **Extensions** → **Apps Script**
- This will open a new tab with the script editor

### 3. Copy and Paste the Script

Delete any existing code and paste this script:

```javascript
function doGet(e) {
  // Open the active spreadsheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Get all data from the sheet
  var data = sheet.getDataRange().getValues();
  
  // Get headers (first row) - these will be used as JSON keys
  var headers = data[0];
  
  // Convert to JSON array
  var jsonData = [];
  
  // Start from row 2 (index 1) to skip headers
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
      // Skip empty headers
      if (key) {
        rowData[key] = row[j] ? row[j].toString() : '';
      }
    }
    
    // Only add rows that have at least a date
    if (rowData.date) {
      jsonData.push(rowData);
    }
  }
  
  // Return as JSON
  return ContentService.createTextOutput(JSON.stringify(jsonData))
    .setMimeType(ContentService.MimeType.JSON);
}
```

### 4. Save the Script
- Click the **disk icon** or press `Ctrl+S` (Windows) or `Cmd+S` (Mac)
- Give your project a name (e.g., "Schedule JSON Exporter")
- Click **OK**

### 5. Deploy as Web App
1. Click **Deploy** → **New deployment**
2. Click the **gear icon** next to "Select type"
3. Choose **Web app**
4. Configure the deployment:
   - **Description**: "Schedule JSON API" (or any name)
   - **Execute as**: Me (your email)
   - **Who has access**: **Anyone** (important!)
5. Click **Deploy**
6. **Authorize** the script when prompted:
   - Click **Authorize access**
   - Choose your Google account
   - Click **Advanced** → **Go to [Project Name] (unsafe)**
   - Click **Allow**
7. **Copy the Web app URL** - it will look like:
   ```
   https://script.google.com/macros/s/AKfycby.../exec
   ```

### 6. Update the schedule.html File

Open [schedule.html](schedule.html) and update these lines:

```javascript
// Replace YOUR_DEPLOYMENT_ID with your actual URL
const SHEET_JSON_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';

// Set to true to use JSON instead of CSV
const USE_JSON = true;
```

### 7. Test the Setup

1. Open the Web app URL in your browser
2. You should see JSON data like this:
   ```json
   [
     {
       "date": "2026-02-15",
       "time": "10:00 AM - 12:00 PM",
       "title": "Introduction to Breathwork",
       "description": "A comprehensive workshop...",
       "status": "Confirmed",
       "location": "Berlin, Germany",
       "type": "Workshop"
     }
   ]
   ```

### 8. Reload Your Schedule Page
- Visit http://localhost:8080/schedule.html
- The appointments should now load from JSON!

## Spreadsheet Structure

The script **automatically reads column headers** from row 1 and uses them as JSON keys (converted to lowercase).

**Example:**

| Date | Facilitator | Title | Description | Status | Location | Type1 | Type2 |
|------|-------------|-------|-------------|--------|----------|-------|-------|
| 29.02.2024 | Kati | Workshop | Description text | Confirmed | Berlin | Workshop | Seminar |

Will produce:

```json
{
  "date": "29.02.2024",
  "facilitator": "Kati",
  "title": "Workshop",
  "description": "Description text",
  "status": "Confirmed",
  "location": "Berlin",
  "type1": "Workshop",
  "type2": "Seminar"
}
```

### Current Expected Headers

For the schedule page to work correctly, make sure your first row contains these headers (case-insensitive, but should match):

| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| **Date** | **Facilitator** | **Title** | **Description** | **Status** | **Location** | **Type1** | **Type2** |

**Note:** The script converts header names to lowercase, so "Date" becomes "date", "Facilitator" becomes "facilitator", "Type1" becomes "type1", "Type2" becomes "type2", etc.

**Type Fields:** The page now supports two type fields (Type1 and Type2) to categorize events with multiple types. Both types will be displayed separated by a comma, and the Type filter will show events that have the selected type in either field.

### Adding New Columns

You can add new columns at any time:
1. Add a new column header in row 1
2. The data will automatically appear in the JSON output
3. Update your schedule.html to use the new field if needed

No need to modify the script!

### Handling Missing Data

**No special configuration needed!** The script automatically handles:
- ✅ Empty cells → converted to empty strings `""`
- ✅ Missing columns → converted to empty strings `""`
- ✅ Completely empty rows → skipped automatically
- ✅ Rows without a date → skipped (date is required)

Just leave cells blank if you don't have data for them. Examples:
Facilitator | Title | Description | Status | Location | Type1 | Type2 |
|------|-------------|-------|-------------|--------|----------|-------|-------|
| 2026-02-15 | John | Workshop 1 | Full description | Confirmed | Berlin | Workshop | Online |
| 2026-02-20 | | Event without facilitator | | Pending | | Seminar | |
| 2026-03-01 | Sarah | Brief event | | | Online | | | Seminar |
| 2026-03-01 | 14:00 | Brief event | | | Online | |

## Benefits of JSON over CSV

- ✅ **No parsing issues** with commas in descriptions
- ✅ **Handles missing data** gracefully
- ✅ **More reliable** - field mapping by name, not position
- ✅ **Faster** - already structured data
- ✅ **Type safe** - better handling of different data types
- ✅ **Debugging** - easier to test by opening the URL directly

## Updating Data

After you update your spreadsheet:
- The changes are **automatically available** through the web app
- Just **refresh** the schedule page to see updates
- No need to redeploy the script

## Troubleshooting

### "Authorization required" error
- Make sure you set "Who has access" to **Anyone** in step 5

### "Script not found" error
- Check that you copied the complete URL including `/exec` at the end

### No data showing
- Open the web app URL in your browser to check if JSON is being generated
- Verify your spreadsheet has the correct column structure
- Check browser console for errors (F12)

### Old data showing
- Clear your browser cache
- Add `?nocache=` + current timestamp to the URL in testing

## Security Note

The web app is publicly accessible, but it only **reads** data from your spreadsheet. Nobody can modify your data through the web app. If you need more security, you can:
- Use "Anyone with the link" and keep the URL private
- Add authentication logic to the script
- Use Google Sheets API with API keys instead
