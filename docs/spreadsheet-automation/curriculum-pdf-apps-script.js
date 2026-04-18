/**
 * ═══════════════════════════════════════════════════════════════════
 *  Curriculum Spreadsheet → PDF Generator
 *  Google Apps Script  —  paste into your spreadsheet's script editor
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Adds a "📄 Curriculum Tools" menu to the spreadsheet with:
 *    • Generate Curriculum PDF  (detailed, all modules + descriptions)
 *    • Generate Program PDF     (summary overview for marketing)
 *
 *  How it works:
 *    1. Parses the spreadsheet into hierarchical JSON (Levels → Sections → Modules)
 *    2. Creates a temporary Google Doc with formatted content
 *    3. Exports it as PDF
 *    4. Saves the PDF to Google Drive (same folder as spreadsheet)
 *    5. Shows a dialog with a download link
 *    6. Deletes the temporary Google Doc
 */

/* ═══════════════════════════════════════════════════════════════════
   MENU
   ═══════════════════════════════════════════════════════════════════ */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('📄 Curriculum Tools')
    .addItem('Generate Curriculum PDF (detailed)', 'generateCurriculumPDF')
    .addItem('Generate Program PDF (summary)', 'generateProgramPDF')
    .addSeparator()
    .addItem('Preview JSON data', 'previewJSON')
    .addToUi();
}

/* ═══════════════════════════════════════════════════════════════════
   COLUMN MAPPING  (must match spreadsheet header order)
   ═══════════════════════════════════════════════════════════════════ */

var COL = {
  LEVEL: 0, YEAR: 1, MODULE: 2, TOPIC: 3, DESC: 4, TEACHING: 5,
  HOURS: 6, THEORY: 7, GROUP_THERAPY: 8, BREATHWORK: 9, SEMINAR: 10,
  DELIVERY: 11, EAP_CATEGORY: 12, CORE_TEACHER: 13, GUEST_TEACHER: 14,
  COMPULSORY: 15
};

/* ═══════════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════════ */

function toNum(v) { var n = parseFloat(v); return isNaN(n) ? 0 : n; }
function toBool(v) { return String(v).trim().toUpperCase() === 'TRUE'; }
function str(v) { return v != null ? String(v).trim() : ''; }

function classifyRow(row) {
  var level = str(row[COL.LEVEL]);
  var mod   = str(row[COL.MODULE]);
  var topic = str(row[COL.TOPIC]);
  var hours = str(row[COL.HOURS]);
  if (!level && !mod && !topic && !hours) return 'skip';
  if (!level && !mod && !topic && hours)  return 'totals';
  if (/^L\d+\.\d+$/i.test(level))        return 'specialNote';
  if (mod) {
    if (/^\d+\.\d+$/.test(mod))  return 'subModule';
    if (/^\d+$/.test(mod))       return 'module';
    if (/^\d+-\d+$/.test(mod))   return 'crossActivity';
    return 'module';
  }
  if (/^L\d+$/i.test(level) && /^L\d+:/i.test(topic)) return 'levelHeader';
  var delivery = str(row[COL.DELIVERY]);
  var eap      = str(row[COL.EAP_CATEGORY]);
  if (/^L\d+$/i.test(level) && topic && (delivery || eap)) return 'standaloneItem';
  if (/^L\d+$/i.test(level) && topic) return 'sectionHeader';
  return 'skip';
}

function buildItem(row) {
  return {
    module: str(row[COL.MODULE]), topic: str(row[COL.TOPIC]),
    description: str(row[COL.DESC]), teachingStrategy: str(row[COL.TEACHING]),
    hours: toNum(row[COL.HOURS]), theory: toNum(row[COL.THEORY]),
    groupTherapy: toNum(row[COL.GROUP_THERAPY]), breathwork: toNum(row[COL.BREATHWORK]),
    seminar: toNum(row[COL.SEMINAR]), deliveryFormat: str(row[COL.DELIVERY]),
    eapCategory: str(row[COL.EAP_CATEGORY]), coreTeacher: str(row[COL.CORE_TEACHER]),
    guestTeacher: str(row[COL.GUEST_TEACHER]), compulsory: toBool(row[COL.COMPULSORY])
  };
}

