// Palette switcher — swaps the page between the five colour schemes defined in
// styles/main.css, and lets each one be tuned by hand.
//
// A palette is fifteen numbers: five roles (deep, paper, accent, second, dusk)
// each described by a hue, a saturation and a lightness. The stylesheet derives
// every other tone from those, so moving one slider retints everything that
// role touches — every gradient stop, border and hover state at once.
//
// On top of that sit four veil multipliers. The hero, the quote band and the
// contact band are photographs with a wash of palette colour over them; the
// veils scale that wash, so how much of each picture survives is a separate
// decision from what colour the page is.
//
// Both the chosen palette and its tuning are kept in localStorage, so a scheme
// survives a reload and follows you into the nav and footer on the rest of the
// site.

export const PALETTES = [
    { id: 'blue',   name: 'Scientific Blue', note: 'the current scheme' },
    { id: 'green',  name: 'Deep Forest',     note: 'for the outdoor photography' },
    { id: 'orange', name: 'Amber',           note: 'warm browns, bright orange CTA' },
    { id: 'earth',  name: 'Red Earth',       note: 'for the interior photography' },
    { id: 'purple', name: 'Purple & Olive',  note: 'from the reference swatch' },
];

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
    { name: '--veil-hero',    label: 'Hero',         hint: 'the opening photograph' },
    { name: '--veil-glow',    label: 'Sunset glow',  hint: 'warm light at the hero foot' },
    { name: '--veil-quote',   label: 'Quote band',   hint: 'the mandala collection' },
    { name: '--veil-contact', label: 'Contact band', hint: 'the fire pit at dusk' },
];
const VEIL_MAX = 150;

const PALETTE_KEY = 'palette-preference';
// v2 stores ready-to-set CSS strings rather than bare numbers, so hues,
// percentages and veil multipliers can all live in the same map.
const TWEAK_KEY = 'palette-tweaks-v2';

/** Every custom property the panel is allowed to write. */
const TUNABLE = [
    ...ROLES.flatMap((r) => CHANNELS.map((c) => `--${r.key}-${c.suffix}`)),
    ...VEILS.map((v) => v.name),
];

/** Read the fifteen role numbers a palette starts from, before any tuning. */
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

function loadTweaks() {
    try {
        return JSON.parse(localStorage.getItem(TWEAK_KEY)) || {};
    } catch {
        return {};
    }
}

