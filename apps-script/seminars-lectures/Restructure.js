/* ═══════════════════════════════════════════════════════════════════
   SHEET RESTRUCTURE — 24 November 2026 (run once)
   ═══════════════════════════════════════════════════════════════════
   Menu: 🚀 Automations → 🧱 Restructure sheet (pools + dropdowns).

   What it does
   - Support tabs, each fact written once:
       Teachers  — everyone who can teach or facilitate (name as on the
                   website + link to their page, if they have one)
       Venues    — Location → place, nearest city, region, country,
                   address, Google Maps, arrival directions
       Lists     — seminar types, seminar modules, lecture modules, topics
   - Seminars is rebuilt with only what you choose or write:
       Date | Title | Facilitator 1-3 | Location | Type1 | Type2 |
       EWTT - Module | Description | ImageUrl | Slug
     City, address, map, country… come from Venues through the JSON API.
   - Lectures keeps its columns; Teacher 1/2, Module and Topic become
     dropdowns and the teacher names are aligned with the Teachers tab.
   - Both are written to NEW plain tabs (no table, so dropdowns and formats
     are allowed). The old tabs stay as "… (old 2026-11-24)": a backup to
     delete once everything looks right.

   Safe to re-run: it stops if Seminars already has a "Facilitator 1"
   column. formatSheets() (menu: 🎨 Format sheets) only redoes the
   formatting and the dropdowns.
   ═══════════════════════════════════════════════════════════════════ */