function parseLevelTopic(topic) {
  var m = topic.match(/^(L\d+)\s*:\s*(.+)$/i);
  if (m) return { code: m[1].toUpperCase(), title: m[2].trim() };
  return { code: '', title: topic };
}

/* ═══════════════════════════════════════════════════════════════════
   PARSE SPREADSHEET → HIERARCHICAL JSON
   ═══════════════════════════════════════════════════════════════════ */

function parseCurriculumData() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data  = sheet.getDataRange().getValues();
  var result = { totalHours: 0, levels: [] };
  var currentLevel = null, currentSection = null, currentModule = null;

  for (var i = 1; i < data.length; i++) {
    var row  = data[i];
    var type = classifyRow(row);
    var rowLevel = str(row[COL.LEVEL]);

    // Auto-detect level change (L2/L3 have no explicit header)
    if (/^L\d+$/i.test(rowLevel) && type !== 'levelHeader' && type !== 'specialNote') {
      var normalised = rowLevel.toUpperCase();
      if (!currentLevel || currentLevel.level !== normalised) {
        currentLevel = {
          level: normalised, title: '', description: '',
          year: str(row[COL.YEAR]), sections: [], notes: []
        };
        result.levels.push(currentLevel);
        currentSection = null; currentModule = null;
      }
    }

    switch (type) {
      case 'levelHeader':
        var parsed = parseLevelTopic(str(row[COL.TOPIC]));
        currentLevel = {
          level: str(row[COL.LEVEL]).toUpperCase(), title: parsed.title,
          description: str(row[COL.DESC]), year: str(row[COL.YEAR]),
          sections: [], notes: []
        };
        result.levels.push(currentLevel);
        currentSection = null; currentModule = null;
        break;

      case 'sectionHeader':
        if (!currentLevel) break;
        currentSection = { title: str(row[COL.TOPIC]), totalHours: toNum(row[COL.HOURS]), items: [] };
        currentLevel.sections.push(currentSection);
        currentModule = null;
        break;

      case 'module':
        if (!currentLevel) break;
        var modSection = null;
        for (var ms = 0; ms < currentLevel.sections.length; ms++) {
          if (currentLevel.sections[ms].title === 'Modules') { modSection = currentLevel.sections[ms]; break; }
        }
        if (currentSection && currentSection.title !== 'Experiential / Activities') modSection = currentSection;
        if (!modSection) { modSection = { title: 'Modules', totalHours: 0, items: [] }; currentLevel.sections.push(modSection); }
        currentSection = modSection;
        var item = buildItem(row);
        item.type = 'module'; item.year = str(row[COL.YEAR]); item.subModules = [];
        currentSection.items.push(item);
        currentModule = item;
        break;

      case 'subModule':
        if (!currentModule) break;
        var sub = buildItem(row); sub.type = 'subModule';
        currentModule.subModules.push(sub);
        break;

      case 'crossActivity':
        if (!currentLevel) break;
        if (!currentSection || currentSection.title === 'Modules') {
          var found = null;
          for (var s = 0; s < currentLevel.sections.length; s++) {
            if (currentLevel.sections[s].title === 'Experiential / Activities') { found = currentLevel.sections[s]; break; }
          }
          if (!found) { found = { title: 'Experiential / Activities', totalHours: 0, items: [] }; currentLevel.sections.push(found); }
          currentSection = found;
        }
        var act = buildItem(row);
        act.type = 'activity'; act.moduleRange = str(row[COL.MODULE]); act.year = str(row[COL.YEAR]);
        currentSection.items.push(act);
        currentModule = null;
        break;

      case 'specialNote':
        if (!currentLevel) break;
        currentLevel.notes.push({
          level: str(row[COL.LEVEL]), topic: str(row[COL.TOPIC]),
          description: str(row[COL.DESC]), deliveryFormat: str(row[COL.DELIVERY]),
          eapCategory: str(row[COL.EAP_CATEGORY]), compulsory: toBool(row[COL.COMPULSORY])
        });
        break;

      case 'standaloneItem':
        if (!currentLevel) break;
        if (!currentSection) { currentSection = { title: 'Other', totalHours: 0, items: [] }; currentLevel.sections.push(currentSection); }
        var sa = buildItem(row); sa.type = 'standalone'; sa.year = str(row[COL.YEAR]);
        currentSection.items.push(sa);
        currentModule = null;
        break;

      case 'totals':
        result.totalHours = toNum(row[COL.HOURS]);
        break;
    }
  }
  return result;
}

