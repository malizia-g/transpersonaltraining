/* ═══════════════════════════════════════════════════════════════════
   LECTURE TOPICS — fill the Topic column
   ═══════════════════════════════════════════════════════════════════
   Menu: 🚀 Automations → 🏷️ Fill empty lecture topics.

   The Topic column of the Lectures tab decides which page of the website
   (/lectures/<topic>/) a session belongs to: sessions with the same Topic
   share one page. Write "-" to keep a session off every topic page
   (students' meetings, tests). An empty Topic lets the website guess from
   the title.

   This fills only EMPTY Topic cells, from the grouping the website used
   until now (keyed by title), so it never overwrites a choice made by hand.
   Run it again after adding lectures whose title is already known here;
   for a new title just type the Topic yourself.
   ═══════════════════════════════════════════════════════════════════ */

var LECTURE_TOPICS_BY_TITLE_ = {
 "Healing Potential of Holotropic States of Consciousness": "Holotropic States of Consciousness and their Healing Potential",
 "The Healing Process and Counseling Skills": "Transpersonal Counseling Skills and the Counseling Process",
 "Main Stages of the Counseling Process. Practice 1": "Transpersonal Counseling Skills and the Counseling Process",
 "Two Stages of Counseling. Practice 2": "Transpersonal Counseling Skills and the Counseling Process",
 "Holotropic Breathwork and the work with Psychedelics": "Psychedelics, Expanded States and Therapy",
 "Forbidden Wisdom: Psychedelics as a Source of spiritual Experience": "Psychedelics, Expanded States and Therapy",
 "Introduction and Dangers for Beginners in Using Psychedelics": "Psychedelics, Expanded States and Therapy",
 "Psychedelics in Recreation and therapeutic Settings": "Psychedelics, Expanded States and Therapy",
 "Psychedelic Experiences and Expanded States of Consciousness in Therapeutic Context I": "Psychedelics, Expanded States and Therapy",
 "Psychedelic Experiences and Expanded States of Consciousness in Therapeutic Context II": "Psychedelics, Expanded States and Therapy",
 "Love in the context of Psychotherapy": "Love in the context of Psychotherapy",
 "Demonstration of the Healing Process": "Holotropic States of Consciousness and their Healing Potential",
 "The Alchemy of Trauma: Forging Transpersonal Gold from Life's Deepest Wounds": "The Alchemy of Trauma: Forging Transpersonal Gold from Life's Deepest Wounds",
 "Gestalt Work with Chair I": "Gestalt Therapy: Chair Work",
 "Gestalt Work with Chair II": "Gestalt Therapy: Chair Work",
 "Gestalt Work with Chair III": "Gestalt Therapy: Chair Work",
 "Gestalt Work with Chair IV": "Gestalt Therapy: Chair Work",
 "Gestalt Work with Chair V": "Gestalt Therapy: Chair Work",
 "Gestalt Work with Chair VI": "Gestalt Therapy: Chair Work",
 "Music in Holotropic Breathwork": "Music and Sound in Holotropic Breathwork",
 "Individual Constellations in the group": "Family Constellations in the Group",
 "Setting and concept of Holotropic Breathwork": "Holotropic States of Consciousness and their Healing Potential",
 "(Topic not specified)": "-",
 "Strategy of Holotropic Sessions 1": "Strategy of Holotropic Breathwork Sessions",
 "Strategy of Holotropic Sessions 2": "Strategy of Holotropic Breathwork Sessions",
 "Supervision": "Practice and Supervision in Holotropic Breathwork",
 "Spiritual Bypassing": "Spiritual Emergency and Spiritual Crisis",
 "The dream of happiness. Waking up, the Perinatal and more…": "Perinatal Experience, Death and Rebirth",
 "Integration": "Integration of Non-Ordinary Experiences",
 "Practice and Supervision": "Practice and Supervision in Holotropic Breathwork",
 "Transpersonal aspects of emotions in general and shame in particular": "Emotions in Transpersonal Work: Shame, Fear and Guilt",
 "Spiritual Emergency I": "Spiritual Emergency and Spiritual Crisis",
 "Spiritual Emergency II": "Spiritual Emergency and Spiritual Crisis",
 "Ethics in the work with Holotropic states of consciousness": "Ethics in Work with Holotropic States",
 "Strategy of Holotropic Sessions": "Strategy of Holotropic Breathwork Sessions",
 "Rituals, Shamanic Healing, and Community": "Shamanism, Ritual and Shamanic Healing",
 "Perinatal Experience and its impact on personality development, Part II": "Perinatal Experience, Death and Rebirth",
 "Transpersonal approach to borderline. Transference and projections": "Psychopathology from a Transpersonal Point of View",
 "Key feelings in working with patients and participants: Shame": "Emotions in Transpersonal Work: Shame, Fear and Guilt",
 "Key feelings in working with patients and participants: Fear": "Emotions in Transpersonal Work: Shame, Fear and Guilt",
 "Key feelings in working with patients and participants: Guilt": "Emotions in Transpersonal Work: Shame, Fear and Guilt",
 "Spiritual crisis or psychic disorder? How to deal with it": "Spiritual Emergency and Spiritual Crisis",
 "How sound affects the brain / Music in Holotropic Breathwork I": "Music and Sound in Holotropic Breathwork",
 "How sound affects the brain / Music in Holotropic Breathwork II": "Music and Sound in Holotropic Breathwork",
 "How to Integrate Shamanism in your Everyday Life": "Shamanism, Ritual and Shamanic Healing",
 "Student's Meeting": "-",
 "Psychopathology in Grof's Point of View": "Psychopathology from a Transpersonal Point of View",
 "Why we meditate": "Meditation and Heart-Based Therapy (Arka Dhyana)",
 "Arka Dhyana method I and heart based emotional therapy": "Meditation and Heart-Based Therapy (Arka Dhyana)",
 "Arka Dhyana method II and heart based therapy": "Meditation and Heart-Based Therapy (Arka Dhyana)",
 "Arka Dhyana method III and heart based therapy": "Meditation and Heart-Based Therapy (Arka Dhyana)",
 "Arka Dhyana method IV and heart based therapy": "Meditation and Heart-Based Therapy (Arka Dhyana)",
 "Student's Meeting / Ethics in Holotropic Breathwork": "Ethics in Work with Holotropic States",
 "Student's Meeting (optional)": "-",
 "Follow-up to Tina Lindhard's seminar": "-",
 "Final test online weekend (11–12 September): Hero’s Journey presentation, Counseling Skills test": "-"
};

