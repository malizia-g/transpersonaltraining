// The places seminars happen, and how to get there.
//
// The Seminars sheet says *where* each seminar is (columns City and Venue);
// this file says what the site knows about each place: its address, a Google
// Maps link and the arrival directions. lib/seminars.js matches a sheet row to
// an entry here through `match` — any of those words appearing in the row's
// Venue, City or Title cell is enough.
//
// `city` is the nearest large city, the one a visitor (and a search engine)
// recognises; `place` is the village or estate itself. Both go into every
// seminar URL, e.g. /seminars/…-freiburg-todtmoos-2026-11-18/.
//
// Directions for the two residential venues come from the organisers: Kati
// Wortelkamp's "Seminar location_Todtmoos" PDF (also offered as a download,
// unchanged) and Georgia Pownall's "Travel & Accomodation – Tuscany,
// Monteverdi" document. Personal phone numbers in those documents are left
// out of the page on purpose — participants get them by email once booked.

function maps(query) {
  return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(query);
}

const venues = {
  todtmoos: {
    key: 'todtmoos',
    name: 'Haus am Mühlenbach',
    place: 'Todtmoos',
    city: 'Freiburg',
    region: 'Black Forest',
    country: 'Germany',
    countryCode: 'DE',
    match: ['todtmoos', 'mühlenbach', 'muehlenbach', 'muhlenbach'],
    address: {
      street: 'Mühlematt 6',
      postalCode: '79682',
      locality: 'Todtmoos-Au',
    },
    website: 'http://www.haus-am-muehlenbach.de/',
    maps: maps('Haus am Mühlenbach, Mühlematt 6, 79682 Todtmoos-Au, Germany'),
    page: '/venues/#todtmoos',
    hero: '/assets/images/Headers/hero-schedule-todtmoos-valley',
    heroAlt: 'The green Black Forest valley around the seminar house at Todtmoos',
    arrivalAnchor: 'getting-to-todtmoos',
    pdf: '/assets/documents/arrival-todtmoos-haus-am-muehlenbach.pdf',
    summary: 'A seminar house in the southern Black Forest, about an hour from Freiburg, Basel and Zurich.',
    notes: [
      'Mobile phone reception is usually only possible outside the house; Wi-Fi is available.',
      'Before each intensive the participant mailing list is opened to everyone, so you can arrange to drive together.',
    ],
    arrival: [
      {
        mode: 'Train & bus',
        icon: 'train-front',
        html: 'Travel to <strong>Basel Badischer Bahnhof</strong> (Basel Bad Bf) and change to the local train towards Waldshut. Get off at <strong>Bad Säckingen</strong> and take <strong>bus 7320</strong> to Todtmoos-Au, where the seminar house is. Current connections: <a href="https://int.bahn.de/en" target="_blank" rel="noopener">int.bahn.de</a>.',
      },
      {
        mode: 'By car',
        icon: 'car',
        html: 'Take the A5 towards Basel as far as the Weil am Rhein junction, then the A98 to Lörrach and the B317 to Schopfheim. From there the B518 to Wehr, and from Wehr the L148 to Todtmoos. The first village after the Wehratal gorge is Todtmoos-Au: take the first road on the right up the hill, then the next left. The seminar house is the last house on the right.',
      },
      {
        mode: 'By plane',
        icon: 'plane',
        html: '<strong>Basel/Mulhouse</strong> and <strong>Zurich</strong> airports are about an hour’s drive away. Public transport from Basel airport works but is complicated — leave the airport on the <strong>Swiss side</strong> and search “Basel Flughafen” to “Todtmoos Au” on <a href="https://int.bahn.de/en" target="_blank" rel="noopener">int.bahn.de</a>. Buses from Basel airport to Freiburg (<a href="https://www.flixbus.de/" target="_blank" rel="noopener">FlixBus</a>) leave from the <strong>French side</strong>.',
      },
    ],
  },

  monteverdi: {
    key: 'monteverdi',
    name: 'Tenuta di Monteverdi',
    place: 'Monteverdi',
    city: 'Grosseto',
    region: 'Tuscany',
    country: 'Italy',
    countryCode: 'IT',
    match: ['monteverdi', 'tuscany', 'toscana'],
    address: {
      street: 'Località Monteverdi',
      postalCode: '58045',
      locality: 'Paganico (GR)',
    },
    website: 'https://www.grimaldisavelli.com/tenuta-di-monteverdi-estate/',
    maps: maps('Tenuta di Monteverdi, Località Monteverdi, 58045 Paganico GR, Italy'),
    page: '/venues/#monteverdi',
    hero: '/assets/images/Venue/monteverdi-farmhouse-exterior',
    heroAlt: 'Ivy-covered farmhouse at the Tenuta di Monteverdi in Tuscany',
    arrivalAnchor: 'getting-to-monteverdi',
    summary: 'A historic estate in the Maremma, southern Tuscany, reached by train via Grosseto.',
    notes: [
      'Transfers between Grosseto station and Monteverdi can be arranged for an extra cost, paid in cash (euros): about €20 per person with two or three people in the car, more if you travel alone. Wait outside the front of the station.',
      'A mat is provided for the breathwork. Please bring your own pillow, eye mask, ear plugs if you need them, blanket, top sheet, water bottle, journal and pens or paints. In winter bring warm clothes, a hot-water bottle and slippers.',
      'Meals are vegetarian and almost entirely organic, about €4 per meal, served in the villa or the seminar room. Tell us about any allergies or intolerances before you arrive.',
    ],
    arrival: [
      {
        mode: 'Via Pisa',
        icon: 'plane',
        html: 'The easiest airport is <strong>Pisa (PSA)</strong>. The PisaMover shuttle runs every 5 minutes from the airport to Pisa Centrale (5 minutes). Trains from <strong>Pisa Centrale to Grosseto</strong> take about 1 h 30 – 2 h.',
      },
      {
        mode: 'Via Rome',
        icon: 'plane',
        html: 'Fly into <strong>Rome Fiumicino (FCO)</strong> and take the Leonardo Express to Roma Termini (every 15 minutes, 30 minutes). Trains from <strong>Roma Termini to Grosseto</strong> take about 1 h 30 – 2 h.',
      },
      {
        mode: 'Train tickets & buses',
        icon: 'train-front',
        html: 'All trains can be booked on <a href="https://www.thetrainline.com/" target="_blank" rel="noopener">Trainline</a>. If you prefer not to fly, <a href="https://www.flixbus.com/" target="_blank" rel="noopener">FlixBus</a> runs from all over Italy, usually stopping at Siena, Grosseto or (less often) Paganico.',
      },
      {
        mode: 'Grosseto → Monteverdi',
        icon: 'car',
        html: 'From Grosseto station a transfer can take you to the estate and back at the end — ask us when you book.',
      },
    ],
    rooms: {
      caption: 'Accommodation at Monteverdi, price per person in euros',
      nights: [1, 2, 3, 4, 5],
      rows: [
        { label: 'Flat, single occupancy (shared bathroom)', perNight: 35 },
        { label: 'Flat, double occupancy (shared bathroom)', perNight: 26 },
        { label: 'Villa, single occupancy (en suite)', perNight: 40 },
        { label: 'Villa, double occupancy (en suite)', perNight: 35 },
        { label: 'Main house, single occupancy (shared bathroom)', perNight: 40 },
        { label: 'Main house, double occupancy (shared bathroom)', perNight: 35 },
      ],
      extras: 'Bedding €10 and towel €2 per stay. Please pay in cash; an invoice can be issued on request.',
    },
  },

  // Places without a fixed house of our own: a city (and, where known, the
  // partner venue) is all the site can say about them.
  chisinau: { key: 'chisinau', place: 'Chisinau', city: 'Chisinau', country: 'Moldova', countryCode: 'MD', match: ['chisinau', 'moldova', 'dniester'], maps: maps('Chisinau, Moldova'), page: '/venues/#secondary-venues', hero: '/assets/images/Venue/venue-dniester-valley-view', heroAlt: 'View over the Dniester river valley in Moldova' },
  riga: { key: 'riga', place: 'Riga', city: 'Riga', country: 'Latvia', countryCode: 'LV', match: ['riga'], maps: maps('Riga, Latvia') },
  bucharest: { key: 'bucharest', place: 'Bucharest', city: 'Bucharest', country: 'Romania', countryCode: 'RO', match: ['bucharest'], maps: maps('Bucharest, Romania') },
  carate: { key: 'carate', place: 'Carate Brianza', city: 'Milan', country: 'Italy', countryCode: 'IT', match: ['carate'], maps: maps('Carate Brianza, Italy') },
  milan: { key: 'milan', place: 'Milan', city: 'Milan', country: 'Italy', countryCode: 'IT', match: ['milan', 'milano'], maps: maps('Milan, Italy') },
  spetses: { key: 'spetses', place: 'Spetses', city: 'Athens', country: 'Greece', countryCode: 'GR', match: ['spetses', 'greece'], maps: maps('Spetses, Greece') },
};

// Most specific first: "Option: Holotropic Breathwork (Todtmoos)" must not be
// taken for Milan because the description mentions Italy, and a Carate row
// must not collapse into plain Milan.
const order = ['todtmoos', 'monteverdi', 'carate', 'milan', 'riga', 'bucharest', 'spetses', 'chisinau'];

module.exports = { ...venues, _order: order };