/* ═══════════════════════════════════════════════════════════════════
   PREVIEW JSON  (menu action)
   ═══════════════════════════════════════════════════════════════════ */

function previewJSON() {
  var data = parseCurriculumData();
  var html = HtmlService.createHtmlOutput(
    '<pre style="font-size:11px;max-height:500px;overflow:auto">' +
    JSON.stringify(data, null, 2) + '</pre>'
  ).setWidth(700).setHeight(500).setTitle('Curriculum JSON');
  SpreadsheetApp.getUi().showModalDialog(html, 'Curriculum JSON Preview');
}

/* ═══════════════════════════════════════════════════════════════════
   STYLE CONSTANTS
   ═══════════════════════════════════════════════════════════════════ */

var STYLE = {
  // Colors
  PRIMARY:     '#1a365d',   // deep navy
  SECONDARY:   '#2d6a4f',   // forest green
  ACCENT:      '#d69e2e',   // gold
  LIGHT_BG:    '#f7fafc',   // light gray
  MID_BG:      '#e2e8f0',   // medium gray
  WHITE:       '#ffffff',
  TEXT_DARK:   '#1a202c',
  TEXT_MED:    '#4a5568',

  // Font sizes
  TITLE_SIZE:    24,
  SUBTITLE_SIZE: 18,
  HEADING_SIZE:  14,
  BODY_SIZE:     10,
  SMALL_SIZE:    9,
  TINY_SIZE:     8,

  // Level colors
  LEVEL_COLORS: {
    'L1': '#2d6a4f',  // green
    'L2': '#2b6cb0',  // blue
    'L3': '#744210'   // brown/gold
  }
};

/* ═══════════════════════════════════════════════════════════════════
   DOC FORMATTING HELPERS
   ═══════════════════════════════════════════════════════════════════ */

/** Set paragraph attributes */
function styleParagraph(para, opts) {
  if (opts.fontSize)    para.setFontSize(opts.fontSize);
  if (opts.bold)        para.setBold(opts.bold);
  if (opts.italic)      para.setItalic(opts.italic === true);
  if (opts.color)       para.setForegroundColor(opts.color);
  if (opts.fontFamily)  para.setFontFamily(opts.fontFamily);
  if (opts.alignment)   para.setAlignment(opts.alignment);
  if (opts.spacing !== undefined)     para.setSpacingBefore(opts.spacing);
  if (opts.spacingAfter !== undefined) para.setSpacingAfter(opts.spacingAfter);
  if (opts.lineSpacing) para.setLineSpacing(opts.lineSpacing);
  return para;
}

/** Add a styled paragraph to the body */
function addParagraph(body, text, opts) {
  var para = body.appendParagraph(text || '');
  return styleParagraph(para, opts || {});
}

/** Add a horizontal rule */
function addRule(body) {
  body.appendHorizontalRule();
}

/** Build an hours breakdown string */
function hoursBreakdown(item) {
  var parts = [];
  if (item.hours)        parts.push(item.hours + 'h total');
  if (item.theory)       parts.push(item.theory + 'h theory');
  if (item.groupTherapy) parts.push(item.groupTherapy + 'h group');
  if (item.breathwork)   parts.push(item.breathwork + 'h breathwork');
  if (item.seminar)      parts.push(item.seminar + 'h seminar');
  return parts.join(' · ');
}

