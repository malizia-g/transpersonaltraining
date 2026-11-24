/* ═══════════════════════════════════════════════════════════════════
   ONE-OFF UPDATE — 24 November 2026
   ═══════════════════════════════════════════════════════════════════
   Run once from the menu: 🚀 Automations → 🗺️ Apply program update (Nov 2026).
   Safe to run again: rows are found by their old or their new values, so a
   second run rewrites the same cells instead of adding duplicates.

   Seminars tab
   - Adds six columns after ImageUrl: Slug, City, Venue, Address, Maps,
     Arrival. City is the nearest large city, Venue the place itself, Maps a
     Google Maps link, Arrival the page with directions. Slug fixes the page
     URL on the website (/seminars/<slug>/): leave it alone once set, so a
     corrected title never breaks a link that is already out there.
   - Applies the "West Program 26 ab Modul 11" PDF (status 07.11.26):
     Family Constellation intensive now 18.–22.11.2026; modules 12/13;
     the 2027 Todtmoos dates get their topics; adds the two Tuscany
     weekends and the 2027 Summer School in Moldova.
   - Fixes: the 20.11.2025 row had no title, the 21.02.2025 one only
     "Intensive"; the two Riga weekends said Moldova; "Holotropic Carate".

   Lectures tab
   - Every date the PDF lists is written as the PDF says (title, teacher,
     module; description where the topic changed). New dates are appended.
     Dates the PDF does not mention are left untouched.

   The website reads the new columns through the JSON API as they are, so
   JSON-API.js needs no change. Afterwards: 🔄 Update Website.
   ═══════════════════════════════════════════════════════════════════ */

