// One page per teacher at /teachers/<id>/. The /teachers/ overview links to
// these; the old WordPress bio URLs (/kati-wortelkamp/ …) 301 straight here
// (src/.htaccess §2), so each name has its own indexable page again.
const SITE = 'https://transpersonal-training.com';

function plain(md) {
  return String(md || '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_#>`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function clip(text, max) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:.]$/, '') + '…';
}

module.exports = {
  layout: 'base.njk',
  pagination: {
    data: 'teachers.all',
    size: 1,
    alias: 'teacher',
    addAllPagesToCollections: true,
  },
  breadcrumbParent: { name: 'Our Teachers', url: '/teachers/' },
  eleventyComputed: {
    crumbName: (data) => data.teacher.name,
    permalink: (data) => `/teachers/${data.teacher.id}/`,
    title: (data) => `${data.teacher.name} — ${data.teacher.section === 'core' ? 'Transpersonal Psychotherapy Teacher' : data.teacher.section === 'guest' ? 'Guest Teacher, Transpersonal Training' : 'Transpersonal Training Faculty'}`,
    description: (data) => clip(plain(data.teacher.bio) || `${data.teacher.name}, ${data.teacher.credentials || data.teacher.role}.`, 158),
    image: (data) => data.teacher.image,
    structuredData: (data) => {
      const t = data.teacher;
      const url = `${SITE}/teachers/${t.id}/`;
      const person = {
        '@type': 'Person',
        '@id': `${url}#person`,
        url,
        name: t.name,
        mainEntityOfPage: url,
      };
      if (t.role) person.jobTitle = t.role;
      if (t.credentials) person.description = t.credentials;
      if (t.image) person.image = SITE + t.image;
      if (t.location) person.homeLocation = { '@type': 'Place', name: t.location };
      if (t.website) person.sameAs = [t.website];
      person.affiliation = { '@type': 'EducationalOrganization', name: 'Transpersonal Training', url: SITE };
      return {
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        url,
        mainEntity: person,
      };
    },
  },
};
