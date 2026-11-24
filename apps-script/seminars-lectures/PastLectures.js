/* ═══════════════════════════════════════════════════════════════════
   PAST LECTURES + MODULES — 24 November 2026 (run once)
   ═══════════════════════════════════════════════════════════════════
   Menu: 🚀 Automations → 📚 Add past lectures + seminars.

   1. Restores the Module of every lecture whose Module came out empty when
      the tab was rebuilt, from "Lectures (old 2026-11-24)" (same date and
      title).
   2. Adds the lectures held from February 2024 to December 2025, taken
      from the programmes published on the old website (West_Program_24,
      status 29.12.2024; West_Program_25, status 04.10.2025), plus two
      2026 students' meetings from West_Program_26. Module and Topic are
      set; Start/Finish hour and Description are left empty (the
      programmes don't give them).
   3. Adds the new topics to the Lists tab, sorts the tab by date.

   Safe to re-run: a lecture already there (same date and title) is not
   added twice, and a Module already filled is left alone.
   ═══════════════════════════════════════════════════════════════════ */

// [date dd/mm/yyyy, title, teacher 1, teacher 2, module, topic]
var PAST_LECTURES_ = [
 [
  "06/02/2024",
  "Welcome. Hero's Journey",
  "Kati Wortelkamp",
  "Lyudmila Skartsesku",
  1,
  "The Hero's Journey"
 ],
 [
  "13/02/2024",
  "Overview over different psychotherapeutic approaches",
  "Prof. Jure Biechonski",
  "",
  1,
  "Psychotherapeutic Approaches"
 ],
 [
  "20/02/2024",
  "Cognitive Behavioral approach",
  "Prof. Jure Biechonski",
  "",
  1,
  "Psychotherapeutic Approaches"
 ],
 [
  "27/02/2024",
  "Humanistic approach",
  "Prof. Jure Biechonski",
  "",
  1,
  "Psychotherapeutic Approaches"
 ],
 [
  "05/03/2024",
  "Fundamentals of analytical psychology and the Individualization Process according to Carl Gustav Jung: Shadow, projections, old patterns. Part I",
  "Prof. Jure Biechonski",
  "",
  1,
  "Analytical Psychology (C. G. Jung)"
 ],
 [
  "12/03/2024",
  "Introduction to counseling and counseling skills, Part I",
  "Prof. Jure Biechonski",
  "",
  1,
  "Transpersonal Counseling Skills and the Counseling Process"
 ],
 [
  "19/03/2024",
  "Introduction to counseling and counseling skills, Part II",
  "Prof. Jure Biechonski",
  "",
  1,
  "Transpersonal Counseling Skills and the Counseling Process"
 ],
 [
  "26/03/2024",
  "Introduction to counseling and counseling skills, Part III",
  "Prof. Jure Biechonski",
  "",
  1,
  "Transpersonal Counseling Skills and the Counseling Process"
 ],
 [
  "09/04/2024",
  "Student's Meeting",
  "",
  "",
  1,
  "-"
 ],
 [
  "16/04/2024",
  "What is transpersonal counseling?",
  "Prof. Jure Biechonski",
  "",
  1,
  "Transpersonal Counseling Skills and the Counseling Process"
 ],
 [
  "23/04/2024",
  "Exploring the bigger picture. Considering systemic, collective and transgenerational influences. An individual work with Family Constellation",
  "Samvedam B. Randles",
  "",
  1,
  "Family Constellations in the Group"
 ],
 [
  "02/05/2024",
  "Resource based Systemic Therapy I",
  "Lev Belogorodskii",
  "",
  2,
  "Resource-based Systemic Therapy"
 ],
 [
  "07/05/2024",
  "Resource based Systemic Therapy II",
  "Lev Belogorodskii",
  "",
  2,
  "Resource-based Systemic Therapy"
 ],
 [
  "16/05/2024",
  "Resource based Systemic Therapy III",
  "Lev Belogorodskii",
  "",
  2,
  "Resource-based Systemic Therapy"
 ],
 [
  "21/05/2024",
  "Resource based Systemic Therapy IV",
  "Lev Belogorodskii",
  "",
  2,
  "Resource-based Systemic Therapy"
 ],
 [
  "28/05/2024",
  "Process Oriented Therapy I",
  "Liudmila Serbina",
  "",
  2,
  "Process Oriented Therapy"
 ],
 [
  "04/06/2024",
  "Process Oriented Therapy II",
  "Liudmila Serbina",
  "",
  2,
  "Process Oriented Therapy"
 ],
 [
  "18/06/2024",
  "Process Oriented Therapy III",
  "Liudmila Serbina",
  "",
  2,
  "Process Oriented Therapy"
 ],
 [
  "25/06/2024",
  "Process Oriented Therapy IV",
  "Liudmila Serbina",
  "",
  2,
  "Process Oriented Therapy"
 ],
 [
  "02/07/2024",
  "Process Oriented Therapy V",
  "Liudmila Serbina",
  "",
  2,
  "Process Oriented Therapy"
 ],
 [
  "09/07/2024",
  "Gestalt work technique in a transpersonal view I",
  "Lilian Gscheidel",
  "",
  2,
  "Gestalt Therapy: Chair Work"
 ],
 [
  "16/07/2024",
  "Gestalt work technique in a transpersonal view II",
  "Lilian Gscheidel",
  "",
  2,
  "Gestalt Therapy: Chair Work"
 ],
 [
  "23/07/2024",
  "Tools of effective Psychotherapy",
  "Lyudmila Skartsesku",
  "",
  3,
  "Psychotherapeutic Approaches"
 ],
 [
  "13/08/2024",
  "«Creative Evolution 2.0». Ways to unlock higher Possibilities from Homo sapiens to Homo Evolutus",
  "Vladimir Maykov",
  "",
  3,
  "Creative Evolution 2.0"
 ],
 [
  "20/08/2024",
  "This mysterious Self: What is Self-Improvement? Three Catalysts and three main \"Tools of Evolution\", six Directions of Development",
  "Vladimir Maykov",
  "",
  3,
  "Creative Evolution 2.0"
 ],
 [
  "29/08/2024",
  "WE: Relationships as an evolutionary Practice. Interpersonal Development, its Laws and Essence",
  "Vladimir Maykov",
  "",
  3,
  "Creative Evolution 2.0"
 ],
 [
  "12/09/2024",
  "Laws and Tools for the Development of the external World — the Development of Objectivity, Consensus, a systematic multidimensional View",
  "Vladimir Maykov",
  "",
  3,
  "Creative Evolution 2.0"
 ],
 [
  "19/09/2024",
  "Champions: vertical upward Development. The West, multiple Intelligence, Spiral and Noetic Dynamics, a variety of Lines of Development towards the Highest",
  "Vladimir Maykov",
  "",
  3,
  "Creative Evolution 2.0"
 ],
 [
  "26/09/2024",
  "Healers: a Psychotherapist to himself. 12 ancient Practices of caring for the Soul. Cleansing and removing Obstacles to Development",
  "Vladimir Maykov",
  "",
  3,
  "Creative Evolution 2.0"
 ],
 [
  "03/10/2024",
  "Artists and Creators: Perfection in Discovering and expressing Yourself. Art as an evolutionary Practice",
  "Vladimir Maykov",
  "",
  3,
  "Creative Evolution 2.0"
 ],
 [
  "10/10/2024",
  "Tightrope Walkers: Masters of Balance, Mediocrity, Equanimity, the Art of surfing Life",
  "Vladimir Maykov",
  "",
  3,
  "Creative Evolution 2.0"
 ],
 [
  "17/10/2024",
  "Heroes: Heroism as the main Energy of Evolutionists. Three Classes and eight Types of Heroic Journeys and their Variations",
  "Vladimir Maykov",
  "",
  3,
  "Creative Evolution 2.0"
 ],
 [
  "24/10/2024",
  "The Awakened: What is Enlightenment: Classics and Modernity",
  "Vladimir Maykov",
  "",
  3,
  "Creative Evolution 2.0"
 ],
 [
  "29/10/2024",
  "Archetypes",
  "Kati Wortelkamp",
  "",
  4,
  "Archetypes"
 ],
 [
  "07/11/2024",
  "Biotransenergetics 1",
  "Pier Luigi Lattuada",
  "",
  4,
  "Biotransenergetics"
 ],
 [
  "11/11/2024",
  "Biotransenergetics 2",
  "Pier Luigi Lattuada",
  "",
  4,
  "Biotransenergetics"
 ],
 [
  "18/11/2024",
  "Biotransenergetics 3",
  "Pier Luigi Lattuada",
  "",
  4,
  "Biotransenergetics"
 ],
 [
  "25/11/2024",
  "Biotransenergetics 4",
  "Pier Luigi Lattuada",
  "",
  4,
  "Biotransenergetics"
 ],
 [
  "27/11/2024",
  "Film: \"The secret of Carlos Castaneda\"",
  "Vladimir Maykov",
  "",
  4,
  "Creative Evolution 2.0"
 ],
 [
  "05/12/2024",
  "Student's Meeting",
  "",
  "",
  4,
  "-"
 ],
 [
  "09/12/2024",
  "Biotransenergetics 5",
  "Pier Luigi Lattuada",
  "",
  4,
  "Biotransenergetics"
 ],
 [
  "16/12/2024",
  "Biotransenergetics 6",
  "Pier Luigi Lattuada",
  "",
  4,
  "Biotransenergetics"
 ],
 [
  "13/01/2025",
  "Biotransenergetics 7",
  "Pier Luigi Lattuada",
  "",
  4,
  "Biotransenergetics"
 ],
 [
  "20/01/2025",
  "Biotransenergetics 8",
  "Pier Luigi Lattuada",
  "",
  4,
  "Biotransenergetics"
 ],
 [
  "03/02/2025",
  "Biotransenergetics 9",
  "Pier Luigi Lattuada",
  "",
  4,
  "Biotransenergetics"
 ],
 [
  "10/02/2025",
  "Biotransenergetics 10",
  "Pier Luigi Lattuada",
  "",
  5,
  "Biotransenergetics"
 ],
 [
  "17/02/2025",
  "Biotransenergetics 11",
  "Pier Luigi Lattuada",
  "",
  5,
  "Biotransenergetics"
 ],
 [
  "24/02/2025",
  "Biotransenergetics 12",
  "Pier Luigi Lattuada",
  "",
  5,
  "Biotransenergetics"
 ],
 [
  "04/03/2025",
  "Hypnotherapy/ Working with the Inner Child, Supervision Part I",
  "Prof. Jure Biechonski",
  "",
  5,
  "Hypnotherapy and the Inner Child"
 ],
 [
  "11/03/2025",
  "Hypnotherapy/ Working with the Inner Child, Supervision Part II",
  "Prof. Jure Biechonski",
  "",
  5,
  "Hypnotherapy and the Inner Child"
 ],
 [
  "18/03/2025",
  "Hypnotherapy/ Working with the Inner Child, Supervision Part III",
  "Prof. Jure Biechonski",
  "",
  5,
  "Hypnotherapy and the Inner Child"
 ],
 [
  "01/04/2025",
  "Hypnotherapy/ Working with the Inner Child, Supervision Part IV",
  "Prof. Jure Biechonski",
  "",
  5,
  "Hypnotherapy and the Inner Child"
 ],
 [
  "08/04/2025",
  "About Meditation 1",
  "Dr. Tina Lindhard",
  "",
  5,
  "Meditation and Heart-Based Therapy (Arka Dhyana)"
 ],
 [
  "14/04/2025",
  "Hypnotherapy/ Working with the Inner Child, Supervision Part V",
  "Prof. Jure Biechonski",
  "",
  5,
  "Hypnotherapy and the Inner Child"
 ],
 [
  "29/04/2025",
  "Healing the Ego",
  "Bernadette Blin",
  "",
  5,
  "Foundations of Transpersonal Psychotherapy"
 ],
 [
  "06/05/2025",
  "Stan Grof – his life",
  "Kati Wortelkamp",
  "",
  5,
  "Stanislav Grof's Map of the Psyche"
 ],
 [
  "13/05/2025",
  "Strategic sessions in Psychotherapy I",
  "Lyudmila Skartsesku",
  "",
  6,
  "Transpersonal Counseling Skills and the Counseling Process"
 ],
 [
  "20/05/2025",
  "Strategic sessions in Psychotherapy II",
  "Lyudmila Skartsesku",
  "",
  6,
  "Transpersonal Counseling Skills and the Counseling Process"
 ],
 [
  "27/05/2025",
  "The constellation as a transpersonal and embodied externalisation/visual representation of a system within a physical space",
  "Erik Andersen",
  "Cathy Geils",
  6,
  "Family Constellations in the Group"
 ],
 [
  "03/06/2025",
  "Representative perception, the knowing field and systemic awareness",
  "Erik Andersen",
  "Cathy Geils",
  6,
  "Family Constellations in the Group"
 ],
 [
  "10/06/2025",
  "The orders of love",
  "Erik Andersen",
  "Cathy Geils",
  6,
  "Family Constellations in the Group"
 ],
 [
  "17/06/2025",
  "Healing sentences and movements",
  "Erik Andersen",
  "Cathy Geils",
  6,
  "Family Constellations in the Group"
 ],
 [
  "24/06/2025",
  "About Meditation 2",
  "Dr. Tina Lindhard",
  "",
  6,
  "Meditation and Heart-Based Therapy (Arka Dhyana)"
 ],
 [
  "08/07/2025",
  "Student's Meeting",
  "",
  "",
  6,
  "-"
 ],
 [
  "15/07/2025",
  "About Meditation 3",
  "Dr. Tina Lindhard",
  "",
  6,
  "Meditation and Heart-Based Therapy (Arka Dhyana)"
 ],
 [
  "12/08/2025",
  "About the breath",
  "Kati Wortelkamp",
  "",
  6,
  "Holotropic States of Consciousness and their Healing Potential"
 ],
 [
  "19/08/2025",
  "Stan Grof's expanded map of consciousness",
  "Kati Wortelkamp",
  "",
  6,
  "Stanislav Grof's Map of the Psyche"
 ],
 [
  "26/08/2025",
  "Stan Grof's Theory of the COEX-Systems",
  "Kati Wortelkamp",
  "",
  6,
  "Stanislav Grof's Map of the Psyche"
 ],
 [
  "02/09/2025",
  "Psychosynthesis I",
  "Charlotte Kihl",
  "",
  6,
  "Psychosynthesis"
 ],
 [
  "09/09/2025",
  "Psychosynthesis II",
  "Charlotte Kihl",
  "",
  6,
  "Psychosynthesis"
 ],
 [
  "23/09/2025",
  "Student's Meeting and Psychosynthesis III",
  "Charlotte Kihl",
  "",
  6,
  "Psychosynthesis"
 ],
 [
  "30/09/2025",
  "The 12 pillars of Transpersonal Psychotherapy",
  "Bernadette Blin",
  "",
  7,
  "Foundations of Transpersonal Psychotherapy"
 ],
 [
  "07/10/2025",
  "Collective Trauma",
  "Samvedam B. Randles",
  "",
  7,
  "Collective and Transgenerational Trauma"
 ],
 [
  "14/10/2025",
  "Spiritual Journey using heart based Meditation",
  "Dr. Tina Lindhard",
  "",
  7,
  "Meditation and Heart-Based Therapy (Arka Dhyana)"
 ],
 [
  "28/10/2025",
  "Therapy and Spiritual Journey",
  "Dr. Tina Lindhard",
  "",
  7,
  "Meditation and Heart-Based Therapy (Arka Dhyana)"
 ],
 [
  "04/11/2025",
  "Kundalini",
  "Dr. Tina Lindhard",
  "",
  7,
  "Meditation and Heart-Based Therapy (Arka Dhyana)"
 ],
 [
  "11/11/2025",
  "Perpetrator-victim structure from a transpersonal perspective",
  "Dr. Stefan Dressler",
  "",
  7,
  "Psychopathology from a Transpersonal Point of View"
 ],
 [
  "18/11/2025",
  "Transpersonal Psychology and Psychotherapy",
  "Gabriel Fernandez-Borsot, PhD",
  "",
  7,
  "Foundations of Transpersonal Psychotherapy"
 ],
 [
  "25/11/2025",
  "Regression Therapy as a Healing Tool I – with Practice",
  "Vera Covaliciuc",
  "",
  7,
  "Regression Therapy"
 ],
 [
  "02/12/2025",
  "Regression Therapy as a Healing Tool II – with Practice",
  "Vera Covaliciuc",
  "",
  7,
  "Regression Therapy"
 ],
 [
  "09/12/2025",
  "Regression Therapy as a Healing Tool III – with Practice",
  "Vera Covaliciuc",
  "",
  7,
  "Regression Therapy"
 ],
 [
  "16/12/2025",
  "Regression Therapy as a Healing Tool IV – with Practice",
  "Vera Covaliciuc",
  "",
  7,
  "Regression Therapy"
 ],
 [
  "10/03/2026",
  "Student's Meeting",
  "",
  "",
  8,
  "-"
 ],
 [
  "07/07/2026",
  "Student's Meeting",
  "",
  "",
  10,
  "-"
 ]
];

