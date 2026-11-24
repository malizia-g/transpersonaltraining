// One page per lecture *topic* at /lectures/<topic>/, gathering every session
// taught on it (Gestalt Chair Work I–VI, seven Constellations evenings…).
// One rich page per subject rather than one thin page per evening: the
// grouping lives in lib/site-model.js (TOPICS).
const { lectureTopics } = require('../../lib/site-model');
const SITE = 'https://transpersonal-training.com';

function clip(text, max) {
  text = String(text || '').replace(/\s+/g, ' ').trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:.]$/, '') + '…';
}

module.exports = {
  layout: 'base.njk',
  pagination: {
    data: 'lectureEvents',
    size: 1,
    alias: 'topic',
    before: (lectures) => lectureTopics(lectures),
    addAllPagesToCollections: true,
  },
  breadcrumbParent: { name: 'Lecture topics', url: '/lectures/' },
  eleventyComputed: {
    crumbName: (data) => data.topic.title,
    permalink: (data) => data.topic.url,
    title: (data) => `${data.topic.title} — Online Lectures in Transpersonal Psychotherapy`,
    description: (data) => clip(data.topic.descriptions[0] || `${data.topic.title}: online lectures in the Transpersonal Training programme.`, 158),
    structuredData: (data) => {
      const t = data.topic;
      const url = SITE + t.url;
      const instructors = t.teachers.map((p) => (p.teacher
        ? { '@type': 'Person', name: p.name, url: SITE + p.url }
        : { '@type': 'Person', name: p.name }));
      const course = {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: t.title,
        url,
        description: t.descriptions[0] || t.title,
        inLanguage: 'en',
        provider: { '@type': 'EducationalOrganization', name: 'Transpersonal Training', url: SITE },
        isPartOf: { '@type': 'Course', name: 'Transpersonal Psychotherapy & Holotropic Breathing Training', url: SITE + '/training-overview/' },
      };
      if (instructors.length) course.instructor = instructors;
      const instances = t.sessions.filter((s) => s.iso).map((s) => {
        const ci = { '@type': 'CourseInstance', name: s.title, courseMode: 'online', startDate: s.iso, endDate: s.iso };
        const who = s.teachers.map((p) => ({ '@type': 'Person', name: p.name }));
        if (who.length) ci.instructor = who;
        return ci;
      });
      if (instances.length) course.hasCourseInstance = instances;
      return course;
    },
  },
};
