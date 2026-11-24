// One place that turns the raw sheet rows into the things the site links
// between: a seminar with a stable URL, a venue and real teacher pages; a
// lecture topic grouping every session taught on it; a teacher with the
// seminars and lectures they gave.
//
// Everything here is pure and synchronous, so the same answers come out of
// the page templates (pagination), the listing pages (links) and the
// structured data — a seminar's URL is computed in exactly one place.

const teachersData = require('../src/_data/teachers.js');
const venues = require('../src/_data/venues.js');

// ── Text helpers ──────────────────────────────────────────────────────

function fold(str) {
  return String(str || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ß/g, 'ss')
    .toLowerCase();
}

function slugify(str) {
  return fold(str)
    .replace(/[®™©]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// "29.02.2024 - 03.03.2024" (sometimes "21-02.2025") → { start, end } ISO.
function isoRange(value) {
  const found = String(value || '').match(/\d{1,2}[.\-/]\d{1,2}[.\-/]\d{4}/g);
  if (!found) return null;
  const iso = found.map((d) => {
    const [day, month, year] = d.split(/[.\-/]/);
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  });
  const start = iso[0];
  let end = iso[iso.length - 1];
  if (end < start) end = start;
  return { start, end };
}

function humanDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

function humanRange(range) {
  if (!range) return '';
  if (range.start === range.end) return humanDate(range.start);
  const [y1, m1, d1] = range.start.split('-').map(Number);
  const [y2, m2, d2] = range.end.split('-').map(Number);
  if (y1 === y2 && m1 === m2) return `${d1}–${d2} ${MONTHS[m1 - 1]} ${y1}`;
  if (y1 === y2) return `${d1} ${MONTHS[m1 - 1]} – ${d2} ${MONTHS[m2 - 1]} ${y1}`;
  return `${humanDate(range.start)} – ${humanDate(range.end)}`;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

// ── Teachers ──────────────────────────────────────────────────────────
//
// The sheets write people however the person typing felt like: "Kati",
// "Stefan dresler", "Tina Lindhardt, PhD", "Prof. Jure Biechonski". A name is
// matched on the teacher's full name, their surname as a whole word, or one
// of the `aliases` in their Markdown file — never on a fragment, or "Hu"
// would match half the alphabet.

let teacherIndex = null;
function getTeacherIndex() {
  if (teacherIndex) return teacherIndex;
  const all = teachersData().all;
  teacherIndex = all.map((t) => {
    // "Steven Schmitz, PhD", "Dr. Tina Lindhard": match on the name itself,
    // without titles or credentials, or "phd" would pass for a surname.
    const bare = fold(t.name).split(',')[0].replace(/^(dr|prof)\.?\s+/, '').trim();
    const parts = bare.split(/\s+/);
    const surname = parts[parts.length - 1];
    const keys = [fold(t.name), bare, ...(t.aliases || []).map(fold)];
    if (surname.length >= 5) keys.push(surname);
    return { teacher: t, keys };
  });
  return teacherIndex;
}

function wordIn(haystack, needle) {
  const esc = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^a-z])${esc}([^a-z]|$)`).test(haystack);
}

function findTeacher(name) {
  const f = fold(name);
  if (!f.trim()) return null;
  for (const { teacher, keys } of getTeacherIndex()) {
    if (keys.some((k) => wordIn(f, k))) return teacher;
  }
  return null;
}

function teacherUrl(teacher) {
  return `/teachers/${teacher.id}/`;
}

// Names from the sheets that matched no teacher page, reported once at the
// end of the build (.eleventy.js) so a misspelling doesn't pass unseen.
const unmatched = new Set();
function unmatchedNames() {
  return [...unmatched].sort((a, b) => a.localeCompare(b));
}

// "Kati Wortelkamp, Mario Lorenzetti & Stephan Schillinger" → people.
// Text after a colon is a topic ("Jure Biechonski: “From Regression…”"),
// not a person.
function splitPeople(str) {
  const raw = String(str || '').split(':')[0];
  if (!raw.trim() || raw.trim() === '-') return [];
  return raw
    .split(/\s*(?:,|&|\+|;|\band\b|\/)\s*/i)
    .map((s) => s.trim())
    .filter((s) => s && !/^(phd|ph\.d\.|dr\.?|prof\.?|m\.a\.)$/i.test(s));
}

function people(str) {
  const seen = new Set();
  const out = [];
  for (const name of splitPeople(str)) {
    const teacher = findTeacher(name);
    if (teacher) {
      if (seen.has(teacher.id)) continue;
      seen.add(teacher.id);
      out.push({ name: teacher.name, teacher, url: teacherUrl(teacher) });
    } else {
      unmatched.add(name);
      out.push({ name, teacher: null, url: null });
    }
  }
  return out;
}

// ── Venues ────────────────────────────────────────────────────────────

function findVenue(event) {
  const hay = fold([event.venue, event.city, event.title].join(' '));
  for (const key of venues._order) {
    if (venues[key].match.some((m) => hay.includes(fold(m)))) return venues[key];
  }
  // Nothing in the row itself: fall back on the country, but only where the
  // school has one place there.
  const country = fold(event.location);
  if (country === 'germany') return venues.todtmoos;
  if (country === 'moldova') return venues.chisinau;
  if (country === 'latvia') return venues.riga;
  if (country === 'romania') return venues.bucharest;
  return null;
}

// ── Seminars ──────────────────────────────────────────────────────────

// "Option: Double Holotropic Breathwork (Todtmoos)" → "Double Holotropic
// Breathwork": the place goes into the URL from the venue, the "Option:"
// prefix is bookkeeping for students, not part of the name.
function cleanSeminarTitle(title) {
  return String(title || '')
    .replace(/^\(?option\)?\s*\d*\s*:?\s*/i, '')
    .replace(/\s*\([^)]*\)\s*$/, '')
    .replace(/[“”"]/g, '')
    .trim();
}

function seminarSlug(event, venue, range) {
  if (event.slug && event.slug.trim()) return slugify(event.slug);
  const title = slugify(cleanSeminarTitle(event.title) || 'seminar');
  const parts = [title];
  const city = slugify(event.city || (venue && venue.city) || event.location || '');
  // The place itself: "Haus am Mühlenbach, Todtmoos" reads better in a URL
  // as just "todtmoos".
  const place = slugify((venue && venue.place) || (event.venue ? event.venue.split(',').pop() : ''));
  const has = (w) => w && `-${parts.join('-')}-`.includes(`-${w}-`);
  if (city && !has(city)) parts.push(city);
  if (place && !has(place)) parts.push(place);
  parts.push(range ? range.start : slugify(event.date));
  return parts.filter(Boolean).join('-');
}

let seminarCache = null;
let seminarSource = null;

function seminars(events) {
  if (seminarCache && seminarSource === events) return seminarCache;
  const today = todayISO();
  const used = new Map();
  const list = (events || [])
    .filter((e) => (e.title || e.facilitator || '').trim())
    .map((e) => {
      const range = isoRange(e.date);
      const venue = findVenue(e);
      let slug = seminarSlug(e, venue, range);
      const n = (used.get(slug) || 0) + 1;
      used.set(slug, n);
      if (n > 1) slug = `${slug}-${n}`;
      const facilitators = people(e.facilitator);
      const title = (e.title || '').trim() || (facilitators[0] ? `Seminar with ${facilitators[0].name}` : 'Seminar');
      const city = (e.city || '').trim() || (venue && venue.city) || '';
      const placeName = (e.venue || '').trim() || (venue && venue.name ? (venue.name.includes(venue.place) ? `${venue.name}, ${venue.region}` : `${venue.name}, ${venue.place}`) : (venue && venue.place !== city ? venue.place : ''));
      return {
        ...e,
        raw: e,
        title,
        cleanTitle: cleanSeminarTitle(title) || title,
        slug,
        url: `/seminars/${slug}/`,
        range,
        dateText: range ? humanRange(range) : (e.date || '').trim(),
        isPast: range ? range.end < today : false,
        isConference: /conference/i.test(e.type1 || '') || /conference|symposium/i.test(title),
        isOption: /^\(?option/i.test(title),
        venueData: venue,
        city,
        placeName,
        country: e.location || (venue && venue.country) || '',
        mapsUrl: (e.maps || '').trim() || (venue && venue.maps) || '',
        arrivalUrl: (e.arrival || '').trim() || (venue && venue.arrivalAnchor ? `/venues/#${venue.arrivalAnchor}` : ''),
        facilitators,
        types: [e.type1, e.type2].map((t) => (t || '').trim()).filter(Boolean),
        moduleLabel: e.module && e.module !== '-' ? e.module : '',
      };
    })
    .map((s) => {
      s.placeLabel = placeLabel(s);
      s.peopleKeys = '|' + s.facilitators.map(personKey).join('|') + '|';
      s.year = s.range ? s.range.start.slice(0, 4) : ((String(s.date || '').match(/\b20\d{2}\b/) || [''])[0]);
      return s;
    });
  // Newest first reads as "what's on", and keeps the archive below it.
  list.sort((a, b) => (b.range ? b.range.start : '0').localeCompare(a.range ? a.range.start : '0'));
  seminarCache = list;
  seminarSource = events;
  return list;
}

