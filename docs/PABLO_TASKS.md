# Pablo's Tasks — Pending Items

These are items that need your manual action. The code changes have been made — these are configuration and external service tasks.

---

## Phase 1 — SEO & Deployment Setup

---

## 1. 🌐 Custom Domain DNS Setup

**Status:** ⏳ Pending  
**Domain:** `transpersonal-training.com`

You need to configure DNS records to point `transpersonal-training.com` to your hosting provider.

### If using GitHub Pages:
1. Go to **Repository Settings → Pages**
2. Under "Custom domain", enter: `transpersonal-training.com`
3. Enable "Enforce HTTPS"
4. Add these DNS records at your domain registrar:

| Type  | Name | Value |
|-------|------|-------|
| A     | @    | 185.199.108.153 |
| A     | @    | 185.199.109.153 |
| A     | @    | 185.199.110.153 |
| A     | @    | 185.199.111.153 |
| CNAME | www  | malizia-g.github.io |

### If using FTP hosting:
1. Configure DNS to point to your hosting provider's IP
2. Upload the `_site/` folder contents to your web server's public directory
3. A `CNAME` file has been added to `src/` — remove it if not using GitHub Pages
4. You may need to set up FTP deployment (see Phase 2 below)

---

## 2. 📸 Social Sharing Image (OG Image)

**Status:** ⏳ Pending  
**File needed:** `src/assets/images/og-default.jpg`

Create a social sharing preview image (Open Graph image) that will appear when the site is shared on Facebook, LinkedIn, Twitter, etc.

**Recommended specs:**
- **Size:** 1200 × 630 pixels
- **Format:** JPG
- **Content:** Logo + tagline "Educating Therapists for a Revolution of Consciousness"
- **File path:** Save as `src/assets/images/og-default.jpg`

Until you create this, social shares will show a broken image placeholder. The meta tags in `base.njk` already reference this path.

---

## 3. 📊 Google Search Console Verification

**Status:** ⏳ Pending (when ready)

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property: `https://transpersonal-training.com`
3. Verify ownership via DNS TXT record or HTML file
4. Submit the sitemap: `https://transpersonal-training.com/sitemap.xml`

---

## 4. 📈 Google Analytics (Optional)

**Status:** ⏳ Pending (when ready)

1. Create a Google Analytics 4 property at [analytics.google.com](https://analytics.google.com)
2. Get the Measurement ID (e.g., `G-XXXXXXXXXX`)
3. Add the tracking script to `src/_includes/base.njk` before `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 5. 🔄 Deploy Workflow — Branch Configuration

**Status:** ⚠️ Review needed

The deploy workflow (`.github/workflows/deploy.yml`) currently triggers on:
- `test-11ty` branch
- `testImages` branch
- `main` branch (newly added)

**Action needed:** Once you decide on your branching strategy, remove the test branches and keep only `main`:
```yaml
on:
  push:
    branches:
      - main
```

---

## 6. 📝 Review Meta Descriptions

**Status:** ⚠️ Review recommended

SEO meta descriptions have been added to all pages. Please review them for accuracy and brand voice:

| Page | Description |
|------|-------------|
| **Home** | Professional transpersonal psychotherapy and breathwork training. EUROTAS-accredited online programme with in-person intensives in Western Europe. Join our 4-year course. |
| **Training Program** | Explore our 4-year transpersonal psychotherapy training programme. Three progressive levels covering self-development, counselling skills, and psychotherapy practice. |
| **Curriculum** | Detailed curriculum for transpersonal psychotherapy training. Topics include consciousness studies, breathwork, developmental psychology, and therapeutic practice. |
| **Intensive Schedule** | View upcoming residential training weekends and intensive seminars in Western Europe. Holotropic breathwork, transpersonal therapy intensives, and more. |
| **Lectures Schedule** | Weekly online lecture schedule for transpersonal psychotherapy training. Live sessions covering theory, practice, and experiential learning. |
| **Our Teachers** | Meet the experienced faculty of transpersonal psychologists, breathwork facilitators, and therapists guiding our training programme. |
| **Our Techniques** | Discover the therapeutic techniques used in our training: holotropic breathwork, mindfulness, somatic experiencing, Jungian analysis, and more. |
| **Transpersonal Therapy** | Learn about transpersonal therapy — an integrative approach that honours the spiritual dimension of human experience alongside psychological well-being. |
| **What is Transpersonal Psychology** | An introduction to transpersonal psychology — the branch of psychology that integrates spiritual and transcendent aspects of human experience with modern science. |
| **Become a Client Model** | Experience transpersonal therapy as a client model. Support trainee therapists while receiving supervised sessions at reduced cost. |

Edit these in the `---` front matter section of each HTML file in `src/`.

---

## Phase 2 — FTP Deploy to Custom Hosting

### 7. 🚀 Set Up FTP Deployment

**Status:** ⏳ Pending  
**Depends on:** Phase 1 DNS setup

Once Phase 1 is complete and the site builds correctly, add FTP deployment so the site is deployed to your custom hosting provider automatically on every push to `main`.

**Step 1: Add GitHub Secrets**

Go to **Repository Settings → Secrets and variables → Actions** and add:

| Secret | Value |
|--------|-------|
| `FTP_SERVER` | Your hosting provider's FTP server address (e.g., `ftp.transpersonal-training.com`) |
| `FTP_USERNAME` | Your FTP username |
| `FTP_PASSWORD` | Your FTP password |

**Step 2: Add FTP Deploy step to workflow**

Add this step to `.github/workflows/deploy.yml` after the existing deploy step:

```yaml
      - name: Deploy to Custom Hosting (FTP)
        uses: SamKirkland/FTP-Deploy-Action@4.3.0
        with:
          server: ${{ secrets.FTP_SERVER }}
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          local-dir: ./_site/
          server-dir: /public_html/
```

**Step 3: Test**
1. Trigger a manual workflow run from the **Actions** tab
2. Verify the site is accessible at `transpersonal-training.com`
3. Check that all pages, images, and styles load correctly

**Notes:**
- Adjust `server-dir` if your hosting uses a different public directory (e.g., `/htdocs/`, `/www/`)
- If your hosting supports SFTP, consider using `SamKirkland/FTP-Deploy-Action@v4.3.5` with `protocol: sftp` for encrypted transfers
- Once FTP deploy is working, you can remove the GitHub Pages deploy step and the `CNAME` file if you're not using GitHub Pages

---

## Phase 3 — Cleanup & Automation

### 8. 📊 Google Apps Script Rebuild Button

**Status:** ⏳ Pending (manual setup)  
**Depends on:** GitHub Personal Access Token

Add a "🔄 Rebuild Website" button to the Google Sheets spreadsheet so schedule changes can be pushed to the live site with one click.

**Steps:**
1. Create a GitHub **Personal Access Token** (classic):
   - Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate new token with scope: `repo` (full control)
   - Copy the token — you'll need it in step 2

2. Open the Google Apps Script editor in your schedule spreadsheet:
   - Extensions → Apps Script

3. Add this code to `Code.gs`:

```javascript
const GITHUB_TOKEN = 'ghp_YOUR_TOKEN_HERE'; // Replace with your token
const GITHUB_REPO = 'malizia-g/transpersonaltraining';

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🌐 Website')
    .addItem('🔄 Rebuild Website', 'triggerGitHubRebuild')
    .addToUi();
}

