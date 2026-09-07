const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const markdownIt = require('markdown-it');
const { prefixMarkdownLinks } = require('../../lib/prefix-markdown-links');

// Every collaboration lives in its own Markdown file under _data/collaborations/.
// The front matter carries the structured fields (name, location, url, kind…),
// and the body is a short description. The `status: present | past | future`
// field decides which part of the Collaborations page a partner appears in.
// Adding a new collaboration only ever means dropping a new .md file in this
// folder (or changing one `status` line) — never editing the template.
const md = prefixMarkdownLinks(markdownIt({ html: true, linkify: true, typographer: true }));

module.exports = function () {
  const dir = path.join(__dirname, 'collaborations');

  let files = [];
  try {
    files = fs.readdirSync(dir).filter(file => file.endsWith('.md'));
  } catch (error) {
    return { present: [], past: [], future: [], all: [] };
  }

  const all = files.map(file => {
    const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
    const { data, content } = matter(raw);
    return {
      ...data,
      id: data.id || file.replace(/\.md$/, ''),
      description: content.trim() ? md.render(content.trim()) : '',
    };
  });

  function byStatus(status) {
    return all
      .filter(collab => (collab.status || 'present') === status)
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || a.name.localeCompare(b.name));
  }

  return {
    present: byStatus('present'),
    past: byStatus('past'),
    future: byStatus('future'),
    all,
  };
};