/** Level label map */
var LEVEL_NAMES = {
  'L1': 'Level 1 — Self-Development & Consciousness Exploration',
  'L2': 'Level 2 — Counselling Skills & Professional Facilitation',
  'L3': 'Level 3 — Psychotherapy Skills & Advanced Practice'
};

/* ═══════════════════════════════════════════════════════════════════
   PDF EXPORT HELPER
   ═══════════════════════════════════════════════════════════════════ */

/**
 * Export a Google Doc as PDF, save to Drive, show download link,
 * and delete the temp doc.
 */
function exportDocAsPDF(doc, filename) {
  doc.saveAndClose();
  var docFile = DriveApp.getFileById(doc.getId());

  // Get the folder of the spreadsheet (to save PDF next to it)
  var ssFile  = DriveApp.getFileById(SpreadsheetApp.getActiveSpreadsheet().getId());
  var folders = ssFile.getParents();
  var folder  = folders.hasNext() ? folders.next() : DriveApp.getRootFolder();

  // Check if a PDF with same name already exists and remove it
  var existing = folder.getFilesByName(filename + '.pdf');
  while (existing.hasNext()) {
    existing.next().setTrashed(true);
  }

  // Export as PDF
  var pdfBlob = docFile.getAs('application/pdf').setName(filename + '.pdf');
  var pdfFile = folder.createFile(pdfBlob);

  // Delete the temp Google Doc
  docFile.setTrashed(true);

  // Show download dialog
  var url = pdfFile.getUrl();
  var html = HtmlService.createHtmlOutput(
    '<div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">' +
    '<h2 style="color: #1a365d;">✅ PDF Generated!</h2>' +
    '<p style="font-size: 14px; color: #4a5568;">' + filename + '.pdf</p>' +
    '<a href="' + url + '" target="_blank" ' +
    'style="display: inline-block; margin: 16px 0; padding: 12px 32px; ' +
    'background: #2d6a4f; color: #fff; text-decoration: none; border-radius: 6px; ' +
    'font-size: 16px;">📥 Open / Download PDF</a>' +
    '<p style="font-size: 11px; color: #a0aec0;">Saved in: ' + folder.getName() + '</p>' +
    '</div>'
  ).setWidth(400).setHeight(250);

  SpreadsheetApp.getUi().showModalDialog(html, 'PDF Ready');
}

/* ═══════════════════════════════════════════════════════════════════
   1. GENERATE CURRICULUM PDF  (detailed)
   ═══════════════════════════════════════════════════════════════════ */

