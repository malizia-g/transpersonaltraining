# Piano Migrazione: Schedule da Real-Time a Build-Time

**Data creazione:** 1 Febbraio 2026  
**Status:** Non implementato  
**Priorità:** Media

## Obiettivo

Trasformare la pagina events/schedule da fetching real-time client-side a generazione statica con Eleventy data files, con rebuild automatico via GitHub Actions e deploy su GitHub Pages (fase 1), poi dual deploy su GitHub Pages + hosting statico custom (fase 2).

---

## Steps di Implementazione

### 1. Setup Infrastruttura

**Azioni:**
```bash
npm install node-fetch dotenv
```

**File `.env` (root):**
```env
GOOGLE_SHEET_JSON_URL=https://script.google.com/macros/s/AKfycbwF4y-K0oYh0Fd78xVezCcaGf7Ac5SglXAv0SUzcBJgqeg_kRXaLix3gSad8LAgg6oR/exec
```

**Aggiornare `.gitignore`:**
```
.env
```

**GitHub Secrets (Settings → Secrets → Actions):**
- `GOOGLE_SHEET_JSON_URL` = stesso URL sopra
- `PERSONAL_ACCESS_TOKEN` = token con scope `repo` per trigger webhook

---

### 2. Creare Eleventy Data File con Fallback

**File:** `src/_data/scheduleEvents.js`

```javascript
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const CACHE_FILE = path.join(__dirname, 'scheduleEvents.cache.json');

module.exports = async function() {
  try {
    const response = await fetch(process.env.GOOGLE_SHEET_JSON_URL);
    if (!response.ok) throw new Error('Fetch failed');
    const events = await response.json();
    
    // Preprocessing dates
    const processedEvents = events.map(event => ({
      ...event,
      parsedDate: parseEuropeanDate(event.date),
      isFuture: isFutureEvent(event.date),
      year: extractYear(event.date)
    }));
    
    // Salva cache
    fs.writeFileSync(CACHE_FILE, JSON.stringify(processedEvents, null, 2));
    console.log('✅ Schedule events fetched and cached');
    
    return processedEvents;
  } catch (error) {
    console.warn('⚠️ Fetch failed, attempting to use cache...');
    
    if (fs.existsSync(CACHE_FILE)) {
      const cached = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
      console.log('✅ Using cached schedule events');
      return cached;
    }
    
    throw new Error('❌ No cache available and fetch failed: ' + error.message);
  }
};

function parseEuropeanDate(dateString) {
  if (!dateString) return null;
  let datePart = dateString.split('-')[0].trim();
  const parts = datePart.split('.');
  if (parts.length !== 3) return null;
  const day = parseInt(parts[0]);
  const month = parseInt(parts[1]) - 1;
  const year = parseInt(parts[2]);
  return new Date(year, month, day);
}

function isFutureEvent(dateString) {
  const eventDate = parseEuropeanDate(dateString);
  if (!eventDate) return false;
  return eventDate >= new Date();
}

function extractYear(dateString) {
  if (!dateString) return '';
  let datePart = dateString.split('-')[0].trim();
  const parts = datePart.split('.');
  return parts.length === 3 ? parts[2] : '';
}
```

**Aggiornare `.gitignore`:**
```
src/_data/scheduleEvents.cache.json
```

---

### 3. Refactor Template

**File:** `src/schedule.html`

Sostituire:
```html
<div id="appointments-list" class="appointments-grid">
  <!-- Populated by JavaScript -->
</div>
```

