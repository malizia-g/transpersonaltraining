# Transpersonal Training — Google Apps Script

Google Apps Script code for the Transpersonal Training spreadsheet automation.

## Files

| File | Description |
|------|-------------|
| `menu.js` | Custom spreadsheet menu entries |
| `json-api.js` | JSON API endpoint (serves data to the website) |
| `email-tools.js` | Brevo email integration |
| `curriculum-pdf-apps-script.js` | PDF generation from curriculum data |

## Documentation

- [BREVO_EMAIL_PLAN.md](BREVO_EMAIL_PLAN.md) — Email integration plan & architecture

## Setup

### Prerequisites

- [clasp](https://github.com/google/clasp) — Google's CLI for Apps Script
- Google Apps Script API enabled at [script.google.com/home/usersettings](https://script.google.com/home/usersettings)

### First-time Setup

```bash
npm install -g @google/clasp
clasp login
# Replace YOUR_SCRIPT_ID in .clasp.json with the actual Script ID
clasp push
```

### Deploy Changes

```bash
clasp push
```

## Branch Info

This is an **orphan branch** — it has no shared history with `main` or `staging`. It contains only Google Apps Script files for the spreadsheet automation.