function addPastLecturesAndModules() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Lectures');
  var tz = Session.getScriptTimeZone();
  var h = headerMap_(sheet);
  var col = function (k) { return h[k] + 1; };
  var keyOf = function (d, title) {
    var ds = d instanceof Date ? Utilities.formatDate(d, tz, 'dd/MM/yyyy') : String(d || '').trim();
    return ds + '|' + String(title || '').trim();
  };

  // 1 — modules from the backup
  var restored = 0;
  var backup = ss.getSheetByName('Lectures' + RS_BACKUP_SUFFIX_);
  if (backup) {
    var bh = headerMap_(backup);
    var bv = backup.getDataRange().getValues();
    var moduleOf = {};
    for (var i = 1; i < bv.length; i++) {
      var mod = bv[i][bh['module']];
      if (mod !== '' && mod !== null) moduleOf[keyOf(bv[i][bh['date']], bv[i][bh['title']])] = Number(mod);
    }
    var last = sheet.getLastRow();
    if (last > 1) {
      var v = sheet.getRange(2, 1, last - 1, sheet.getLastColumn()).getValues();
      var mods = sheet.getRange(2, col('module'), last - 1, 1).getValues();
      for (var r = 0; r < v.length; r++) {
        if (mods[r][0] !== '' && mods[r][0] !== null) continue;
        var found = moduleOf[keyOf(v[r][h['date']], v[r][h['title']])];
        if (found) { mods[r][0] = found; restored++; }
      }
      sheet.getRange(2, col('module'), last - 1, 1).setValues(mods);
    }
  }

  // 2 — past lectures
  var existing = {};
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).getValues().forEach(function (row) {
      existing[keyOf(row[h['date']], row[h['title']])] = true;
    });
  }
  var width = sheet.getLastColumn();
  var toAdd = [];
  PAST_LECTURES_.forEach(function (l) {
    if (existing[l[0] + '|' + l[1]]) return;
    var p = l[0].split('/');
    var row = new Array(width).fill('');
    row[h['date']] = new Date(Number(p[2]), Number(p[1]) - 1, Number(p[0]));
    row[h['title']] = l[1];
    row[h['teacher 1']] = l[2];
    row[h['teacher 2']] = l[3];
    row[h['module']] = l[4];
    row[h['topic']] = l[5];
    toAdd.push(row);
  });
  if (toAdd.length) sheet.getRange(sheet.getLastRow() + 1, 1, toAdd.length, width).setValues(toAdd);

  // 3 — topics and teachers into the pools, then order by date
  var lists = ss.getSheetByName('Lists');
  var topics = lists.getRange(2, 4, Math.max(lists.getLastRow() - 1, 1), 1).getDisplayValues()
    .map(function (x) { return x[0]; }).filter(function (x) { return x; });
  var newTopics = [];
  PAST_LECTURES_.forEach(function (l) {
    if (topics.indexOf(l[5]) < 0 && newTopics.indexOf(l[5]) < 0) newTopics.push(l[5]);
  });
  var allTopics = topics.concat(newTopics).sort(function (a, b) { return a === '-' ? -1 : b === '-' ? 1 : a.localeCompare(b); });
  lists.getRange(2, 4, allTopics.length, 1).setValues(allTopics.map(function (x) { return [x]; }));

  var teachers = ss.getSheetByName('Teachers');
  var pool = teachers.getRange(2, 1, Math.max(teachers.getLastRow() - 1, 1), 1).getDisplayValues().map(function (x) { return x[0]; });
  var missing = [];
  PAST_LECTURES_.forEach(function (l) {
    [l[2], l[3]].forEach(function (n) { if (n && pool.indexOf(n) < 0 && missing.indexOf(n) < 0) missing.push(n); });
  });
  if (missing.length) teachers.getRange(teachers.getLastRow() + 1, 1, missing.length, 1).setValues(missing.map(function (x) { return [x]; }));

  var body = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn());
  body.sort({ column: col('date'), ascending: true });
  formatSheets();

  var semMsg = addPastSeminars_(ss);
  var msg = semMsg + '; ' + restored + ' modules restored, ' + toAdd.length + ' past lectures added, ' + newTopics.length + ' new topics in Lists' +
            (missing.length ? ', added to Teachers: ' + missing.join(', ') : '') + '.';
  Logger.log(msg);
  try { SpreadsheetApp.getUi().alert('Past lectures', msg, SpreadsheetApp.getUi().ButtonSet.OK); } catch (e) {}
}