var RS_TEACHERS_ = [
 [
  "Kati Wortelkamp",
  "https://transpersonal-training.com/teachers/kati-wortelkamp/"
 ],
 [
  "Lyudmila Skartsesku",
  "https://transpersonal-training.com/teachers/lyudmila-skartsesku/"
 ],
 [
  "Manal Al-Hammadi",
  "https://transpersonal-training.com/teachers/manal-al-hammadi/"
 ],
 [
  "Bernadette Blin",
  "https://transpersonal-training.com/teachers/bernadette-blin/"
 ],
 [
  "Cathy Geils",
  "https://transpersonal-training.com/teachers/cathy-geils/"
 ],
 [
  "Dario Hampi Pacari",
  "https://transpersonal-training.com/teachers/dario-hampi-pacari/"
 ],
 [
  "Dr. Ingo Benjamin Jahrsetz",
  "https://transpersonal-training.com/teachers/ingo-jahrsetz/"
 ],
 [
  "Dr. Stefan Dressler",
  "https://transpersonal-training.com/teachers/stefan-dressler/"
 ],
 [
  "Dr. Tina Lindhard",
  "https://transpersonal-training.com/teachers/tina-lindhard/"
 ],
 [
  "Erik Andersen",
  "https://transpersonal-training.com/teachers/erik-andersen/"
 ],
 [
  "Gabriel Fernandez-Borsot, PhD",
  "https://transpersonal-training.com/teachers/gabriel-fernandez-borsot/"
 ],
 [
  "Jorge N. Ferrer, PhD",
  "https://transpersonal-training.com/teachers/jorge-ferrer/"
 ],
 [
  "Lilian Gscheidel",
  "https://transpersonal-training.com/teachers/lilian-gscheidel/"
 ],
 [
  "Mario Lorenzetti",
  "https://transpersonal-training.com/teachers/mario-lorenzetti/"
 ],
 [
  "Nicolás Cambas",
  "https://transpersonal-training.com/teachers/nicolas-cambas/"
 ],
 [
  "Prof. Jure Biechonski",
  "https://transpersonal-training.com/teachers/jure-biechonski/"
 ],
 [
  "Rainer Pervöltz",
  "https://transpersonal-training.com/teachers/rainer-pervoltz/"
 ],
 [
  "Stephan Schillinger",
  "https://transpersonal-training.com/teachers/stephan-schillinger/"
 ],
 [
  "Stéphanie Larrue, PhD",
  "https://transpersonal-training.com/teachers/stephanie-larrue/"
 ],
 [
  "Steven Schmitz, PhD",
  "https://transpersonal-training.com/teachers/steven-schmitz/"
 ],
 [
  "Tomáš Váňa",
  "https://transpersonal-training.com/teachers/tomas-vana/"
 ],
 [
  "Zixuan Hu",
  "https://transpersonal-training.com/teachers/zixuan-hu/"
 ],
 [
  "Charlotte Kihl",
  "https://transpersonal-training.com/teachers/charlotte-kihl/"
 ],
 [
  "Cristina Revenco",
  "https://transpersonal-training.com/teachers/cristina-revenco/"
 ],
 [
  "Dennis Johnson",
  "https://transpersonal-training.com/teachers/dennis-johnson/"
 ],
 [
  "Dr. Kirsten E. Cameron",
  "https://transpersonal-training.com/teachers/kirsten-cameron/"
 ],
 [
  "Dr. Serge Obolensky Beddington-Behrens",
  "https://transpersonal-training.com/teachers/serge-beddington-behrens/"
 ],
 [
  "Ingrida Indane",
  "https://transpersonal-training.com/teachers/ingrida-indane/"
 ],
 [
  "Lev Belogorodskii",
  "https://transpersonal-training.com/teachers/lev-belogorodskii/"
 ],
 [
  "Liudmila Serbina",
  "https://transpersonal-training.com/teachers/liudmila-serbina/"
 ],
 [
  "Lydia Maidan",
  "https://transpersonal-training.com/teachers/lydia-maidan/"
 ],
 [
  "Maria Kuehl-Weigmann",
  "https://transpersonal-training.com/teachers/maria-kuehl-weigmann/"
 ],
 [
  "Pier Luigi Lattuada",
  "https://transpersonal-training.com/teachers/pier-luigi-lattuada/"
 ],
 [
  "Rita Aguila",
  "https://transpersonal-training.com/teachers/rita-aguila/"
 ],
 [
  "Samvedam B. Randles",
  "https://transpersonal-training.com/teachers/samvedam-randles/"
 ],
 [
  "Vera Covaliciuc",
  "https://transpersonal-training.com/teachers/vera-covaliciuc/"
 ],
 [
  "Vladimir Maykov",
  "https://transpersonal-training.com/teachers/vladimir-maykov/"
 ],
 [
  "Ursula Boger",
  ""
 ],
 [
  "Mireia Berdun",
  ""
 ],
 [
  "Jasmine",
  ""
 ],
 [
  "Agnese",
  ""
 ],
 [
  "Sigits Duduris",
  ""
 ],
 [
  "Gisela Möhle",
  ""
 ],
 [
  "Anna Milaeva",
  ""
 ],
 [
  "Fabio Malizia",
  ""
 ]
];
var RS_FACILITATORS_ = {
 "Kati Wortelkamp & Lyudmila Skartsesku": [
  "Kati Wortelkamp",
  "Lyudmila Skartsesku"
 ],
 "Ursula Boger & Kati Wortelkamp": [
  "Ursula Boger",
  "Kati Wortelkamp"
 ],
 "Dario Giuffrida, Mireia Berdun": [
  "Dario Hampi Pacari",
  "Mireia Berdun"
 ],
 "Kati Wortelkamp & Ursula Boger": [
  "Kati Wortelkamp",
  "Ursula Boger"
 ],
 "Kati Wortelkamp & Lilian Gscheidel": [
  "Kati Wortelkamp",
  "Lilian Gscheidel"
 ],
 "Mario Lorenzetti & Kati Wortelkamp": [
  "Mario Lorenzetti",
  "Kati Wortelkamp"
 ],
 "Lyudmila Skartsesku, Kati Wortelkamp, Stefan Dressler": [
  "Lyudmila Skartsesku",
  "Kati Wortelkamp",
  "Dr. Stefan Dressler"
 ],
 "Lyudmila Skartsesku": [
  "Lyudmila Skartsesku"
 ],
 "Kati Wortelkamp, Mario Lorenzetti & Stephan Schillinger": [
  "Kati Wortelkamp",
  "Mario Lorenzetti",
  "Stephan Schillinger"
 ],
 "Kati Wortelkamp, Mario Lorenzetti, Jasmine": [
  "Kati Wortelkamp",
  "Mario Lorenzetti",
  "Jasmine"
 ],
 "Jure Biechonski": [
  "Prof. Jure Biechonski"
 ],
 "Kati Wortelkamp": [
  "Kati Wortelkamp"
 ],
 "Rainer Pervoltz": [
  "Rainer Pervöltz"
 ],
 "Lyudmila Skartsesku & Kati": [
  "Lyudmila Skartsesku",
  "Kati Wortelkamp"
 ],
 "Kati": [
  "Kati Wortelkamp"
 ],
 "Charlotte Kihl": [
  "Charlotte Kihl"
 ],
 "Mario Lorenzetti": [
  "Mario Lorenzetti"
 ],
 "Kati + Agnese": [
  "Kati Wortelkamp",
  "Agnese"
 ],
 "Stefan Dressler": [
  "Dr. Stefan Dressler"
 ],
 "Kati Wortelkamp & Mario Lorenzetti": [
  "Kati Wortelkamp",
  "Mario Lorenzetti"
 ],
 "Nicolas Cambas": [
  "Nicolás Cambas"
 ],
 "-": [],
 "Lyudmila Skartsesku, Kati Wortelkamp": [
  "Lyudmila Skartsesku",
  "Kati Wortelkamp"
 ],
 "Sigits Duduris": [
  "Sigits Duduris"
 ],
 "Ursula Boger": [
  "Ursula Boger"
 ],
 "Rainer Pervöltz": [
  "Rainer Pervöltz"
 ],
 "Stephan Schillinger": [
  "Stephan Schillinger"
 ],
 "Gisela Möhle": [
  "Gisela Möhle"
 ],
 "Tina Lindhard": [
  "Dr. Tina Lindhard"
 ],
 "Dario Hampi Pacari & Anna Milaeva": [
  "Dario Hampi Pacari",
  "Anna Milaeva"
 ]
};
var RS_LECTURE_TEACHERS_ = {
 "Lyudmila Skartsesku": "Lyudmila Skartsesku",
 "Dr. Ingo Jahrsetz": "Dr. Ingo Benjamin Jahrsetz",
 "Stephan Schillinger": "Stephan Schillinger",
 "Rita Aguilar": "Rita Aguila",
 "Manal Al-Hammadi": "Manal Al-Hammadi",
 "Bernadette Blin": "Bernadette Blin",
 "Dr. Kisten Cameron, PhD": "Dr. Kirsten E. Cameron",
 "Lilian Gscheidel": "Lilian Gscheidel",
 "Kati Wortelkamp": "Kati Wortelkamp",
 "Erik Anderson": "Erik Andersen",
 "Dr. Cathy Geils": "Cathy Geils",
 "Prof. Jure Biechonski": "Prof. Jure Biechonski",
 "Dr. Stefan Dressler": "Dr. Stefan Dressler",
 "Tina Lindhard, PhD": "Dr. Tina Lindhard",
 "Steven Schmitz, Ph.D.": "Steven Schmitz, PhD",
 "Lidia Maidan": "Lydia Maidan",
 "Fabio Malizia": "Fabio Malizia",
 "Jure Biechonski": "Prof. Jure Biechonski",
 "Dr. Tina Lindhard": "Dr. Tina Lindhard"
};
// Location | Place | Nearest city | Region | Country | Address | Google Maps | Arrival
var RS_VENUES_ = [
 [
  "Todtmoos",
  "Haus am Mühlenbach, Todtmoos",
  "Freiburg",
  "Black Forest",
  "Germany",
  "Mühlematt 6, 79682 Todtmoos-Au, Germany",
  "https://www.google.com/maps/search/?api=1&query=Haus%20am%20M%C3%BChlenbach%2C%20M%C3%BChlematt%206%2C%2079682%20Todtmoos-Au%2C%20Germany",
  "https://transpersonal-training.com/venues/#getting-to-todtmoos"
 ],
 [
  "Monteverdi (Tuscany)",
  "Tenuta di Monteverdi, Tuscany",
  "Grosseto",
  "Tuscany",
  "Italy",
  "Località Monteverdi, 58045 Paganico (GR), Italy",
  "https://www.google.com/maps/search/?api=1&query=Tenuta%20di%20Monteverdi%2C%20Localit%C3%A0%20Monteverdi%2C%2058045%20Paganico%20GR%2C%20Italy",
  "https://transpersonal-training.com/venues/#getting-to-monteverdi"
 ],
 [
  "Chisinau",
  "",
  "Chisinau",
  "",
  "Moldova",
  "",
  "https://www.google.com/maps/search/?api=1&query=Chisinau%2C%20Moldova",
  ""
 ],
 [
  "Riga",
  "",
  "Riga",
  "",
  "Latvia",
  "",
  "https://www.google.com/maps/search/?api=1&query=Riga%2C%20Latvia",
  ""
 ],
 [
  "Bucharest",
  "",
  "Bucharest",
  "",
  "Romania",
  "",
  "https://www.google.com/maps/search/?api=1&query=Bucharest%2C%20Romania",
  ""
 ],
 [
  "Milan",
  "",
  "Milan",
  "",
  "Italy",
  "",
  "https://www.google.com/maps/search/?api=1&query=Milan%2C%20Italy",
  ""
 ],
 [
  "Carate Brianza (Milan)",
  "Carate Brianza",
  "Milan",
  "",
  "Italy",
  "",
  "https://www.google.com/maps/search/?api=1&query=Carate%20Brianza%2C%20Italy",
  ""
 ],
 [
  "Spetses (Greece)",
  "Spetses",
  "Athens",
  "",
  "Greece",
  "",
  "https://www.google.com/maps/search/?api=1&query=Spetses%2C%20Greece",
  ""
 ],
 [
  "Portugal",
  "",
  "",
  "",
  "Portugal",
  "",
  "",
  ""
 ]
];
// "country|city|venue" as the old Seminars columns had them → Location
var RS_LOCATIONS_ = {
 "Germany|Freiburg|Haus am Mühlenbach, Todtmoos": "Todtmoos",
 "Moldova|Chisinau|": "Chisinau",
 "Latvia|Riga|": "Riga",
 "Italy|Milan|Carate Brianza": "Carate Brianza (Milan)",
 "Italy|Milan|": "Milan",
 "Greece|Athens|Spetses": "Spetses (Greece)",
 "Portugal||": "Portugal",
 "Romania|Bucharest|": "Bucharest",
 "Italy|Grosseto|Tenuta di Monteverdi, Tuscany": "Monteverdi (Tuscany)"
};
var RS_TYPES_ = [
 "Holotropic Breathwork",
 "Seminar",
 "Family Constellation",
 "Gestalt",
 "Ceremony",
 "Conference"
];
var RS_TYPE_FIX_ = {
 "Breathwork": "Holotropic Breathwork"
};
var RS_MODULES_ = [
 "-",
 "Module 1",
 "Module 2",
 "Module 3",
 "Module 4",
 "Module 5",
 "Module 6",
 "Module 7",
 "Module 8",
 "Module 9",
 "Module 10",
 "Module 11",
 "Module 12",
 "Module 13"
];
var RS_LECTURE_MODULES_ = [
 1,
 2,
 3,
 4,
 5,
 6,
 7,
 8,
 9,
 10,
 11,
 12,
 13
];
var RS_TOPICS_ = [
 "-",
 "Emotions in Transpersonal Work: Shame, Fear and Guilt",
 "Ethics in Work with Holotropic States",
 "Family Constellations in the Group",
 "Gestalt Therapy: Chair Work",
 "Holotropic States of Consciousness and their Healing Potential",
 "Integration of Non-Ordinary Experiences",
 "Love in the context of Psychotherapy",
 "Meditation and Heart-Based Therapy (Arka Dhyana)",
 "Music and Sound in Holotropic Breathwork",
 "Perinatal Experience, Death and Rebirth",
 "Practice and Supervision in Holotropic Breathwork",
 "Psychedelics, Expanded States and Therapy",
 "Psychopathology from a Transpersonal Point of View",
 "Shamanism, Ritual and Shamanic Healing",
 "Spiritual Emergency and Spiritual Crisis",
 "Strategy of Holotropic Breathwork Sessions",
 "The Alchemy of Trauma: Forging Transpersonal Gold from Life's Deepest Wounds",
 "Transpersonal Counseling Skills and the Counseling Process"
];

