// Lectures schedule - Filter functionality and inline video

// Toggle description expand/collapse
window.toggleLectureDescription = function(cardId) {
    const descEl = document.getElementById(`ldesc-${cardId}`);
    const textEl = document.getElementById(`ltext-${cardId}`);
    const iconEl = document.getElementById(`licon-${cardId}`);
    if (!descEl) return;

    const isExpanded = descEl.dataset.expanded === 'true';

    if (isExpanded) {
        descEl.classList.add('whitespace-nowrap', 'text-ellipsis');
        descEl.style.maxHeight = '1.5em';
        descEl.dataset.expanded = 'false';
        textEl.textContent = 'Read more';
        iconEl.style.transform = '';
    } else {
        descEl.classList.remove('whitespace-nowrap', 'text-ellipsis');
        descEl.style.maxHeight = descEl.scrollHeight + 'px';
        descEl.dataset.expanded = 'true';
        textEl.textContent = 'Read less';
        iconEl.style.transform = 'rotate(180deg)';
    }
};

// Toggle inline video within the card
window.toggleInlineVideo = function(btn, videoUrl) {
    const card = btn.closest('.lecture-card');
    if (!card) return;

    const container = card.querySelector('.video-container');
    if (!container) return;

    const video = container.querySelector('video');
    const btnIcon = btn.querySelector('[data-lucide]');
    const btnText = btn.querySelector('span');

    if (container.classList.contains('hidden')) {
        // Show video
        container.classList.remove('hidden');
        if (video) video.load();
        if (btnText) btnText.textContent = 'Hide';
        if (btnIcon) {
            btnIcon.setAttribute('data-lucide', 'x-circle');
            lucide.createIcons();
        }
    } else {
        // Hide video
        if (video) video.pause();
        container.classList.add('hidden');
        if (btnText) btnText.textContent = 'Watch';
        if (btnIcon) {
            btnIcon.setAttribute('data-lucide', 'play-circle');
            lucide.createIcons();
        }
    }
};

// Dates come from the sheet as DD.MM.YYYY (see src/_data/lectureEvents.js).
function parseLectureDate(dateString) {
    if (!dateString) return null;
    const parts = dateString.trim().split('.');
    if (parts.length !== 3) return null;
    return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
}

// A lecture counts as future for the whole of its own day, so today's evening
// session doesn't disappear at midnight the night before.
function isFutureLecture(dateString) {
    const date = parseLectureDate(dateString);
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
}

function sortLectureCards(cards, ascending = true) {
    return Array.from(cards).sort((a, b) => {
        const dateA = parseLectureDate(a.dataset.date);
        const dateB = parseLectureDate(b.dataset.date);
        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;
        return ascending ? dateA - dateB : dateB - dateA;
    });
}

// Whichever end of the calendar the period points at goes first: the next
// lecture coming up, or the one most recently given.
function reorderLectureCards(period) {
    const listEl = document.getElementById('lectures-list');
    if (!listEl) return;
    const cards = listEl.querySelectorAll('.lecture-card');

    let sorted;
    if (period === 'future') {
        sorted = sortLectureCards(cards, true);
    } else if (period === 'past') {
        sorted = sortLectureCards(cards, false);
    } else {
        const future = [];
        const past = [];
        cards.forEach(card => {
            (isFutureLecture(card.dataset.date) ? future : past).push(card);
        });
        sorted = [...sortLectureCards(future, true), ...sortLectureCards(past, false)];
    }

    sorted.forEach(card => listEl.appendChild(card));

    placePeriodDividers(listEl, sorted, period);
}

// The labelled hairlines that mark the seam between the two halves of the
// "All" list. They only earn their place when both halves are actually on
// screen, so any other period — or a filter that empties one side — hides
// them again.
function placePeriodDividers(listEl, sortedCards, period) {
    const futureDivider = document.getElementById('divider-future');
    const pastDivider = document.getElementById('divider-past');
    if (!futureDivider || !pastDivider) return;

    const visible = sortedCards.filter(card => card.style.display !== 'none');
    const firstPast = period === 'all'
        ? visible.find(card => !isFutureLecture(card.dataset.date))
        : undefined;
    const show = !!firstPast && visible.some(card => isFutureLecture(card.dataset.date));

    toggleDivider(futureDivider, show);
    toggleDivider(pastDivider, show);

    if (show) {
        listEl.insertBefore(futureDivider, visible[0]);
        listEl.insertBefore(pastDivider, firstPast);
    }
}

// The dividers are flex rows, so showing one means swapping Tailwind's
// `hidden` for `flex` rather than clearing a display style.
function toggleDivider(el, show) {
    el.classList.toggle('hidden', !show);
    el.classList.toggle('flex', show);
}