function triggerGitHubRebuild() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    'Rebuild Website',
    'Rebuild the website with the latest schedule data?',
    ui.ButtonSet.YES_NO
  );
  if (response !== ui.Button.YES) return;

  try {
    const result = UrlFetchApp.fetch(
      'https://api.github.com/repos/' + GITHUB_REPO + '/dispatches',
      {
        method: 'post',
        headers: {
          'Authorization': 'Bearer ' + GITHUB_TOKEN,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        payload: JSON.stringify({ event_type: 'rebuild-schedule' })
      }
    );
    if (result.getResponseCode() === 204) {
      ui.alert('✅ Rebuild started!\n\nThe site will be updated in 2-3 minutes.\n\nCheck: https://github.com/' + GITHUB_REPO + '/actions');
    } else {
      throw new Error('Response: ' + result.getResponseCode());
    }
  } catch (error) {
    ui.alert('❌ Error: ' + error.toString());
  }
}
```

4. Save, reload the spreadsheet → "🌐 Website" menu appears

### 9. 📁 Decide on TESTS/ Experimental Pages

**Status:** ⏳ Decision needed

The `TESTS/` directory contains experimental HTML pages. Please decide for each:

| File | Size | Decision needed |
|------|------|-----------------|
| `hero_journey.html` | 48KB | Keep as page? Integrate into site? Delete? |
| `client_model.html` | 18KB | Already migrated to `src/client-model.html`? If so, delete |
| `transpersonal_therapist.html` | 21KB | Integrate or delete? |

---

## Summary Checklist

### Phase 1 — SEO & Deployment
- [ ] Configure DNS for `transpersonal-training.com`
- [ ] Create OG image (`src/assets/images/og-default.jpg`, 1200×630px)
- [ ] Set up Google Search Console and submit sitemap
- [ ] (Optional) Add Google Analytics tracking code
- [ ] Review and update deploy workflow branch triggers
- [ ] Review meta descriptions for brand voice accuracy

### Phase 2 — FTP Deploy
- [ ] Get FTP credentials from hosting provider
- [ ] Add `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD` as GitHub Secrets
- [ ] Add FTP Deploy step to `.github/workflows/deploy.yml`
- [ ] Test FTP deployment via manual workflow trigger
- [ ] Verify site loads correctly on custom hosting

### Phase 3 — Cleanup & Automation
- [x] (Auto) Remove legacy files from root
- [x] (Auto) Remove old `schedule.js` (replaced by `schedule-ssr.js`)
- [x] (Auto) Consolidate CSS into `main.css`
- [x] (Auto) Add cache fallback to data fetchers
- [x] (Auto) Add daily rebuild cron + webhook trigger
- [x] (Auto) Consolidate documentation into `docs/` folder
- [ ] (Pablo) Set up Google Apps Script rebuild button in spreadsheet
- [ ] (Pablo) Create GitHub Personal Access Token for rebuild webhook
- [ ] (Pablo) Decide on TESTS/ experimental HTML pages: keep, migrate, or remove