Con:
```html
<div id="appointments-list" class="appointments-grid">
  {% for event in scheduleEvents %}
  <div class="appointment-card" 
       data-type1="{{ event.type1 }}" 
       data-type2="{{ event.type2 }}"
       data-year="{{ event.year }}"
       data-facilitator="{{ event.facilitator }}"
       data-location="{{ event.location }}"
       data-is-future="{{ event.isFuture }}">
    
    <div class="appointment-header">
      <span class="appointment-date">{{ event.date }}</span>
      <span class="status-badge status-{{ event.status | lower | replace(' ', '-') }}">
        {{ event.status }}
      </span>
    </div>
    
    <h3 class="appointment-title">{{ event.title }}</h3>
    <p class="appointment-facilitator">{{ event.facilitator }}</p>
    
    <div class="appointment-description">
      <p>{{ event.description }}</p>
    </div>
    
    <div class="appointment-footer">
      <span class="appointment-location">📍 {{ event.location }}</span>
      <div class="appointment-types">
        {% if event.type1 %}<span class="type-badge">{{ event.type1 }}</span>{% endif %}
        {% if event.type2 %}<span class="type-badge">{{ event.type2 }}</span>{% endif %}
      </div>
    </div>
  </div>
  {% endfor %}
</div>
```

---

### 4. Adattare Filtri Client-Side

**File:** `src/scripts/pages/schedule.js`

**Rimuovere:**
- Funzione `fetchAppointments()`
- Funzione `renderAppointments()`
- Chiamata fetch in `initializeSchedule()`

**Modificare `initializeSchedule()`:**
```javascript
export async function initializeSchedule() {
  const appointmentsList = document.getElementById('appointments-list');
  const loadingState = document.getElementById('loading-state');
  const errorState = document.getElementById('error-state');

  if (!appointmentsList) return;

  try {
    // Le card sono già renderizzate server-side
    const cards = appointmentsList.querySelectorAll('.appointment-card');
    appointments = Array.from(cards).map(card => ({
      date: card.querySelector('.appointment-date').textContent,
      facilitator: card.dataset.facilitator,
      title: card.querySelector('.appointment-title').textContent,
      description: card.querySelector('.appointment-description p').textContent,
      status: card.querySelector('.status-badge').textContent.trim(),
      location: card.dataset.location,
      type1: card.dataset.type1,
      type2: card.dataset.type2,
      isFuture: card.dataset.isFuture === 'true',
      year: card.dataset.year,
      element: card
    }));

    initializeFilters();
    applyDefaultFilters();
    
    loadingState?.classList.add('hidden');
  } catch (error) {
    console.error('Error initializing schedule:', error);
    loadingState?.classList.add('hidden');
    errorState?.classList.remove('hidden');
  }
}
```

**Modificare `filterAndDisplayAppointments()`:**
```javascript
function filterAndDisplayAppointments() {
  const selectedType = document.getElementById('filter-type')?.value;
  const selectedYear = document.getElementById('filter-year')?.value;
  const selectedFacilitator = document.getElementById('filter-facilitator')?.value;
  const selectedLocation = document.getElementById('filter-location')?.value;

  let filtered = appointments.filter(apt => {
    const typeMatch = !selectedType || selectedType === 'all' || 
                     apt.type1 === selectedType || apt.type2 === selectedType;
    
    const yearMatch = !selectedYear || selectedYear === 'all' ||
                     (selectedYear === 'future' && apt.isFuture) ||
                     apt.year === selectedYear;
    
    const facilitatorMatch = !selectedFacilitator || selectedFacilitator === 'all' || 
                            apt.facilitator === selectedFacilitator;
    
    const locationMatch = !selectedLocation || selectedLocation === 'all' || 
                         apt.location === selectedLocation;

    return typeMatch && yearMatch && facilitatorMatch && locationMatch;
  });

  // Sort
  filtered.sort((a, b) => {
    const dateA = parseEuropeanDate(a.date);
    const dateB = parseEuropeanDate(b.date);
    const now = new Date();
    
    const aIsFuture = dateA >= now;
    const bIsFuture = dateB >= now;
    
    if (aIsFuture && bIsFuture) return dateA - dateB;
    if (!aIsFuture && !bIsFuture) return dateB - dateA;
    return aIsFuture ? -1 : 1;
  });

  // Toggle visibility
  appointments.forEach(apt => {
    apt.element.style.display = 'none';
  });
  
  filtered.forEach(apt => {
    apt.element.style.display = 'block';
  });

  updateFilterCount(filtered.length);
  updateEmptyState(filtered.length === 0);
}
```

