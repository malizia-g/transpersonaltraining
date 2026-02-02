// Google Sheets API Configuration
const SPREADSHEET_ID = '1gh7_HExBvqNNVG8q6LMyQ-qBX-IGapSS5Ighbm_GTDk';

// Use Google Apps Script Web App URL for JSON export
const SHEET_JSON_URL = 'https://script.google.com/macros/s/AKfycbwF4y-K0oYh0Fd78xVezCcaGf7Ac5SglXAv0SUzcBJgqeg_kRXaLix3gSad8LAgg6oR/exec';

// Using JSON for precise data parsing
const USE_JSON = true;

// Global variables
let allAppointments = [];
let filteredAppointments = [];

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

// Function to parse date from DD.MM.YYYY format
function parseEuropeanDate(dateString) {
    if (!dateString) return null;
    
    // Handle range format: "29.02.2024 - 03.03.2024"
    let datePart = dateString.split('-')[0].trim();
    
    const parts = datePart.split('.');
    if (parts.length !== 3) return null;
    
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1; // Month is 0-indexed
    const year = parseInt(parts[2]);
    
    return new Date(year, month, day);
}

// Function to format date for display
function formatDate(dateString) {
    if (!dateString) return '';
    
    // Check if it's a range
    if (dateString.includes('-')) {
        const parts = dateString.split('-').map(p => p.trim());
        const startDate = parseEuropeanDate(parts[0]);
        const endDate = parts[1] ? parseEuropeanDate(parts[1]) : null;
        
        if (!startDate) return dateString;
        
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        
        if (endDate && startDate.getTime() !== endDate.getTime()) {
            // Different dates - show range
            const startStr = startDate.toLocaleDateString('en-US', options);
            const endStr = endDate.toLocaleDateString('en-US', options);
            return `${startStr} - ${endStr}`;
        } else {
            // Same date or only start date
            return startDate.toLocaleDateString('en-US', { ...options, weekday: 'long' });
        }
    } else {
        // Single date
        const date = parseEuropeanDate(dateString);
        if (!date) return dateString;
        
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return date.toLocaleDateString('en-US', options);
    }
}

// Function to extract year from date string
function extractYear(dateString) {
    if (!dateString) return null;
    
    // Get first date from range if present
    const datePart = dateString.split('-')[0].trim();
    const parts = datePart.split('.');
    
    if (parts.length === 3) {
        return parseInt(parts[2]);
    }
    return null;
}

// Function to check if an event is in the future
function isFutureEvent(dateString) {
    if (!dateString) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // For date ranges, check the end date
    let checkDate;
    if (dateString.includes('-')) {
        const parts = dateString.split('-').map(p => p.trim());
        const endDateStr = parts[1] || parts[0];
        checkDate = parseEuropeanDate(endDateStr);
    } else {
        checkDate = parseEuropeanDate(dateString);
    }
    
    if (!checkDate) return false;
    
    return checkDate >= today;
}

