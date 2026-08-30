// Regenerates the palette declarations in src/styles/main.css and the palette
// metadata in src/scripts/modules/palette-catalogue.js from one table, and
// refuses to write anything that would be unreadable or out of range.
//
//   node scripts/design/build-palettes.js          check and rewrite
//   node scripts/design/build-palettes.js --check  report only, touch nothing
//
// The checks matter because the stylesheet derives ~40 tones from each palette
// by nudging saturation and lightness; a triple that looks fine on its own can
// still push a derived tone past 0% or 100%, or drop body text below the
// contrast a reader needs.

const fs = require('fs');
const path = require('path');
const PALETTES = require('./palettes.js');

const ROOT = path.join(__dirname, '..', '..');
const CSS = path.join(ROOT, 'src/styles/main.css');
const CATALOGUE = path.join(ROOT, 'src/scripts/modules/palette-catalogue.js');

// ── colour maths ──────────────────────────────────────────────────────────────

function hslToRgb(h, s, l) {
    h = ((h % 360) + 360) % 360; s /= 100; l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x]
                    : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
    return [r + m, g + m, b + m].map((v) => Math.round(v * 255));
}

const hex = (rgb) => '#' + rgb.map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase();

/** WCAG relative luminance. */
function luminance([r, g, b]) {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function contrast(a, b) {
    const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
    return (x + 0.05) / (y + 0.05);
}

// ── the tones the stylesheet derives, mirrored here so they can be checked ────

function derive(p) {
    const [dh, ds, dl] = p.deep, [uh, us, ul] = p.dusk, [ah, as, al] = p.acc;
    const [sh, ss, sl] = p.sec, [ph, ps, pl] = p.pap;
    const [hShift, hS, hL] = p.head, [lShift, lS, lL] = p.link;
    return {
        deep:      [dh, ds, dl],
        deepest:   [dh, ds, dl - 4],
        deep2:     [dh, ds - 8, dl + 3.4],
        dusk:      [uh, us, ul],
        dusk2:     [uh, us, ul + 7],
        acc:       [ah, as, al],
        accDark:   [ah, as - 12, al - 9],
        accLight:  [ah, as + 8, al + 14],
        sec:       [sh, ss, sl],
        paper:     [ph, ps, pl],
        paper2:    [ph, ps - 9, pl - 5],
        paperCard: [ph, ps + 23, pl + 2.5],
        paperHi:   [ph, ps + 2, pl + 3.5],
        line:      [ph, ps - 19, pl - 12],
        heading:   [dh + hShift, hS, hL],
        link:      [dh + lShift, lS, lL],
        linkHover: [dh + lShift, lS - 20, lL - 15],
        icon:      [dh + lShift + 2, lS + 7, lL + 7],
        body:      [ph, 9, 33],
        bodyDim:   [ph, 4, 52],
        onDark1:   [dh, 44, 95],
        onDark5:   [dh, 18, 56],
    };
}

// Text/background pairs the page actually puts together, and the ratio each
// needs. 4.5 is WCAG AA for body text; 3.0 is AA for large display type.
const PAIRS = [
    ['body on paper',        'body',      'paper',     4.5],
    ['heading on paper',     'heading',   'paper',     4.5],
    ['link on paper',        'link',      'paper',     4.5],
    ['second on paper',      'sec',       'paper',     4.5],
    ['second on paper-card', 'sec',       'paperCard', 4.5],
    ['body-dim on paper',    'bodyDim',   'paper',     3.0],
    ['icon on paper',        'icon',      'paper',     3.0],
    ['deep on accent (CTA)', 'deep',      'acc',       4.5],
    ['deep on accent-dark',  'deep',      'accDark',   4.5],
    ['accent on deep',       'acc',       'deep',      4.5],
    ['accent on deepest',    'acc',       'deepest',   4.5],
    ['paper-hi on deep',     'paperHi',   'deep',      4.5],
    ['on-dark-1 on deepest', 'onDark1',   'deepest',   4.5],
    ['on-dark-5 on deepest', 'onDark5',   'deepest',   3.0],
];

// Every derived saturation and lightness must stay inside 0–100, or the browser
// clamps it and the tone silently stops tracking its role.
function rangeProblems(p) {
    const out = [];
    for (const [name, [, s, l]] of Object.entries(derive(p))) {
        if (s < 0 || s > 100) out.push(`${name} saturation ${s.toFixed(1)}% out of range`);
        if (l < 0 || l > 100) out.push(`${name} lightness ${l.toFixed(1)}% out of range`);
    }
    return out;
}

function contrastProblems(p) {
    const d = derive(p);
    const out = [];
    for (const [label, fg, bg, need] of PAIRS) {
        const r = contrast(hslToRgb(...d[fg]), hslToRgb(...d[bg]));
        if (r < need) out.push(`${label}: ${r.toFixed(2)} < ${need}`);
    }
    return out;
}

// ── emit ─────────────────────────────────────────────────────────────────────

const FAMILY_ORDER = ['classic', 'nature', 'earth', 'spiritual'];
const familyOf = (p) => (p.tags.length > 1 ? 'hybrid' : p.tags[0]);
const HEADINGS = {
    classic: 'Classic', nature: 'Nature', earth: 'Earth',
    spiritual: 'Spiritual', hybrid: 'Hybrids — two families at once',
};

function cssFor(p, isFirst) {
    const t = (k) => `--${k}-h: ${p[k][0]}; --${k}-s: ${p[k][1]}%; --${k}-l: ${p[k][2]}%;`;
    const sel = isFirst ? `:root,\n[data-palette="${p.id}"]` : `[data-palette="${p.id}"]`;
    return `/* ${p.name} — ${p.note} */
${sel} {
    ${t('deep')}
    ${t('dusk')}
    ${t('acc')}
    ${t('sec')}
    ${t('pap')}

    --head-shift: ${p.head[0]}; --head-s: ${p.head[1]}%; --head-l: ${p.head[2]}%;
    --link-shift: ${p.link[0]}; --link-s: ${p.link[1]}%; --link-l: ${p.link[2]}%;
    --glow-shift: ${p.glow[0]}; --glow-s: ${p.glow[1]}%; --glow-l: ${p.glow[2]}%;
}`;
}

function buildCss() {
    const order = [...PALETTES].sort((a, b) => {
        const fa = familyOf(a), fb = familyOf(b);
        const ia = FAMILY_ORDER.indexOf(fa), ib = FAMILY_ORDER.indexOf(fb);
        return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    });
    const chunks = [];
    let family = null;
    order.forEach((p, i) => {
        const f = familyOf(p);
        if (f !== family) { family = f; chunks.push(`/* ══ ${HEADINGS[f]} ══ */`); }
        chunks.push(cssFor(p, i === 0));
    });
    return chunks.join('\n\n');
}

function buildCatalogue() {
    const q = (v) => `'${String(v).replace(/'/g, "\\'")}'`;
    const w = (list, f) => Math.max(...list.map((x) => f(x).length));
    const wId = w(PALETTES, (p) => q(p.id));
    const wName = w(PALETTES, (p) => q(p.name));
    const wTags = w(PALETTES, (p) => `[${p.tags.map(q).join(', ')}]`);
    const rows = PALETTES.map((p) => {
        const tags = `[${p.tags.map(q).join(', ')}]`;
        return `    { id: ${(q(p.id) + ',').padEnd(wId + 1)} ` +
               `name: ${(q(p.name) + ',').padEnd(wName + 1)} ` +
               `tags: ${(tags + ',').padEnd(wTags + 1)} ` +
               `note: ${q(p.note)} },`;
    });
    return `// GENERATED by scripts/design/build-palettes.js — do not edit by hand.
// The numbers these ids point at live in src/styles/main.css; both files are
// emitted from scripts/design/palettes.js, so they cannot drift apart.

export const PALETTES = [
${rows.join('\n')}
];

// A palette carrying two tags is a hybrid, and shows up under both of its
// families as well as under "Hybrids".
export const FAMILIES = [
    { id: 'all',       label: 'All' },
    { id: 'nature',    label: 'Nature' },
    { id: 'earth',     label: 'Earth' },
    { id: 'spiritual', label: 'Spiritual' },
    { id: 'hybrid',    label: 'Hybrids' },
    { id: 'classic',   label: 'Classic' },
];

export function matchesFamily(palette, family) {
    if (family === 'all') return true;
    if (family === 'hybrid') return palette.tags.length > 1;
    return palette.tags.includes(family);
}
`;
}

// ── run ──────────────────────────────────────────────────────────────────────

const ids = new Set();
let failed = false;
for (const p of PALETTES) {
    if (ids.has(p.id)) { console.error(`duplicate id: ${p.id}`); failed = true; }
    ids.add(p.id);
    const problems = [...rangeProblems(p), ...contrastProblems(p)];
    if (!problems.length) continue;
    if (p.reference) {
        // `blue` reproduces the design already in production. Report what it
        // falls short of — that is worth knowing — but never block on it, and
        // never quietly "improve" it, or it stops being a faithful reference.
        console.warn(`\n! ${p.id} (${p.name}) — shipped design, reported only`);
        for (const m of problems) console.warn(`    ${m}`);
        continue;
    }
    failed = true;
    console.error(`\n✗ ${p.id} (${p.name})`);
    for (const m of problems) console.error(`    ${m}`);
}
const TUNING = process.argv.includes('--tune');
if (failed && !TUNING) {
    console.error('\nNothing written — fix the table in scripts/design/palettes.js first.');
    process.exit(1);
}
if (!failed) console.log(`✓ ${PALETTES.length} palettes pass ${PAIRS.length} contrast pairs and all range checks`);

if (TUNING) {
    for (const p of PALETTES) {
        if (p.reference) continue;
        let best = null;
        for (let total = 0; total <= 16 && !best; total++) {
            for (let dSec = -total; dSec <= total && !best; dSec++) {
                const dAcc = total - Math.abs(dSec);
                for (const sign of dAcc === 0 ? [1] : [1, -1]) {
                    const cand = { ...p,
                        sec: [p.sec[0], p.sec[1], p.sec[2] + dSec],
                        acc: [p.acc[0], p.acc[1], p.acc[2] + dAcc * sign] };
                    if (![...rangeProblems(cand), ...contrastProblems(cand)].length) {
                        best = { dSec, dAcc: dAcc * sign, cand };
                        break;
                    }
                }
            }
        }
        if (!best) { console.log(`${p.id}: no fix within ±16`); continue; }
        if (best.dSec || best.dAcc) {
            console.log(`${p.id.padEnd(14)} sec.l ${p.sec[2]} -> ${best.cand.sec[2]}   ` +
                        `acc.l ${p.acc[2]} -> ${best.cand.acc[2]}`);
        }
    }
    process.exit(0);
}

if (process.argv.includes('--check')) process.exit(0);

const START = '/* ══ PALETTES:START — generated, see scripts/design/build-palettes.js ══ */';
const END = '/* ══ PALETTES:END ══ */';
let css = fs.readFileSync(CSS, 'utf8');
const a = css.indexOf(START), b = css.indexOf(END);
if (a < 0 || b < 0) { console.error(`Markers ${START} / ${END} not found in main.css`); process.exit(1); }
css = css.slice(0, a + START.length) + '\n\n' + buildCss() + '\n\n' + css.slice(b);
fs.writeFileSync(CSS, css);
fs.writeFileSync(CATALOGUE, buildCatalogue());
console.log('wrote src/styles/main.css and src/scripts/modules/palette-catalogue.js');
