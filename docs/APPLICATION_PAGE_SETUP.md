# Forms & application page — how they work + one-time setup

Everything the site's forms collect is served by **one** Google Apps Script web
app writing into **one spreadsheet**, which ends up with just **two tabs**:

| What | Where | Lands in |
|---|---|---|
| Contact message | homepage, `#contact` | a row in the **`Contact`** tab + an email to the office |
| Application details | `/apply/`, step 1 | a row in the **`Applications`** tab |
| Signed agreement | `/apply/`, step 3 | the PDF in a **Drive folder**, and its link written into the **`Agreement`** column of that person's existing `Applications` row |
| Diploma / degree certificate (optional) | `/apply/`, step 3 | the file in the **same Drive folder** as the agreement (named with `Diploma` instead), and its link written into the **`Diploma`** column, right next to `Agreement` |

Both tabs and all their columns are created automatically the first time they're
used — you don't set up anything by hand. That only applies to a **brand-new**
`Applications` tab, though: if yours already exists, add a `Diploma` header by
hand in the column right after `Agreement` — the script writes to that position
regardless, but the header text itself is only auto-written when the tab is
first created.

**One applicant = one row.** The link between step 1 and step 3 is the **email
address**: step 1 creates the row, step 3 finds it again and drops the agreement
link into it. That's why the upload form asks only for the email, and says it
must be the same one used in step 1.

- Generating the agreement **twice** updates the same row (handy when someone
  fixes a typo) — it never adds a duplicate, and never wipes the agreement link
  or the apply date already on it.
- **Two dates, on purpose.** `Received` is when they filled the form in;
  `Apply date` is stamped automatically when their **signed agreement arrives**,
  because that's the moment it becomes a real application. So a row with an
  empty `Apply date` is someone who **started and never finished** — sort by that
  column to see who's still pending.
- If someone uploads with an email that **doesn't match any application**, the
  file is still saved and given its own row, and the notification email says
  *NO MATCHING APPLICATION* so you can reconcile it by hand. Nothing is ever lost.

## The Apply page flow

The **Apply** page (`/apply/`, source [src/apply.html](../src/apply.html) +
[src/scripts/pages/apply.js](../src/scripts/pages/apply.js)) is a 3-step flow:

1. **The applicant fills in their details** (name, DOB, address, email, track, etc.).
   Clicking "Generate my agreement" also sends those details to your `Applications` tab.
2. **They get the document**, via **Print agreement** (opens the print dialog —
   sharpest result, and "Save as PDF" is available there) or **Download PDF**
   (saves the file straight to their device). They **sign it by hand**.
3. **They upload the signed copy**, which goes to your Drive and fills the
   `Agreement` column on their row. They can optionally also attach a diploma
   or degree certificate at the same step, which goes into the same Drive
   folder and fills the `Diploma` column next to it.

The document itself is generated in the browser and **works with no setup at
all** — if the connection or the script fails, the applicant can still print,
sign and upload. **Saving anything needs the one-time setup below**, because a
static website can't write to your Drive or your Sheets on its own; it has to
hand the data to something running under your Google account.

> The agreement is still a **DRAFT**: fill every `[…]` placeholder in the Doc and
> have a lawyer review it before real use.

---

## Where the contract text lives