var PROGRAM_UPDATE_SEMINARS_ = [
 {
  "match": {
   "date": "29.02.2024 - 03.03.2024",
   "title": "Intensive + Grof® Breathwork"
  },
  "row": {
   "date": "29.02.2024 - 03.03.2024",
   "facilitator": "Kati Wortelkamp & Lyudmila Skartsesku",
   "title": "Intensive + Grof® Breathwork",
   "description": "A residential intensive built around daily Holotropic Breathwork sessions, alternating breather and sitter roles. Grof's technique of accelerated breathing, evocative music and bodywork opens access to non-ordinary states for healing and self-exploration, with group sharing after each session.",
   "module": "Module 1",
   "location": "Germany",
   "type1": "Seminar",
   "type2": "Holotropic Breathwork",
   "city": "Freiburg",
   "venue": "Haus am Mühlenbach, Todtmoos",
   "address": "Mühlematt 6, 79682 Todtmoos-Au, Germany",
   "maps": "https://www.google.com/maps/search/?api=1&query=Haus%20am%20M%C3%BChlenbach%2C%20M%C3%BChlematt%206%2C%2079682%20Todtmoos-Au%2C%20Germany",
   "arrival": "https://transpersonal-training.com/venues/#getting-to-todtmoos",
   "slug": "intensive-grof-breathwork-freiburg-todtmoos-2024-02-29"
  },
  "write": [
   "slug",
   "city",
   "venue",
   "address",
   "maps",
   "arrival"
  ]
 },
 {
  "match": {
   "date": "25.04.2024 - 28.04.2024",
   "title": "Option 1: Double Holotropic Breathwork"
  },
  "row": {
   "date": "25.04.2024 - 28.04.2024",
   "facilitator": "Ursula Boger & Kati Wortelkamp",
   "title": "Option 1: Double Holotropic Breathwork",
   "description": "A weekend built around two Holotropic Breathwork sessions, with participants alternating as breather and sitter. Grof's method of accelerated breathing, music and bodywork opens access to non-ordinary states for healing, followed by mandala drawing and group sharing.",
   "module": "Module 2",
   "location": "Germany",
   "type1": "Holotropic Breathwork",
   "type2": "",
   "city": "Freiburg",
   "venue": "Haus am Mühlenbach, Todtmoos",
   "address": "Mühlematt 6, 79682 Todtmoos-Au, Germany",
   "maps": "https://www.google.com/maps/search/?api=1&query=Haus%20am%20M%C3%BChlenbach%2C%20M%C3%BChlematt%206%2C%2079682%20Todtmoos-Au%2C%20Germany",
   "arrival": "https://transpersonal-training.com/venues/#getting-to-todtmoos",
   "slug": "double-holotropic-breathwork-freiburg-todtmoos-2024-04-25"
  },
  "write": [
   "slug",
   "city",
   "venue",
   "address",
   "maps",
   "arrival"
  ]
 },
 {
  "match": {
   "date": "11.06.2024 - 14.06.2024",
   "title": "Option: Summer School and Ceremony"
  },
  "row": {
   "date": "11.06.2024 - 14.06.2024",
   "facilitator": "Dario Giuffrida, Mireia Berdun",
   "title": "Option: Summer School and Ceremony",
   "description": "A multi-day summer school combining transpersonal theory with a closing group ceremony. The ceremony uses ritual and collective presence to help integrate what has emerged during the training and restore a felt sense of belonging.",
   "module": "-",
   "location": "Moldova",
   "type1": "Ceremony",
   "type2": "",
   "city": "Chisinau",
   "venue": "",
   "address": "",
   "maps": "https://www.google.com/maps/search/?api=1&query=Chisinau%2C%20Moldova",
   "arrival": "",
   "slug": "summer-school-and-ceremony-chisinau-2024-06-11"
  },
  "write": [
   "slug",
   "city",
   "venue",
   "address",
   "maps",
   "arrival"
  ]
 },
 {
  "match": {
   "date": "20.06.2024 - 23.06.2024",
   "title": "Option: Double Holotropic Breathwork"
  },
  "row": {
   "date": "20.06.2024 - 23.06.2024",
   "facilitator": "Kati Wortelkamp & Ursula Boger",
   "title": "Option: Double Holotropic Breathwork",
   "description": "A weekend built around two Holotropic Breathwork sessions, with participants alternating as breather and sitter. Grof's method of accelerated breathing, music and bodywork opens access to non-ordinary states for healing, followed by mandala drawing and group sharing.",
   "module": "-",
   "location": "Germany",
   "type1": "Breathwork",
   "type2": "",
   "city": "Freiburg",
   "venue": "Haus am Mühlenbach, Todtmoos",
   "address": "Mühlematt 6, 79682 Todtmoos-Au, Germany",
   "maps": "https://www.google.com/maps/search/?api=1&query=Haus%20am%20M%C3%BChlenbach%2C%20M%C3%BChlematt%206%2C%2079682%20Todtmoos-Au%2C%20Germany",
   "arrival": "https://transpersonal-training.com/venues/#getting-to-todtmoos",
   "slug": "double-holotropic-breathwork-freiburg-todtmoos-2024-06-20"
  },
  "write": [
   "slug",
   "city",
   "venue",
   "address",
   "maps",
   "arrival"
  ]
 },
 {
  "match": {
   "date": "04.07.2024 - 07.07.2024",
   "title": "Option 2: Gestalt Therapy & Grof® Breathwork"
  },
  "row": {
   "date": "04.07.2024 - 07.07.2024",
   "facilitator": "Kati Wortelkamp & Lilian Gscheidel",
   "title": "Option 2: Gestalt Therapy & Grof® Breathwork",
   "description": "Combines a Grof Breathwork session with Gestalt therapy's here-and-now approach. Empty-chair work and tracking body resistance help unfinished situations come to the surface, and the breathwork material is then explored through a Gestalt lens.",
   "module": "Module 2",
   "location": "Germany",
   "type1": "Gestalt",
   "type2": "Holotropic Breathwork",
   "city": "Freiburg",
   "venue": "Haus am Mühlenbach, Todtmoos",
   "address": "Mühlematt 6, 79682 Todtmoos-Au, Germany",
   "maps": "https://www.google.com/maps/search/?api=1&query=Haus%20am%20M%C3%BChlenbach%2C%20M%C3%BChlematt%206%2C%2079682%20Todtmoos-Au%2C%20Germany",
   "arrival": "https://transpersonal-training.com/venues/#getting-to-todtmoos",
   "slug": "gestalt-therapy-and-grof-breathwork-freiburg-todtmoos-2024-07-04"
  },
  "write": [
   "slug",
   "city",
   "venue",
   "address",
   "maps",
   "arrival"
  ]
 },
 {
  "match": {
   "date": "12.09.2024 - 15.09.2024",
   "title": "Double Grof® Breathworks"
  },
  "row": {
   "date": "12.09.2024 - 15.09.2024",
   "facilitator": "Mario Lorenzetti & Kati Wortelkamp",
   "title": "Double Grof® Breathworks",
   "description": "A weekend built around two Holotropic Breathwork sessions, with participants alternating as breather and sitter. Grof's method of accelerated breathing, music and bodywork opens access to non-ordinary states for healing, followed by mandala drawing and group sharing.",
   "module": "Module 3",
   "location": "Germany",
   "type1": "Holotropic Breathwork",
   "type2": "",
   "city": "Freiburg",
   "venue": "Haus am Mühlenbach, Todtmoos",
   "address": "Mühlematt 6, 79682 Todtmoos-Au, Germany",
   "maps": "https://www.google.com/maps/search/?api=1&query=Haus%20am%20M%C3%BChlenbach%2C%20M%C3%BChlematt%206%2C%2079682%20Todtmoos-Au%2C%20Germany",
   "arrival": "https://transpersonal-training.com/venues/#getting-to-todtmoos",
   "slug": "double-grof-breathworks-freiburg-todtmoos-2024-09-12"
  },
  "write": [
   "slug",
   "city",
   "venue",
   "address",
   "maps",
   "arrival"
  ]
 },
 {
  "match": {
   "date": "20.09.2024 - 22.09.2024",
   "title": "Option: Double Holotropic Breathwork (Chisinau)"
  },
  "row": {
   "date": "20.09.2024 - 22.09.2024",
   "facilitator": "Lyudmila Skartsesku, Kati Wortelkamp, Stefan Dressler",
   "title": "Option: Double Holotropic Breathwork (Chisinau)",
   "description": "A weekend built around two Holotropic Breathwork sessions, with participants alternating as breather and sitter. Grof's method of accelerated breathing, music and bodywork opens access to non-ordinary states for healing, followed by mandala drawing and group sharing.",
   "module": "-",
   "location": "Moldova",
   "type1": "Holotropic Breathwork",
   "type2": "",
   "city": "Chisinau",
   "venue": "",
   "address": "",
   "maps": "https://www.google.com/maps/search/?api=1&query=Chisinau%2C%20Moldova",
   "arrival": "",
   "slug": "double-holotropic-breathwork-chisinau-2024-09-20"
  },
  "write": [
   "slug",
   "city",
   "venue",
   "address",
   "maps",
   "arrival"
  ]
 },
 {
  "match": {
   "date": "09.11.2024 - 10.11.2024",
   "title": "Option: Holotropic Breathwork (Riga)"
  },
  "row": {
   "date": "09.11.2024 - 10.11.2024",
   "facilitator": "Lyudmila Skartsesku",
   "title": "Option: Holotropic Breathwork (Riga)",
   "description": "A weekend built around one Holotropic Breathwork session, with participants alternating as breather and sitter. Accelerated breathing, evocative music and bodywork open access to non-ordinary states for healing, followed by mandala drawing and group sharing.",
   "module": "-",
   "location": "Latvia",
   "type1": "Holotropic Breathwork",
   "type2": "",
   "city": "Riga",
   "venue": "",
   "address": "",
   "maps": "https://www.google.com/maps/search/?api=1&query=Riga%2C%20Latvia",
   "arrival": "",
   "slug": "holotropic-breathwork-riga-2024-11-09"
  },
  "write": [
   "location",
   "slug",
   "city",
   "venue",
   "address",
   "maps",
   "arrival"
  ]
 },
 {
  "match": {
   "date": "28.11.2024 - 01.12.2024",
   "title": "Intensive + Grof® Breathwork"
  },
  "row": {
   "date": "28.11.2024 - 01.12.2024",
   "facilitator": "Kati Wortelkamp, Mario Lorenzetti & Stephan Schillinger",
   "title": "Intensive + Grof® Breathwork",
   "description": "A residential intensive built around daily Holotropic Breathwork sessions, alternating breather and sitter roles. Grof's technique of accelerated breathing, evocative music and bodywork opens access to non-ordinary states for healing and self-exploration, with group sharing after each session.",
   "module": "Module 4",
   "location": "Germany",
   "type1": "Holotropic Breathwork",
   "type2": "Ceremony",
   "city": "Freiburg",
   "venue": "Haus am Mühlenbach, Todtmoos",
   "address": "Mühlematt 6, 79682 Todtmoos-Au, Germany",
   "maps": "https://www.google.com/maps/search/?api=1&query=Haus%20am%20M%C3%BChlenbach%2C%20M%C3%BChlematt%206%2C%2079682%20Todtmoos-Au%2C%20Germany",
   "arrival": "https://transpersonal-training.com/venues/#getting-to-todtmoos",
   "slug": "intensive-grof-breathwork-freiburg-todtmoos-2024-11-28"
  },
  "write": [
   "slug",
   "city",
   "venue",
   "address",
   "maps",
   "arrival"
  ]
 },
 {
  "match": {
   "date": "18.02.2025 - 21-02.2025",
   "title": "Option:  Grof® Breathwork"
  },
  "row": {
   "date": "18.02.2025 - 21-02.2025",
   "facilitator": "Kati Wortelkamp, Mario Lorenzetti, Jasmine",
   "title": "Option:  Grof® Breathwork",
   "description": "A weekend built around one Holotropic Breathwork session, with participants alternating as breather and sitter. Accelerated breathing, evocative music and bodywork open access to non-ordinary states for healing, followed by mandala drawing and group sharing.",
   "module": "Module 5",
   "location": "Germany",
   "type1": "Holotropic Breathwork",
   "type2": "",
   "city": "Freiburg",
   "venue": "Haus am Mühlenbach, Todtmoos",
   "address": "Mühlematt 6, 79682 Todtmoos-Au, Germany",
   "maps": "https://www.google.com/maps/search/?api=1&query=Haus%20am%20M%C3%BChlenbach%2C%20M%C3%BChlematt%206%2C%2079682%20Todtmoos-Au%2C%20Germany",
   "arrival": "https://transpersonal-training.com/venues/#getting-to-todtmoos",
   "slug": "grof-breathwork-freiburg-todtmoos-2025-02-18"
  },
  "write": [
   "slug",
   "city",
   "venue",
   "address",
   "maps",
   "arrival"
  ]
 },
 {
  "match": {
   "date": "21.02.2025 - 23.02.2025",
   "title": "Intensive"
  },
  "row": {
   "date": "21.02.2025 - 23.02.2025",
   "facilitator": "Jure Biechonski",
   "title": "Intensive: \"From Regression to Progression\"",
   "description": "Jure Biechonski's seminar on 'Regression to Progression': looking back at childhood not to analyze it but as a tool for moving forward. Through guided visualization participants meet their inner child, reworking old patterns with techniques like the empty chair and the drama triangle.",
   "module": "Module 5",
   "location": "Germany",
   "type1": "Holotropic Breathwork",
   "type2": "",
   "city": "Freiburg",
   "venue": "Haus am Mühlenbach, Todtmoos",
   "address": "Mühlematt 6, 79682 Todtmoos-Au, Germany",
   "maps": "https://www.google.com/maps/search/?api=1&query=Haus%20am%20M%C3%BChlenbach%2C%20M%C3%BChlematt%206%2C%2079682%20Todtmoos-Au%2C%20Germany",
   "arrival": "https://transpersonal-training.com/venues/#getting-to-todtmoos",
   "slug": "intensive-from-regression-to-progression-freiburg-todtmoos-2025-02-21"
  },
  "write": [
   "title",
   "facilitator",
   "slug",
   "city",
   "venue",
   "address",
   "maps",
   "arrival"
  ]
 },
 {
  "match": {
   "date": "01.06.2025 - 03.07.2025",
   "title": "Option: Double Holotropic Breathwork"
  },
  "row": {
   "date": "01.06.2025 - 03.07.2025",
   "facilitator": "Kati Wortelkamp",
   "title": "Option: Double Holotropic Breathwork",
   "description": "A weekend built around two Holotropic Breathwork sessions, with participants alternating as breather and sitter. Grof's method of accelerated breathing, music and bodywork opens access to non-ordinary states for healing, followed by mandala drawing and group sharing.",
   "module": "-",
   "location": "Germany",
   "type1": "Holotropic Breathwork",
   "type2": "",
   "city": "Freiburg",
   "venue": "Haus am Mühlenbach, Todtmoos",
   "address": "Mühlematt 6, 79682 Todtmoos-Au, Germany",
   "maps": "https://www.google.com/maps/search/?api=1&query=Haus%20am%20M%C3%BChlenbach%2C%20M%C3%BChlematt%206%2C%2079682%20Todtmoos-Au%2C%20Germany",
   "arrival": "https://transpersonal-training.com/venues/#getting-to-todtmoos",
   "slug": "double-holotropic-breathwork-freiburg-todtmoos-2025-06-01"
  },
  "write": [
   "slug",
   "city",
   "venue",
   "address",
   "maps",
   "arrival"
  ]
 },
 {
  "match": {
   "date": "03.06.2025 - 06.06.2025",
   "title": "Intensive: Healing the Inner Child + Grof® Breathwork"
  },
  "row": {
   "date": "03.06.2025 - 06.06.2025",
   "facilitator": "Rainer Pervoltz",
   "title": "Intensive: Healing the Inner Child + Grof® Breathwork",
   "description": "Rainer Pervoltz combines inner-child healing with a Holotropic Breathwork session, working from the principle that the therapist's role is guidance, not solutions. Bodywork and breathwork open access to early wounds, met with presence, acceptance and non-judgment.",
   "module": "Module 6",
   "location": "Germany",
   "type1": "Holotropic Breathwork",
   "type2": "",
   "city": "Freiburg",
   "venue": "Haus am Mühlenbach, Todtmoos",
   "address": "Mühlematt 6, 79682 Todtmoos-Au, Germany",
   "maps": "https://www.google.com/maps/search/?api=1&query=Haus%20am%20M%C3%BChlenbach%2C%20M%C3%BChlematt%206%2C%2079682%20Todtmoos-Au%2C%20Germany",
   "arrival": "https://transpersonal-training.com/venues/#getting-to-todtmoos",
   "slug": "intensive-healing-the-inner-child-grof-breathwork-freiburg-todtmoos-2025-06-03"
  },
  "write": [
   "slug",
   "city",
   "venue",
   "address",
   "maps",
   "arrival"
  ]
 },
 {
  "match": {
   "date": "01.08.2025 - 03.08.2025",
   "title": "Option: Holotropic Breathwork (Riga)"
  },
  "row": {
   "date": "01.08.2025 - 03.08.2025",
   "facilitator": "Lyudmila Skartsesku & Kati",
   "title": "Option: Holotropic Breathwork (Riga)",
   "description": "A weekend built around one Holotropic Breathwork session, with participants alternating as breather and sitter. Accelerated breathing, evocative music and bodywork open access to non-ordinary states for healing, followed by mandala drawing and group sharing.",
   "module": "-",
   "location": "Latvia",
   "type1": "Holotropic Breathwork",
   "type2": "",
   "city": "Riga",
   "venue": "",
   "address": "",
   "maps": "https://www.google.com/maps/search/?api=1&query=Riga%2C%20Latvia",
   "arrival": "",
   "slug": "holotropic-breathwork-riga-2025-08-01"
  },
  "write": [
   "location",
   "slug",
   "city",
   "venue",
   "address",
   "maps",
   "arrival"
  ]
 },
 {
  "match": {
   "date": "26.06.2025 - 29.06.2025",
   "title": "Option: Double Holotropic Breathwork"
  },
  "row": {
   "date": "26.06.2025 - 29.06.2025",
   "facilitator": "Kati Wortelkamp & Ursula Boger",
   "title": "Option: Double Holotropic Breathwork",
   "description": "A weekend built around two Holotropic Breathwork sessions, with participants alternating as breather and sitter. Grof's method of accelerated breathing, music and bodywork opens access to non-ordinary states for healing, followed by mandala drawing and group sharing.",
   "module": "-",
   "location": "Germany",
   "type1": "Holotropic Breathwork",
   "type2": "",
   "city": "Freiburg",
   "venue": "Haus am Mühlenbach, Todtmoos",
   "address": "Mühlematt 6, 79682 Todtmoos-Au, Germany",
   "maps": "https://www.google.com/maps/search/?api=1&query=Haus%20am%20M%C3%BChlenbach%2C%20M%C3%BChlematt%206%2C%2079682%20Todtmoos-Au%2C%20Germany",
   "arrival": "https://transpersonal-training.com/venues/#getting-to-todtmoos",
   "slug": "double-holotropic-breathwork-freiburg-todtmoos-2025-06-26"
  },
  "write": [
   "slug",
   "city",
   "venue",
   "address",
   "maps",
   "arrival"
  ]
 },
 {
  "match": {
   "date": "16.09.2025 - 19.09.2025",
   "title": "Option: Double Holotropic Breathwork"
  },
  "row": {
   "date": "16.09.2025 - 19.09.2025",
   "facilitator": "Kati",
   "title": "Option: Double Holotropic Breathwork",
   "description": "A weekend built around two Holotropic Breathwork sessions, with participants alternating as breather and sitter. Grof's method of accelerated breathing, music and bodywork opens access to non-ordinary states for healing, followed by mandala drawing and group sharing.",
   "module": "Module 7",
   "location": "Germany",
   "type1": "Holotropic Breathwork",
   "type2": "",
   "city": "Freiburg",
   "venue": "Haus am Mühlenbach, Todtmoos",
   "address": "Mühlematt 6, 79682 Todtmoos-Au, Germany",
   "maps": "https://www.google.com/maps/search/?api=1&query=Haus%20am%20M%C3%BChlenbach%2C%20M%C3%BChlematt%206%2C%2079682%20Todtmoos-Au%2C%20Germany",
   "arrival": "https://transpersonal-training.com/venues/#getting-to-todtmoos",
   "slug": "double-holotropic-breathwork-freiburg-todtmoos-2025-09-16"
  },
  "write": [
   "slug",
   "city",
   "venue",
   "address",
   "maps",
   "arrival"
  ]
 },
 {
  "match": {
   "date": "19.09.2025 - 21.09.2025",
   "title": "Intensive: \"Psychosintesis\""
  },
  "row": {
   "date": "19.09.2025 - 21.09.2025",
   "facilitator": "Charlotte Kihl",
   "title": "Intensive: \"Psychosintesis\"",
   "description": "Charlotte Kihl introduces Psychosynthesis, Roberto Assagioli's model of the psyche built around subpersonalities and a unifying higher Self. Disidentification exercises help participants recognize and integrate their different inner parts, and explore the role of Will in personal growth.",
   "module": "Module 7",
   "location": "Germany",
   "type1": "Holotropic Breathwork",
   "type2": "",
   "city": "Freiburg",
   "venue": "Haus am Mühlenbach, Todtmoos",
   "address": "Mühlematt 6, 79682 Todtmoos-Au, Germany",
   "maps": "https://www.google.com/maps/search/?api=1&query=Haus%20am%20M%C3%BChlenbach%2C%20M%C3%BChlematt%206%2C%2079682%20Todtmoos-Au%2C%20Germany",
   "arrival": "https://transpersonal-training.com/venues/#getting-to-todtmoos",
   "slug": "intensive-psychosintesis-freiburg-todtmoos-2025-09-19"
  },
  "write": [
   "slug",
   "city",
   "venue",
   "address",
   "maps",
   "arrival"
  ]
 },
 {
  "match": {
   "date": "10.10.2025 - 12.10.2025",
   "title": "Option: Holotropic Carate (Italy)"
  },
  "row": {
   "date": "10.10.2025 - 12.10.2025",
   "facilitator": "Mario Lorenzetti",
   "title": "Option: Holotropic Breathwork (Carate Brianza)",
   "description": "A weekend built around one Holotropic Breathwork session, with participants alternating as breather and sitter. Accelerated breathing, evocative music and bodywork open access to non-ordinary states for healing, followed by mandala drawing and group sharing.",
   "module": "-",
   "location": "Italy",
   "type1": "Holotropic Breathwork",
   "type2": "",
   "city": "Milan",
   "venue": "Carate Brianza",
   "address": "",
   "maps": "https://www.google.com/maps/search/?api=1&query=Carate%20Brianza%2C%20Italy",
   "arrival": "",
   "slug": "holotropic-breathwork-milan-carate-brianza-2025-10-10"
  },
  "write": [
   "title",
   "slug",
   "city",
   "venue",
   "address",
   "maps",
   "arrival"
  ]
 },
 {
  "match": {
   "date": "19.11.2025 - 20.11.2025",
   "title": "Option: Holotropic Breathwork (Todtmoos)"
  },
  "row": {
   "date": "19.11.2025 - 20.11.2025",
   "facilitator": "Kati + Agnese",
   "title": "Option: Holotropic Breathwork (Todtmoos)",
   "description": "A weekend built around one Holotropic Breathwork session, with participants alternating as breather and sitter. Accelerated breathing, evocative music and bodywork open access to non-ordinary states for healing, followed by mandala drawing and group sharing.",
   "module": "Module 7",
   "location": "Germany",
   "type1": "Holotropic Breathwork",
   "type2": "",
   "city": "Freiburg",
   "venue": "Haus am Mühlenbach, Todtmoos",
   "address": "Mühlematt 6, 79682 Todtmoos-Au, Germany",
   "maps": "https://www.google.com/maps/search/?api=1&query=Haus%20am%20M%C3%BChlenbach%2C%20M%C3%BChlematt%206%2C%2079682%20Todtmoos-Au%2C%20Germany",
   "arrival": "https://transpersonal-training.com/venues/#getting-to-todtmoos",
   "slug": "holotropic-breathwork-freiburg-todtmoos-2025-11-19"
  },
  "write": [
   "slug",
   "city",
   "venue",
   "address",
   "maps",
   "arrival"
  ]
 },
 {
  "match": {
   "date": "20.11.2025 - 23.11.2025",
   "title": ""
  },
  "row": {
   "date": "20.11.2025 - 23.11.2025",
   "facilitator": "Stefan Dressler",
   "title": "Intensive: \"The Central Drama\" + Holotropic Breathwork",
   "description": "Stefan Dressler's seminar on the victim-perpetrator dynamic, one of the most common patterns we create in relationships. Traces it to early childhood separation from the mother and to the two core relational traumas, invasion and abandonment, working experientially to help participants step out of the pattern.",
   "module": "Module 7",
   "location": "Germany",
   "type1": "Holotropic Breathwork",
   "type2": "",
   "city": "Freiburg",
   "venue": "Haus am Mühlenbach, Todtmoos",
   "address": "Mühlematt 6, 79682 Todtmoos-Au, Germany",
   "maps": "https://www.google.com/maps/search/?api=1&query=Haus%20am%20M%C3%BChlenbach%2C%20M%C3%BChlematt%206%2C%2079682%20Todtmoos-Au%2C%20Germany",
   "arrival": "https://transpersonal-training.com/venues/#getting-to-todtmoos",
   "slug": "intensive-the-central-drama-holotropic-breathwork-freiburg-todtmoos-2025-11-20"
  },
  "write": [
   "title",
   "facilitator",
   "slug",
   "city",
   "venue",
   "address",
   "maps",
   "arrival"
  ]
 },
 {
  "match": {
   "date": "05.12.2025 - 07.12.2025",
   "title": "(Option) Intensive: Holotropic Breathwork in Milan"
  },
  "row": {
   "date": "05.12.2025 - 07.12.2025",
   "facilitator": "Kati Wortelkamp & Mario Lorenzetti",
   "title": "(Option) Intensive: Holotropic Breathwork in Milan",
   "description": "A weekend built around one Holotropic Breathwork session, with participants alternating as breather and sitter. Accelerated breathing, evocative music and bodywork open access to non-ordinary states for healing, followed by mandala drawing and group sharing.",
   "module": "-",
   "location": "Italy",
   "type1": "Holotropic Breathwork",
   "type2": "",
   "city": "Milan",
   "venue": "",
   "address": "",
   "maps": "https://www.google.com/maps/search/?api=1&query=Milan%2C%20Italy",
   "arrival": "",
   "slug": "intensive-holotropic-breathwork-in-milan-2025-12-05"
  },
  "write": [
   "slug",
   "city",
   "venue",
   "address",
   "maps",
   "arrival"
  ]
 },
 {
  "match": {
   "date": "04.03.2026 - 08.03.2026",
   "title": "Intensive: \"Harmony in Shadows\" + Holotropic Breathwork"
  },
  "row": {
   "date": "04.03.2026 - 08.03.2026",
   "facilitator": "Nicolas Cambas",
   "title": "Intensive: \"Harmony in Shadows\" + Holotropic Breathwork",
   "description": "Nicolas Cambas’s trauma-work seminar \"Harmony in Shadows\", paired with daily Holotropic Breathwork. Works with the disowned and shadow parts left behind by traumatic experience, bringing them back into relationship with the rest of the self rather than fighting them.",
   "module": "Module 9",
   "location": "Germany",
   "type1": "Seminar",
   "type2": "Holotropic Breathwork",
   "city": "Freiburg",
   "venue": "Haus am Mühlenbach, Todtmoos",
   "address": "Mühlematt 6, 79682 Todtmoos-Au, Germany",
   "maps": "https://www.google.com/maps/search/?api=1&query=Haus%20am%20M%C3%BChlenbach%2C%20M%C3%BChlematt%206%2C%2079682%20Todtmoos-Au%2C%20Germany",
   "arrival": "https://transpersonal-training.com/venues/#getting-to-todtmoos",
   "slug": "intensive-harmony-in-shadows-holotropic-breathwork-freiburg-todtmoos-2026-03-04"
  },
  "write": [
   "slug",
   "city",
   "venue",
   "address",
   "maps",
   "arrival"
  ]
 },
 {
  "match": {
   "date": "05.06.2026 - 07.06.2026",
   "title": "Option: Summer School in Moldova"
  },
  "row": {
   "date": "05.06.2026 - 07.06.2026",
   "facilitator": "-",
   "title": "Option: Summer School in Moldova",
   "description": "A multi-day summer school combining transpersonal theory with a closing group ceremony. The ceremony uses ritual and collective presence to help integrate what has emerged during the training and restore a felt sense of belonging.",
   "module": "-",
   "location": "Moldova",
   "type1": "Seminar",
   "type2": "Holotropic Breathwork",
   "city": "Chisinau",
   "venue": "",
   "address": "",
   "maps": "https://www.google.com/maps/search/?api=1&query=Chisinau%2C%20Moldova",
   "arrival": "",
   "slug": "summer-school-in-moldova-chisinau-2026-06-05"
  },
  "write": [
   "slug",
   "city",
   "venue",
   "address",
   "maps",
   "arrival"
  ]
 },
 {
  "match": {
   "date": "01.07.2026 - 05.07.2026",
   "title": "Intensive: \"How to work with a Group\" + Holotropic Breathwork"
  },
  "row": {
   "date": "01.07.2026 - 05.07.2026",
   "facilitator": "Lyudmila Skartsesku, Kati Wortelkamp",
   "title": "Intensive: \"How to work with a Group\" + Holotropic Breathwork",
   "description": "An intensive on holding and facilitating a therapeutic group, paired with a Holotropic Breathwork session. Covers reading group dynamics and holding space for different individual processes at once, grounded immediately in a shared breathwork experience.",
   "module": "Module 10",
   "location": "Germany",
   "type1": "Holotropic Breathwork",
   "type2": "Seminar",
   "city": "Freiburg",
   "venue": "Haus am Mühlenbach, Todtmoos",
   "address": "Mühlematt 6, 79682 Todtmoos-Au, Germany",
   "maps": "https://www.google.com/maps/search/?api=1&query=Haus%20am%20M%C3%BChlenbach%2C%20M%C3%BChlematt%206%2C%2079682%20Todtmoos-Au%2C%20Germany",
   "arrival": "https://transpersonal-training.com/venues/#getting-to-todtmoos",
   "slug": "intensive-how-to-work-with-a-group-holotropic-breathwork-freiburg-todtmoos-2026-07-01"
  },
  "write": [
   "slug",
   "city",
   "venue",
   "address",
   "maps",
   "arrival"
  ]
 },
 {
  "match": {
   "date": "31.07.2026 - 02.08.2026",
   "title": "Option: Triple Grof Breathwork (Riga)"
  },
  "row": {
   "date": "31.07.2026 - 02.08.2026",
   "facilitator": "Sigits Duduris",
   "title": "Option: Triple Grof Breathwork (Riga)",
   "description": "An intensive weekend offering three Holotropic Breathwork sessions, with participants rotating through the roles of breather and sitter. Repeated breathwork allows deeper, more sustained access to non-ordinary states, with group sharing and mandala work after each session.",
   "module": "-",
   "location": "Latvia",
   "type1": "Holotropic Breathwork",
   "type2": "",
   "city": "Riga",
   "venue": "",
   "address": "",
   "maps": "https://www.google.com/maps/search/?api=1&query=Riga%2C%20Latvia",
   "arrival": "",
   "slug": "triple-grof-breathwork-riga-2026-07-31"
  },
  "write": [
   "slug",
   "city",
   "venue",
   "address",
   "maps",
   "arrival"
  ]
 },
 {
  "match": {
   "date": "27.08.2026 - 30.08.2026",
   "title": "Option: Double Holotropic Breathwork (Todtmoos)"
  },
  "row": {
   "date": "27.08.2026 - 30.08.2026",
   "facilitator": "Ursula Boger",
   "title": "Option: Double Holotropic Breathwork (Todtmoos)",
   "description": "A weekend built around two Holotropic Breathwork sessions, with participants alternating as breather and sitter. Grof's method of accelerated breathing, music and bodywork opens access to non-ordinary states for healing, followed by mandala drawing and group sharing.",
   "module": "-",
   "location": "Germany",
   "type1": "Holotropic Breathwork",
   "type2": "",
   "city": "Freiburg",
   "venue": "Haus am Mühlenbach, Todtmoos",
   "address": "Mühlematt 6, 79682 Todtmoos-Au, Germany",
   "maps": "https://www.google.com/maps/search/?api=1&query=Haus%20am%20M%C3%BChlenbach%2C%20M%C3%BChlematt%206%2C%2079682%20Todtmoos-Au%2C%20Germany",
   "arrival": "https://transpersonal-training.com/venues/#getting-to-todtmoos",
   "slug": "double-holotropic-breathwork-freiburg-todtmoos-2026-08-27"
  },
  "write": [
   "slug",
   "city",
   "venue",
   "address",
   "maps",
   "arrival"
  ]
 },
 {
  "match": {
   "date": "15.09.2026 - 20.09.2026",
   "title": "Intensive: Holotropic Breathwork & \"Working with the Old Central and the Essence\""
  },
  "row": {
   "date": "15.09.2026 - 20.09.2026",
   "facilitator": "Rainer Pervöltz",
   "title": "Intensive: Holotropic Breathwork & \"Working with the Old Central and the Essence\"",
   "description": "Combines Holotropic Breathwork sessions with Rainer Pervöltz’s work on the \"Old Central\" and the \"Essence\": the early defensive organisation that forms around childhood wounding, and the untouched core it protects. Breathwork from 15. to 17.09, then Pervöltz’s seminar from the afternoon of 17.09 until 20.09 at 13:30.",
   "module": "Module 11",
   "location": "Germany",
   "type1": "Seminar",
   "type2": "Holotropic Breathwork",
   "city": "Freiburg",
   "venue": "Haus am Mühlenbach, Todtmoos",
   "address": "Mühlematt 6, 79682 Todtmoos-Au, Germany",
   "maps": "https://www.google.com/maps/search/?api=1&query=Haus%20am%20M%C3%BChlenbach%2C%20M%C3%BChlematt%206%2C%2079682%20Todtmoos-Au%2C%20Germany",
   "arrival": "https://transpersonal-training.com/venues/#getting-to-todtmoos",
   "slug": "intensive-holotropic-breathwork-and-working-with-the-old-central-and-the-essence-freiburg-todtmoos-2026-09-15"
  },
  "write": [
   "slug",
   "city",
   "venue",
   "address",
   "maps",
   "arrival"
  ]
 },
 {
  "match": {
   "date": "21.10.2026 - 25.10.2026",
   "title": "26. Eurotas International Transpersonal Conference (Greece)"
  },
  "row": {
   "date": "21.10.2026 - 25.10.2026",
   "facilitator": "-",
   "title": "26. Eurotas International Transpersonal Conference (Greece)",
   "description": "The 26th Eurotas International Transpersonal Conference in Greece, on the theme \"Myth, Mystery & Transformation\". A gathering of the European transpersonal community with keynotes, workshops and experiential sessions. A pre-conference Holotropic Breathwork with Kati Wortelkamp and Lyudmila Skartsesku is planned for 19.-20.10.2026.",
   "module": "-",
   "location": "Greece",
   "type1": "Conference",
   "type2": "",
   "city": "Athens",
   "venue": "Spetses",
   "address": "",
   "maps": "https://www.google.com/maps/search/?api=1&query=Spetses%2C%20Greece",
   "arrival": "",
   "slug": "26-eurotas-international-transpersonal-conference-athens-spetses-2026-10-21"
  },
  "write": [
   "slug",
   "city",
   "venue",
   "address",
   "maps",
   "arrival"
  ]
 },
 {
  "match": {
   "date": "17.11.2026 - 22.11.2026",
   "title": "Intensive: Holotropic Breathwork & Family Constellation"
  },
  "row": {
   "date": "18.11.2026 - 22.11.2026",
   "facilitator": "Stephan Schillinger",
   "title": "Intensive: Holotropic Breathwork & Family Constellation",
   "description": "Combines a Holotropic Breathwork session with Family Constellations, Bert Hellinger's method for revealing hidden dynamics in a family or ancestral field. Group members represent family members and tune into the field to surface what is excluded or unresolved.",
   "module": "Module 12",
   "location": "Germany",
   "type1": "Family Constellation",
   "type2": "Holotropic Breathwork",
   "city": "Freiburg",
   "venue": "Haus am Mühlenbach, Todtmoos",
   "address": "Mühlematt 6, 79682 Todtmoos-Au, Germany",
   "maps": "https://www.google.com/maps/search/?api=1&query=Haus%20am%20M%C3%BChlenbach%2C%20M%C3%BChlematt%206%2C%2079682%20Todtmoos-Au%2C%20Germany",
   "arrival": "https://transpersonal-training.com/venues/#getting-to-todtmoos",
   "slug": "intensive-holotropic-breathwork-and-family-constellation-freiburg-todtmoos-2026-11-18"
  },
  "write": [
   "date",
   "slug",
   "city",
   "venue",
   "address",
   "maps",
   "arrival"
  ]
 },
 {
  "match": {
   "date": "10.12.2026 - 13.12.2026",
   "title": "Option: Double Holotropic Breathwork"
  },
  "row": {
   "date": "10.12.2026 - 13.12.2026",
   "facilitator": "Ursula Boger",
   "title": "Option: Double Holotropic Breathwork",
   "description": "A weekend built around two Holotropic Breathwork sessions, with participants alternating as breather and sitter. Grof's method of accelerated breathing, music and bodywork opens access to non-ordinary states for healing, followed by mandala drawing and group sharing.",
   "module": "-",
   "location": "Germany",
   "type1": "Holotropic Breathwork",
   "type2": "",
   "city": "Freiburg",
   "venue": "Haus am Mühlenbach, Todtmoos",
   "address": "Mühlematt 6, 79682 Todtmoos-Au, Germany",
   "maps": "https://www.google.com/maps/search/?api=1&query=Haus%20am%20M%C3%BChlenbach%2C%20M%C3%BChlematt%206%2C%2079682%20Todtmoos-Au%2C%20Germany",
   "arrival": "https://transpersonal-training.com/venues/#getting-to-todtmoos",
   "slug": "double-holotropic-breathwork-freiburg-todtmoos-2026-12-10"
  },
  "write": [
   "slug",
   "city",
   "venue",
   "address",
   "maps",
   "arrival"
  ]
 },
 {
  "match": {
   "date": "16.04.2026 - 19.04.2026",
   "title": "Option: Double Holotropic Breathwork (Todtmoos)"
  },
  "row": {
   "date": "16.04.2026 - 19.04.2026",
   "facilitator": "-",
   "title": "Option: Double Holotropic Breathwork (Todtmoos)",
   "description": "A weekend built around two Holotropic Breathwork sessions, with participants alternating as breather and sitter. Grof's method of accelerated breathing, music and bodywork opens access to non-ordinary states for healing, followed by mandala drawing and group sharing.",
   "module": "-",
   "location": "Germany",
   "type1": "Holotropic Breathwork",
   "type2": "",
   "city": "Freiburg",
   "venue": "Haus am Mühlenbach, Todtmoos",
   "address": "Mühlematt 6, 79682 Todtmoos-Au, Germany",
   "maps": "https://www.google.com/maps/search/?api=1&query=Haus%20am%20M%C3%BChlenbach%2C%20M%C3%BChlematt%206%2C%2079682%20Todtmoos-Au%2C%20Germany",
   "arrival": "https://transpersonal-training.com/venues/#getting-to-todtmoos",
   "slug": "double-holotropic-breathwork-freiburg-todtmoos-2026-04-16"
  },
  "write": [
   "slug",
   "city",
   "venue",
   "address",
   "maps",
   "arrival"
  ]
 },
 {
  "match": {
   "date": "22.05.2026 - 24.05.2026",
   "title": "Eurotas Symposium (Portugal)"
  },
  "row": {
   "date": "22.05.2026 - 24.05.2026",
   "facilitator": "-",
   "title": "Eurotas Symposium (Portugal)",
   "description": "A EUROTAS symposium in Portugal on the theme \"Happy Babies - Full Incarnations\", dedicated to the prenatal and perinatal period and the imprint it leaves on personality. A multi-day program of talks and experiential workshops connecting the training to the wider transpersonal field.",
   "module": "-",
   "location": "Portugal",
   "type1": "Conference",
   "type2": "",
   "city": "",
   "venue": "",
   "address": "",
   "maps": "",
   "arrival": "",
   "slug": "eurotas-symposium-portugal-2026-05-22"
  },
  "write": [
   "slug",
   "city",
   "venue",
   "address",
   "maps",
   "arrival"
  ]
 },
 {
  "match": {
   "date": "29.05.2026 - 31.05.2026",
   "title": "Option: Grand Breathwork Day (Bucharest)"
  },
  "row": {
   "date": "29.05.2026 - 31.05.2026",
   "facilitator": "Lyudmila Skartsesku",
   "title": "Option: Grand Breathwork Day (Bucharest)",
   "description": "A large-scale Holotropic Breathwork day in Bucharest led by Lyudmila Skartsesku, with participants alternating as breather and sitter. Accelerated breathing, evocative music and bodywork open access to non-ordinary states for healing, followed by mandala drawing and group sharing.",
   "module": "-",
   "location": "Romania",
   "type1": "Holotropic Breathwork",
   "type2": "",
   "city": "Bucharest",
   "venue": "",
   "address": "",
   "maps": "https://www.google.com/maps/search/?api=1&query=Bucharest%2C%20Romania",
   "arrival": "",
   "slug": "grand-breathwork-day-bucharest-2026-05-29"
  },
  "write": [
   "slug",
   "city",
   "venue",
   "address",
   "maps",
   "arrival"
  ]
 },
 {
  "match": {
   "date": "24.02.2027 - 28.02.2027",
   "title": "Intensive: Bodywork in Holotropic Breathwork"
  },
  "row": {
   "date": "24.02.2027 - 28.02.2027",
   "facilitator": "Gisela Möhle",
   "title": "Intensive: Bodywork in Holotropic Breathwork",
   "description": "An intensive focused on the body dimension of Holotropic Breathwork: reading physical tension, resistance and small involuntary movements during a session, and using touch and bodywork to support their release. Includes supervised practice giving and receiving bodywork.",
   "module": "Module 12",
   "location": "Germany",
   "type1": "Seminar",
   "type2": "Holotropic Breathwork",
   "city": "Freiburg",
   "venue": "Haus am Mühlenbach, Todtmoos",
   "address": "Mühlematt 6, 79682 Todtmoos-Au, Germany",
   "maps": "https://www.google.com/maps/search/?api=1&query=Haus%20am%20M%C3%BChlenbach%2C%20M%C3%BChlematt%206%2C%2079682%20Todtmoos-Au%2C%20Germany",
   "arrival": "https://transpersonal-training.com/venues/#getting-to-todtmoos",
   "slug": "intensive-bodywork-in-holotropic-breathwork-freiburg-todtmoos-2027-02-24"
  },
  "write": [
   "module",
   "slug",
   "city",
   "venue",
   "address",
   "maps",
   "arrival"
  ]
 },
 {
  "match": {
   "date": "06.04.2027 - 11.04.2027",
   "title": "Intensive: Holotropic Breathwork & \"Working with the Old Central and the Essence\""
  },
  "row": {
   "date": "06.04.2027 - 11.04.2027",
   "facilitator": "Rainer Pervöltz",
   "title": "Intensive: Holotropic Breathwork & \"Working with the Old Central and the Essence\"",
   "description": "Combines Holotropic Breathwork sessions with Rainer Pervöltz's work on the \"Old Central\" and the \"Essence\": the early defensive organisation that forms around childhood wounding, and the untouched core it protects. Holotropic Breathwork from 6 April, then Pervöltz's seminar from the afternoon of 8 April until 11 April at 13:30.",
   "module": "Module 13",
   "location": "Germany",
   "type1": "Seminar",
   "type2": "Holotropic Breathwork",
   "city": "Freiburg",
   "venue": "Haus am Mühlenbach, Todtmoos",
   "address": "Mühlematt 6, 79682 Todtmoos-Au, Germany",
   "maps": "https://www.google.com/maps/search/?api=1&query=Haus%20am%20M%C3%BChlenbach%2C%20M%C3%BChlematt%206%2C%2079682%20Todtmoos-Au%2C%20Germany",
   "arrival": "https://transpersonal-training.com/venues/#getting-to-todtmoos",
   "slug": "intensive-holotropic-breathwork-and-working-with-the-old-central-and-the-essence-freiburg-todtmoos-2027-04-06"
  },
  "write": [
   "module",
   "description",
   "slug",
   "city",
   "venue",
   "address",
   "maps",
   "arrival"
  ]
 },
 {
  "match": {
   "date": "01.07.2027 - 04.07.2027",
   "title": "Intensive in Todtmoos (topic to be announced)"
  },
  "row": {
   "date": "01.07.2027 - 04.07.2027",
   "facilitator": "Tina Lindhard",
   "title": "Intensive: Students conducting Holotropic Breathwork + Seminar with Tina Lindhard",
   "description": "A residential intensive in Todtmoos in two parts: students conduct Holotropic Breathwork sessions themselves, as facilitators under supervision, and Tina Lindhard leads a seminar alongside the practice. A follow-up online lecture on 27 July 2027 continues the work of the seminar.",
   "module": "Module 13",
   "location": "Germany",
   "type1": "Holotropic Breathwork",
   "type2": "Seminar",
   "city": "Freiburg",
   "venue": "Haus am Mühlenbach, Todtmoos",
   "address": "Mühlematt 6, 79682 Todtmoos-Au, Germany",
   "maps": "https://www.google.com/maps/search/?api=1&query=Haus%20am%20M%C3%BChlenbach%2C%20M%C3%BChlematt%206%2C%2079682%20Todtmoos-Au%2C%20Germany",
   "arrival": "https://transpersonal-training.com/venues/#getting-to-todtmoos",
   "slug": "intensive-students-conducting-holotropic-breathwork-seminar-with-tina-lindhard-freiburg-todtmoos-2027-07-01"
  },
  "write": [
   "title",
   "facilitator",
   "module",
   "type2",
   "description",
   "slug",
   "city",
   "venue",
   "address",
   "maps",
   "arrival"
  ]
 },
 {
  "match": {
   "date": "16.09.2027 - 19.09.2027",
   "title": "Intensive in Todtmoos (topic to be announced)"
  },
  "row": {
   "date": "16.09.2027 - 19.09.2027",
   "facilitator": "Dario Hampi Pacari & Anna Milaeva",
   "title": "Certification Celebration",
   "description": "The closing gathering of the 2023–2027 cohort in Todtmoos: a celebration of the certification with ceremony led by Dario Hampi Pacari and Anna Milaeva, after the final online test weekend of 11–12 September 2027 (Hero’s Journey presentation and counseling skills test).",
   "module": "Module 13",
   "location": "Germany",
   "type1": "Ceremony",
   "type2": "Holotropic Breathwork",
   "city": "Freiburg",
   "venue": "Haus am Mühlenbach, Todtmoos",
   "address": "Mühlematt 6, 79682 Todtmoos-Au, Germany",
   "maps": "https://www.google.com/maps/search/?api=1&query=Haus%20am%20M%C3%BChlenbach%2C%20M%C3%BChlematt%206%2C%2079682%20Todtmoos-Au%2C%20Germany",
   "arrival": "https://transpersonal-training.com/venues/#getting-to-todtmoos",
   "slug": "certification-celebration-freiburg-todtmoos-2027-09-16"
  },
  "write": [
   "title",
   "facilitator",
   "module",
   "type1",
   "type2",
   "description",
   "slug",
   "city",
   "venue",
   "address",
   "maps",
   "arrival"
  ]
 },
 {
  "match": {
   "date": "18.11.2027 - 21.11.2027",
   "title": "Intensive in Todtmoos (topic to be announced)"
  },
  "row": {
   "date": "18.11.2027 - 21.11.2027",
   "facilitator": "-",
   "title": "Option: Students conducting Breathwork Sessions (Practice & Supervision)",
   "description": "An optional practice weekend in Todtmoos where students conduct Holotropic Breathwork sessions themselves, with supervision and feedback from the faculty: breathers, sitters and facilitators in training working together.",
   "module": "-",
   "location": "Germany",
   "type1": "Holotropic Breathwork",
   "type2": "",
   "city": "Freiburg",
   "venue": "Haus am Mühlenbach, Todtmoos",
   "address": "Mühlematt 6, 79682 Todtmoos-Au, Germany",
   "maps": "https://www.google.com/maps/search/?api=1&query=Haus%20am%20M%C3%BChlenbach%2C%20M%C3%BChlematt%206%2C%2079682%20Todtmoos-Au%2C%20Germany",
   "arrival": "https://transpersonal-training.com/venues/#getting-to-todtmoos",
   "slug": "students-conducting-breathwork-sessions-freiburg-todtmoos-2027-11-18"
  },
  "write": [
   "title",
   "module",
   "description",
   "slug",
   "city",
   "venue",
   "address",
   "maps",
   "arrival"
  ]
 },
 {
  "match": null,
  "row": {
   "date": "28.01.2027 - 31.01.2027",
   "facilitator": "-",
   "title": "Option: Double Holotropic Breathwork (Tuscany)",
   "description": "A weekend built around two Holotropic Breathwork sessions, with participants alternating as breather and sitter. Grof's method of accelerated breathing, music and bodywork opens access to non-ordinary states for healing, followed by mandala drawing and group sharing.",
   "module": "-",
   "location": "Italy",
   "type1": "Holotropic Breathwork",
   "type2": "",
   "city": "Grosseto",
   "venue": "Tenuta di Monteverdi, Tuscany",
   "address": "Località Monteverdi, 58045 Paganico (GR), Italy",
   "maps": "https://www.google.com/maps/search/?api=1&query=Tenuta%20di%20Monteverdi%2C%20Localit%C3%A0%20Monteverdi%2C%2058045%20Paganico%20GR%2C%20Italy",
   "arrival": "https://transpersonal-training.com/venues/#getting-to-monteverdi",
   "slug": "double-holotropic-breathwork-grosseto-monteverdi-2027-01-28"
  },
  "write": [
   "date",
   "facilitator",
   "title",
   "description",
   "module",
   "location",
   "type1",
   "type2",
   "city",
   "venue",
   "address",
   "maps",
   "arrival",
   "slug"
  ]
 },
 {
  "match": null,
  "row": {
   "date": "April or May 2027",
   "facilitator": "-",
   "title": "Option: Double Holotropic Breathwork (Tuscany)",
   "description": "A weekend built around two Holotropic Breathwork sessions, with participants alternating as breather and sitter. Grof's method of accelerated breathing, music and bodywork opens access to non-ordinary states for healing, followed by mandala drawing and group sharing.",
   "module": "-",
   "location": "Italy",
   "type1": "Holotropic Breathwork",
   "type2": "",
   "city": "Grosseto",
   "venue": "Tenuta di Monteverdi, Tuscany",
   "address": "Località Monteverdi, 58045 Paganico (GR), Italy",
   "maps": "https://www.google.com/maps/search/?api=1&query=Tenuta%20di%20Monteverdi%2C%20Localit%C3%A0%20Monteverdi%2C%2058045%20Paganico%20GR%2C%20Italy",
   "arrival": "https://transpersonal-training.com/venues/#getting-to-monteverdi",
   "slug": "double-holotropic-breathwork-grosseto-monteverdi-april-or-may-2027"
  },
  "write": [
   "date",
   "facilitator",
   "title",
   "description",
   "module",
   "location",
   "type1",
   "type2",
   "city",
   "venue",
   "address",
   "maps",
   "arrival",
   "slug"
  ]
 },
 {
  "match": null,
  "row": {
   "date": "22.06.2027 - 27.06.2027",
   "facilitator": "-",
   "title": "Summer School in Moldova",
   "description": "A multi-day summer school combining transpersonal theory with a closing group ceremony. The ceremony uses ritual and collective presence to help integrate what has emerged during the training and restore a felt sense of belonging.",
   "module": "Module 13",
   "location": "Moldova",
   "type1": "Seminar",
   "type2": "Holotropic Breathwork",
   "city": "Chisinau",
   "venue": "",
   "address": "",
   "maps": "https://www.google.com/maps/search/?api=1&query=Chisinau%2C%20Moldova",
   "arrival": "",
   "slug": "summer-school-in-moldova-chisinau-2027-06-22"
  },
  "write": [
   "date",
   "facilitator",
   "title",
   "description",
   "module",
   "location",
   "type1",
   "type2",
   "city",
   "venue",
   "address",
   "maps",
   "arrival",
   "slug"
  ]
 }
];

