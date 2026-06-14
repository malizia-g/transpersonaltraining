# Google OAuth Login Plan (Recommended)

Objective: add secure login for students without custom passwords, using Google OAuth and the existing Contacts sheet as the authorization source.

## Why this approach

- No password storage in Google Sheets
- Better security than custom auth in Apps Script
- Free to use for this scope
- Fits the current static-site architecture (Eleventy)

## Target Flow

1. User clicks "Sign in with Google" on the lectures/schedule protected area.
2. Frontend receives Google ID token.
3. Frontend sends token (or email extracted from verified token) to a lightweight Apps Script endpoint.
4. Apps Script checks Contacts sheet:
   - email exists
   - status = Active
   - consent present
5. Endpoint returns authorization payload (allowed/denied, level).
6. Frontend unlocks protected content only for authorized users.

## Security Rules

- Do not build username/password auth in Sheets.
- Do not expose private data from Contacts in public endpoints.
- Validate token/email every session start.
- Add basic rate limiting and logging in Apps Script.
- Restrict by level when needed (L1/L2/L3).

## Technical Tasks

### A. Google Cloud / OAuth setup
- Create OAuth Client ID (Web application)
- Configure authorized JavaScript origins (production domain + local preview if needed)
- Configure consent screen (Testing mode is OK initially)

### B. Frontend integration
- Add Google Identity Services script and button
- Implement login UI state (logged out / authorized / denied)
- Persist minimal session state in browser
- Protect lectures/video links behind auth gate

### C. Apps Script authorization endpoint
- Add endpoint for auth checks using Contacts sheet
- Normalize email to lowercase + trim
- Return minimal payload: { authorized, level, name }
- Handle error responses consistently

### D. Content gating policy
- Public: marketing pages
- Protected: lectures schedule details, private video links, student-only resources
- Optional: level-based gating for L1/L2/L3

### E. QA and rollout
- Test with allowed and denied accounts
- Test inactive contacts and missing consent
- Test logout/login refresh behavior
- Deploy first in testing mode

## Minimal Deliverable (MVP)

- Google sign-in button on protected pages
- Auth check against Contacts
- Authorized users can access protected blocks
- Unauthorized users see clear access message

## Notes

- Google OAuth itself is free.
- If app verification is needed later, keep privacy/legal pages ready.
