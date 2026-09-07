/**
 * Google Apps Script — Curriculum Spreadsheet → Hierarchical JSON
 *
 * Deploy as a Web App (Execute as: Me, Access: Anyone) in
 * Google Apps Script editor attached to the Curriculum spreadsheet.
 *
 * ⚠️ After editing: Deploy → Manage deployments → ✎ → Version: New version.
 *    Without a new version the published URL keeps serving the old code and
 *    the website build never sees the change.
 *
 * Routes:
 *   /exec              → the curriculum as JSON (below)
 *   /exec?format=pdf   → the curriculum as a downloadable PDF, handled by
 *                        curriculum-pdf-download-apps-script.js
 *
 * Structure returned:
 *   { totalHours, levels[] }
 *   Each level  → { level, title, description, year, sections[], notes[] }
 *   Each section → { title, totalHours, items[] }
 *   Each item   → module | activity, with optional subModules[]
 *
 * Every level, section, item, sub-module and note carries `showOnWebsite`
 * (column Q). The website build (src/_data/curriculumData.js) drops anything
 * set to false; see readShow() for the exact semantics.
 */

/* ── Column indices (0-based, must match spreadsheet header order) ── */
var COL = {
  LEVEL:            0,
  YEAR:             1,
  MODULE:           2,
  TOPIC:            3,
  DESC:             4,
  TEACHING:         5,
  HOURS:            6,
  THEORY:           7,
  GROUP_THERAPY:    8,
  BREATHWORK:       9,
  SEMINAR:         10,
  DELIVERY:        11,
  EAP_CATEGORY:    12,
  CORE_TEACHER:    13,
  GUEST_TEACHER:   14,
  COMPULSORY:      15,
  SHOW_ON_WEBSITE: 16
};

/**
 * Resolved from the header row on every request, so moving the
 * "Show on website" column doesn't break anything. Falls back to
 * COL.SHOW_ON_WEBSITE (Q) when the header text isn't recognised.
 */
var SHOW_COL = COL.SHOW_ON_WEBSITE;

function resolveShowColumn(headerRow) {
  for (var i = 0; i < headerRow.length; i++) {
    var h = String(headerRow[i]).toLowerCase().replace(/[^a-z]/g, '');
    if (h === 'showonwebsite' || h === 'showonsite' || h === 'showwebsite' || h === 'showonweb') {
      return i;
    }
  }
  return COL.SHOW_ON_WEBSITE;
}

/* ── Helpers ───────────────────────────────────────────────────────── */

function toNum(v) {
  var n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}

function toBool(v) {
  return String(v).trim().toUpperCase() === 'TRUE';
}

function str(v) {
  return v != null ? String(v).trim() : '';
}

/**
 * "Show on website" column. Hides a row only on an explicitly false value —
 * a blank cell (or a missing column) keeps the row visible, so nothing ever
 * disappears from the site by omission.
 *
 * Deliberately not toBool(): toBool('') is false, which would hide every row
 * whose cell was simply left empty.
 *
 * Note: an *unticked checkbox* exports the boolean false and therefore hides
 * the row. If you use checkboxes you must tick every row you want published.
 * Typing FALSE only in the rows to hide is the lower-effort option.
 */
function readShow(row) {
  if (SHOW_COL < 0) return true;

  var v = row[SHOW_COL];
  if (v === '' || v == null) return true;
  if (v === true) return true;
  if (v === false) return false;

  var s = String(v).trim().toUpperCase();
  if (s === '') return true;
  return !(s === 'FALSE' || s === 'NO' || s === 'N' || s === '0' || s === 'OFF');
}

/**
 * Classify a row into one of:
 *   levelHeader | sectionHeader | module | subModule |
 *   crossActivity | specialNote | totals | skip
 */