function generateCurriculumPDF() {
  var ui = SpreadsheetApp.getUi();
  ui.alert('⏳ Generating…', 'Please wait while the Curriculum PDF is being created.', ui.ButtonSet.OK);

  var curriculum = parseCurriculumData();
  var doc  = DocumentApp.create('_temp_curriculum_' + Date.now());
  var body = doc.getBody();

  // ── Page margins ──
  body.setMarginTop(40);
  body.setMarginBottom(40);
  body.setMarginLeft(50);
  body.setMarginRight(50);

  // ── Title page ──
  addParagraph(body, '', { fontSize: STYLE.BODY_SIZE });
  addParagraph(body, '', { fontSize: STYLE.BODY_SIZE });
  addParagraph(body, 'TRANSPERSONAL TRAINING', {
    fontSize: STYLE.TITLE_SIZE, bold: true, color: STYLE.PRIMARY,
    alignment: DocumentApp.HorizontalAlignment.CENTER,
    fontFamily: 'Georgia', spacing: 100
  });
  addParagraph(body, 'CURRICULUM', {
    fontSize: STYLE.SUBTITLE_SIZE, bold: false, color: STYLE.SECONDARY,
    alignment: DocumentApp.HorizontalAlignment.CENTER,
    fontFamily: 'Georgia', spacing: 8
  });
  addRule(body);
  addParagraph(body, 'European Transpersonal Psychotherapy Training Programme', {
    fontSize: STYLE.HEADING_SIZE, italic: true, color: STYLE.TEXT_MED,
    alignment: DocumentApp.HorizontalAlignment.CENTER, spacing: 12
  });
  addParagraph(body, 'Total Programme Hours: ' + curriculum.totalHours, {
    fontSize: STYLE.HEADING_SIZE, bold: true, color: STYLE.PRIMARY,
    alignment: DocumentApp.HorizontalAlignment.CENTER, spacing: 4
  });

  // Date
  var today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'MMMM yyyy');
  addParagraph(body, today, {
    fontSize: STYLE.SMALL_SIZE, color: STYLE.TEXT_MED,
    alignment: DocumentApp.HorizontalAlignment.CENTER, spacing: 24
  });

  body.appendPageBreak();

  // ── Table of Contents (manual) ──
  addParagraph(body, 'Table of Contents', {
    fontSize: STYLE.SUBTITLE_SIZE, bold: true, color: STYLE.PRIMARY,
    fontFamily: 'Georgia', spacing: 12, spacingAfter: 12
  });
  addRule(body);

  curriculum.levels.forEach(function(lv) {
    var lvName = LEVEL_NAMES[lv.level] || (lv.level + ': ' + lv.title);
    addParagraph(body, lvName, {
      fontSize: STYLE.HEADING_SIZE, bold: true, color: STYLE.LEVEL_COLORS[lv.level] || STYLE.PRIMARY,
      spacing: 8
    });
    lv.sections.forEach(function(sec) {
      sec.items.forEach(function(it) {
        if (it.type === 'module') {
          addParagraph(body, '      Module ' + it.module + ': ' + it.topic, {
            fontSize: STYLE.BODY_SIZE, color: STYLE.TEXT_MED, spacing: 2
          });
        }
      });
    });
  });

  body.appendPageBreak();

  // ── Level details ──
  curriculum.levels.forEach(function(lv, lvIdx) {
    var lvColor = STYLE.LEVEL_COLORS[lv.level] || STYLE.PRIMARY;
    var lvName  = LEVEL_NAMES[lv.level] || (lv.level + ': ' + lv.title);

    // Level heading
    addParagraph(body, lvName.toUpperCase(), {
      fontSize: STYLE.SUBTITLE_SIZE, bold: true, color: lvColor,
      fontFamily: 'Georgia', spacing: 16, spacingAfter: 4
    });
    addRule(body);

    // Year info
    if (lv.year) {
      addParagraph(body, 'Year: ' + lv.year, {
        fontSize: STYLE.BODY_SIZE, bold: true, color: STYLE.TEXT_MED, spacing: 4
      });
    }

    // Level description / Learning Outcomes
    if (lv.description) {
      addParagraph(body, lv.description, {
        fontSize: STYLE.BODY_SIZE, color: STYLE.TEXT_DARK, spacing: 6, spacingAfter: 8,
        lineSpacing: 1.3
      });
    }

    // Sections
    lv.sections.forEach(function(sec) {
      addParagraph(body, '', { fontSize: 4 }); // spacer
      addParagraph(body, sec.title + (sec.totalHours ? '  (' + sec.totalHours + ' hours)' : ''), {
        fontSize: STYLE.HEADING_SIZE, bold: true, color: lvColor, spacing: 10, spacingAfter: 4
      });

      sec.items.forEach(function(it) {
        if (it.type === 'module') {
          // Module title
          addParagraph(body, 'Module ' + it.module + ': ' + it.topic, {
            fontSize: 12, bold: true, color: STYLE.TEXT_DARK, spacing: 10, spacingAfter: 2
          });

          // Description
          if (it.description) {
            addParagraph(body, it.description, {
              fontSize: STYLE.BODY_SIZE, color: STYLE.TEXT_DARK, spacing: 2, spacingAfter: 4,
              lineSpacing: 1.3
            });
          }

          // Meta line: hours, format, category
          var meta = [];
          var hb = hoursBreakdown(it);
          if (hb) meta.push(hb);
          if (it.deliveryFormat) meta.push('Format: ' + it.deliveryFormat);
          if (it.eapCategory)    meta.push('Category: ' + it.eapCategory);
          if (it.compulsory)     meta.push('★ Compulsory');
          if (meta.length) {
            addParagraph(body, meta.join('   |   '), {
              fontSize: STYLE.SMALL_SIZE, color: STYLE.TEXT_MED, italic: true, spacing: 2, spacingAfter: 2
            });
          }

          // Teaching strategy
          if (it.teachingStrategy) {
            addParagraph(body, 'Teaching: ' + it.teachingStrategy, {
              fontSize: STYLE.SMALL_SIZE, color: STYLE.SECONDARY, spacing: 1
            });
          }

          // Teachers
          var teachers = [];
          if (it.coreTeacher && it.coreTeacher !== '-') teachers.push('Core: ' + it.coreTeacher);
          if (it.guestTeacher && it.guestTeacher !== '-') teachers.push('Guest: ' + it.guestTeacher);
          if (teachers.length) {
            addParagraph(body, teachers.join('   |   '), {
              fontSize: STYLE.SMALL_SIZE, color: STYLE.TEXT_MED, spacing: 1
            });
          }

          // Sub-modules
          if (it.subModules && it.subModules.length) {
            addParagraph(body, 'Lesson Breakdown:', {
              fontSize: STYLE.SMALL_SIZE, bold: true, color: STYLE.TEXT_DARK, spacing: 4
            });
            it.subModules.forEach(function(sm) {
              addParagraph(body, '  ' + sm.module + '  ' + sm.topic, {
                fontSize: STYLE.SMALL_SIZE, bold: true, color: STYLE.TEXT_MED, spacing: 2
              });
              if (sm.description) {
                // Each lesson on its own line
                var lessons = sm.description.split('\n');
                lessons.forEach(function(lesson) {
                  lesson = lesson.trim();
                  if (lesson) {
                    addParagraph(body, '        ' + lesson, {
                      fontSize: STYLE.TINY_SIZE, color: STYLE.TEXT_MED, spacing: 1
                    });
                  }
                });
              }
            });
          }

        } else if (it.type === 'activity') {
          // Cross-module activity
          addParagraph(body, '◈  ' + it.topic + '  [Modules ' + (it.moduleRange || it.module) + ']', {
            fontSize: STYLE.BODY_SIZE, bold: true, color: STYLE.TEXT_DARK, spacing: 6
          });
          var actMeta = [];
          if (it.hours) actMeta.push(it.hours + ' hours');
          if (it.deliveryFormat) actMeta.push(it.deliveryFormat);
          if (it.eapCategory) actMeta.push(it.eapCategory);
          if (it.compulsory) actMeta.push('★ Compulsory');
          if (actMeta.length) {
            addParagraph(body, '      ' + actMeta.join('   |   '), {
              fontSize: STYLE.SMALL_SIZE, color: STYLE.TEXT_MED, spacing: 1
            });
          }

        } else if (it.type === 'standalone') {
          // Standalone item (exam, etc.)
          addParagraph(body, '■  ' + it.topic, {
            fontSize: STYLE.BODY_SIZE, bold: true, color: STYLE.ACCENT, spacing: 8
          });
          var saMeta = [];
          if (it.hours) saMeta.push(it.hours + ' hours');
          if (it.deliveryFormat) saMeta.push(it.deliveryFormat);
          if (saMeta.length) {
            addParagraph(body, '      ' + saMeta.join('   |   '), {
              fontSize: STYLE.SMALL_SIZE, color: STYLE.TEXT_MED, spacing: 1
            });
          }
        }
      });
    });

    // Notes
    if (lv.notes && lv.notes.length) {
      addParagraph(body, 'Notes:', {
        fontSize: STYLE.BODY_SIZE, bold: true, color: STYLE.ACCENT, spacing: 10
      });
      lv.notes.forEach(function(n) {
        addParagraph(body, '• ' + n.topic + (n.deliveryFormat ? '  [' + n.deliveryFormat + ']' : ''), {
          fontSize: STYLE.SMALL_SIZE, color: STYLE.TEXT_MED, spacing: 2
        });
      });
    }

    // Page break between levels
    if (lvIdx < curriculum.levels.length - 1) {
      body.appendPageBreak();
    }
  });

  // ── Footer ──
  addParagraph(body, '', { fontSize: 6 });
  addRule(body);
  addParagraph(body, 'Transpersonal Training — Curriculum Document — ' + today, {
    fontSize: STYLE.TINY_SIZE, color: STYLE.TEXT_MED,
    alignment: DocumentApp.HorizontalAlignment.CENTER, spacing: 4
  });

  // Export
  exportDocAsPDF(doc, 'Transpersonal_Training_Curriculum');
}