// [date dd/MM/yyyy, title, teacher 1, teacher 2, module, description (null = keep), match undated row by this title]
var PROGRAM_UPDATE_LECTURES_ = [
 [
  "29/09/2026",
  "Strategy of Holotropic Sessions 2",
  "Lyudmila Skartsesku",
  "",
  "11",
  "Covers how a facilitator reads and supports the unfolding of a Holotropic Breathwork session: recognizing the phases a breather moves through and choosing when to intervene with bodywork, touch or simply presence. Builds practical facilitation skill."
 ],
 [
  "06/10/2026",
  "Supervision",
  "Lyudmila Skartsesku",
  "",
  "11",
  "Supervision session reviewing participants' own experience facilitating Holotropic Breathwork sessions, with group feedback on technique, boundaries and self-care as a facilitator. Continues the practical facilitation strand of the training."
 ],
 [
  "13/10/2026",
  "Supervision",
  "Lyudmila Skartsesku",
  "",
  "11",
  "Supervision session reviewing participants' own experience facilitating Holotropic Breathwork sessions, with group feedback on technique, boundaries and self-care as a facilitator. Continues the practical facilitation strand of the training."
 ],
 [
  "27/10/2026",
  "Strategy of Holotropic Sessions 1",
  "Lyudmila Skartsesku",
  "",
  "11",
  "Covers how a facilitator reads and supports the unfolding of a Holotropic Breathwork session: recognizing the phases a breather moves through and choosing when to intervene with bodywork, touch or simply presence. Builds practical facilitation skill."
 ],
 [
  "03/11/2026",
  "Strategy of Holotropic Sessions 2",
  "Lyudmila Skartsesku",
  "",
  "11",
  "Covers how a facilitator reads and supports the unfolding of a Holotropic Breathwork session: recognizing the phases a breather moves through and choosing when to intervene with bodywork, touch or simply presence. Builds practical facilitation skill."
 ],
 [
  "10/11/2026",
  "Spiritual Bypassing",
  "Prof. Jure Biechonski",
  "",
  "11",
  "Jure Biechonski on spiritual bypassing: using spiritual ideas and practices to sidestep unresolved psychological wounds and unfinished developmental tasks. How it shows up in clients, in groups and in facilitators themselves, and how to work with it without dismissing the spiritual experience."
 ],
 [
  "17/11/2026",
  "The dream of happiness. Waking up, the Perinatal and more…",
  "Dr. Ingo Jahrsetz",
  "",
  "11",
  "Dr. Ingo Jahrsetz on the dream of happiness and what 'waking up' means in transpersonal work: how perinatal material and the longing for a lost paradise shape what we chase as happiness, and what changes when that pattern becomes conscious."
 ],
 [
  "24/11/2026",
  "Integration",
  "Stephan Schillinger",
  "",
  "11",
  null
 ],
 [
  "01/12/2026",
  "Practice and Supervision",
  "Lyudmila Skartsesku",
  "",
  "11",
  "Practice and supervision: participants work in small groups on counseling and breathwork facilitation, then bring their sessions back to the group for feedback on technique, boundaries and self-care as a facilitator."
 ],
 [
  "08/12/2026",
  "Transpersonal aspects of emotions in general and shame in particular",
  "Dr. Stefan Dressler",
  "",
  "11",
  "Dr. Stefan Dressler on emotions from a transpersonal point of view, and on shame in particular: how it isolates, how it hides behind other emotions, and how to meet it in a session without deepening it."
 ],
 [
  "15/12/2026",
  "Spiritual Emergency I",
  "Tina Lindhard, PhD",
  "",
  "11",
  "Stanislav Grof's concept of 'spiritual emergency': intense psychospiritual crises that resemble psychiatric emergencies but are, in the right context, a difficult stage of growth rather than pathology. How to recognise one and how to accompany it."
 ],
 [
  "22/12/2026",
  "Spiritual Emergency II",
  "Tina Lindhard, PhD",
  "",
  "12",
  "Second part on spiritual emergency: case material and the practical side of accompanying a person through a psychospiritual crisis — setting, support network, and when psychiatric help is needed."
 ],
 [
  "12/01/2027",
  "Practice and Supervision",
  "Lyudmila Skartsesku",
  "",
  "12",
  "Practice and supervision: participants work in small groups on counseling and breathwork facilitation, then bring their sessions back to the group for feedback on technique, boundaries and self-care as a facilitator."
 ],
 [
  "19/01/2027",
  "Practice and Supervision",
  "Lyudmila Skartsesku",
  "",
  "12",
  "Practice and supervision: participants work in small groups on counseling and breathwork facilitation, then bring their sessions back to the group for feedback on technique, boundaries and self-care as a facilitator."
 ],
 [
  "26/01/2027",
  "Practice and Supervision",
  "Lyudmila Skartsesku",
  "",
  "12",
  "Practice and supervision: participants work in small groups on counseling and breathwork facilitation, then bring their sessions back to the group for feedback on technique, boundaries and self-care as a facilitator."
 ],
 [
  "02/02/2027",
  "Strategy of Holotropic Sessions",
  "Lyudmila Skartsesku",
  "",
  "12",
  "Covers how a facilitator reads and supports the unfolding of a Holotropic Breathwork session: recognizing the phases a breather moves through and choosing when to intervene with bodywork, touch or simply presence. Builds practical facilitation skill."
 ],
 [
  "09/02/2027",
  "Strategy of Holotropic Sessions",
  "Lyudmila Skartsesku",
  "",
  "12",
  "Covers how a facilitator reads and supports the unfolding of a Holotropic Breathwork session: recognizing the phases a breather moves through and choosing when to intervene with bodywork, touch or simply presence. Builds practical facilitation skill."
 ],
 [
  "16/02/2027",
  "Rituals, Shamanic Healing, and Community",
  "Steven Schmitz, Ph.D.",
  "",
  "12",
  "Steven Schmitz on ritual and shamanic healing as community practices: how traditional cultures hold non-ordinary states within ritual and community, and what modern transpersonal work can learn from that container."
 ],
 [
  "23/02/2027",
  "How to Integrate Shamanism in your Everyday Life",
  "Steven Schmitz, Ph.D.",
  "",
  "12",
  "Steven Schmitz on bringing shamanic practice into ordinary life: simple daily practices, relationship with nature and community, and keeping the insights of ceremony alive between ceremonies."
 ],
 [
  "02/03/2027",
  "Student's Meeting",
  "",
  "",
  "12",
  "An evening for the student group without a lecture: organisation of the coming module, peer exchange and space for questions about the training."
 ],
 [
  "09/03/2027",
  "Practice and Supervision",
  "Lyudmila Skartsesku",
  "",
  "12",
  "Practice and supervision: participants work in small groups on counseling and breathwork facilitation, then bring their sessions back to the group for feedback on technique, boundaries and self-care as a facilitator."
 ],
 [
  "16/03/2027",
  "Practice and Supervision",
  "Prof. Jure Biechonski",
  "",
  "12",
  "Practice and supervision: participants work in small groups on counseling and breathwork facilitation, then bring their sessions back to the group for feedback on technique, boundaries and self-care as a facilitator."
 ],
 [
  "23/03/2027",
  "How sound affects the brain / Music in Holotropic Breathwork I",
  "Fabio Malizia",
  "",
  "13",
  null,
  "How sound affects the brain / Music in Holotropic Breathwork I"
 ],
 [
  "13/04/2027",
  "Student's Meeting",
  "",
  "",
  "13",
  "An evening for the student group without a lecture: organisation of the coming module, peer exchange and space for questions about the training."
 ],
 [
  "20/04/2027",
  "Psychopathology in Grof's Point of View",
  "Kati Wortelkamp",
  "",
  "13",
  "Presents Stanislav Grof's reframing of psychopathology: symptoms understood not as illness to suppress but as unprocessed perinatal and biographical material seeking resolution. Contrasts this transpersonal reading with the conventional psychiatric model."
 ],
 [
  "27/04/2027",
  "Practice and Supervision",
  "Jure Biechonski",
  "",
  "13",
  "Practice and supervision: participants work in small groups on counseling and breathwork facilitation, then bring their sessions back to the group for feedback on technique, boundaries and self-care as a facilitator."
 ],
 [
  "04/05/2027",
  "Practice and Supervision",
  "Jure Biechonski",
  "",
  "13",
  "Practice and supervision: participants work in small groups on counseling and breathwork facilitation, then bring their sessions back to the group for feedback on technique, boundaries and self-care as a facilitator."
 ],
 [
  "11/05/2027",
  "Practice and Supervision",
  "Jure Biechonski",
  "",
  "13",
  "Practice and supervision: participants work in small groups on counseling and breathwork facilitation, then bring their sessions back to the group for feedback on technique, boundaries and self-care as a facilitator."
 ],
 [
  "18/05/2027",
  "Why we meditate",
  "Dr. Tina Lindhard",
  "",
  "13",
  "Dr. Tina Lindhard on why we meditate: what meditation does to attention, emotion and the sense of self, and why a steady practice matters for anyone who accompanies others into non-ordinary states."
 ],
 [
  "25/05/2027",
  "Arka Dhyana method I and heart based emotional therapy",
  "Dr. Tina Lindhard",
  "",
  "13",
  "Tina Lindhard introduces Arka Dhyana, a heart-centred meditation method, and its use in heart-based emotional therapy: working from the heart's felt sense rather than from thinking about feelings. Theory, guided practice and reflection."
 ],
 [
  "01/06/2027",
  "Arka Dhyana method II and heart based therapy",
  "Dr. Tina Lindhard",
  "",
  "13",
  "Tina Lindhard introduces Arka Dhyana, a heart-centred meditation method, and its use in heart-based emotional therapy: working from the heart's felt sense rather than from thinking about feelings. Theory, guided practice and reflection."
 ],
 [
  "08/06/2027",
  "Arka Dhyana method III and heart based therapy",
  "Dr. Tina Lindhard",
  "",
  "13",
  "Tina Lindhard introduces Arka Dhyana, a heart-centred meditation method, and its use in heart-based emotional therapy: working from the heart's felt sense rather than from thinking about feelings. Theory, guided practice and reflection."
 ],
 [
  "15/06/2027",
  "Arka Dhyana method IV and heart based therapy",
  "Dr. Tina Lindhard",
  "",
  "13",
  "Tina Lindhard introduces Arka Dhyana, a heart-centred meditation method, and its use in heart-based emotional therapy: working from the heart's felt sense rather than from thinking about feelings. Theory, guided practice and reflection."
 ],
 [
  "06/07/2027",
  "Student's Meeting / Ethics in Holotropic Breathwork",
  "Kati Wortelkamp",
  "",
  "13",
  "Students' meeting combined with a lecture by Kati Wortelkamp on ethics in Holotropic Breathwork: informed consent, physical and psychological safety, boundaries and the power imbalance between facilitator and breather."
 ],
 [
  "13/07/2027",
  "Student's Meeting (optional)",
  "",
  "",
  "13",
  "An evening for the student group without a lecture: organisation of the coming module, peer exchange and space for questions about the training."
 ],
 [
  "20/07/2027",
  "Student's Meeting (optional)",
  "",
  "",
  "13",
  "An evening for the student group without a lecture: organisation of the coming module, peer exchange and space for questions about the training."
 ],
 [
  "27/07/2027",
  "Follow-up to Tina Lindhard's seminar",
  "Tina Lindhard, PhD",
  "",
  "13",
  "Online follow-up to Tina Lindhard's seminar in Todtmoos (1–4 July 2027): sharing what has stayed with participants and integrating it into practice."
 ],
 [
  "11/09/2027",
  "Final test online weekend (11–12 September): Hero’s Journey presentation, Counseling Skills test",
  "",
  "",
  "13",
  "The final online test weekend before certification: each student presents their Hero’s Journey and takes the counseling skills test."
 ]
];

