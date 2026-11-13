#!/usr/bin/env node
// Exports the text of the translated pages as plain .txt files, for reviewers
// who would rather read and correct a text file than a web page.
//
//   node scripts/i18n/export-review-txt.js [siteDir] [publicBaseUrl]
//
// Reads the BUILT pages in _site (so the files show exactly what the site
// shows, folded panels included), and writes _site/review/:
//   ru/NN-page.txt   the Russian pages, one file each, in reading order
//   en/NN-page.txt   the English originals, for comparison
//   index.html       a small page linking to every file
//   review-ru.zip    everything in one download
//
// Run by the deploy workflow on preview branches only, after the build.

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const SITE = path.resolve(process.argv[2] || '_site');
const BASE = (process.argv[3] || '').replace(/\/+$/, '');
const OUT = path.join(SITE, 'review');

// Order is the order the reviewer should read them in.
const PAGES = [
  { slug: '01-glavnaya', name: 'Главная', ru: 'ru/', en: '' },
  { slug: '02-obuchenie', name: 'Обучение трансперсональной психотерапии', ru: 'ru/obuchenie-transpersonalnoy-psihoterapii/', en: 'training-overview/' },
  { slug: '03-chto-takoe-tp', name: 'Что такое трансперсональная психология', ru: 'ru/chto-takoe-transpersonalnaya-psihologiya/', en: 'what-is-transpersonal-psychology/' },
  { slug: '04-holotropnoe-dyhanie', name: 'Холотропное дыхание и методы школы', ru: 'ru/holotropnoe-dyhanie/', en: 'techniques/' },
];

const BLOCK = new Set(['p', 'div', 'section', 'header', 'footer', 'nav', 'ul', 'ol', 'li', 'blockquote',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'summary', 'details', 'table', 'tr', 'td', 'th', 'form', 'label',
  'select', 'option', 'button', 'dialog', 'picture', 'figure', 'br', 'main', 'article', 'noscript']);
const SKIP = new Set(['script', 'style', 'svg', 'video', 'source', 'template']);