var RS_SEMINAR_HEADERS_ = ['Date', 'Title', 'Facilitator 1', 'Facilitator 2', 'Facilitator 3', 'Location',
                           'Type1', 'Type2', 'EWTT - Module', 'Description', 'ImageUrl', 'Slug'];
var RS_BACKUP_SUFFIX_ = ' (old 2026-11-24)';
var RS_HEADER_BG_ = '#262046';
var RS_ROWS_ = 1000;

// Rows 2…end of the sheet, never past it.
function bodyRange_(sheet, col) {
  return sheet.getRange(2, col, Math.max(sheet.getMaxRows() - 1, 1), 1);
}

function restructureSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ui = null;
  try { ui = SpreadsheetApp.getUi(); } catch (e) {}
  var current = ss.getSheetByName('Seminars');
  if (current && ('facilitator 1' in headerMap_(current))) {
    if (ui) ui.alert('Already restructured', 'Seminars already has the new columns. Use "Format sheets" to redo formatting and dropdowns.', ui.ButtonSet.OK);
    return;
  }
  buildSupportTabs_(ss);
  var report = rebuildSeminars_(ss).concat(rebuildLectures_(ss));
  var formatProblems = formatSheets();
  report = report.concat(formatProblems || []);
  var msg = 'Done. New tabs: Teachers, Venues, Lists. Seminars and Lectures rebuilt with dropdowns.\n' +
            'The old tabs are kept as "Seminars' + RS_BACKUP_SUFFIX_ + '" and "Lectures' + RS_BACKUP_SUFFIX_ + '".' +
            (report.length ? '\n\nCheck by hand:\n- ' + report.join('\n- ') : '');
  Logger.log(msg);
  if (ui) ui.alert('Sheet restructured', msg, ui.ButtonSet.OK);
}