/* ── Seminars from the old programmes ───────────────────────────────
   Two dates corrected against West_Program_25 (the Rainer Pervöltz
   intensive and the option weekend before it were in July, not June; their
   slugs follow, those pages were only ever on staging), and seven past
   seminars that were missing from the tab. "Mexico" joins the Venues tab. */

// [old slug, new date, new slug]
var PAST_SEMINAR_FIXES_ = [
 [
  "intensive-healing-the-inner-child-grof-breathwork-freiburg-todtmoos-2025-06-03",
  "03.07.2025 - 06.07.2025",
  "intensive-healing-the-inner-child-grof-breathwork-freiburg-todtmoos-2025-07-03"
 ],
 [
  "double-holotropic-breathwork-freiburg-todtmoos-2025-06-01",
  "01.07.2025 - 03.07.2025",
  "double-holotropic-breathwork-freiburg-todtmoos-2025-07-01"
 ]
];
// [date, title, facilitator 1, 2, 3, location, type1, type2, module, description, slug]
var PAST_SEMINARS_ = [
 [
  "18.05.2024",
  "Option: Holotropic Breathwork (Riga)",
  "Lyudmila Skartsesku",
  "",
  "",
  "Riga",
  "Holotropic Breathwork",
  "",
  "-",
  "A weekend built around one Holotropic Breathwork session, with participants alternating as breather and sitter. Accelerated breathing, evocative music and bodywork open access to non-ordinary states for healing, followed by mandala drawing and group sharing.",
  "holotropic-breathwork-riga-2024-05-18"
 ],
 [
  "02.05.2025 - 04.05.2025",
  "Option: Double Holotropic Breathwork (Riga)",
  "Lyudmila Skartsesku",
  "",
  "",
  "Riga",
  "Holotropic Breathwork",
  "",
  "-",
  "A weekend built around two Holotropic Breathwork sessions, with participants alternating as breather and sitter. Grof's method of accelerated breathing, music and bodywork opens access to non-ordinary states for healing, followed by mandala drawing and group sharing.",
  "double-holotropic-breathwork-riga-2025-05-02"
 ],
 [
  "08.08.2025 - 10.08.2025",
  "Option: Triple Holotropic Breathwork (Riga)",
  "Kati Wortelkamp",
  "",
  "",
  "Riga",
  "Holotropic Breathwork",
  "",
  "-",
  "An intensive weekend offering three Holotropic Breathwork sessions, with participants rotating through the roles of breather and sitter. Repeated breathwork allows deeper, more sustained access to non-ordinary states, with group sharing and mandala work after each session.",
  "triple-holotropic-breathwork-riga-2025-08-08"
 ],
 [
  "28.08.2025 - 31.08.2025",
  "Option: Double Holotropic Breathwork",
  "Kati Wortelkamp",
  "Ursula Boger",
  "",
  "Todtmoos",
  "Holotropic Breathwork",
  "",
  "-",
  "A weekend built around two Holotropic Breathwork sessions, with participants alternating as breather and sitter. Grof's method of accelerated breathing, music and bodywork opens access to non-ordinary states for healing, followed by mandala drawing and group sharing.",
  "double-holotropic-breathwork-freiburg-todtmoos-2025-08-28"
 ],
 [
  "21.10.2025 - 26.10.2025",
  "EUROTAS International Transpersonal Conference (Mexico)",
  "",
  "",
  "",
  "Mexico",
  "Conference",
  "",
  "-",
  "The 2025 EUROTAS International Transpersonal Conference in Mexico: a gathering of the international transpersonal community with keynotes, workshops and experiential sessions. No lectures took place in the training that week.",
  "eurotas-international-transpersonal-conference-mexico-2025-10-21"
 ],
 [
  "07.11.2025 - 09.11.2025",
  "Option: Double Holotropic Breathwork (Riga)",
  "Lyudmila Skartsesku",
  "",
  "",
  "Riga",
  "Holotropic Breathwork",
  "",
  "-",
  "A weekend built around two Holotropic Breathwork sessions, with participants alternating as breather and sitter. Grof's method of accelerated breathing, music and bodywork opens access to non-ordinary states for healing, followed by mandala drawing and group sharing.",
  "double-holotropic-breathwork-riga-2025-11-07"
 ],
 [
  "12.12.2025 - 14.12.2025",
  "Option: Grof® Breathwork (Todtmoos)",
  "Kati Wortelkamp",
  "",
  "",
  "Todtmoos",
  "Holotropic Breathwork",
  "",
  "-",
  "A weekend built around one Holotropic Breathwork session, with participants alternating as breather and sitter. Accelerated breathing, evocative music and bodywork open access to non-ordinary states for healing, followed by mandala drawing and group sharing.",
  "grof-breathwork-freiburg-todtmoos-2025-12-12"
 ]
];