---

### 5. GitHub Actions Workflow

**File:** `.github/workflows/deploy.yml`

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]
  schedule:
    - cron: '0 6 * * *'  # Giornaliero alle 6:00 UTC
  workflow_dispatch:
  repository_dispatch:
    types: [rebuild-schedule]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        env:
          GOOGLE_SHEET_JSON_URL: ${{ secrets.GOOGLE_SHEET_JSON_URL }}
        run: npm run build
      
      - name: Commit cache if updated
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add src/_data/scheduleEvents.cache.json || true
          git diff --staged --quiet || git commit -m "Update schedule cache [skip ci]" || true
          git push || true
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./_site
      
      - name: Notify on failure
        if: failure()
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: '🚨 Build Failed',
              body: 'The scheduled build has failed. Check logs: ' + context.payload.repository.html_url + '/actions/runs/' + context.runId
            })
```

**Abilitare GitHub Pages:**
1. Repository Settings → Pages
2. Source: Deploy from a branch
3. Branch: `gh-pages` / `root`
4. Save

---

### 6. Google Apps Script Bottone Rebuild

**Nel Google Apps Script dello spreadsheet:**

```javascript
// Costanti
const GITHUB_TOKEN = 'ghp_YOUR_PERSONAL_ACCESS_TOKEN'; // SOSTITUIRE!
const GITHUB_REPO = 'malizia-g/transpersonaltraining';

/**
 * Crea menu custom nella UI dello spreadsheet
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🌐 Website')
    .addItem('🔄 Rebuild Website', 'triggerGitHubRebuild')
    .addToUi();
}

/**
 * Trigger rebuild via GitHub API
 */
function triggerGitHubRebuild() {
  const ui = SpreadsheetApp.getUi();
  
  const response = ui.alert(
    'Rebuild Website',
    'Vuoi ricostruire il sito con i dati aggiornati dello schedule?',
    ui.ButtonSet.YES_NO
  );
  
  if (response !== ui.Button.YES) {
    return;
  }
  
  try {
    const url = `https://api.github.com/repos/${GITHUB_REPO}/dispatches`;
    
    const options = {
      method: 'post',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        event_type: 'rebuild-schedule'
      })
    };
    
    const result = UrlFetchApp.fetch(url, options);
    
    if (result.getResponseCode() === 204) {
      ui.alert('✅ Rebuild avviato con successo!\n\nIl sito sarà aggiornato tra 2-3 minuti.\n\nControlla: https://github.com/' + GITHUB_REPO + '/actions');
    } else {
      throw new Error('Unexpected response: ' + result.getResponseCode());
    }
    
  } catch (error) {
    ui.alert('❌ Errore durante il rebuild:\n\n' + error.toString());
    Logger.log('Error: ' + error);
  }
}
```

**Setup:**
1. Aprire Google Apps Script editor dello spreadsheet
2. Aggiungere codice sopra in `Code.gs`
3. Creare Personal Access Token su GitHub:
   - Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate new token con scope: `repo` (full control)
4. Sostituire `GITHUB_TOKEN` nel codice
5. Salvare e ricaricare lo spreadsheet
6. Apparirà menu "🌐 Website" → "🔄 Rebuild Website"

---

### 7. Testing e Cleanup

**Testing locale:**
```bash
# Test build con fetch reale
npm run build

# Verificare che scheduleEvents.cache.json sia stato creato
cat src/_data/scheduleEvents.cache.json

# Test build con cache (simulare fetch fallito)
# Rinominare temporaneamente GOOGLE_SHEET_JSON_URL in .env
npm run build  # Dovrebbe usare cache