// What the /schedule/ filters offer. People one by one rather than the
// sheet's "A & B" strings, places rather than countries: "Todtmoos" is what
// someone is looking for, not "Germany".
function placeLabel(s) {
  const v = s.venueData;
  if (v && v.key === 'monteverdi') return 'Tuscany (Monteverdi)';
  if (v && v.place) return v.place;
  return s.city || s.country || '';
}

function seminarFilters(events) {
  const list = seminars(events);
  const people = new Map();
  const places = new Set();
  const types = new Set();
  for (const s of list) {
    for (const p of s.facilitators) people.set(personKey(p), p.name);
    const place = placeLabel(s);
    if (place) places.add(place);
    s.types.forEach((t) => types.add(t));
  }
  const byName = (a, b) => a.localeCompare(b);
  return {
    people: [...people.entries()].map(([value, label]) => ({ value, label })).sort((a, b) => byName(a.label.replace(/^(dr\.|prof\.)\s*/i, ''), b.label.replace(/^(dr\.|prof\.)\s*/i, ''))),
    places: [...places].sort(byName),
    types: [...types].sort(byName),
  };
}

function personKey(p) {
  return p.teacher ? p.teacher.id : slugify(p.name);
}

// ── Lecture topics ────────────────────────────────────────────────────
//
// One page per topic, not per session: seven "Individual Constellations in
// the group" evenings are one subject taught seven times, and seven near-
// identical pages would compete with each other. Curated topics first (they
// gather titles that vary: "Supervison 5", "Practice and Supervision"…);
// anything else becomes its own topic named after its title with any
// trailing part number removed.