**The [master Google Doc](https://docs.google.com/document/d/1e3C_S2Es7M0S4oqVfct_1J9mELFJcILazjW9SkmC91U/edit) is the single source of truth.** Edit the contract there and
nowhere else — the website pulls it in at every build, so there is no second copy
to keep in sync. (There used to be, and the two had already silently drifted
apart, which is exactly why it works this way now.)

| File | What it is |
|---|---|
| **The Google Doc** | **The master. Edit here.** |
| `src/_data/agreement.js` | Fetches the Doc at build time |
| `src/_data/agreement.cache.json` | The last successful fetch. Automatic, not in git |
| `src/_data/agreement-fallback.html` | Emergency copy, used only if the Doc *and* the cache are both unavailable (e.g. a fresh clone with no network). Don't hand-edit it — refresh it from the Doc if the text changes a lot |
| `docs/ENROLMENT_AGREEMENT.html` | **Superseded.** The old master, kept only for reference. Editing it changes nothing |

### Placeholders

The Doc must contain these, exactly as written, where each answer should appear.
Anything the applicant left blank prints as a dash, never as an empty gap:

| Placeholder | Filled with |
|---|---|
| `{{fullName}}` | Full legal name |
| `{{dob}}` | Date of birth |
| `{{nationality}}` | Nationality |
| `{{countryResidence}}` | Country of residence |
| `{{address}}` | Full postal address |
| `{{email}}` | Email |
| `{{phone}}` | Telephone / WhatsApp |
| `{{track}}` | Western / Eastern |
| `{{joining}}` | Subscription intent |
| `{{today}}` | The date the agreement is generated |

Put `{{fullName}}` in the signature block too, if you want the name pre-printed there.

### What gets left out

The section headed **"⚠ Notes for the school"** is stripped automatically: the
script drops everything from that heading down to the next big heading, so your
internal notes never reach an applicant. If you rename that heading, update
`SKIP_SECTION_FROM` in the script.

> ⚠️ **The contract goes live without review.** An edit to the Doc reaches the
> real website at the next rebuild — no pull request, no second pair of eyes.
> That's deliberate (you chose it), but it means the Doc's sharing settings *are*
> your access control: keep edit rights to the people allowed to change a
> contract, and use the Doc's own version history to see what changed.

---

## One-time setup

### 1. Create the spreadsheet
- Go to <https://sheets.google.com> → **Blank spreadsheet**.
- Name it something like **Website forms**. That's it — leave it empty, the tabs
  appear on their own.

### 2. Add the script to that spreadsheet
- In the spreadsheet: **Extensions → Apps Script**. This creates a script that
  *belongs to this spreadsheet*, which is what lets it write rows without you
  configuring any ID.
- Delete the sample `myFunction` code, paste in everything from
  [docs/apps-script-forms.gs](apps-script-forms.gs), and **save**.
- Check `AGREEMENT_DOC_ID` near the top matches your master Google Doc (it's the
  long id in the Doc's URL). This is the Doc the website will publish.
- (Optional) also at the top:
  - `NOTIFY_SHEET` — the name of the tab holding the notification addresses (see
    below). `OFFICE_EMAIL_WEST` / `OFFICE_EMAIL_EAST` are the school's public
    addresses: they become the Reply-To on the confirmation sent back to the
    sender, and the fallback recipients if that tab can't be read (`''` = no
    email for that office).
  - `FOLDER_NAME` — the Drive folder signed agreements go into (auto-created).
    Or set `FOLDER_ID` to an existing folder's ID.

### Who gets notified

Add a tab to the forms spreadsheet with two headings in row 1 — **WEST TRACK**
and **EAST TRACK** — and list one email address per row under each. The script
reads it on every submission, so adding or removing someone takes effect
immediately, with no redeploy. Name the tab whatever `NOTIFY_SHEET` says —
capitalisation doesn't matter — or rename it freely: the headings are enough to
find it again.

A submission is routed to the office matching the applicant's track; if the
track isn't known yet (a general enquiry with no office chosen, or a
signed-agreement upload with no matching application row), it goes to **both**
columns. Gaps in a column are fine, and anything that isn't an email address is
ignored, so you can keep notes alongside the addresses.