function saveTweaks(tweaks) {
    try {
        localStorage.setItem(TWEAK_KEY, JSON.stringify(tweaks));
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

/** The colour a role currently resolves to, for the chips and the readout. */
function roleColor(key) {
    const cs = getComputedStyle(document.documentElement);
    const n = (s) => cs.getPropertyValue(`--${key}-${s}`).trim();
    return `hsl(${n('h')} ${n('s')} ${n('l')})`;
}

function hexOf(color) {
    // Round-trip through a canvas: the browser does the hsl→rgb conversion, so
    // the readout is the colour that actually painted, not a re-derivation.
    const cv = document.createElement('canvas');
    cv.width = cv.height = 1;
    const ctx = cv.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase();
}

export function initPaletteSwitcher() {
    if (!document.body.hasAttribute('data-palette-switcher')) return;
    if (document.getElementById('palette-panel')) return;

    const tweaks = loadTweaks();
    let current = localStorage.getItem(PALETTE_KEY);
    if (!PALETTES.some((p) => p.id === current)) current = PALETTES[0].id;
    apply(current, tweaks);

    // ── Panel ──
    const panel = document.createElement('div');
    panel.id = 'palette-panel';
    panel.innerHTML = `
        <button type="button" id="palette-toggle" aria-expanded="false"
                aria-controls="palette-body" title="Colour schemes">
            <span class="palette-toggle-dots" aria-hidden="true"></span>
            <span class="palette-toggle-label">Colours</span>
        </button>
        <div id="palette-body" hidden>
            <p class="palette-title">Colour scheme</p>
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
    const choices = panel.querySelector('.palette-choices');
    const tune = panel.querySelector('.palette-tune');
    const veilBox = panel.querySelector('.palette-veils');

    toggle.addEventListener('click', () => {
        const open = body.hasAttribute('hidden');
        body.toggleAttribute('hidden', !open);
        toggle.setAttribute('aria-expanded', String(open));
    });

    // ── Scheme buttons ──
    for (const p of PALETTES) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'palette-choice';
        btn.dataset.palette = p.id;
        btn.setAttribute('role', 'radio');
        btn.innerHTML = `
            <span class="palette-swatch" data-swatch="${p.id}" aria-hidden="true"></span>
            <span class="palette-choice-text">
                <span class="palette-choice-name">${p.name}</span>
                <span class="palette-choice-note">${p.note}</span>
            </span>`;
        btn.addEventListener('click', () => select(p.id));
        choices.appendChild(btn);
    }

    // Each swatch shows its own scheme's colours, not the active one's, so the
    // list reads as five options rather than five copies of the current page.
    for (const p of PALETTES) {
        const base = baseValues(p.id);
        const el = choices.querySelector(`[data-swatch="${p.id}"]`);
        const stop = (k) => `hsl(${base[`--${k}-h`]} ${base[`--${k}-s`]}% ${base[`--${k}-l`]}%)`;
        el.style.background =
            `linear-gradient(135deg, ${stop('deep')} 0 33%, ${stop('sec')} 33% 66%, ${stop('acc')} 66% 100%)`;
    }

    // ── Sliders ──
    // Each entry knows how to turn a slider position into a CSS value and how
    // to read a computed value back out, so one set of handlers drives both the
    // role channels and the veils.
    const sliders = {};

    function bindSlider(input, out, name, { toCss, toDisplay }) {
        input.addEventListener('input', () => {
            const value = toCss(Number(input.value));
            document.documentElement.style.setProperty(name, value);
            out.textContent = toDisplay(Number(input.value));
            (tweaks[current] ||= {})[name] = value;
            saveTweaks(tweaks);
            refreshChips();
        });
        sliders[name] = { input, out, toDisplay };
    }

    for (const role of ROLES) {
        const row = document.createElement('div');
        row.className = 'palette-role';
        row.innerHTML = `
            <div class="palette-role-head">
                <span class="palette-chip" data-chip="${role.key}" aria-hidden="true"></span>
                <span class="palette-role-name">${role.label}</span>
                <code class="palette-hex" data-hex="${role.key}"></code>
            </div>
            <p class="palette-role-hint">${role.hint}</p>
            <div class="palette-channels"></div>`;
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

    function refreshChips() {
        for (const role of ROLES) {
            const color = roleColor(role.key);
            panel.querySelector(`[data-chip="${role.key}"]`).style.background = color;
            panel.querySelector(`[data-hex="${role.key}"]`).textContent = hexOf(color);
        }
    }

    /** Pull every slider back in line with whatever the document now resolves to. */
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

    function markActive() {
        for (const btn of choices.querySelectorAll('.palette-choice')) {
            const on = btn.dataset.palette === current;
            btn.classList.toggle('is-active', on);
            btn.setAttribute('aria-checked', String(on));
        }
    }

    function select(id) {
        current = id;
        try { localStorage.setItem(PALETTE_KEY, id); } catch { /* ignore */ }
        // Fade rather than cut, so it is visible which parts of the page moved.
        document.body.classList.add('palette-animating');
        apply(id, tweaks);
        markActive();
        syncSliders();
        setTimeout(() => document.body.classList.remove('palette-animating'), 400);
    }

    panel.querySelector('[data-act="reset"]').addEventListener('click', () => {
        delete tweaks[current];
        saveTweaks(tweaks);
        apply(current, tweaks);
        syncSliders();
    });

    panel.querySelector('[data-act="copy"]').addEventListener('click', async (e) => {
        const cs = getComputedStyle(document.documentElement);
        const v = (name) => cs.getPropertyValue(name).trim();
        const lines = ROLES.map((r) =>
            `    --${r.key}-h: ${v(`--${r.key}-h`)}; --${r.key}-s: ${v(`--${r.key}-s`)}; --${r.key}-l: ${v(`--${r.key}-l`)};`);
        const veilLines = VEILS.map((x) => `    ${x.name}: ${v(x.name)};`);
        const css = `[data-palette="${current}"] {\n${lines.join('\n')}\n\n${veilLines.join('\n')}\n}`;
        const btn = e.currentTarget;
        try {
            await navigator.clipboard.writeText(css);
            btn.textContent = 'Copied';
        } catch {
            btn.textContent = 'Copy failed';
        }
        setTimeout(() => { btn.textContent = 'Copy CSS'; }, 1600);
    });

    markActive();
    syncSliders();
}