const TOPICS = [
  { slug: 'counseling-skills', title: 'Transpersonal Counseling Skills and the Counseling Process', match: /counsel/i },
  { slug: 'holotropic-states-of-consciousness', title: 'Holotropic States of Consciousness and their Healing Potential', match: /healing potential of holotropic|demonstration of the healing|setting and concept of holotropic/i },
  { slug: 'psychedelics-in-therapy', title: 'Psychedelics, Expanded States and Therapy', match: /psychedelic/i },
  { slug: 'gestalt-chair-work', title: 'Gestalt Therapy: Chair Work', match: /gestalt/i },
  { slug: 'family-constellations', title: 'Family Constellations in the Group', match: /constellation/i },
  { slug: 'strategy-of-holotropic-breathwork-sessions', title: 'Strategy of Holotropic Breathwork Sessions', match: /^strateg/i },
  { slug: 'practice-and-supervision', title: 'Practice and Supervision in Holotropic Breathwork', match: /supervi[sz]/i },
  { slug: 'integration', title: 'Integration of Non-Ordinary Experiences', match: /^integration/i },
  { slug: 'spiritual-emergency', title: 'Spiritual Emergency and Spiritual Crisis', match: /spiritual emergency|spiritual crisis|spiritual bypassing/i },
  { slug: 'perinatal-matrices-death-and-rebirth', title: 'Perinatal Experience, Death and Rebirth', match: /perinatal|death and rebirth|death of the ego/i },
  { slug: 'music-in-holotropic-breathwork', title: 'Music and Sound in Holotropic Breathwork', match: /music|sound affects/i },
  { slug: 'emotions-shame-fear-guilt', title: 'Emotions in Transpersonal Work: Shame, Fear and Guilt', match: /key feelings|shame/i },
  { slug: 'shamanism', title: 'Shamanism, Ritual and Shamanic Healing', match: /shaman/i },
  { slug: 'meditation-and-heart-based-therapy', title: 'Meditation and Heart-Based Therapy (Arka Dhyana)', match: /arka dhyana|meditat/i },
  { slug: 'ken-wilber-integral-theory', title: 'Ken Wilber and Integral Theory', match: /wilber/i },
  { slug: 'psychopathology-transpersonal-view', title: 'Psychopathology from a Transpersonal Point of View', match: /psychopatholog|borderline|bipolar/i },
  { slug: 'ethics-holotropic-states', title: 'Ethics in Work with Holotropic States', match: /ethic/i },
];

