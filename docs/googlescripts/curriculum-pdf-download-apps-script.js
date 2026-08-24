/**
 * ═══════════════════════════════════════════════════════════════════
 *  Curriculum Spreadsheet → downloadable PDF for the website
 *  Google Apps Script — add as a NEW file in the SAME script project as the
 *  JSON web app (docs/spreadsheet-automation/curriculum-json-apps-script.js)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  WHAT IT DOES
 *  The "Download PDF" button on /curriculum/ calls the web-app URL the
 *  website already reads its JSON from, with one extra parameter:
 *
 *      https://script.google.com/macros/s/AKfycb…/exec?format=pdf
 *
 *  The PDF is built from the same spreadsheet rows, filtered and grouped the
 *  same way the website filters and groups them, and laid out to follow the
 *  page: title block, "Our Hero Journey", then for each level the certificate
 *  box, the lessons, the experiential work and the examinations.
 *
 *  WHY THE URL DOESN'T RETURN THE PDF ITSELF
 *  An Apps Script web app can only answer with text (ContentService) or HTML
 *  (HtmlService) — it cannot stream a binary body. So no /exec URL can hand a
 *  browser a PDF directly. What it can do is build the file, keep it on the
 *  school's Drive, and bounce the browser to Drive's own download URL. That is
 *  what happens here: the visitor clicks, a tab opens for a moment, and the
 *  download starts. Add &mode=url to get {"url": …} as JSON instead, for a
 *  caller that would rather do the redirect itself.
 *
 *  THE FILE IS BUILT ONCE, NOT PER CLICK
 *  Every request fingerprints the curriculum content. While the fingerprint is
 *  unchanged the same Drive file is served, so repeat downloads are instant and
 *  Drive doesn't fill up with copies. Edit the spreadsheet and the next click
 *  rebuilds it. &refresh=1 forces a rebuild.
 *
 *  SETUP
 *   1. Curriculum spreadsheet → Extensions → Apps Script.
 *   2. + → Script, name it "curriculum-pdf-download", paste this file.
 *   3. Update the JSON script from curriculum-json-apps-script.js in the website
 *      repo: its doGet is now a router that sends ?format=pdf here, and its
 *      parser has moved into buildCurriculumTree() so this file can reuse it.
 *   4. Run webPdfWarmUp() once from the editor and accept the Drive/Docs
 *      permissions. The web app runs as you, but new permissions have to be
 *      granted interactively once — without this every ?format=pdf request
 *      fails.
 *   5. Deploy → Manage deployments → ✎ → Version: New version. Without a new
 *      version the published URL keeps serving the old code.
 *   6. Open <the /exec URL>?format=pdf in a browser to check the download.
 *
 *  KEEPING IT HONEST
 *  Two things here are copies of what the website says, and have to be edited
 *  in both places: WEB_PDF.SUBTITLE and WEB_PDF_CERTIFICATES mirror the hero
 *  subtitle and the "What you earn" boxes in src/curriculum.html. Everything
 *  else comes from the spreadsheet. The grouping rules in webPdfModel_() mirror
 *  src/_data/curriculumData.js in the same way.
 */

/* ═══════════════════════════════════════════════════════════════════
   CONFIGURATION
   ═══════════════════════════════════════════════════════════════════ */

var WEB_PDF = {
  FILE_NAME: 'EastWest-Transpersonal-Training-Curriculum',
  SCHOOL:    'Eastwest Transpersonal Training School',
  PAGE_URL:  'https://transpersonal-training.com/curriculum/',
  SITE:      'transpersonal-training.com',

  /* Mirrors the hero subtitle on /curriculum/ */
  SUBTITLE:  'A structured progression from self-development through professional ' +
             'facilitation to advanced psychotherapy and Holotropic Breathwork practice.',

  /* Bump this after editing the layout: it is part of the fingerprint, so it
     forces the next request to rebuild a PDF that content alone would have
     considered up to date. */
  RENDER_VERSION: 'v1',

  /* '' keeps the PDF next to the spreadsheet. Set a Drive folder id to put it
     somewhere else. */
  FOLDER_ID: ''
};