function headerMap_(sheet) {
  var lastCol = Math.max(sheet.getLastColumn(), 1);
  var h = sheet.getRange(1, 1, 1, lastCol).getDisplayValues()[0];
  var map = {};
  h.forEach(function (name, i) {
    var k = String(name).trim().toLowerCase();
    if (k && !(k in map)) map[k] = i;
  });
  return map;
}

function freshSheet_(ss, name) {
  var sh = ss.getSheetByName(name);
  if (sh) {
    sh.getBandings().forEach(function (b) { b.remove(); });
    sh.clear();
    sh.clearNotes();
    sh.getRange(1, 1, sh.getMaxRows(), sh.getMaxColumns()).clearDataValidations();
    return sh;
  }
  return ss.insertSheet(name, ss.getSheets().length);
}

function writeColumn_(sheet, col, values) {
  if (!values.length) return;
  sheet.getRange(2, col, values.length, 1).setValues(values.map(function (x) { return [x]; }));
}

function buildSupportTabs_(ss) {
  var t = freshSheet_(ss, 'Teachers');
  t.getRange(1, 1, 1, 2).setValues([['Name', 'Website page']]);
  t.getRange(2, 1, RS_TEACHERS_.length, 2).setValues(RS_TEACHERS_);

  var v = freshSheet_(ss, 'Venues');
  v.getRange(1, 1, 1, 8).setValues([['Location', 'Place', 'Nearest city', 'Region', 'Country', 'Address', 'Google Maps', 'Arrival']]);
  v.getRange(2, 1, RS_VENUES_.length, 8).setValues(RS_VENUES_);

  var l = freshSheet_(ss, 'Lists');
  l.getRange(1, 1, 1, 4).setValues([['Seminar types', 'Seminar modules', 'Lecture modules', 'Lecture topics']]);
  bodyRange_(l, 2).setNumberFormat('@');   // "-" and "Module 1" stay text
  writeColumn_(l, 1, RS_TYPES_);
  writeColumn_(l, 2, RS_MODULES_);
  writeColumn_(l, 3, RS_LECTURE_MODULES_);
  writeColumn_(l, 4, RS_TOPICS_);
}

