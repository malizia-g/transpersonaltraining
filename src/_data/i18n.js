// Interface strings shared by every page (layout, menu, footer, structured
// data). Page text lives in the pages themselves and in src/content/<lang>/.
//
// To add a language: copy the `ru` block, translate it, and add a folder
// src/<lang>/ with a <lang>.11tydata.js like src/ru/ru.11tydata.js.

module.exports = {
  en: {
    name: 'English',
    short: 'EN',
    ogLocale: 'en_GB',
    loading: 'Loading...',
    home: 'Home',
    requestDemo: 'Request a Demo',
    switchTo: 'Русская версия',
    englishOnly: 'in English',
    footer: {
      tagline: 'Educating therapists for a revolution of consciousness through transpersonal psychotherapy and breathwork.',
      training: 'Training',
      resources: 'Resources',
      connect: 'Connect',
      contactUs: 'Contact Us',
      westOffice: 'West office',
      eastOffice: 'East office',
      privacy: 'Privacy Policy',
      privacyShort: 'Privacy',
      legalNotice: 'Legal Notice',
      copyright: 'Educating therapists for a revolution of consciousness.',
      close: 'Close',
    },
    schema: {
      orgDescription: 'Professional transpersonal psychotherapy and breathwork training. EUROTAS-accredited online programme, one international East–West cohort, with in-person intensives in Europe.',
      courseName: 'Transpersonal Psychotherapy & Holotropic Breathing Training',
      courseDescription: 'A four-year, EUROTAS-accredited training in Transpersonal Psychotherapy, Counselling and Holotropic Breathing, delivered online to one international East–West cohort, with in-person intensives held in Europe.',
      credential: 'Certificate as Transpersonal Psychotherapy & Breathwork Facilitator (EUROTAS-accredited), with an optional EUROTAS certification track',
      occupation: 'Transpersonal Psychotherapy & Breathwork Facilitator',
      teaches: ['Transpersonal Psychology', 'Holotropic Breathing', 'Counselling Skills', 'Psychotherapy'],
      westTrack: 'Western track',
      eastTrack: 'Eastern track',
    },
  },

  ru: {
    name: 'Русский',
    short: 'RU',
    ogLocale: 'ru_RU',
    loading: 'Загрузка...',
    home: 'Главная',
    requestDemo: 'Получить демо-урок',
    switchTo: 'English version',
    englishOnly: 'на английском',
    footer: {
      tagline: 'Готовим терапевтов для революции сознания: трансперсональная психотерапия и холотропное дыхание.',
      training: 'Обучение',
      resources: 'Материалы',
      connect: 'Контакты',
      contactUs: 'Связаться с нами',
      westOffice: 'Западный офис',
      eastOffice: 'Восточный офис',
      privacy: 'Политика конфиденциальности',
      privacyShort: 'Конфиденциальность',
      legalNotice: 'Правовая информация',
      copyright: 'Готовим терапевтов для революции сознания.',
      close: 'Закрыть',
    },
    schema: {
      orgDescription: 'Профессиональное обучение трансперсональной психотерапии и холотропному дыханию. Онлайн-программа, аккредитованная EUROTAS, единая международная группа «Восток — Запад» и очные интенсивы в Европе.',
      courseName: 'Обучение трансперсональной психотерапии и холотропному дыханию',
      courseDescription: 'Четырёхлетняя программа обучения трансперсональной психотерапии, психологическому консультированию и холотропному дыханию, аккредитованная EUROTAS: онлайн-лекции для единой международной группы «Восток — Запад» и очные интенсивы в Европе (для Восточного направления — на русском языке).',
      credential: 'Сертификат трансперсонального психотерапевта и фасилитатора дыхательных практик (аккредитация EUROTAS), с возможностью сертификации EUROTAS',
      occupation: 'Трансперсональный психотерапевт и фасилитатор холотропного дыхания',
      teaches: ['Трансперсональная психология', 'Холотропное дыхание', 'Психологическое консультирование', 'Психотерапия'],
      westTrack: 'Западное направление',
      eastTrack: 'Восточное направление',
    },
  },
};
