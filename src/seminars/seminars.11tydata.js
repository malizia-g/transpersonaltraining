// One page per seminar at /seminars/<title>-<city>-<place>-<date>/, built
// from the Seminars sheet. The URL comes from the sheet's Slug column when it
// is filled (so a corrected title never breaks a link), otherwise from
// lib/site-model.js — the same function the /schedule/ cards link through.
const { seminars } = require('../../lib/site-model');
const SITE = 'https://transpersonal-training.com';

function clip(text, max) {
  text = String(text || '').replace(/\s+/g, ' ').trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:.]$/, '') + '…';
}

function where(s) {
  return [s.venueData && s.venueData.place, s.city, s.country].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).join(', ');
}

module.exports = {
  layout: 'base.njk',
  pagination: {
    data: 'scheduleEvents',
    size: 1,
    alias: 'seminar',
    before: (events) => seminars(events),
    addAllPagesToCollections: true,
  },
  breadcrumbParent: { name: 'Intensive Schedule', url: '/schedule/' },
  eleventyComputed: {
    crumbName: (data) => data.seminar.cleanTitle + (data.seminar.range ? ` (${data.seminar.range.start.slice(0, 4)})` : ''),
    permalink: (data) => data.seminar.url,
    title: (data) => {
      const s = data.seminar;
      return [s.cleanTitle, where(s), s.range ? s.range.start.slice(0, 4) : ''].filter(Boolean).join(' · ');
    },
    description: (data) => {
      const s = data.seminar;
      const lead = `${s.cleanTitle} in ${where(s) || s.country}, ${s.dateText}${s.facilitators.length ? ', with ' + s.facilitators.map((p) => p.name).join(', ') : ''}. `;
      return clip(lead + (s.description || ''), 158);
    },
    image: (data) => (data.seminar.venueData && data.seminar.venueData.hero ? data.seminar.venueData.hero + '.jpg' : undefined),
    structuredData: (data) => {
      const s = data.seminar;
      if (!s.range) return null;
      const v = s.venueData;
      const place = { '@type': 'Place', name: s.placeName || s.city || s.country };
      const address = { '@type': 'PostalAddress' };
      if (v && v.address) {
        address.streetAddress = v.address.street;
        address.postalCode = v.address.postalCode;
        address.addressLocality = v.address.locality;
      } else if (s.city) {
        address.addressLocality = s.city;
      }
      if (v && v.region) address.addressRegion = v.region;
      address.addressCountry = (v && v.countryCode) || s.country;
      place.address = address;
      if (s.mapsUrl) place.hasMap = s.mapsUrl;
      const event = {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: s.cleanTitle,
        url: SITE + s.url,
        startDate: s.range.start,
        endDate: s.range.end,
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        eventStatus: 'https://schema.org/EventScheduled',
        location: place,
      };
      if (s.description) event.description = s.description;
      if (v && v.hero) event.image = SITE + v.hero + '.jpg';
      const performers = s.facilitators.map((p) => (p.teacher
        ? { '@type': 'Person', name: p.name, url: SITE + p.url }
        : { '@type': 'Person', name: p.name }));
      if (performers.length) event.performer = performers;
      // Conferences are run by EUROTAS, not by us: listed so students know
      // about them, but we don't claim to organise them.
      if (!s.isConference) {
        event.organizer = { '@type': 'EducationalOrganization', name: 'Transpersonal Training', url: SITE };
      }
      return event;
    },
  },
};