function rebuildSeminars_(ss) {
  var report = [];
  var old = ss.getSheetByName('Seminars');
  var h = headerMap_(old);
  var rows = old.getDataRange().getDisplayValues().slice(1);
  var get = function (r, k) { return (k in h) ? String(r[h[k]] || '').trim() : ''; };
  var out = [];
  rows.forEach(function (r) {
    if (r.every(function (c) { return !String(c).trim(); })) return;
    var raw = get(r, 'facilitator');
    var people = (!raw || raw === '-') ? [] : (RS_FACILITATORS_[raw] || [raw]);
    if (raw && raw !== '-' && !RS_FACILITATORS_[raw]) report.push('Facilitator not in Teachers: "' + raw + '" (' + get(r, 'date') + ')');
    var key = [get(r, 'location'), get(r, 'city'), get(r, 'venue')].join('|');
    var location = RS_LOCATIONS_[key] || '';
    if (!location) report.push('No Location for ' + get(r, 'date') + ' ' + get(r, 'title') + ' (' + key + ')');
    var t1 = RS_TYPE_FIX_[get(r, 'type1')] || get(r, 'type1');
    var t2 = RS_TYPE_FIX_[get(r, 'type2')] || get(r, 'type2');
    out.push([get(r, 'date'), get(r, 'title'), people[0] || '', people[1] || '', people[2] || '', location,
              t1, t2, get(r, 'ewtt - module'), get(r, 'description'), get(r, 'imageurl'), get(r, 'slug')]);
  });
  var sh = ss.insertSheet('Seminars (new)', old.getIndex() - 1);
  sh.getRange(1, 1, 1, RS_SEMINAR_HEADERS_.length).setValues([RS_SEMINAR_HEADERS_]);
  // Dates are free text ("18.11.2026 - 22.11.2026", "April or May 2027"): keep them text.
  bodyRange_(sh, 1).setNumberFormat('@');
  bodyRange_(sh, 9).setNumberFormat('@');
  if (out.length) sh.getRange(2, 1, out.length, RS_SEMINAR_HEADERS_.length).setValues(out);
  old.setName('Seminars' + RS_BACKUP_SUFFIX_);
  sh.setName('Seminars');
  return report;
}

