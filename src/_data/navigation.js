// The site menu, shared by the desktop dropdowns and the mobile menu.
//
// `url` is always the ENGLISH page. In another language the template swaps in
// the translation when one exists (the `localeUrl` filter) and otherwise keeps
// the English page, marked with a small "EN" so nobody is surprised by it.
//
// Apply is hidden until the page is ready → docs/TODO.md task 63. To restore
// it, put this back as the first entry of `resources`:
//   { url: '/apply/', icon: 'clipboard-check', label: { en: 'Apply', ru: 'Подать заявку' } },

const navigation = {
  training: {
    label: { en: 'Training', ru: 'Обучение' },
    items: [
      { url: '/training-overview/', icon: 'compass', label: { en: 'Training Overview', ru: 'О программе обучения' } },
      { url: '/curriculum/', icon: 'book-open', label: { en: 'Curriculum', ru: 'Учебный план' } },
      { url: '/teachers/', icon: 'users', label: { en: 'Our Teachers', ru: 'Преподаватели' } },
      { url: '/schedule/', icon: 'calendar', label: { en: 'Intensive Schedule', ru: 'Расписание интенсивов' } },
      { url: '/venues/', icon: 'map-pin', label: { en: 'Venues', ru: 'Места проведения' } },
      { url: '/lectures-schedule/', icon: 'presentation', label: { en: 'Lectures Schedule', ru: 'Расписание лекций' } },
    ],
  },
  resources: {
    label: { en: 'Resources', ru: 'Материалы' },
    items: [
      { url: '/what-is-transpersonal-psychology/', icon: 'stethoscope', label: { en: 'What is Transpersonal Psychology', ru: 'Что такое трансперсональная психология' } },
      { url: '/become-a-practice-client/', icon: 'user-check', label: { en: 'Become a Practice Client', ru: 'Стать клиентом для практики' } },
      { url: '/techniques/', icon: 'activity', label: { en: 'School Pillars', ru: 'Холотропное дыхание и методы' } },
      { url: '/resources/', icon: 'book-marked', label: { en: 'Recommended Reading', ru: 'Рекомендуемая литература' } },
      { url: '/collaborations/', icon: 'handshake', label: { en: 'Collaborations', ru: 'Сотрудничество' } },
      { url: 'https://student.transpersonal-training.com/', external: true, icon: 'graduation-cap', label: { en: 'Learning platform', ru: 'Учебная платформа' } },
      { url: 'https://old.transpersonal-training.com/', external: true, icon: 'archive', label: { en: 'Old website', ru: 'Старый сайт' } },
    ],
  },
  blog: { url: '/blog/', label: { en: 'Blog', ru: 'Блог' } },
};

// Every label above, keyed by URL — for the footer, which lists the same pages
// in a different arrangement: navigation.labels['/curriculum/'][lang].
navigation.labels = {};
for (const group of [navigation.training, navigation.resources]) {
  for (const item of group.items) navigation.labels[item.url] = item.label;
}
navigation.labels[navigation.blog.url] = navigation.blog.label;

module.exports = navigation;