/* The page's palette, so the PDF reads as the same document as the website. */
var WEB_PDF_COLOR = {
  NAVY:   '#0F2540',
  RUST:   '#B65E3F',
  GOLD:   '#D9A756',
  CREAM:  '#FAF3E7',
  BORDER: '#E7D6BE',
  TEXT:   '#1F2937',
  MUTED:  '#5D584E',
  WHITE:  '#FFFFFF'
};

var WEB_PDF_FONT = {
  DISPLAY: 'Georgia',
  BODY:    'Arial'
};

/* "What you earn" — mirrors the levelCerts block in src/curriculum.html.
   Indexed by level position, exactly as the page does it. */
var WEB_PDF_CERTIFICATES = [
  {
    title: 'Certificate of Attendance',
    body:  'Level 1 can be taken on its own as a stand alone year of self-development — ' +
           'no obligation to continue.'
  },
  {
    title: 'Certificate in Transpersonal Counselling Skills',
    body:  'Awarded through a EUROTAS-accredited institute, with credits toward ' +
           'EUROTAS certification.'
  },
  {
    title: 'Certificate as Transpersonal Psychotherapy & Holotropic Breathwork Facilitator',
    body:  'With an optional EUROTAS certification track. Please note: “psychotherapist” ' +
           'is a legally protected title in many countries (for example Germany, France, ' +
           'Italy and Austria). Please check the psychotherapy regulations in the country ' +
           'where you intend to practise before using the title professionally.'
  }
];

var WEB_PDF_ROMANS = ['I', 'II', 'III', 'IV', 'V'];

var WEB_PDF_PROPERTY = 'curriculumPdfFile';

/* ═══════════════════════════════════════════════════════════════════
   WEB-APP ENTRY POINT  (called from doGet on ?format=pdf)
   ═══════════════════════════════════════════════════════════════════ */

