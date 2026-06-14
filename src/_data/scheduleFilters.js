const getScheduleEvents = require('./scheduleEvents');

function extractYear(dateString) {
  if (!dateString) return null;

  const firstDate = dateString.split('-')[0].trim();
  const parts = firstDate.split('.');

  if (parts.length === 3) {
    const year = parseInt(parts[2], 10);
    return Number.isNaN(year) ? null : year;
  }

  return null;
}

module.exports = async function() {
  const events = await getScheduleEvents();

  const typesSet = new Set();
  const facilitatorsSet = new Set();
  const locationsSet = new Set();
  const yearsSet = new Set();

  events.forEach((event) => {
    const type1 = (event.type1 || '').trim();
    const type2 = (event.type2 || '').trim();
    const facilitator = (event.facilitator || '').trim();
    const location = (event.location || '').trim();

    if (type1) typesSet.add(type1);
    if (type2) typesSet.add(type2);
    if (facilitator) facilitatorsSet.add(facilitator);
    if (location) locationsSet.add(location);

    const year = extractYear(event.date);
    if (year) yearsSet.add(year);
  });

  return {
    types: Array.from(typesSet).sort((a, b) => a.localeCompare(b)),
    facilitators: Array.from(facilitatorsSet).sort((a, b) => a.localeCompare(b)),
    locations: Array.from(locationsSet).sort((a, b) => a.localeCompare(b)),
    years: Array.from(yearsSet).sort((a, b) => b - a)
  };
};