// Filter logic
function initializeLectureFilters() {
    const cards = document.querySelectorAll('.lecture-card');
    const filterPeriod = document.getElementById('filter-period');
    const filterModule = document.getElementById('filter-module');
    const filterTeacher = document.getElementById('filter-teacher');
    const filterSearch = document.getElementById('filter-search');
    const clearBtn = document.getElementById('clear-filters-btn');

    if (!cards.length) return;

    if (filterPeriod) filterPeriod.addEventListener('change', applyLectureFilters);
    if (filterModule) filterModule.addEventListener('change', applyLectureFilters);
    if (filterTeacher) filterTeacher.addEventListener('change', applyLectureFilters);
    if (filterSearch) {
        let debounce;
        filterSearch.addEventListener('input', () => {
            clearTimeout(debounce);
            debounce = setTimeout(applyLectureFilters, 250);
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (filterPeriod) filterPeriod.value = 'future';
            if (filterModule) filterModule.value = '';
            if (filterTeacher) filterTeacher.value = '';
            if (filterSearch) filterSearch.value = '';
            applyLectureFilters();
        });
    }

    // Video error handlers for inline videos
    document.querySelectorAll('.video-container video').forEach(video => {
        video.addEventListener('error', () => {
            video.style.display = 'none';
            const errorDiv = video.closest('.video-container').querySelector('.video-error');
            if (errorDiv) errorDiv.classList.remove('hidden');
        });
    });

    applyLectureFilters();
}

function applyLectureFilters() {
    const cards = document.querySelectorAll('.lecture-card');
    const filterPeriod = document.getElementById('filter-period');
    const filterModule = document.getElementById('filter-module');
    const filterTeacher = document.getElementById('filter-teacher');
    const filterSearch = document.getElementById('filter-search');
    const listEl = document.getElementById('lectures-list');
    const emptyEl = document.getElementById('empty-filtered-state');

    const selPeriod = filterPeriod?.value || 'future';
    const selModule = filterModule?.value || '';
    const selTeacher = filterTeacher?.value || '';
    const searchTerm = (filterSearch?.value || '').toLowerCase().trim();

    let visibleCount = 0;

    cards.forEach(card => {
        const module = card.dataset.module || '';
        const teacher1 = card.dataset.teacher1 || '';
        const teacher2 = card.dataset.teacher2 || '';
        const title = (card.dataset.title || '').toLowerCase();
        const isFuture = isFutureLecture(card.dataset.date || '');

        const matchPeriod = selPeriod === 'all' ||
                            (selPeriod === 'future' && isFuture) ||
                            (selPeriod === 'past' && !isFuture);
        const matchModule = !selModule || module === selModule;
        const matchTeacher = !selTeacher || teacher1 === selTeacher || teacher2 === selTeacher;
        const matchSearch = !searchTerm || title.includes(searchTerm) || teacher1.toLowerCase().includes(searchTerm) || teacher2.toLowerCase().includes(searchTerm);

        if (matchPeriod && matchModule && matchTeacher && matchSearch) {
            card.style.display = '';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    reorderLectureCards(selPeriod);

    if (emptyEl && listEl) {
        if (visibleCount === 0 && cards.length > 0) {
            listEl.style.display = 'none';
            emptyEl.classList.remove('hidden');
        } else {
            listEl.style.display = '';
            emptyEl.classList.add('hidden');
        }
    }

    updateLectureFilterCount();
}

function updateLectureFilterCount() {
    const cards = document.querySelectorAll('.lecture-card');
    const visible = Array.from(cards).filter(c => c.style.display !== 'none');

    const filteredEl = document.getElementById('filtered-count');
    const totalEl = document.getElementById('total-count');
    const countEl = document.getElementById('filter-count');
    const clearBtn = document.getElementById('clear-filters-btn');

    if (filteredEl) filteredEl.textContent = visible.length;
    if (totalEl) totalEl.textContent = cards.length;

    const filterPeriod = document.getElementById('filter-period');
    const filterModule = document.getElementById('filter-module');
    const filterTeacher = document.getElementById('filter-teacher');
    const filterSearch = document.getElementById('filter-search');

    // "future" is the default, so it doesn't count as a filter the user set.
    const hasActive = (filterPeriod && filterPeriod.value !== 'future') ||
                      filterModule?.value || filterTeacher?.value || filterSearch?.value;

    if (countEl) countEl.classList.toggle('hidden', !hasActive);
    if (clearBtn) {
        clearBtn.disabled = !hasActive;
        clearBtn.classList.toggle('opacity-50', !hasActive);
        clearBtn.classList.toggle('cursor-not-allowed', !hasActive);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeLectureFilters();
});