function curriculumPdfWebApp(e) {
  var params = (e && e.parameter) || {};
  var mode   = String(params.mode || '').toLowerCase();
  var force  = /^(1|true|yes)$/i.test(String(params.refresh || ''));

  try {
    var file        = webPdfCurrentFile_(force);
    var downloadUrl = 'https://drive.google.com/uc?export=download&id=' + file.getId();

    if (mode === 'url' || mode === 'json') {
      return ContentService
        .createTextOutput(JSON.stringify({
          url:     downloadUrl,
          viewUrl: file.getUrl(),
          name:    file.getName(),
          updated: file.getLastUpdated().toISOString()
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return webPdfRedirectPage_(downloadUrl, file.getName());
  } catch (error) {
    return webPdfErrorPage_(error, /^(1|true|yes)$/i.test(String(params.debug || '')));
  }
}

/**
 * Run once from the editor after pasting this file, to grant the Drive and
 * Docs permissions the web app needs. Also a quick way to test the build.
 */
function webPdfWarmUp() {
  var file = webPdfCurrentFile_(true);
  Logger.log('PDF ready: %s', file.getUrl());
  return file.getUrl();
}

/* ═══════════════════════════════════════════════════════════════════
   BUILD-ONCE CACHE
   ═══════════════════════════════════════════════════════════════════ */

/**
 * The current PDF, rebuilt only when the curriculum (or the layout version)
 * has changed. The lock keeps two simultaneous first-clicks from each building
 * their own copy.
 */
function webPdfCurrentFile_(force) {
  var model       = webPdfModel_();
  var fingerprint = webPdfFingerprint_(model);
  var cached      = force ? null : webPdfCachedFile_(fingerprint);
  if (cached) return cached;

  var lock = LockService.getScriptLock();
  lock.waitLock(60000);
  try {
    /* Someone may have built it while we waited for the lock. */
    cached = force ? null : webPdfCachedFile_(fingerprint);
    if (cached) return cached;

    var file = webPdfBuildFile_(model);
    webPdfForgetPrevious_(file.getId());
    PropertiesService.getScriptProperties().setProperty(
      WEB_PDF_PROPERTY,
      JSON.stringify({ id: file.getId(), fingerprint: fingerprint })
    );
    return file;
  } finally {
    lock.releaseLock();
  }
}

function webPdfCachedFile_(fingerprint) {
  var stored = PropertiesService.getScriptProperties().getProperty(WEB_PDF_PROPERTY);
  if (!stored) return null;

  var record;
  try {
    record = JSON.parse(stored);
  } catch (parseError) {
    return null;
  }
  if (!record || record.fingerprint !== fingerprint || !record.id) return null;

  try {
    var file = DriveApp.getFileById(record.id);
    return file.isTrashed() ? null : file;
  } catch (missing) {
    return null;   // deleted from Drive — fall through to a rebuild
  }
}

/** Trash the PDF this one replaces, so the folder keeps a single current file. */
function webPdfForgetPrevious_(keepId) {
  var stored = PropertiesService.getScriptProperties().getProperty(WEB_PDF_PROPERTY);
  if (!stored) return;

  try {
    var previous = JSON.parse(stored);
    if (previous && previous.id && previous.id !== keepId) {
      DriveApp.getFileById(previous.id).setTrashed(true);
    }
  } catch (ignored) {
    /* A previous file that can no longer be found needs no cleaning up. */
  }
}

function webPdfFingerprint_(model) {
  var payload = WEB_PDF.RENDER_VERSION + '|' + JSON.stringify(model);
  var digest  = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, payload, Utilities.Charset.UTF_8);

  return digest.map(function (byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('');
}

/* ═══════════════════════════════════════════════════════════════════
   THE MODEL — the spreadsheet as the website sees it
   ═══════════════════════════════════════════════════════════════════ */

/**
 * The parsed spreadsheet. Reuses whichever parser is installed in this project
 * rather than carrying a third copy of it: buildCurriculumTree() from the JSON
 * script, or parseCurriculumData() from the menu-driven PDF script.
 */
function webPdfCurriculumTree_() {
  if (typeof buildCurriculumTree === 'function') return buildCurriculumTree();
  if (typeof parseCurriculumData === 'function') return parseCurriculumData();

  throw new Error(
    'No curriculum parser in this script project. Add APPS-SCRIPT-1-json-web-app.js ' +
    '(which defines buildCurriculumTree) alongside this file.'
  );
}

/**
 * Turn the parsed tree into what /curriculum/ actually renders. These rules are
 * the ones in src/_data/curriculumData.js — hidden rows dropped, module rows
 * separated from experiential rows and examinations, duplicates removed — and
 * the two must be changed together or the PDF and the page will disagree.
 */
function webPdfModel_() {
  var tree   = webPdfCurriculumTree_();
  var levels = webPdfArray_(tree.levels)
    .filter(webPdfVisible_)
    .map(function (level, index) {
      return {
        roman:            WEB_PDF_ROMANS[index] || String(index + 1),
        label:            webPdfExpandLabel_(webPdfText_(level.level) || 'Level ' + (index + 1)),
        title:            webPdfLevelTitle_(level),
        certificate:      WEB_PDF_CERTIFICATES[index] || null,
        modules:          webPdfModules_(level),
        practicalItems:   webPdfPracticalItems_(level),
        examinationItems: webPdfExaminationItems_(level)
      };
    })
    .filter(function (level) {
      return level.modules.length > 0 ||
             level.practicalItems.length > 0 ||
             level.examinationItems.length > 0;
    });

  var totalModules = levels.reduce(function (sum, level) {
    return sum + level.modules.length;
  }, 0);

  return { levels: levels, totalModules: totalModules };
}

/**
 * The level's title. It normally arrives on the level itself; when the header
 * row reads "Level 1: …" instead of "L1: …" the parser files it as an ordinary
 * section, so read it back from there rather than printing a placeholder.
 */
function webPdfLevelTitle_(level) {
  var direct = webPdfText_(level.title);
  if (direct) return direct;

  var sections = webPdfArray_(level.sections);
  for (var i = 0; i < sections.length; i++) {
    var match = /^(?:l|level)\s*\d+\s*[:–—-]\s*(.+)$/i.exec(webPdfText_(sections[i].title));
    if (match) return match[1].trim();
  }

  return 'Curriculum Level';
}

/** "L1" reads as "Level 1"; a label already spelled out is left alone. */
function webPdfExpandLabel_(label) {
  var match = /^L\s*(\d+)$/i.exec(label.trim());
  return match ? 'Level ' + match[1] : label;
}

/**
 * The lessons. Module rows are the ones numbered with a plain integer, wherever
 * in the sheet they sit — including the odd one filed under the experiential
 * section, which the website also picks up.
 */
function webPdfModules_(level) {
  var seen = {};

  return webPdfLevelItems_(level)
    .filter(function (item) { return /^\d+$/.test(webPdfText_(item.module)); })
    .filter(webPdfVisible_)
    .map(webPdfModule_)
    .filter(function (module) {
      var key = module.number + '::' + module.topic;
      if (seen[key]) return false;
      seen[key] = true;
      return true;
    })
    .sort(function (left, right) {
      return webPdfModuleOrder_(left.number) - webPdfModuleOrder_(right.number);
    });
}

function webPdfModule_(item) {
  var rawSubModules     = webPdfArray_(item.subModules);
  var visibleSubModules = rawSubModules.filter(webPdfVisible_);

  return {
    number:         webPdfText_(item.module),
    topic:          webPdfText_(item.topic),
    description:    webPdfText_(item.description),
    hours:          webPdfHours_(item.hours),
    deliveryFormat: webPdfDelivery_(item),
    subModules:     visibleSubModules.map(webPdfSubModule_),
    /* A module whose breakdown exists but is all hidden says so on the page,
       so that it doesn't look like a module that never had one. */
    hasHiddenSubModules: visibleSubModules.length < rawSubModules.length
  };
}

function webPdfSubModule_(sub) {
  var description = webPdfText_(sub.description);

  return {
    topic:       webPdfText_(sub.topic),
    description: description,
    topics:      webPdfTopicList_(description)
  };
}

/** A description written as several lines is a list of topics, as on the page. */
function webPdfTopicList_(description) {
  if (!description || description.indexOf('\n') === -1) return [];

  return description.split(/\r?\n/)
    .map(function (line) { return line.replace(/^[•\-–—\*]\s*/, '').trim(); })
    .filter(function (line) { return line !== ''; });
}

function webPdfPracticalItems_(level) {
  return webPdfDedupe_(
    webPdfSectionItems_(level, webPdfIsPracticalSection_)
      .filter(function (item) { return !/^\d+$/.test(webPdfText_(item.module)); })
      .filter(function (item) { return !webPdfIsExamination_(item); })
      .filter(webPdfVisible_)
      .map(webPdfSupplementaryItem_)
      .filter(function (item) { return item.topic || item.deliveryFormat; })
  );
}

function webPdfExaminationItems_(level) {
  var fromPractical = webPdfSectionItems_(level, webPdfIsPracticalSection_)
    .filter(webPdfIsExamination_);

  var fromExamSections = webPdfSectionItems_(level, function (section) {
    return /examin/i.test(webPdfText_(section.title));
  });

  return webPdfDedupe_(
    fromPractical.concat(fromExamSections)
      .filter(webPdfVisible_)
      .map(webPdfSupplementaryItem_)
      .filter(function (item) { return item.topic || item.deliveryFormat; })
  );
}

function webPdfSupplementaryItem_(item) {
  return {
    topic:          webPdfText_(item.topic),
    deliveryFormat: webPdfDelivery_(item)
  };
}

function webPdfIsPracticalSection_(section) {
  return /experiential\s*\/?\s*personal\s*\/?\s*group\s*work/i.test(webPdfText_(section.title));
}

function webPdfIsExamination_(item) {
  return /examin/i.test(webPdfText_(item.topic) + ' ' + webPdfDelivery_(item));
}

/** Every item in the level, whatever section holds it. */
function webPdfLevelItems_(level) {
  return webPdfArray_(level.modules)
    .concat(webPdfArray_(level.items))
    .concat(webPdfArray_(level.activities))
    .concat(webPdfSectionItems_(level, null));
}

/** Items from the level's sections, optionally only those matching a test. */
function webPdfSectionItems_(level, matches) {
  var items = [];

  webPdfArray_(level.sections)
    .filter(webPdfVisible_)
    .filter(function (section) { return !matches || matches(section); })
    .forEach(function (section) {
      items = items
        .concat(webPdfArray_(section.activities))
        .concat(webPdfArray_(section.items))
        .concat(webPdfArray_(section.modules));
    });

  return items;
}

function webPdfDedupe_(items) {
  var seen = {};

  return items.filter(function (item) {
    var key = item.topic + '::' + item.deliveryFormat;
    if (seen[key]) return false;
    seen[key] = true;
    return true;
  });
}

/* ── Small shared helpers (all private to this file) ───────────────── */

function webPdfArray_(value) {
  return Array.isArray(value) ? value : [];
}

function webPdfText_(value) {
  return value === null || value === undefined ? '' : String(value).trim();
}

function webPdfVisible_(record) {
  return !record || record.showOnWebsite !== false;
}

function webPdfDelivery_(item) {
  return webPdfText_(item.deliveryFormat) || webPdfText_(item.teachingStrategy);
}

/** Hours read as a number in the sheet; zero means "not stated", as on the page. */
function webPdfHours_(value) {
  var hours = parseFloat(value);
  return !hours || isNaN(hours) ? '' : String(hours);
}

/** "12" sorts by 12, "11-14" by its upper bound, as the website sorts them. */
function webPdfModuleOrder_(number) {
  var single = /^(\d+)$/.exec(number);
  if (single) return Number(single[1]);

  var range = /^(\d+)\s*-\s*(\d+)$/.exec(number);
  if (range) return Number(range[2]);

  return Number.MAX_SAFE_INTEGER;
}

/* ═══════════════════════════════════════════════════════════════════
   RENDERING — a Google Doc laid out like the page, exported as PDF
   ═══════════════════════════════════════════════════════════════════ */

function webPdfBuildFile_(model) {
  var stamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  var name  = WEB_PDF.FILE_NAME + '-' + stamp;
  var doc   = DocumentApp.create(name + ' (temp)');

  try {
    webPdfRenderDocument_(doc, model);
    doc.saveAndClose();

    var blob = DriveApp.getFileById(doc.getId())
      .getAs('application/pdf')
      .setName(name + '.pdf');

    var file = webPdfFolder_().createFile(blob);
    webPdfShare_(file);
    return file;
  } finally {
    /* The Doc is scaffolding; only the PDF is kept. */
    try {
      DriveApp.getFileById(doc.getId()).setTrashed(true);
    } catch (ignored) {}
  }
}

function webPdfFolder_() {
  if (WEB_PDF.FOLDER_ID) return DriveApp.getFolderById(WEB_PDF.FOLDER_ID);

  var spreadsheet = DriveApp.getFileById(SpreadsheetApp.getActiveSpreadsheet().getId());
  var parents     = spreadsheet.getParents();

  return parents.hasNext() ? parents.next() : DriveApp.getRootFolder();
}

/**
 * Anyone with the link may read it — the download URL is on a public page.
 * Some Workspace domains forbid this; if yours does, the request will fail
 * loudly here rather than serving a link that only staff can open.
 */
function webPdfShare_(file) {
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
}

function webPdfRenderDocument_(doc, model) {
  var body = doc.getBody();

  body.setMarginTop(48).setMarginBottom(48).setMarginLeft(56).setMarginRight(56);

  webPdfTitleBlock_(body, model);

  model.levels.forEach(function (level, index) {
    if (index > 0) body.appendPageBreak();
    webPdfLevelBlock_(body, level);
  });

  webPdfClosingBlock_(body);
  webPdfFooter_(doc);
  webPdfDropLeadingEmptyParagraph_(body);
}

/** The page's hero: kicker, title, subtitle. */
function webPdfTitleBlock_(body, model) {
  webPdfParagraph_(body, [
    model.levels.length + ' Levels',
    model.totalModules + ' Modules'
  ].join('  ·  '), {
    font: WEB_PDF_FONT.BODY, size: 9, bold: true, color: WEB_PDF_COLOR.RUST,
    align: DocumentApp.HorizontalAlignment.CENTER, spacingAfter: 6
  });

  webPdfParagraph_(body, 'Curriculum', {
    font: WEB_PDF_FONT.DISPLAY, size: 28, color: WEB_PDF_COLOR.NAVY,
    align: DocumentApp.HorizontalAlignment.CENTER, spacingAfter: 10
  });

  webPdfParagraph_(body, WEB_PDF.SUBTITLE, {
    font: WEB_PDF_FONT.BODY, size: 11, color: WEB_PDF_COLOR.MUTED,
    align: DocumentApp.HorizontalAlignment.CENTER, spacingAfter: 18
  });

  webPdfRule_(body);

  webPdfParagraph_(body, 'The path', {
    font: WEB_PDF_FONT.BODY, size: 9, bold: true, color: WEB_PDF_COLOR.RUST,
    spacingBefore: 14, spacingAfter: 4
  });

  webPdfParagraph_(body, 'Our Hero Journey', {
    font: WEB_PDF_FONT.DISPLAY, size: 18, color: WEB_PDF_COLOR.NAVY,
    spacingAfter: 12
  });
}

/** One level, in the order the page presents it. */
function webPdfLevelBlock_(body, level) {
  webPdfLevelHeading_(body, level);

  if (level.certificate) {
    webPdfCertificateBox_(body, level.certificate);
  }

  if (level.modules.length > 0) {
    webPdfSectionHeading_(body, 'Lessons');
    level.modules.forEach(function (module) {
      webPdfModuleBlock_(body, module);
    });
  }

  if (level.practicalItems.length > 0) {
    webPdfSectionHeading_(body, 'Experiential / Personal / Group Work');
    level.practicalItems.forEach(function (item) {
      webPdfSupplementaryBlock_(body, item);
    });
  }

  if (level.examinationItems.length > 0) {
    webPdfSectionHeading_(body, 'Examination');
    level.examinationItems.forEach(function (item) {
      webPdfSupplementaryBlock_(body, item);
    });
  }
}

/** The navy bar standing in for the page's level card header. */
function webPdfLevelHeading_(body, level) {
  var table = body.appendTable([['']]);
  var cell  = table.getCell(0, 0);

  table.setBorderColor(WEB_PDF_COLOR.NAVY).setBorderWidth(0);
  cell.setBackgroundColor(WEB_PDF_COLOR.NAVY)
      .setPaddingTop(10).setPaddingBottom(10).setPaddingLeft(12).setPaddingRight(12);

  webPdfCellHeading_(cell, level.roman + '.  ' + level.label + ' - ' + level.title, {
    font: WEB_PDF_FONT.DISPLAY, size: 15, bold: true, color: WEB_PDF_COLOR.WHITE
  });

  var count = level.modules.length === 1 ? '1 module' : level.modules.length + ' modules';
  webPdfStyle_(cell.appendParagraph(count), {
    font: WEB_PDF_FONT.BODY, size: 9, color: WEB_PDF_COLOR.GOLD, spacingBefore: 2
  });
}

/** "What you earn". */
function webPdfCertificateBox_(body, certificate) {
  var table = body.appendTable([['']]);
  var cell  = table.getCell(0, 0);

  table.setBorderColor(WEB_PDF_COLOR.GOLD).setBorderWidth(1);
  cell.setBackgroundColor(WEB_PDF_COLOR.CREAM)
      .setPaddingTop(8).setPaddingBottom(8).setPaddingLeft(12).setPaddingRight(12);

  webPdfCellHeading_(cell, 'WHAT YOU EARN', {
    font: WEB_PDF_FONT.BODY, size: 8, bold: true, color: WEB_PDF_COLOR.RUST, spacingAfter: 3
  });

  webPdfStyle_(cell.appendParagraph(certificate.title), {
    font: WEB_PDF_FONT.DISPLAY, size: 11, bold: true, color: WEB_PDF_COLOR.TEXT, spacingAfter: 3
  });

  webPdfStyle_(cell.appendParagraph(certificate.body), {
    font: WEB_PDF_FONT.BODY, size: 9, color: WEB_PDF_COLOR.TEXT
  });
}

function webPdfSectionHeading_(body, text) {
  webPdfParagraph_(body, text, {
    font: WEB_PDF_FONT.DISPLAY, size: 12, bold: true, color: WEB_PDF_COLOR.NAVY,
    spacingBefore: 14, spacingAfter: 6
  });
}

/** A lesson: heading, description, the hours/format line, then its topics. */
function webPdfModuleBlock_(body, module) {
  webPdfParagraph_(body, 'Module ' + module.number + ' - ' + module.topic, {
    font: WEB_PDF_FONT.DISPLAY, size: 11, bold: true, color: WEB_PDF_COLOR.TEXT,
    spacingBefore: 8, spacingAfter: 2
  });

  if (module.description) {
    webPdfParagraph_(body, module.description, {
      font: WEB_PDF_FONT.BODY, size: 9.5, color: WEB_PDF_COLOR.TEXT, spacingAfter: 2
    });
  }

  var chips = [];
  if (module.hours) chips.push(module.hours + ' hrs');
  if (module.deliveryFormat) chips.push(module.deliveryFormat);
  if (chips.length > 0) {
    webPdfParagraph_(body, chips.join('  ·  '), {
      font: WEB_PDF_FONT.BODY, size: 8.5, bold: true, color: WEB_PDF_COLOR.NAVY, spacingAfter: 4
    });
  }

  module.subModules.forEach(function (sub) {
    webPdfSubModuleBlock_(body, sub);
  });

  if (module.subModules.length === 0 && module.hasHiddenSubModules) {
    webPdfParagraph_(body,
      'The detailed topics for this module are being finalised and will be published shortly.', {
        font: WEB_PDF_FONT.BODY, size: 8.5, italic: true, color: WEB_PDF_COLOR.MUTED, spacingAfter: 4
      });
  }
}

function webPdfSubModuleBlock_(body, sub) {
  if (sub.topic) {
    webPdfParagraph_(body, sub.topic, {
      font: WEB_PDF_FONT.BODY, size: 9, bold: true, color: WEB_PDF_COLOR.MUTED,
      indent: 14, spacingBefore: 3, spacingAfter: 2
    });
  }

  if (sub.topics.length > 0) {
    sub.topics.forEach(function (topic) {
      webPdfStyle_(body.appendListItem(topic).setGlyphType(DocumentApp.GlyphType.BULLET), {
        font: WEB_PDF_FONT.BODY, size: 9, color: WEB_PDF_COLOR.TEXT, indent: 26
      });
    });
  } else if (sub.description) {
    webPdfParagraph_(body, sub.description, {
      font: WEB_PDF_FONT.BODY, size: 9, color: WEB_PDF_COLOR.TEXT, indent: 26, spacingAfter: 2
    });
  }
}

/** An experiential or examination row: what it is, and how it is delivered. */
function webPdfSupplementaryBlock_(body, item) {
  webPdfParagraph_(body, item.topic, {
    font: WEB_PDF_FONT.BODY, size: 9.5, bold: true, color: WEB_PDF_COLOR.TEXT,
    indent: 14, spacingBefore: 4
  });

  if (item.deliveryFormat) {
    webPdfParagraph_(body, item.deliveryFormat, {
      font: WEB_PDF_FONT.BODY, size: 9, color: WEB_PDF_COLOR.MUTED, indent: 14
    });
  }
}

/** The page's closing call to action. */
function webPdfClosingBlock_(body) {
  body.appendPageBreak();
  webPdfRule_(body);

  webPdfParagraph_(body, 'Ready to begin?', {
    font: WEB_PDF_FONT.DISPLAY, size: 18, color: WEB_PDF_COLOR.NAVY,
    align: DocumentApp.HorizontalAlignment.CENTER, spacingBefore: 16, spacingAfter: 6
  });

  webPdfParagraph_(body,
    'Explore our training overview or get in touch to find the right entry point for you.', {
      font: WEB_PDF_FONT.BODY, size: 10, color: WEB_PDF_COLOR.MUTED,
      align: DocumentApp.HorizontalAlignment.CENTER, spacingAfter: 6
    });

  webPdfParagraph_(body, WEB_PDF.SITE, {
    font: WEB_PDF_FONT.BODY, size: 10, bold: true, color: WEB_PDF_COLOR.RUST,
    align: DocumentApp.HorizontalAlignment.CENTER
  });
}

function webPdfFooter_(doc) {
  var stamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'd MMMM yyyy');

  webPdfStyle_(doc.addFooter().appendParagraph(
    WEB_PDF.SCHOOL + '  ·  Curriculum  ·  ' + stamp
  ), {
    font: WEB_PDF_FONT.BODY, size: 8, color: WEB_PDF_COLOR.MUTED,
    align: DocumentApp.HorizontalAlignment.CENTER
  });
}

/* ── Paragraph plumbing ────────────────────────────────────────────── */

function webPdfParagraph_(body, text, options) {
  return webPdfStyle_(body.appendParagraph(text), options);
}

/**
 * Write the first line of a box. A new table cell already holds one empty
 * paragraph, which is the one to fill — and Paragraph.setText() returns nothing,
 * so it cannot be chained into the styling call.
 */
function webPdfCellHeading_(cell, text, options) {
  var paragraph = cell.getChild(0).asParagraph();
  paragraph.setText(text);
  return webPdfStyle_(paragraph, options);
}

function webPdfStyle_(element, options) {
  var settings = options || {};
  var attributes = {};

  attributes[DocumentApp.Attribute.FONT_FAMILY]      = settings.font || WEB_PDF_FONT.BODY;
  attributes[DocumentApp.Attribute.FONT_SIZE]        = settings.size || 10;
  attributes[DocumentApp.Attribute.FOREGROUND_COLOR] = settings.color || WEB_PDF_COLOR.TEXT;
  attributes[DocumentApp.Attribute.BOLD]             = settings.bold === true;
  attributes[DocumentApp.Attribute.ITALIC]           = settings.italic === true;
  attributes[DocumentApp.Attribute.SPACING_BEFORE]   = settings.spacingBefore || 0;
  attributes[DocumentApp.Attribute.SPACING_AFTER]    = settings.spacingAfter || 0;
  attributes[DocumentApp.Attribute.LINE_SPACING]     = 1.15;

  if (settings.indent) {
    attributes[DocumentApp.Attribute.INDENT_START] = settings.indent;
  }
  if (settings.align) {
    attributes[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = settings.align;
  }

  element.setAttributes(attributes);
  return element;
}

/** A hairline, standing in for the page's rules. */
function webPdfRule_(body) {
  body.appendHorizontalRule();
}

/** DocumentApp.create() leaves an empty paragraph at the top; drop it. */
function webPdfDropLeadingEmptyParagraph_(body) {
  var first = body.getChild(0);
  if (first.getType() === DocumentApp.ElementType.PARAGRAPH &&
      first.asParagraph().getText() === '' &&
      body.getNumChildren() > 1) {
    first.removeFromParent();
  }
}

/* ═══════════════════════════════════════════════════════════════════
   RESPONSES
   ═══════════════════════════════════════════════════════════════════ */

/**
 * The bounce to Drive. A web app cannot answer with a redirect status, so the
 * page does it in the browser — with a plain link behind it for anyone whose
 * browser blocks the script.
 */
function webPdfRedirectPage_(downloadUrl, fileName) {
  var safeUrl  = webPdfEscape_(downloadUrl);
  var safeName = webPdfEscape_(fileName);

  return HtmlService.createHtmlOutput(
    '<!DOCTYPE html><html><head><meta charset="utf-8">' +
    '<title>Downloading the curriculum…</title>' +
    '<style>body{margin:0;padding:48px 24px;text-align:center;color:#0F2540;' +
    'font-family:Arial,Helvetica,sans-serif;background:#FAF3E7}' +
    'a{color:#B65E3F}</style></head><body>' +
    '<p>Your download is starting…</p>' +
    '<p><a href="' + safeUrl + '">' + safeName + '</a></p>' +
    '<script>window.top.location.replace(' + JSON.stringify(downloadUrl) + ');<\/script>' +
    '</body></html>'
  ).setTitle('Curriculum PDF');
}

/**
 * What the visitor sees when the file cannot be built: an apology and the way
 * back to the page. &debug=1 adds the stack, for reading an error that only
 * happens on the deployed script.
 */
function webPdfErrorPage_(error, debug) {
  var detail = String((error && error.message) || error);
  if (debug && error && error.stack) detail += '\n\n' + error.stack;

  return HtmlService.createHtmlOutput(
    '<!DOCTYPE html><html><head><meta charset="utf-8">' +
    '<title>The curriculum PDF is not available</title>' +
    '<style>body{margin:0;padding:48px 24px;text-align:center;color:#0F2540;' +
    'font-family:Arial,Helvetica,sans-serif;background:#FAF3E7}' +
    'a{color:#B65E3F}</style></head><body>' +
    '<p>Sorry — the curriculum PDF could not be prepared just now.</p>' +
    '<p><a href="' + webPdfEscape_(WEB_PDF.PAGE_URL) + '">Read the curriculum on the website</a></p>' +
    '<pre style="color:#5D584E;font-size:12px;white-space:pre-wrap;text-align:left">' +
    webPdfEscape_(detail) + '</pre>' +
    '</body></html>'
  ).setTitle('Curriculum PDF');
}

function webPdfEscape_(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
