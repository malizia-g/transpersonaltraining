# Training Schedule Setup Guide

## Overview
The schedule page loads training appointments from a Google Spreadsheet and displays them in an elegant, organized format.

## 🆕 Recommended: JSON Export (Most Reliable)

For the best accuracy and handling of missing data, use **Google Apps Script** to export as JSON.

👉 **Follow the complete guide**: [GOOGLE_APPS_SCRIPT_SETUP.md](GOOGLE_APPS_SCRIPT_SETUP.md)

### Quick Summary:
1. Add a Google Apps Script to your spreadsheet
2. Deploy it as a web app
3. Update `schedule.html` with the web app URL
4. Set `USE_JSON = true`

Benefits:
- ✅ Perfect handling of commas in text fields
- ✅ Automatic handling of missing data
- ✅ No parsing errors
- ✅ More reliable and faster

## Alternative: CSV Export (Fallback)

If you can't use the JSON method, the CSV export still works:

## Google Spreadsheet Configuration

### Spreadsheet ID
`1gh7_HExBvqNNVG8q6LMyQ-qBX-IGapSS5Ighbm_GTDk`

### Expected Column Structure
The spreadsheet should have the following columns (in order):

| Column | Field | Description | Example |
|--------|-------|-------------|---------|
| A | Date | Date of the appointment | 2026-02-15 |
| B | Facilitator | Who facilitates the event | Kati Wortelkamp, Lyudmila Scartescu |
| C | Time | Time of the appointment | 10:00 AM - 12:00 PM |
| D | Title | Name/title of the session | Introduction to Breathwork |
| E | Description | Detailed description | A comprehensive introduction to... |
| F | Status | Current status | Confirmed, Pending, Cancelled |
| G | Location | Where it takes place | Online / Berlin, Germany |
| H | Type | Type of event | Workshop, Seminar, Training, Webinar |
5. Click **Done**

### CSV Export Method

The schedule page uses Google Sheets' CSV export feature, which works without requiring an API key:

```
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/export?format=csv
```

This approach:
- ✅ No API key needed
- ✅ Simple implementation
- ✅ Works immediately
- ⚠️ Requires spreadsheet to be publicly accessible

### Alternative: Google Sheets API (Advanced)

If you need more control or private spreadsheets, you can use the Google Sheets API:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the Google Sheets API
4. Create an API Key
5. Update the `API_KEY` constant in [schedule.html](schedule.html)

## Testing

1. Make sure your spreadsheet has the correct column structure
2. Add some test appointments
3. Make the spreadsheet publicly accessible
4. Open `schedule.html` in your browser
5. The appointments should load automatically

## Styling

The schedule page matches the design system of the other pages:
- Same navigation structure
- Theme switcher integration
- Responsive design
- Elegant card-based layout
- Loading states and error handling

## Features

- 📅 Automatic date formatting
- 🎨 Status badges with color coding
- 🔄 Loading skeleton for better UX
- ⚠️ Error handling with retry option
- 📱 Fully responsive design
- 🎨 Theme switcher compatible
- 📍 Location display
- ⏰ Time display
- 🏷️ Event type badges
- 🔍 **Advanced Filtering System**:
  - Filter by event type (Workshop, Seminar, Training, etc.)
  - Filter by year
  - Filter by facilitator
  - Filter by location
  - Multiple filters can be combined
  - Clear all filters with one click
  - Shows count of filtered results

## Troubleshooting

### No appointments showing
- Check if the spreadsheet is publicly accessible
- Verify the spreadsheet ID is correct
- Check browser console for errors
- Ensure the spreadsheet has data starting from row 2 (row 1 is headers)

### Formatting issues
- Check that dates are in a standard format (YYYY-MM-DD preferred)
- Ensure no extra columns that aren't expected
- Remove any merged cells in the data area

### CORS errors
- The CSV export method should not have CORS issues
- If using the API method, ensure your domain is allowed in the API key restrictions
