/**
 * ═══════════════════════════════════════════════════════════════════
 *  Menu
 *  Google Apps Script — paste into your spreadsheet's script editor
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Provides the "📧 Email Tools" spreadsheet menu.
 *
 *  Requires: email-tools.js (all functions referenced by menu items)
 */

/* ═══════════════════════════════════════════════════════════════════
   MENU
   ═══════════════════════════════════════════════════════════════════ */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('📧 Email Tools')
    .addItem('Send Schedule (upcoming events)', 'sendScheduleEmail')
    .addItem('Send Lectures (upcoming lectures)', 'sendLecturesEmail')
    .addSeparator()
    .addItem('Send to Level L1', 'sendToL1')
    .addItem('Send to Level L2', 'sendToL2')
    .addItem('Send to Level L3', 'sendToL3')
    .addSeparator()
    .addItem('✉️ Test Email (send to myself)', 'sendTestEmail')
    .addItem('📋 Open Contacts Tab', 'openContactsTab')
    .addToUi();
}
