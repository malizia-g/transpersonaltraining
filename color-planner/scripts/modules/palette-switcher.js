// Palette switcher — swaps the page between the colour schemes declared in
// styles/main.css, and lets any of them be tuned by hand.
//
// A palette is fifteen numbers: five roles (deep, paper, accent, second, dusk)
// each described by a hue, a saturation and a lightness. The stylesheet derives
// every other tone from those, so moving one slider retints everything that
// role touches — every gradient stop, border and hover state at once. A role
// can also be set outright with a colour picker or by typing a hex, which just
// writes the same three numbers from the other direction.
//
// On top of that sit four veil multipliers. The hero, the quote band and the
// contact band are photographs with a wash of palette colour over them; the
// veils scale that wash, so how much of each picture survives is a separate
// decision from what colour the page is.
//
// Schemes are tagged by family (nature, earth, spiritual, classic) and can
// carry two tags at once, which is what makes them hybrids; the filter along
// the top narrows the list to one family.
//
// The chosen palette, its tuning and the active filter are kept in
// localStorage, so a scheme survives a reload and follows you into the nav and
// footer on the rest of the site.

import { PALETTES, FAMILIES, matchesFamily } from './palette-catalogue.js';

export { PALETTES };

// The tunable roles, in the order the panel shows them: the two grounds the eye
// spends most of its time on, then the accents, then the gradient partner.
const ROLES = [
    { key: 'deep', label: 'Deep',   hint: 'hero, quote band, contact, footer' },
    { key: 'pap',  label: 'Paper',  hint: 'the light section backgrounds' },
    { key: 'acc',  label: 'Accent', hint: 'buttons, kickers, hairlines' },
    { key: 'sec',  label: 'Second', hint: 'card borders, drop caps, kickers' },
    { key: 'dusk', label: 'Dusk',   hint: 'the second dark in the gradients' },
];

const CHANNELS = [
    { suffix: 'h', label: 'H', min: 0, max: 360, step: 1, unit: '' },
    { suffix: 's', label: 'S', min: 0, max: 100, step: 1, unit: '%' },
    { suffix: 'l', label: 'L', min: 0, max: 100, step: 1, unit: '%' },
];

// Veils are stored as a plain multiplier (1 = the design's own weight) but
// shown as a percentage, which is what someone judging a photograph thinks in.
// Past 100% the alphas simply saturate at fully opaque.
const VEILS = [
    { name: '--veil-hero',    label: 'Hero',         hint: 'the opening video' },
    { name: '--veil-glow',    label: 'Sunset glow',  hint: 'warm light at the hero foot' },
    { name: '--veil-quote',   label: 'Quote band',   hint: 'the mandala collection' },
    { name: '--veil-contact', label: 'Contact band', hint: 'the fire pit at dusk' },
];
const VEIL_MAX = 150;

const PALETTE_KEY = 'palette-preference';
const FILTER_KEY = 'palette-filter';
const HELP_KEY = 'palette-help-collapsed';
// v2 stores ready-to-set CSS strings rather than bare numbers, so hues,
// percentages and veil multipliers can all live in the same map.
const TWEAK_KEY = 'palette-tweaks-v2';

/** Every custom property the panel is allowed to write. */
const TUNABLE = [
    ...ROLES.flatMap((r) => CHANNELS.map((c) => `--${r.key}-${c.suffix}`)),
    ...VEILS.map((v) => v.name),
];

// ── colour helpers ───────────────────────────────────────────────────────────

/** '#1E40AF' → [225.8, 71.4, 40.2], or null if it isn't a six-digit hex. */
function hslOfHex(value) {
    const m = /^#?([0-9a-f]{6})$/i.exec(String(value).trim());
    if (!m) return null;
    const n = parseInt(m[1], 16);
    const r = ((n >> 16) & 255) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
    const l = (max + min) / 2;
    let h = 0, s = 0;
    if (d) {
        s = d / (1 - Math.abs(2 * l - 1));
        h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
        h *= 60;
        if (h < 0) h += 360;
    }
    const round1 = (v) => Math.round(v * 10) / 10;
    return [round1(h), round1(s * 100), round1(l * 100)];
}

function hexOf(color) {
    // Round-trip through a canvas: the browser does the hsl→rgb conversion, so
    // the readout is the colour that actually painted, not a re-derivation.
    const cv = document.createElement('canvas');
    cv.width = cv.height = 1;
    const ctx = cv.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase();
}