function applyProgramUpdateNov2026() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var s = applySeminarUpdate_(ss.getSheetByName('Seminars'));
  var l = applyLectureUpdate_(ss.getSheetByName('Lectures'));
  var msg = 'Seminars: ' + s.updated + ' rows updated, ' + s.added + ' added.\n' +
            'Lectures: ' + l.updated + ' rows updated, ' + l.added + ' added.\n\n' +
            'Now run 🔄 Update Website.';
  Logger.log(msg);
  try { SpreadsheetApp.getUi().alert('Program update applied', msg, SpreadsheetApp.getUi().ButtonSet.OK); } catch (e) {}
}

function headerIndex_(sheet, names) {
  var lastCol = sheet.getLastColumn();
  var headers = sheet.getRange(1, 1, 1, lastCol).getDisplayValues()[0];
  var idx = {};
  headers.forEach(function (h, i) { if (h) idx[h.toString().trim().toLowerCase()] = i + 1; });
  (names || []).forEach(function (name) {
    var key = name.toLowerCase();
    if (!idx[key]) {
      lastCol += 1;
      sheet.getRange(1, lastCol).setValue(name).setFontWeight('bold');
      idx[key] = lastCol;
    }
  });
  return idx;
}

function applySeminarUpdate_(sheet) {
  var idx = headerIndex_(sheet, ['Slug', 'City', 'Venue', 'Address', 'Maps', 'Arrival']);
  var fields = { date: 'date', facilitator: 'facilitator', title: 'title', description: 'description',
                 module: 'ewtt - module', location: 'location', type1: 'type1', type2: 'type2',
                 slug: 'slug', city: 'city', venue: 'venue', address: 'address', maps: 'maps', arrival: 'arrival' };
  var lastRow = sheet.getLastRow();
  var values = sheet.getRange(1, 1, lastRow, sheet.getLastColumn()).getDisplayValues();
  var dateCol = idx['date'] - 1, titleCol = idx['title'] - 1, slugCol = idx['slug'] - 1;
  var updated = 0, added = 0;

  PROGRAM_UPDATE_SEMINARS_.forEach(function (item) {
    var row = -1;
    for (var r = 1; r < values.length; r++) {
      var d = values[r][dateCol].trim(), t = values[r][titleCol].trim();
      var bySlug = values[r][slugCol] && values[r][slugCol].trim() === item.row.slug;
      var byOld = item.match && d === item.match.date.trim() && t === item.match.title.trim();
      var byNew = d === item.row.date.trim() && t === item.row.title.trim();
      if (bySlug || byOld || byNew) { row = r + 1; break; }
    }
    if (row < 0) { row = sheet.getLastRow() + 1; added++; } else { updated++; }
    // Existing rows: only the cells that change, plus the new columns.
    var keys = row > lastRow ? Object.keys(fields) : item.write;
    keys.forEach(function (k) {
      if (item.row[k] === undefined || item.row[k] === null) return;
      var col = idx[fields[k]];
      if (!col) return;
      sheet.getRange(row, col).setValue(item.row[k]);
    });
    // Keep the in-memory copy in step, so a later item can't match this row.
    var fresh = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getDisplayValues()[0];
    values[row - 1] = fresh;
  });
  return { updated: updated, added: added };
}