function rebuildLectures_(ss) {
  var report = [];
  var old = ss.getSheetByName('Lectures');
  var range = old.getDataRange();
  var values = range.getValues();
  var formats = range.getNumberFormats();
  var headers = values[0].map(function (x) { return String(x).trim(); });
  // Keep the columns that have a header (a table's spare columns go), in order.
  var keep = [];
  headers.forEach(function (x, i) { if (x) keep.push(i); });
  var hasTopic = headers.some(function (x) { return x.toLowerCase() === 'topic'; });
  if (!hasTopic) keep.push(-1);
  var pick = function (row, fill) { return keep.map(function (i) { return i < 0 ? fill : row[i]; }); };
  var newHeaders = pick(headers, 'Topic');
  var lower = newHeaders.map(function (x) { return String(x).toLowerCase(); });
  var used = [];
  values.slice(1).forEach(function (r, i) {
    if (r.some(function (c) { return String(c).trim(); })) used.push(i + 1);
  });
  var body = used.map(function (i) { return pick(values[i], ''); });
  var bodyFormats = used.map(function (i) { return pick(formats[i], '@'); });
  ['teacher 1', 'teacher 2'].forEach(function (k) {
    var c = lower.indexOf(k);
    if (c < 0) return;
    body.forEach(function (r) {
      var raw = String(r[c] || '').trim();
      if (!raw) return;
      if (RS_LECTURE_TEACHERS_[raw]) r[c] = RS_LECTURE_TEACHERS_[raw];
      else if (!RS_TEACHERS_.some(function (t) { return t[0] === raw; })) report.push('Lecture teacher not in Teachers: "' + raw + '"');
    });
  });
  var sh = ss.insertSheet('Lectures (new)', old.getIndex() - 1);
  sh.getRange(1, 1, 1, newHeaders.length).setValues([newHeaders]);
  if (body.length) {
    var target = sh.getRange(2, 1, body.length, newHeaders.length);
    target.setNumberFormats(bodyFormats);
    target.setValues(body);
  }
  old.setName('Lectures' + RS_BACKUP_SUFFIX_);
  sh.setName('Lectures');
  return report;
}

