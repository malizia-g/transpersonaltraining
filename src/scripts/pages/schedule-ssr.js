// Schedule page - Filter and sort functionality for pre-rendered events

// Function to toggle description expansion (global scope for onclick)
window.toggleDescription = function(cardId) {
    const descElement = document.getElementById(`desc-${cardId}`);
    const textElement = document.getElementById(`text-${cardId}`);
    const iconElement = document.getElementById(`icon-${cardId}`);
    
    if (!descElement) return;
    
    if (descElement.classList.contains('expanded')) {
        descElement.classList.remove('expanded');
        textElement.textContent = 'Read more';
        iconElement.setAttribute('data-lucide', 'chevron-down');
    } else {
        descElement.classList.add('expanded');
        textElement.textContent = 'Read less';
        iconElement.setAttribute('data-lucide', 'chevron-up');
    }
    lucide.createIcons();
};

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

// Extract year from date string
function extractYear(dateString) {
    if (!dateString) return null;
    const parts = dateString.split('.');
    if (parts.length === 3) {
        return parseInt(parts[2]);
    }
    return null;
}

// Check if event is in the future
function isFutureEvent(dateString) {
    const eventDate = parseDate(dateString);
    if (!eventDate) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return eventDate >= today;
}

// Sort cards by date
function sortCards(cards, ascending = true) {
    return Array.from(cards).sort((a, b) => {
        const dateA = parseDate(a.dataset.date);
        const dateB = parseDate(b.dataset.date);
        
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
        // All events: future first (nearest), then past (most recent)
        const futureCards = [];
        const pastCards = [];
        
        cards.forEach(card => {
            if (isFutureEvent(card.dataset.date)) {
                futureCards.push(card);
            } else {
                pastCards.push(card);
            }
        });
        
        sortedCards = [
            ...sortCards(futureCards, true),
            ...sortCards(pastCards, false)
        ];
    }
    
    // Re-append in new order
    sortedCards.forEach(card => appointmentsList.appendChild(card));
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
    
    // Collect unique values
    const years = new Set();
    const types = new Set();
    const facilitators = new Set();
    const locations = new Set();
    
    cards.forEach(card => {
        const year = extractYear(card.dataset.date);
        if (year) years.add(year);
        
        const type = card.dataset.type;
        if (type) types.add(type);
        
        const facilitator = card.dataset.facilitator;
        if (facilitator) facilitators.add(facilitator);
        
        const location = card.dataset.location;
        if (location) locations.add(location);
    });
    
    // Populate year filter (sorted descending)
    if (filterYear) {
        Array.from(years).sort((a, b) => b - a).forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            filterYear.appendChild(option);
        });
        filterYear.addEventListener('change', applyFilters);
    }
    
    // Populate type filter
    if (filterType) {
        Array.from(types).sort().forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            filterType.appendChild(option);
        });
        filterType.addEventListener('change', applyFilters);
    }
    
    // Populate facilitator filter
    if (filterFacilitator) {
        Array.from(facilitators).sort().forEach(facilitator => {
            const option = document.createElement('option');
            option.value = facilitator;
            option.textContent = facilitator;
            filterFacilitator.appendChild(option);
        });
        filterFacilitator.addEventListener('change', applyFilters);
    }
    
    // Populate location filter
    if (filterLocation) {
        Array.from(locations).sort().forEach(location => {
            const option = document.createElement('option');
            option.value = location;
            option.textContent = location;
            filterLocation.appendChild(option);
        });
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
        const cardType = card.dataset.type || '';
        const cardFacilitator = card.dataset.facilitator || '';
        const cardLocation = card.dataset.location || '';
        const isFuture = isFutureEvent(cardDate);
        
        const matchesPeriod = selectedPeriod === 'all' || 
                            (selectedPeriod === 'future' && isFuture) ||
                            (selectedPeriod === 'past' && !isFuture);
        const matchesYear = !selectedYear || cardYear == selectedYear;
        const matchesType = !selectedType || cardType === selectedType;
        const matchesFacilitator = !selectedFacilitator || cardFacilitator === selectedFacilitator;
        const matchesLocation = !selectedLocation || cardLocation === selectedLocation;
        
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
