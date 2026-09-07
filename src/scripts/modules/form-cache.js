// Keeps what a visitor has typed in a form, so a crash, an accidental reload
// or a closed tab doesn't cost them everything they entered.
//
// Opt a form in with data-persist="<key>":
//     <form id="applicationForm" data-persist="apply">
// Named fields are saved as they are typed and restored on the next visit.
// File inputs are skipped — browsers don't allow setting their value.

const PREFIX = 'tt-form:';
const DEBOUNCE_MS = 300;

// localStorage throws in Safari's private mode and wherever storage is
// blocked; every access goes through here so the form still works without it.
function store() {
    try {
        const s = window.localStorage;
        const probe = PREFIX + 'probe';
        s.setItem(probe, '1');
        s.removeItem(probe);
        return s;
    } catch (_) {
        return null;
    }
}

const SKIPPED_TYPES = ['file', 'password', 'submit', 'button', 'reset'];

function fields(form) {
    return Array.from(form.elements).filter(
        (el) => el.name && !SKIPPED_TYPES.includes(el.type)
    );
}

function read(form) {
    const data = {};
    fields(form).forEach((el) => {
        if (el.type === 'radio') {
            if (el.checked) data[el.name] = el.value;
        } else if (el.type === 'checkbox') {
            data[el.name] = el.checked;
        } else {
            data[el.name] = el.value;
        }
    });
    return data;
}

function write(form, data) {
    fields(form).forEach((el) => {
        if (!(el.name in data)) return;
        const value = data[el.name];
        if (el.type === 'radio') el.checked = el.value === value;
        else if (el.type === 'checkbox') el.checked = !!value;
        else el.value = value;
    });
}

function hasContent(data) {
    return Object.values(data).some((v) => v !== '' && v !== false);
}

export function clearFormCache(key) {
    const s = store();
    if (s) s.removeItem(PREFIX + key);
}

function setup(form) {
    const key = form.dataset.persist;
    if (!key) return;
    const s = store();
    if (!s) return;

    const saved = s.getItem(PREFIX + key);
    if (saved) {
        try {
            write(form, JSON.parse(saved));
        } catch (_) {
            s.removeItem(PREFIX + key); // corrupt entry, start clean
        }
    }

    let timer = null;
    const save = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            const data = read(form);
            // Don't leave an empty husk behind once a form is reset/cleared.
            if (hasContent(data)) s.setItem(PREFIX + key, JSON.stringify(data));
            else s.removeItem(PREFIX + key);
        }, DEBOUNCE_MS);
    };

    form.addEventListener('input', save);
    form.addEventListener('change', save);

    // Anything with data-clear-persist="<key>" wipes the stored copy and the
    // fields on screen.
    document
        .querySelectorAll('[data-clear-persist="' + key + '"]')
        .forEach((btn) => {
            btn.addEventListener('click', () => {
                clearTimeout(timer);
                clearFormCache(key);
                form.reset();
            });
        });
}

export function initFormCache() {
    document.querySelectorAll('form[data-persist]').forEach(setup);
    // apply.js is a classic script and can't import this module, so it clears
    // its cache through here after a signed agreement is safely uploaded.
    window.FormCache = { clear: clearFormCache };
}
