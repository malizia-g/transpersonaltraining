// Student and alumni testimonials, read from src/_data/testimonials/*.md.
//
// Same shape as teachers.js and collaborations.js: one Markdown file per
// person, front matter for the metadata, body for the quote itself.
//
// Returns [] when the directory is empty, and every template that uses this
// guards on `testimonials.length` — so the section simply does not render until
// real quotes exist. That is deliberate. Placeholder testimonials would be a
// lie to prospective students, and if they were ever marked up as review
// structured data they would breach Google's guidelines as well.
//
// Collecting them is step 11 / Phase F of docs/MARKETING_AND_SEO.md: 5–10 short
// quotes from current East/West students, with name, photo and cohort, and with
// written consent to publish.
//
// File format — src/_data/testimonials/anna-schmidt.md:
//
//     ---
//     name: Anna Schmidt
//     cohort: Western track, Level 3
//     photo: /assets/images/people/students/anna-schmidt.jpg   # optional
//     order: 1                                                 # optional
//     ---
//     The first year undid more of me than I expected, and put it back better.
//
// Keep quotes to two or three sentences: the cards are read at a glance.

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const DIR = path.join(__dirname, 'testimonials');

module.exports = function () {
  let files;
  try {
    files = fs.readdirSync(DIR).filter((f) => f.endsWith('.md'));
  } catch (error) {
    return []; // directory not created yet
  }

  return files
    .map((filename) => {
      const parsed = matter(fs.readFileSync(path.join(DIR, filename), 'utf-8'));
      return {
        name: parsed.data.name || '',
        cohort: parsed.data.cohort || '',
        photo: parsed.data.photo || '',
        order: typeof parsed.data.order === 'number' ? parsed.data.order : 999,
        quote: parsed.content.trim()
      };
    })
    // A quote with nobody behind it is not a testimonial — drop it rather than
    // render an anonymous card.
    .filter((t) => t.quote && t.name)
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
};
