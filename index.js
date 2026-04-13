// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Your code here!



// DOM elements
const stateInput = document.getElementById('state-input');
const fetchBtn = document.getElementById('fetch-alerts');
const alertsDisplay = document.getElementById('alerts-display');
const errorDiv = document.getElementById('error-message');
const loadingSpinner = document.getElementById('loading-spinner');

// Helper to show/hide loading
function showLoading(show) {
  if (loadingSpinner) {
    loadingSpinner.classList.toggle('hidden', !show);
  }
}

// Clear error and hide it
function clearError() {
  errorDiv.textContent = '';
  errorDiv.classList.add('hidden');
}

// Display error message
function showError(message) {
  errorDiv.textContent = message;
  errorDiv.classList.remove('hidden');
}

// Display alerts data (as per test expectations)
function displayAlerts(data) {
  if (!data || !data.features) {
    alertsDisplay.innerHTML = '<p>No alerts found.</p>';
    return;
  }

  const title = data.title || 'Weather Alerts';
  const count = data.features.length;
  const summary = `${title}: ${count}`;

  // Build list of headlines
  let headlinesHtml = '';
  data.features.forEach(feature => {
    const headline = feature.properties?.headline;
    if (headline) {
      headlinesHtml += `<div>${headline}</div>`;  // Use div for simple line breaks
    }
  });

  // Use innerHTML to display summary and headlines (tests expect text content)
  alertsDisplay.innerHTML = `
    <h2>${summary}</h2>
    ${headlinesHtml}
  `;
}

// Fetch weather alerts for given state abbreviation
async function fetchWeatherAlerts(state) {
  const url = weatherApi + state.toUpperCase();

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data;
}

// Main function to handle button click
async function handleFetchAlerts() {
  // Clear previous error and any previous alerts
  clearError();
  alertsDisplay.innerHTML = ''; // clear old data

  const stateAbbr = stateInput.value.trim();

  // Input validation (bonus): two letters only
  if (stateAbbr.length !== 2 || !/^[A-Za-z]{2}$/.test(stateAbbr)) {
    showError('Please enter a valid two-letter state abbreviation (e.g., CA, NY).');
    return;
  }

  // Show loading spinner
  showLoading(true);

  try {
    const alertsData = await fetchWeatherAlerts(stateAbbr);
    displayAlerts(alertsData);
    // Clear input field after successful fetch
    stateInput.value = '';
  } catch (error) {
    console.error(error);
    showError(error.message || 'Failed to fetch weather alerts. Please try again.');
    alertsDisplay.innerHTML = ''; // ensure no stale data
  } finally {
    showLoading(false);
  }
}

// Attach event listener
fetchBtn.addEventListener('click', handleFetchAlerts);

// Optional: allow Enter key in input field
stateInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    handleFetchAlerts();
  }
});