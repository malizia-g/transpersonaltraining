# Google Apps Script - Pulsante Rebuild Website

## Panoramica
Questo script aggiunge un pulsante nel menu di Google Sheets per triggerare automaticamente la ricostruzione del sito web quando vengono aggiornati gli eventi nello schedule.

## Prerequisiti

### 1. Creare un Personal Access Token su GitHub

1. Vai su GitHub → **Settings** (profilo utente)
2. Scorri in basso a sinistra → **Developer settings**
3. Click su **Personal access tokens** → **Tokens (classic)**
4. Click **Generate new token (classic)**
5. Compila i campi:
   - **Note**: `Transpersonal Training - Schedule Rebuild`
   - **Expiration**: `No expiration` (o scegli una durata)
   - **Scopes**: Seleziona **`repo`** (Full control of private repositories)
6. Click **Generate token**
7. **⚠️ IMPORTANTE**: Copia il token subito! Non potrai vederlo di nuovo
   - Il token inizierà con `ghp_...`

### 2. Installare lo Script nel Google Sheet

1. Apri il tuo Google Spreadsheet: https://docs.google.com/spreadsheets/d/1gh7_HExBvqNNVG8q6LMyQ-qBX-IGapSS5Ighbm_GTDk
2. Click su **Extensions** → **Apps Script**
3. Se hai già il file `Code.gs`, aggiungi questo codice. Altrimenti, sostituisci tutto il contenuto:

```javascript
// ==========================================
// CONFIGURAZIONE - MODIFICA QUESTI VALORI
// ==========================================

const GITHUB_TOKEN = 'ghp_YOUR_PERSONAL_ACCESS_TOKEN_HERE'; // ⚠️ SOSTITUIRE CON IL TUO TOKEN!
const GITHUB_REPO = 'malizia-g/transpersonaltraining';

// ==========================================
// CODICE - NON MODIFICARE SOTTO QUESTA LINEA
// ==========================================

/**
 * Crea menu custom nella UI dello spreadsheet
 * Questo viene eseguito automaticamente quando apri lo spreadsheet
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🌐 Website')
    .addItem('🔄 Rebuild Website', 'triggerGitHubRebuild')
    .addToUi();
}

/**
 * Trigger rebuild del sito via GitHub Repository Dispatch API
 * Usa l'evento 'rebuild-schedule' che attiva il workflow rebuild-schedule.yml
 */
function triggerGitHubRebuild() {
  const ui = SpreadsheetApp.getUi();
  
  // Chiedi conferma all'utente
  const response = ui.alert(
    'Rebuild Website',
    'Vuoi ricostruire il sito con i dati aggiornati dello schedule?\n\n' +
    'Il processo richiede circa 2-3 minuti.',
    ui.ButtonSet.YES_NO
  );
  
  if (response !== ui.Button.YES) {
    return;
  }
  
  try {
    // Mostra messaggio di progresso
    ui.alert(
      '⏳ Rebuild in corso...',
      'Il rebuild è stato avviato. Attendi qualche secondo per la conferma.',
      ui.ButtonSet.OK
    );
    
    // URL dell'API GitHub per repository dispatch
    const url = `https://api.github.com/repos/${GITHUB_REPO}/dispatches`;
    
    // Opzioni per la richiesta HTTP
    const options = {
      method: 'post',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        event_type: 'rebuild-schedule'  // Questo corrisponde al trigger nel workflow
      }),
      muteHttpExceptions: true  // Per gestire gli errori manualmente
    };
    
    // Esegui la richiesta
    const result = UrlFetchApp.fetch(url, options);
    const responseCode = result.getResponseCode();
    
    // 204 No Content = successo per repository dispatch
    if (responseCode === 204) {
      ui.alert(
        '✅ Rebuild avviato con successo!',
        'Il sito sarà aggiornato tra 2-3 minuti.\n\n' +
        'Puoi monitorare il progresso su:\n' +
        'https://github.com/' + GITHUB_REPO + '/actions',
        ui.ButtonSet.OK
      );
    } else {
      // Gestione errori
      const responseText = result.getContentText();
      let errorMessage = 'Response code: ' + responseCode;
      
      try {
        const errorJson = JSON.parse(responseText);
        errorMessage += '\nDetails: ' + JSON.stringify(errorJson, null, 2);
      } catch (e) {
        errorMessage += '\nDetails: ' + responseText;
      }
      
      throw new Error(errorMessage);
    }
    
  } catch (error) {
    // Mostra errore all'utente
    ui.alert(
      '❌ Errore durante il rebuild',
      'Si è verificato un errore:\n\n' + error.toString() + '\n\n' +
      'Verifica:\n' +
      '1. Il token GitHub sia corretto e non scaduto\n' +
      '2. Il token abbia i permessi "repo"\n' +
      '3. Il nome del repository sia corretto',
      ui.ButtonSet.OK
    );
    
    // Log per debugging
    Logger.log('Error details: ' + error.toString());
  }
}

/**
 * Funzione di test per verificare la configurazione
 * Eseguila dal menu "Run" per verificare che tutto funzioni
 */
