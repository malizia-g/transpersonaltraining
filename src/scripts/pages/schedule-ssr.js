// Schedule page - Filter functionality for pre-rendered events
// Events are now pre-rendered during build, this script only handles filtering

// Function to toggle description expansion (global scope for onclick)
window.toggleDescription = function(cardId) {
    const descElement = document.getElementById(`desc-${cardId}`);
    const textElement = document.getElementById(`text-${cardId}`);
    const iconElement = document.getElementById(`icon-${cardId}`);
    
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

// Initialize filters
function initializeFilters() {
    const cards = document.querySelectorAll('.appointment-card');
    const filterType = document.getElementById('filter-type');
    const filterLocation = document.getElementById('filter-location');
    const clearBtn = document.getElementById('clear-filters-btn');
    const filtersSection = document.getElementById('filters-section');
    
    if (!cards.length) return;
    
    // Show filters section
    if (filtersSection) {
        filtersSection.classList.remove('hidden');
    }
    
    // Collect unique values for filters
    const types = new Set();
    const locations = new Set();
    
    cards.forEach(card => {
        const type = card.dataset.type;
        const location = card.dataset.location;
        
        if (type) types.add(type);
        if (location) locations.add(location);
    });
    
    // Populate filter dropdowns
    if (filterType) {
        types.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            filterType.appendChild(option);
        });
        
        filterType.addEventListener('change', applyFilters);
    }
    
    if (filterLocation) {
        locations.forEach(location => {
            const option = document.createElement('option');
            option.value = location;
            option.textContent = location;
            filterLocation.appendChild(option);
        });
        
        filterLocation.addEventListener('change', applyFilters);
    }
    
    // Clear filters button
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (filterType) filterType.value = '';
            if (filterLocation) filterLocation.value = '';
            applyFilters();
        });
    }
    
    // Initial count
    updateFilterCount();
}

// Apply filters
function applyFilters() {
    const cards = document.querySelectorAll('.appointment-card');
    const filterType = document.getElementById('filter-type');
    const filterLocation = document.getElementById('filter-location');
    const appointmentsList = document.getElementById('appointments-list');
    const emptyFilteredState = document.getElementById('empty-filtered-state');
    
    const selectedType = filterType?.value || '';
    const selectedLocation = filterLocation?.value || '';
    
    let visibleCount = 0;
    
    cards.forEach(card => {
        const cardType = card.dataset.type || '';
        const cardLocation = card.dataset.location || '';
        
        const matchesType = !selectedType || cardType === selectedType;
        const matchesLocation = !selectedLocation || cardLocation === selectedLocation;
        
        if (matchesType && matchesLocation) {
            card.style.display = '';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
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
    const clearBtn = document.getElementById('clear-filters-btn');
    
    if (filteredCount) filteredCount.textContent = visibleCards.length;
    if (totalCount) totalCount.textContent = cards.length;
    
    // Show filter count if filters are active
    const filterType = document.getElementById('filter-type');
    const filterLocation = document.getElementById('filter-location');
    const hasActiveFilters = (filterType?.value || filterLocation?.value);
    
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
