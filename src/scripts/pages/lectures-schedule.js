// Lectures schedule - Filter functionality and inline video

// Toggle description expand/collapse
window.toggleLectureDescription = function(cardId) {
    const descEl = document.getElementById(`ldesc-${cardId}`);
    const textEl = document.getElementById(`ltext-${cardId}`);
    const iconEl = document.getElementById(`licon-${cardId}`);
    if (!descEl) return;

    const isExpanded = descEl.dataset.expanded === 'true';

    if (isExpanded) {
        descEl.style.maxHeight = '3.6em';
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

// Filter logic
function initializeLectureFilters() {
    const cards = document.querySelectorAll('.lecture-card');
    const filterModule = document.getElementById('filter-module');
    const filterTeacher = document.getElementById('filter-teacher');
    const filterSearch = document.getElementById('filter-search');
    const clearBtn = document.getElementById('clear-filters-btn');

    if (!cards.length) return;

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
    const filterModule = document.getElementById('filter-module');
    const filterTeacher = document.getElementById('filter-teacher');
    const filterSearch = document.getElementById('filter-search');
    const listEl = document.getElementById('lectures-list');
    const emptyEl = document.getElementById('empty-filtered-state');

    const selModule = filterModule?.value || '';
    const selTeacher = filterTeacher?.value || '';
    const searchTerm = (filterSearch?.value || '').toLowerCase().trim();

    let visibleCount = 0;

    cards.forEach(card => {
        const module = card.dataset.module || '';
        const teacher1 = card.dataset.teacher1 || '';
        const teacher2 = card.dataset.teacher2 || '';
        const title = (card.dataset.title || '').toLowerCase();

        const matchModule = !selModule || module === selModule;
        const matchTeacher = !selTeacher || teacher1 === selTeacher || teacher2 === selTeacher;
        const matchSearch = !searchTerm || title.includes(searchTerm) || teacher1.toLowerCase().includes(searchTerm) || teacher2.toLowerCase().includes(searchTerm);

        if (matchModule && matchTeacher && matchSearch) {
            card.style.display = '';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

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

    const filterModule = document.getElementById('filter-module');
    const filterTeacher = document.getElementById('filter-teacher');
    const filterSearch = document.getElementById('filter-search');

    const hasActive = filterModule?.value || filterTeacher?.value || filterSearch?.value;

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