function classifyRow(row) {
  var level  = str(row[COL.LEVEL]);
  var mod    = str(row[COL.MODULE]);
  var topic  = str(row[COL.TOPIC]);
  var hours  = str(row[COL.HOURS]);

  // Completely empty row
  if (!level && !mod && !topic && !hours) return 'skip';

  // Totals row (no level, has hours)
  if (!level && !mod && !topic && hours) return 'totals';

  // Special level note (e.g. "L1.1")
  if (/^L\d+\.\d+$/i.test(level)) return 'specialNote';

  // Has a module number
  if (mod) {
    if (/^\d+\.\d+$/.test(mod))  return 'subModule';       // 1.1, 2.1 …
    if (/^\d+$/.test(mod))       return 'module';           // 1, 2, 3 …
    if (/^\d+-\d+$/.test(mod))   return 'crossActivity';    // 1-4, 4-9 …
    // Fallback: treat as module
    return 'module';
  }

  // No module number — either a level header, section header, or standalone item
  if (/^L\d+$/i.test(level) && /^L\d+:/i.test(topic)) return 'levelHeader';

  // Standalone items (exams, etc.) have deliveryFormat or eapCategory filled in
  var delivery = str(row[COL.DELIVERY]);
  var eap      = str(row[COL.EAP_CATEGORY]);
  if (/^L\d+$/i.test(level) && topic && (delivery || eap)) return 'standaloneItem';

  // Section headers are broader category labels with no delivery/eap
  if (/^L\d+$/i.test(level) && topic) return 'sectionHeader';

  return 'skip';
}

/** Build a standard item object from a row */
function buildItem(row) {
  return {
    module:          str(row[COL.MODULE]),
    topic:           str(row[COL.TOPIC]),
    description:     str(row[COL.DESC]),
    teachingStrategy:str(row[COL.TEACHING]),
    hours:           toNum(row[COL.HOURS]),
    theory:          toNum(row[COL.THEORY]),
    groupTherapy:    toNum(row[COL.GROUP_THERAPY]),
    breathwork:      toNum(row[COL.BREATHWORK]),
    seminar:         toNum(row[COL.SEMINAR]),
    deliveryFormat:  str(row[COL.DELIVERY]),
    eapCategory:     str(row[COL.EAP_CATEGORY]),
    coreTeacher:     str(row[COL.CORE_TEACHER]),
    guestTeacher:    str(row[COL.GUEST_TEACHER]),
    compulsory:      toBool(row[COL.COMPULSORY]),
    showOnWebsite:   readShow(row)
  };
}

/** Parse "L1: SELF DEVELOPMENT" → { code: "L1", title: "SELF DEVELOPMENT" } */
function parseLevelTopic(topic) {
  var m = topic.match(/^(L\d+)\s*:\s*(.+)$/i);
  if (m) return { code: m[1].toUpperCase(), title: m[2].trim() };
  return { code: '', title: topic };
}

/* ── Main entry point ──────────────────────────────────────────────── */

/**
 * Web-app entry point. A script project can only have one doGet, so this is a
 * router: ?format=pdf hands over to the curriculum PDF script
 * (curriculum-pdf-download-apps-script.js), anything else returns the JSON the
 * website build reads.
 */
