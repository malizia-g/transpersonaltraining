// The palette catalogue, and the single place its numbers live.
//
// Both the CSS in src/styles/main.css and the metadata the switcher shows are
// generated from this table by `node scripts/design/build-palettes.js`, so the
// two can never drift apart. Edit here, re-run, commit the result.
//
// A palette is five HSL triples — deep, dusk, accent, second, paper — plus the
// three small offsets that keep headings, links and the hero's warm glow
// related to them. Everything else in the stylesheet is derived.
//
// `tags` drives the filter in the panel. A palette carrying two tags is a
// hybrid and shows up under both of its families.

module.exports = [
  // ── Classic ───────────────────────────────────────────────────────────────
  { id: 'blue', name: 'Scientific Blue', note: 'the current scheme', tags: ['classic'], reference: true,
    deep: [213, 62, 15], dusk: [258, 22, 18], acc: [37, 63, 59], sec: [16, 49, 48], pap: [38, 65, 94],
    head: [29, 47, 34], link: [11, 64, 33], glow: [-10, 69, 51] },

  // ── Nature ────────────────────────────────────────────────────────────────
  { id: 'green', name: 'Deep Forest', note: 'dark conifer under honey gold', tags: ['nature'],
    deep: [155, 45, 13], dusk: [108, 26, 17], acc: [42, 62, 57], sec: [22, 52, 42], pap: [44, 55, 94],
    head: [10, 44, 22], link: [6, 58, 26], glow: [-8, 66, 52] },

  { id: 'moss', name: 'Moss & Linen', note: 'soft green on a linen ground', tags: ['nature'],
    deep: [145, 32, 16], dusk: [95, 22, 19], acc: [45, 55, 60], sec: [28, 48, 41], pap: [60, 35, 95],
    head: [8, 40, 22], link: [5, 50, 26], glow: [-6, 60, 54] },

  { id: 'pine', name: 'Pine & Ember', note: 'near-black pine, ember CTA', tags: ['nature'],
    deep: [172, 48, 12], dusk: [200, 30, 16], acc: [25, 72, 62], sec: [12, 58, 44], pap: [40, 45, 94],
    head: [-6, 44, 21], link: [-10, 56, 25], glow: [0, 74, 52] },

  { id: 'fern', name: 'Fern', note: 'fresher green, yellow-green accent', tags: ['nature'],
    deep: [138, 40, 15], dusk: [80, 30, 17], acc: [58, 58, 54], sec: [30, 52, 39], pap: [55, 45, 95],
    head: [12, 44, 22], link: [8, 54, 26], glow: [-14, 64, 52] },

  { id: 'seapine', name: 'Sea Pine', note: 'green pulled towards teal', tags: ['nature'],
    deep: [185, 44, 13], dusk: [210, 28, 17], acc: [40, 60, 58], sec: [18, 52, 44], pap: [45, 50, 94],
    head: [-8, 46, 22], link: [-12, 58, 26], glow: [-6, 68, 52] },

  // ── Earth ─────────────────────────────────────────────────────────────────
  { id: 'earth', name: 'Red Earth', note: 'oxide and terracotta', tags: ['earth'],
    deep: [8, 40, 15], dusk: [350, 24, 18], acc: [33, 58, 58], sec: [6, 55, 43], pap: [28, 60, 94],
    head: [4, 44, 23], link: [-2, 56, 28], glow: [10, 70, 52] },

  { id: 'orange', name: 'Amber', note: 'roasted browns, bright orange CTA', tags: ['earth'],
    deep: [22, 46, 14], dusk: [340, 26, 17], acc: [30, 78, 56], sec: [10, 60, 43], pap: [34, 70, 94],
    head: [-4, 48, 23], link: [-6, 62, 28], glow: [4, 76, 53] },

  { id: 'terracotta', name: 'Terracotta', note: 'fired brick and clay', tags: ['earth'],
    deep: [14, 38, 16], dusk: [355, 22, 19], acc: [28, 62, 60], sec: [12, 56, 43], pap: [30, 55, 94],
    head: [2, 42, 23], link: [-4, 54, 28], glow: [6, 68, 53] },

  { id: 'sienna', name: 'Sienna & Sand', note: 'warm brown on a sand ground', tags: ['earth'],
    deep: [26, 34, 15], dusk: [15, 24, 18], acc: [36, 60, 58], sec: [20, 54, 42], pap: [36, 50, 95],
    head: [0, 40, 23], link: [-8, 52, 27], glow: [2, 66, 53] },

  { id: 'rust', name: 'Rust & Bone', note: 'deep rust against bone white', tags: ['earth'],
    deep: [12, 45, 13], dusk: [330, 22, 17], acc: [24, 66, 59], sec: [8, 58, 42], pap: [40, 26, 95],
    head: [6, 46, 22], link: [-2, 58, 27], glow: [8, 72, 52] },

  // ── Spiritual ─────────────────────────────────────────────────────────────
  { id: 'purple', name: 'Purple & Olive', note: 'from the reference swatch', tags: ['spiritual'],
    deep: [300, 52, 13], dusk: [80, 45, 12], acc: [71, 60, 55], sec: [302, 55, 38], pap: [60, 40, 95],
    head: [4, 52, 24], link: [2, 56, 29], glow: [130, 55, 45] },

  { id: 'amethyst', name: 'Amethyst', note: 'violet under a soft gold', tags: ['spiritual'],
    deep: [275, 40, 14], dusk: [250, 28, 17], acc: [42, 55, 60], sec: [290, 46, 42], pap: [45, 40, 95],
    head: [-6, 46, 24], link: [-10, 54, 29], glow: [-4, 64, 53] },

  { id: 'plum', name: 'Plum & Rose', note: 'deep plum, rose-gold CTA', tags: ['spiritual'],
    deep: [320, 38, 14], dusk: [285, 26, 17], acc: [20, 55, 62], sec: [335, 50, 42], pap: [30, 40, 95],
    head: [-14, 46, 24], link: [-20, 52, 29], glow: [6, 62, 54] },

  { id: 'indigonight', name: 'Indigo Night', note: 'deep indigo, pale gold', tags: ['spiritual'],
    deep: [255, 45, 13], dusk: [285, 30, 16], acc: [45, 58, 60], sec: [265, 46, 45], pap: [42, 38, 95],
    head: [-12, 50, 26], link: [-18, 58, 30], glow: [-8, 66, 53] },

  { id: 'iris', name: 'Iris', note: 'a cooler mid purple', tags: ['spiritual'],
    deep: [288, 44, 15], dusk: [265, 28, 18], acc: [48, 52, 60], sec: [295, 48, 43], pap: [50, 32, 95],
    head: [-8, 48, 25], link: [-14, 56, 30], glow: [-6, 62, 54] },

  // ── Hybrids ───────────────────────────────────────────────────────────────
  { id: 'mossclay', name: 'Moss & Clay', note: 'green ground, clay gradients', tags: ['nature', 'earth'],
    deep: [150, 38, 14], dusk: [30, 28, 17], acc: [36, 60, 59], sec: [18, 54, 42], pap: [38, 50, 94],
    head: [4, 44, 22], link: [0, 54, 26], glow: [2, 68, 52] },

  { id: 'ochregrove', name: 'Ochre Grove', note: 'leaf green under ochre', tags: ['nature', 'earth'],
    deep: [120, 34, 15], dusk: [40, 30, 18], acc: [40, 66, 56], sec: [25, 56, 40], pap: [42, 55, 94],
    head: [10, 42, 22], link: [6, 52, 26], glow: [0, 70, 53] },

  { id: 'forestiris', name: 'Forest & Iris', note: 'conifer with a violet dusk', tags: ['nature', 'spiritual'],
    deep: [160, 42, 13], dusk: [280, 32, 16], acc: [50, 56, 57], sec: [290, 46, 42], pap: [48, 40, 95],
    head: [8, 46, 22], link: [4, 56, 26], glow: [-10, 60, 52] },

  { id: 'heather', name: 'Twilight Heath', note: 'moor green drifting to heather', tags: ['nature', 'spiritual'],
    deep: [170, 36, 14], dusk: [292, 30, 17], acc: [52, 52, 57], sec: [298, 44, 43], pap: [50, 35, 95],
    head: [-4, 44, 22], link: [-8, 54, 26], glow: [-8, 62, 53] },

  { id: 'clayamethyst', name: 'Clay & Amethyst', note: 'warm clay, amethyst shadows', tags: ['earth', 'spiritual'],
    deep: [350, 36, 14], dusk: [285, 30, 17], acc: [32, 58, 58], sec: [300, 46, 41], pap: [32, 40, 95],
    head: [8, 44, 23], link: [0, 54, 28], glow: [14, 66, 53] },

  { id: 'emberiris', name: 'Ember & Iris', note: 'violet ground, ember CTA', tags: ['earth', 'spiritual'],
    deep: [305, 35, 13], dusk: [20, 32, 17], acc: [26, 68, 58], sec: [315, 50, 42], pap: [34, 38, 95],
    head: [2, 46, 23], link: [-6, 54, 28], glow: [8, 70, 52] },
];
