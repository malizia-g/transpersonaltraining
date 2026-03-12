const getLectureEvents = require('./lectureEvents');

module.exports = async function() {
  const events = await getLectureEvents();

  const modulesSet = new Set();
  const teachersSet = new Set();

  events.forEach((event) => {
    if (event.module) modulesSet.add(event.module);
    if (event.teacher1) teachersSet.add(event.teacher1);
    if (event.teacher2) teachersSet.add(event.teacher2);
  });

  return {
    modules: Array.from(modulesSet).sort((a, b) => parseInt(a) - parseInt(b)),
    teachers: Array.from(teachersSet).sort((a, b) => a.localeCompare(b))
  };
};