function applyLectureUpdate_(sheet) {
  var idx = headerIndex_(sheet, []);
  var tz = Session.getScriptTimeZone();
  var lastRow = sheet.getLastRow();
  var range = sheet.getRange(1, 1, lastRow, sheet.getLastColumn());
  var raw = range.getValues();
  var shown = range.getDisplayValues();
  var dateCol = idx['date'] - 1, titleCol = idx['title'] - 1;
  var updated = 0, added = 0;

  function key(v, display) {
    if (v instanceof Date) return Utilities.formatDate(v, tz, 'dd/MM/yyyy');
    return String(display || '').trim();
  }

  PROGRAM_UPDATE_LECTURES_.forEach(function (l) {
    var date = l[0], title = l[1], t1 = l[2], t2 = l[3], module = l[4], desc = l[5], undatedTitle = l[6];
    var row = -1;
    for (var r = 1; r < raw.length; r++) {
      if (key(raw[r][dateCol], shown[r][dateCol]) === date) { row = r + 1; break; }
    }
    if (row < 0 && undatedTitle) {
      for (var r2 = 1; r2 < raw.length; r2++) {
        if (!shown[r2][dateCol].trim() && shown[r2][titleCol].trim() === undatedTitle) { row = r2 + 1; break; }
      }
    }
    var p = date.split('/');
    var when = new Date(Number(p[2]), Number(p[1]) - 1, Number(p[0]));
    if (row < 0) {
      row = sheet.getLastRow() + 1; added++;
      if (idx['start hour']) sheet.getRange(row, idx['start hour']).setValue('19:00');
      if (idx['finish hour']) sheet.getRange(row, idx['finish hour']).setValue('21:00');
    } else { updated++; }
    // The Lectures tab is a table with a typed Date column: it formats the
    // date itself and refuses setNumberFormat.
    sheet.getRange(row, idx['date']).setValue(when);
    sheet.getRange(row, idx['title']).setValue(title);
    sheet.getRange(row, idx['teacher 1']).setValue(t1);
    sheet.getRange(row, idx['teacher 2']).setValue(t2);
    sheet.getRange(row, idx['module']).setValue(Number(module));
    if (desc !== null && desc !== undefined) sheet.getRange(row, idx['description']).setValue(desc);
    // refresh the copy for the next lookups
    var fresh = sheet.getRange(row, 1, 1, sheet.getLastColumn());
    raw[row - 1] = fresh.getValues()[0];
    shown[row - 1] = fresh.getDisplayValues()[0];
  });

  // No sorting here: the tab is a table, and the website orders lectures
  // by date on its own.
  return { updated: updated, added: added };
}