function doGet(e) {
  var format = String((e && e.parameter && e.parameter.format) || '').toLowerCase();

  if (format === 'pdf') {
    if (typeof curriculumPdfWebApp !== 'function') {
      return ContentService
        .createTextOutput('The curriculum PDF script is not installed in this project.')
        .setMimeType(ContentService.MimeType.TEXT);
    }
    return curriculumPdfWebApp(e);
  }

  return ContentService.createTextOutput(JSON.stringify(buildCurriculumTree(), null, 2))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Parse the spreadsheet into the hierarchical structure both the JSON endpoint
 * and the PDF are built from. Kept separate from doGet so the PDF script can
 * reuse it instead of carrying its own copy of the parser.
 */
function buildCurriculumTree() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data  = sheet.getDataRange().getValues();

  SHOW_COL = resolveShowColumn(data[0] || []);

  var result = {
    totalHours: 0,
    levels: []
  };

  var currentLevel   = null;   // pointer into result.levels[]
  var currentSection = null;   // pointer into currentLevel.sections[]
  var currentModule  = null;   // pointer into currentSection.items[]

  for (var i = 1; i < data.length; i++) {
    var row  = data[i];
    var type = classifyRow(row);

    // Auto-detect level change (L2/L3 have no explicit level header)
    var rowLevel = str(row[COL.LEVEL]);
    if (/^L\d+$/i.test(rowLevel) && type !== 'levelHeader' && type !== 'specialNote') {
      var normalised = rowLevel.toUpperCase();
      if (!currentLevel || currentLevel.level !== normalised) {
        currentLevel = {
          level: normalised,
          title: '',
          description: '',
          year: str(row[COL.YEAR]),
          sections: [],
          notes: [],
          showOnWebsite: readShow(row)
        };
        result.levels.push(currentLevel);
        currentSection = null;
        currentModule  = null;
      }
    }

    switch (type) {

      /* ── Level header (L1, L2, L3) ─────────────────────────────── */
      case 'levelHeader': {
        var parsed = parseLevelTopic(str(row[COL.TOPIC]));
        currentLevel = {
          level:       str(row[COL.LEVEL]).toUpperCase(),
          title:       parsed.title,
          description: str(row[COL.DESC]),
          year:        str(row[COL.YEAR]),
          sections:    [],
          notes:       [],
          showOnWebsite: readShow(row)
        };
        result.levels.push(currentLevel);
        currentSection = null;
        currentModule  = null;
        break;
      }

      /* ── Section header ("ONLINE LESSONS", "Experiential/…") ──── */
      case 'sectionHeader': {
        if (!currentLevel) break;               // safety
        currentSection = {
          title:      str(row[COL.TOPIC]),
          totalHours: toNum(row[COL.HOURS]),
          items:      [],
          showOnWebsite: readShow(row)
        };
        currentLevel.sections.push(currentSection);
        currentModule = null;
        break;
      }

      /* ── Full module (integer #) ───────────────────────────────── */
      case 'module': {
        if (!currentLevel) break;

        // Modules always go into a proper "Modules" section, not activities
        var modSection = null;
        for (var ms = 0; ms < currentLevel.sections.length; ms++) {
          if (currentLevel.sections[ms].title === 'Modules') {
            modSection = currentLevel.sections[ms]; break;
          }
        }
        // For explicit sections (e.g. "ONLINE LESSONS"), use currentSection
        if (currentSection && currentSection.title !== 'Experiential / Activities') {
          modSection = currentSection;
        }
        if (!modSection) {
          modSection = { title: 'Modules', totalHours: 0, items: [] };
          currentLevel.sections.push(modSection);
        }
        currentSection = modSection;

        var item    = buildItem(row);
        item.type   = 'module';
        item.year   = str(row[COL.YEAR]);
        item.subModules = [];
        currentSection.items.push(item);
        currentModule = item;
        break;
      }

      /* ── Sub-module (decimal #, e.g. 1.1) ──────────────────────── */
      case 'subModule': {
        if (!currentModule) break;              // orphan sub-module — skip
        var sub = buildItem(row);
        sub.type = 'subModule';
        currentModule.subModules.push(sub);
        break;
      }

      /* ── Cross-module activity (range #, e.g. 1-4) ────────────── */
      case 'crossActivity': {
        if (!currentLevel) break;

        // If we're still inside the "Modules" auto-section or there is
        // no section yet, create / find an activities section.
        if (!currentSection || currentSection.title === 'Modules') {
          // Look for an existing activities section in this level
          var found = null;
          for (var s = 0; s < currentLevel.sections.length; s++) {
            if (currentLevel.sections[s].title === 'Experiential / Activities') {
              found = currentLevel.sections[s];
              break;
            }
          }
          if (!found) {
            found = { title: 'Experiential / Activities', totalHours: 0, items: [] };
            currentLevel.sections.push(found);
          }
          currentSection = found;
        }

        var act       = buildItem(row);
        act.type      = 'activity';
        act.moduleRange = str(row[COL.MODULE]);
        act.year      = str(row[COL.YEAR]);
        currentSection.items.push(act);
        currentModule = null;                   // sub-modules won't nest here
        break;
      }

      /* ── Special level note (L1.1) ─────────────────────────────── */
      case 'specialNote': {
        if (!currentLevel) break;
        currentLevel.notes.push({
          level:          str(row[COL.LEVEL]),
          topic:          str(row[COL.TOPIC]),
          description:    str(row[COL.DESC]),
          deliveryFormat: str(row[COL.DELIVERY]),
          eapCategory:    str(row[COL.EAP_CATEGORY]),
          compulsory:     toBool(row[COL.COMPULSORY]),
          showOnWebsite:  readShow(row)
        });
        break;
      }

      /* ── Standalone item (exam, etc.) ────────────────────────── */
      case 'standaloneItem': {
        if (!currentLevel) break;
        if (!currentSection) {
          currentSection = { title: 'Other', totalHours: 0, items: [] };
          currentLevel.sections.push(currentSection);
        }
        var standalone   = buildItem(row);
        standalone.type  = 'standalone';
        standalone.year  = str(row[COL.YEAR]);
        currentSection.items.push(standalone);
        currentModule = null;
        break;
      }

      /* ── Totals row ────────────────────────────────────────────── */
      case 'totals': {
        result.totalHours = toNum(row[COL.HOURS]);
        break;
      }

      default:
        break;
    }
  }

  return result;
}