function testConfiguration() {
  const ui = SpreadsheetApp.getUi();
  
  // Verifica che il token sia stato configurato
  if (GITHUB_TOKEN === 'ghp_YOUR_PERSONAL_ACCESS_TOKEN_HERE') {
    ui.alert(
      '⚠️ Configurazione incompleta',
      'Devi sostituire GITHUB_TOKEN con il tuo token personale di GitHub!',
      ui.ButtonSet.OK
    );
    return;
  }
  
  // Test connessione GitHub API
  try {
    const url = `https://api.github.com/repos/${GITHUB_REPO}`;
    const options = {
      method: 'get',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      },
      muteHttpExceptions: true
    };
    
    const result = UrlFetchApp.fetch(url, options);
    const responseCode = result.getResponseCode();
    
    if (responseCode === 200) {
      const repo = JSON.parse(result.getContentText());
      ui.alert(
        '✅ Configurazione corretta!',
        'Connessione a GitHub riuscita.\n\n' +
        'Repository: ' + repo.full_name + '\n' +
        'Branch default: ' + repo.default_branch,
        ui.ButtonSet.OK
      );
    } else {
      throw new Error('Response code: ' + responseCode + '\n' + result.getContentText());
    }
    
  } catch (error) {
    ui.alert(
      '❌ Errore di configurazione',
      'Impossibile connettersi a GitHub:\n\n' + error.toString(),
      ui.ButtonSet.OK
    );
  }
}
```

### 3. Configurare il Token

1. Nello script appena incollato, trova questa riga:
   ```javascript
   const GITHUB_TOKEN = 'ghp_YOUR_PERSONAL_ACCESS_TOKEN_HERE';
   ```

2. Sostituisci `ghp_YOUR_PERSONAL_ACCESS_TOKEN_HERE` con il token che hai copiato al passo 1

3. **Salva lo script** (Ctrl+S o Cmd+S)

### 4. Autorizzare lo Script

1. Nel menu in alto, seleziona la funzione `testConfiguration`
2. Click sul pulsante **Run** (▶️)
3. Ti verrà chiesto di autorizzare lo script:
   - Click **Review permissions**
   - Seleziona il tuo account Google
   - Click **Advanced** → **Go to [Nome Progetto] (unsafe)**
   - Click **Allow**

4. Se tutto è configurato correttamente, vedrai un messaggio di successo ✅

### 5. Testare il Rebuild

1. **Chiudi e riapri** il Google Spreadsheet
2. Dovresti vedere un nuovo menu **"🌐 Website"** nella barra dei menu
3. Click su **"🌐 Website"** → **"🔄 Rebuild Website"**
4. Conferma l'azione
5. Dopo pochi secondi riceverai conferma che il rebuild è stato avviato

### 6. Verificare il Rebuild

Vai su GitHub Actions per vedere il progresso:
https://github.com/malizia-g/transpersonaltraining/actions

Dovresti vedere un nuovo workflow **"Rebuild Schedule Page Only"** in esecuzione.

## Come Funziona

1. **Lo script invia un evento `repository_dispatch`** a GitHub
2. **Il workflow `rebuild-schedule.yml`** viene attivato dall'evento
3. **GitHub Actions:**
   - Fa checkout del branch `test-11ty`
   - Installa le dipendenze
   - Esegue il build del sito (leggendo i dati dal Google Sheet)
   - Aggiorna solo la pagina schedule sul branch `deploy`
4. **GitHub Pages** serve automaticamente il sito aggiornato

## Workflow Git Coinvolto

Il workflow che viene triggerato è [`rebuild-schedule.yml`](/.github/workflows/rebuild-schedule.yml):

```yaml
on:
  workflow_dispatch:        # Trigger manuale da GitHub UI
  repository_dispatch:       # Trigger via API (dal Google Sheet)
    types: [rebuild-schedule]
```

## Troubleshooting

### Errore 404: Not Found

**Causa**: Il workflow file non esiste o il nome dell'evento non corrisponde.

**Soluzione**: 
- Verifica che il file `.github/workflows/rebuild-schedule.yml` esista nel repository
- Verifica che contenga `repository_dispatch` con `types: [rebuild-schedule]`
- Ho già corretto questo nel commit precedente ✅

### Errore 401: Unauthorized

**Causa**: Token GitHub non valido o mancante.

**Soluzione**:
- Verifica di aver copiato correttamente il token
- Verifica che il token non sia scaduto
- Crea un nuovo token se necessario

### Errore 403: Forbidden

**Causa**: Il token non ha i permessi necessari.

**Soluzione**:
- Verifica che il token abbia lo scope `repo` abilitato
- Genera un nuovo token con i permessi corretti

### Il menu "🌐 Website" non appare

**Causa**: Lo script non è stato salvato o non hai ricaricato lo spreadsheet.

**Soluzione**:
- Salva lo script in Apps Script Editor
- Chiudi e riapri completamente il Google Spreadsheet

### Build completato ma sito non aggiornato

**Causa**: Cache del browser o ritardo nella pubblicazione GitHub Pages.

**Soluzione**:
- Aspetta 1-2 minuti per la propagazione
- Fai un hard refresh del browser (Ctrl+Shift+R o Cmd+Shift+R)
- Controlla il log del workflow su GitHub Actions per eventuali errori

## Sicurezza

⚠️ **IMPORTANTE**: 
- **NON condividere mai il tuo Personal Access Token** con nessuno
- **NON committare il token** nel repository Git
- Il token è memorizzato solo nello script di Google Apps
- Considera di impostare una data di scadenza per il token e rinnovarlo periodicamente

## Note

- Il rebuild richiede circa **2-3 minuti** per completarsi
- Puoi usare il rebuild tutte le volte che vuoi
- Il rebuild legge i dati più recenti dallo spreadsheet
- Non è necessario fare reload della pagina dello spreadsheet tra le modifiche