// HTML → lines of text in reading order. Headings, list items, images and
// form fields are marked so the reviewer can tell what each line is.
function toText($, root, labels) {
  const out = [];
  const walk = (node) => {
    // Line breaks inside a text node are just the HTML's indentation.
    if (node.type === 'text') { out.push(node.data.replace(/\s+/g, ' ')); return; }
    if (node.type !== 'tag') return;
    const tag = node.name;
    if (SKIP.has(tag)) return;
    const $n = $(node);
    if ($n.attr('aria-hidden') === 'true') return;
    // Tailwind's `block` class turns a <span> into a line of its own.
    // A link standing on its own (a button, a menu item) gets its own line; a
    // link inside a sentence stays in the sentence.
    const block = BLOCK.has(tag) || /(^|\s)(md:)?block(\s|$)/.test($n.attr('class') || '')
      || (tag === 'a' && !$n.closest('p,li,h1,h2,h3,h4,h5,h6,label,td,th,blockquote').length);
    if (block) out.push('\n');
    if (/^h[1-6]$/.test(tag)) out.push('#'.repeat(Number(tag[1])) + ' ');
    if (tag === 'li') out.push('\u0001'.repeat($n.parents('li').length) + '- ');
    if (tag === 'option') out.push(`[${labels.option}] `);
    if (tag === 'img' && $n.attr('alt') && $n.attr('alt') !== 'Logo') out.push(`\n[${labels.image}: ${$n.attr('alt')}]\n`);
    if ((tag === 'input' || tag === 'textarea') && $n.attr('placeholder')) {
      out.push(`\n[${labels.placeholder}: ${$n.attr('placeholder')}]\n`);
    }
    node.children && node.children.forEach(walk);
    if (block) out.push('\n');
  };
  root.each((_, el) => walk(el));
  const lines = out.join('').split('\n')
    .map((l) => l.replace(/\s+/g, ' ').trim())
    .filter((l) => l && !/^[#\u0001]*-?$/.test(l) && l !== '*')
    // \u0001 marks one level of list nesting; it becomes four spaces.
    .map((l) => l.replace(/^\u0001+/, (m) => '    '.repeat(m.length)));
  // A line repeated straight after itself is the same text reached twice.
  return lines.filter((l, i) => l !== lines[i - 1]).join('\n');
}

function pageText(file, lang, page) {
  const html = fs.readFileSync(path.join(SITE, file, 'index.html'), 'utf-8');
  const $ = cheerio.load(html);
  const L = lang === 'ru'
    ? { image: 'Описание изображения', placeholder: 'Подсказка в поле', option: 'Вариант',
        search: 'КАК СТРАНИЦА ВЫГЛЯДИТ В ПОИСКЕ (Яндекс, Google) — на самой странице не видно',
        title: 'Заголовок', desc: 'Описание', text: 'ТЕКСТ СТРАНИЦЫ', address: 'Адрес' }
    : { image: 'Image description', placeholder: 'Field hint', option: 'Option',
        search: 'IN SEARCH RESULTS (not visible on the page)',
        title: 'Title', desc: 'Description', text: 'PAGE TEXT', address: 'Address' };
  const url = `${BASE}/${file}`;
  const head = [
    page.name + (lang === 'en' ? ' — English original, for reference' : ''),
    `${L.address}: ${url}`,
    '',
    `=== ${L.search} ===`,
    `${L.title}: ${$('title').text().trim()}`,
    `${L.desc}: ${$('meta[name="description"]').attr('content') || ''}`,
    '',
    `=== ${L.text} ===`,
    '',
  ];
  return head.join('\n') + toText($, $('main'), L) + '\n';
}

// Menu, footer and privacy policy: the same on every page, so one file.
function sharedText() {
  const html = fs.readFileSync(path.join(SITE, 'ru', 'index.html'), 'utf-8');
  const $ = cheerio.load(html);
  const L = { image: 'Описание изображения', placeholder: 'Подсказка в поле', option: 'Вариант' };
  $('#mobile-menu').remove(); // same links as the desktop menu
  $('#navbar > div > a').eq(1).remove(); // and the mobile copy of the logo
  const parts = [
    'Общие элементы: меню, подвал сайта, политика конфиденциальности, сообщения контактной формы',
    'Они одинаковые на всех русских страницах.',
    '',
    '=== МЕНЮ ===', toText($, $('nav#navbar'), L), '',
    '=== ПОДВАЛ САЙТА ===', toText($, $('footer'), L), '',
    '=== ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ (открывается из подвала) ===', toText($, $('#privacy-modal'), L), '',
    '=== СООБЩЕНИЯ КОНТАКТНОЙ ФОРМЫ (появляются после нажатия «Отправить запрос») ===',
  ];
  const js = fs.readFileSync(path.join(SITE, 'scripts', 'pages', 'contact.js'), 'utf-8');
  const ru = js.slice(js.indexOf('ru: {'), js.indexOf('}', js.indexOf('ru: {')));
  for (const m of ru.matchAll(/(\w+): '((?:[^'\\]|\\.)*)'(?: \+ emailLinks\('или'\) \+ '((?:[^'\\]|\\.)*)')?/g)) {
    parts.push(`- ${m[2].trim()}${m[3] !== undefined ? ' [адреса эл. почты] ' + m[3].trim() : ''}`);
  }
  return parts.join('\n') + '\n';
}

// UTF-8 with a byte-order mark: Windows Notepad and browsers opening a .txt
// straight from GitHub Pages (which sends no charset) then read Cyrillic correctly.
const write = (rel, text) => {
  const file = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, '﻿' + text.replace(/\n/g, '\r\n'), 'utf-8');
  return rel;
};

fs.rmSync(OUT, { recursive: true, force: true });
const ruFiles = PAGES.map((p) => write(`ru/${p.slug}.txt`, pageText(p.ru, 'ru', p)));
ruFiles.push(write('ru/05-menu-podval-privacy.txt', sharedText()));
const enFiles = PAGES.map((p) => write(`en/${p.slug}-EN.txt`, pageText(p.en, 'en', p)));

const li = (f) => `<li><a href="${f}" download>${path.basename(f)}</a></li>`;
fs.writeFileSync(path.join(OUT, 'index.html'), `<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>Тексты для проверки</title>
<style>body{font:16px/1.6 system-ui,sans-serif;max-width:42rem;margin:2rem auto;padding:0 1rem;color:#222;background:#fff}a{color:#2a4d8f}</style>
</head><body>
<h1>Тексты русских страниц для проверки</h1>
<p><a href="review-ru.zip" download><strong>Скачать все файлы одним архивом (ZIP)</strong></a></p>
<h2>Русский текст</h2><ul>${ruFiles.map(li).join('')}</ul>
<h2>English originals (for reference)</h2><ul>${enFiles.map(li).join('')}</ul>
<p>Files are regenerated from the website on every update, so they always match the pages.</p>
</body></html>
`);
// One archive with everything, for a single download. `zip` is on the
// GitHub runners; where it isn't, the files are still there one by one.
try {
  require('child_process').execFileSync('zip', ['-q', '-r', 'review-ru.zip', 'ru', 'en'], { cwd: OUT });
} catch (e) {
  console.warn('[review] zip not available — skipped the archive');
}
console.log(`[review] wrote ${ruFiles.length + enFiles.length} text files to ${path.relative(process.cwd(), OUT)}/`);