/* Formatting and dropdowns for the five tabs. Can be run on its own
   (menu: 🎨 Format sheets). Returns a list of steps that failed. */
function formatSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var problems = [];
  var step = function (label, fn) {
    try { fn(); } catch (e) { problems.push(label + ': ' + e.message); }
  };
  var teachers = ss.getSheetByName('Teachers');
  var venues = ss.getSheetByName('Venues');
  var lists = ss.getSheetByName('Lists');
  var sem = ss.getSheetByName('Seminars');
  var lec = ss.getSheetByName('Lectures');

  var pool = function (sheet, col) { return bodyRange_(sheet, col); };
  var dropdown = function (source) {
    return SpreadsheetApp.newDataValidation()
      .requireValueInRange(source, true)
      .setAllowInvalid(false)
      .setHelpText('Choose from the list. A new value goes into the ' + source.getSheet().getName() + ' tab first.')
      .build();
  };
  var column = function (sheet, h, key) { return bodyRange_(sheet, h[key] + 1); };

  if (sem) step('Seminars', function () {
    styleTab_(sem, { 'date': 170, 'title': 300, 'facilitator 1': 170, 'facilitator 2': 170, 'facilitator 3': 170,
                     'location': 170, 'type1': 150, 'type2': 150, 'ewtt - module': 110, 'description': 420,
                     'imageurl': 140, 'slug': 260 }, ['title'], 2);
    var h = headerMap_(sem);
    ['facilitator 1', 'facilitator 2', 'facilitator 3'].forEach(function (k) {
      if (k in h) column(sem, h, k).setDataValidation(dropdown(pool(teachers, 1)));
    });
    if ('location' in h) {
      column(sem, h, 'location').setDataValidation(dropdown(pool(venues, 1)));
      sem.getRange(1, h['location'] + 1).setNote('Where it happens. City, address, map and directions come from the Venues tab.');
    }
    ['type1', 'type2'].forEach(function (k) {
      if (k in h) column(sem, h, k).setDataValidation(dropdown(pool(lists, 1)));
    });
    if ('ewtt - module' in h) column(sem, h, 'ewtt - module').setDataValidation(dropdown(pool(lists, 2)));
    if ('slug' in h) {
      sem.getRange(1, h['slug'] + 1).setNote('Set once: the address of the seminar page on the website (/seminars/<slug>/). Leave it as it is; for a new seminar leave it empty.');
      column(sem, h, 'slug').setFontColor('#9a96a8').setFontStyle('italic');
    }
    if ('date' in h) sem.getRange(1, h['date'] + 1).setNote('dd.mm.yyyy - dd.mm.yyyy, or words like "April or May 2027" when not fixed yet.');
  });

  if (lec) step('Lectures', function () {
    styleTab_(lec, { 'date': 100, 'start hour': 80, 'finish hour': 80, 'module': 70, 'title': 320, 'description': 420,
                     'teacher 1': 190, 'teacher 2': 190, 'video link': 140, 'image link': 140, 'topic': 300 }, ['title'], 1);
    var h = headerMap_(lec);
    ['teacher 1', 'teacher 2'].forEach(function (k) {
      if (k in h) column(lec, h, k).setDataValidation(dropdown(pool(teachers, 1)));
    });
    if ('module' in h) column(lec, h, 'module').setDataValidation(dropdown(pool(lists, 3)));
    if ('topic' in h) {
      column(lec, h, 'topic').setDataValidation(dropdown(pool(lists, 4)));
      lec.getRange(1, h['topic'] + 1).setNote('Which /lectures/<topic>/ page this session is on: same topic, same page. "-" = no topic page (meetings, tests).');
    }
    if ('date' in h) column(lec, h, 'date').setNumberFormat('dd/mm/yyyy').setHorizontalAlignment('left');
  });

  if (teachers) step('Teachers', function () { styleTab_(teachers, { 'name': 240, 'website page': 380 }, [], 1); });
  if (venues) step('Venues', function () {
    styleTab_(venues, { 'location': 190, 'place': 230, 'nearest city': 120, 'region': 110, 'country': 100,
                        'address': 300, 'google maps': 200, 'arrival': 280 }, [], 1);
  });
  if (lists) step('Lists', function () {
    styleTab_(lists, { 'seminar types': 190, 'seminar modules': 150, 'lecture modules': 130, 'lecture topics': 380 }, [], 0);
  });
  return problems;
}