/** The fifteen role numbers a palette starts from, before any tuning. */
function baseValues(id) {
    // Every palette is declared as a [data-palette] rule, so a throwaway element
    // carrying that attribute resolves the whole set without touching the page.
    const probe = document.createElement('div');
    probe.setAttribute('data-palette', id);
    probe.style.display = 'none';
    document.body.appendChild(probe);
    const cs = getComputedStyle(probe);
    const out = {};
    for (const role of ROLES) {
        for (const ch of CHANNELS) {
            const name = `--${role.key}-${ch.suffix}`;
            out[name] = parseFloat(cs.getPropertyValue(name));
        }
    }
    probe.remove();
    return out;
}

// ── storage ──────────────────────────────────────────────────────────────────

function loadTweaks() {
    try {
        return JSON.parse(localStorage.getItem(TWEAK_KEY)) || {};
    } catch {
        return {};
    }
}

function remember(key, value) {
    try {
        localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    } catch {
        /* private browsing — the panel still works, it just won't be remembered */
    }
}

/** Push a palette (plus its tuning) onto the document. */
function apply(id, tweaks) {
    const root = document.documentElement;
    root.setAttribute('data-palette', id);
    // Clear whatever the previous palette's tuning left on the inline style,
    // or a value tuned under one scheme would leak into the next.
    for (const name of TUNABLE) root.style.removeProperty(name);
    for (const [name, value] of Object.entries((tweaks || {})[id] || {})) {
        root.style.setProperty(name, value);
    }
}

/** The colour a role currently resolves to. */
function roleColor(key) {
    const cs = getComputedStyle(document.documentElement);
    const n = (s) => cs.getPropertyValue(`--${key}-${s}`).trim();
    return `hsl(${n('h')} ${n('s')} ${n('l')})`;
}

// ── panel ────────────────────────────────────────────────────────────────────

