// Schedule page - Filter and sort functionality for pre-rendered events

// Parse European date (DD.MM.YYYY)
function parseDate(dateString) {
    if (!dateString) return null;
    
    // Handle range: take end date for sorting
    let datePart = dateString.split('-').pop().trim();
    
    const parts = datePart.split('.');
    if (parts.length !== 3) return null;
    
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1;
    const year = parseInt(parts[2]);
    
    return new Date(year, month, day);
}

// Extract year from date string. Falls back to any four-digit year in the
// text, so an event dated "August 2026" still answers the year filter instead
// of vanishing from every one of its options.
function extractYear(dateString) {
    if (!dateString) return null;
    const firstDate = dateString.split('-')[0].trim();
    const parts = firstDate.split('.');
    if (parts.length === 3) {
        return parseInt(parts[2]);
    }
    const loose = dateString.match(/\b(20\d{2})\b/);
    return loose ? parseInt(loose[1]) : null;
}

const MONTH_NAMES = ['january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'];

// A date the parser can't read still tends to say roughly when: "August 2026",
// "Spring 2027". Read a month and a year out of the words so the event sorts
// near where it belongs. The span runs to the end of what was named, so an
// event given as September stays ahead of today for all of September.
function parseIndicativeSpan(dateString) {
    const text = (dateString || '').toLowerCase();
    const yearMatch = text.match(/\b(20\d{2})\b/);
    if (!yearMatch) return null;

    const year = parseInt(yearMatch[1]);
    const month = MONTH_NAMES.findIndex(name => text.includes(name.slice(0, 3)));

    return month >= 0
        ? { start: new Date(year, month, 1), end: new Date(year, month + 1, 0) }
        : { start: new Date(year, 0, 1), end: new Date(year, 11, 31) };
}

// Three answers, not two. An event with no date, or one too vague to pin to a
// year, hasn't happened yet — answering "not future" filed it under Past, the
// one list nobody reads to find out what's coming.
function eventPeriod(dateString) {
    const raw = (dateString || '').trim();
    if (!raw) return 'undated';

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const exact = parseDate(raw);
    if (exact) return exact >= today ? 'future' : 'past';

    const span = parseIndicativeSpan(raw);
    if (!span) return 'undated';
    return span.end >= today ? 'future' : 'past';
}

// Where a card sits in the list: an exact date by its own day, an indicative
// one by the start of the span it names, and an undated one nowhere.
function eventSortKey(dateString) {
    const raw = (dateString || '').trim();
    if (!raw) return null;
    const exact = parseDate(raw);
    if (exact) return exact;
    const span = parseIndicativeSpan(raw);
    return span ? span.start : null;
}

// Sort cards by date
function sortCards(cards, ascending = true) {
    return Array.from(cards).sort((a, b) => {
        const dateA = eventSortKey(a.dataset.date);
        const dateB = eventSortKey(b.dataset.date);
        
        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;
        
        return ascending ? dateA - dateB : dateB - dateA;
    });
}

// Reorder cards in DOM
function reorderCards(period) {
    const appointmentsList = document.getElementById('appointments-list');
    const cards = appointmentsList.querySelectorAll('.appointment-card');
    
    let sortedCards;
    if (period === 'future') {
        // Future events: nearest first
        sortedCards = sortCards(cards, true);
    } else if (period === 'past') {
        // Past events: most recent first
        sortedCards = sortCards(cards, false);
    } else {
        // All events: newest first, one run of years like the archive it is.
        // (Future-then-past would print the current year's heading twice.)
        sortedCards = sortCards(cards, false);
    }
    
    // Re-append in new order
    sortedCards.forEach(card => appointmentsList.appendChild(card));

    placeYearHeadings(appointmentsList, sortedCards);
}

// One heading per year above the visible rows. The list is pre-rendered with
// them (so the archive reads properly without JavaScript); after every filter
// or reorder they are thrown away and drawn again in front of the first
// visible row of each year.
function placeYearHeadings(listEl, sortedCards) {
    listEl.querySelectorAll('.year-heading').forEach(el => el.remove());
    let current = null;
    sortedCards.forEach(card => {
        if (card.style.display === 'none') return;
        const year = extractYear(card.dataset.date) || 'Date to be defined';
        if (year === current) return;
        current = year;
        const li = document.createElement('li');
        li.className = 'year-heading pt-10 pb-3 border-b border-[color:var(--c-line)]';
        const h = document.createElement('h2');
        h.className = 'p4-display text-2xl md:text-3xl font-medium text-[color:var(--c-heading)]';
        h.textContent = year;
        li.appendChild(h);
        listEl.insertBefore(li, card);
    });
}

