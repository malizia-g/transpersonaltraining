/**
 * Triggera il workflow deploy.yml sul branch test-11ty
 * Può essere chiamato da un pulsante o menu in Google Sheets
 * 
 * SETUP: Imposta il token in: Impostazioni progetto > Proprietà script
 * - Nome proprietà: GITHUB_TOKEN
 * - Valore: il tuo GitHub Personal Access Token con scope 'workflow'
 */
function triggerDeployWorkflow() {
  const GITHUB_TOKEN = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
  
  if (!GITHUB_TOKEN) {
    SpreadsheetApp.getUi().alert('❌ Error: GITHUB_TOKEN not configured.\n\nGo to Project Settings > Script Properties and add:\nName: GITHUB_TOKEN\nValue: your GitHub token');
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