// Not subjects: organisational evenings, placeholders, exams.
const NOT_A_TOPIC = /student'?s'?’?s?\s+meeting|topic not specified|final test|follow-up|no lecture/i;

// The sheet's Topic column wins when it is filled: the same text groups
// sessions onto one page. A Topic equal to one of the titles above keeps that
// topic's URL; "-" keeps a session off every topic page. Empty → by title.
function topicFor(title, topicCell) {
  const chosen = String(topicCell || '').trim();
  if (chosen === '-') return null;
  if (chosen) {
    const known = TOPICS.find((x) => x.title.toLowerCase() === chosen.toLowerCase() || x.slug === slugify(chosen));
    return known || { slug: slugify(chosen), title: chosen };
  }
  const t = String(title || '').trim();
  if (!t || NOT_A_TOPIC.test(t)) return null;
  const curated = TOPICS.find((x) => x.match.test(t));
  if (curated) return curated;
  const base = t
    .replace(/[,.]?\s*(part\s+)?([ivx]+|\d+)\s*$/i, '')
    .replace(/[“”"]/g, '')
    .trim();
  return { slug: slugify(base), title: base };
}

function lectureRange(lecture) {
  return isoRange(lecture.date);
}

let topicCache = null;
let topicSource = null;

function lectureTopics(lectures) {
  if (topicCache && topicSource === lectures) return topicCache;
  const today = todayISO();
  const bySlug = new Map();
  for (const l of lectures || []) {
    const topic = topicFor(l.title, l.topic);
    if (!topic) continue;
    if (!bySlug.has(topic.slug)) {
      bySlug.set(topic.slug, { slug: topic.slug, title: topic.title, url: `/lectures/${topic.slug}/`, sessions: [] });
    }
    const range = lectureRange(l);
    bySlug.get(topic.slug).sessions.push({
      ...l,
      iso: range ? range.start : null,
      dateText: range ? humanDate(range.start) : 'Date to be defined',
      isPast: range ? range.start < today : false,
      teachers: [...people(l.teacher1), ...people(l.teacher2)],
    });
  }
  const topics = [...bySlug.values()].map((topic) => {
    topic.sessions.sort((a, b) => (a.iso || '9999').localeCompare(b.iso || '9999'));
    const teachers = [];
    const seen = new Set();
    for (const s of topic.sessions) {
      for (const p of s.teachers) {
        const key = p.teacher ? p.teacher.id : fold(p.name);
        if (seen.has(key)) continue;
        seen.add(key);
        teachers.push(p);
      }
    }
    // Distinct descriptions, in teaching order: the first explains the topic,
    // the rest say what the later sessions added.
    const descriptions = [];
    for (const s of topic.sessions) {
      const d = (s.description || '').trim();
      if (d && !/not been announced/i.test(d) && !descriptions.includes(d)) descriptions.push(d);
    }
    const dated = topic.sessions.filter((s) => s.iso);
    const titles = [...new Set(topic.sessions.map((s) => s.title.trim()))];
    return {
      ...topic,
      teachers,
      descriptions,
      titles,
      first: dated[0] ? dated[0].iso : null,
      last: dated.length ? dated[dated.length - 1].iso : null,
      upcoming: topic.sessions.filter((s) => s.iso && !s.isPast),
      modules: [...new Set(topic.sessions.map((s) => s.module).filter(Boolean))],
    };
  });
  topics.sort((a, b) => a.title.localeCompare(b.title));
  topicCache = topics;
  topicSource = lectures;
  return topics;
}

function lectureTopicUrl(lecture) {
  const topic = typeof lecture === 'string' ? topicFor(lecture) : topicFor(lecture && lecture.title, lecture && lecture.topic);
  return topic ? `/lectures/${topic.slug}/` : '';
}

// Rows for /lectures-schedule/: every session, newest first, with what the
// row shows already worked out (readable date, linked teachers, topic page).
let rowCache = null;
let rowSource = null;
function lectureRows(lectures) {
  if (rowCache && rowSource === lectures) return rowCache;
  const today = todayISO();
  const rows = (lectures || []).map((l) => {
    const range = lectureRange(l);
    const teachers = [...people(l.teacher1), ...people(l.teacher2)];
    const year = range ? range.start.slice(0, 4) : ((String(l.date || '').match(/\b20\d{2}\b/) || [''])[0]);
    return {
      ...l,
      iso: range ? range.start : null,
      dateText: range ? humanDate(range.start) : (l.date || ''),
      isPast: range ? range.start < today : false,
      teachers,
      peopleKeys: '|' + teachers.map(personKey).join('|') + '|',
      topicUrl: lectureTopicUrl(l),
      year,
    };
  });
  rows.sort((a, b) => (b.iso || '0').localeCompare(a.iso || '0'));
  rowCache = rows;
  rowSource = lectures;
  return rows;
}

function lectureFilterPeople(lectures) {
  const map = new Map();
  for (const r of lectureRows(lectures)) for (const p of r.teachers) map.set(personKey(p), p.name);
  const bare = (n) => n.replace(/^(dr\.|prof\.)\s*/i, '');
  return [...map.entries()].map(([value, label]) => ({ value, label })).sort((a, b) => bare(a.label).localeCompare(bare(b.label)));
}

// ── Per-teacher views ─────────────────────────────────────────────────

function seminarsFor(teacherId, events) {
  return seminars(events).filter((s) => s.facilitators.some((p) => p.teacher && p.teacher.id === teacherId));
}

function topicsFor(teacherId, lectures) {
  return lectureTopics(lectures).filter((t) => t.teachers.some((p) => p.teacher && p.teacher.id === teacherId));
}

module.exports = {
  slugify,
  isoRange,
  humanRange,
  humanDate,
  people,
  findTeacher,
  teacherUrl,
  seminars,
  seminarFilters,
  unmatchedNames,
  lectureTopics,
  lectureTopicUrl,
  topicFor,
  lectureRows,
  lectureFilterPeople,
  seminarsFor,
  topicsFor,
  venues,
};