# Test build senza cache (eliminare cache file)
rm src/_data/scheduleEvents.cache.json
# Dovrebbe fallire con errore chiaro
```

**Testing su GitHub:**
1. Push su main → verifica build automatico su Actions tab
2. Trigger manuale da Actions tab → workflow_dispatch
3. Trigger da spreadsheet → verifica bottone "🔄 Rebuild Website"
4. Verifica sito su GitHub Pages URL

**Cleanup:**
```bash
# Rimuovere file legacy
rm schedule-app.js

# Commit finali
git add .
git commit -m "Migrate schedule to build-time with Eleventy data files

- Add scheduleEvents.js data file with Google Sheets fetching
- Implement cache fallback mechanism  
- Refactor schedule.html to server-side rendering
- Adapt client-side filters to work with pre-rendered cards
- Add GitHub Actions workflow for CI/CD
- Add Google Apps Script rebuild button
- Remove legacy schedule-app.js"

git push origin test-11ty
```

**Aggiornare documentazione:**
- `TESTS/GOOGLE_APPS_SCRIPT_SETUP.md`: aggiungere sezione rebuild button
- `REFACTORING_TAG.md`: aggiornare TODO list rimuovendo questo task

---

## Fase 2: Dual Deploy (Futuro)

### 8. Aggiungere Deploy su Hosting Statico Custom

**Opzione A - FTP Deploy:**

Aggiungere a `.github/workflows/deploy.yml` dopo step GitHub Pages:

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

**Secrets da aggiungere:**
- `FTP_SERVER`
- `FTP_USERNAME`
- `FTP_PASSWORD`

**Opzione B - S3/CloudFront:**

```yaml
      - name: Deploy to S3
        uses: jakejarvis/s3-sync-action@master
        with:
          args: --delete
        env:
          AWS_S3_BUCKET: ${{ secrets.AWS_S3_BUCKET }}
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          SOURCE_DIR: '_site'
```

**Secrets da aggiungere:**
- `AWS_S3_BUCKET`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

---

## Vantaggi della Migrazione

✅ **Performance**
- Nessuna fetch request al page load (-200-500ms)
- First contentful paint più veloce
- Contenuto già nel HTML

✅ **SEO**
- Contenuto visibile ai crawler
- Indicizzazione eventi in Google
- Rich snippets possibili

✅ **Resilienza**
- Sito funziona anche se Google Sheets è down
- Cache di fallback automatica
- Snapshot statico sempre disponibile

✅ **Sicurezza**
- URL API non esposto al client
- Nessuna chiamata esterna da browser

✅ **Controllo**
- Rebuild on-demand da spreadsheet (bottone)
- Rebuild automatico giornaliero (scheduled)
- Rebuild ad ogni commit su main

---

## Checklist Implementazione

- [ ] 1. Installare node-fetch e dotenv
- [ ] 2. Creare .env con GOOGLE_SHEET_JSON_URL
- [ ] 3. Aggiornare .gitignore (.env e cache)
- [ ] 4. Configurare GitHub Secrets
- [ ] 5. Creare src/_data/scheduleEvents.js
- [ ] 6. Testare data file localmente
- [ ] 7. Refactorare src/schedule.html
- [ ] 8. Adattare src/scripts/pages/schedule.js
- [ ] 9. Testare filtri localmente
- [ ] 10. Creare .github/workflows/deploy.yml
- [ ] 11. Abilitare GitHub Pages
- [ ] 12. Testare workflow su GitHub
- [ ] 13. Creare Personal Access Token su GitHub
- [ ] 14. Aggiungere codice Google Apps Script
- [ ] 15. Testare bottone rebuild da spreadsheet
- [ ] 16. Rimuovere schedule-app.js
- [ ] 17. Aggiornare documentazione
- [ ] 18. Commit e push finale
- [ ] 19. (Fase 2) Aggiungere deploy custom hosting

---

**Ultima modifica:** 1 Febbraio 2026
