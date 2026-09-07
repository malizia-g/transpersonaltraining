const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Every teacher lives in its own Markdown file under _data/teachers/, with a
// `section: core|guest|alumni` field in its frontmatter. That field is what
// decides which part of the Teachers page a person appears in — moving
// someone between sections (or reordering them) only ever means editing
// that file, never the template.
module.exports = function() {
  const teachersDir = path.join(__dirname, 'teachers');

  const files = fs.readdirSync(teachersDir).filter(file => file.endsWith('.md'));

  function parseSections(content) {
    const sections = {};
    const parts = content.split(/^##\s+/m);

    if (parts[0].trim()) {
      sections.intro = parts[0].trim();
    }

    for (let i = 1; i < parts.length; i++) {
      const lines = parts[i].split('\n');
      const title = lines[0].trim();
      const body = lines.slice(1).join('\n').trim();

      const normalizedTitle = title.toLowerCase()
        .replace(/[\s&\/]+/g, '_')
        .replace(/[^a-z0-9_]/g, '');

      sections[normalizedTitle] = body;
    }

    return sections;
  }

  const all = files.map(file => {
    const raw = fs.readFileSync(path.join(teachersDir, file), 'utf-8');
    const { data, content } = matter(raw);
    const sections = parseSections(content);

    return {
      ...data,
      id: data.id || file.replace(/\.md$/, ''),
      bio: sections.biography || sections.intro || '',
      credentials_detail: sections.credentials || '',
      experience: sections.experience || '',
      publications: sections.selected_publications || sections.publications || '',
    };
  });

  function bySection(section) {
    return all
      .filter(teacher => teacher.section === section)
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || a.name.localeCompare(b.name));
  }

  return {
    core: bySection('core'),
    guest: bySection('guest'),
    alumni: bySection('alumni'),
    all,
  };
};