/* ═══════════════════════════════════════════════════════════════════
   2. GENERATE PROGRAM PDF  (summary – overview)
   ═══════════════════════════════════════════════════════════════════ */

function generateProgramPDF() {
  var ui = SpreadsheetApp.getUi();
  ui.alert('⏳ Generating…', 'Please wait while the Program PDF is being created.', ui.ButtonSet.OK);

  var curriculum = parseCurriculumData();
  var doc  = DocumentApp.create('_temp_program_' + Date.now());
  var body = doc.getBody();

  body.setMarginTop(40);
  body.setMarginBottom(40);
  body.setMarginLeft(50);
  body.setMarginRight(50);

  // ── Title ──
  addParagraph(body, '', { fontSize: STYLE.BODY_SIZE });
  addParagraph(body, 'TRANSPERSONAL TRAINING', {
    fontSize: STYLE.TITLE_SIZE, bold: true, color: STYLE.PRIMARY,
    alignment: DocumentApp.HorizontalAlignment.CENTER,
    fontFamily: 'Georgia', spacing: 80
  });
  addParagraph(body, 'TRAINING PROGRAMME OVERVIEW', {
    fontSize: STYLE.SUBTITLE_SIZE, bold: false, color: STYLE.SECONDARY,
    alignment: DocumentApp.HorizontalAlignment.CENTER,
    fontFamily: 'Georgia', spacing: 8
  });
  addRule(body);

  addParagraph(body, 'A 4-year European-accredited transpersonal psychotherapy training', {
    fontSize: 12, italic: true, color: STYLE.TEXT_MED,
    alignment: DocumentApp.HorizontalAlignment.CENTER, spacing: 10
  });
  addParagraph(body, 'Total Programme: ' + curriculum.totalHours + ' hours', {
    fontSize: STYLE.HEADING_SIZE, bold: true, color: STYLE.PRIMARY,
    alignment: DocumentApp.HorizontalAlignment.CENTER, spacing: 4, spacingAfter: 20
  });

  // ── Programme Summary Table ──
  // Build a table: Level | Year | Modules | Hours | Format
  var tableData = [['Level', 'Year', 'Modules', 'Key Topics', 'Delivery']];

  curriculum.levels.forEach(function(lv) {
    var modules = [];
    var topics  = [];
    var formats = {};
    var totalLvHours = 0;

    lv.sections.forEach(function(sec) {
      sec.items.forEach(function(it) {
        if (it.type === 'module') {
          modules.push(it.module);
          if (it.topic.length > 40) {
            topics.push('M' + it.module + ': ' + it.topic.substring(0, 37) + '…');
          } else {
            topics.push('M' + it.module + ': ' + it.topic);
          }
        }
        totalLvHours += it.hours;
        if (it.deliveryFormat) formats[it.deliveryFormat] = true;
      });
    });

    tableData.push([
      lv.level + (lv.title ? '\n' + lv.title : ''),
      lv.year || '',
      modules.join(', '),
      topics.join('\n'),
      Object.keys(formats).join('\n')
    ]);
  });

  var table = body.appendTable(tableData);
  // Style the table
  table.setBorderWidth(1);
  table.setBorderColor(STYLE.MID_BG);

  // Header row
  var headerRow = table.getRow(0);
  for (var c = 0; c < headerRow.getNumCells(); c++) {
    var cell = headerRow.getCell(c);
    cell.setBackgroundColor(STYLE.PRIMARY);
    cell.getChild(0).asText().setFontSize(STYLE.SMALL_SIZE).setBold(true).setForegroundColor(STYLE.WHITE);
    cell.setPaddingTop(6).setPaddingBottom(6).setPaddingLeft(6).setPaddingRight(6);
  }

  // Data rows
  for (var r = 1; r < table.getNumRows(); r++) {
    var row = table.getRow(r);
    var bg = r % 2 === 0 ? STYLE.LIGHT_BG : STYLE.WHITE;
    for (var c2 = 0; c2 < row.getNumCells(); c2++) {
      var cell2 = row.getCell(c2);
      cell2.setBackgroundColor(bg);
      cell2.getChild(0).asText().setFontSize(STYLE.TINY_SIZE).setForegroundColor(STYLE.TEXT_DARK);
      cell2.setPaddingTop(4).setPaddingBottom(4).setPaddingLeft(4).setPaddingRight(4);
    }
    // Bold the level column
    row.getCell(0).getChild(0).asText().setBold(true).setForegroundColor(
      STYLE.LEVEL_COLORS[curriculum.levels[r - 1].level] || STYLE.PRIMARY
    );
  }

  // Set column widths
  var widths = [60, 50, 60, 240, 120];
  for (var w = 0; w < widths.length; w++) {
    table.setColumnWidth(w, widths[w]);
  }

  addParagraph(body, '', { fontSize: 8 });

  // ── Per-level summaries ──
  curriculum.levels.forEach(function(lv) {
    var lvColor = STYLE.LEVEL_COLORS[lv.level] || STYLE.PRIMARY;
    var lvName  = LEVEL_NAMES[lv.level] || lv.level;

    addParagraph(body, lvName, {
      fontSize: STYLE.HEADING_SIZE, bold: true, color: lvColor,
      spacing: 12, spacingAfter: 2
    });

    if (lv.description) {
      addParagraph(body, lv.description, {
        fontSize: STYLE.BODY_SIZE, color: STYLE.TEXT_DARK,
        spacing: 2, spacingAfter: 6, lineSpacing: 1.3
      });
    }

    // Module list (concise)
    lv.sections.forEach(function(sec) {
      sec.items.forEach(function(it) {
        if (it.type === 'module') {
          var line = 'Module ' + it.module + ': ' + it.topic;
          if (it.hours) line += '  (' + it.hours + 'h)';
          addParagraph(body, '    • ' + line, {
            fontSize: STYLE.SMALL_SIZE, color: STYLE.TEXT_DARK, spacing: 1
          });
        }
      });
    });

    // Activities summary
    lv.sections.forEach(function(sec) {
      if (sec.title.indexOf('Activities') >= 0 || sec.title.indexOf('Experiential') >= 0 || sec.title.indexOf('xperiential') >= 0) {
        addParagraph(body, '    Experiential & Practical Components:', {
          fontSize: STYLE.SMALL_SIZE, bold: true, color: lvColor, spacing: 4
        });
        sec.items.forEach(function(it) {
          var aLine = it.topic;
          if (it.hours) aLine += '  (' + it.hours + 'h — ' + it.deliveryFormat + ')';
          addParagraph(body, '        ◈ ' + aLine, {
            fontSize: STYLE.TINY_SIZE, color: STYLE.TEXT_MED, spacing: 1
          });
        });
      }
    });

    // Notes
    if (lv.notes && lv.notes.length) {
      lv.notes.forEach(function(n) {
        addParagraph(body, '    ⚠ ' + n.topic, {
          fontSize: STYLE.TINY_SIZE, color: STYLE.ACCENT, italic: true, spacing: 2
        });
      });
    }
  });

  // ── Footer ──
  addParagraph(body, '', { fontSize: 8 });
  addRule(body);
  var today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'MMMM yyyy');
  addParagraph(body, 'Transpersonal Training — Programme Overview — ' + today, {
    fontSize: STYLE.TINY_SIZE, color: STYLE.TEXT_MED,
    alignment: DocumentApp.HorizontalAlignment.CENTER, spacing: 4
  });

  exportDocAsPDF(doc, 'Transpersonal_Training_Programme_Overview');
}
