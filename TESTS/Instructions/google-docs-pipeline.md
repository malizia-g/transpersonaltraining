# Pipeline Google Docs → GitHub → Eleventy

## Obiettivo
Gestire i contenuti del sito (biografie docenti, corsi, pagine) come Google Docs,
sincronizzandoli automaticamente nel repo come file .md tramite una pipeline GAS + GitHub Actions.

## Architettura

```
Editor modifica Google Doc / Foto su Drive
        ↓
Content Registry (Google Sheet: type, id, doc_id, image_id, enabled)
        ↓
Click "📄 Sync Content & Rebuild" nel menu dello spreadsheet
        ↓
GAS triggera GitHub Action (sync-content.yml) via workflow_dispatch
        ↓
Action chiama endpoint GAS → riceve JSON (HTML docs + immagini base64)
        ↓
Action converte HTML→MD (pandoc) + decode immagini
        ↓
Scrive src/_data/bios/*.md + src/assets/images/teachers/*.jpg
        ↓
git commit + push su branch test-11ty
        ↓
Push triggera deploy.yml → Eleventy build → GitHub Pages
```

## Componenti

### 1. Google Sheet — Content Registry
Tabella con colonne: `type`, `id`, `doc_id`, `image_id`, `enabled`
- `type` → cartella destinazione (bio, course, ecc.)
- `id` → nome file .md (es. tina-lindhard)
- `doc_id` → ID del Google Doc
- `image_id` → ID del file foto su Google Drive
- `enabled` → TRUE/FALSE

### 2. Google Apps Script — Endpoint Web App
- Legge il Content Registry
- Esporta ogni Google Doc come HTML (`DriveApp.getFileById().getAs('text/html')`)
- Esporta ogni foto come base64 (`DriveApp.getFileById().getBlob()`)
- Restituisce JSON con tutti i contenuti
- Protetto con API key (?key=SECRET)
- Deploy: "Execute as: Me", "Who has access: Anyone"

### 3. Google Apps Script — Pulsante menu
- Aggiunge "📄 Sync Content & Rebuild" al menu 🌐 Website
- Chiama `workflow_dispatch` su `sync-content.yml` via GitHub API (PAT)

### 4. GitHub Action — sync-content.yml
- Trigger: workflow_dispatch
- Scarica JSON dall'endpoint GAS (URL e key in GitHub Secrets)
- Converte HTML→MD con pandoc
- Decodifica immagini base64 → src/assets/images/teachers/
- Committa .md e immagini su branch test-11ty
- Il push triggera automaticamente deploy.yml

### 5. GitHub Action — deploy.yml (esistente)
- Già configurato: si attiva su push a test-11ty
- Build Eleventy + deploy su branch deploy → GitHub Pages

## Immagini
- Foto in una cartella Google Drive dedicata
- Nominate come l'id del docente (tina-lindhard.jpg)
- GAS le converte in base64 nel JSON
- Action le salva in src/assets/images/teachers/
- I JSON teacher (coreTeachers.json, guestTeachers.json) vanno aggiornati:
  image: "/assets/images/teachers/{id}.jpg" (invece degli URL WordPress)

## Limiti / Note
- GAS: limite 6 MB per risposta, ~50 MB esecuzione → ridimensionare foto lato GAS
- Alternativa per foto pesanti: download diretto da Drive URL nell'Action
- Nessun OAuth necessario: GAS accede ai Docs/Drive nativamente
- Estensibile a qualsiasi tipo di contenuto aggiungendo righe al Content Registry

## Secrets GitHub necessari
- `GAS_CONTENT_URL` — URL endpoint web app
- `GAS_CONTENT_KEY` — chiave segreta per autenticare le chiamate

## Stato
- [ ] Creare Google Docs per i 12 docenti
- [ ] Creare Content Registry nello spreadsheet
- [ ] Scrivere codice GAS (endpoint + pulsante)
- [ ] Creare sync-content.yml
- [ ] Aggiornare image paths nei JSON teacher
- [ ] Test end-to-end