// Function to get status badge color
function getStatusColor(status) {
    const statusLower = (status || '').toLowerCase();
    if (statusLower.includes('confirmed')) return 'bg-green-100 text-green-800 border-green-200';
    if (statusLower.includes('pending')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (statusLower.includes('cancelled')) return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-blue-100 text-blue-800 border-blue-200';
}

// Function to create appointment card
function createAppointmentCard(appointment) {
    const { date, time, title, description, status, location, type1, type2, facilitator } = appointment;
    
    // Build type display string
    let typeDisplay = '';
    if (type1 && type2) {
        typeDisplay = `${type1}, ${type2}`;
    } else if (type1) {
        typeDisplay = type1;
    } else if (type2) {
        typeDisplay = type2;
    }
    
    const cardId = `card-${Math.random().toString(36).substr(2, 9)}`;
    
    return `
        <div class="appointment-card bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all">
            <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div class="flex-1">
                    <div class="flex items-start gap-4">
                        <div class="flex-shrink-0">
                            <div class="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <i data-lucide="calendar" class="w-8 h-8 text-indigo-600"></i>
                            </div>
                        </div>
                        <div class="flex-1">
                            <h3 class="text-2xl font-serif font-bold text-slate-900 mb-3">${title || 'Training Session'}</h3>
                            <div class="space-y-2 text-slate-600">
                                ${typeDisplay ? `
                                <div class="flex items-center gap-2">
                                    <i data-lucide="tag" class="w-4 h-4"></i>
                                    <span class="font-medium">${typeDisplay}</span>
                                </div>
                                ` : ''}
                                <div class="flex items-center gap-2">
                                    <i data-lucide="calendar-days" class="w-4 h-4"></i>
                                    <span>${formatDate(date)}</span>
                                </div>
                                ${facilitator ? `
                                <div class="flex items-center gap-2">
                                    <i data-lucide="users-round" class="w-4 h-4"></i>
                                    <span>${facilitator}</span>
                                </div>
                                ` : ''}
                                ${location ? `
                                <div class="flex items-center gap-2">
                                    <i data-lucide="map-pin" class="w-4 h-4"></i>
                                    <span>${location}</span>
                                </div>
                                ` : ''}
                            </div>
                            ${description ? `
                            <div class="mt-3">
                                <p class="description-text text-slate-700 leading-relaxed" id="desc-${cardId}">${description}</p>
                                <button class="expand-btn mt-1" onclick="toggleDescription('${cardId}')" id="btn-${cardId}">
                                    <span id="text-${cardId}">Read more</span>
                                    <i data-lucide="chevron-down" class="w-4 h-4" id="icon-${cardId}"></i>
                                </button>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
                ${status ? `
                <div class="flex-shrink-0">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(status)}">
                        ${status}
                    </span>
                </div>
                ` : ''}
            </div>
        </div>
    `;
}

// Function to load appointments from Google Sheets
async function loadAppointments() {
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    const appointmentsList = document.getElementById('appointments-list');
    const emptyState = document.getElementById('empty-state');

    try {
        const response = await fetch(SHEET_JSON_URL);
        
        if (!response.ok) {
            throw new Error('Failed to fetch JSON data');
        }
        
        const data = await response.json();
        
        // Process JSON data
        allAppointments = data.map(row => ({
            date: row.date || '',
            facilitator: row.facilitator || '',
            title: row.title || '',
            description: row.description || '',
            status: row.status || '',
            location: row.location || '',
            type1: row.type1 || '',
            type2: row.type2 || ''
        }));

        // Hide loading, show content
        loadingState.classList.add('hidden');

        if (allAppointments.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            initializeFilters();
            applyFilters();
        }

    } catch (error) {
        console.error('Error loading appointments:', error);
        loadingState.classList.add('hidden');
        errorState.classList.remove('hidden');
    }
}

// Function to extract unique values and populate filter dropdowns
function initializeFilters() {
    const filtersSection = document.getElementById('filters-section');
    const typeFilter = document.getElementById('filter-type');
    const yearFilter = document.getElementById('filter-year');
    const facilitatorFilter = document.getElementById('filter-facilitator');
    const locationFilter = document.getElementById('filter-location');
    
    // Extract unique types from both type1 and type2
    const typesSet = new Set();
    allAppointments.forEach(a => {
        if (a.type1) typesSet.add(a.type1);
        if (a.type2) typesSet.add(a.type2);
    });
    const types = [...typesSet];
    types.sort();
    types.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        typeFilter.appendChild(option);
    });
    
    // Add Future Events option
    const futureOption = document.createElement('option');
    futureOption.value = 'future';
    futureOption.textContent = 'Future Events';
    yearFilter.appendChild(futureOption);
    
    // Add separator
    const separator = document.createElement('option');
    separator.disabled = true;
    separator.textContent = '──────────';
    yearFilter.appendChild(separator);
    
    // Extract unique years from dates
    const years = [...new Set(allAppointments.map(a => extractYear(a.date)).filter(Boolean))];
    years.sort((a, b) => b - a); // Descending order
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    });
    
    // Set Future Events as default
    yearFilter.value = 'future';
    
    // Extract unique facilitators
    const facilitators = [...new Set(allAppointments.map(a => a.facilitator).filter(Boolean))];
    facilitators.sort();
    facilitators.forEach(facilitator => {
        const option = document.createElement('option');
        option.value = facilitator;
        option.textContent = facilitator;
        facilitatorFilter.appendChild(option);
    });
    
    // Extract unique locations
    const locations = [...new Set(allAppointments.map(a => a.location).filter(Boolean))];
    locations.sort();
    locations.forEach(location => {
        const option = document.createElement('option');
        option.value = location;
        option.textContent = location;
        locationFilter.appendChild(option);
    });
    
    // Show filters section
    filtersSection.classList.remove('hidden');
    
    // Add event listeners
    typeFilter.addEventListener('change', applyFilters);
    yearFilter.addEventListener('change', applyFilters);
    facilitatorFilter.addEventListener('change', applyFilters);
    locationFilter.addEventListener('change', applyFilters);
    document.getElementById('clear-filters').addEventListener('click', clearFilters);
    
    // Initialize filter count
    updateFilterCount();
    
    // Re-initialize icons
    lucide.createIcons();
}

// Function to apply filters
function applyFilters() {
    const typeFilter = document.getElementById('filter-type').value;
    const yearFilter = document.getElementById('filter-year').value;
    const facilitatorFilter = document.getElementById('filter-facilitator').value;
    const locationFilter = document.getElementById('filter-location').value;
    
    filteredAppointments = allAppointments.filter(appointment => {
        // Type filter - check if selected type is in type1 OR type2
        if (typeFilter) {
            const hasType = appointment.type1 === typeFilter || appointment.type2 === typeFilter;
            if (!hasType) return false;
        }
        
        // Year filter
        if (yearFilter) {
            if (yearFilter === 'future') {
                // Show only future events
                if (!isFutureEvent(appointment.date)) return false;
            } else {
                // Show events from specific year
                const year = extractYear(appointment.date);
                if (!year || year !== parseInt(yearFilter)) return false;
            }
        }
        
        // Facilitator filter
        if (facilitatorFilter && appointment.facilitator !== facilitatorFilter) return false;
        
        // Location filter
        if (locationFilter && appointment.location !== locationFilter) return false;
        
        return true;
    });
    
    // Sort filtered appointments by date
    filteredAppointments.sort((a, b) => {
        const dateA = parseEuropeanDate(a.date);
        const dateB = parseEuropeanDate(b.date);
        
        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;
        
        // For future events, show closest first (ascending)
        if (yearFilter === 'future') {
            return dateA.getTime() - dateB.getTime();
        }
        // For past/specific years, show newest first (descending)
        return dateB.getTime() - dateA.getTime();
    });
    
    displayAppointments(filteredAppointments);
    updateFilterCount();
}

// Function to clear all filters
function clearFilters() {
    document.getElementById('filter-type').value = '';
    document.getElementById('filter-year').value = 'future'; // Reset to future events
    document.getElementById('filter-facilitator').value = '';
    document.getElementById('filter-location').value = '';
    
    applyFilters(); // Use applyFilters to properly handle future events
}

// Function to display appointments
function displayAppointments(appointments) {
    const appointmentsList = document.getElementById('appointments-list');
    const emptyState = document.getElementById('empty-state');
    
    if (appointments.length === 0) {
        appointmentsList.classList.add('hidden');
        emptyState.classList.remove('hidden');
    } else {
        appointmentsList.innerHTML = appointments.map(createAppointmentCard).join('');
        appointmentsList.classList.remove('hidden');
        emptyState.classList.add('hidden');
        // Re-initialize icons for dynamically added content
        lucide.createIcons();
    }
}

// Function to update filter count display
function updateFilterCount() {
    const filterCountDiv = document.getElementById('filter-count');
    const filteredCountSpan = document.getElementById('filtered-count');
    const totalCountSpan = document.getElementById('total-count');
    
    const typeFilter = document.getElementById('filter-type').value;
    const yearFilter = document.getElementById('filter-year').value;
    const facilitatorFilter = document.getElementById('filter-facilitator').value;
    const locationFilter = document.getElementById('filter-location').value;
    
    const hasActiveFilters = typeFilter || yearFilter || facilitatorFilter || locationFilter;
    
    if (hasActiveFilters) {
        filterCountDiv.classList.remove('hidden');
        filteredCountSpan.textContent = filteredAppointments.length;
        totalCountSpan.textContent = allAppointments.length;
    } else {
        filterCountDiv.classList.add('hidden');
    }
}

// Load appointments on page load
document.addEventListener('DOMContentLoaded', loadAppointments);