Two emails go out for each contact message and each signed agreement: the
notification to the office, and a confirmation back to the person who wrote in,
so they have proof it arrived even after closing the page. A confirmation that
can't be sent is logged and ignored — it must never make a saved submission
look like it failed. (Applications, step 1, still send nothing: the applicant
is mid-flow and hasn't finished yet.)

> ⚠️ List the addresses people actually read — a personal or team mailbox — not
> an address that only *forwards* somewhere else. `MailApp` sends as your Google
> account, so a forwarded copy leaves the domain's mail server with a `From:`
> that no longer passes SPF, and the receiving side tends to bin it silently.
> That is exactly how notifications went missing before this tab existed.

The script reads the Doc as **you**, so the Doc can stay private — it does not
need to be shared or published to the web.

> ⚠️ **Don't** paste this into the Apps Script project that already serves the
> website's Sheets data (seminars, curriculum, …). That project has its own
> `doGet()` and the two would clash. This one gets its own project, as above.

### 3. Deploy it as a Web App
- **Deploy → New deployment → (gear icon) Web app**.
- **Execute as:** *Me* (your account) — this is what makes rows and files land in
  **your** spreadsheet and Drive.
- **Who has access:** *Anyone*.
- Click **Deploy**, then **Authorize access** and allow the Sheets/Drive/Gmail
  permissions the first time. Google will warn you the app isn't verified — it's
  your own script, so choose **Advanced → Go to (project name)**.
- Copy the **Web app URL** — it ends in `/exec`.

### 4. Connect it to the site
- Open [src/_data/forms.js](../src/_data/forms.js) and paste the URL:
  ```js
  module.exports = {
      endpoint: process.env.FORMS_ENDPOINT || 'https://script.google.com/macros/s/XXXXXXXX/exec'
  };
  ```
- Commit and let the site redeploy. Done — **both** forms are now live.

This is the **only** place the URL goes; the contact form and the upload both
read it from here.

### 5. Check it works
- Open the `/exec` URL in a browser: it should answer
  `{"status":"ok","info":"Website forms endpoint is live..."}`.
- Add `?doc=agreement` to that URL: it should answer with the contract as HTML.
  If it errors, the script can't open the Doc — check `AGREEMENT_DOC_ID`.
- Rebuild the site and watch the log: `✓ Agreement: fetched from the Google Doc`
  means it's live. A `⚠ Agreement: …` line tells you what went wrong and which
  copy it fell back to — the page still renders either way.
- Send yourself a message through the homepage form → a row should appear in the
  **`Contact`** tab within a second or two, and an email should arrive.
- Run through `/apply/` with your own email → a row appears in **`Applications`**;
  upload any PDF at step 3 → the **`Agreement`** column on that same row fills in.

Until you paste the URL, both forms show a friendly "please email us instead"
message rather than silently losing what someone wrote.

### Updating the code later
Each time you change the `.gs` code you must **Deploy → Manage deployments →
(pencil icon) → Version: New version → Deploy** for the change to take effect.
The `/exec` URL stays the same, so you never need to touch the site again.

---

## Notes / limits

- **Replying:** enquiry emails are sent with the sender's address as *Reply-To*,
  so you can just hit Reply in Gmail and it goes to them, not to yourself.
- **Spam:** each form carries a hidden "honeypot" field. People never see it;
  bots fill it in, and anything with it filled is silently discarded. If spam
  ever gets through anyway, the next step would be a captcha.
- **Unsaved work:** what someone types into either form is kept in *their own
  browser* (`localStorage`) so a crash or an accidental reload doesn't wipe it.
  It's cleared automatically once the form is successfully sent, and there's a
  "Clear saved answers" button on the Apply form. Nothing is sent anywhere until
  they press the button. See [src/scripts/modules/form-cache.js](../src/scripts/modules/form-cache.js).
- **File size:** uploads are capped at 15 MB, both in the page and in the script.
  A scanned multi-page PDF is usually well under this; larger files should be emailed.
- **Accepted types:** PDF, JPG, PNG.
- **Diploma upload:** optional, sent alongside the signed agreement in the same
  step-3 submission (not a separate step). Skipping it leaves the `Diploma`
  column blank; nothing else is affected.
- **Quotas:** Apps Script sends ~100 emails/day on a free Gmail account (1 500 on
  Workspace) — far more than these forms will ever need. Rows in Sheets are
  effectively unlimited here.
- **Formulas:** text starting with `=`, `+`, `-` or `@` is stored with a leading
  apostrophe, so a pasted formula stays harmless text in your spreadsheet.
- **Privacy — read this one.** The `Applications` tab accumulates **dates of
  birth, home addresses and phone numbers**. Keep the spreadsheet shared with the
  office only, never "anyone with the link". Two consequences worth knowing:
  details are sent when someone presses *Generate my agreement*, so you will also
  collect rows for people who **started and never finished** — treat those as
  applications in progress, and delete them if someone asks. The Apply page states
  plainly that details are sent at that point; if you change that behaviour,
  change the wording too, and keep both aligned with the site's Privacy Policy.
- **CORS:** requests are sent as "simple" requests (text/plain body) so the
  browser skips the preflight that Apps Script doesn't answer. If a browser still
  can't read the response, the page assumes success on a resolved request and the
  office notification is your backstop confirmation.