function addPastSeminars_(ss) {
  var sheet = ss.getSheetByName('Seminars');
  var h = headerMap_(sheet);
  var venues = ss.getSheetByName('Venues');
  var known = venues.getRange(2, 1, Math.max(venues.getLastRow() - 1, 1), 1).getDisplayValues().map(function (x) { return x[0]; });
  if (known.indexOf('Mexico') < 0) {
    venues.getRange(venues.getLastRow() + 1, 1, 1, 8).setValues([['Mexico', '', '', '', 'Mexico', '', 'https://www.google.com/maps/search/?api=1&query=Mexico', '']]);
  }
  var last = sheet.getLastRow();
  var v = sheet.getRange(1, 1, last, sheet.getLastColumn()).getDisplayValues();
  var slugRow = {};
  for (var i = 1; i < v.length; i++) slugRow[String(v[i][h['slug']]).trim()] = i + 1;
  var fixed = 0, added = 0;
  PAST_SEMINAR_FIXES_.forEach(function (f) {
    var row = slugRow[f[0]];
    if (!row) return;
    sheet.getRange(row, h['date'] + 1).setValue(f[1]);
    sheet.getRange(row, h['slug'] + 1).setValue(f[2]);
    slugRow[f[2]] = row;
    fixed++;
  });
  var keys = ['date', 'title', 'facilitator 1', 'facilitator 2', 'facilitator 3', 'location', 'type1', 'type2', 'ewtt - module', 'description', 'slug'];
  var width = sheet.getLastColumn();
  var out = [];
  PAST_SEMINARS_.forEach(function (s) {
    if (slugRow[s[10]]) return;
    var row = new Array(width).fill('');
    keys.forEach(function (k, j) { if (k in h) row[h[k]] = s[j]; });
    out.push(row);
  });
  if (out.length) {
    var start = sheet.getLastRow() + 1;
    sheet.getRange(start, h['date'] + 1, out.length, 1).setNumberFormat('@');
    sheet.getRange(start, 1, out.length, width).setValues(out);
    added = out.length;
  }
  return fixed + ' seminar dates corrected, ' + added + ' past seminars added';
}