function formatSheetsFromMenu() {
  var problems = formatSheets();
  var msg = problems.length ? 'Some steps failed:\n- ' + problems.join('\n- ') : 'Formatting and dropdowns applied.';
  try { SpreadsheetApp.getUi().alert('Format sheets', msg, SpreadsheetApp.getUi().ButtonSet.OK); } catch (e) { Logger.log(msg); }
}

function styleTab_(sheet, widths, wrapCols, freezeCols) {
  var lastCol = sheet.getLastColumn();
  if (!lastCol) return;
  sheet.getBandings().forEach(function (b) { b.remove(); });
  var rows = sheet.getMaxRows();
  var all = sheet.getRange(1, 1, rows, lastCol);
  all.setFontFamily('Arial').setFontSize(10).setVerticalAlignment('middle')
     .setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);
  var band = all.applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, true, false);
  band.setHeaderRowColor(RS_HEADER_BG_).setFirstRowColor('#ffffff').setSecondRowColor('#f5f3f8');
  sheet.getRange(1, 1, 1, lastCol).setFontColor('#ffffff').setFontWeight('bold')
       .setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
  sheet.setRowHeight(1, 34);
  sheet.setFrozenRows(1);
  sheet.setFrozenColumns(freezeCols || 0);
  var h = headerMap_(sheet);
  Object.keys(widths).forEach(function (k) { if (k in h) sheet.setColumnWidth(h[k] + 1, widths[k]); });
  (wrapCols || []).forEach(function (k) {
    if (k in h) sheet.getRange(2, h[k] + 1, rows - 1, 1).setFontWeight('bold');
  });
  if (sheet.getLastRow() > 1) sheet.setRowHeightsForced(2, sheet.getLastRow() - 1, 24);
}