export function initPaletteSwitcher() {
    if (!document.body.hasAttribute('data-palette-switcher')) return;
    if (document.getElementById('palette-panel')) return;

    // The catalogue and the stylesheet are generated from one table, but a
    // hand-edit to either could still leave an id with no CSS rule behind it.
    // Drop those rather than offering a scheme that does nothing.
    const schemes = PALETTES.filter((p) => {
        const ok = Number.isFinite(baseValues(p.id)['--deep-h']);
        if (!ok) console.warn(`[palette] "${p.id}" has no [data-palette] rule in main.css — hidden`);
        return ok;
    });
    if (!schemes.length) return;

    const tweaks = loadTweaks();
    let current = localStorage.getItem(PALETTE_KEY);
    if (!schemes.some((p) => p.id === current)) current = schemes[0].id;
    let filter = localStorage.getItem(FILTER_KEY);
    if (!FAMILIES.some((f) => f.id === filter)) filter = 'all';
    apply(current, tweaks);

    const panel = document.createElement('div');
    panel.id = 'palette-panel';
    panel.innerHTML = `
        <button type="button" id="palette-toggle" aria-expanded="false"
                aria-controls="palette-body" title="Colour schemes">
            <span class="palette-toggle-dots" aria-hidden="true"></span>
            <span class="palette-toggle-label">Colours</span>
        </button>
        <div id="palette-body" hidden>
            <details id="palette-help">
                <summary>How to use this</summary>
                <ol>
                    <li><b>Pick a category.</b> Nature, Earth or Spiritual. <i>Hybrids</i> are
                        schemes that belong to two families at once; <i>All</i> shows everything.</li>
                    <li><b>Choose a scheme.</b> The whole page retints as you click — header,
                        buttons, headings, borders and footer together.</li>
                    <li><b>Adjust the tones.</b> Each of the five roles has a hue, saturation and
                        lightness slider. To set a colour exactly, click its swatch to open the
                        colour picker, or type a hex code into the field beside it.</li>
                    <li><b>Adjust the colour over the video.</b> The <i>Hero</i> slider sets how
                        much colour is laid over the opening video; the other three do the same
                        for the sunset glow and the two photo bands further down.</li>
                </ol>
                <p><b>Reset scheme</b> undoes your changes to the current scheme only — every other
                   scheme keeps its own. <b>Copy CSS</b> puts the finished numbers on the clipboard.
                   Your choices are remembered in this browser, so you can come back to them.</p>
            </details>
            <p class="palette-title">Colour scheme <span class="palette-count"></span></p>
            <div class="palette-filters" role="group" aria-label="Filter schemes by family"></div>
            <div class="palette-choices" role="radiogroup" aria-label="Colour scheme"></div>
            <p class="palette-title palette-title-rule">Tune this scheme</p>
            <div class="palette-tune"></div>
            <p class="palette-title palette-title-rule">Veil over the photographs</p>
            <div class="palette-veils"></div>
            <div class="palette-actions">
                <button type="button" data-act="reset">Reset scheme</button>
                <button type="button" data-act="copy">Copy CSS</button>
            </div>
        </div>`;
    document.body.appendChild(panel);

    const body = panel.querySelector('#palette-body');
    const toggle = panel.querySelector('#palette-toggle');
    const filterBox = panel.querySelector('.palette-filters');
    const choices = panel.querySelector('.palette-choices');
    const countEl = panel.querySelector('.palette-count');
    const tune = panel.querySelector('.palette-tune');
    const veilBox = panel.querySelector('.palette-veils');

    const help = panel.querySelector('#palette-help');
    // Open the first time someone lands here, closed once they have folded it.
    help.open = localStorage.getItem(HELP_KEY) !== '1';
    help.addEventListener('toggle', () => remember(HELP_KEY, help.open ? '0' : '1'));

    toggle.addEventListener('click', () => {
        const open = body.hasAttribute('hidden');
        body.toggleAttribute('hidden', !open);
        toggle.setAttribute('aria-expanded', String(open));
    });

    // ── Family filter ──
    for (const family of FAMILIES) {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'palette-filter';
        chip.dataset.family = family.id;
        chip.textContent = family.label;
        chip.addEventListener('click', () => {
            filter = family.id;
            remember(FILTER_KEY, filter);
            renderFilter();
        });
        filterBox.appendChild(chip);
    }

    // ── Scheme rows ──
    for (const p of schemes) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'palette-choice';
        btn.dataset.palette = p.id;
        btn.setAttribute('role', 'radio');
        const tags = p.tags.map((t) => `<span class="palette-tag">${t}</span>`).join('');
        btn.innerHTML = `
            <span class="palette-swatch" data-swatch="${p.id}" aria-hidden="true"></span>
            <span class="palette-choice-text">
                <span class="palette-choice-name">${p.name}</span>
                <span class="palette-choice-note">${p.note}</span>
                <span class="palette-tags">${tags}</span>
            </span>`;
        btn.addEventListener('click', () => select(p.id));
        choices.appendChild(btn);

        // Each swatch shows its own scheme's colours, not the active one's, so
        // the list reads as a set of options rather than copies of the page.
        const base = baseValues(p.id);
        const stop = (k) => `hsl(${base[`--${k}-h`]} ${base[`--${k}-s`]}% ${base[`--${k}-l`]}%)`;
        btn.querySelector('.palette-swatch').style.background =
            `linear-gradient(135deg, ${stop('deep')} 0 33%, ${stop('sec')} 33% 66%, ${stop('acc')} 66% 100%)`;
    }

    // ── Sliders, pickers and hex fields ──
    const sliders = {};
    const pickers = {};

    /** Write one role's three numbers, however the change arrived. */
    function setRole(key, [h, s, l]) {
        const root = document.documentElement;
        const values = { h: String(h), s: `${s}%`, l: `${l}%` };
        for (const ch of CHANNELS) {
            const name = `--${key}-${ch.suffix}`;
            root.style.setProperty(name, values[ch.suffix]);
            (tweaks[current] ||= {})[name] = values[ch.suffix];
        }
        remember(TWEAK_KEY, tweaks);
        syncSliders();
    }

    function bindSlider(input, out, name, { toCss, toDisplay }) {
        input.addEventListener('input', () => {
            const value = toCss(Number(input.value));
            document.documentElement.style.setProperty(name, value);
            out.textContent = toDisplay(Number(input.value));
            (tweaks[current] ||= {})[name] = value;
            remember(TWEAK_KEY, tweaks);
            refreshChips();
        });
        sliders[name] = { input, out, toDisplay };
    }

    for (const role of ROLES) {
        const row = document.createElement('div');
        row.className = 'palette-role';
        row.innerHTML = `
            <div class="palette-role-head">
                <input type="color" class="palette-pick" data-pick="${role.key}"
                       aria-label="${role.label} colour">
                <span class="palette-role-name">${role.label}</span>
                <input type="text" class="palette-hex" data-hex="${role.key}" maxlength="7"
                       spellcheck="false" autocomplete="off" aria-label="${role.label} hex">
            </div>
            <p class="palette-role-hint">${role.hint}</p>
            <div class="palette-channels"></div>`;

        const pick = row.querySelector('.palette-pick');
        const hex = row.querySelector('.palette-hex');
        pickers[role.key] = { pick, hex };

        pick.addEventListener('input', () => setRole(role.key, hslOfHex(pick.value)));
        const commitHex = () => {
            const hsl = hslOfHex(hex.value);
            if (hsl) { setRole(role.key, hsl); return; }
            // Not a hex. refreshChips() leaves a focused field alone, so put it
            // back explicitly rather than leaving the typo sitting there.
            hex.value = hexOf(roleColor(role.key));
        };
        hex.addEventListener('change', commitHex);
        hex.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); commitHex(); } });

        const channels = row.querySelector('.palette-channels');
        for (const ch of CHANNELS) {
            const wrap = document.createElement('label');
            wrap.className = 'palette-channel';
            wrap.innerHTML = `
                <span class="palette-channel-label">${ch.label}</span>
                <input type="range" min="${ch.min}" max="${ch.max}" step="${ch.step}"
                       aria-label="${role.label} ${ch.label}">
                <output></output>`;
            bindSlider(wrap.querySelector('input'), wrap.querySelector('output'),
                       `--${role.key}-${ch.suffix}`, {
                           toCss: (v) => (ch.suffix === 'h' ? String(v) : `${v}%`),
                           toDisplay: (v) => v + ch.unit,
                       });
            channels.appendChild(wrap);
        }
        tune.appendChild(row);
    }

    for (const veil of VEILS) {
        const row = document.createElement('label');
        row.className = 'palette-veil';
        row.innerHTML = `
            <span class="palette-veil-text">
                <span class="palette-veil-name">${veil.label}</span>
                <span class="palette-veil-hint">${veil.hint}</span>
            </span>
            <input type="range" min="0" max="${VEIL_MAX}" step="5" aria-label="${veil.label} veil">
            <output></output>`;
        bindSlider(row.querySelector('input'), row.querySelector('output'), veil.name, {
            toCss: (v) => String(v / 100),
            toDisplay: (v) => v + '%',
        });
        veilBox.appendChild(row);
    }

    // ── Refresh ──

    function refreshChips() {
        for (const role of ROLES) {
            const value = hexOf(roleColor(role.key));
            const { pick, hex } = pickers[role.key];
            pick.value = value.toLowerCase();
            // Leave the field alone while it is being typed into.
            if (document.activeElement !== hex) hex.value = value;
        }
    }

    /** Pull every control back in line with whatever the document resolves to. */
    function syncSliders() {
        const cs = getComputedStyle(document.documentElement);
        for (const [name, s] of Object.entries(sliders)) {
            let value = parseFloat(cs.getPropertyValue(name));
            if (name.startsWith('--veil-')) value = Math.round(value * 100);
            s.input.value = String(value);
            s.out.textContent = s.toDisplay(value);
        }
        refreshChips();
    }

    function renderFilter() {
        for (const chip of filterBox.querySelectorAll('.palette-filter')) {
            chip.classList.toggle('is-active', chip.dataset.family === filter);
        }
        let shown = 0;
        for (const btn of choices.querySelectorAll('.palette-choice')) {
            const p = schemes.find((x) => x.id === btn.dataset.palette);
            const on = matchesFamily(p, filter);
            btn.hidden = !on;
            if (on) shown += 1;
        }
        countEl.textContent = shown === schemes.length ? `· ${shown}` : `· ${shown} of ${schemes.length}`;
    }

    function markActive() {
        for (const btn of choices.querySelectorAll('.palette-choice')) {
            const on = btn.dataset.palette === current;
            btn.classList.toggle('is-active', on);
            btn.setAttribute('aria-checked', String(on));
        }
    }

    function select(id) {
        current = id;
        remember(PALETTE_KEY, id);
        // Fade rather than cut, so it is visible which parts of the page moved.
        document.body.classList.add('palette-animating');
        apply(id, tweaks);
        markActive();
        syncSliders();
        setTimeout(() => document.body.classList.remove('palette-animating'), 400);
    }

    panel.querySelector('[data-act="reset"]').addEventListener('click', () => {
        delete tweaks[current];
        remember(TWEAK_KEY, tweaks);
        apply(current, tweaks);
        syncSliders();
    });

    panel.querySelector('[data-act="copy"]').addEventListener('click', async (e) => {
        const cs = getComputedStyle(document.documentElement);
        const v = (name) => cs.getPropertyValue(name).trim();
        const roleLines = ROLES.map((r) =>
            `    --${r.key}-h: ${v(`--${r.key}-h`)}; --${r.key}-s: ${v(`--${r.key}-s`)}; --${r.key}-l: ${v(`--${r.key}-l`)};`);
        const veilLines = VEILS.map((x) => `    ${x.name}: ${v(x.name)};`);
        const css = `[data-palette="${current}"] {\n${roleLines.join('\n')}\n\n${veilLines.join('\n')}\n}`;
        const btn = e.currentTarget;
        try {
            await navigator.clipboard.writeText(css);
            btn.textContent = 'Copied';
        } catch {
            btn.textContent = 'Copy failed';
        }
        setTimeout(() => { btn.textContent = 'Copy CSS'; }, 1600);
    });

    renderFilter();
    markActive();
    syncSliders();
}
