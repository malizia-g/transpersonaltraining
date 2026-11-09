/**
 * Opens the JSON data in a new browser tab
 */
/**
 * Opens the JSON data directly in a new browser tab
 */

function openJsonInNewTab() {
  // L'URL effettivo usato dal sito per recuperare i dati
  var url = 'https://script.google.com/macros/s/AKfycbwF4y-K0oYh0Fd78xVezCcaGf7Ac5SglXAv0SUzcBJgqeg_kRXaLix3gSad8LAgg6oR/exec';
  
  var html = `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <p style="margin-bottom: 15px;">Click on link to see JSON data:</p>
      <a href="${url}" target="_blank" 
         style="color: #1a73e8; text-decoration: none; font-weight: bold; font-size: 14px;">
        Apri JSON
      </a>
      <br><br>
      <button onclick="google.script.host.close()" 
              style="margin-top: 10px; padding: 8px 16px; cursor: pointer; 
                     background-color: #f1f3f4; border: 1px solid #dadce0; 
                     border-radius: 4px; font-size: 14px;">
        Chiudi
      </button>
    </div>
  `;
  
  SpreadsheetApp.getUi().showModalDialog(
    HtmlService.createHtmlOutput(html).setWidth(400).setHeight(180),
    'Link ai Dati JSON'
  );
}


/* ═══════════════════════════════════════════════════════════════════
   MENU
   ═══════════════════════════════════════════════════════════════════ */
/**
 * Creates a custom menu in the spreadsheet
 */

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🚀 Automations')
    .addItem('🔄 Update Website (this will take 5 minutes)', 'triggerGitHubRebuild')
    .addSeparator()
    .addItem('📊 Open JSON in New Tab', 'openJsonInNewTab')
    .addSeparator()
    .addItem('✉️ Send upcoming seminars', 'sendSeminarsEmail')
    .addItem('✉️ Send upcoming lectures', 'sendLecturesEmail')
    .addItem('✉️ Send only text', 'sendOnlyTextEmail')
    .addSeparator()
    .addItem('🧪 Send upcoming seminars to myself', 'sendSeminarsToMyself')
    .addItem('🧪 Send upcoming lectures to myself', 'sendLecturesToMyself')
    .addItem('🧪 Send only text to myself', 'sendOnlyTextToMyself')
    // Invii per livello: da riattivare quando la scuola avrà più iscritti a L1, L2 e L3.
    // .addSeparator()
    // .addItem('Send to Level L1', 'sendToL1')
    // .addItem('Send to Level L2', 'sendToL2')
    // .addItem('Send to Level L3', 'sendToL3')
    .addToUi();
}