// Data for the Recommended Reading & Watching page (/resources/).
//
// HOW TO EDIT (no template changes needed):
//   • Add a book  → append an object to `reading` with a `category`, `title`,
//     `author` and (optionally) `note` and `url`. Books are grouped on the page
//     by `category`, in the order the categories first appear in this array.
//   • Add a video → append an object to `videos` with `title`, `source`,
//     `note` and a `url`. Leave `url` empty ('') to show a "Link coming" chip
//     instead of a Watch button.
//
// This is a STARTER selection of widely-recognised transpersonal classics,
// meant to be refreshed. Video links are being migrated from the old
// /information/ page — paste the real URLs into the `url` fields below.

module.exports = function () {
  const reading = [
    // Foundations of Transpersonal Psychology
    { category: 'Foundations of Transpersonal Psychology', title: 'Paths Beyond Ego: The Transpersonal Vision', author: 'Roger Walsh & Frances Vaughan (eds.)', note: 'A broad, accessible map of the whole field — a good first book.' },
    { category: 'Foundations of Transpersonal Psychology', title: 'The Farther Reaches of Human Nature', author: 'Abraham Maslow', note: 'Where humanistic psychology opens into the transpersonal.' },
    { category: 'Foundations of Transpersonal Psychology', title: 'Psychosynthesis', author: 'Roberto Assagioli' },

    // Holotropic States & Breathwork
    { category: 'Holotropic States & Breathwork', title: 'The Holotropic Mind', author: 'Stanislav Grof' },
    { category: 'Holotropic States & Breathwork', title: 'Psychology of the Future', author: 'Stanislav Grof', note: 'Grof’s overview of his life’s work and the cartography of the psyche.' },
    { category: 'Holotropic States & Breathwork', title: 'Holotropic Breathwork: A New Approach to Self-Exploration and Therapy', author: 'Stanislav & Christina Grof' },

    // Depth & Archetypal Psychology
    { category: 'Depth & Archetypal Psychology', title: 'Memories, Dreams, Reflections', author: 'C. G. Jung' },
    { category: 'Depth & Archetypal Psychology', title: 'Re-Visioning Psychology', author: 'James Hillman' },

    // Myth & the Hero’s Journey
    { category: 'Myth & the Hero’s Journey', title: 'The Hero with a Thousand Faces', author: 'Joseph Campbell', note: 'The classic account of the monomyth behind our own “Hero’s Journey” work.' },
    { category: 'Myth & the Hero’s Journey', title: 'The Power of Myth', author: 'Joseph Campbell & Bill Moyers' },

    // Consciousness & Integral Theory
    { category: 'Consciousness & Integral Theory', title: 'The Spectrum of Consciousness', author: 'Ken Wilber' },
    { category: 'Consciousness & Integral Theory', title: 'Integral Psychology', author: 'Ken Wilber' },

    // Shamanism & Non-Ordinary States
    { category: 'Shamanism & Non-Ordinary States', title: 'The Way of the Shaman', author: 'Michael Harner' },
    { category: 'Shamanism & Non-Ordinary States', title: 'LSD Psychotherapy', author: 'Stanislav Grof' },

    // Spiritual Emergency & Emergence
    { category: 'Spiritual Emergency & Emergence', title: 'Spiritual Emergency: When Personal Transformation Becomes a Crisis', author: 'Stanislav & Christina Grof (eds.)', note: 'Essential on distinguishing awakening from crisis.' },
    { category: 'Spiritual Emergency & Emergence', title: 'The Stormy Search for the Self', author: 'Christina & Stanislav Grof' },

    // Body, Process & Somatics
    { category: 'Body, Process & Somatics', title: 'Dreambody: The Body’s Role in Revealing the Self', author: 'Arnold Mindell' },
    { category: 'Body, Process & Somatics', title: 'Waking the Tiger: Healing Trauma', author: 'Peter A. Levine' },

    // Meditation & the Contemplative Path
    { category: 'Meditation & the Contemplative Path', title: 'A Path with Heart', author: 'Jack Kornfield' },
    { category: 'Meditation & the Contemplative Path', title: 'Be Here Now', author: 'Ram Dass' },
  ];

  const videos = [
    { title: 'Stanislav Grof — Holotropic States of Consciousness', source: 'Omega Institute', note: 'Grof on non-ordinary (holotropic) states and their healing, transformative potential.', url: 'https://www.youtube.com/watch?v=mA1hDI5IiJQ' },
    { title: 'Joseph Campbell & Bill Moyers — The Power of Myth (Ep. 1: The Hero’s Adventure)', source: 'Documentary series · PBS, 1988', note: 'The Hero’s Journey and the mythic dimension of ordinary life — the source behind our own Hero’s Journey work.', url: 'https://www.youtube.com/watch?v=-AmIpprjMjU' },
    { title: 'Arnold Mindell — Process Psychology & the Dream Body', source: 'New Thinking Allowed (Jeffrey Mishlove)', note: 'The founder of Process Work on following the “dreaming” that moves through body, relationship and the world.', url: 'https://www.youtube.com/watch?v=IM2HQ0scAbA' },
  ];

  // Group reading by category, preserving first-seen order.
  const categories = [];
  const indexByCategory = {};
  reading.forEach(item => {
    const cat = item.category || 'Other';
    if (!(cat in indexByCategory)) {
      indexByCategory[cat] = categories.length;
      categories.push({ category: cat, items: [] });
    }
    categories[indexByCategory[cat]].items.push(item);
  });

  return { categories, videos, pendingVideos: videos.some(v => !v.url) };
};