// Initialize filters
function initializeFilters() {
    const cards = document.querySelectorAll('.appointment-card');
    const filterPeriod = document.getElementById('filter-period');
    const filterYear = document.getElementById('filter-year');
    const filterType = document.getElementById('filter-type');
    const filterFacilitator = document.getElementById('filter-facilitator');
    const filterLocation = document.getElementById('filter-location');
    const clearBtn = document.getElementById('clear-filters-btn') || document.getElementById('clear-filters');
    
    if (!cards.length) return;

    if (filterYear) {
        filterYear.addEventListener('change', applyFilters);
    }

    if (filterType) {
        filterType.addEventListener('change', applyFilters);
    }

    if (filterFacilitator) {
        filterFacilitator.addEventListener('change', applyFilters);
    }

    if (filterLocation) {
        filterLocation.addEventListener('change', applyFilters);
    }
    
    // Period filter
    if (filterPeriod) {
        filterPeriod.addEventListener('change', applyFilters);
    }
    
    // Clear filters button
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (filterPeriod) filterPeriod.value = 'future';
            if (filterYear) filterYear.value = '';
            if (filterType) filterType.value = '';
            if (filterFacilitator) filterFacilitator.value = '';
            if (filterLocation) filterLocation.value = '';
            applyFilters();
        });
    }
    
    // ?period=all (or past, tbd) — used by the "all seminars" links on the
    // seminar pages, which arrive wanting the whole archive.
    const wanted = new URLSearchParams(window.location.search).get('period');
    if (filterPeriod && wanted && [...filterPeriod.options].some(o => o.value === wanted)) {
        filterPeriod.value = wanted;
    }

    // Apply initial filters (future events by default)
    applyFilters();
}

// Apply filters
function applyFilters() {
    const cards = document.querySelectorAll('.appointment-card');
    const filterPeriod = document.getElementById('filter-period');
    const filterYear = document.getElementById('filter-year');
    const filterType = document.getElementById('filter-type');
    const filterFacilitator = document.getElementById('filter-facilitator');
    const filterLocation = document.getElementById('filter-location');
    const appointmentsList = document.getElementById('appointments-list');
    const emptyFilteredState = document.getElementById('empty-filtered-state');
    
    const selectedPeriod = filterPeriod?.value || 'future';
    const selectedYear = filterYear?.value || '';
    const selectedType = filterType?.value || '';
    const selectedFacilitator = filterFacilitator?.value || '';
    const selectedLocation = filterLocation?.value || '';
    
    let visibleCount = 0;
    
    cards.forEach(card => {
        const cardDate = card.dataset.date || '';
        const cardYear = extractYear(cardDate);
        const cardType1 = card.dataset.type1 || '';
        const cardType2 = card.dataset.type2 || '';
        const cardPeople = card.dataset.people || '';
        const cardPlace = card.dataset.place || '';
        const period = eventPeriod(cardDate);
        
        const matchesPeriod = selectedPeriod === 'all' || 
                            (selectedPeriod === 'future' && period !== 'past') ||
                            (selectedPeriod === 'past' && period === 'past') ||
                            (selectedPeriod === 'tbd' && period === 'undated');
        const matchesYear = !selectedYear || cardYear == selectedYear;
        const matchesType = !selectedType || cardType1 === selectedType || cardType2 === selectedType;
        // data-people is "|kati-wortelkamp|lyudmila-skartsesku|": one person per
        // option, however many share the seminar.
        const matchesFacilitator = !selectedFacilitator || cardPeople.includes('|' + selectedFacilitator + '|');
        const matchesLocation = !selectedLocation || cardPlace === selectedLocation;
        
        if (matchesPeriod && matchesYear && matchesType && matchesFacilitator && matchesLocation) {
            card.style.display = '';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Reorder based on period
    reorderCards(selectedPeriod);
    
    // Show/hide empty state
    if (emptyFilteredState && appointmentsList) {
        if (visibleCount === 0 && cards.length > 0) {
            appointmentsList.style.display = 'none';
            emptyFilteredState.classList.remove('hidden');
        } else {
            appointmentsList.style.display = '';
            emptyFilteredState.classList.add('hidden');
        }
    }
    
    updateFilterCount();
}

// Update filter count display
function updateFilterCount() {
    const cards = document.querySelectorAll('.appointment-card');
    const visibleCards = Array.from(cards).filter(card => card.style.display !== 'none');
    
    const filteredCount = document.getElementById('filtered-count');
    const totalCount = document.getElementById('total-count');
    const filterCount = document.getElementById('filter-count');
    const clearBtn = document.getElementById('clear-filters-btn') || document.getElementById('clear-filters');
    
    if (filteredCount) filteredCount.textContent = visibleCards.length;
    if (totalCount) totalCount.textContent = cards.length;
    
    // Check if any filters are active (excluding default future)
    const filterPeriod = document.getElementById('filter-period');
    const filterYear = document.getElementById('filter-year');
    const filterType = document.getElementById('filter-type');
    const filterFacilitator = document.getElementById('filter-facilitator');
    const filterLocation = document.getElementById('filter-location');
    
    const hasActiveFilters = (filterPeriod?.value !== 'future') ||
                            filterYear?.value ||
                            filterType?.value ||
                            filterFacilitator?.value ||
                            filterLocation?.value;
    
    if (filterCount) {
        filterCount.classList.toggle('hidden', !hasActiveFilters);
    }
    
    if (clearBtn) {
        clearBtn.disabled = !hasActiveFilters;
        clearBtn.classList.toggle('opacity-50', !hasActiveFilters);
        clearBtn.classList.toggle('cursor-not-allowed', !hasActiveFilters);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeFilters();
});