function fillLectureTopics() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Lectures');
  var lastCol = sheet.getLastColumn();
  var headers = sheet.getRange(1, 1, 1, lastCol).getDisplayValues()[0].map(function (h) { return h.toString().trim().toLowerCase(); });
  var titleCol = headers.indexOf('title') + 1;
  var topicCol = headers.indexOf('topic') + 1;
  if (!topicCol) {
    topicCol = lastCol + 1;
    sheet.getRange(1, topicCol).setValue('Topic').setFontWeight('bold');
  }
  var rows = sheet.getLastRow() - 1;
  if (rows < 1) return;
  var titles = sheet.getRange(2, titleCol, rows, 1).getDisplayValues();
  var topicRange = sheet.getRange(2, topicCol, rows, 1);
  var topics = topicRange.getDisplayValues();
  var filled = 0, unknown = [];
  for (var i = 0; i < rows; i++) {
    var title = titles[i][0].trim();
    if (!title || topics[i][0].trim()) continue;
    var t = LECTURE_TOPICS_BY_TITLE_[title];
    if (t) { topics[i][0] = t; filled++; } else if (unknown.indexOf(title) < 0) { unknown.push(title); }
  }
  topicRange.setValues(topics);
  var msg = filled + ' Topic cells filled.' + (unknown.length ? '\n\nNo topic known for (fill by hand):\n- ' + unknown.join('\n- ') : '');
  Logger.log(msg);
  try { SpreadsheetApp.getUi().alert('Lecture topics', msg, SpreadsheetApp.getUi().ButtonSet.OK); } catch (e) {}
}
