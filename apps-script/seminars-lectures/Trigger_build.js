const REPO_OWNER = 'malizia-g';
const REPO_NAME = 'transpersonaltraining';
const WORKFLOW_FILE = 'deploy.yml';
const BRANCH = 'main';

function triggerGitHubRebuild() {

  const scriptProperties = PropertiesService.getScriptProperties();
  let GITHUB_TOKEN = scriptProperties.getProperty('GITHUB_TOKEN');
    
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
      SpreadsheetApp.getUi().alert('✅ Deploy  succesfully started, refresh the website in 5 minutes!');
    } else {
      SpreadsheetApp.getUi().alert(`⚠️ Error: ${statusCode}\n${response.getContentText()}`);
    }
  } catch (error) {
    SpreadsheetApp.getUi().alert(`❌ Error: ${error.message}`);
  }
}

