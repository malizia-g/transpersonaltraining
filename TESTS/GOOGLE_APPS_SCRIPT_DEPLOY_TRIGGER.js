/**
 * Triggera il workflow deploy.yml sul branch test-11ty
 * Può essere chiamato da un pulsante o menu in Google Sheets
 * 
 * SETUP OBBLIGATORIO:
 * 1. Apri questo script in Apps Script
 * 2. Vai su Impostazioni progetto (icona ingranaggio)
 * 3. Scorri fino a "Proprietà script"
 * 4. Clicca "Aggiungi proprietà script"
 * 5. Inserisci: Nome = GITHUB_TOKEN, Valore = il tuo token GitHub
 * 
 * OPPURE esegui una volta la funzione setupToken() qui sotto
 */
function triggerDeployWorkflow() {
  // Recupera il token dalle Script Properties
  const scriptProperties = PropertiesService.getScriptProperties();
  let GITHUB_TOKEN = scriptProperties.getProperty('GITHUB_TOKEN');
  
  // Se non è nelle Script Properties, prova nelle User Properties
  if (!GITHUB_TOKEN) {
    GITHUB_TOKEN = PropertiesService.getUserProperties().getProperty('GITHUB_TOKEN');
  }
  
  if (!GITHUB_TOKEN) {
    SpreadsheetApp.getUi().alert('❌ Token non configurato!\n\nEsegui la funzione setupToken() oppure configura manualmente GITHUB_TOKEN nelle Proprietà script.');
    return;
  }
  
  const REPO_OWNER = 'malizia-g';
  const REPO_NAME = 'transpersonaltraining';
  const WORKFLOW_FILE = 'deploy.yml';
  const BRANCH = 'test-11ty';
  
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/actions/workflows/${WORKFLOW_FILE}/dispatches`;
  
  const options = {
    method: 'post',
    headers: {
      'Accept': 'application/vnd.github+json',
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28'
    },
    contentType: 'application/json',
    payload: JSON.stringify({
      ref: BRANCH
    }),
    muteHttpExceptions: true
  };
  
  try {
    const response = UrlFetchApp.fetch(url, options);
    const statusCode = response.getResponseCode();
    
    if (statusCode === 204) {
      SpreadsheetApp.getUi().alert('✅ Deploy started successfully!\n\nPlease check the site in 5 minutes.');
    } else {
      SpreadsheetApp.getUi().alert(`⚠️ Error: ${statusCode}\n${response.getContentText()}`);
    }
  } catch (error) {
    SpreadsheetApp.getUi().alert(`❌ Error: ${error.message}`);
  }
}

/**
 * Aggiunge un menu personalizzato al foglio
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🚀 Deploy')
    .addItem('Avvia Deploy', 'triggerDeployWorkflow')
    .addToUi();
}

/**
 * FUNZIONE DI SETUP - Esegui questa funzione UNA VOLTA per configurare il token
 * Sostituisci YOUR_TOKEN_HERE con il tuo GitHub Personal Access Token
 */
function setupToken() {
  const token = 'YOUR_TOKEN_HERE'; // <-- Sostituisci con il tuo token
  
  if (token === 'YOUR_TOKEN_HERE') {
    SpreadsheetApp.getUi().alert('⚠️ Modifica il token nella funzione setupToken() prima di eseguirla!');
    return;
  }
  
  PropertiesService.getScriptProperties().setProperty('GITHUB_TOKEN', token);
  SpreadsheetApp.getUi().alert('✅ Token configurato con successo!');
}
